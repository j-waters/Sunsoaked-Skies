import Person from "../models/Person";
import Scene = Phaser.Scene;
import GenerationSettings from "./generationSettings";

export function generatePersonGraphic(person: Person, generationSettings: GenerationSettings): HTMLImageElement {
	let canvas = document.createElement("canvas");
	canvas.width = generationSettings.personWidth;
	canvas.height = generationSettings.personHeight;
	let context = canvas.getContext("2d");

	let head = generateHeadGraphic(person, generationSettings);
	let body = generateBodyGraphic(person, generationSettings);
	let leg1 = generateLegGraphic(person, generationSettings);
	let leg2 = generateLegGraphic(person, generationSettings);
	let arm1 = generateArmGraphic(person, generationSettings);
	let arm2 = generateArmGraphic(person, generationSettings);

	context.drawImage(leg1, generationSettings.legConfig.xOffset, generationSettings.legConfig.yOffset);
	context.drawImage(leg2, generationSettings.personWidth - generationSettings.legConfig.xOffset - generationSettings.legConfig.width, generationSettings.legConfig.yOffset);
	context.drawImage(body, generationSettings.bodyConfig.xOffset, generationSettings.bodyConfig.yOffset);
	context.drawImage(head, generationSettings.headConfig.xOffset, generationSettings.headConfig.yOffset);
	context.drawImage(arm1, generationSettings.armConfig.xOffset, generationSettings.armConfig.yOffset);
	context.drawImage(arm2, generationSettings.personWidth - generationSettings.armConfig.xOffset - generationSettings.armConfig.width, generationSettings.armConfig.yOffset);

	let img = document.createElement("img");
	img.src = canvas.toDataURL();
	return img;
}

export function generateHeadGraphic(person: Person, generationSettings: GenerationSettings) {
	let canvas = document.createElement("canvas");

	canvas.width = generationSettings.headConfig.width;
	canvas.height = generationSettings.headConfig.height;
	let context = canvas.getContext("2d");

	context.strokeStyle = "#000000";
	context.fillStyle = "#ba826b";
	roundedRectangle(context, 0, 0, generationSettings.headConfig.width, generationSettings.headConfig.height, generationSettings.personRoundingRadius);
	context.fill();
	return canvas;
}

export function generateHeadTexture(scene: Scene, person: Person, generationSettings: GenerationSettings) {
	return scene.textures.addCanvas(null, generateHeadGraphic(person, generationSettings), true);
}

export function generateBodyGraphic(person: Person, generationSettings: GenerationSettings) {
	let canvas = document.createElement("canvas");

	canvas.width = generationSettings.bodyConfig.width;
	canvas.height = generationSettings.bodyConfig.height;
	let context = canvas.getContext("2d");

	context.strokeStyle = "#000000";
	context.fillStyle = "#3b2678";
	roundedRectangle(context, 0, 0, generationSettings.bodyConfig.width, generationSettings.bodyConfig.height, generationSettings.personRoundingRadius);
	context.fill();
	return canvas;
}

export function generateBodyTexture(scene: Scene, person: Person, generationSettings: GenerationSettings) {
	return scene.textures.addCanvas(null, generateBodyGraphic(person, generationSettings), true);
}

export function generateLegGraphic(person: Person, generationSettings: GenerationSettings) {
	let canvas = document.createElement("canvas");

	canvas.width = generationSettings.legConfig.width;
	canvas.height = generationSettings.legConfig.height;
	let context = canvas.getContext("2d");

	context.strokeStyle = "#000000";
	context.fillStyle = "#361a0e";
	roundedRectangle(context, 0, 0, generationSettings.legConfig.width, generationSettings.legConfig.height, generationSettings.personRoundingRadius);
	context.fill();
	return canvas;
}

export function generateLegTexture(scene: Scene, person: Person, generationSettings: GenerationSettings) {
	return scene.textures.addCanvas(null, generateLegGraphic(person, generationSettings), true);
}

export function generateArmGraphic(person: Person, generationSettings: GenerationSettings) {
	let canvas = document.createElement("canvas");

	canvas.width = generationSettings.armConfig.width;
	canvas.height = generationSettings.armConfig.height;
	let context = canvas.getContext("2d");

	context.strokeStyle = "#000000";
	context.fillStyle = "#493092";
	roundedRectangle(context, 0, 0, generationSettings.armConfig.width, generationSettings.armConfig.height, generationSettings.personRoundingRadius);
	context.fill();
	return canvas;
}

export function generateArmTexture(scene: Scene, person: Person, generationSettings: GenerationSettings) {
	return scene.textures.addCanvas(null, generateArmGraphic(person, generationSettings), true);
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
