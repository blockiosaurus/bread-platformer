export const loadImages = function (scene: any) {
  scene.load.image("background", "./assets/images/kitchen_background.png");
  scene.load.image("ground", "./assets/images/counter.png");
  scene.load.image("grass:8x1", "./assets/images/counter_8x1.png");
  scene.load.image("grass:6x1", "./assets/images/counter_6x1.png");
  scene.load.image("grass:4x1", "./assets/images/counter_4x1.png");
  scene.load.image("grass:2x1", "./assets/images/counter_2x1.png");
  scene.load.image("grass:1x1", "./assets/images/counter_1x1.png");
  scene.load.image(
    "invisible-wall",
    "./assets/images/invisible_wall.png"
  );
  scene.load.image("icon:coin", "./assets/images/coin_icon.png");
  scene.load.image("font:numbers", "./assets/images/numbers.png");
  scene.load.image("key", "./assets/images/key.png");
};

export const loadSpritesheets = function (scene: any) {
  scene.load.spritesheet("coin", "./assets/images/coin_animated.png", {
    frameWidth: 22,
    frameHeight: 22
  });
  scene.load.spritesheet("spider", "./assets/images/spider.png", {
    frameWidth: 42,
    frameHeight: 32
  });
  scene.load.spritesheet("mouse", "./assets/images/mouse.png", {
    frameWidth: 59,
    frameHeight: 35
  });
  scene.load.spritesheet("rat", "./assets/images/rat.png", {
    frameWidth: 236,
    frameHeight: 140
  });
  scene.load.spritesheet("fly", "./assets/images/fly.png", {
    frameWidth: 65,
    frameHeight: 45
  });
  scene.load.spritesheet("hero", "./assets/images/hero.png", {
    frameWidth: 36,
    frameHeight: 42
  });
  scene.load.spritesheet("bread", "./assets/images/bread.png", {
    frameWidth: 32,
    frameHeight: 32
  });
  scene.load.spritesheet("door", "./assets/images/door.png", {
    frameWidth: 42,
    frameHeight: 66
  });
  scene.load.spritesheet("icon:key", "./assets/images/key_icon.png", {
    frameWidth: 34,
    frameHeight: 30
  });
  scene.load.spritesheet("decoration", "./assets/images/decor.png", {
    frameWidth: 42,
    frameHeight: 42
  });
};

export const loadAudio = function (scene: any) {
  scene.load.audio("sfx:jump", "./assets/audio/jump.wav");
  scene.load.audio("sfx:coin", "./assets/audio/coin.wav");
  scene.load.audio("sfx:stomp", "./assets/audio/stomp.wav");
  scene.load.audio("sfx:key", "./assets/audio/key.wav");
  scene.load.audio("sfx:door", "./assets/audio/door.wav");
  scene.load.audio("bgm", [
    "./assets/audio/bgm.mp3",
    "./assets/audio/bgm.ogg"
  ]);
};

export const loadLevels = function (scene: any) {
  scene.load.json("level:0", "./assets/data/level00.json");
  scene.load.json("level:1", "./assets/data/level01.json");
  scene.load.json("level:2", "./assets/data/level02.json");
  scene.load.json("level:3", "./assets/data/level03.json");
  scene.load.json("level:4", "./assets/data/level04.json");
};

export const createSfx = function (scene: any) {
  const sfx = {
    key: scene.sound.add("sfx:key"),
    door: scene.sound.add("sfx:door"),
    jump: scene.sound.add("sfx:jump"),
    coin: scene.sound.add("sfx:coin"),
    stomp: scene.sound.add("sfx:stomp"),
    bgm: scene.sound.add("bgm")
  };

  return sfx;
};
