import Room from "../models/Room";
import GenerationSettings from "./generationSettings";

export function generateRoomBackground(room: Room, generationSettings: GenerationSettings) {
	let canvas = document.createElement("canvas");

	let width = generationSettings.roomSizeMargin * room.width - generationSettings.roomMargin;
	let height = generationSettings.roomSizeMargin * room.height - generationSettings.roomMargin;
	canvas.width = width;
	canvas.height = height;
	let context = canvas.getContext("2d");

	context.lineWidth = generationSettings.strokeThickness;
	context.lineJoin = "bevel";
	context.strokeStyle = "#6b4a31";
	context.fillStyle = "#ecb07f";

	context.rect(0, 0, width, height);
	if (room.inside) {
		context.fill();
	}
	context.stroke();
	return canvas;
}
