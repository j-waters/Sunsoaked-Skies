import{SceneBase as f}from"./SceneBase.js";import{generateMenuShip as g}from"../generation/generateShip.js";import{generatePersonGraphic as h}from"../generation/generatePerson.js";import i from"../models/Person.js";import{createBackground as j}from"../generation/generateBackground.js";import k from"../generation/generationSettings.js";export class Menu extends f{constructor(){super("Menu")}preload(){}create(){console.log("GAME WIDTH HEIGHT",this.gameWidth,this.gameHeight,this.gameWidth),j(this);let c=this.add.image(0,0,"gradient_background");c.setOrigin(0,0),this.backgroundShips=this.add.group(),this.createBackgroundShips();let d=this.add.image(this.gameWidth/2,this.gameHeight,"menu/hill");d.setOrigin(.5,1),d.setDisplaySize(this.gameWidth*.6,this.gameHeight*.15);let a=h(new i(),new k());a.onload=()=>{this.textures.addImage("menu_person",a);let b=this.add.image(this.gameWidth/2,this.gameHeight*.9,"menu_person");b.setOrigin(.5,1),b.setDisplaySize(this.gameWidth*.05,this.gameWidth*.05/b.displayWidth*b.displayHeight)}}update(c,d){this.backgroundShips.getChildren().forEach(a=>{a.x+=a.getData("speed"),a.x+a.displayWidth<0&&(a.setData("speed",Math.abs(a.getData("speed"))),a.setFlipX(!1),a.setY(Phaser.Math.FloatBetween(0,this.gameHeight))),a.x-a.displayWidth>this.gameWidth&&(a.setData("speed",-Math.abs(a.getData("speed"))),a.setFlipX(!0),a.setY(Phaser.Math.FloatBetween(0,this.gameHeight)))})}createBackgroundShips(){this.backgroundShips.clear(!0,!0);for(let c=0;c<25;c++){let d=this.textures.addCanvas(null,g(),!0),a=this.add.image(Phaser.Math.FloatBetween(-200,this.gameWidth+200),Phaser.Math.FloatBetween(0,this.gameHeight),d);const b=Phaser.Math.Between(0,1)==0,e=Phaser.Math.FloatBetween(.5,1.5);a.setDisplaySize(30*e,30*e),a.setFlipX(b),a.setData("speed",.5*Phaser.Math.FloatBetween(.2,.6)*e*(b?-1:1)),this.backgroundShips.add(a)}}}
