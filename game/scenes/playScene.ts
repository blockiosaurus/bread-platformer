// @ts-nocheck

import { LEVEL_COUNT, NUMBERS_STR, MARGIN } from "../config";
import { Scene } from "phaser";
import {
  loadImages,
  loadSpritesheets,
  loadAudio,
  loadLevels,
  createSfx
} from "../helpers";
import Hero from "../characters/Hero";
import Spider from "../characters/Spider";
import Mouse from "../characters/Mouse";
import Rat from "../characters/Rat";
import Fly from "../characters/Fly";
import { useWallet } from "@solana/wallet-adapter-react";

class PlayScene extends Scene {
  private triggerTimer: Phaser.Time.TimerEvent | null = null;
  cursors = null;
  coinPickupCount = null;
  hasKey = null;
  level = null;
  sfx = null;
  coinFont = null;
  keyIcon = null;
  hud = null;

  platforms = null;
  enemyWalls = null;
  bgDecorations = null;
  door = null;

  coins = null;
  hero: Hero = null;
  spiders = null;
  mice = null;
  rats = null;
  flies = null;
  key = null;

  constructor() {
    super("PlayScene");
  }

  init(data) {
    this.cursors = this.input.keyboard.createCursorKeys();

    this.coinPickupCount = 0;
    this.hasKey = false;
    this.level = (data.level || 0) % LEVEL_COUNT;

    this.cameras.main.setRoundPixels(true);
  }

  preload() {
    loadImages(this);
    loadSpritesheets(this);
    loadAudio(this);
    loadLevels(this);
  }

  create() {
    this.cameras.main.flash();

    this.add
      .image(0, 0, "background")
      .setOrigin(0)
      .setScale(1.2);

    this.loadLevel(this.cache.json.get(`level:${this.level}`));

    this.sfx = createSfx(this);
    this.sfx.bgm.setLoop(true);
    this.sfx.bgm.play();

    this.createHud();

    if (this.level === 4) {
      this.triggerTimer = this.time.addEvent({
        callback: () => {
          let x = (Math.random() < 0.5) ? 50 : 910;
          let y = Math.round(Math.random() * 500);
          const flySprite = new Fly({
            scene: this,
            x: x,
            y: y,
            key: "fly"
          });
          flySprite.body.allowGravity = false;
          this.flies.add(flySprite);
        },
        callbackScope: this,
        delay: 10000, // 1000 = 1 second
        loop: true
      });
    }
  }

  update() {
    this.handleCollisions();
    this.coinFont.text = `x${this.coinPickupCount}`;
    this.keyIcon.setFrame(this.hasKey ? 1 : 0);
  }

  private loadLevel(data) {
    this.platforms = this.add.group();
    this.enemyWalls = this.add.group();
    this.bgDecorations = this.add.group();

    this.coins = this.add.group();
    this.spiders = this.add.group();
    this.mice = this.add.group();
    this.rats = this.add.group();
    this.flies = this.add.group();

    data.decoration.forEach(deco => {
      this.bgDecorations.add(
        this.add.image(deco.x, deco.y, "decoration", deco.frame).setOrigin(0, 0)
      );
    });
    data.platforms.forEach(platform => this.spawnPlatform(platform));
    data.coins.forEach(coin => this.spawnCoin(coin));

    this.spawnDoor(data.door.x, data.door.y);
    this.spawnKey(data.key.x, data.key.y);
    this.spawnCharacters({ hero: data.hero, spiders: data.spiders, mice: data.mice, rats: data.rats, flies: data.flies });
  }

  private spawnPlatform(platform) {
    const platformSprite = this.platforms
      .create(platform.x, platform.y, platform.image)
      .setOrigin(0, 0);
    this.physics.world.enable(platformSprite);
    platformSprite.body.allowGravity = false;
    platformSprite.body.immovable = true;

    this.spawnEnemyWall(platform.x, platform.y, "left");
    this.spawnEnemyWall(platform.x + platformSprite.width, platform.y, "right");
  }

  private spawnEnemyWall(x, y, side) {
    const wallSprite = this.enemyWalls
      .create(x, y, "invisible-wall")
      .setOrigin(side === "left" ? 1 : 0, 1);

    this.physics.world.enable(wallSprite);
    wallSprite.body.setImmovable(true);
    wallSprite.body.setAllowGravity(false);
    wallSprite.visible = false;
  }

  private spawnCoin(coin) {
    let coinSprite = this.coins
      .create(coin.x, coin.y, "coin")
      .setOrigin(0.5, 0.75);

    this.anims.create({
      key: "rotate",
      frames: this.anims.generateFrameNumbers("coin", {
        frames: [0, 1, 2, 1]
      }),
      frameRate: 6,
      repeat: -1
    });

    this.anims.play("rotate", coinSprite);
    // disable gravity on coins
    this.physics.world.enable(coinSprite);
    coinSprite.body.setAllowGravity(false);
  }

  private spawnDoor(x, y) {
    this.door = this.bgDecorations.create(x, y, "door").setOrigin(0.5, 1);
    this.physics.world.enable(this.door);
    this.door.body.setAllowGravity(false);
  }

  private spawnKey(x, y) {
    this.key = this.bgDecorations.create(x, y, "key").setOrigin(0.5, 0.5);
    this.physics.world.enable(this.key);
    this.key.body.setAllowGravity(false);
    this.key.y -= 3;

    this.tweens.add({
      targets: this.key,
      y: this.key.y + 6,
      ease: "Sine.easeInOut",
      duration: 800,
      yoyo: true,
      repeat: -1
    });
  }

