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
    this.hitbox.body.setSize(80, 130);
    this.hitbox.body.setOffset(0, 0);

    this.moveSpeed = 400;
    this.jumpSpeed = 800;
    this.maxJumps = 2;
    this.jumpCount = 0;
    this.currentAnimation = 'idle';
    this.lastDownTapAt = 0;
    this.dropThroughUntil = 0;
    this.downTapWindowMs = 250;
    this.dropThroughDurationMs = 220;
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
    const now = this.scene.time.now;
    const leftPressed = this.cursors.left.isDown;
    const rightPressed = this.cursors.right.isDown;
    const jumpPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.cursors.space);
    const downPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down);
    const isGrounded = this.hitbox.body.blocked.down || this.hitbox.body.touching.down;
    const movingHorizontally = leftPressed !== rightPressed;

    if (isGrounded) {
      this.jumpCount = 0;
    }

    if (downPressed) {
      if (now - this.lastDownTapAt <= this.downTapWindowMs && isGrounded && this.isStandingOnDropThroughPlatform()) {
        this.dropThroughUntil = now + this.dropThroughDurationMs;
        this.hitbox.body.setVelocityY(120);
      }

      this.lastDownTapAt = now;
    }

    if (leftPressed && !rightPressed) {
      this.hitbox.body.setVelocityX(-this.moveSpeed);
      this.anim.scaleX = -Math.abs(this.anim.scaleX);
    } else if (rightPressed && !leftPressed) {
      this.hitbox.body.setVelocityX(this.moveSpeed);
      this.anim.scaleX = Math.abs(this.anim.scaleX);
    } else {
      this.hitbox.body.setVelocityX(0);
    }

    if (jumpPressed && this.jumpCount < this.maxJumps) {
      this.hitbox.body.setVelocityY(-this.jumpSpeed);
      this.jumpCount += 1;
    }

    this.setAnimation(movingHorizontally ? 'run' : 'idle', true);

    this.setPosition(Math.round(this.hitbox.x), Math.round(this.hitbox.y + this.hitbox.height * 0.5));
  }

  getPhysicsTarget() {
    return this.hitbox;
  }

  isDroppingThroughPlatform() {
    return this.scene.time.now < this.dropThroughUntil;
  }

  isStandingOnDropThroughPlatform() {
    const body = this.hitbox.body;
    const feetX = body.center.x;
    const feetY = body.bottom + 2;

    return this.scene.platforms.getChildren().some((platform) => {
      if (!platform.isDropThrough) {
        return false;
      }

      const halfWidth = platform.width * 0.5;
      const nearTop = Math.abs(body.bottom - platform.body.top) <= 8;
      const withinWidth = feetX >= platform.x - halfWidth && feetX <= platform.x + halfWidth;
      const abovePlatform = feetY >= platform.body.top && feetY <= platform.body.top + 12;

      return nearTop && withinWidth && abovePlatform;
    });
  }

  shouldCollideWithPlatform(platform) {
    if (!platform.isDropThrough) {
      return true;
    }

    if (this.isDroppingThroughPlatform()) {
      return false;
    }

    const body = this.hitbox.body;
    const platformTop = platform.body.top;
    const bodyBottom = body.bottom;
    const previousBottom = bodyBottom - body.velocity.y * this.scene.game.loop.delta / 1000;
    const fallingOrStill = body.velocity.y >= 0;

    return fallingOrStill && previousBottom <= platformTop + 8;
  }

  setAnimation(name, loop) {
    if (this.currentAnimation === name) {
      return;
    }

    this.currentAnimation = name;
    this.anim.play(name, loop);
  }

  destroy(fromScene) {
    if (this.hitbox) {
      this.hitbox.destroy();
      this.hitbox = null;
    }

    super.destroy(fromScene);
  }
}
