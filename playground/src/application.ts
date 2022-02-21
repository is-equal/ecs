import { world } from '@equal/ecs';

interface ApplicationState {
  processId: number;
  fps: number;
  previousTime: number;
}

const state: ApplicationState = {
  processId: -1,
  fps: 0.0,
  previousTime: performance.now(),
};

export function start(): void {
  state.processId = requestAnimationFrame(loop);
}

export function stop(): void {
  cancelAnimationFrame(state.processId);
  state.processId = -1;
}

const fpsValues: number[] = [];

async function updateFPS(fps: number): Promise<void> {
  fpsValues.push(fps);

  if (fpsValues.length > 100) {
    fpsValues.shift();
  }

  const fpsAVG = (fpsValues.reduce((v, n) => v + n, 0) / fpsValues.length) | 0;
  const deltaTimeAVG = String(1 / fpsAVG).slice(0, 5);

  const debug = document.getElementById('debug')!;
  debug.textContent = `FPS: ${fpsAVG} | Delta Time: ${deltaTimeAVG}`;
}

function loop(timestamp: number): void {
  // Example: 16.6666ms
  const elapsedTime = Math.max(0, timestamp - state.previousTime);
  // Example: 0.016666s
  const deltaTime = elapsedTime / 1000;

  // Example: 60.0
  state.fps = 1000 / elapsedTime;
  void updateFPS(state.fps);
  state.previousTime = timestamp;

  world.tick(deltaTime);

  requestAnimationFrame(loop);
}
