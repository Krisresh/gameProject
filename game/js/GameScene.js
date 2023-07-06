class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }
  preload() {
    this.load.image("bg", "assets/background.jpeg");
    this.load.image("ball", "assets/ball.png");
  }
  create() {
    this.createBackgraund();
    this.createObjects();
  }
  createBackgraund() {
    this.add.image(0, 0, "bg").setOrigin(0);
  }

  startMove() {
    this.firstBall.setVelocity(2000, 2000).setDrag(0.2);
    this.startGame = true;
  }

  restartMove() {
    this.firstBall
      .setVelocity(0, 0)
      .setPosition(config.width / 2, config.height / 2);
    this.startGame = false;
  }

  createObjects() {
    this.firstBall = this.physics.add
      .image(config.width / 2, config.height / 2, "ball")
      .setVelocity(0, 0)
      .setBounce(1, 1)
      .setCollideWorldBounds(true);

    this.firstBall.setAcceleration(0, 0);

    this.physics.world.enable([this.firstBall]);

    this.input.on("pointerdown", (pointer) => {
      if (!this.startGame) {
        this.startMove();
      } else {
        this.restartMove();
      }
    });
  }

  update() {
    if (this.startGame) {
      // Замедление мяча
      const deceleration = 2; // Величина замедления, можно изменять
      this.firstBall.setAcceleration(
        -this.firstBall.body.velocity.x * deceleration,
        -this.firstBall.body.velocity.y * deceleration
      );
    } else {
      this.firstBall.setVelocity(0, 0).setAcceleration(0, 0);
    }
  }
}
