class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    preload() {
        this.load.image("bg", "assets/background.jpeg");
        this.load.image("ball", "assets/ball.png");
        this.load.image("button_bg", "assets/button_bg.jpg");
    }

    create() {
        this.createBackground();
        this.createObjects();
        this.createControlButtons();
    }

    createBackground() {
        this.add.image(0, 0, "bg").setOrigin(0);
    }

    createObjects() {
        this.firstBall = this.physics.add.image(config.width / 2, config.height - 300, "ball").setVelocity(0, 0).setBounce(1, 1).setCollideWorldBounds(true);
        this.firstBall.setAcceleration(0, 0);
        this.physics.world.enable([this.firstBall]);

        this.velocityX = null;
        this.velocityY = null;
        this.power = null;
        this.startGame = false;
    }

    startMove() {
        if (this.power && this.velocityY) {
            this.firstBall.setVelocity(-this.velocityX * this.power, -this.velocityY * this.power).setDrag(0.2);
            this.startGame = true;
        }
    }

    restartMove() {
        this.firstBall.setVelocity(0, 0).setPosition(config.width / 2, config.height - 300);
        this.startGame = false;

        this.velocityX = null;
        this.velocityY = null;
        this.power = null;
    }

    update() {
        if (this.startGame) {
            // Замедление мяча
            const deceleration = 2; // Величина замедления, можно изменять
            this.firstBall.setAcceleration(-this.firstBall.body.velocity.x * deceleration, -this.firstBall.body.velocity.y * deceleration);
        } else {
            this.firstBall.setVelocity(0, 0).setAcceleration(0, 0);
        }
    }

    createControlButtons() {
        //кноки управления игрой

        this.buttonStart = new Button(this, 300, config.height - 300, "ST", { font: "40px Arial", fill: "#000000" }, "button_bg");

        this.buttonStart.buttonBackground.on("pointerdown", () => {
            if (!this.startGame) {
                this.startMove();
            }
        });

        this.buttonRetart = new Button(this, 780, config.height - 300, "RST", { font: "40px Arial", fill: "#000000" }, "button_bg");

        this.buttonRetart.buttonBackground.on("pointerdown", () => {
            if (this.startGame) {
                this.restartMove();
            }
        });

        //кнопки угла

        this.buttonEngleLeft30 = new Button(this, config.width / 2 - 220, config.height - 100, "30", { font: "60px Arial", fill: "#000000" }, "button_bg");

        this.buttonEngleLeft30.buttonBackground.on("pointerdown", () => {
            if (!this.startGame) {
                this.velocityX = 750;
                this.velocityY = 4000;
            }
        });

        this.buttonEngleLeft15 = new Button(this, config.width / 2 - 110, config.height - 100, "15", { font: "60px Arial", fill: "#000000" }, "button_bg");

        this.buttonEngleLeft15.buttonBackground.on("pointerdown", () => {
            if (!this.startGame) {
                this.velocityX = 500;
                this.velocityY = 4000;
            }
        });

        this.buttonEngle0 = new Button(this, config.width / 2, config.height - 100, "0", { font: "60px Arial", fill: "#000000" }, "button_bg");

        this.buttonEngle0.buttonBackground.on("pointerdown", () => {
            if (!this.startGame) {
                this.velocityX = 0;
                this.velocityY = 4000;
            }
        });

        this.buttonEngleRight15 = new Button(this, config.width / 2 + 110, config.height - 100, "15", { font: "60px Arial", fill: "#000000" }, "button_bg");

        this.buttonEngleRight15.buttonBackground.on("pointerdown", () => {
            if (!this.startGame) {
                this.velocityX = -500;
                this.velocityY = 4000;
            }
        });

        this.buttonEngleRight30 = new Button(this, config.width / 2 + 220, config.height - 100, "30", { font: "60px Arial", fill: "#000000" }, "button_bg");

        this.buttonEngleRight30.buttonBackground.on("pointerdown", () => {
            if (!this.startGame) {
                this.velocityX = -750;
                this.velocityY = 4000;
            }
        });

        //кнопки силы

        this.buttonPower25 = new Button(this, 1000, config.height - 100, "25", { font: "60px Arial", fill: "#000000" }, "button_bg");

        this.buttonPower25.buttonBackground.on("pointerdown", () => {
            if (!this.startGame) {
                this.power = 0.25;
            }
        });

        this.buttonPower50 = new Button(this, 1000, config.height - 210, "50", { font: "60px Arial", fill: "#000000" }, "button_bg");

        this.buttonPower50.buttonBackground.on("pointerdown", () => {
            if (!this.startGame) {
                this.power = 0.5;
            }
        });

        this.buttonPower75 = new Button(this, 1000, config.height - 320, "75", { font: "60px Arial", fill: "#000000" }, "button_bg");

        this.buttonPower75.buttonBackground.on("pointerdown", () => {
            if (!this.startGame) {
                this.power = 0.75;
            }
        });

        this.buttonPower100 = new Button(this, 1000, config.height - 430, "100", { font: "60px Arial", fill: "#000000" }, "button_bg");

        this.buttonPower100.buttonBackground.on("pointerdown", () => {
            if (!this.startGame) {
                this.power = 1;
            }
        });
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