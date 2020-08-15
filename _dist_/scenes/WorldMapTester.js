import{SceneBase as c}from"./SceneBase.js";import{generateWorldTexture as b,worldTypes as a}from"../generation/generateWorld.js";import d from"../../web_modules/dat.gui.js";export default class i extends c{create(e){console.log("hello"),this.world=e.world,this.map=this.add.image(0,0,b(this,this.world,512)),this.map.setOrigin(0,0),this.map.setDisplaySize(this.gameHeight,this.gameHeight),this.debugMenu=new d.GUI(),this.debugMenu.add(a[this.world.worldType],"zoom",30,200).onFinishChange(()=>this.reload()),this.debugMenu.add(a[this.world.worldType],"threshold",0,1).onFinishChange(()=>this.reload()),this.debugMenu.add(a[this.world.worldType],"exp",0,5).onFinishChange(()=>this.reload()),this.debugMenu.add(a[this.world.worldType],"gradientZoom",0,5).onFinishChange(()=>this.reload()),this.debugMenu.add(a[this.world.worldType],"elev2proportion",0,1).onFinishChange(()=>this.reload()),this.debugMenu.add(a[this.world.worldType],"elevationMod",0,2).onFinishChange(()=>this.reload()),this.debugMenu.add({reSeed:()=>this.world.seed=Math.random().toString()},"reSeed").onFinishChange(()=>this.reload())}reload(){console.log("refreshing..."),this.map.setTexture(b(this,this.world,512,this.gs)),console.log("done")}}
