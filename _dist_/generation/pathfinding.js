var v=Phaser.Geom.Point,h=Phaser.Math.Vector2;export default function w(a,b){let d=u(a.room.ship.rooms,a,b);console.log("Graph:",d);let c=t(d,a),e=s(c,b);return console.log("Route:",e.map(f=>f)),r(a,e)}function r(a,b){let d=[],c=b.shift();for(;;){let e=p(c.room,c.position);d.push({room:c.room,position:e});let f=b.shift();if(f==null){d.push({room:c.room,position:new h(c.room.people.length,c.room.height-1)});break}let g=p(f.room,f.position);c.room==f.room&&(g.y<e.y?d.push({room:c.room,position:new h(g.x,e.y)}):g.y>e.y&&d.push({room:c.room,position:new h(e.x,g.y)})),c=f}return d}function s(a,b){let d=[],c=o(a,b,k(b,new h(b.people.length,b.height-1)));for(;c!=null;)d.unshift(c),c=c.routeNode;return d}function t(a,b){o(a,b.room,k(b.room,b.roomPosition)).distance=0;let d=a.map(c=>c);for(;d.length>0;){d=d.sort((e,f)=>e.distance-f.distance);let c=d.shift();c.children.forEach(e=>{let f=c.distance+1;f<e.distance&&(e.distance=f,e.routeNode=c)})}return a}function u(a,b,d){j.nodes=[];let c=b.room,e=k(c,b.roomPosition),f=[];return a.forEach(g=>{let l=[];if(g===c){let i=j.create(g,e);l.push(i)}if(g==d){let i=j.create(g,k(g,new h(g.people.length,g.height-1)));l.push(i)}g.neighbours.forEach(i=>{let m=n(g,i);m.children.add(n(i.room,i.mirror)),l.forEach(q=>{q.children.add(m),m.children.add(q)}),l.push(m)}),f.push(...l)}),f}function n(a,b){let d=b.thisPosition;switch(b.direction){case"LEFT":d=k(a,new h(0,d.y));break;case"RIGHT":d=k(a,new h(possiblePositions(a.width)-1,d.y));break;default:break}let c=j.create(a,d);return c}function o(a,b,d){return a.find(c=>c.room==b&&(!d||c.position.equals(d)))}class j{constructor(a,b){this.room=a,this.position=b,this.distance=Infinity,this.children=new Set()}static create(a,b){let d=this.nodes.find(e=>e.room==a&&e.position.equals(b));if(d)return d;let c=new j(a,b);return this.nodes.push(c),c}}j.nodes=[];export function possiblePositions(a){return a==1?2:a==2?3:5}function p(a,b){if(a.width==1)return new h((1+4*b.x)/2,b.y);if(a.width==2)return new h(b.x*2,b.y);if(a.width==3)return new h((5*a.width+10*a.width*b.x-6)/(6*a.width),b.y)}function k(a,b){if(a.width==1)return new h((2*b.x-1)/4,b.y);if(a.width==2)return new h(b.x/2,b.y);if(a.width==3)return new h((6*b.x*a.width+6-5*a.width)/(10*a.width),b.y)}