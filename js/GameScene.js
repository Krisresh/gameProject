class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
        this.bet = 100; // Ставка на игру
    }

    preload() {
        this.load.image("bg", "assets/background.jpg");
        this.load.image("ball", "assets/ball.png");
        this.load.image("button_bg", "assets/button_bg.jpg");
        this.load.image("slider_thumb", "assets/slider_thumb.jpg");
        this.load.image("slider_thumb_vertical", "assets/slider_thumb_vertical.jpg");
        this.load.image("arrow_up", "assets/arrow_up.png");
        this.load.image("arrow_down", "assets/arrow_down.png");
        this.load.image("arrow_up_down", "assets/arrow_up_down.png");
    }

    create() {
        this.createBackground();
        this.createObjects();
        this.createControlButtons();
        // this.createBetText();

        this.math = new GameMath();
        this.math.randomiseMultiplyer();

        // this.math.createScores();
        // this.createScore();
        this.CreateLaunching();        
        
    }

    CreateLaunching(){
        this.isLaunching = false;
        this.firstBall.on("pointerdown", this.startLaunch, this);
        this.firstBall.on("pointerup", this.launchBall, this);

        this.launchIndicator = this.add.graphics();
    }

    createBackground() {
        this.add.image(0, 0, "bg").setOrigin(0);
    }

    createObjects() {
        // this.targets = this.physics.add.group();
        // this.createTargets();
        // console.log(this.targets);

        // this.windIndicator = new WindIndicator(this, 1010, 70, "arrow_up_down");

        this.gameIsEnd = true;

        this.firstBall = this.physics.add.image(config.width / 2, config.height - 300, "ball").setVelocity(0, 0).setBounce(1, 1).setCollideWorldBounds(false);
        this.firstBall.setAcceleration(0, 0);
        this.physics.world.enable(this.firstBall);
        this.firstBall.setScale(0.5);
        this.firstBall.setInteractive();

        this.input.setDraggable(this.firstBall);

        this.input.on("dragstart", (pointer, gameObject) => {
            gameObject.setAcceleration(0, 0);
        });

        this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on("dragend", (pointer, gameObject, dropped) => {
            if (dropped) {
                const velocityX = gameObject.x - pointer.x;
                const velocityY = gameObject.y - pointer.y;

                gameObject.setVelocity(velocityX, velocityY);

                gameObject.setPosition(config.width / 2, config.height - 300);
            }
        });
    }

    startLaunch(pointer) {
        const upperBoundary = config.height - 350;
        if (!this.isLaunching && this.gameIsEnd && pointer.y > upperBoundary) {
            this.isLaunching = true;
            this.startX = pointer.x;
            this.startY = pointer.y;

            this.launchIndicator.clear();
            this.launchIndicator.lineStyle(2, 0xffffff);
            this.launchIndicator.moveTo(this.firstBall.x, this.firstBall.y);
            this.launchIndicator.lineTo(pointer.x, pointer.y);
        }
    }

    launchBall(pointer) {
        const upperBoundary = config.height - 350;
        if (this.isLaunching && pointer.y > upperBoundary) {
            const launchPower = 10;
            const velocityX = (this.startX - pointer.x) * launchPower;
            const velocityY = (this.startY - pointer.y) * launchPower;

            this.firstBall.setVelocity(velocityX, velocityY);

            this.launchIndicator.clear();
            this.isLaunching = false;
        } else {
            this.firstBall.setPosition(config.width / 2, config.height - 300);
        }
    }

    update() {
        if (this.isLaunching) {
            this.launchIndicator.clear();
            this.launchIndicator.lineStyle(2, 0xffffff);
            this.launchIndicator.moveTo(this.firstBall.x, this.firstBall.y);
            this.launchIndicator.lineTo(this.input.x, this.input.y);
        }

        const dampingFactor = 0.98;
        if (!this.isLaunching && this.firstBall.body) {
            this.firstBall.setVelocity(
                this.firstBall.body.velocity.x * dampingFactor,
                this.firstBall.body.velocity.y * dampingFactor
            );

            const minVelocityThreshold = 5;
            if (
                Math.abs(this.firstBall.body.velocity.x) < minVelocityThreshold &&
                Math.abs(this.firstBall.body.velocity.y) < minVelocityThreshold
            ) {
                this.firstBall.setVelocity(0, 0);
                if (this.firstBall.y > config.height) {
                    this.restartGame();
                }
            }
        }
    }

    createTargets() {
        this.targetWidth = config.width; // Ширина каждой полосы мишени
        this.targetHeight = 100;
        this.targetCount = 5;
        this.targetSpacing = 10; // Расстояние между полосами мишеней

        this.totalHeight = this.targetCount * (this.targetHeight + this.targetSpacing) - this.targetSpacing;
        this.startY = (config.height - this.totalHeight) / 1.7; // Начальная позиция по Y

        for (let i = 0; i < this.targetCount; i++) {
            this.targetY = this.startY - i * (this.targetHeight + this.targetSpacing);
            this.color = 0xe8cca5;
            this.target = new Target(this, config.width / 2, this.targetY, this.targetWidth, this.targetHeight, this.color, ((i + 1) * 0.5));
            this.targets.add(this.target);
        }
    }

    startGame() {

    }

    restartGame() {
        this.firstBall.setVelocity(0, 0).setPosition(config.width / 2, config.height - 300);
        this.firstBall.setVelocity(0);
        this.gameIsEnd = true;
    }

    // createScore() {
    //     this.scoreText = this.add.text(20, 10, `Score: ${this.math.getScores()}`, { font: "50px Arial", fill: "#ffffff" });
    // }

    // updateScore() {
    //     this.scoreText.setText(`Score: ${this.math.getScores()}`);
    // }

    // createBetText() {
    //     this.betText = this.add.text(20, 70, `Bet: ${this.bet}`, { font: "50px Arial", fill: "#ffffff" });
    // }

    // updateBetText() {
    //     this.betText.setText(`Bet: ${this.bet}`);
    // }

    createControlButtons() {
        this.buttonRetart = new Button(this, 780, config.height - 300, "RST", { font: "40px Arial", fill: "#000000" }, "button_bg");

        this.buttonRetart.buttonBackground.on("pointerdown", () => {
            if (!this.gameIsStart) {
                this.restartGame();
            }
        });
    }
}

