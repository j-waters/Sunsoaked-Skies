export default class b{constructor(a){a?this.mod=a:this.mod=1}get roomSize(){return b.ROOM_SIZE*this.mod}get roomMargin(){return b.ROOM_MARGIN*this.mod}get roomSizeMargin(){return this.roomSize+this.roomMargin}get margin(){return b.MARGIN*this.mod}get strokeThickness(){return b.STROKE_THICKNESS*this.mod}get personWidth(){return this.personHeight/2}get personHeight(){return this.roomSize*.7}get personRoundingRadius(){return this.mod}get headConfig(){return{width:this.personHeight*.25,height:this.personHeight*.25,xOffset:0,yOffset:-this.bodyConfig.height/2}}get bodyConfig(){let a={width:this.personWidth*.7,height:this.personHeight*.5,xOffset:void 0,yOffset:this.personHeight*.24};return a.xOffset=(this.personWidth-a.width)/2,a}get armConfig(){return{width:this.bodyConfig.width*.25+this.personRoundingRadius,height:this.bodyConfig.height*.7,xOffset:this.bodyConfig.width/2,yOffset:-this.bodyConfig.height/2}}get legConfig(){let a={width:this.bodyConfig.width*.4,height:this.personHeight*.25,xOffset:void 0,yOffset:this.bodyConfig.height/2-this.personRoundingRadius};return a.xOffset=Math.round(this.bodyConfig.width/2-a.width/2),a}}b.ROOM_SIZE=100,b.ROOM_MARGIN=10,b.MARGIN=20,b.STROKE_THICKNESS=4;
