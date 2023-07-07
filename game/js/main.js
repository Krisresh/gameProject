let config = {
  typer: Phaser.AUTO,
  width: 1080,
  height: 1920,
  scene: GameScene,
  physics: {
    // подключение физического движка
    default: "matter",
    matter: {
      gravity: { y: 0 },
      debug: false,
    },
  },
};
let game = new Phaser.Game(config);

class gameProject {
  create() {
    // тут создание игровых объектов
  }
}
