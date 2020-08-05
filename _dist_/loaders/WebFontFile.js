import "../../web_modules/phaser.js";
import WebFont from "../../web_modules/webfontloader.js";
export default class WebFontFile extends Phaser.Loader.File {
  constructor(loader, fontNames) {
    super(loader, {
      type: "webfont",
      key: fontNames.toString()
    });
    this.fontNames = fontNames;
  }
  load() {
    const config = {
      active: () => {
        this.loader.nextFile(this, true);
      },
      custom: {
        families: this.fontNames,
        urls: ["/assets/css/fonts.css"]
      }
    };
    console.log(WebFont);
    WebFont.load(config);
  }
}
