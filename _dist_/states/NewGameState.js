import f from"./StateManager.js";import g from"../models/Ship.js";import h from"../models/rooms/Helm.js";import i from"../models/rooms/Quarters.js";import a from"../models/Person.js";import j from"../models/rooms/Gunnery.js";import k from"../models/rooms/Storage.js";import l from"../models/rooms/Engine.js";import m from"../models/rooms/Empty.js";import n from"./MapState.js";import o from"../models/World.js";var B=Phaser.Geom.Point,c=Phaser.Math.Vector2;export default class C extends f{getScenes(){}initScenes(){}start(p){let d=g.builder(),b=d.createRootRoom(new h(1,1,!1)).addRoomDown(new i(1,2)).addPerson(new a()).addPerson(new a());b.addRoomRight(new j(3,1)).addPerson(new a()).addPerson(new a()),b.addRoomRight(new k(2,1),new c(0,1)).addPerson(new a()),b.addRoomDown(new l(1,1)).addPerson(new a()).addRoomRight(new m(1,1)),this.dataStore.playerShip=d.build();let e=o.generate();this.dataStore.worlds.push(e),this.dataStore.playerShip.world=e,this.dataStore.playerShip.position=new c(1024,1024),this.state.start(n)}end(p){}}
