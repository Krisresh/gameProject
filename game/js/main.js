let config = {
  typer: Phaser.AUTO,
  width: 720,
  height: 1280,
  scene: GameScene,
  physics: {
    // подключение физического движка
    default: "arcade",
    arcade: {
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
