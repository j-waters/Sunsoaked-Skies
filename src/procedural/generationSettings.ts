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
}
