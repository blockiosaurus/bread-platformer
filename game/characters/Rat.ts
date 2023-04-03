import Phaser from "phaser";

class Rat extends Phaser.Physics.Arcade.Sprite {
  // public sprite: Phaser.Physics.Arcade.Sprite;
  private currentScene: Phaser.Scene;
  private health: number = 3;

  SPEED = 200;

  constructor(params: any) {
    super(params.scene, params.x, params.y, "rat", params.frame);
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
        if (anim.key === "rat_die") {
          this.destroy();
        }
      },
      this
    );
    this.createAnims(this.currentScene);
    this.anims.play("rat_crawl", true);
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
    if (this.anims.isPlaying === false){
      this.anims.play("rat_crawl", true);
    }
  }

  takeDamage() {
    this.health -= 1;

    this.scene.anims.play("rat_damage", this);
  }

  isDead() {
    return this.health <= 0;
  }

  die() {
    this.body.enable = false;

    this.scene.anims.play("rat_die", this);
  }

  private createAnims(scene: any) {
    scene.anims.create({
      key: "rat_crawl",
      frames: scene.anims.generateFrameNumbers("rat", {
        frames: [0, 1]
      }),
      frameRate: 8,
      repeat: -1
    });
    scene.anims.create({
      key: "rat_damage",
      frames: scene.anims.generateFrameNumbers("rat", {
        frames: [0, 3, 0, 3, 0, 3]
      }),
      frameRate: 12
    });
    scene.anims.create({
      key: "rat_die",
      frames: scene.anims.generateFrameNumbers("rat", {
        frames: [0, 3, 0, 3, 0, 3, 2, 2, 2, 2, 2, 2]
      }),
      frameRate: 12
    });
  }
}

export default Rat;
