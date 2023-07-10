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
        if (this.power) {
            this.velocityX = this.slider.getValue();
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

        // this.buttonEngleLeft30 = new Button(this, config.width / 2 - 220, config.height - 100, "30", { font: "60px Arial", fill: "#000000" }, "button_bg");

        // this.buttonEngleLeft30.buttonBackground.on("pointerdown", () => {
        //     if (!this.startGame) {
        //         this.velocityX = 750;
        //         this.velocityY = 4000;
        //     }
        // });

        // this.buttonEngleLeft15 = new Button(this, config.width / 2 - 110, config.height - 100, "15", { font: "60px Arial", fill: "#000000" }, "button_bg");

        // this.buttonEngleLeft15.buttonBackground.on("pointerdown", () => {
        //     if (!this.startGame) {
        //         this.velocityX = 500;
        //         this.velocityY = 4000;
        //     }
        // });

        // this.buttonEngle0 = new Button(this, config.width / 2, config.height - 100, "0", { font: "60px Arial", fill: "#000000" }, "button_bg");

        // this.buttonEngle0.buttonBackground.on("pointerdown", () => {
        //     if (!this.startGame) {
        //         this.velocityX = 0;
        //         this.velocityY = 4000;
        //     }
        // });

        // this.buttonEngleRight15 = new Button(this, config.width / 2 + 110, config.height - 100, "15", { font: "60px Arial", fill: "#000000" }, "button_bg");

        // this.buttonEngleRight15.buttonBackground.on("pointerdown", () => {
        //     if (!this.startGame) {
        //         this.velocityX = -500;
        //         this.velocityY = 4000;
        //     }
        // });

        // this.buttonEngleRight30 = new Button(this, config.width / 2 + 220, config.height - 100, "30", { font: "60px Arial", fill: "#000000" }, "button_bg");

        // this.buttonEngleRight30.buttonBackground.on("pointerdown", () => {
        //     if (!this.startGame) {
        //         this.velocityX = -750;
        //         this.velocityY = 4000;
        //     }
        // });

        this.slider = new Slider(this, 600, config.height - 100, 300, 20, 0x888888, 0xffffff, 0, 0, 1000);
        this.slider.setValue(50);

        this.slider.setScale(2)

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

class Slider extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, trackColor, handleColor, initialValue, minValue, maxValue) {
        super(scene, x, y);
        this.scene = scene;
        this.width = width;
        this.height = height;
        this.trackColor = trackColor;
        this.handleColor = handleColor;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.currentValue = initialValue || minValue;

        this.track = scene.add.rectangle(0, 0, width, height, trackColor);
        this.handle = scene.add.rectangle(0, 0, height, height, handleColor);
        this.handle.setInteractive({ draggable: true });

        this.add([this.track, this.handle]);
        this.setSize(width, height);
        this.scene.add.existing(this);

        this.handle.on("drag", this.onDragMove, this);
        this.handle.on("dragstart", this.onDragStart, this);
        this.handle.on("dragend", this.onDragEnd, this);
        this.handle.on("dragenter", this.onDragMove, this);
        this.handle.on("dragleave", this.onDragMove, this);

        this.isDragging = false; // Flag to track dragging state
    }

    onDragStart(pointer) {
        this.isDragging = true;
        this.onDragMove(pointer); // Update handle position immediately
    }

    onDragMove(pointer) {
        if (!this.isDragging) return;

        const localX = pointer.x - this.x - (this.width / 2); // Calculate the local X position relative to the container
        const clampedX = Phaser.Math.Clamp(localX, 0, this.width);
        const ratio = clampedX / this.width;
        this.currentValue = this.minValue + (this.maxValue - this.minValue) * ratio;
        this.handle.x = clampedX;
    }

    onDragEnd(pointer) {
        this.isDragging = false;
    }

    setValue(value) {
        this.currentValue = Phaser.Math.Clamp(value, this.minValue, this.maxValue);
        const ratio = (this.currentValue - this.minValue) / (this.maxValue - this.minValue);
        const handleX = ratio * this.width;
        this.handle.x = handleX;
    }

    getValue() {
        return this.currentValue;
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