import type Person from '../models/Person';
import Room from '../models/Room';
import type { RoomRelation } from '../models/Room';
import Point = Phaser.Geom.Point;
import Quarters from '../models/rooms/Quarters';
import Vector2 = Phaser.Math.Vector2;

export default function pathfind(person: Person, targetRoom: Room, targetPosition?: Vector2): RouteStep[] {
	let target: Target = {
		room: targetRoom,
		position: targetPosition || new Vector2(targetRoom.firstAvailableSpace, targetRoom.height - 1),
	};
	let graph = buildGraph(person.room.ship.rooms, person, target);
	// console.log('Graph:', graph);

	let distanceGraph = dijkstra(graph, person);

	let route = getGeneralRoute(distanceGraph, target);
	console.log(
		'Route:',
		route.map((i) => i),
	);

	return getSpecificRoute(person, route);
}

export type RouteStep = { room: Room; position: Vector2 };
type Target = { room: Room; position: Vector2 };

function getSpecificRoute(person: Person, path: Node[]): RouteStep[] {
	let queue: RouteStep[] = [];

	let curNode = path.shift();
	// let curRoom = curNode.room;
	// let curPos = curNode.position;
	while (true) {
		let curPos = roomToPersonPos(curNode.room, curNode.position);
		queue.push({ room: curNode.room, position: curPos });
		let nextNode = path.shift();
		if (nextNode == null) {
			break;
		}
		let nextPos = roomToPersonPos(nextNode.room, nextNode.position);

		if (curNode.room == nextNode.room) {
			if (nextPos.y < curPos.y) {
				queue.push({
					room: curNode.room,
					position: new Vector2(nextPos.x, curPos.y),
				});
			} else if (nextPos.y > curPos.y) {
				queue.push({
					room: curNode.room,
					position: new Vector2(curPos.x, nextPos.y),
				});
			}
		}
		curNode = nextNode;
	}
	return queue;
}

function getGeneralRoute(graph: Node[], target: Target): Node[] {
	let route: Node[] = [];
	let curNode = getNode(graph, target.room, personToRoomPos(target.room, target.position));
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

function buildGraph(rooms: Room[], person: Person, target: Target) {
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

function createDoorNode(room: Room, relation: RoomRelation): Node {
	let position = relation.thisPosition;

	switch (relation.direction) {
		case 'LEFT':
			position = personToRoomPos(room, new Vector2(0, position.y));
			break;
		case 'RIGHT':
			position = personToRoomPos(room, new Vector2(Room.possiblePositions(room.width) - 1, position.y));
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

function getNode(graph: Node[], room: Room, position?: Vector2) {
	return graph.find((node) => {
		return node.room == room && (!position || node.position.equals(position));
	});
}

class Node {
	room: Room;
	position: Vector2;
	distance: number;
	children: Set<Node>;
	routeNode: Node;

	static nodes: Node[] = [];

	private constructor(room: Room, position: Vector2) {
		this.room = room;
		this.position = position;
		this.distance = Infinity;
		this.children = new Set<Node>();
	}

	static create(room: Room, position: Vector2): Node {
		let existing = this.nodes.find((node) => node.room == room && node.position.equals(position));
		if (existing) {
			return existing;
		}
		let newNode = new Node(room, position);
		this.nodes.push(newNode);
		return newNode;
	}
}

function roomToPersonPos(room: Room, position: Vector2) {
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

function personToRoomPos(room: Room, position: Vector2) {
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
