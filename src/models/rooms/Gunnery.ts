import Room from '../Room';
import type Weapon from '../weapons/Weapon';
import Cannon from '../weapons/Cannon';

export default class Gunnery extends Room {
	weapons: Weapon[] = [new Cannon()];
	get name(): string {
		return 'Gunnery';
	}
}
