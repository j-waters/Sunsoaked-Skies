import pathfind from "../generation/pathfinding.js";
export class TaskManager {
  constructor(person) {
    this.person = person;
    this._queue = [];
    this.finished = [];
  }
  addMoveTo(target) {
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
  complete(task) {
    this.queue.splice(this.queue.indexOf(task), 1);
    this.finished.push(task);
    task.isComplete = true;
  }
}
export class Task {
  constructor(manager) {
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
  constructor(manager, target) {
    super(manager);
    this.target = target;
  }
  get currentTarget() {
    if (!this._route) {
      this._route = pathfind(this.person, this.target);
      console.log("specific route: ", this._route.map((i) => i));
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
