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

// Render on screen
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

const FPS = 144;
const dt = 1 / FPS;
let dz = 1;
let angle = 0;

// Cube
const vs = [
  { x: 0.25, y: 0.25, z: 0.25 },
  { x: -0.25, y: 0.25, z: 0.25 },
  { x: 0.25, y: -0.25, z: 0.25 },
  { x: -0.25, y: -0.25, z: 0.25 },
  { x: 0.25, y: 0.25, z: -0.25 },
  { x: -0.25, y: 0.25, z: -0.25 },
  { x: 0.25, y: -0.25, z: -0.25 },
  { x: -0.25, y: -0.25, z: -0.25 },
];

function animate() {
  //   dz += 1 * dt;
  angle += Math.PI * dt;
  clear();
  for (v of vs) {
    // Render
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
  setTimeout(animate, dt);
}

setTimeout(animate, dt);
