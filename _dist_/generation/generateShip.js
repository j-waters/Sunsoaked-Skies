import v from"../models/Ship.js";import G from"./generationSettings.js";import M from"../models/rooms/Empty.js";var R=Phaser.Display.Color,p=Phaser.Math.RandomDataGenerator,k=Phaser.Math.Vector2;console.log("");export function generateGrid(e,l,n,c){let u=0,t=0;function o(h,f,r,m){for(let a=m;a<0;a++){f.unshift([]);for(let i=0;i<f[1].length;i++)f[f.length-1].push(null);t+=1}for(let a=r;a<0;a++){for(let i=0;i<=m;i++)f[i].unshift(null);u+=1}for(;f.length<=m;){f.push([]);for(let a=0;a<f[0].length;a++)f[f.length-1].push(null)}for(;f[0].length<=r;)for(let a=0;a<=m;a++)f[a].push(null);f[m+t][r+u]=h}l==null&&(l=[],n=0,c=0);for(let h=c;h<c+e.height;h++)for(let f=n;f<n+e.width;f++)o(e,l,f,h);return e.neighbours.filter(h=>!h.automatic).forEach(h=>{switch(h.direction){case"UP":generateGrid(h.room,l,n+h.thisPosition.x-h.theirPosition.x,c-h.room.height);break;case"DOWN":generateGrid(h.room,l,n+h.thisPosition.x-h.theirPosition.x,c+e.height);break;case"LEFT":generateGrid(h.room,l,n-h.room.width,c+h.thisPosition.y-h.theirPosition.y);break;case"RIGHT":generateGrid(h.room,l,n+e.width,c+h.thisPosition.y-h.theirPosition.y);break}}),l}export function generateTopDownShipGraphic(e){const l=document.createElement("canvas");l.width=20,l.height=30;const n=l.getContext("2d");return n.fillStyle="brown",n.fillRect(0,0,20,30),l}export function generateShipGraphic(e,l){const n=generateHullGraphic(e,l),c=O(e,l),u=document.createElement("canvas"),t=u.getContext("2d");u.width=Math.max(n.width,c.width),u.height=n.height+c.height+20;const o=E(n.width,u.height);return t.drawImage(o,0,c.height/2),t.drawImage(c,0,0),t.drawImage(n,0,c.height+20),u}export function generateHullGraphic(e,l,n){const c=generateGrid(e.rootRoom),u=document.createElement("canvas");u.width=c[0].length*l.roomSizeMargin+l.margin*2+l.strokeThickness,u.height=c.length*l.roomSizeMargin+l.margin*2+l.strokeThickness;const t=u.getContext("2d");t.lineWidth=l.strokeThickness,t.lineJoin="bevel",t.strokeStyle="#6b4a31";const o=I(c,l);t.stroke(o),t.clip(o);const h=d(u.width,u.height,n);return t.drawImage(h,0,0),u}function d(e,l,n){const c=document.createElement("canvas");c.width=e,c.height=l;const u=c.getContext("2d"),t=15,o=20,h=new p(n);u.strokeStyle="#6b4a31",u.lineWidth=.1;for(let f=0;f<l;f+=t){let r=0;for(;r<e;){const m=h.integerInRange(50,e*.5),a=R.HexStringToColor("#b27450"),i=f/l*o*h.realInRange(.8,1.5)/1.5;a.darken(Math.round(i)*1.5),u.fillStyle=a.rgba,u.fillRect(r,f,m,t),u.strokeRect(r,f,m,t),r+=m}}return c}function O(e,l,n){const c=document.createElement("canvas"),u=generateGrid(e.rootRoom);c.width=u[0].length*l.roomSizeMargin+l.margin*2+l.strokeThickness,c.height=(u.length*l.roomSizeMargin+l.margin*2+l.strokeThickness)/2;const t=c.getContext("2d"),o=R.RandomRGB();return t.fillStyle=o.rgba,t.strokeStyle=o.darken(10).rgba,t.ellipse(c.width/2,c.height/2,c.width/2,c.height/2,0,0,Math.PI*2),t.stroke(),t.fill(),c}function E(e,l,n){const c=document.createElement("canvas");c.width=e,c.height=l/1.5;const u=c.getContext("2d"),t=new p(n);for(let o=0;o<5;o++)u.beginPath(),u.moveTo(e/5*o+t.realInRange(10,60),0),u.lineTo(e/5*o+t.realInRange(10,60),c.height),u.stroke();return c}function I(e,l){for(let n=0;n<e.length;n++)for(let c=0;c<e[0].length;c++)if(e[n][c]!=null&&e[n][c].inside){const u=new Path2D();return T(e,c,n,!0,"TOP",u,l),u.closePath(),u}}function T(e,l,n,c,u,t,o,h){const f=e[n][l],r=z(e,l,n,!1),m=new k(o.margin+l*o.roomSizeMargin+o.strokeThickness/2,o.margin+n*o.roomSizeMargin+o.strokeThickness/2),a=new k(m.x+o.roomSizeMargin,m.y+o.roomSizeMargin);(r[0][1]==null||r[0][1].outside)&&(m.y-=o.margin),r[1][0]==null&&(m.x-=o.margin),r[0][0]!=null&&r[1][0]==null&&(m.y+=o.margin-o.roomMargin),r[1][2]==null&&(a.x+=o.margin-o.roomMargin),r[2][1]==null&&(a.y+=o.margin-o.roomMargin);const i=new k(a.x,m.y),w=new k(m.x,a.y);r[2][0]&&(w.x+=o.margin-o.roomMargin),r[0][2]&&(i.x-=o.margin),r[2][2]&&(a.y-=o.margin),c&&(t.moveTo(m.x,m.y),h=m);const s=.333;switch(u){case"LEFT":if((r[1][0]==null||r[1][0].outside)&&(t.lineTo(m.x+s,m.y+s),!c&&h.equals(m)))return;if(r[0][0]){T(e,l-1,n-1,!1,"BOTTOM",t,o,h);return}if(r[0][1]){T(e,l,n-1,!1,"LEFT",t,o,h);return}T(e,l,n,!1,"TOP",t,o,h);return;case"RIGHT":if((r[1][2]==null||r[1][2].outside)&&(t.lineTo(a.x+s,a.y+s),!c&&h.equals(a)))return;if(r[2][2]){T(e,l+1,n+1,!1,"TOP",t,o,h);return}if(r[2][1]){T(e,l,n+1,!1,"RIGHT",t,o,h);return}T(e,l,n,!1,"BOTTOM",t,o,h);return;case"TOP":if((r[0][1]==null||r[0][1].outside)&&(t.lineTo(i.x+s,i.y+s),!c&&h.equals(i)))return;if(r[0][2]){T(e,l+1,n-1,!1,"LEFT",t,o,h);return}if(r[1][2]){T(e,l+1,n,!1,"TOP",t,o,h);return}T(e,l,n,!1,"RIGHT",t,o,h);return;case"BOTTOM":if(r[2][1]==null||r[2][1].outside){if(r[2][0]!=null&&r[3][1]==null)t.bezierCurveTo(a.x+s,a.y+s,a.x+s,a.y+o.roomSizeMargin+s,w.x+s,w.y+o.roomSizeMargin+s);else if(t.lineTo(w.x+s,w.y+s),!c&&h.equals(w))return}if(r[2][0]){T(e,l-1,n+1,!1,"RIGHT",t,o,h);return}if(r[1][0]){T(e,l-1,n,!1,"BOTTOM",t,o,h);return}T(e,l,n,!1,"LEFT",t,o,h);return}}function z(e,l,n,c){let u=[[null,null,null],[null,null,null],[null,null,null],[null,null,null]];return u[0][0]=l>0&&n>0?e[n-1][l-1]:null,u[0][1]=n>0?e[n-1][l]:null,u[0][2]=l<e[0].length-1&&n>0?e[n-1][l+1]:null,u[1][0]=l>0?e[n][l-1]:null,u[1][1]=e[n][l],u[1][2]=l<e[0].length-1?e[n][l+1]:null,u[2][0]=l>0&&n<e.length-1?e[n+1][l-1]:null,u[2][1]=n<e.length-1?e[n+1][l]:null,u[2][2]=l<e[0].length-1&&n<e.length-1?e[n+1][l+1]:null,u[3][0]=l>0&&n<e.length-2?e[n+2][l-1]:null,u[3][1]=n<e.length-2?e[n+2][l]:null,u[3][2]=l<e[0].length-1&&n<e.length-2?e[n+2][l+1]:null,c||(u=u.map(t=>t.map(o=>o&&o.inside?o:null))),u}export function generateMenuShip(){const e=v.builder(),l=e.createRootRoom(new M(1,1));return l.addRoomDown(new M(2,1)).addRoomDown(new M(1,1)),generateShipGraphic(e.build(),new G(1))}
