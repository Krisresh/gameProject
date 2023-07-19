let config = {
    typer: Phaser.AUTO,
    width: 1080,
    height: 1920,
    scene: GameScene,
    physics: {
        // подключение физического движка
        default: "arcade",
    },
};
let game = new Phaser.Game(config);