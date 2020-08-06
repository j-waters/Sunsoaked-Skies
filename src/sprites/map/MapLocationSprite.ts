import type { Location } from '../../models/Location';
import type WorldMap from '../../scenes/WorldMap';
import OutlinePipeline from '../../shaders/OutlinePipeline';
import Scene = Phaser.Scene;
import Color = Phaser.Display.Color;

export default class MapLocationSprite extends Phaser.GameObjects.Image {
	static readonly OUTLINE_NORMAL = 'OUTLINE_NORMAL';
	static readonly OUTLINE_HOVERED = 'OUTLINE_HOVERED';
	location: Location;
	private parent: WorldMap;

	constructor(parent: WorldMap, location: Location) {
		super(parent, 0, 0, location.icon);
		this.location = location;
		this.parent = parent;

		let mod = parent.mapSize / parent.world.size;
		this.setDisplaySize(16 * mod, 16 * mod);
		this.setPosition(this.location.position.x * mod, this.location.position.y * mod);
		this.setTint(Phaser.Display.Color.ValueToColor('rgb(186,96,71)').color);
		this.setNormalOutline();
		this.setInteractive();

		this.on(Phaser.Input.Events.POINTER_OVER, (pointer, x, y, event) => {
			this.setHoverOutline();
		});

		this.on(Phaser.Input.Events.POINTER_OUT, () => {
			this.setNormalOutline();
		});
	}

	setNormalOutline() {
		this.setPipeline(MapLocationSprite.OUTLINE_NORMAL);
		this.pipeline.setFloat2('uTextureSize', this.texture.getSourceImage().width, this.texture.getSourceImage().height);
	}

	setHoverOutline() {
		this.setPipeline(MapLocationSprite.OUTLINE_HOVERED);
		this.pipeline.setFloat2('uTextureSize', this.texture.getSourceImage().width, this.texture.getSourceImage().height);
	}

	get icon() {
		return 'map/ruin';
	}

	static setupPipelines(scene: Scene) {
		if (scene.game.renderer instanceof Phaser.Renderer.WebGL.WebGLRenderer) {
			scene.game.renderer.addPipeline(this.OUTLINE_NORMAL, new OutlinePipeline(scene.game, Color.ValueToColor('rgb(255, 255, 0)'), 5));
			scene.game.renderer.addPipeline(this.OUTLINE_HOVERED, new OutlinePipeline(scene.game, Color.ValueToColor('rgb(255,200,0)'), 15));
		}
	}
}
