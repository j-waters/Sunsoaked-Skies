var Point = Phaser.Geom.Point;
var Vector2 = Phaser.Math.Vector2;
console.log("");
function oppositeDirection(direction) {
  switch (direction) {
    case "UP":
      return "DOWN";
    case "DOWN":
      return "UP";
    case "LEFT":
      return "RIGHT";
    case "RIGHT":
      return "LEFT";
  }
}
export default class Room {
  constructor(width, height, inside) {
    this.people = [];
    this.neighbours = [];
    this._width = width;
    this._height = height;
    if (inside == void 0) {
      this.inside = true;
    } else {
      this.inside = inside;
    }
  }
  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
  get outside() {
    return !this.inside;
  }
  addRoom(room, direction, thisPosition, theirPosition) {
    room.setShip(this.ship);
    if (thisPosition == void 0) {
      switch (direction) {
        case "UP":
          thisPosition = new Vector2(0, 0);
          break;
        case "DOWN":
          thisPosition = new Vector2(0, this.height - 1);
          break;
        case "LEFT":
          thisPosition = new Vector2(0, 0);
          break;
        case "RIGHT":
          thisPosition = new Vector2(this.width - 1, 0);
          break;
      }
    }
    if (theirPosition == void 0) {
      theirPosition = new Vector2(0, 0);
    }
    let thisRelation = {
      room,
      direction,
      thisPosition,
      theirPosition,
      mirror: void 0
    };
    let theirRelation = {
      room: this,
      direction: oppositeDirection(direction),
      automatic: true,
      thisPosition: theirPosition,
      theirPosition: thisPosition,
      mirror: void 0
    };
    thisRelation.mirror = theirRelation;
    theirRelation.mirror = thisRelation;
    this.neighbours.push(thisRelation);
    room.neighbours.push(theirRelation);
    return room;
  }
  addRoomUp(room, thisPosition, theirPosition) {
    return this.addRoom(room, "UP", thisPosition, theirPosition);
  }
  addRoomDown(room, thisPosition, theirPosition) {
    return this.addRoom(room, "DOWN", thisPosition, theirPosition);
  }
  addRoomLeft(room, thisPosition, theirPosition) {
    return this.addRoom(room, "LEFT", thisPosition, theirPosition);
  }
  addRoomRight(room, thisPosition, theirPosition) {
    return this.addRoom(room, "RIGHT", thisPosition, theirPosition);
  }
  setGridPosition(x, y) {
    this.gridPosition = {x, y};
  }
  setShip(ship) {
    this.ship = ship;
    this.neighbours.forEach((roomPos) => {
      if (roomPos && !roomPos.room.ship) {
        roomPos.room.setShip(ship);
      }
    });
  }
  addPerson(person, position) {
    if (!this.people.includes(person)) {
      this.people.push(person);
    }
    person.room = this;
    if (position) {
      person.roomPosition = position;
    } else {
      person.roomPosition = new Vector2(this.people.length - 1, this.height - 1);
    }
    return this;
  }
  removePerson(person) {
    this.people.splice(this.people.indexOf(person), 1);
  }
  onPersonLeave() {
    this.people.forEach((person) => {
      if (person.roomPosition.x > this.firstAvailableSpace) {
        person.tasks.addMoveTo(this);
      }
    });
  }
  get firstAvailableSpace() {
    for (let x = 0; x < this.personSlots[this.personSlots.length - 1].length; x++) {
      if (this.personSlots[this.personSlots.length - 1][x] == null) {
        return x;
      }
    }
  }
  get personSlots() {
    let slots = Array(this.height);
    slots.fill(Array(Room.possiblePositions(this.width)).fill(null));
    this.people.forEach((person) => {
      if (person.roomPosition.x % 1 == 0 && person.roomPosition.y % 1 == 0) {
        slots[person.roomPosition.y][person.roomPosition.x] = person;
      }
    });
    return slots;
  }
  static possiblePositions(size) {
    return size == 1 ? 2 : size == 2 ? 3 : 5;
  }
}
