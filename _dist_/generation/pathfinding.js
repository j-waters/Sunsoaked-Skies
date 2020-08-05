import r from"../models/Room.js";var x=Phaser.Geom.Point,h=Phaser.Math.Vector2;export default function y(b,a,d){let c={room:a,position:d||new h(a.firstAvailableSpace,a.height-1)},e=v(b.room.ship.rooms,b,c),f=u(e,b),g=t(f,c);return console.log("Route:",g.map(i=>i)),s(b,g)}function s(b,a){let d=[],c=a.shift();for(;;){let e=p(c.room,c.position);d.push({room:c.room,position:e});let f=a.shift();if(f==null)break;let g=p(f.room,f.position);c.room==f.room&&(g.y<e.y?d.push({room:c.room,position:new h(g.x,e.y)}):g.y>e.y&&d.push({room:c.room,position:new h(e.x,g.y)})),c=f}return d}function t(b,a){let d=[],c=o(b,a.room,l(a.room,a.position));for(;c!=null;)d.unshift(c),c=c.routeNode;return d}function u(b,a){o(b,a.room,l(a.room,a.roomPosition)).distance=0;let d=b.map(c=>c);for(;d.length>0;){d=d.sort((e,f)=>e.distance-f.distance);let c=d.shift();c.children.forEach(e=>{let f=c.distance+1;f<e.distance&&(e.distance=f,e.routeNode=c)})}return b}function v(b,a,d){k.nodes=[];let c=a.room,e=l(c,a.roomPosition),f=[];return b.forEach(g=>{let i=[];if(g===c){let j=k.create(g,e);i.push(j)}if(g==d.room){let j=k.create(g,l(g,d.position));i.push(j)}g.neighbours.forEach(j=>{let m=n(g,j);m.children.add(n(j.room,j.mirror)),i.forEach(q=>{q.children.add(m),m.children.add(q)}),i.push(m)}),f.push(...i)}),f}function n(b,a){let d=a.thisPosition;switch(a.direction){case"LEFT":d=l(b,new h(0,d.y));break;case"RIGHT":d=l(b,new h(r.possiblePositions(b.width)-1,d.y));break;default:break}let c=k.create(b,d);return c}function o(b,a,d){return b.find(c=>c.room==a&&(!d||c.position.equals(d)))}class k{constructor(b,a){this.room=b,this.position=a,this.distance=Infinity,this.children=new Set()}static create(b,a){let d=this.nodes.find(e=>e.room==b&&e.position.equals(a));if(d)return d;let c=new k(b,a);return this.nodes.push(c),c}}k.nodes=[];function p(b,a){if(b.width==1)return new h((1+4*a.x)/2,a.y);if(b.width==2)return new h(a.x*2,a.y);if(b.width==3)return new h((5*b.width+10*b.width*a.x-6)/(6*b.width),a.y)}function l(b,a){if(b.width==1)return new h((2*a.x-1)/4,a.y);if(b.width==2)return new h(a.x/2,a.y);if(b.width==3)return new h((6*a.x*b.width+6-5*b.width)/(10*b.width),a.y)}
