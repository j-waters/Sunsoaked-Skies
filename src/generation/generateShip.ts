import type Room from '../models/Room';
import Ship from '../models/Ship';
import GenerationSettings from './generationSettings';
import Empty from '../models/rooms/Empty';
import Color = Phaser.Display.Color;
import RandomDataGenerator = Phaser.Math.RandomDataGenerator;
import Vector2 = Phaser.Math.Vector2;

console.log('');

type roomGrid = Array<Array<Room>>;
type direction = 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM';

export function generateGrid(room: Room, grid?: roomGrid, x?: number, y?: number) {
	let xMod = 0;
	let yMod = 0;

	function addToGrid(value: Room, grid: roomGrid, x, y) {
		for (let yi = y; yi < 0; yi++) {
			grid.unshift([]);
			for (let i = 0; i < grid[1].length; i++) {
				grid[grid.length - 1].push(null);
			}
			yMod += 1;
		}
		for (let xi = x; xi < 0; xi++) {
			for (let i = 0; i <= y; i++) {
				grid[i].unshift(null);
			}
			xMod += 1;
		}
		while (grid.length <= y) {
			grid.push([]);
			for (let i = 0; i < grid[0].length; i++) {
				grid[grid.length - 1].push(null);
			}
		}
		while (grid[0].length <= x) {
			for (let i = 0; i <= y; i++) {
				grid[i].push(null);
			}
		}
		grid[y + yMod][x + xMod] = value;
	}

	if (grid == undefined) {
		grid = [];
		x = 0;
		y = 0;
	}
	for (let yi = y; yi < y + room.height; yi++) {
		for (let xi = x; xi < x + room.width; xi++) {
			addToGrid(room, grid, xi, yi);
		}
	}
	room.neighbours
		.filter((neighbour) => !neighbour.automatic)
		.forEach((neighbour) => {
			switch (neighbour.direction) {
				case 'UP':
					generateGrid(neighbour.room, grid, x + neighbour.thisPosition.x - neighbour.theirPosition.x, y - neighbour.room.height);
					break;
				case 'DOWN':
					generateGrid(neighbour.room, grid, x + neighbour.thisPosition.x - neighbour.theirPosition.x, y + room.height);
					break;
				case 'LEFT':
					generateGrid(neighbour.room, grid, x - neighbour.room.width, y + neighbour.thisPosition.y - neighbour.theirPosition.y);
					break;
				case 'RIGHT':
					generateGrid(neighbour.room, grid, x + room.width, y + neighbour.thisPosition.y - neighbour.theirPosition.y);
					break;
			}
		});
	return grid;
}

export function generateTopDownShipGraphic(ship: Ship): HTMLCanvasElement {
	const canvas = document.createElement('canvas');

	canvas.width = 20;
	canvas.height = 30;
	const context = canvas.getContext('2d');

	context.fillStyle = 'brown';
	context.fillRect(0, 0, 20, 30);

	return canvas;
}

export function generateShipGraphic(ship: Ship, generationSettings): HTMLCanvasElement {
	const hull = generateHullGraphic(ship, generationSettings);
	const balloon = generateBalloonGraphic(ship, generationSettings);

	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	canvas.width = Math.max(hull.width, balloon.width);
	canvas.height = hull.height + balloon.height + 20;

	const balloonLines = generateBalloonLines(hull.width, canvas.height);

	context.drawImage(balloonLines, 0, balloon.height / 2);
	context.drawImage(balloon, 0, 0);
	context.drawImage(hull, 0, balloon.height + 20);

	return canvas;
}

export function generateHullGraphic(ship: Ship, generationSettings: GenerationSettings, seed?: string) {
	const grid = generateGrid(ship.rootRoom);
	const canvas = document.createElement('canvas');

	canvas.width = grid[0].length * generationSettings.roomSizeMargin + generationSettings.margin * 2 + generationSettings.strokeThickness;
	canvas.height = grid.length * generationSettings.roomSizeMargin + generationSettings.margin * 2 + generationSettings.strokeThickness;
	const context = canvas.getContext('2d');

	context.lineWidth = generationSettings.strokeThickness;
	context.lineJoin = 'bevel';
	context.strokeStyle = '#6b4a31';

	const path = generateOutlinePath(grid, generationSettings);
	// context.fill(path);
	context.stroke(path);
	context.clip(path);

	const background = generateBackgroundGraphic(canvas.width, canvas.height, seed); // canvas.width, canvas.height
	context.drawImage(background, 0, 0);

	// grid.forEach((row, yPos) => {
	// 	row.forEach((room, xPos) => {
	// 		if (room != null) {
	// 			context.strokeStyle = room.inside ? "red" : "green";
	// 			let x = xPos * roomSizeMargin + margin + strokeThickness / 2;
	// 			let y = yPos * roomSizeMargin + margin + strokeThickness / 2;
	// 			context.strokeRect(x, y, roomSize, roomSize);
	// 		}
	// 	});
	// });

	return canvas;
}

