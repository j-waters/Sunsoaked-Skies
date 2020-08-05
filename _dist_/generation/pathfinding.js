import Room2 from "../models/Room.js";
var Point = Phaser.Geom.Point;
var Vector2 = Phaser.Math.Vector2;
export default function pathfind(person, targetRoom, targetPosition) {
  let target = {
    room: targetRoom,
    position: targetPosition || new Vector2(targetRoom.firstAvailableSpace, targetRoom.height - 1)
  };
  let graph = buildGraph(person.room.ship.rooms, person, target);
  let distanceGraph = dijkstra(graph, person);
  let route = getGeneralRoute(distanceGraph, target);
  console.log("Route:", route.map((i) => i));
  return getSpecificRoute(person, route);
}
function getSpecificRoute(person, path) {
  let queue = [];
  let curNode = path.shift();
  while (true) {
    let curPos = roomToPersonPos(curNode.room, curNode.position);
    queue.push({room: curNode.room, position: curPos});
    let nextNode = path.shift();
    if (nextNode == null) {
      break;
    }
    let nextPos = roomToPersonPos(nextNode.room, nextNode.position);
    if (curNode.room == nextNode.room) {
      if (nextPos.y < curPos.y) {
        queue.push({
          room: curNode.room,
          position: new Vector2(nextPos.x, curPos.y)
        });
      } else if (nextPos.y > curPos.y) {
        queue.push({
          room: curNode.room,
          position: new Vector2(curPos.x, nextPos.y)
        });
      }
    }
    curNode = nextNode;
  }
  return queue;
}
function getGeneralRoute(graph, target) {
  let route = [];
  let curNode = getNode(graph, target.room, personToRoomPos(target.room, target.position));
  while (curNode != null) {
    route.unshift(curNode);
    curNode = curNode.routeNode;
  }
  return route;
}
function dijkstra(graph, person) {
  getNode(graph, person.room, personToRoomPos(person.room, person.roomPosition)).distance = 0;
  let queue = graph.map((item) => item);
  while (queue.length > 0) {
    queue = queue.sort((a, b) => a.distance - b.distance);
    let node = queue.shift();
    node.children.forEach((childNode) => {
      let newDistance = node.distance + 1;
      if (newDistance < childNode.distance) {
        childNode.distance = newDistance;
        childNode.routeNode = node;
      }
    });
  }
  return graph;
}
function buildGraph(rooms, person, target) {
  Node.nodes = [];
  let startRoom = person.room;
  let startPosition = personToRoomPos(startRoom, person.roomPosition);
  let graph = [];
  rooms.forEach((room) => {
    let roomNodes = [];
    if (room === startRoom) {
      let newNode = Node.create(room, startPosition);
      roomNodes.push(newNode);
    }
    if (room == target.room) {
      let newNode = Node.create(room, personToRoomPos(room, target.position));
      roomNodes.push(newNode);
    }
    room.neighbours.forEach((neighbour) => {
      let newNode = createDoorNode(room, neighbour);
      newNode.children.add(createDoorNode(neighbour.room, neighbour.mirror));
      roomNodes.forEach((roomNode) => {
        roomNode.children.add(newNode);
        newNode.children.add(roomNode);
      });
      roomNodes.push(newNode);
    });
    graph.push(...roomNodes);
  });
  return graph;
}
function createDoorNode(room, relation) {
  let position = relation.thisPosition;
  switch (relation.direction) {
    case "LEFT":
      position = personToRoomPos(room, new Vector2(0, position.y));
      break;
    case "RIGHT":
      position = personToRoomPos(room, new Vector2(Room2.possiblePositions(room.width) - 1, position.y));
      break;
    default:
      break;
  }
  let node = Node.create(room, position);
  return node;
}
function getNode(graph, room, position) {
  return graph.find((node) => {
    return node.room == room && (!position || node.position.equals(position));
  });
}
class Node {
  constructor(room, position) {
    this.room = room;
    this.position = position;
    this.distance = Infinity;
    this.children = new Set();
  }
  static create(room, position) {
    let existing = this.nodes.find((node) => node.room == room && node.position.equals(position));
    if (existing) {
      return existing;
    }
    let newNode = new Node(room, position);
    this.nodes.push(newNode);
    return newNode;
  }
}
Node.nodes = [];
function roomToPersonPos(room, position) {
  if (room.width == 1) {
    return new Vector2((1 + 4 * position.x) / 2, position.y);
  }
  if (room.width == 2) {
    return new Vector2(position.x * 2, position.y);
  }
  if (room.width == 3) {
    return new Vector2((5 * room.width + 10 * room.width * position.x - 6) / (6 * room.width), position.y);
  }
}
function personToRoomPos(room, position) {
  if (room.width == 1) {
    return new Vector2((2 * position.x - 1) / 4, position.y);
  }
  if (room.width == 2) {
    return new Vector2(position.x / 2, position.y);
  }
  if (room.width == 3) {
    return new Vector2((6 * position.x * room.width + 6 - 5 * room.width) / (10 * room.width), position.y);
  }
}
