import {SceneBase as SceneBase2} from "./SceneBase.js";
import MapLocationSprite2 from "../sprites/map/MapLocationSprite.js";
import MapShipSprite2 from "../sprites/map/MapShipSprite.js";
var QuadraticBezier = Phaser.Curves.QuadraticBezier;
var Point = Phaser.Geom.Point;
var Vector2 = Phaser.Math.Vector2;
var CubicBezier = Phaser.Curves.CubicBezier;
var Graphics = Phaser.GameObjects.Graphics;
export default class WorldMap extends SceneBase2 {
  constructor() {
    super(...arguments);
    this.mapSize = 512 * 4;
  }
  preload() {
    MapLocationSprite2.setupPipelines(this);
  }
  create(data) {
    this.world = data.world;
    this.map = this.add.image(0, 0, this.world.generateTexture(this, 512));
    this.map.setOrigin(0, 0);
    this.map.setDisplaySize(this.mapSize, this.mapSize);
    this.map.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.input.setDefaultCursor(`url(assets/images/map/blank.svg), pointer`);
    this.world.locations.forEach((location) => {
      let locationSprite = new MapLocationSprite2(this, location);
      this.add.existing(locationSprite);
    });
    this.playerShip = new MapShipSprite2(this, this.dataStore.playerShip);
    let mod = this.mapSize / this.world.size;
    this.playerShip.setDisplaySize(10 * mod, 13 * mod);
    this.add.existing(this.playerShip);
    this.cameras.main.startFollow(this.playerShip);
    this.cameras.main.setZoom(5 * (this.gameHeight / this.mapSize));
    this.input.on(Phaser.Input.Events.POINTER_WHEEL, (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      this.cameras.main.zoom += -deltaY * (this.gameHeight / this.mapSize) * 0.01;
      if (this.cameras.main.zoom > 10 * (this.gameHeight / this.mapSize)) {
        this.cameras.main.zoom = 10 * (this.gameHeight / this.mapSize);
      } else if (this.cameras.main.zoom < 1) {
        this.cameras.main.zoom = 1;
      }
      console.log(this.cameras.main.zoom);
    });
    this.cursor = this.add.image(0, 0, this.dataStore.playerShip.generateTopDownTexture(this));
    this.cursor.setDisplaySize(10 * mod, 13 * mod);
    this.cursor.setAlpha(0.5);
    this.curve = this.add.graphics();
    this.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer) => this.pointerDown(pointer));
    this.input.on(Phaser.Input.Events.POINTER_MOVE, (pointer, gameObjects) => this.pointerMove(pointer, gameObjects));
    this.events.on(Phaser.Scenes.Events.WAKE, () => this.wake());
    this.wake();
  }
  wake() {
    this.input.setDefaultCursor(`url(assets/images/map/blank.svg), pointer`);
  }
  pointerMove(pointer, gameObjects) {
    let pointerPosition = pointer.positionToCamera(this.cameras.main);
    this.cursor.setPosition(pointerPosition.x, pointerPosition.y);
    let curve = calculateCurve(this.playerShip.getCenter(), this.playerShip.ship.velocity.clone().setLength(this.playerShip.ship.turningModifier), pointerPosition);
    this.curve.clear();
    this.curve.lineStyle(1, 0, 1);
    this.playerShip.targetCurve?.draw(this.curve);
    this.curve.lineStyle(1, 0, 0.5);
    curve.draw(this.curve);
    this.cursor.setRotation(curve.getTangentAt(1).angle() - Math.PI / 2);
  }
  pointerDown(pointer) {
    let pointerPosition = pointer.positionToCamera(this.cameras.main);
    this.playerShip.targetCurve = calculateCurve(this.playerShip.getCenter(), this.playerShip.ship.velocity.clone().setLength(this.playerShip.ship.turningModifier), pointerPosition);
    this.playerShip.progress = 0;
  }
  update(time, delta) {
    super.update(time, delta);
    this.playerShip.update();
    this.pointerMove(this.input.activePointer, []);
  }
}
function calculateCurve(startPosition, startVelocity, endPosition, debugGraphic) {
  let hyp = startPosition.clone().subtract(endPosition);
  hyp.x = Math.abs(hyp.x);
  hyp.y = Math.abs(hyp.y);
  let angleBetween = Phaser.Math.Angle.Normalize(Phaser.Math.Angle.BetweenPoints(startPosition, endPosition) - startVelocity.angle());
  let ang = Phaser.Math.Angle.Normalize(Math.PI / 2 - angleBetween);
  let dis = Phaser.Math.Distance.BetweenPoints(startPosition, endPosition) * Math.sin(ang);
  let midPoint = startPosition.clone().add(startVelocity.clone().setLength(dis / 2));
  let quadraticBezier = new QuadraticBezier(startPosition, midPoint, endPosition);
  let tangent = quadraticBezier.getTangentAt(1);
  let angle = tangent.angle();
  let angleOffset = startVelocity.angle() - Math.PI * 1.5;
  let nAngle = Phaser.Math.Angle.Normalize(angle - angleOffset);
  if (angleBetween < Math.PI * 1.5 && angleBetween > Math.PI) {
    nAngle -= Math.PI * 1.5 - angleBetween;
    if (nAngle < Math.PI / 2) {
      nAngle = Math.PI / 2;
    }
  } else if (angleBetween > Math.PI / 2 && angleBetween < Math.PI) {
    nAngle += angleBetween - Math.PI / 2;
    if (nAngle > Math.PI / 2) {
      nAngle = Math.PI / 2;
    }
  }
  angle = nAngle + angleOffset;
  let shipVelocity = startVelocity.clone();
  if (shipVelocity.length() > endPosition.clone().distance(startPosition) / 2) {
    shipVelocity.setLength(endPosition.clone().distance(startPosition) / 2);
  }
  let newVelocity = shipVelocity.clone().setAngle(angle);
  let pointA = startPosition;
  let pointB = startPosition.clone().add(shipVelocity);
  let pointC = endPosition.clone().subtract(newVelocity);
  let pointD = endPosition;
  let cubicBezier = new CubicBezier(pointA, pointB, pointC, pointD);
  if (debugGraphic) {
    debugGraphic.clear();
    debugGraphic.lineStyle(2, 16711935, 1);
    debugGraphic.lineBetween(startPosition.x, startPosition.y, midPoint.x, midPoint.y);
    quadraticBezier.draw(debugGraphic);
    let t = quadraticBezier.getEndPoint().add(tangent.setLength(40));
    debugGraphic.lineStyle(1, 16711680, 1);
    debugGraphic.lineBetween(quadraticBezier.getEndPoint().x, quadraticBezier.getEndPoint().y, t.x, t.y);
    debugGraphic.lineStyle(1, 65280, 1);
    cubicBezier.draw(debugGraphic);
    debugGraphic.lineStyle(1, 255, 1);
    debugGraphic.lineBetween(pointA.x, pointA.y, pointB.x, pointB.y);
    debugGraphic.lineBetween(pointC.x, pointC.y, pointD.x, pointD.y);
  }
  return cubicBezier;
}
