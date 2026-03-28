const Phaser = window.Phaser;

export class Character extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    scene.add.existing(this);

    this.hitbox = scene.add.rectangle(x, y - 44, 80, 130, 0x38bdf8, 0.18).setStrokeStyle(2, 0x7dd3fc, 0.9);

    scene.physics.add.existing(this.hitbox);

    this.hitbox.body.setCollideWorldBounds(true);
    this.hitbox.body.setBounce(0, 0);
    this.hitbox.body.setDragX(1600);
    this.hitbox.body.setMaxVelocity(420, 1200);
    this.hitbox.body.setSize(42, 130);
    this.hitbox.body.setOffset(-21, 0);

    this.moveSpeed = 400;
    this.jumpSpeed = 800;
    this.maxJumps = 2;
    this.jumpCount = 0;
    this.cursors = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    this.add(this.anim = scene.add.spine(0, 0, 'person_SPO', 'idle', true));
    this.anim.setScale(0.15);
    this.anim.setMix('run', 'idle', 0.25);
  }

  update() {
    const leftPressed = this.cursors.left.isDown;
    const rightPressed = this.cursors.right.isDown;
    const jumpPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.cursors.space);
    const isGrounded = this.hitbox.body.blocked.down || this.hitbox.body.touching.down;

    if (isGrounded) {
      this.jumpCount = 0;
    }

    if (leftPressed && !rightPressed) {
      this.hitbox.body.setVelocityX(-this.moveSpeed);
      this.anim.scaleX = -Math.abs(this.anim.scaleX);
      this.anim.play('run', true);
    } else if (rightPressed && !leftPressed) {
      this.hitbox.body.setVelocityX(this.moveSpeed);
      this.anim.scaleX = Math.abs(this.anim.scaleX);
      this.anim.play('run', true);
    } else {
      this.hitbox.body.setVelocityX(0);
      this.anim.play('idle', true);
    }

    if (jumpPressed && this.jumpCount < this.maxJumps) {
      this.hitbox.body.setVelocityY(-this.jumpSpeed);
      this.jumpCount += 1;
    }

    this.setPosition(Math.round(this.hitbox.x), Math.round(this.hitbox.y + this.hitbox.height * 0.5));
  }

  getPhysicsTarget() {
    return this.hitbox;
  }

  destroy(fromScene) {
    if (this.hitbox) {
      this.hitbox.destroy();
      this.hitbox = null;
    }

    super.destroy(fromScene);
  }
}
