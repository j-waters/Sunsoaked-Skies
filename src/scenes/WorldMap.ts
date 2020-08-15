import { SceneBase } from './SceneBase';
import type World from '../models/World';
import MapLocationSprite from '../sprites/map/MapLocationSprite';
import MapShipSprite from '../sprites/map/MapShipSprite';
import Weapon from '../models/weapons/Weapon';
import type { WeaponRangeOverlay, WeaponTargetOverlay } from '../sprites/map/WeaponOverlay';
import Cursor from '../sprites/map/Cursor';
import type MapAction from '../models/MapAction';
import { MovementAction } from '../models/MapAction';
import GraphicOverlay from '../sprites/map/GraphicOverlay';
import Projectile from '../sprites/map/Projectile';
import QuadraticBezier = Phaser.Curves.QuadraticBezier;
import Vector2 = Phaser.Math.Vector2;
import CubicBezier = Phaser.Curves.CubicBezier;
import Graphics = Phaser.GameObjects.Graphics;

export default class WorldMap extends SceneBase {
	private map: Phaser.GameObjects.Image;
	world: World;
	mapSize: number = 512 * 4;
	playerShip: MapShipSprite;
	private cursor: Cursor;
	private overlay: GraphicOverlay;
	private weaponRangeOverlay: WeaponRangeOverlay;
	private weaponTargetOverlay: WeaponTargetOverlay;
	private selectedAction: MapAction;
	private projectiles: Phaser.GameObjects.Group;

	preload() {
		MapLocationSprite.setupPipelines(this);
	}

	create(data: { world: World }) {
		this.world = data.world;
		this.map = this.add.image(0, 0, this.world.generateTexture(this, 512));
		this.map.setOrigin(0, 0);
		this.map.setDisplaySize(this.mapSize, this.mapSize);
		this.map.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

		this.input.setDefaultCursor(`url(assets/images/map/blank.svg), pointer`);

		// let locationSprite = new MapLocationSprite(this, this.world.locations[0]);
		// this.add.existing(locationSprite);
		// locationSprite.setDisplaySize(700, 700);

		this.world.locations.forEach((location) => {
			const locationSprite = new MapLocationSprite(this, location);
			this.add.existing(locationSprite);
		});

		this.playerShip = new MapShipSprite(this, this.dataStore.playerShip);
		const mod = this.mapSize / this.world.size;
		this.playerShip.setDisplaySize(5 * mod, 8 * mod);
		this.add.existing(this.playerShip);

		this.cursor = new Cursor(this);
		this.selectedAction = this.dataStore.playerShip.movementAction;
		this.cursor.selectAction(this.selectedAction);
		this.add.existing(this.cursor);

		this.projectiles = this.add.group();
		this.projectiles.runChildUpdate = true;

		this.cameras.main.startFollow(this.playerShip);
		this.cameras.main.setZoom(7 * (this.gameHeight / this.mapSize));

		this.input.on(Phaser.Input.Events.POINTER_WHEEL, (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
			this.cameras.main.zoom += -deltaY * (this.gameHeight / this.mapSize) * 0.01;
			if (this.cameras.main.zoom > 10 * (this.gameHeight / this.mapSize)) {
				this.cameras.main.zoom = 10 * (this.gameHeight / this.mapSize);
			} else if (this.cameras.main.zoom < 1) {
				this.cameras.main.zoom = 1;
			}
		});

		this.overlay = new GraphicOverlay(this);
		this.add.existing(this.overlay);

		this.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => this.pointerDown(pointer));

		this.input.on(Phaser.Input.Events.POINTER_MOVE, (pointer: Phaser.Input.Pointer, gameObjects) => this.pointerMove(pointer, gameObjects));

