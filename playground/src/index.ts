import 'core-js';
import { start } from './application';
import { physic2DSystem } from './core/systems';
import { startScene, gameScene, gameOverScene } from './scenes';
import { viewport } from './core/config';

// Configuration
document.body.style.display = 'flex';
document.body.style.alignItems = 'center';
document.body.style.flexDirection = 'column';
document.body.style.justifyContent = 'center';
document.body.style.alignContent = 'center';

const root = document.getElementById('root') as HTMLCanvasElement;
root.width = viewport.width;
root.height = viewport.height;
root.style.width = viewport.width + 'px';
root.style.height = viewport.height + 'px';

// @ts-expect-error: only for test purpose
global.ctx = root.getContext('2d')!;

// Register components and systems
import './register';

// Start loop
start();

// Start Game
let scene: 'start' | 'game' | 'game-over' = 'start';
startScene();

function pointerDown(event: any): void {
  if (event.code === 'Space') {
    if (scene === 'game') {
      physic2DSystem.state.tap = true;
    }
  }
}

function pointerUp(event: any): void {
  if (event.code === 'Space') {
    if (scene === 'start') {
      scene = 'game';
      gameScene((): void => {
        gameOverScene();
        scene = 'game-over';
      });
    } else if (scene === 'game') {
      physic2DSystem.state.tap = false;
    } else if (scene === 'game-over') {
      physic2DSystem.state.tap = false;
      startScene();
      scene = 'start';
    }
  }
}

window.addEventListener('keydown', pointerDown);
window.addEventListener('keyup', pointerUp);
window.addEventListener('touchstart', pointerDown);
window.addEventListener('touchend', pointerUp);
