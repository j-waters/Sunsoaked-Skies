import c from"./Button.js";var d=Phaser.Display.Color;export default class k extends c{constructor(a,e,f,g,b,h){super(a,e,f,g,b.icon);this.parent=a,this.weapon=b,this.num=h;let i=this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);i.on("down",(l,m)=>this.onClick()),this.setOnClick(()=>this.toggle())}toggle(){this.weapon.selected?this.parent.deselect():this.select()}select(){this.parent.select(this),this.weapon.selected=!0;let a=d.ValueToColor("rgb(210,0,49)").color;this.background.setStrokeStyle(this.lineWidth,a),this.icon.setTint(a)}deselect(){this.weapon.selected=!1,this.setNormal()}}