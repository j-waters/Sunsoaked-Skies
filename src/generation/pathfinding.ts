import type Person from '../models/Person';
import type Room from '../models/Room';
import type { RoomRelation } from '../models/Room';
import Point = Phaser.Geom.Point;
import Quarters from '../models/rooms/Quarters';

export default function pathfind(person: Person, targetRoom: Room) {
	let graph = buildGraph(person.room.ship.rooms, person, targetRoom);
	console.log('Graph:', graph);

	let distanceGraph = dijkstra(graph, person);

	let route = getGeneralRoute(distanceGraph, targetRoom);
	console.log(
		'Route:',
		route.map((i) => i),
	);

	return getSpecificRoute(person, route);
}

function getSpecificRoute(person: Person, path: Node[]) {
	let queue: { room: Room; position: Point }[] = [];

	let curNode = path.shift();
	// let curRoom = curNode.room;
	// let curPos = curNode.position;
	while (true) {
		let curPos = roomToPersonPos(curNode.room, curNode.position);
		queue.push({ room: curNode.room, position: curPos });
		let nextNode = path.shift();
		if (nextNode == null) {
			queue.push({
				room: curNode.room,
				position: new Point(curNode.room.people.length, curNode.room.height - 1),
			});
			break;
		}
		let nextPos = roomToPersonPos(nextNode.room, nextNode.position);

		if (curNode.room == nextNode.room) {
			if (nextPos.y < curPos.y) {
				queue.push({
					room: curNode.room,
					position: new Point(nextPos.x, curPos.y),
				});
			} else if (nextPos.y > curPos.y) {
				queue.push({
					room: curNode.room,
					position: new Point(curPos.x, nextPos.y),
				});
			}
		}

		curNode = nextNode;
		// if (nextRoom == null) {
		// 	queue.push({ room: curRoom, position: new Point(curRoom.people.length, 0) });
		// }
		// let nextRoomRelation = curRoom.neighbours.find((roomPos) => roomPos.room == nextRoom);
		// if (!nextRoomRelation) break;
		// let nextPositionInCurrentRoom = doorPosToPersonPos(nextRoomRelation, curRoom);
		//
		// if (nextPositionInCurrentRoom.y > curPos.y) {
		// 	queue.push({ room: curRoom, position: new Point(nextPositionInCurrentRoom.x, curPos.y) });
		// }
		// if (nextPositionInCurrentRoom.y < curPos.y) {
		// 	queue.push({ room: curRoom, position: new Point(curPos.x, nextPositionInCurrentRoom.y) });
		// }
		//
		// queue.push({ room: curRoom, position: nextPositionInCurrentRoom });
		// curRoom = nextRoom;
		// curPos = doorPosToPersonPos(nextRoomRelation.mirror, curRoom);
	}
	return queue;
}

function getGeneralRoute(graph: Node[], target: Room): Node[] {
	let route: Node[] = [];
	let curNode = getNode(graph, target, personToRoomPos(target, new Point(target.people.length, target.height - 1)));
	while (curNode != null) {
		route.unshift(curNode);
		curNode = curNode.routeNode;
	}
	return route;
}

function dijkstra(graph: Node[], person: Person) {
	getNode(graph, person.room, personToRoomPos(person.room, person.roomPosition)).distance = 0;
	// console.log('start node:', getNode(graph, person.room, personToRoomPos(person.room, person.roomPosition)));

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

function buildGraph(rooms: Room[], person: Person, targetRoom: Room) {
	Node.nodes = [];
	let startRoom = person.room;
	let startPosition = personToRoomPos(startRoom, person.roomPosition);
	let graph: Node[] = [];
	rooms.forEach((room) => {
		let roomNodes: Node[] = [];
		if (room === startRoom) {
			let newNode = Node.create(room, startPosition);
			roomNodes.push(newNode);
		}
		if (room == targetRoom) {
			let newNode = Node.create(room, personToRoomPos(room, new Point(room.people.length, room.height - 1)));
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
		// if (room === startRoom) {
		// 	let newNode = Node.create(room, startPosition);
		// 	roomNodes.forEach((rn) => newNode.children.add(rn));
		// 	console.log("current room:", newNode, newNode.children);
		// 	console.log("room nodes:", roomNodes, roomNodes.length);
		// 	roomNodes.push(newNode);
		// }
		graph.push(...roomNodes);
	});
	return graph;
}

function createDoorNode(room: Room, relation: RoomRelation): Node {
	let position = relation.thisPosition;

	switch (relation.direction) {
		case 'LEFT':
			position = personToRoomPos(room, new Point(0, position.y));
			break;
		case 'RIGHT':
			position = personToRoomPos(room, new Point(possiblePositions(room.width) - 1, position.y));
			break;
		default:
			break;
	}
	let node = Node.create(room, position);
	// if (room instanceof Quarters) {
	// 	console.log('==', node, position, relation);
	// }
	return node;
}

function getNode(graph: Node[], room: Room, position?: Point) {
	return graph.find((node) => {
		return node.room == room && (!position || Point.Equals(node.position, position));
	});
}

class Node {
	room: Room;
	position: Point;
	distance: number;
	children: Set<Node>;
	routeNode: Node;

	static nodes: Node[] = [];

	private constructor(room: Room, position: Point) {
		this.room = room;
		this.position = position;
		this.distance = Infinity;
		this.children = new Set<Node>();
	}

	static create(room: Room, position: Point): Node {
		let existing = this.nodes.find((node) => node.room == room && Point.Equals(node.position, position));
		if (existing) {
			return existing;
		}
		let newNode = new Node(room, position);
		this.nodes.push(newNode);
		return newNode;
	}
}

export function possiblePositions(size: number) {
	return size == 1 ? 2 : size == 2 ? 3 : 5;
}

function roomToPersonPos(room: Room, position: Point) {
	if (room.width == 1) {
		return new Point((1 + 4 * position.x) / 2, position.y);
	}
	if (room.width == 2) {
		return new Point(position.x * 2, position.y);
	}
	if (room.width == 3) {
		// return new Point(((position.x + 1) / 4) * possiblePositions(3), position.y);
		return new Point((5 * room.width + 10 * room.width * position.x - 6) / (6 * room.width), position.y);
	}
}

function personToRoomPos(room: Room, position: Point) {
	if (room.width == 1) {
		return new Point((2 * position.x - 1) / 4, position.y);
	}
	if (room.width == 2) {
		return new Point(position.x / 2, position.y);
	}
	if (room.width == 3) {
		return new Point((6 * position.x * room.width + 6 - 5 * room.width) / (10 * room.width), position.y);
	}
}
