import c from"../DataStore.js";export class StateManager{constructor(){this.initialised=new Set()}static create(){return this.instance||(this.instance=new StateManager()),this.instance}start(a){let b=new a(StateManager.sceneManager);this.current?.end(b),this.initialised.has(a)||(b.initScenes(),this.initialised.add(a)),b.start(this.current),this.current=b}}export default class e{constructor(a){this.scene=a}get state(){return StateManager.create()}get dataStore(){return c.create()}}