class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
        this.bet = 100;
        this.chipStartPositionX = config.width / 2;
        this.chipStartPositionY = config.height - 300;
        this.upperBoundary = this.chipStartPositionY - 50;
        this.isLaunching = false;
        this.gameIsEnd = true;
    }

    preload() {
        this.load.image("bg", "assets/background.jpg");
        this.load.image("ball", "assets/ball.png");
        this.load.image("button_bg", "assets/button_bg.jpg");
    }

    create() {
        this.createBackground();
        this.createObjects();
        this.createControlButtons();

        this.math = new GameMath();
        this.math.randomiseMultiplyer();
        this.createLaunching();
    }

    createBackground() {
        this.add.image(0, 0, "bg").setOrigin(0);
    }

    createObjects() {
        this.firstBall = this.physics.add.image(this.chipStartPositionX, this.chipStartPositionY, "ball");
        this.firstBall.setVelocity(0, 0);
        this.firstBall.setBounce(1, 1);
        this.firstBall.setCollideWorldBounds(false)
        this.firstBall.setAcceleration(0, 0);
        this.firstBall.setScale(0.5);
        this.firstBall.setInteractive();

        this.input.setDraggable(this.firstBall);

        this.input.on("dragstart", (pointer, gameObject) => {
            if (this.gameIsEnd) gameObject.setAcceleration(0, 0);
        });

        this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
            if (this.gameIsEnd) {
                gameObject.x = dragX;
                gameObject.y = dragY;
            }
        });

        this.input.on("dragend", (pointer, gameObject, dropped) => {
            if (dropped) {
                const velocityX = gameObject.x - pointer.x;
                const velocityY = gameObject.y - pointer.y;

                gameObject.setVelocity(velocityX, velocityY + 2000);
                gameObject.setPosition(this.chipStartPositionX, this.chipStartPositionY);
            }
        });
    }

    createControlButtons() {
        this.buttonRetart = new Button(this, 780, this.chipStartPositionY, "RST", { font: "40px Arial", fill: "#000000" }, "button_bg");

        this.buttonRetart.buttonBackground.on("pointerdown", () => {
            if (!this.gameIsStart) {
                this.restartGame();
            }
        });
    }

    createLaunching() {
        this.firstBall.on("pointerdown", this.startLaunch, this);
        this.firstBall.on("pointerup", this.launchBall, this);

        this.launchIndicator = this.add.graphics();
    }

    startLaunch(pointer) {
        if (!this.isLaunching && this.gameIsEnd && pointer.y > this.upperBoundary) {
            console.log(this.gameIsEnd)
            this.isLaunching = true;
            this.startX = pointer.x;
            this.startY = pointer.y;
        }
    }

    launchBall(pointer) {
        if (this.isLaunching && this.gameIsEnd && pointer.y > this.upperBoundary) {
            const launchPower = 10;
            const velocityX = (this.startX - pointer.x) * launchPower;
            const velocityY = (this.startY - pointer.y) * launchPower;

            this.firstBall.setVelocity(velocityX, velocityY);

            this.gameIsEnd = false;
            this.launchIndicator.clear();
            this.isLaunching = false;
        }
    }

    update() {
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

    restartGame() {
        this.firstBall.setVelocity(0, 0).setPosition(this.chipStartPositionX, this.chipStartPositionY);
        this.firstBall.setVelocity(0);
        this.gameIsEnd = true;
    }
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