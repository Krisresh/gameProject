let config = {
    type: Phaser.AUTO,
    width: 1080,
    height: 1920,
    scene: GameScene,
    physics: {
        default: "arcade",
    },
    scale: {
        mode: Phaser.Scale.FIT,
        //autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

let game = new Phaser.Game(config);

