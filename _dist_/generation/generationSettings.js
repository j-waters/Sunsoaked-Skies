export default class GenerationSettings {
  constructor(mod) {
    if (mod) {
      this.mod = mod;
    } else {
      this.mod = 1;
    }
  }
  get roomSize() {
    return GenerationSettings.ROOM_SIZE * this.mod;
  }
  get roomMargin() {
    return GenerationSettings.ROOM_MARGIN * this.mod;
  }
  get roomSizeMargin() {
    return this.roomSize + this.roomMargin;
  }
  get margin() {
    return GenerationSettings.MARGIN * this.mod;
  }
  get strokeThickness() {
    return GenerationSettings.STROKE_THICKNESS * this.mod;
  }
  get personWidth() {
    return this.personHeight / 2;
  }
  get personHeight() {
    return this.roomSize * 0.7;
  }
  get personRoundingRadius() {
    return this.mod;
  }
  get headConfig() {
    return {width: this.personHeight * 0.25, height: this.personHeight * 0.25, xOffset: 0, yOffset: -this.bodyConfig.height / 2};
  }
  get bodyConfig() {
    let bodyConfig = {width: this.personWidth * 0.7, height: this.personHeight * 0.5, xOffset: void 0, yOffset: this.personHeight * 0.24};
    bodyConfig.xOffset = (this.personWidth - bodyConfig.width) / 2;
    return bodyConfig;
  }
  get armConfig() {
    return {
      width: this.bodyConfig.width * 0.25 + this.personRoundingRadius,
      height: this.bodyConfig.height * 0.7,
      xOffset: this.bodyConfig.width / 2,
      yOffset: -this.bodyConfig.height / 2
    };
  }
  get legConfig() {
    let legConfig = {
      width: this.bodyConfig.width * 0.4,
      height: this.personHeight * 0.25,
      xOffset: void 0,
      yOffset: this.bodyConfig.height / 2 - this.personRoundingRadius
    };
    legConfig.xOffset = Math.round(this.bodyConfig.width / 2 - legConfig.width / 2);
    return legConfig;
  }
}
GenerationSettings.ROOM_SIZE = 100;
GenerationSettings.ROOM_MARGIN = 10;
GenerationSettings.MARGIN = 20;
GenerationSettings.STROKE_THICKNESS = 4;
