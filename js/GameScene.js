class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
        this.bet = 100;
        this.chipStartPositionX = config.width / 2;
        this.chipStartPositionY = config.height - 300;
        this.upperBoundary = this.chipStartPositionY;
        this.isLaunching = false;
        this.gameIsEnd = true;
        this.gameIsStart = false;
        this.launchPower = 10;
        this.targetsCount = 3;
        this.tolerance = 5;
        this.minVelocityThreshold = 5;
        this.seconds = 10;
        this.timeOut = this.seconds;
        this.targetsX = [0, -550, 550];
        this.targetsY = [400, 750, 750];
        this.firstChipTaken = true;
        this.timerIsEnd = false;
        this.destroyedTargets = [];
    }

    preload() {
        this.load.image("bg", "assets/background.jpg");
        this.load.image("powerbg", "assets/power_background.jpg");
        this.load.image("ball", "assets/ball.png");
        this.load.image("button_bg", "assets/button_bg.jpg");
        this.load.image("arrow", "assets/arrow.png");
    }

    create() {
        this.createBackground();
        this.math = new GameMath();
        this.windIndicator = new WindIndicator(this, 960, 120, "arrow");
        this.wind = new Wind(this);
        this.dragLine = this.add.graphics();
        this.createScoreIndicator();
        this.createBetTextIndicator();
        this.createTargets();
        this.createWindStrengthText();
        this.createTimerText();
        this.createChip();
        this.createLaunching();
    }

    createWindStrengthText() {
        this.windStrengthText = this.add.text(20, 130, `Wind: 0`, { font: "50px Arial", fill: "#ffffff" });
    }

    createTimerText() {
        this.timerText = this.add.text(config.width / 2, 50, `Time: ${this.timeOut}`, { font: "50px Arial", fill: "#ffffff" }).setOrigin(0.5);
    }

    onTimerTick() {
        this.timerText.setText("Time: " + this.timeOut);
        if (this.timeOut <= 0) {
            this.timerEvent.remove();
            this.timerIsEnd = true;
            //this.showWin(0);
        } else {
            --this.timeOut;
        }
    }

    startTimer() {
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.onTimerTick,
            callbackScope: this,
            loop: true //вызов каждую секунду 
        });
    }

    createBackground() {
        this.add.image(0, 0, "bg").setOrigin(0);
        this.add.image(0, this.chipStartPositionY, "powerbg").setOrigin(0);
    }

    createScoreIndicator() {
        this.scoreText = this.add.text(20, 10, `Score: ${this.math.getScore()}`, { font: "50px Arial", fill: "#ffffff" });
    }

    updateScoreIndicator() {
        this.scoreText.setText(`Score: ${this.math.getScore()}`);
    }

    createBetTextIndicator() {
        this.betText = this.add.text(20, 70, `Bet: ${this.bet}`, { font: "50px Arial", fill: "#ffffff" });
    }

    createTargets() {
        this.targets = this.physics.add.group();
        this.multipayers = this.math.randomiseTargetsMultiplayers(this.targetsCount);
        for (let i = 0; i < this.targetsCount; i++) {
            this.color = 0xb9b8b8;
            this.target = new Target(this, config.width / 2 + this.targetsX[i] / 2, this.targetsY[i], 500, this.color, this.multipayers[i]);
            this.targets.add(this.target);
        }
    }

    updateTargets() {
        this.multipayers = this.math.randomiseTargetsMultiplayers(this.targetsCount);
        for (let i = 0; i < this.targetsCount; i++) {
            const target = this.targets.children.entries[i];
            if (target instanceof Target) {
                target.updateMultiplayer(this.multipayers[i]);
            }
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
        this.chip.setDepth(1);


        this.input.setDraggable(this.chip);

        this.input.on("dragstart", (pointer, gameObject) => {
            if (this.firstChipTaken) {
                this.firstChipTaken = false;
                this.startTimer();
            } else if (this.timeOut == this.seconds) {
                this.startTimer();
            }
            if (this.gameIsEnd) gameObject.setAcceleration(0, 0);
            this.updateWindStrengthText();
        });

        this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
            if (this.gameIsEnd) {
                gameObject.x = dragX;
                gameObject.y = dragY;
            }
        });

        this.input.on("dragend", (pointer, gameObject, dropped) => {
            if (dropped) {
                this.windStrengthText.setText('');
                const velocityX = gameObject.x - pointer.x;
                const velocityY = gameObject.y - pointer.y;

                gameObject.setVelocity(velocityX, velocityY + 2000);
                gameObject.setPosition(this.chipStartPositionX, this.chipStartPositionY);
            }
        });
    }

    createLaunching() {
        this.chip.on("pointerdown", this.startLaunch, this);
        this.chip.on("pointerup", this.launchBall, this);

    }

    updateWindStrengthText() {
        this.windStrengthText.setText(`Wind: ${this.wind.strength}`);
    }

    startLaunch(pointer) {
        if (!this.isLaunching && this.gameIsEnd && this.chip.y > this.upperBoundary - 50) {
            this.isLaunching = true;
            this.startX = pointer.x;
            this.startY = pointer.y;
        }
    }

    launchBall(pointer) {
        // if (!this.firstChipTaken) {
        //     this.firstChipTaken = true;
        //     this.startTimer(); // Запуск таймера после первого взятия фишки
        // }
        if (this.isLaunching && this.gameIsEnd && this.chip.y > this.upperBoundary - 50) {

            const velocityX = (this.startX - pointer.x) * this.launchPower;
            const velocityY = (this.startY - pointer.y) * this.launchPower;

            this.chip.setVelocity(velocityX, velocityY);

            this.dragLine.clear();

            this.gameIsEnd = false;
            this.isLaunching = false;
            this.gameIsStart = true;

            this.math.updateScore(-this.bet);
            this.updateScoreIndicator();

            this.events.emit("launchBall");

        } else if (this.isLaunching) {
            this.chip.setPosition(this.chipStartPositionX, this.chipStartPositionY)
        }
    }

    checkTargetCollision(chip) {
        for (let target of this.targets.getChildren()) {
            const dx = target.x - chip.x;
            const dy = target.y - chip.y;
            const distanceSquared = dx * dx + dy * dy;
            const targetRadiusSquared = (500 / 2) * (500 / 2);

            if (distanceSquared <= targetRadiusSquared) {
                return target;
            }
        }
        return null;
    }

    removeTarget(target) {
        target.destroy(); // Удаление из отображения
        this.targets.remove(target); // Удаление из группы

        const destroyedTargetInfo = {
            x: target.x,
            y: target.y,
            multiplayer: target.multiplayer
        };
        this.destroyedTargets.push(destroyedTargetInfo);
    }

    update() {
        const dampingFactor = 0.98;
        if (!this.isLaunching && this.chip.body) {
            this.chip.setVelocity(
                this.chip.body.velocity.x * dampingFactor,
                this.chip.body.velocity.y * dampingFactor
            );

            if (Math.abs(this.chip.body.velocity.x) <= Math.abs(this.chip.body.acceleration.x) + this.tolerance &&
                Math.abs(this.chip.body.velocity.y) <= Math.abs(this.chip.body.acceleration.y) + this.tolerance) {
                this.chip.body.setAcceleration(0, 0);
                this.wind.stopBlowing();
            }

            if (this.chip.y > config.height + 100 || this.chip.y < 0 - 100 || this.chip.x > config.width + 100 || this.chip.x < 0 - 100) {
                this.showWin(0);
            }

            if (
                Math.abs(this.chip.body.velocity.x) < this.minVelocityThreshold &&
                Math.abs(this.chip.body.velocity.y) < this.minVelocityThreshold
            ) {
                this.chip.setVelocity(0, 0);
                const hitTarget = this.checkTargetCollision(this.chip);
                if (hitTarget && this.gameIsStart) {
                    this.showWin(1, hitTarget);
                    //this.removeTarget(hitTarget); // Удаление цели
                } else if (this.gameIsStart) {
                    this.showWin(1);
                }
            }
            if (this.timerIsEnd) {
                this.showWin(0);
                this.resetDestroyedTargets();
            }
        } else if (this.isLaunching) {
            this.dragLine.clear();
            this.dragLine.lineStyle(10, 0xffffff, 10);
            this.dragLine.beginPath();
            this.dragLine.moveTo(this.chipStartPositionX, this.chipStartPositionY);
            this.dragLine.lineTo(this.chip.x, this.chip.y);
            this.dragLine.closePath();
            this.dragLine.strokePath();
        }
        this.wind.update();
    }

    resetDestroyedTargets() {
        for (const targetInfo of this.destroyedTargets) {
            const { x, y, multiplayer } = targetInfo;
            const color = 0xb9b8b8;
            const target = new Target(this, x, y, 500, color, multiplayer);
            this.targets.add(target);
        }
        this.destroyedTargets = []; // Очищаем массив
    }

    showWin(delayInSeconds, target) {
        this.delayInSeconds = delayInSeconds;
        if (target) {
            this.target = target;
            this.winMultiplayer = this.target.multiplayer;

            this.gameIsStart = false;

            this.winText = this.add.text(config.width / 2, config.height / 2, `${this.bet * this.winMultiplayer}`, { font: "500px Arial", fill: "#ffffff" }).setOrigin(0.5);
            this.math.updateScore(this.bet * this.winMultiplayer);
            this.updateScoreIndicator();

            this.removeTarget(this.target); // Удаление цели
            this.target.multiplayerText.destroy();

            this.time.delayedCall(this.delayInSeconds * 1000, this.restartGame, [], this);
        } else {
            this.gameIsStart = false;
            this.timerText.setText("Time: " + this.timeOut);
            this.time.delayedCall(this.delayInSeconds * 1000, this.restartGame, [], this);
        }
    }

    showWinTotalScore() {
        this.totalScoreText = this.add.text(config.width / 2, config.height / 2, `Total Score: ${this.math.getScore()}`, { font: "50px Arial", fill: "#ffffff" }).setOrigin(0.5);
        this.time.delayedCall(3000, () => {
            if (this.totalScoreText) {
                this.totalScoreText.destroy();
                //this.totalScoreText = null;
            }
        });
    }

    updateTimer() {
        this.timeOut = this.seconds;
        this.timerEvent.remove();
        this.timerIsEnd = false;
        //this.resetScore();
    }

    resetScore() {
        this.math.createScore();
        this.updateScoreIndicator();
    }

    restartGame() {
        this.chip.setVelocity(0);
        this.chip.setAcceleration(0);
        this.chip.setPosition(this.chipStartPositionX, this.chipStartPositionY);
        this.gameIsEnd = true;
        if (this.winText) this.winText.destroy();
        this.events.emit("restartGame");
        this.updateTargets();
        this.updateWindStrengthText();
        if (this.timeOut <= 0) {
            this.showWinTotalScore();
            this.updateTimer();
            this.resetScore();
        }
    }
}

