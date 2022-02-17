import { world } from '@equal/ecs';
import Stats from 'stats.js';

const stats = new Stats();
stats.showPanel(0);

const element = document.body.appendChild(stats.dom);
element.style.marginTop = '64px';
element.style.marginLeft = '64px';

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

function loop(timestamp: number): void {
  // Example: 16.6666ms
  const elapsedTime = Math.max(0, timestamp - state.previousTime);
  // Example: 0.016666s
  const deltaTime = elapsedTime / 1000;

  // Example: 60.0
  // state.fps = 1000 / elapsedTime;
  state.previousTime = timestamp;

  stats.begin();

  world.tick(deltaTime);

  stats.end();

  requestAnimationFrame(loop);
}
