import type Room from './Room';
import type Person from './Person';
import pathfind, { RouteStep } from '../generation/pathfinding';

export class TaskManager {
	_queue: Task[];
	finished: Task[];
	readonly person: Person;

	constructor(person: Person) {
		this.person = person;
		this._queue = [];
		this.finished = [];
	}

	addMoveTo(target: Room) {
		this._queue.push(new MoveTask(this, target));
	}

	clear() {
		this._queue.length = 0;
	}

	get queue() {
		return this._queue;
	}

	get current() {
		return this._queue[0];
	}

	complete(task: Task) {
		this.queue.splice(this.queue.indexOf(task), 1);
		this.finished.push(task);
		task.isComplete = true;
	}
}

export abstract class Task {
	manager: TaskManager;
	total: number;
	_progress: number;
	isComplete: boolean;

	protected constructor(manager: TaskManager) {
		this.manager = manager;
		this._progress = 0;
		this.total = 1;
		this.isComplete = false;
	}

	complete() {
		this.manager.complete(this);
	}

	get progress() {
		return this._progress / this.total;
	}

	set progress(val) {
		this._progress = val;
	}

	get person() {
		return this.manager.person;
	}
}

export class MoveTask extends Task {
	private readonly target: Room;
	private _route: RouteStep[];

	constructor(manager: TaskManager, target: Room) {
		super(manager);
		this.target = target;
	}

	get currentTarget(): RouteStep {
		if (!this._route) {
			this._route = pathfind(this.person, this.target);
			console.log(
				'specific route: ',
				this._route.map((i) => i),
			);
			this.total = this._route.length;
		}
		return this._route[0];
	}

	completeStep() {
		const oldRoom = this.person.room;
		this.person.setRoom(this.currentTarget.room, this.currentTarget.position);
		if (this.person.room != oldRoom) {
			oldRoom.onPersonLeave();
		}
		this.progress += 1;
		this._route.shift();
		if (!this._route.length) {
			this.complete();
		}
	}
}
