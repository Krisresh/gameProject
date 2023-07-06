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
    //this.physics.accelerateToObject(this.firstBall, cursor, 100);
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
    //.setMaxSpeed(300);

    this.firstBall.setAcceleration(0, 0);

    this.physics.world.enable([this.firstBall]);

    this.graphics = this.add.graphics({
      lineStyle: { width: 10, color: 0xffdd00, alpha: 0.5 },
    });
    this.line = new Phaser.Geom.Line();

    this.input.on("pointerdown", (pointer) => {
      if (!this.startGame) {
        this.startMove();
      } else {
        this.restartMove();
      }
    });

    let angle = 0;
    this.input.on("pointermove", (pointer) => {
      this.angle = Phaser.Math.Angle.BetweenPoints(this.firstBall, pointer);
      Phaser.Geom.Line.SetToAngle(line, 0, 0, this.angle, 128);
      graphics.clear().strokeLineShape(line);
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