class Ball{

}

class Target extends Phaser.GameObjects.Graphics {
    constructor(scene, x, y, width, height, color, multiplayer) {
        super(scene, x, y);

        this.x = x;
        this.y = y;
        this.multiplayer = multiplayer;

        this.fillStyle(color);
        this.fillRect(-width / 2, -height / 2, width, height);


        this.scene.add.existing(this);
        this.multiplayerText = scene.add.text(this.x - 500, this.y - 40, this.multiplayer + "X", { font: "80px Arial", fill: "#000000" });
    }

    setRandomOffset(offset) {
        this.y = offset;
        this.multiplayerText.y = offset - 40;
    }
}

class Button extends Phaser.GameObjects.Container {
    constructor(scene, x, y, text, style, backgroundImageKey) {
        super(scene, x, y);
        this.scene = scene;
        this.backgroundImageKey = backgroundImageKey;

        this.buttonBackground = scene.add.image(0, 0, backgroundImageKey).setInteractive();
        this.buttonText = scene.add.text(0, 0, text, style);
        this.buttonText.setOrigin(0.5);

        this.add([this.buttonBackground, this.buttonText]);
        this.setSize(this.buttonBackground.width, this.buttonBackground.height);
        this.scene.add.existing(this);
    }
}

class WindIndicator extends Phaser.GameObjects.Container {
    constructor(scene, x, y, indicatorImageKey) {
        super(scene, x, y);
        this.scene = scene;
        this.indicatorImageKey = indicatorImageKey;

        this.indicatorImage = scene.add.image(0, 0, this.indicatorImageKey);
        this.add(this.indicatorImage);
        this.scene.add.existing(this);
    }

    changeIndicator(indicatorImageKey) {
        this.indicatorImageKey = indicatorImageKey;
        this.indicatorImage.setTexture(indicatorImageKey);
    }
}