class Wind {
    constructor(scene) {
        this.scene = scene;
        this.direction = 0;
        this.strength = 0;
        this.isBlowing = false;

        this.isFirstGame = true;

        this.scene.events.on("launchBall", this.startBlowing, this);
        this.scene.events.on("stopBall", this.stopBlowing, this);
        this.scene.events.on("restartGame", this.randomizeWind, this);

        if (this.isFirstGame) {
            this.randomizeWind();
            this.isFirstGame = false;
        }
    }

    startBlowing() {
        if (!this.isBlowing) {
            this.isBlowing = true;
        }
    }

    stopBlowing() {
        this.isBlowing = false;
    }

    randomizeWind() {
        this.windParams = this.scene.math.randomiseWind();
        this.direction = this.windParams[0];
        this.strength = this.windParams[1];
        this.scene.windIndicator.updateIndicator(this.windParams[0]);

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

    updateMultiplayer(multiplayer) {
        this.multiplayer = multiplayer;
        this.multiplayerText.setText(this.multiplayer + "X");
    }
}

class WindIndicator extends Phaser.GameObjects.Container {
    constructor(scene, x, y, windIndicatorKey) {
        super(scene, x, y);
        this.x = x;
        this.y = y;

        this.windIndicatorImg = scene.add.image(this.x, this.y, windIndicatorKey);
    }

    updateIndicator(angle) {
        this.windIndicatorImg.angle = angle;
    }
}