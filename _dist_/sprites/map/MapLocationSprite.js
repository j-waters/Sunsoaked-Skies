import OutlinePipeline2 from "../../shaders/OutlinePipeline.js";
var Scene = Phaser.Scene;
var Color = Phaser.Display.Color;
export default class MapLocationSprite extends Phaser.GameObjects.Image {
  constructor(parent, location) {
    super(parent, 0, 0, null);
    this.location = location;
    this.parent = parent;
    this.setTexture(this.icon);
    let mod = parent.mapSize / parent.world.size;
    this.setDisplaySize(16 * mod, 16 * mod);
    this.setPosition(this.location.position.x * mod, this.location.position.y * mod);
    this.setTint(Phaser.Display.Color.ValueToColor("rgb(186,96,71)").color);
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
    this.pipeline.setFloat2("uTextureSize", this.texture.getSourceImage().width, this.texture.getSourceImage().height);
  }
  setHoverOutline() {
    this.setPipeline(MapLocationSprite.OUTLINE_HOVERED);
    this.pipeline.setFloat2("uTextureSize", this.texture.getSourceImage().width, this.texture.getSourceImage().height);
  }
  get icon() {
    return "map/ruin";
  }
  static setupPipelines(scene) {
    if (scene.game.renderer instanceof Phaser.Renderer.WebGL.WebGLRenderer) {
      scene.game.renderer.addPipeline(this.OUTLINE_NORMAL, new OutlinePipeline2(scene.game, Color.ValueToColor("rgb(255, 255, 0)"), 5));
      scene.game.renderer.addPipeline(this.OUTLINE_HOVERED, new OutlinePipeline2(scene.game, Color.ValueToColor("rgb(255,200,0)"), 15));
    }
  }
}
MapLocationSprite.OUTLINE_NORMAL = "OUTLINE_NORMAL";
MapLocationSprite.OUTLINE_HOVERED = "OUTLINE_HOVERED";
