import Weapon from './Weapon';

export default class Cannon extends Weapon {
	cooldownTime = 5000;
	cooldown = 0;
	icon = 'ui/cannon';
	angle = 90;
	range = 100;
	spread = 10;
	speed = 1;
}
