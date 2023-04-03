import PlayScene from "./scenes/playScene";

export const GAME_HEIGHT = 630;
export const GAME_WIDTH = 960;
export const LEVEL_COUNT = 5;
export const NUMBERS_STR = "0123456789X ";
export const MARGIN = 10;
export const GRAVITY = 1200;

export const GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: "phaser-game",
  scene: [PlayScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: GRAVITY },
      debug: false
    }
  }
};
