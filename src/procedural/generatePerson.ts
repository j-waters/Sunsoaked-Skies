import Person from "../models/Person";

/*
Segment: 100x200
 */

const frameWidth = 128;
const frameHeight = 256;
const roundingRadius = 5;
const headConfig = { width: frameHeight * 0.25, height: frameHeight * 0.25, xOffset: frameWidth * 0.25, yOffset: 0 };
const bodyConfig = { width: frameWidth * 0.7, height: frameHeight * 0.5, xOffset: undefined, yOffset: frameHeight * 0.24 };
bodyConfig.xOffset = (frameWidth - bodyConfig.width) / 2;
const legConfig = { width: bodyConfig.width * 0.4, height: frameHeight * 0.25, xOffset: bodyConfig.xOffset, yOffset: bodyConfig.yOffset + bodyConfig.height - roundingRadius };
const armConfig = { width: bodyConfig.width * 0.25 + roundingRadius, height: bodyConfig.height * 0.7, xOffset: 0, yOffset: bodyConfig.yOffset };

export function generatePersonGraphic(person: Person): HTMLImageElement {
	let canvas = document.createElement("canvas");
	canvas.width = frameWidth;
	canvas.height = frameHeight;
	let context = canvas.getContext("2d");

	let head = generateHeadGraphic(person);
	let body = generateBodyGraphic(person);
	let leg1 = generateLegGraphic(person);
	let leg2 = generateLegGraphic(person);
	let arm1 = generateArmGraphic(person);
	let arm2 = generateArmGraphic(person);

	context.drawImage(leg1, legConfig.xOffset, legConfig.yOffset);
	context.drawImage(leg2, frameWidth - legConfig.xOffset - legConfig.width, legConfig.yOffset);
	context.drawImage(body, bodyConfig.xOffset, bodyConfig.yOffset);
	context.drawImage(head, headConfig.xOffset, headConfig.yOffset);
	context.drawImage(arm1, armConfig.xOffset, armConfig.yOffset);
	context.drawImage(arm2, frameWidth - armConfig.xOffset - armConfig.width, armConfig.yOffset);

	let img = document.createElement("img");
	img.src = canvas.toDataURL();
	return img;
}

function generateHeadGraphic(person: Person) {
	let canvas = document.createElement("canvas");

	canvas.width = headConfig.width;
	canvas.height = headConfig.height;
	let context = canvas.getContext("2d");

	context.strokeStyle = "#000000";
	context.fillStyle = "#ba826b";
	roundedRectangle(context, 0, 0, headConfig.width, headConfig.height, roundingRadius);
	context.fill();
	return canvas;
}

function generateBodyGraphic(person: Person) {
	let canvas = document.createElement("canvas");

	canvas.width = bodyConfig.width;
	canvas.height = bodyConfig.height;
	let context = canvas.getContext("2d");

	context.strokeStyle = "#000000";
	context.fillStyle = "#3b2678";
	roundedRectangle(context, 0, 0, bodyConfig.width, bodyConfig.height, roundingRadius);
	context.fill();
	return canvas;
}

function generateLegGraphic(person: Person) {
	let canvas = document.createElement("canvas");

	canvas.width = legConfig.width;
	canvas.height = legConfig.height;
	let context = canvas.getContext("2d");

	context.strokeStyle = "#000000";
	context.fillStyle = "#361a0e";
	roundedRectangle(context, 0, 0, legConfig.width, legConfig.height, roundingRadius);
	context.fill();
	return canvas;
}

function generateArmGraphic(person: Person) {
	let canvas = document.createElement("canvas");

	canvas.width = armConfig.width;
	canvas.height = armConfig.height;
	let context = canvas.getContext("2d");

	context.strokeStyle = "#000000";
	context.fillStyle = "#493092";
	roundedRectangle(context, 0, 0, armConfig.width, armConfig.height, roundingRadius);
	context.fill();
	return canvas;
}

function roundedRectangle(context, x, y, width, height, rounded) {
	const radiansInCircle = 2 * Math.PI;
	const halfRadians = (2 * Math.PI) / 2;
	const quarterRadians = (2 * Math.PI) / 4;

	context.beginPath();

	// top left arc
	context.arc(rounded + x, rounded + y, rounded, -quarterRadians, halfRadians, true);

	// line from top left to bottom left
	context.lineTo(x, y + height - rounded);

	// bottom left arc
	context.arc(rounded + x, height - rounded + y, rounded, halfRadians, quarterRadians, true);

	// line from bottom left to bottom right
	context.lineTo(x + width - rounded, y + height);

	// bottom right arc
	context.arc(x + width - rounded, y + height - rounded, rounded, quarterRadians, 0, true);

	// line from bottom right to top right
	context.lineTo(x + width, y + rounded);

	// top right arc
	context.arc(x + width - rounded, y + rounded, rounded, 0, -quarterRadians, true);

	// line from top right to top left
	context.lineTo(x + rounded, y);
}
