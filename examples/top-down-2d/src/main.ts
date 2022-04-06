import './main.css';

import { start } from './application';
import { configure, register } from './setup';
import { createGameScene } from './scenes/game.scene';

// Prepare Canvas
configure();

// Register Components & Systems
register();

// Scene
createGameScene();

// Start loop
start();
