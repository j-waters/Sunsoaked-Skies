function applyMixins(o,p){p.forEach(t=>{Object.getOwnPropertyNames(t.prototype).forEach(e=>{Object.defineProperty(o.prototype,e,Object.getOwnPropertyDescriptor(t.prototype,e))})})}
