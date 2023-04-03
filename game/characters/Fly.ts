import Phaser from "phaser";

class Fly extends Phaser.Physics.Arcade.Sprite {
  // public sprite: Phaser.Physics.Arcade.Sprite;
  private currentScene: Phaser.Scene;
  private health: number = 1;

  SPEED = 200;

  constructor(params: any) {
    super(params.scene, params.x, params.y, "fly", params.frame);
    this.currentScene = params.scene;
    this.setOrigin(0.5);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.scene.physics.world.enable(this);
    this.setCollideWorldBounds(true);
    this.setVelocityX(this.SPEED);
    this.setFlipX(true);
    this.scene.events.on("update", () => {
      this.body && this.update();
    });
    this.body.setSize(this.width, this.height);
    this.on(
      "animationcomplete",
      (anim: any) => {
        if (anim.key === "fly_die") {
          this.destroy();
        }
      },
      this
    );
    this.createAnims(this.currentScene);
    this.anims.play("fly_crawl", true);
  }

  update() {
    // check against walls and reverse direction if necessary
    if (this.body.touching.right || this.body.blocked.right) {
      this.setVelocityX(-this.SPEED); // turn left
      this.setFlipX(false);
    } else if (this.body.touching.left || this.body.blocked.left) {
      this.setVelocityX(this.SPEED); // turn right
      this.setFlipX(true);
    }
  }

  takeDamage() {
    this.health -= 1;
  }

  isDead() {
    return this.health <= 0;
  }

  die() {
    this.body.enable = false;

    this.scene.anims.play("fly_die", this);
  }

  private createAnims(scene: any) {
    scene.anims.create({
      key: "fly_crawl",
      frames: scene.anims.generateFrameNumbers("fly", {
        frames: [0, 1]
      }),
      frameRate: 8,
      repeat: -1
    });
    scene.anims.create({
      key: "fly_die",
      frames: scene.anims.generateFrameNumbers("fly", {
        frames: [0, 3, 0, 3, 0, 3, 2, 2, 2, 2, 2, 2]
      }),
      frameRate: 12
    });
  }
}

export default Fly;
