export default class GenerationSettings {
	private static readonly ROOM_SIZE = 100;
	private static readonly ROOM_MARGIN = 10;
	private static readonly MARGIN = 20;
	private static readonly STROKE_THICKNESS = 4;

	private readonly mod;

	constructor(mod?: number) {
		if (mod) {
			this.mod = mod;
		} else {
			this.mod = 1;
		}
	}

	public get roomSize() {
		return GenerationSettings.ROOM_SIZE * this.mod;
	}

	public get roomMargin() {
		return GenerationSettings.ROOM_MARGIN * this.mod;
	}

	public get roomSizeMargin() {
		return this.roomSize + this.roomMargin;
	}

	public get margin() {
		return GenerationSettings.MARGIN * this.mod;
	}

	public get strokeThickness() {
		return GenerationSettings.STROKE_THICKNESS * this.mod;
	}

	public get personWidth() {
		return this.personHeight / 2;
	}

	public get personHeight() {
		return this.roomSize * 0.7;
	}

	public get personRoundingRadius() {
		return this.mod;
	}

	public get headConfig() {
		return { width: this.personHeight * 0.25, height: this.personHeight * 0.25, xOffset: 0, yOffset: -this.bodyConfig.height / 2 };
	}

	public get bodyConfig() {
		const bodyConfig = { width: this.personWidth * 0.7, height: this.personHeight * 0.5, xOffset: undefined, yOffset: this.personHeight * 0.24 };
		bodyConfig.xOffset = (this.personWidth - bodyConfig.width) / 2;
		return bodyConfig;
	}

	public get armConfig() {
		return {
			width: this.bodyConfig.width * 0.25 + this.personRoundingRadius,
			height: this.bodyConfig.height * 0.7,
			xOffset: this.bodyConfig.width / 2,
			yOffset: -this.bodyConfig.height / 2,
		};
	}

	public get legConfig() {
		const legConfig = {
			width: this.bodyConfig.width * 0.4,
			height: this.personHeight * 0.25,
			xOffset: undefined, //this.bodyConfig.xOffset,
			yOffset: this.bodyConfig.height / 2 - this.personRoundingRadius, //this.bodyConfig.yOffset + this.bodyConfig.height - this.personRoundingRadius,
		};
		legConfig.xOffset = Math.round(this.bodyConfig.width / 2 - legConfig.width / 2);
		return legConfig;
	}
}
