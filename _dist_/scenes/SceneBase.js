import{StateManager as a}from"../states/StateManager.js";import b from"../DataStore.js";export class SceneBase extends Phaser.Scene{constructor(c){super(c);this.state=a.create()}get gameWidth(){return this.scale.width}get gameHeight(){return this.scale.height}setView(){this.cameras.main.centerOn(0,0)}get dataStore(){return b.create()}}