		this.events.on(Phaser.Scenes.Events.WAKE, () => this.wake());
		this.wake();
	}

	wake() {
		this.input.setDefaultCursor(`url(assets/images/map/blank.svg), pointer`);
	}

	pointerMove(pointer: Phaser.Input.Pointer, gameObjects) {
		const pointerPosition: Vector2 = <Vector2>pointer.positionToCamera(this.cameras.main);
		this.cursor.setPosition(pointerPosition.x, pointerPosition.y);
		if (this.selectedAction instanceof MovementAction) {
			this.handleMovementAction(pointer);
		} else {
			this.weaponRangeOverlay.setTo(this.playerShip);
			this.weaponTargetOverlay.setTo(this.playerShip, pointerPosition);
			// this.overlay.clear();
			// this.overlay.lineStyle(1, Color.ValueToColor('rgb(0, 0, 0)').color, 0.5);
			// this.overlay.lineBetween(this.playerShip.getCenter().x, this.playerShip.getCenter().y, pointerPosition.x, pointerPosition.y);
		}
	}

	handleMovementAction(pointer: Phaser.Input.Pointer) {
		const pointerPosition: Vector2 = <Vector2>pointer.positionToCamera(this.cameras.main);
		const curve = calculateCurve(this.playerShip.getCenter(), this.playerShip.ship.velocity.clone().setLength(this.playerShip.ship.turningModifier), pointerPosition);
		this.overlay.drawProspectiveMovement(curve);
		this.cursor.setRotation(curve.getTangentAt(1).angle() - Math.PI / 2);
	}

	pointerDown(pointer: Phaser.Input.Pointer) {
		const pointerPosition: Vector2 = <Vector2>pointer.positionToCamera(this.cameras.main);
		const curve = calculateCurve(this.playerShip.getCenter(), this.playerShip.ship.velocity.clone().setLength(this.playerShip.ship.turningModifier), pointerPosition);

		if (this.selectedAction instanceof MovementAction) {
			this.playerShip.moveTo(curve);
		} else {
			this.fire(this.weaponTargetOverlay.targetAngle);
		}
	}

	fire(angle: number) {
		const projectile = new Projectile(this, this.selectedAction as Weapon, this.playerShip.getCenter(), angle);
		this.projectiles.add(projectile, true);
		// this.add.existing(projectile);
	}

	update(time: number, delta: number): void {
		super.update(time, delta);
		this.overlay.clear();
		this.overlay.drawCurrentMovement(this.playerShip.ship);
		this.playerShip.update();
		this.pointerMove(this.input.activePointer, []);
		this.weaponRangeOverlay?.setTo(this.playerShip);
	}

	selectAction(action: MapAction) {
		this.weaponRangeOverlay?.destroy();
		this.weaponTargetOverlay?.destroy();
		if (action instanceof Weapon) {
			this.weaponRangeOverlay = action.getWeaponRangeOverlay(this);
			this.weaponTargetOverlay = action.getWeaponTargetOverlay(this);
			this.add.existing(this.weaponRangeOverlay);
			this.add.existing(this.weaponTargetOverlay);
		}
		this.selectedAction = action;
		this.cursor.selectAction(this.selectedAction);
		this.overlay.clear();
	}

	deselectAction() {
		this.weaponRangeOverlay?.destroy();
		this.weaponTargetOverlay?.destroy();
		this.selectedAction = this.dataStore.playerShip.movementAction;
		this.cursor.selectAction(this.selectedAction);
	}
}

function calculateCurve(startPosition: Vector2, startVelocity: Vector2, endPosition: Vector2, debugGraphic?: Graphics) {
	const hyp = startPosition.clone().subtract(endPosition);
	hyp.x = Math.abs(hyp.x);
	hyp.y = Math.abs(hyp.y);
	const angleBetween = Phaser.Math.Angle.Normalize(Phaser.Math.Angle.BetweenPoints(startPosition, endPosition) - startVelocity.angle());
	const ang = Phaser.Math.Angle.Normalize(Math.PI / 2 - angleBetween);
	const dis = Phaser.Math.Distance.BetweenPoints(startPosition, endPosition) * Math.sin(ang);
	const midPoint = startPosition.clone().add(startVelocity.clone().setLength(dis / 2));
	const quadraticBezier = new QuadraticBezier(startPosition, midPoint, endPosition);
	const tangent = quadraticBezier.getTangentAt(1);
	let angle = tangent.angle();
	const angleOffset = startVelocity.angle() - Math.PI * 1.5;
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

	const shipVelocity = startVelocity.clone();

	if (shipVelocity.length() > endPosition.clone().distance(startPosition) / 2) {
		shipVelocity.setLength(endPosition.clone().distance(startPosition) / 2);
	}

	const newVelocity = shipVelocity.clone().setAngle(angle);

	const pointA = startPosition;
	const pointB = startPosition.clone().add(shipVelocity);
	// Probably should change B if target is too far below
	const pointC = endPosition.clone().subtract(newVelocity);
	const pointD = endPosition;

	const cubicBezier = new CubicBezier(pointA, pointB, pointC, pointD);

	if (debugGraphic) {
		debugGraphic.clear();
		debugGraphic.lineStyle(2, 0xff00ff, 1);
		debugGraphic.lineBetween(startPosition.x, startPosition.y, midPoint.x, midPoint.y);
		quadraticBezier.draw(debugGraphic);
		const t = quadraticBezier.getEndPoint().add(tangent.setLength(40));
		debugGraphic.lineStyle(1, 0xff0000, 1);
		debugGraphic.lineBetween(quadraticBezier.getEndPoint().x, quadraticBezier.getEndPoint().y, t.x, t.y);
		debugGraphic.lineStyle(1, 0x00ff00, 1);
		// debugGraphic.lineBetween(startPosition.x, startPosition.y, startPosition.clone().add(hyp).x, startPosition.clone().subtract(hyp).y);
		cubicBezier.draw(debugGraphic);
		debugGraphic.lineStyle(1, 0x0000ff, 1);
		debugGraphic.lineBetween(pointA.x, pointA.y, pointB.x, pointB.y);
		debugGraphic.lineBetween(pointC.x, pointC.y, pointD.x, pointD.y);
	}

	return cubicBezier;
}
