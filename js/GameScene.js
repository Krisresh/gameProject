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
        this.createBetText();

        this.math = new GameMath();
        this.math.randomiseMultiplyer();

        this.math.createScores();
        this.createScore();
    }

    createBackground() {
        this.add.image(0, 0, "bg").setOrigin(0);
    }

    createObjects() {
        this.targets = this.physics.add.group();
        this.createTargets();
        console.log(this.targets);

        this.windIndicator = new WindIndicator(this, 1010, 70, "arrow_up_down");

        this.firstBall = this.physics.add.image(config.width / 2, config.height - 300, "ball").setVelocity(0, 0).setBounce(1, 1).setCollideWorldBounds(false);
        this.firstBall.setAcceleration(0, 0);
        this.physics.world.enable(this.firstBall);
        this.firstBall.setScale(0.5);

        this.gameIsEnd = true;

        this.velocityX = null;
        this.velocityY = 5000;
        this.power = null;
        this.gameIsStart = false;
        this.isFullStop = true;
        this.wind = {
            direction: null,
            strength: null
        };
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
        this.gameIsStart = true;
        this.gameIsEnd = false;

        this.math.scoresWhenStart(this.bet);
        this.updateScore();

        this.multiplayer = this.math.randomiseMultiplyer();

        this.sliderValues = this.math.getSlidersValues(this.power, this.angle);
        this.newParametrs = this.math.calculateCoord(this.multiplayer, this.targets, this.sliderValues, this.bet);
        this.windIndicator.changeIndicator(this.newParametrs[2]);

        this.tweens.add({
            targets: this.firstBall,
            x: this.newParametrs[0],
            y: this.newParametrs[1],
            duration: 1000,
            ease: Phaser.Math.Easing.Quadratic.Out,
            onComplete: () => {
                this.updateScore();
                this.gameIsStart = false;
            }
        });
    }

    restartGame() {
        this.firstBall.setVelocity(0, 0).setPosition(config.width / 2, config.height - 300);
        this.windIndicator.changeIndicator("arrow_up_down");
        this.gameIsEnd = true;

        this.offset = Phaser.Math.Between(710, 910);
        for (let i = 0; i < 5; i++) {
            this.targets.children.entries[i].setRandomOffset(this.offset);
            this.offset -= 110;
        }
    }

    createScore() {
        this.scoreText = this.add.text(20, 10, `Score: ${this.math.getScores()}`, { font: "50px Arial", fill: "#ffffff" });
    }

    updateScore() {
        this.scoreText.setText(`Score: ${this.math.getScores()}`);
    }

    createBetText() {
        this.betText = this.add.text(20, 70, `Bet: ${this.bet}`, { font: "50px Arial", fill: "#ffffff" });
    }

    updateBetText() {
        this.betText.setText(`Bet: ${this.bet}`);
    }

    createControlButtons() {
        //кноки управления игрой
        this.buttonStart = new Button(this, 300, config.height - 300, "ST", { font: "40px Arial", fill: "#000000" }, "button_bg");

        this.buttonStart.buttonBackground.on("pointerdown", () => {
            if (!this.gameIsStart && this.gameIsEnd) {
                this.startGame();
                this.math.getSlidersValues();
            }
        });

        this.buttonRetart = new Button(this, 780, config.height - 300, "RST", { font: "40px Arial", fill: "#000000" }, "button_bg");

        this.buttonRetart.buttonBackground.on("pointerdown", () => {
            if (!this.gameIsStart) {
                this.restartGame();
            }
        });

        //кнопки угла

        const angleSliderWidth = 440;
        const angleSliderHeight = 20;
        const angleSliderX = config.width / 2;
        const angleSliderY = config.height - 100;
        this.angle = 1080 / 2;

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
            const minAngle = 200;
            const maxAngle = 880;
            const normalizedX = (pointerX - (angleSliderX - angleSliderWidth)) / (angleSliderWidth * 2);
            const angle = Phaser.Math.Linear(minAngle, maxAngle, normalizedX);
            this.angle = angle;
            console.log(this.angle);
            this.angleSliderThumb.x = Phaser.Math.Clamp(pointerX, angleSliderX - angleSliderWidth, angleSliderX + angleSliderWidth);
        };

        // Create power slider
        const powerSliderWidth = 100;
        const powerSliderHeight = 500;
        const powerSliderX = 1000;
        const powerSliderY = config.height - 500;
        this.power = (this.targets.children.entries[0].y + 300) / 2;

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
            const minPower = this.targets.children.entries[0].y + 300;
            const maxPower = 0;
            const normalizedY = 1 - ((pointerY - (powerSliderY - powerSliderHeight / 2)) / (powerSliderHeight));
            const power = Phaser.Math.Linear(minPower, maxPower, normalizedY);
            this.power = power;
            console.log(this.power)
            this.powerSliderThumb.y = Phaser.Math.Clamp(pointerY, powerSliderY - powerSliderHeight, powerSliderY + powerSliderHeight / 2);
        };
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