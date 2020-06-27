import Room from "../models/Room";
import Ship from "../models/Ship";
import Point = Phaser.Geom.Point;
import Color = Phaser.Display.Color;
import RND = Phaser.Math.RND;
import RandomDataGenerator = Phaser.Math.RandomDataGenerator;

type roomGrid = Array<Array<Room>>;
type direction = "LEFT" | "RIGHT" | "TOP" | "BOTTOM";

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
	if (room.upRoom) {
		generateGrid(room.upRoom.room, grid, x + room.upRoom.position, y - room.upRoom.room.height);
	}
	if (room.downRoom) {
		generateGrid(room.downRoom.room, grid, x + room.downRoom.position, y + 1);
	}
	if (room.leftRoom) {
		generateGrid(room.leftRoom.room, grid, x - room.leftRoom.room.width, y + room.leftRoom.position);
	}
	if (room.rightRoom) {
		generateGrid(room.rightRoom.room, grid, x + 1, y + room.rightRoom.position);
	}
	return grid;
}

export function generateShipGraphic(ship: Ship): HTMLCanvasElement {
	let hull = generateHullGraphic(ship);
	let balloon = generateBalloonGraphic(ship);

	let canvas = document.createElement("canvas");
	let context = canvas.getContext("2d");
	canvas.width = Math.max(hull.width, balloon.width);
	canvas.height = hull.height + balloon.height + 20;

	let balloonLines = generateBalloonLines(hull.width, canvas.height);

	context.drawImage(balloonLines, 0, balloon.height / 2);
	context.drawImage(balloon, 0, 0);
	context.drawImage(hull, 0, balloon.height + 20);
	return canvas;
}

const roomSize = 100;
const roomMargin = 10;
const roomSizeMargin = roomSize + roomMargin;
const margin = 20;
const strokeThickness = 2;

export function generateHullGraphic(ship: Ship, seed?: string) {
	let grid = generateGrid(ship.rootRoom);
	let canvas = document.createElement("canvas");

	canvas.width = grid[0].length * roomSizeMargin + margin * 2 + strokeThickness;
	canvas.height = grid.length * roomSizeMargin + margin * 2 + strokeThickness;
	let context = canvas.getContext("2d");

	context.lineWidth = strokeThickness;
	context.lineJoin = "bevel";
	context.strokeStyle = "#6b4a31";

	let path = generateOutlinePath(grid);
	// context.fill(path);
	context.stroke(path);
	context.clip(path);

	let background = generateBackgroundGraphic(512, 512, seed); // canvas.width, canvas.height
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
	let canvas = document.createElement("canvas");

	canvas.width = width;
	canvas.height = height;
	let context = canvas.getContext("2d");

	const plankHeight = 15;
	const maxDarken = 20;
	let rnd = new RandomDataGenerator(seed);

	context.strokeStyle = "#6b4a31";
	context.lineWidth = 0.1;

	for (let y = 0; y < height; y += plankHeight) {
		let x = 0;
		while (x < width) {
			let plankWidth = rnd.integerInRange(50, width * 0.5);
			let colour = Color.HexStringToColor("#b27450");

			let darkenAmount = ((y / height) * maxDarken * rnd.realInRange(0.8, 1.5)) / 1.5;
			colour.darken(Math.round(darkenAmount) * 1.5);
			context.fillStyle = colour.rgba;
			context.fillRect(x, y, plankWidth, plankHeight);
			context.strokeRect(x, y, plankWidth, plankHeight);
			x += plankWidth;
		}
	}

	return canvas;
}

function generateBalloonGraphic(ship: Ship, seed?: string) {
	let canvas = document.createElement("canvas");
	let grid = generateGrid(ship.rootRoom);

	canvas.width = grid[0].length * roomSizeMargin + margin * 2 + strokeThickness;
	canvas.height = (grid.length * roomSizeMargin + margin * 2 + strokeThickness) / 2;
	let context = canvas.getContext("2d");

	let colour = Color.RandomRGB();
	context.fillStyle = colour.rgba;
	context.strokeStyle = colour.darken(10).rgba;

	context.ellipse(canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2, 0, 0, Math.PI * 2);
	context.stroke();
	context.fill();
	return canvas;
}

function generateBalloonLines(width, height, seed?: string) {
	let canvas = document.createElement("canvas");

	canvas.width = width;
	canvas.height = height / 1.5;

	let context = canvas.getContext("2d");

	let rnd = new RandomDataGenerator(seed);

	for (let i = 0; i < 5; i++) {
		context.beginPath();
		context.moveTo((width / 5) * i + rnd.realInRange(10, 60), 0);
		context.lineTo((width / 5) * i + rnd.realInRange(10, 60), canvas.height);
		context.stroke();
	}
	return canvas;
}

function generateOutlinePath(grid: roomGrid) {
	for (let yPos = 0; yPos < grid.length; yPos++) {
		for (let xPos = 0; xPos < grid[0].length; xPos++) {
			if (grid[yPos][xPos] != null && grid[yPos][xPos].inside) {
				let path = new Path2D();
				roomLines(grid, xPos, yPos, true, "TOP", path);
				path.closePath();
				return path;
			}
		}
	}
}

