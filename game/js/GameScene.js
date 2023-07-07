class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("bg", "assets/background.jpeg");
    this.load.image("ball", "assets/ball.png");
  }

  create() {
    this.createBackground();
    this.createObjects();
  }

  createBackground() {
    this.add.image(0, 0, "bg").setOrigin(0);
  }

  // startMove() {
  //   this.firstBall.setVelocity(2000, 2000).setDrag(0.2);
  //   this.startGame = true;
  // }

  // restartMove() {
  //   this.firstBall
  //     .setVelocity(0)
  //     .setPosition(config.width / 2, config.height / 2);
  //   this.startGame = false;
  // }

  createObjects() {
    this.matter.world.setBounds(0, 0, 1080, 1920);
    this.matter.add.mouseSpring({ stiffness: 1 });

    // this.firstBall = this.matter.add.image(
    //   config.width / 2,
    //   config.height / 2,
    //   "ball"
    // );

    this.firstBall = this.matter.add
      .image(config.width / 2, config.height / 2, "ball", null, {
        shape: "circle",
        friction: 1,
        restitution: 1,
      })
      .setBounce(0.9);

    this.matter.add.gameObject(this.firstBall, false);

    // this.matter.add.gameObject(poly, this.firstBall, false);
  }

  //this.firstBall.setAcceleration(0, 0);

  // this.graphics = this.add.graphics({
  //   lineStyle: { width: 10, color: 0xffdd00, alpha: 0.5 },
  // });
  // this.line = new Phaser.Geom.Line();

  // this.input.on("pointerdown", (pointer) => {
  //   if (!this.startGame) {
  //     this.startMove();
  //   } else {
  //     this.restartMove();
  //   }
  // });

  // this.input.on("pointermove", (pointer) => {
  //   const ballPosition = new Phaser.Math.Vector2(
  //     this.firstBall.x,
  //     this.firstBall.y
  //   );
  // const pointerPosition = new Phaser.Math.Vector2(pointer.x, pointer.y);
  // const lineLength = Phaser.Math.Distance.BetweenPoints(
  //   ballPosition,
  //   pointerPosition
  // );

  // this.line.setTo(
  //   ballPosition.x,
  //   ballPosition.y,
  //   pointerPosition.x,
  //   pointerPosition.y
  // );

  //this.graphics.clear();
  //this.graphics.strokeLineShape(this.line);
  // });
  //this.matter.add.mouseSpring();

  //}

  // update() {
  //   if (this.startGame) {
  //     const deceleration = 2;
  //     this.firstBall.setAcceleration(
  //       -this.firstBall.body.velocity.x * deceleration,
  //       -this.firstBall.body.velocity.y * deceleration
  //     );
  //   } else {
  //     this.firstBall.setVelocity(0, 0).setAcceleration(0, 0);
  //   }
  // }
}
