console.log(game);
game.height = 800;
game.width = 800;
const ctx = game.getContext("2d");

const BACKGROUND = "#343A50";
const FOREGROUND = "#50FF50";
const size = 10;

// Clear screen
function clear() {
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, game.width, game.height);
}

// Render point on screen
function point({ x, y }) {
  ctx.fillStyle = FOREGROUND;
  ctx.fillRect(x - size / 2, y - size / 2, size, size);
}

// Translate from math to Html canvas coordinates
function screen({ x, y }) {
  // -1..1 => 0..2 => 0..1 => 0..w/h
  return {
    x: ((x + 1) / 2) * game.width,
    y: (1 - (y + 1) / 2) * game.height,
  };
}

// Project onto screen
function project({ x, y, z }) {
  return {
    x: x / z,
    y: y / z,
  };
}

// Push entire thing in Z direction
function translate_z({ x, y, z }, dz) {
  return {
    x,
    y,
    z: z + dz,
  };
}

// Rotate point by angle
function rotate_xz({ x, y, z }, angle) {
  const s = Math.sin(angle);
  const c = Math.cos(angle);
  return {
    x: x * c - z * s,
    y,
    z: x * s + z * c,
  };
}

// Draw line b/w two points
function connect(p1, p2) {
  ctx.lineWidth = 3;
  ctx.strokeStyle = FOREGROUND;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}

const FPS = 144;
const dt = 1 / FPS;
let dz = 1;
let angle = 0;

// Cube
const vs = [
  { x: 0.25, y: 0.25, z: 0.25 },
  { x: -0.25, y: 0.25, z: 0.25 },
  { x: -0.25, y: -0.25, z: 0.25 },
  { x: 0.25, y: -0.25, z: 0.25 },

  { x: 0.25, y: 0.25, z: -0.25 },
  { x: -0.25, y: 0.25, z: -0.25 },
  { x: -0.25, y: -0.25, z: -0.25 },
  { x: 0.25, y: -0.25, z: -0.25 },
];

const lines = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

function animate() {
  //   dz += 1 * dt;
  angle += Math.PI * dt;
  clear();
  for (v of vs) {
    // Render point
    point(
      // Translate to HTML coordinates
      screen(
        // Project Z in X,Y screen
        project(
          // Push in Z
          translate_z(
            // Rotate cube
            rotate_xz(v, angle),
            dz
          )
        )
      )
    );
  }
  for (l of lines) {
    for (let i = 0; i < l.length; i++) {
      const p1 = vs[l[i]];
      const p2 = vs[l[(i + 1) % l.length]];
      connect(
        screen(project(translate_z(rotate_xz(p1, angle), dz))),
        screen(project(translate_z(rotate_xz(p2, angle), dz)))
      );
    }
  }
  setTimeout(animate, dt);
}

setTimeout(animate, dt);
