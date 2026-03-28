const Phaser = window.Phaser;

export class Character extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    Character.ensureTexture(scene);

    super(scene, x, y, Character.TEXTURE_KEY);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(0.5, 1);
    this.setCollideWorldBounds(true);
    this.setBounce(0, 0);
    this.setDragX(1600);
    this.setMaxVelocity(420, 1200);
    this.setSize(42, 88);
    this.setOffset(11, 8);

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
  }

  static ensureTexture(scene) {
    if (scene.textures.exists(Character.TEXTURE_KEY)) {
      return;
    }

    const graphics = scene.make.graphics({ x: 0, y: 0, add: false });

    graphics.fillStyle(0xff8a65, 1);
    graphics.fillRoundedRect(10, 8, 44, 76, 16);

    graphics.fillStyle(0xffcc80, 1);
    graphics.fillCircle(32, 20, 12);

    graphics.fillStyle(0x263238, 0.9);
    graphics.fillRect(18, 36, 8, 22);
    graphics.fillRect(38, 36, 8, 22);
    graphics.fillRect(20, 84, 8, 18);
    graphics.fillRect(36, 84, 8, 18);

    graphics.generateTexture(Character.TEXTURE_KEY, 64, 110);
    graphics.destroy();
  }

  update() {
    const leftPressed = this.cursors.left.isDown;
    const rightPressed = this.cursors.right.isDown;
    const jumpPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.cursors.space);
    const isGrounded = this.body.blocked.down || this.body.touching.down;

    if (isGrounded) {
      this.jumpCount = 0;
    }

    if (leftPressed && !rightPressed) {
      this.setVelocityX(-this.moveSpeed);
      this.setFlipX(true);
    } else if (rightPressed && !leftPressed) {
      this.setVelocityX(this.moveSpeed);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    if (jumpPressed && this.jumpCount < this.maxJumps) {
      this.setVelocityY(-this.jumpSpeed);
      this.jumpCount += 1;
    }
  }
}

Character.TEXTURE_KEY = 'character-prototype';
