import l from"../Segment.js";var i=Phaser.Display.Color,d=Phaser.Math.Vector2;export class WeaponRangeOverlay extends l{constructor(a,t){super(a,t.angle,t.range,i.ValueToColor("rgb(137,30,64)"),.1,!0);this.weapon=t}setTo(a){this.setPosition(a.x,a.y),this.setRotation(a.rotation-Phaser.Math.DegToRad(this.weapon.angle)/2)}}export class WeaponTargetOverlay extends l{constructor(a,t){super(a,t.spread,t.range,i.ValueToColor("rgb(137,30,64)"),.3,!1);this.weapon=t}setTo(a,t){this.setPosition(a.x,a.y);const o=Phaser.Math.Angle.Normalize(Math.PI/2);let e=Phaser.Math.Angle.Normalize(Phaser.Math.Angle.BetweenPoints(a.ship.position,t)-Phaser.Math.DegToRad(this.weapon.spread)/2-a.rotation);const s=Phaser.Math.Angle.Normalize(-Phaser.Math.DegToRad(this.weapon.angle)/2),r=Phaser.Math.Angle.Normalize(+Phaser.Math.DegToRad(this.weapon.angle)/2-Phaser.Math.DegToRad(this.weapon.spread)),n=Phaser.Math.Angle.Normalize(s-Math.PI),h=Phaser.Math.Angle.Normalize(r-Math.PI);e<s&&e>Phaser.Math.Angle.Normalize(o-Math.PI)?e=s:e>r&&e<o?e=r:e<n&&e>o?e=n:e>h&&e<Phaser.Math.Angle.Normalize(o-Math.PI)&&(e=h),e=Phaser.Math.Angle.Normalize(e+a.rotation),this.setRotation(e),this.targetAngle=e+Phaser.Math.DegToRad(this.weapon.spread*g())}}function g(){return 1-Math.pow(1-2*Phaser.Math.RND.frac(),2)}
