import i from"../PersonSprite.js";import{MoveTask as j}from"../../models/Task.js";var k=Phaser.Math.Vector2,l=Phaser.GameObjects.Rectangle;import m from"../../../web_modules/dat.gui.js";export default class q extends i{constructor(a,b,d){super(a,b,d);this.parent=a,this.setInteractive({useHandCursor:!0},Phaser.Geom.Rectangle.Contains),this.on(Phaser.Input.Events.POINTER_DOWN,(e,f,g,c)=>{this.parent.select(this),c.stopPropagation(),console.log("Clicked:",this)}),this.debugGui=new m.GUI(),this.debugGui.add(this.person.roomPosition,"x"),this.debugGui.hide()}incrementMovement(a,b){if(a.isComplete)return;b==void 0&&(b=3);let d=a.currentTarget.room,e=this.parent.getRoomSprite(d),f=e.personWorldPosition(a.currentTarget.position),g=new k(this.x,this.bottom),c=g.subtract(f).negate(),h=c.length();h>b&&c.setLength(b),this.setPosition(this.x+c.x,this.y+c.y),h<b&&(a.completeStep(),this.incrementMovement(a,c.length()))}update(a,b){this.tasks.current instanceof j&&this.incrementMovement(this.tasks.current)}get roomSprite(){return this.parent.getRoomSprite(this.room)}get room(){return this.person.room}moveToPosition(){let a=this.roomSprite.personWorldPosition(this.person.roomPosition);this.setPosition(a.x,a.y-this.compHeight/2)}get selected(){return this.parent.selected===this}select(){this.highlightBox.setStrokeStyle(this.highlightBox.lineWidth,16755200),this.highlightBox.setVisible(!0),this.debugGui.show()}deselect(){this.highlightBox.setVisible(!1),this.debugGui.hide()}setupHover(){let a=this.generationSettings.strokeThickness/2;this.highlightBox=new l(this.scene,0,0,this.compWidth,this.compHeight),this.highlightBox.setVisible(!1),this.add(this.highlightBox),this.on(Phaser.Input.Events.POINTER_OVER,b=>{this.highlightBox.setStrokeStyle(a,16776960),this.highlightBox.setVisible(!0)}),this.on(Phaser.Input.Events.POINTER_OUT,b=>{this.selected?this.highlightBox.setStrokeStyle(this.highlightBox.lineWidth,16755200):this.highlightBox.setVisible(!1)})}setForward(){super.setForward(),this.setupHover()}}