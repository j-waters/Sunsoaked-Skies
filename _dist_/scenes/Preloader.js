import{SceneBase as a}from"./SceneBase.js";import b from"../loaders/WebFontFile.js";import c from"../states/NewGameState.js";export class Preloader extends a{constructor(){super(Preloader.key)}preload(){this.load.image("menu/hill","assets/images/menu/hill.png"),this.load.svg("ui/compass","assets/images/ui/compass.svg",{width:512,height:512}),this.load.svg("map/ruin","assets/images/map/ruin.svg",{width:512,height:512}),this.load.svg("map/village","assets/images/map/village.svg",{width:512,height:512}),this.load.svg("map/move-target","assets/images/map/move-target.svg",{width:512,height:512}),this.load.addFile(new b(this.load,["Artifika"]))}create(){this.state.start(c)}}Preloader.key="Preloader";
