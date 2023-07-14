class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
        this.score = 0; // Счет
        this.bet = 100; // Ставка на игру
    }

    preload() {
        this.load.image("bg", "assets/background.jpeg");
        this.load.image("ball", "assets/ball.png");
        this.load.image("button_bg", "assets/button_bg.jpg");
        this.load.image("slider_track", "assets/slider_track.jpg");
        this.load.image("slider_thumb", "assets/slider_thumb.jpg");
        this.load.image("slider_track_vertical", "assets/slider_track_vertical.jpg");
        this.load.image("slider_thumb_vertical", "assets/slider_thumb_vertical.jpg");
    }

    create() {
        this.createBackground();
        this.createObjects();
        this.createControlButtons();
        this.createWind();
        this.createScore();
        this.createBetText();

        this.math = new GameMath();
    }

    createBackground() {
        this.add.image(0, 0, "bg").setOrigin(0);
    }

    createObjects() {
        this.targets = this.physics.add.group();
        this.createTargets();

        this.firstBall = this.physics.add.image(config.width / 2, config.height - 300, "ball").setVelocity(0, 0).setBounce(1, 1).setCollideWorldBounds(false);
        this.firstBall.setAcceleration(0, 0);
        this.physics.world.enable(this.firstBall);
        this.firstBall.setScale(0.5);

        this.velocityX = null;
        this.velocityY = 5000;
        this.power = null;
        this.startGame = false;
        this.isFullStop = true;
        this.wind = {
            direction: null,
            strength: null
        };
    }

    startMove() {
        if (this.power) {
            this.firstBall.setVelocity((this.velocityX + this.wind.strength) * this.power, -this.velocityY * this.power).setDrag(0.2);
            this.startGame = true;
            this.isFullStop = false;
            this.score -= 100;
            this.updateScore();
        }
    }

    restartMove() {
        this.firstBall.setVelocity(0, 0).setPosition(config.width / 2, config.height - 300);
        this.startGame = false;
        this.generateWind();
        this.isFullStop = true;
    }

    update() {
        if (this.startGame) {
            // Замедление мяча
            const deceleration = 2; // Величина замедления, можно изменять
            this.firstBall.setAcceleration(-this.firstBall.body.velocity.x * deceleration, -this.firstBall.body.velocity.y * deceleration);
        } else {
            this.firstBall.setVelocity(0, 0).setAcceleration(0, 0);
        }

        if (this.firstBall.body.velocity.y > -1 && this.isFullStop == false) {
            this.isFullStop = true;
            this.checkBallTarget();
        }
    }

    checkBallTarget() {
        for (let i = 0; i < this.targetCount; i++) {
            if (this.firstBall.y + 50 >= this.targets.children.entries[i].y && this.firstBall.y + 50 <= this.targets.children.entries[i].y + this.targetHeight) {
                this.score += 200;
                this.updateScore();
                console.log("TARGET - " + i);
            }
        }
    }

    createScore() {
        this.scoreText = this.add.text(20, 10, `Score: ${this.score}`, { font: "50px Arial", fill: "#ffffff" });
    }

    updateScore() {
        this.scoreText.setText(`Score: ${this.score}`);
    }

    createBetText() {
        this.betText = this.add.text(20, 70, `Bet: ${this.bet}`, { font: "50px Arial", fill: "#ffffff" });
    }

    updateBetText() {
        this.betText.setText(`Bet: ${this.bet}`);
    }

    createTargets() {
        this.targetWidth = config.width; // Ширина каждой полосы мишени
        this.targetHeight = 100;
        this.targetCount = 5;
        this.targetSpacing = 10; // Расстояние между полосами мишеней

        this.totalHeight = this.targetCount * (this.targetHeight + this.targetSpacing) - this.targetSpacing;
        this.startY = (config.height - this.totalHeight) / 2; // Начальная позиция по Y

        for (let i = 0; i < this.targetCount; i++) {
            this.targetY = this.startY - i * (this.targetHeight + this.targetSpacing);
            this.color = Phaser.Display.Color.RandomRGB().color; // Генерация случайного цвета
            this.target = new Target(this, config.width / 2, this.targetY, this.targetWidth, this.targetHeight, this.color, ((i + 1) * 0.5));
            this.targets.add(this.target);
        }
    }

    createControlButtons() {
        //кноки управления игрой
        this.buttonStart = new Button(this, 300, config.height - 300, "ST", { font: "40px Arial", fill: "#000000" }, "button_bg");

        this.buttonStart.buttonBackground.on("pointerdown", () => {
            if (!this.startGame) {
                this.startMove();
                this.math.getSlidersValues();
            }
        });

        this.buttonRetart = new Button(this, 780, config.height - 300, "RST", { font: "40px Arial", fill: "#000000" }, "button_bg");

        this.buttonRetart.buttonBackground.on("pointerdown", () => {
            if (this.startGame) {
                this.restartMove();
            }
        });

        //кнопки угла

        const angleSliderWidth = 440;
        const angleSliderHeight = 20;
        const angleSliderX = config.width / 2;
        const angleSliderY = config.height - 100;

        this.angleSlider = this.add.rectangle(angleSliderX, angleSliderY, angleSliderWidth * 2, 100, 0xffffff).setInteractive()
            .on("pointerdown", (pointer) => {
                this.updateAngleSlider(pointer.x);
            })
            .on("pointermove", (pointer) => {
                if (pointer.isDown) {
                    this.updateAngleSlider(pointer.x);
                }
            });

        this.angleSliderThumb = this.add.image(angleSliderX, angleSliderY, "slider_thumb").setOrigin(0.5);

        this.updateAngleSlider = (pointerX) => {
            const minAngle = -750;
            const maxAngle = 750;
            const normalizedX = (pointerX - (angleSliderX - angleSliderWidth)) / (angleSliderWidth * 2);
            const angle = Phaser.Math.Linear(minAngle, maxAngle, normalizedX);
            this.velocityX = angle;
            this.angleSliderThumb.x = Phaser.Math.Clamp(pointerX, angleSliderX - angleSliderWidth, angleSliderX + angleSliderWidth);
        };

        // Create power slider
        const powerSliderWidth = 100;
        const powerSliderHeight = 500;
        const powerSliderX = 1000;
        const powerSliderY = config.height - 500;

        this.powerSlider = this.add.rectangle(powerSliderX, powerSliderY, powerSliderWidth, powerSliderHeight, 0xffffff)
            .setInteractive()
            .on("pointerdown", (pointer) => {
                this.updatePowerSlider(pointer.y);
            })
            .on("pointermove", (pointer) => {
                if (pointer.isDown) {
                    this.updatePowerSlider(pointer.y);
                }
            });

        this.powerSliderThumb = this.add.image(powerSliderX, powerSliderY, "slider_thumb_vertical").setOrigin(0.5);

        this.updatePowerSlider = (pointerY) => {
            const minPower = 0;
            const maxPower = 1;
            const normalizedY = 1 - ((pointerY - (powerSliderY - powerSliderHeight)) / (powerSliderHeight * 2));
            const power = Phaser.Math.Linear(minPower, maxPower, normalizedY);
            this.power = power;
            console.log(this.power)
            this.powerSliderThumb.y = Phaser.Math.Clamp(pointerY, powerSliderY - powerSliderHeight, powerSliderY + powerSliderHeight);
        };

        this.add1000Scores = new Button(this, config.width / 2, 50, "+1000", { font: "30px Arial", fill: "#000000" }, "button_bg");

        this.add1000Scores.buttonBackground.on("pointerdown", () => {
            this.score += 1000; // Установка ставки на игру равной 100
            this.updateScore();
        });

    }

    createWind() {
        this.generateWind();
    }

    generateWind() {
        const minDirection = -1;
        const maxDirection = 1;
        const minStrength = -500;
        const maxStrength = 500;
        this.wind.direction = Phaser.Math.FloatBetween(minDirection, maxDirection);
        this.wind.strength = Phaser.Math.Between(minStrength, maxStrength);
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