function roomLines(grid: roomGrid, xPos: number, yPos: number, starting: boolean, direction: direction, path: Path2D, startPoint?: Phaser.Geom.Point) {
	let room = grid[yPos][xPos];
	let surrounding = surroundingRooms(grid, xPos, yPos);

	let topLeft = new Point(margin + xPos * roomSizeMargin + strokeThickness / 2, margin + yPos * roomSizeMargin + strokeThickness / 2);
	let bottomRight = new Point(topLeft.x + roomSizeMargin, topLeft.y + roomSizeMargin);

	if (surrounding[0][1] == null || surrounding[0][1].outside) {
		topLeft.y -= margin;
	}
	if (surrounding[1][0] == null) {
		topLeft.x -= margin;
	}
	if (surrounding[1][2] == null) {
		bottomRight.x += margin - roomMargin;
	}
	if (surrounding[2][1] == null) {
		bottomRight.y += margin - roomMargin;
	}
	let topRight = new Point(bottomRight.x, topLeft.y);
	let bottomLeft = new Point(topLeft.x, bottomRight.y);

	if (surrounding[2][0]) {
		bottomLeft.x += margin - roomMargin;
	}
	if (surrounding[0][2]) {
		topRight.x -= margin;
	}
	if (surrounding[2][2]) {
		bottomRight.y -= margin;
	}

	if (starting) {
		path.moveTo(topLeft.x, topLeft.y);
		startPoint = topLeft;
	}

	const pixelMod = 0.333;

	switch (direction) {
		case "LEFT":
			if (surrounding[1][0] == null || surrounding[1][0].outside) {
				path.lineTo(topLeft.x + pixelMod, topLeft.y + pixelMod);
				if (!starting && Point.Equals(startPoint, topLeft)) {
					return;
				}
			}
			if (surrounding[0][0]) {
				roomLines(grid, xPos - 1, yPos - 1, false, "BOTTOM", path, startPoint);
				return;
			}
			if (surrounding[0][1]) {
				roomLines(grid, xPos, yPos - 1, false, "LEFT", path, startPoint);
				return;
			}
			roomLines(grid, xPos, yPos, false, "TOP", path, startPoint);
			return;
		case "RIGHT":
			if (surrounding[1][2] == null || surrounding[1][2].outside) {
				path.lineTo(bottomRight.x + pixelMod, bottomRight.y + pixelMod);
				if (!starting && Point.Equals(startPoint, bottomRight)) {
					return;
				}
			}
			if (surrounding[2][2]) {
				roomLines(grid, xPos + 1, yPos + 1, false, "TOP", path, startPoint);
				return;
			}
			if (surrounding[2][1]) {
				roomLines(grid, xPos, yPos + 1, false, "RIGHT", path, startPoint);
				return;
			}
			roomLines(grid, xPos, yPos, false, "BOTTOM", path, startPoint);
			return;
		case "TOP":
			if (surrounding[0][1] == null || surrounding[0][1].outside) {
				path.lineTo(topRight.x + pixelMod, topRight.y + pixelMod);
				if (!starting && Point.Equals(startPoint, topRight)) {
					return;
				}
			}
			if (surrounding[0][2]) {
				roomLines(grid, xPos + 1, yPos - 1, false, "LEFT", path, startPoint);
				return;
			}
			if (surrounding[1][2]) {
				roomLines(grid, xPos + 1, yPos, false, "TOP", path, startPoint);
				return;
			}
			roomLines(grid, xPos, yPos, false, "RIGHT", path, startPoint);
			return;
		case "BOTTOM":
			if (surrounding[2][1] == null || surrounding[2][1].outside) {
				if (surrounding[2][0] != null && surrounding[3][1] == null) {
					path.bezierCurveTo(
						bottomRight.x + pixelMod,
						bottomRight.y + pixelMod,
						bottomRight.x + pixelMod,
						bottomRight.y + roomSizeMargin + pixelMod,
						bottomLeft.x + pixelMod,
						bottomLeft.y + roomSizeMargin + pixelMod
					);
				} else {
					path.lineTo(bottomLeft.x + pixelMod, bottomLeft.y + pixelMod);
					if (!starting && Point.Equals(startPoint, bottomLeft)) {
						return;
					}
				}
			}
			if (surrounding[2][0]) {
				roomLines(grid, xPos - 1, yPos + 1, false, "RIGHT", path, startPoint);
				return;
			}
			if (surrounding[1][0]) {
				roomLines(grid, xPos - 1, yPos, false, "BOTTOM", path, startPoint);
				return;
			}
			roomLines(grid, xPos, yPos, false, "LEFT", path, startPoint);
			return;
	}
}

function surroundingRooms(grid: roomGrid, x, y) {
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
	return surrounding;
}

export function generateMenuShip() {
	let shipBuilder = Ship.builder();
	let root = shipBuilder.createRootRoom(1, 1);
	root.addRoomDown(new Room(2, 1)).addRoomDown(new Room(1, 1));
	return generateShipGraphic(shipBuilder.build());
}
