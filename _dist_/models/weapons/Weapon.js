var s=Phaser.Scene;import{WeaponRangeOverlay as a,WeaponTargetOverlay as r}from"../../sprites/map/WeaponOverlay.js";export default class l{constructor(){this.selected=!1}getWeaponRangeOverlay(e){return new a(e,this)}getWeaponTargetOverlay(e){return new r(e,this)}getWeaponProjectileTexture(e){return e.textures.exists("projectile/ball")?e.textures.get("projectile/ball"):e.textures.addCanvas("projectile/ball",n())}}function n(){const e=document.createElement("canvas");e.width=20,e.height=20;const t=e.getContext("2d");return t.fillStyle="#000000",t.ellipse(10,10,10,10,0,0,Math.PI*2),t.fill(),e}
