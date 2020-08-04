import u from"../models/Ship.js";var C=Phaser.Geom.Point,s=Phaser.Display.Color,D=Phaser.Math.RND,t=Phaser.Math.RandomDataGenerator;import v from"./generationSettings.js";import r from"../models/rooms/Empty.js";var q=Phaser.Math.Vector2;console.log("");export function generateGrid(b,a,c,e){let f=0,g=0;function d(h,k,i,l){for(let j=l;j<0;j++){k.unshift([]);for(let o=0;o<k[1].length;o++)k[k.length-1].push(null);g+=1}for(let j=i;j<0;j++){for(let o=0;o<=l;o++)k[o].unshift(null);f+=1}for(;k.length<=l;){k.push([]);for(let j=0;j<k[0].length;j++)k[k.length-1].push(null)}for(;k[0].length<=i;)for(let j=0;j<=l;j++)k[j].push(null);k[l+g][i+f]=h}a==void 0&&(a=[],c=0,e=0);for(let h=e;h<e+b.height;h++)for(let k=c;k<c+b.width;k++)d(b,a,k,h);return b.neighbours.filter(h=>!h.automatic).forEach(h=>{switch(h.direction){case"UP":generateGrid(h.room,a,c+h.thisPosition.x-h.theirPosition.x,e-h.room.height);break;case"DOWN":generateGrid(h.room,a,c+h.thisPosition.x-h.theirPosition.x,e+b.height);break;case"LEFT":generateGrid(h.room,a,c-h.room.width,e+h.thisPosition.y-h.theirPosition.y);break;case"RIGHT":generateGrid(h.room,a,c+b.width,e+h.thisPosition.y-h.theirPosition.y);break}}),a}export function generateTopDownShipGraphic(b){let a=document.createElement("canvas");a.width=20,a.height=30;let c=a.getContext("2d");return c.fillStyle="brown",c.fillRect(0,0,20,30),a}export function generateShipGraphic(b,a){let c=generateHullGraphic(b,null),e=x(b,a),f=document.createElement("canvas"),g=f.getContext("2d");f.width=Math.max(c.width,e.width),f.height=c.height+e.height+20;let d=y(c.width,f.height);return g.drawImage(d,0,e.height/2),g.drawImage(e,0,0),g.drawImage(c,0,e.height+20),f}export function generateHullGraphic(b,a,c){let e=generateGrid(b.rootRoom),f=document.createElement("canvas");f.width=e[0].length*a.roomSizeMargin+a.margin*2+a.strokeThickness,f.height=e.length*a.roomSizeMargin+a.margin*2+a.strokeThickness;let g=f.getContext("2d");g.lineWidth=a.strokeThickness,g.lineJoin="bevel",g.strokeStyle="#6b4a31";let d=z(e,a);g.stroke(d),g.clip(d);let h=w(f.width,f.height,c);return g.drawImage(h,0,0),f}function w(b,a,c){let e=document.createElement("canvas");e.width=b,e.height=a;let f=e.getContext("2d");const g=15,d=20;let h=new t(c);f.strokeStyle="#6b4a31",f.lineWidth=.1;for(let k=0;k<a;k+=g){let i=0;for(;i<b;){let l=h.integerInRange(50,b*.5),j=s.HexStringToColor("#b27450"),o=k/a*d*h.realInRange(.8,1.5)/1.5;j.darken(Math.round(o)*1.5),f.fillStyle=j.rgba,f.fillRect(i,k,l,g),f.strokeRect(i,k,l,g),i+=l}}return e}function x(b,a,c){let e=document.createElement("canvas"),f=generateGrid(b.rootRoom);e.width=f[0].length*a.roomSizeMargin+a.margin*2+a.strokeThickness,e.height=(f.length*a.roomSizeMargin+a.margin*2+a.strokeThickness)/2;let g=e.getContext("2d"),d=s.RandomRGB();return g.fillStyle=d.rgba,g.strokeStyle=d.darken(10).rgba,g.ellipse(e.width/2,e.height/2,e.width/2,e.height/2,0,0,Math.PI*2),g.stroke(),g.fill(),e}function y(b,a,c){let e=document.createElement("canvas");e.width=b,e.height=a/1.5;let f=e.getContext("2d"),g=new t(c);for(let d=0;d<5;d++)f.beginPath(),f.moveTo(b/5*d+g.realInRange(10,60),0),f.lineTo(b/5*d+g.realInRange(10,60),e.height),f.stroke();return e}function z(b,a){for(let c=0;c<b.length;c++)for(let e=0;e<b[0].length;e++)if(b[c][e]!=null&&b[c][e].inside){let f=new Path2D();return n(b,e,c,!0,"TOP",f,a),f.closePath(),f}}function n(b,a,c,e,f,g,d,h){let k=b[c][a],i=A(b,a,c,!1),l=new q(d.margin+a*d.roomSizeMargin+d.strokeThickness/2,d.margin+c*d.roomSizeMargin+d.strokeThickness/2),j=new q(l.x+d.roomSizeMargin,l.y+d.roomSizeMargin);(i[0][1]==null||i[0][1].outside)&&(l.y-=d.margin),i[1][0]==null&&(l.x-=d.margin),i[0][0]!=null&&i[1][0]==null&&(l.y+=d.margin-d.roomMargin),i[1][2]==null&&(j.x+=d.margin-d.roomMargin),i[2][1]==null&&(j.y+=d.margin-d.roomMargin);let o=new q(j.x,l.y),p=new q(l.x,j.y);i[2][0]&&(p.x+=d.margin-d.roomMargin),i[0][2]&&(o.x-=d.margin),i[2][2]&&(j.y-=d.margin),e&&(g.moveTo(l.x,l.y),h=l);const m=.333;switch(f){case"LEFT":if(i[1][0]==null||i[1][0].outside){g.lineTo(l.x+m,l.y+m);if(!e&&h.equals(l))return}if(i[0][0]){n(b,a-1,c-1,!1,"BOTTOM",g,d,h);return}if(i[0][1]){n(b,a,c-1,!1,"LEFT",g,d,h);return}n(b,a,c,!1,"TOP",g,d,h);return;case"RIGHT":if(i[1][2]==null||i[1][2].outside){g.lineTo(j.x+m,j.y+m);if(!e&&h.equals(j))return}if(i[2][2]){n(b,a+1,c+1,!1,"TOP",g,d,h);return}if(i[2][1]){n(b,a,c+1,!1,"RIGHT",g,d,h);return}n(b,a,c,!1,"BOTTOM",g,d,h);return;case"TOP":if(i[0][1]==null||i[0][1].outside){g.lineTo(o.x+m,o.y+m);if(!e&&h.equals(o))return}if(i[0][2]){n(b,a+1,c-1,!1,"LEFT",g,d,h);return}if(i[1][2]){n(b,a+1,c,!1,"TOP",g,d,h);return}n(b,a,c,!1,"RIGHT",g,d,h);return;case"BOTTOM":if(i[2][1]==null||i[2][1].outside)if(i[2][0]!=null&&i[3][1]==null)g.bezierCurveTo(j.x+m,j.y+m,j.x+m,j.y+d.roomSizeMargin+m,p.x+m,p.y+d.roomSizeMargin+m);else{g.lineTo(p.x+m,p.y+m);if(!e&&h.equals(p))return}if(i[2][0]){n(b,a-1,c+1,!1,"RIGHT",g,d,h);return}if(i[1][0]){n(b,a-1,c,!1,"BOTTOM",g,d,h);return}n(b,a,c,!1,"LEFT",g,d,h);return}}function A(b,a,c,e){let f=[[null,null,null],[null,null,null],[null,null,null],[null,null,null]];return f[0][0]=a>0&&c>0?b[c-1][a-1]:null,f[0][1]=c>0?b[c-1][a]:null,f[0][2]=a<b[0].length-1&&c>0?b[c-1][a+1]:null,f[1][0]=a>0?b[c][a-1]:null,f[1][1]=b[c][a],f[1][2]=a<b[0].length-1?b[c][a+1]:null,f[2][0]=a>0&&c<b.length-1?b[c+1][a-1]:null,f[2][1]=c<b.length-1?b[c+1][a]:null,f[2][2]=a<b[0].length-1&&c<b.length-1?b[c+1][a+1]:null,f[3][0]=a>0&&c<b.length-2?b[c+2][a-1]:null,f[3][1]=c<b.length-2?b[c+2][a]:null,f[3][2]=a<b[0].length-1&&c<b.length-2?b[c+2][a+1]:null,e||(f=f.map(g=>g.map(d=>d&&d.inside?d:null))),f}export function generateMenuShip(){let b=u.builder(),a=b.createRootRoom(new r(1,1));return a.addRoomDown(new r(2,1)).addRoomDown(new r(1,1)),generateShipGraphic(b.build(),new v(1))}
