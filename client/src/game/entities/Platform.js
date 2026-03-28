const Phaser = window.Phaser;

export class Platform {
  static TYPES = {
    SOLID: 'solid',
    DROP_THROUGH: 'drop-through'
  };

  constructor(scene, x, y, width, height, options = {}) {
    this.scene = scene;
    this.type = options.type || Platform.TYPES.SOLID;
    this.isDropThrough = this.type === Platform.TYPES.DROP_THROUGH;

    this.gameObject = scene.add.rectangle(x, y, width, height, 0x000000, 0);

    scene.physics.add.existing(this.gameObject, true);
    this.gameObject.body.updateFromGameObject();

    this.gameObject.platformType = this.type;
    this.gameObject.isDropThrough = this.isDropThrough;
  }

  getPhysicsTarget() {
    return this.gameObject;
  }
}

