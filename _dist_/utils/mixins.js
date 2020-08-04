function applyMixins(c,d){d.forEach(a=>{Object.getOwnPropertyNames(a.prototype).forEach(b=>{Object.defineProperty(c.prototype,b,Object.getOwnPropertyDescriptor(a.prototype,b))})})}
