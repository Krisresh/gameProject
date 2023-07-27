class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
        this.bet = 100;
        this.chipStartPositionX = config.width / 2;
        this.chipStartPositionY = config.height - 300;
        this.upperBoundary = this.chipStartPositionY - 50;
        this.isLaunching = false;
        this.gameIsEnd = true;
        this.targetsCount = 6;
        this.targetsX = [0, -400, 400, -800, 0, 800];
        this.targetsY = [250, 600, 600, 950, 950, 950];
    }

    preload() {
        this.load.image("bg", "assets/background.jpg");
        this.load.image("ball", "assets/ball.png");
        this.load.image("button_bg", "assets/button_bg.jpg");
    }

    create() {
        this.math = new GameMath();
        this.wind = new Wind(this);

        this.createBackground();
        this.createTargets();
        this.createChip();
        this.createControlButtons();
        this.createLaunching();
    }

    createBackground() {
        this.add.image(0, 0, "bg").setOrigin(0);
    }

    createTargets() {
        this.targets = this.physics.add.group();
        this.multipayers = this.math.randomiseTargetsMultiplayers(this.targetsCount);
        for (let i = 0; i < this.targetsCount; i++) {
            this.color = 0xe8cca5;
            this.target = new Target(this, config.width / 2 + this.targetsX[i] / 2, this.targetsY[i], 200, this.color, this.multipayers[i]);
            this.targets.add(this.target);
        }
    }

    createChip() {
        this.chip = this.physics.add.image(this.chipStartPositionX, this.chipStartPositionY, "ball");
        this.chip.setVelocity(0, 0);
        this.chip.setBounce(1, 1);
        this.chip.setCollideWorldBounds(false)
        this.chip.setAcceleration(0, 0);
        this.chip.setScale(0.5);
        this.chip.setInteractive();

        this.input.setDraggable(this.chip);

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
        this.chip.on("pointerdown", this.startLaunch, this);
        this.chip.on("pointerup", this.launchBall, this);

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

            this.chip.setVelocity(velocityX, velocityY);

            this.gameIsEnd = false;
            this.launchIndicator.clear();
            this.isLaunching = false;

            this.events.emit("launchBall");
        }
    }

    update() {
        const dampingFactor = 0.98;
        if (!this.isLaunching && this.chip.body) {
            this.chip.setVelocity(
                this.chip.body.velocity.x * dampingFactor,
                this.chip.body.velocity.y * dampingFactor
            );
            const tolerance = 5;

            if (Math.abs(this.chip.body.velocity.x) <= Math.abs(this.chip.body.acceleration.x) + tolerance &&
                Math.abs(this.chip.body.velocity.y) <= Math.abs(this.chip.body.acceleration.y) + tolerance) {
                this.chip.body.setAcceleration(0, 0);
                this.wind.stopBlowing();
            }

            const minVelocityThreshold = 10;
            if (
                Math.abs(this.chip.body.velocity.x) < minVelocityThreshold &&
                Math.abs(this.chip.body.velocity.y) < minVelocityThreshold
            ) {
                this.chip.setVelocity(0, 0);
                if (this.chip.y > config.height) {
                    this.restartGame();
                }
            }
        }
        this.wind.update();
    }

    restartGame() {
        this.chip.setVelocity(0, 0).setPosition(this.chipStartPositionX, this.chipStartPositionY);
        this.chip.setVelocity(0);
        this.gameIsEnd = true;
        this.events.emit("restartGame");
    }
}

class Wind {
    constructor(scene) {
        this.scene = scene;
        this.direction = 0; // Wind direction in degrees (0 - 359)
        this.strength = 0; // Wind strength
        this.isBlowing = false;

        this.scene.events.on("launchBall", this.startBlowing, this);
        this.scene.events.on("stopBall", this.stopBlowing, this);
        this.scene.events.on("restartGame", this.randomizeWind, this);
    }

    startBlowing() {
        if (!this.isBlowing) {
            this.isBlowing = true;
            this.randomizeWind();
        }
    }

    stopBlowing() {
        this.isBlowing = false;
    }

    randomizeWind() {
        this.windParams = this.scene.math.randomiseWind();
        this.direction = this.windParams[0];
        this.strength = this.windParams[1];
    }

    getForceX() {
        return Math.cos(Phaser.Math.DegToRad(this.direction)) * this.strength;
    }

    getForceY() {
        return Math.sin(Phaser.Math.DegToRad(this.direction)) * this.strength;
    }

    update() {
        if (this.isBlowing) {
            this.forceX = this.getForceX();
            this.forceY = this.getForceY();
            this.scene.chip.setAcceleration(this.forceX, this.forceY);
        }
    }
}

class Target extends Phaser.GameObjects.Graphics {
    constructor(scene, x, y, diameter, color, multiplayer) {
        super(scene, { x: x, y: y });

        this.x = x;
        this.y = y;
        this.multiplayer = multiplayer;

        this.fillStyle(color);
        this.fillCircle(0, 0, diameter / 2);

        this.scene.add.existing(this);
        this.multiplayerText = scene.add.text(this.x, this.y - 50, this.multiplayer + "X", { font: "40px Arial", fill: "#000000" }).setOrigin(0.5);
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