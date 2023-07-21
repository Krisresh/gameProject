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

        // Set up the launch mechanism
        this.isLaunching = false;
        this.input.on("pointerdown", this.startLaunch, this);
        this.input.on("pointerup", this.launchBall, this);
    }

    createBackground() {
        this.add.image(0, 0, "bg").setOrigin(0);
    }

    createObjects() {
        // this.targets = this.physics.add.group();
        // this.createTargets();
        // console.log(this.targets);

        // this.windIndicator = new WindIndicator(this, 1010, 70, "arrow_up_down");

        this.firstBall = this.physics.add.image(config.width / 2, config.height - 300, "ball").setVelocity(0, 0).setBounce(1, 1).setCollideWorldBounds(false);
        this.firstBall.setAcceleration(0, 0);
        this.physics.world.enable(this.firstBall);
        this.firstBall.setScale(0.5);
        this.firstBall.setInteractive();

        this.input.setDraggable(this.firstBall);

        // Add the pointer drag event
        this.input.on("dragstart", (pointer, gameObject) => {
            gameObject.setAcceleration(0, 0);
        });

        this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on("dragend", (pointer, gameObject, dropped) => {
            if (dropped) {
                // Calculate the velocity based on the drag distance
                const velocityX = gameObject.x - pointer.x;
                const velocityY = gameObject.y - pointer.y;

                // Set the velocity to launch the ball in the opposite direction
                gameObject.setVelocity(velocityX, velocityY);

                // Reset the ball position
                gameObject.setPosition(config.width / 2, config.height - 300);
            }
        });
    }

    startLaunch(pointer) {
        if (!this.isLaunching && !this.gameIsEnd) {
            // Start the launch mechanism
            this.isLaunching = true;
            this.startX = pointer.x;
            this.startY = pointer.y;

            // Create a visual indicator for the launch
            this.launchIndicator = this.add.graphics();
        }
    }

    launchBall(pointer) {
        if (this.isLaunching) {
            // Calculate the launch velocity based on the distance dragged
            const launchPower = 10; // Adjust this value to control the launch power
            const velocityX = (this.startX - pointer.x) * launchPower;
            const velocityY = (this.startY - pointer.y) * launchPower;

            // Launch the ball
            this.firstBall.setVelocity(velocityX, velocityY);

            // Clean up the launch indicator and reset the launch mechanism
            this.launchIndicator.clear();
            this.isLaunching = false;
        }
    }

    update() {
        if (this.isLaunching) {
            // Update the launch indicator while the user is dragging
            this.launchIndicator.clear();
            this.launchIndicator.lineStyle(2, 0xffffff);
            this.launchIndicator.moveTo(this.firstBall.x, this.firstBall.y);
            this.launchIndicator.lineTo(this.input.x, this.input.y);
        }

        // Apply damping effect to slow down the ball until it stops
        const dampingFactor = 0.98; // Adjust this value to control damping strength
        if (!this.isLaunching && this.firstBall.body) {
            this.firstBall.setVelocity(
                this.firstBall.body.velocity.x * dampingFactor,
                this.firstBall.body.velocity.y * dampingFactor
            );

            // Stop the ball when its velocity is very low
            const minVelocityThreshold = 5;
            if (
                Math.abs(this.firstBall.body.velocity.x) < minVelocityThreshold &&
                Math.abs(this.firstBall.body.velocity.y) < minVelocityThreshold
            ) {
                this.firstBall.setVelocity(0, 0);
                // If the ball is stopped, reset the game
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