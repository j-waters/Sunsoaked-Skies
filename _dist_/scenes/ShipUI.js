import a from"./BaseUI.js";import b from"../states/MapState.js";export default class e extends a{constructor(){super(...arguments);this.largeButton={texture:"ui/compass",action:()=>{this.state.start(b)}}}create(){super.create()}}
