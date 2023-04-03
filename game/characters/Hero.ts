// @ts-nocheck

import Phaser from "phaser";
import PlayScene from "../scenes/playScene";

class Hero extends Phaser.GameObjects.Sprite {
  // public sprite: Phaser.Physics.Arcade.Sprite;
  public body: Phaser.Physics.Arcade.Body | undefined;
  private currentScene: PlayScene;
  private isFrozen: Boolean = false;
  private isAlive: Boolean = true;
  private invincibleTimer: Phaser.Time.TimerEvent | null = null;
  private invincible: boolean = false;

  SPEED = 200;
  JUMP_SPEED = 600;
  BOUNCE_SPEED = 200;
  SCALE = 2;

  constructor(params: any) {
    super(params.scene, params.x, params.y, params.key, params.frame);

    this.currentScene = params.scene;

    this.currentScene.physics.add.existing(this);
    this.currentScene.physics.world.enable(this);
    this.currentScene.add.existing(this);
    this.body?.setCollideWorldBounds(true);

    this.setFlipX(false);
    this.setOrigin(0, 0.5);
    this.body?.setOffset(0, 0);
    this.body?.setSize(16, 32, true);
    this.setScale(this.SCALE);

    this.currentScene.events.on("update", () => {
      this.body && this.update();
    });

    this.on(
      "animationcomplete",
      function (anim) {
        if (anim.key === "die") {
          this.destroy();
        }
      },
      this
    );

    this.createAnims(this.currentScene);
  }

  update(): void {
    if (this.currentScene.cursors.left.isDown) {
      this.moveLeft();
    } else if (this.currentScene.cursors.right.isDown) {
      this.moveRight();
    } else {
      this.stand();
    }

    if (this.currentScene.cursors.up.isDown) {
      this.jump();
    }

    const falling = this.body.velocity.y > 0;
    if (falling) {
      this.anims.play("fall", true);
    }
  }

  moveLeft(): void {
    if (this.isFrozen) return;

    this.body?.setVelocityX(-this.SPEED); // move left

    const isRunning = this.body?.velocity.x !== 0 && this.body?.velocity.y === 0;

    if (isRunning) {
      this.anims.play("run", true);
    }

    this.flipX = true; // flip the sprite to the left
  }

  moveRight(): void {
    if (this.isFrozen) return;

    this.body?.setVelocityX(this.SPEED); // move right

    const isRunning = this.body?.velocity.x !== 0 && this.body?.velocity.y === 0;

    if (isRunning) {
      this.anims.play("run", true);
    }

    this.flipX = false; // use the original sprite looking to the right
  }

  stand(): void {
    this.body?.setVelocityX(0);

    const isStanding =
      this.body?.velocity.x === 0 &&
      this.body?.velocity.y === 0 &&
      this.body?.touching.down;

    if (isStanding) {
      this.anims.play("stop", true);
    }
  }

  jump() {
    const canJump = this.body?.touching.down && this.isAlive && !this.isFrozen;

    if (canJump) {
      this.body?.setVelocityY(-this.JUMP_SPEED);
      this.anims.play("jump", true);
      this.currentScene.sfx.jump.play();
    }

    return canJump;
  }

  bounce() {
    this.body?.setVelocityY(-this.BOUNCE_SPEED);
  }

  freeze() {
    if (this.body) {
      this.body.enable = false;
    }
    this.anims.play("stop", true);
    this.isFrozen = true;
  }

  die() {
    this.isAlive = false;
    if (this.body) {
      this.body.enable = false;
    }

    this.anims.play("die");
  }

  makeInvincible() {
    this.invincible = true;
    this.invincibleTimer = this.currentScene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.invincible = false;
      }
    });
  }

  isInvincible() {
    return this.invincible;
  }

  private createAnims(scene: PlayScene) {
    scene.anims.create({
      key: "stop",
      frames: scene.anims.generateFrameNumbers("bread", {
        frames: [0]
      })
    });
    scene.anims.create({
      key: "run",
      frames: scene.anims.generateFrameNumbers("bread", {
        frames: [3, 4, 5]
      }),
      frameRate: 8,
      repeat: -1
    });
    scene.anims.create({
      key: "jump",
      frames: scene.anims.generateFrameNumbers("bread", {
        frames: [1]
      })
    });

    scene.anims.create({
      key: "fall",
      frames: scene.anims.generateFrameNumbers("bread", {
        frames: [2]
      })
    });
  }
}

export default Hero;
