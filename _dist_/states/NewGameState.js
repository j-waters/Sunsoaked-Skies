import m from"./StateManager.js";import d from"../models/Ship.js";import n from"../models/rooms/Helm.js";import i from"../models/rooms/Quarters.js";import o from"../models/Person.js";import p from"../models/rooms/Gunnery.js";import l from"../models/rooms/Storage.js";import w from"../models/rooms/Engine.js";import S from"../models/rooms/Empty.js";import h from"./MapState.js";import f from"../models/World.js";var s=Phaser.Math.Vector2;export default class j extends m{getScenes(){}initScenes(){}start(a){const r=d.builder(),e=r.createRootRoom(new n(1,1,!1)).addRoomDown(new i(1,2)).addPerson(new o()).addPerson(new o());e.addRoomRight(new p(3,1)).addPerson(new o()).addPerson(new o()),e.addRoomRight(new l(2,1),new s(0,1)).addPerson(new o()),e.addRoomDown(new w(1,1)).addPerson(new o()).addRoomRight(new S(1,1)),this.dataStore.playerShip=r.build();const t=f.generate();this.dataStore.worlds.push(t),this.dataStore.playerShip.world=t,this.dataStore.playerShip.position=new s(1024,1024),this.state.start(h)}end(a){}}