function generateBackgroundGraphic(width: number, height: number, seed?: string) {
	const canvas = document.createElement('canvas');

	canvas.width = width;
	canvas.height = height;
	const context = canvas.getContext('2d');

	const plankHeight = 15;
	const maxDarken = 20;
	const rnd = new RandomDataGenerator(seed);

	context.strokeStyle = '#6b4a31';
	context.lineWidth = 0.1;

	for (let y = 0; y < height; y += plankHeight) {
		let x = 0;
		while (x < width) {
			const plankWidth = rnd.integerInRange(50, width * 0.5);
			const colour = Color.HexStringToColor('#b27450');

			const darkenAmount = ((y / height) * maxDarken * rnd.realInRange(0.8, 1.5)) / 1.5;
			colour.darken(Math.round(darkenAmount) * 1.5);
			context.fillStyle = colour.rgba;
			context.fillRect(x, y, plankWidth, plankHeight);
			context.strokeRect(x, y, plankWidth, plankHeight);
			x += plankWidth;
		}
	}

	return canvas;
}

function generateBalloonGraphic(ship: Ship, generationSettings: GenerationSettings, seed?: string) {
	const canvas = document.createElement('canvas');
	const grid = generateGrid(ship.rootRoom);

	canvas.width = grid[0].length * generationSettings.roomSizeMargin + generationSettings.margin * 2 + generationSettings.strokeThickness;
	canvas.height = (grid.length * generationSettings.roomSizeMargin + generationSettings.margin * 2 + generationSettings.strokeThickness) / 2;
	const context = canvas.getContext('2d');

	const colour = Color.RandomRGB();
	context.fillStyle = colour.rgba;
	context.strokeStyle = colour.darken(10).rgba;

	context.ellipse(canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2, 0, 0, Math.PI * 2);
	context.stroke();
	context.fill();
	return canvas;
}

function generateBalloonLines(width, height, seed?: string) {
	const canvas = document.createElement('canvas');

	canvas.width = width;
	canvas.height = height / 1.5;

	const context = canvas.getContext('2d');

	const rnd = new RandomDataGenerator(seed);

	for (let i = 0; i < 5; i++) {
		context.beginPath();
		context.moveTo((width / 5) * i + rnd.realInRange(10, 60), 0);
		context.lineTo((width / 5) * i + rnd.realInRange(10, 60), canvas.height);
		context.stroke();
	}
	return canvas;
}

function generateOutlinePath(grid: roomGrid, generationSettings: GenerationSettings) {
	for (let yPos = 0; yPos < grid.length; yPos++) {
		for (let xPos = 0; xPos < grid[0].length; xPos++) {
			if (grid[yPos][xPos] != null && grid[yPos][xPos].inside) {
				const path = new Path2D();
				roomLines(grid, xPos, yPos, true, 'TOP', path, generationSettings);
				path.closePath();
				return path;
			}
		}
	}
}