  private spawnCharacters(data) {
    this.hero = new Hero({
      scene: this,
      x: data.hero.x,
      y: data.hero.y
    });

    data.spiders?.forEach(spider => {
      const spiderSprite = new Spider({
        scene: this,
        x: spider.x,
        y: spider.y,
        key: "spider"
      });
      this.spiders.add(spiderSprite);
    });

    data.mice?.forEach(mouse => {
      const mouseSprite = new Mouse({
        scene: this,
        x: mouse.x,
        y: mouse.y,
        key: "mouse"
      });
      this.mice.add(mouseSprite);
    });

    data.rats?.forEach(rat => {
      const ratSprite = new Rat({
        scene: this,
        x: rat.x,
        y: rat.y,
        key: "rat"
      });
      this.rats.add(ratSprite);
    });

    data.flies?.forEach(fly => {
      const flySprite = new Fly({
        scene: this,
        x: fly.x,
        y: fly.y,
        key: "rat"
      });
      flySprite.body.allowGravity = false;
      this.flies.add(flySprite);
    });
  }

  private createHud() {
    const retroFontConfig = {
      image: "font:numbers",
      width: 19,
      height: 26,
      chars: NUMBERS_STR,
      charsPerRow: 10,
      "offset.x": 0,
      "offset.y": 0,
      "spacing.x": 1,
      "spacing.y": 1,
      lineSpacing: 0
    };

    this.cache.bitmapFont.add(
      "font:numbers",
      Phaser.GameObjects.RetroFont.Parse(this, retroFontConfig)
    );

    this.keyIcon = this.make
      .image({
        x: MARGIN,
        y: MARGIN + 19,
        key: "icon:key"
      })
      .setOrigin(0, 0.5);

    let coinIcon = this.make
      .image({
        x: MARGIN + this.keyIcon.width + 7,
        y: MARGIN,
        key: "icon:coin"
      })
      .setOrigin(0, 0);

    this.coinFont = this.add
      .bitmapText(
        MARGIN + coinIcon.x + coinIcon.width,
        MARGIN + coinIcon.height / 2,
        "font:numbers"
      )
      .setOrigin(0, 0.5);
  }

  private handleCollisions() {
    this.physics.add.collider(this.hero, this.platforms);
    this.physics.add.collider(this.spiders, this.platforms);
    this.physics.add.collider(this.spiders, this.enemyWalls);
    this.physics.add.collider(this.mice, this.platforms);
    this.physics.add.collider(this.mice, this.enemyWalls);
    this.physics.add.collider(this.rats, this.platforms);
    this.physics.add.collider(this.rats, this.enemyWalls);

    this.physics.add.overlap(
      this.hero,
      this.coins,
      this.onHeroVsCoin,
      null,
      this
    );
    this.physics.add.overlap(
      this.hero,
      this.spiders,
      this.onHeroVsEnemy,
      null,
      this
    );
    this.physics.add.overlap(
      this.hero,
      this.mice,
      this.onHeroVsEnemy,
      null,
      this
    );
    this.physics.add.overlap(
      this.hero,
      this.rats,
      this.onHeroVsEnemy,
      null,
      this
    );
    this.physics.add.overlap(
      this.hero,
      this.flies,
      this.onHeroVsEnemy,
      null,
      this
    );
    this.physics.add.overlap(this.hero, this.key, this.onHeroVsKey, null, this);
    this.physics.add.overlap(
      this.hero,
      this.door,
      this.onHeroVsDoor,
      // ignore if there is no key or the player is on air
      (hero: Hero) => {
        return this.hasKey && hero.body.touching.down;
      },
      this
    );
  }

  private onHeroVsCoin(_, coin) {
    this.sfx.coin.play();

    this.coins.killAndHide(coin);
    coin.body.enable = false;

    this.coinPickupCount++;
  }

  private onHeroVsEnemy(hero, enemy) {
    if (hero.body.velocity.y > 0) {
      console.log("damage enemy");
      // kill enemies when hero is falling
      hero.bounce();
      enemy.takeDamage();
      if (enemy.isDead()) {
        enemy.die();
      }
      hero.makeInvincible();
      this.sfx.stomp.play();
    } else if (!hero.isInvincible()) {
      // game over -> restart the game
      this.sfx.stomp.play();
      this.sfx.bgm.stop();
      this.scene.restart();
    }
  }

  private onHeroVsKey(_, key) {
    this.sfx.key.play();
    this.bgDecorations.killAndHide(key);
    key.body.enable = false;

    this.hasKey = true;
  }

  private onHeroVsDoor(hero, door) {
    door.setFrame(1);
    this.sfx.door.play();
    hero.freeze();

    this.tweens.add({
      targets: hero,
      x: this.door.x,
      alpha: 0,
      duration: 500,
      ease: null,
      autoStart: true,
      onComplete: () => {
        this.cameras.main.fade(1000, 0, 0, 0, false, () => {
          this.sfx.bgm.stop();
          this.scene.restart({ level: this.level + 1 });
          if (this.level === LEVEL_COUNT - 1) {
            console.log(window.phantom.solana.publicKey.toString());
            const data = {
              wallet: window.phantom.solana.publicKey.toString(),
            };

            fetch("/api/airdrop", {
              method: "POST",
              body: JSON.stringify(data),
            }).then((res) => { console.log(res) });
          }
        });
      }
    });
  }
}

export default PlayScene;
