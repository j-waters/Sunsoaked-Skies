import Room from '../Room';

export default class Empty extends Room {
	get name(): string {
		return '';
	}
}
