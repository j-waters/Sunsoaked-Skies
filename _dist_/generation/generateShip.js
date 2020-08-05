import Ship2 from "../models/Ship.js";
var Point = Phaser.Geom.Point;
var Color = Phaser.Display.Color;
var RND = Phaser.Math.RND;
var RandomDataGenerator = Phaser.Math.RandomDataGenerator;
import GenerationSettings from "./generationSettings.js";
import Empty2 from "../models/rooms/Empty.js";
var Vector2 = Phaser.Math.Vector2;
console.log("");
export function generateGrid(room, grid, x, y) {
  let xMod = 0;
  let yMod = 0;
  function addToGrid(value, grid2, x2, y2) {
    for (let yi = y2; yi < 0; yi++) {
      grid2.unshift([]);
      for (let i = 0; i < grid2[1].length; i++) {
        grid2[grid2.length - 1].push(null);
      }
      yMod += 1;
    }
    for (let xi = x2; xi < 0; xi++) {
      for (let i = 0; i <= y2; i++) {
        grid2[i].unshift(null);
      }
      xMod += 1;
    }
    while (grid2.length <= y2) {
      grid2.push([]);
      for (let i = 0; i < grid2[0].length; i++) {
        grid2[grid2.length - 1].push(null);
      }
    }
    while (grid2[0].length <= x2) {
      for (let i = 0; i <= y2; i++) {
        grid2[i].push(null);
      }
    }
    grid2[y2 + yMod][x2 + xMod] = value;
  }
  if (grid == void 0) {
    grid = [];
    x = 0;
    y = 0;
  }
  for (let yi = y; yi < y + room.height; yi++) {
    for (let xi = x; xi < x + room.width; xi++) {
      addToGrid(room, grid, xi, yi);
    }
  }
  room.neighbours.filter((neighbour) => !neighbour.automatic).forEach((neighbour) => {
    switch (neighbour.direction) {
      case "UP":
        generateGrid(neighbour.room, grid, x + neighbour.thisPosition.x - neighbour.theirPosition.x, y - neighbour.room.height);
        break;
      case "DOWN":
        generateGrid(neighbour.room, grid, x + neighbour.thisPosition.x - neighbour.theirPosition.x, y + room.height);
        break;
      case "LEFT":
        generateGrid(neighbour.room, grid, x - neighbour.room.width, y + neighbour.thisPosition.y - neighbour.theirPosition.y);
        break;
      case "RIGHT":
        generateGrid(neighbour.room, grid, x + room.width, y + neighbour.thisPosition.y - neighbour.theirPosition.y);
        break;
    }
  });
  return grid;
}
export function generateTopDownShipGraphic(ship) {
  let canvas = document.createElement("canvas");
  canvas.width = 20;
  canvas.height = 30;
  let context = canvas.getContext("2d");
  context.fillStyle = "brown";
  context.fillRect(0, 0, 20, 30);
  return canvas;
}
export function generateShipGraphic(ship, generationSettings4) {
  let hull = generateHullGraphic(ship, null);
  let balloon = generateBalloonGraphic(ship, generationSettings4);
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");
  canvas.width = Math.max(hull.width, balloon.width);
  canvas.height = hull.height + balloon.height + 20;
  let balloonLines = generateBalloonLines(hull.width, canvas.height);
  context.drawImage(balloonLines, 0, balloon.height / 2);
  context.drawImage(balloon, 0, 0);
  context.drawImage(hull, 0, balloon.height + 20);
  return canvas;
}
export function generateHullGraphic(ship, generationSettings4, seed) {
  let grid = generateGrid(ship.rootRoom);
  let canvas = document.createElement("canvas");
  canvas.width = grid[0].length * generationSettings4.roomSizeMargin + generationSettings4.margin * 2 + generationSettings4.strokeThickness;
  canvas.height = grid.length * generationSettings4.roomSizeMargin + generationSettings4.margin * 2 + generationSettings4.strokeThickness;
  let context = canvas.getContext("2d");
  context.lineWidth = generationSettings4.strokeThickness;
  context.lineJoin = "bevel";
  context.strokeStyle = "#6b4a31";
  let path = generateOutlinePath(grid, generationSettings4);
  context.stroke(path);
  context.clip(path);
  let background = generateBackgroundGraphic(canvas.width, canvas.height, seed);
  context.drawImage(background, 0, 0);
  return canvas;
}
function generateBackgroundGraphic(width, height, seed) {
  let canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  let context = canvas.getContext("2d");
  const plankHeight = 15;
  const maxDarken = 20;
  let rnd = new RandomDataGenerator(seed);
  context.strokeStyle = "#6b4a31";
  context.lineWidth = 0.1;
  for (let y = 0; y < height; y += plankHeight) {
    let x = 0;
    while (x < width) {
      let plankWidth = rnd.integerInRange(50, width * 0.5);
      let colour = Color.HexStringToColor("#b27450");
      let darkenAmount = y / height * maxDarken * rnd.realInRange(0.8, 1.5) / 1.5;
      colour.darken(Math.round(darkenAmount) * 1.5);
      context.fillStyle = colour.rgba;
      context.fillRect(x, y, plankWidth, plankHeight);
      context.strokeRect(x, y, plankWidth, plankHeight);
      x += plankWidth;
    }
  }
  return canvas;
}
function generateBalloonGraphic(ship, generationSettings4, seed) {
  let canvas = document.createElement("canvas");
  let grid = generateGrid(ship.rootRoom);
  canvas.width = grid[0].length * generationSettings4.roomSizeMargin + generationSettings4.margin * 2 + generationSettings4.strokeThickness;
  canvas.height = (grid.length * generationSettings4.roomSizeMargin + generationSettings4.margin * 2 + generationSettings4.strokeThickness) / 2;
  let context = canvas.getContext("2d");
  let colour = Color.RandomRGB();
  context.fillStyle = colour.rgba;
  context.strokeStyle = colour.darken(10).rgba;
  context.ellipse(canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2, 0, 0, Math.PI * 2);
  context.stroke();
  context.fill();
  return canvas;
}
function generateBalloonLines(width, height, seed) {
  let canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height / 1.5;
  let context = canvas.getContext("2d");
  let rnd = new RandomDataGenerator(seed);
  for (let i = 0; i < 5; i++) {
    context.beginPath();
    context.moveTo(width / 5 * i + rnd.realInRange(10, 60), 0);
    context.lineTo(width / 5 * i + rnd.realInRange(10, 60), canvas.height);
    context.stroke();
  }
  return canvas;
}
function generateOutlinePath(grid, generationSettings4) {
  for (let yPos = 0; yPos < grid.length; yPos++) {
    for (let xPos = 0; xPos < grid[0].length; xPos++) {
      if (grid[yPos][xPos] != null && grid[yPos][xPos].inside) {
        let path = new Path2D();
        roomLines(grid, xPos, yPos, true, "TOP", path, generationSettings4);
        path.closePath();
        return path;
      }
    }
  }
}
function roomLines(grid, xPos, yPos, starting, direction, path, generationSettings4, startPoint) {
  let room = grid[yPos][xPos];
  let surrounding = surroundingRooms(grid, xPos, yPos, false);
  let topLeft = new Vector2(generationSettings4.margin + xPos * generationSettings4.roomSizeMargin + generationSettings4.strokeThickness / 2, generationSettings4.margin + yPos * generationSettings4.roomSizeMargin + generationSettings4.strokeThickness / 2);
  let bottomRight = new Vector2(topLeft.x + generationSettings4.roomSizeMargin, topLeft.y + generationSettings4.roomSizeMargin);
  if (surrounding[0][1] == null || surrounding[0][1].outside) {
    topLeft.y -= generationSettings4.margin;
  }
  if (surrounding[1][0] == null) {
    topLeft.x -= generationSettings4.margin;
  }
  if (surrounding[0][0] != null && surrounding[1][0] == null) {
    topLeft.y += generationSettings4.margin - generationSettings4.roomMargin;
  }
  if (surrounding[1][2] == null) {
    bottomRight.x += generationSettings4.margin - generationSettings4.roomMargin;
  }
  if (surrounding[2][1] == null) {
    bottomRight.y += generationSettings4.margin - generationSettings4.roomMargin;
  }
  let topRight = new Vector2(bottomRight.x, topLeft.y);
  let bottomLeft = new Vector2(topLeft.x, bottomRight.y);
  if (surrounding[2][0]) {
    bottomLeft.x += generationSettings4.margin - generationSettings4.roomMargin;
  }
  if (surrounding[0][2]) {
    topRight.x -= generationSettings4.margin;
  }
  if (surrounding[2][2]) {
    bottomRight.y -= generationSettings4.margin;
  }
  if (starting) {
    path.moveTo(topLeft.x, topLeft.y);
    startPoint = topLeft;
  }
  const pixelMod = 0.333;
  switch (direction) {
    case "LEFT":
      if (surrounding[1][0] == null || surrounding[1][0].outside) {
        path.lineTo(topLeft.x + pixelMod, topLeft.y + pixelMod);
        if (!starting && startPoint.equals(topLeft)) {
          return;
        }
      }
      if (surrounding[0][0]) {
        roomLines(grid, xPos - 1, yPos - 1, false, "BOTTOM", path, generationSettings4, startPoint);
        return;
      }
      if (surrounding[0][1]) {
        roomLines(grid, xPos, yPos - 1, false, "LEFT", path, generationSettings4, startPoint);
        return;
      }
      roomLines(grid, xPos, yPos, false, "TOP", path, generationSettings4, startPoint);
      return;
    case "RIGHT":
      if (surrounding[1][2] == null || surrounding[1][2].outside) {
        path.lineTo(bottomRight.x + pixelMod, bottomRight.y + pixelMod);
        if (!starting && startPoint.equals(bottomRight)) {
          return;
        }
      }
      if (surrounding[2][2]) {
        roomLines(grid, xPos + 1, yPos + 1, false, "TOP", path, generationSettings4, startPoint);
        return;
      }
      if (surrounding[2][1]) {
        roomLines(grid, xPos, yPos + 1, false, "RIGHT", path, generationSettings4, startPoint);
        return;
      }
      roomLines(grid, xPos, yPos, false, "BOTTOM", path, generationSettings4, startPoint);
      return;
    case "TOP":
      if (surrounding[0][1] == null || surrounding[0][1].outside) {
        path.lineTo(topRight.x + pixelMod, topRight.y + pixelMod);
        if (!starting && startPoint.equals(topRight)) {
          return;
        }
      }
      if (surrounding[0][2]) {
        roomLines(grid, xPos + 1, yPos - 1, false, "LEFT", path, generationSettings4, startPoint);
        return;
      }
      if (surrounding[1][2]) {
        roomLines(grid, xPos + 1, yPos, false, "TOP", path, generationSettings4, startPoint);
        return;
      }
      roomLines(grid, xPos, yPos, false, "RIGHT", path, generationSettings4, startPoint);
      return;
    case "BOTTOM":
      if (surrounding[2][1] == null || surrounding[2][1].outside) {
        if (surrounding[2][0] != null && surrounding[3][1] == null) {
          path.bezierCurveTo(bottomRight.x + pixelMod, bottomRight.y + pixelMod, bottomRight.x + pixelMod, bottomRight.y + generationSettings4.roomSizeMargin + pixelMod, bottomLeft.x + pixelMod, bottomLeft.y + generationSettings4.roomSizeMargin + pixelMod);
        } else {
          path.lineTo(bottomLeft.x + pixelMod, bottomLeft.y + pixelMod);
          if (!starting && startPoint.equals(bottomLeft)) {
            return;
          }
        }
      }
      if (surrounding[2][0]) {
        roomLines(grid, xPos - 1, yPos + 1, false, "RIGHT", path, generationSettings4, startPoint);
        return;
      }
      if (surrounding[1][0]) {
        roomLines(grid, xPos - 1, yPos, false, "BOTTOM", path, generationSettings4, startPoint);
        return;
      }
      roomLines(grid, xPos, yPos, false, "LEFT", path, generationSettings4, startPoint);
      return;
  }
}
function surroundingRooms(grid, x, y, allowOutside) {
  let surrounding = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ];
  surrounding[0][0] = x > 0 && y > 0 ? grid[y - 1][x - 1] : null;
  surrounding[0][1] = y > 0 ? grid[y - 1][x] : null;
  surrounding[0][2] = x < grid[0].length - 1 && y > 0 ? grid[y - 1][x + 1] : null;
  surrounding[1][0] = x > 0 ? grid[y][x - 1] : null;
  surrounding[1][1] = grid[y][x];
  surrounding[1][2] = x < grid[0].length - 1 ? grid[y][x + 1] : null;
  surrounding[2][0] = x > 0 && y < grid.length - 1 ? grid[y + 1][x - 1] : null;
  surrounding[2][1] = y < grid.length - 1 ? grid[y + 1][x] : null;
  surrounding[2][2] = x < grid[0].length - 1 && y < grid.length - 1 ? grid[y + 1][x + 1] : null;
  surrounding[3][0] = x > 0 && y < grid.length - 2 ? grid[y + 2][x - 1] : null;
  surrounding[3][1] = y < grid.length - 2 ? grid[y + 2][x] : null;
  surrounding[3][2] = x < grid[0].length - 1 && y < grid.length - 2 ? grid[y + 2][x + 1] : null;
  if (!allowOutside) {
    surrounding = surrounding.map((row) => {
      return row.map((room) => {
        return room && room.inside ? room : null;
      });
    });
  }
  return surrounding;
}
export function generateMenuShip() {
  let shipBuilder = Ship2.builder();
  let root = shipBuilder.createRootRoom(new Empty2(1, 1));
  root.addRoomDown(new Empty2(2, 1)).addRoomDown(new Empty2(1, 1));
  return generateShipGraphic(shipBuilder.build(), new GenerationSettings(1));
}
