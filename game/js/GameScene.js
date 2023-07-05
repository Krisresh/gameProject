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
    // this.moveBall();
  }
  createBackgraund() {
    this.add.image(0, 0, "bg").setOrigin(0);
  }

  createObjects() {
    this.firstBall = this.physics.add
      .image(200, 200, "ball")
      .setVelocity(200, 0)
      .setBounce(1, 1)
      .setCollideWorldBounds(true);
  }

  update() {
    this.firstBall.rotation = this.firstBall.body.angle;
  }

  moveBall() {
    console.log(this.firstBall);
    this.firstBall.setPosition(100, 100);
  }
}

// class Ball extends Phaser.GameObjects.Sprite {
//   constructor(GameScene) {
//     super("GameScene");
//     this.create();
//     this.init();
//   }

//   init() {
//     // добавляем объект на сцену как спрайт
//     this.GameScene.add.existing(this); // вызываем текеущую сцену/ в качестве параметра ссылка на этот префаб
//     this.GameScene.physics.add.existing(this); // активизируем физическое тело
//     this.body.enable = true;
//     this.velocity = 500;
//   }

//   create() {
//     this.ballTexture = Image.create(GameScene, 30, 30, "ball");
//   }
// }
