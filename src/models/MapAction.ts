export default class MapAction {
	icon: string;
	selected: boolean = false;
}

export class MovementAction implements MapAction {
	icon: string;
	selected: boolean;
}
