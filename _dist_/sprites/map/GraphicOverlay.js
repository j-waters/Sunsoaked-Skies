var c=Phaser.Scene,d=Phaser.Curves.Curve;export default class e extends Phaser.GameObjects.Graphics{constructor(a){super(a)}drawProspectiveMovement(a){this.lineStyle(1,0,.5),a.draw(this)}drawCurrentMovement(a){let b=1;a.movementProgress>.8&&(b*=(1-a.movementProgress)/.2),this.lineStyle(1,0,b),a.targetCurve?.draw(this)}}