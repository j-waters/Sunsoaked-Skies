import ShipHull from '../ShipHull';

export default abstract class Selectable {
	abstract get selected();

	abstract select();

	abstract deselect();
}
