import t from"./StateManager.js";import s from"../scenes/WorldMap.js";import a from"../scenes/MapUI.js";export default class i extends t{start(e){this.scene.run("map",{world:this.dataStore.playerShip.world}),this.scene.run("map_ui"),this.getScenes()}end(e){this.scene.sleep("map"),this.scene.sleep("map_ui")}initScenes(){this.mapScene=this.scene.add("map",s),this.uiScene=this.scene.add("map_ui",a)}getScenes(){this.mapScene=this.scene.getScene("map"),this.uiScene=this.scene.getScene("map_ui"),this.uiScene.mapScene=this.mapScene}}