function roomLines(
	grid: roomGrid,
	xPos: number,
	yPos: number,
	starting: boolean,
	direction: direction,
	path: Path2D,
	generationSettings: GenerationSettings,
	startPoint?: Vector2,
) {
	const room = grid[yPos][xPos];
	const surrounding = surroundingRooms(grid, xPos, yPos, false);

	const topLeft = new Vector2(
		generationSettings.margin + xPos * generationSettings.roomSizeMargin + generationSettings.strokeThickness / 2,
		generationSettings.margin + yPos * generationSettings.roomSizeMargin + generationSettings.strokeThickness / 2,
	);
	const bottomRight = new Vector2(topLeft.x + generationSettings.roomSizeMargin, topLeft.y + generationSettings.roomSizeMargin);

	if (surrounding[0][1] == null || surrounding[0][1].outside) {
		topLeft.y -= generationSettings.margin;
	}
	if (surrounding[1][0] == null) {
		topLeft.x -= generationSettings.margin;
	}
	if (surrounding[0][0] != null && surrounding[1][0] == null) {
		topLeft.y += generationSettings.margin - generationSettings.roomMargin;
	}
	if (surrounding[1][2] == null) {
		bottomRight.x += generationSettings.margin - generationSettings.roomMargin;
	}
	if (surrounding[2][1] == null) {
		bottomRight.y += generationSettings.margin - generationSettings.roomMargin;
	}
	const topRight = new Vector2(bottomRight.x, topLeft.y);
	const bottomLeft = new Vector2(topLeft.x, bottomRight.y);

	if (surrounding[2][0]) {
		bottomLeft.x += generationSettings.margin - generationSettings.roomMargin;
	}
	if (surrounding[0][2]) {
		topRight.x -= generationSettings.margin;
	}
	if (surrounding[2][2]) {
		bottomRight.y -= generationSettings.margin;
	}

	if (starting) {
		path.moveTo(topLeft.x, topLeft.y);
		startPoint = topLeft;
	}

	const pixelMod = 0.333;

	switch (direction) {
		case 'LEFT':
			if (surrounding[1][0] == null || surrounding[1][0].outside) {
				path.lineTo(topLeft.x + pixelMod, topLeft.y + pixelMod);
				if (!starting && startPoint.equals(topLeft)) {
					return;
				}
			}
			if (surrounding[0][0]) {
				roomLines(grid, xPos - 1, yPos - 1, false, 'BOTTOM', path, generationSettings, startPoint);
				return;
			}
			if (surrounding[0][1]) {
				roomLines(grid, xPos, yPos - 1, false, 'LEFT', path, generationSettings, startPoint);
				return;
			}
			roomLines(grid, xPos, yPos, false, 'TOP', path, generationSettings, startPoint);
			return;
		case 'RIGHT':
			if (surrounding[1][2] == null || surrounding[1][2].outside) {
				path.lineTo(bottomRight.x + pixelMod, bottomRight.y + pixelMod);
				if (!starting && startPoint.equals(bottomRight)) {
					return;
				}
			}
			if (surrounding[2][2]) {
				roomLines(grid, xPos + 1, yPos + 1, false, 'TOP', path, generationSettings, startPoint);
				return;
			}
			if (surrounding[2][1]) {
				roomLines(grid, xPos, yPos + 1, false, 'RIGHT', path, generationSettings, startPoint);
				return;
			}
			roomLines(grid, xPos, yPos, false, 'BOTTOM', path, generationSettings, startPoint);
			return;
		case 'TOP':
			if (surrounding[0][1] == null || surrounding[0][1].outside) {
				path.lineTo(topRight.x + pixelMod, topRight.y + pixelMod);
				if (!starting && startPoint.equals(topRight)) {
					return;
				}
			}
			if (surrounding[0][2]) {
				roomLines(grid, xPos + 1, yPos - 1, false, 'LEFT', path, generationSettings, startPoint);
				return;
			}
			if (surrounding[1][2]) {
				roomLines(grid, xPos + 1, yPos, false, 'TOP', path, generationSettings, startPoint);
				return;
			}
			roomLines(grid, xPos, yPos, false, 'RIGHT', path, generationSettings, startPoint);
			return;
		case 'BOTTOM':
			if (surrounding[2][1] == null || surrounding[2][1].outside) {
				if (surrounding[2][0] != null && surrounding[3][1] == null) {
					path.bezierCurveTo(
						bottomRight.x + pixelMod,
						bottomRight.y + pixelMod,
						bottomRight.x + pixelMod,
						bottomRight.y + generationSettings.roomSizeMargin + pixelMod,
						bottomLeft.x + pixelMod,
						bottomLeft.y + generationSettings.roomSizeMargin + pixelMod,
					);
				} else {
					path.lineTo(bottomLeft.x + pixelMod, bottomLeft.y + pixelMod);
					if (!starting && startPoint.equals(bottomLeft)) {
						return;
					}
				}
			}
			if (surrounding[2][0]) {
				roomLines(grid, xPos - 1, yPos + 1, false, 'RIGHT', path, generationSettings, startPoint);
				return;
			}
			if (surrounding[1][0]) {
				roomLines(grid, xPos - 1, yPos, false, 'BOTTOM', path, generationSettings, startPoint);
				return;
			}
			roomLines(grid, xPos, yPos, false, 'LEFT', path, generationSettings, startPoint);
			return;
	}
}

function surroundingRooms(grid: roomGrid, x, y, allowOutside) {
	let surrounding: roomGrid = [
		[null, null, null],
		[null, null, null],
		[null, null, null],
		[null, null, null],
	];

	surrounding[0][0] = x > 0 && y > 0 ? grid[y - 1][x - 1] : null;
	surrounding[0][1] = y > 0 ? grid[y - 1][x] : null;
	surrounding[0][2] = x < grid[0].length - 1 && y > 0 ? grid[y - 1][x + 1] : null;

	surrounding[1][0] = x > 0 ? grid[y][x - 1] : null;
	surrounding[1][1] = grid[y][x];
	surrounding[1][2] = x < grid[0].length - 1 ? grid[y][x + 1] : null;

	surrounding[2][0] = x > 0 && y < grid.length - 1 ? grid[y + 1][x - 1] : null;
	surrounding[2][1] = y < grid.length - 1 ? grid[y + 1][x] : null;
	surrounding[2][2] = x < grid[0].length - 1 && y < grid.length - 1 ? grid[y + 1][x + 1] : null;

	surrounding[3][0] = x > 0 && y < grid.length - 2 ? grid[y + 2][x - 1] : null;
	surrounding[3][1] = y < grid.length - 2 ? grid[y + 2][x] : null;
	surrounding[3][2] = x < grid[0].length - 1 && y < grid.length - 2 ? grid[y + 2][x + 1] : null;

	if (!allowOutside) {
		surrounding = surrounding.map((row) => {
			return row.map((room) => {
				return room && room.inside ? room : null;
			});
		});
	}
	return surrounding;
}

export function generateMenuShip() {
	const shipBuilder = Ship.builder();
	const root = shipBuilder.createRootRoom(new Empty(1, 1));
	root.addRoomDown(new Empty(2, 1)).addRoomDown(new Empty(1, 1));
	return generateShipGraphic(shipBuilder.build(), new GenerationSettings(1));
}
