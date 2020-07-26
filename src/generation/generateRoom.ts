import type Room from '../models/Room';
import type GenerationSettings from './generationSettings';

export function generateRoomBackground(room: Room, generationSettings: GenerationSettings) {
	let canvas = document.createElement('canvas');

	let width = generationSettings.roomSizeMargin * room.width - generationSettings.roomMargin;
	let height = generationSettings.roomSizeMargin * room.height - generationSettings.roomMargin;
	canvas.width = width;
	canvas.height = height;
	let context = canvas.getContext('2d');

	context.lineWidth = generationSettings.strokeThickness;
	context.lineJoin = 'bevel';
	context.strokeStyle = '#6b4a31';
	context.fillStyle = '#ecb07f';

	context.rect(0, 0, width, height);
	if (room.inside) {
		context.fill();
	}
	context.stroke();

	let text = generateText(room, width, height);
	context.drawImage(text, 0, 0);

	context.fillStyle = 'black';

	const doorThickness = generationSettings.strokeThickness / 2;

	room.neighbours.forEach((neighbour) => {
		switch (neighbour.direction) {
			case 'UP':
				context.fillRect(neighbour.thisPosition.x * generationSettings.roomSizeMargin, 0, generationSettings.roomSize, doorThickness);
				break;
			case 'DOWN':
				context.fillRect(neighbour.thisPosition.x * generationSettings.roomSizeMargin, height - doorThickness, generationSettings.roomSize, doorThickness);
				break;
			case 'LEFT':
				context.fillRect(0, neighbour.thisPosition.y * generationSettings.roomSizeMargin, doorThickness, generationSettings.roomSize);
				break;
			case 'RIGHT':
				context.fillRect(width - doorThickness, neighbour.thisPosition.y * generationSettings.roomSizeMargin, doorThickness, generationSettings.roomSize);
				break;
		}
	});
	return canvas;
}

function generateText(room: Room, width: number, height: number) {
	let canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	if (room.name === '') {
		return canvas;
	}
	let context = canvas.getContext('2d');
	context.textAlign = 'center';
	context.textBaseline = 'top';

	fitText(context, room.name, 'Artifika', width - 10, height - 10, width / 2, 10);

	return canvas;
}

function fitText(context: CanvasRenderingContext2D, text: string, font: string, width: number, height: number, x: number, y: number) {
	let fontSize = 1;
	let diff = 5;
	while (true) {
		context.font = `${fontSize}px ${font}`;
		let metrics = context.measureText(text);
		fontSize += diff;
		if ((metrics.width < width && diff < 0) || (metrics.width > width && diff > 0)) {
			diff = -diff / 2;
		}
		if (width - metrics.width < 0.3 && width - metrics.width > 0) {
			context.fillText(text, x, y);
			return;
		}
	}
}
