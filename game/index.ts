import 'phaser';
import { GameConfig } from './config';

export class GameClass extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

// window.addEventListener('load', () => {
//   const game = new GameClass(GameConfig);
// });
