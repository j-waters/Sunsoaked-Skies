import "../web_modules/phaser.js";
export default {
  type: Phaser.WEBGL,
  parent: "game",
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};
