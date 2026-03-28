import { Character } from '../entities/Character.js';

const Phaser = window.Phaser;

export class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor('#132238');
    this.physics.world.setBounds(0, 0, width, height);

    this.drawBackground(width, height);
    this.drawMap(width, height);
    this.createCollisionMap(width, height);
    this.createCharacter();

    this.add.text(width * 0.5, 90, 'Main Game Scene', {
      fontFamily: 'Arial',
      fontSize: '42px',
      color: '#f8fafc'
    }).setOrigin(0.5);

    this.add.text(width * 0.5, 138, 'Greybox map prototype', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#cbd5e1'
    }).setOrigin(0.5);

    const backButton = this.add.rectangle(width * 0.5, height - 90, 240, 58, 0xf59e0b, 1).setInteractive({ useHandCursor: true });

    const backLabel = this.add.text(width * 0.5, height - 90, 'Back To Menu', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#111827'
    }).setOrigin(0.5);

    backButton.on('pointerover', () => backButton.setFillStyle(0xfbbf24, 1))
      .on('pointerout', () => backButton.setFillStyle(0xf59e0b, 1))
      .on('pointerdown', () => {
        this.scene.start('MenuScene');
      });

    backLabel.setDepth(1);
  }

  update() {
    if (this.character) {
      this.character.update();
    }
  }

  drawBackground(width, height) {
    this.add.rectangle(width * 0.5, height * 0.5, width, height, 0x132238, 1);
    this.add.ellipse(260, 180, 260, 260, 0xf3d17a, 0.16);
    this.add.ellipse(width - 220, 160, 320, 220, 0x8ec5ff, 0.09);

    const graphics = this.add.graphics();

    graphics.fillStyle(0x1a2d46, 1);
    graphics.beginPath();
    graphics.moveTo(0, height * 0.62);
    graphics.lineTo(220, height * 0.48);
    graphics.lineTo(520, height * 0.58);
    graphics.lineTo(760, height * 0.43);
    graphics.lineTo(1030, height * 0.56);
    graphics.lineTo(1340, height * 0.39);
    graphics.lineTo(1660, height * 0.53);
    graphics.lineTo(width, height * 0.45);
    graphics.lineTo(width, height);
    graphics.lineTo(0, height);
    graphics.closePath();
    graphics.fillPath();

    graphics.fillStyle(0x203753, 0.95);
    graphics.beginPath();
    graphics.moveTo(0, height * 0.72);
    graphics.lineTo(340, height * 0.61);
    graphics.lineTo(670, height * 0.68);
    graphics.lineTo(990, height * 0.58);
    graphics.lineTo(1320, height * 0.71);
    graphics.lineTo(1650, height * 0.63);
    graphics.lineTo(width, height * 0.7);
    graphics.lineTo(width, height);
    graphics.lineTo(0, height);
    graphics.closePath();
    graphics.fillPath();
  }

  drawMap(width, height) {
    const graphics = this.add.graphics();

    const soil = 0x59412f;
    const grass = 0x7cb342;
    const rock = 0x7f8c8d;
    const wood = 0x6d4c41;
    const accent = 0x9ccc65;

    this.drawPlatform(graphics, 0, height - 170, width, 170, soil, grass);
    this.drawPlatform(graphics, 150, 700, 330, 58, soil, grass);
    this.drawPlatform(graphics, 540, 620, 250, 52, soil, grass);
    this.drawPlatform(graphics, 860, 745, 380, 60, soil, grass);
    this.drawPlatform(graphics, 1320, 630, 260, 52, soil, grass);
    this.drawPlatform(graphics, 1600, 500, 180, 44, soil, grass);

    graphics.fillStyle(rock, 1);
    graphics.fillRoundedRect(122, 804, 126, 106, 14);
    graphics.fillRoundedRect(724, 822, 154, 88, 16);
    graphics.fillRoundedRect(1500, 760, 188, 150, 18);

    graphics.fillStyle(wood, 1);
    graphics.fillRect(260, 510, 32, 400);
    graphics.fillRect(284, 480, 18, 430);
    graphics.fillRect(1110, 450, 28, 460);
    graphics.fillRect(1130, 420, 16, 490);

    graphics.fillStyle(0x2e7d32, 0.95);
    graphics.fillCircle(260, 470, 88);
    graphics.fillCircle(220, 500, 74);
    graphics.fillCircle(315, 510, 68);
    graphics.fillCircle(1118, 410, 96);
    graphics.fillCircle(1065, 448, 78);
    graphics.fillCircle(1180, 452, 72);
    graphics.fillCircle(1690, 420, 78);

    graphics.fillStyle(accent, 0.95);
    graphics.fillCircle(685, 585, 18);
    graphics.fillCircle(715, 574, 16);
    graphics.fillCircle(1430, 594, 16);
    graphics.fillCircle(1460, 584, 18);

    graphics.lineStyle(8, 0x2a1f18, 1);
    graphics.beginPath();
    graphics.moveTo(164, 758);
    graphics.lineTo(218, 714);
    graphics.lineTo(322, 714);
    graphics.lineTo(380, 668);
    graphics.strokePath();

    const playerSpawn = this.add.circle(220, 650, 22, 0xff7043, 0.4)
      .setStrokeStyle(5, 0xffcc80, 0.9);

    this.add.text(playerSpawn.x + 40, playerSpawn.y - 6, 'Spawn', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#fff3e0'
    });

    this.add.rectangle(width - 240, 420, 56, 140, 0x263238, 1)
      .setStrokeStyle(3, 0x90a4ae, 0.7);

    this.add.text(width - 240, 330, 'Exit', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#e2e8f0'
    }).setOrigin(0.5);
  }

  createCollisionMap(width, height) {
    this.platforms = this.physics.add.staticGroup();

    this.addPlatformBody(width * 0.5, height - 85, width, 170);
    this.addPlatformBody(315, 729, 330, 58);
    this.addPlatformBody(665, 646, 250, 52);
    this.addPlatformBody(1050, 775, 380, 60);
    this.addPlatformBody(1450, 656, 260, 52);
    this.addPlatformBody(1690, 522, 180, 44);
    this.addPlatformBody(185, 857, 126, 106);
    this.addPlatformBody(801, 866, 154, 88);
    this.addPlatformBody(1594, 835, 188, 150);
  }

  addPlatformBody(x, y, width, height) {
    const platform = this.add.rectangle(x, y, width, height, 0x000000, 0);

    this.physics.add.existing(platform, true);
    platform.body.updateFromGameObject();
    this.platforms.add(platform);

    return platform;
  }

  createCharacter() {
    this.character = new Character(this, 220, 650);
    this.character.setDepth(2);
    this.physics.add.collider(this.character, this.platforms);
  }

  drawPlatform(graphics, x, y, width, height, soilColor, grassColor) {
    graphics.fillStyle(soilColor, 1);
    graphics.fillRoundedRect(x, y, width, height, 18);

    graphics.fillStyle(grassColor, 1);
    graphics.fillRoundedRect(x, y - 10, width, 24, 12);

    graphics.fillStyle(0x000000, 0.08);
    graphics.fillRoundedRect(x + 14, y + 18, width - 28, height - 30, 14);
  }
}
