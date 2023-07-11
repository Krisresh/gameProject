
class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
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
    }

    createBackground() {
        this.add.image(0, 0, "bg").setOrigin(0);
    }

    createObjects() {
        this.targets = this.physics.add.group();
        this.createTargets();

        this.firstBall = this.physics.add.image(config.width / 2, config.height - 300, "ball").setVelocity(0, 0).setBounce(1, 1).setCollideWorldBounds(true);
        this.firstBall.setAcceleration(0, 0);
        this.physics.world.enable(this.firstBall);
        this.firstBall.setScale(0.5);
    
        this.velocityX = null;
        this.velocityY = 5000;
        this.power = null;
        this.startGame = false;
    
        
    }
    

    startMove() {
        if (this.power) {
            this.firstBall.setVelocity(this.velocityX * this.power, -this.velocityY * this.power).setDrag(0.2);
            this.startGame = true;
        }
    }

    restartMove() {
        this.firstBall.setVelocity(0, 0).setPosition(config.width / 2, config.height - 300);
        this.startGame = false;

        this.velocityY = 5000;
    }

    update() {
        if (this.startGame) {
            // Замедление мяча
            console.log("222222222")
            const deceleration = 2; // Величина замедления, можно изменять
            this.firstBall.setAcceleration(-this.firstBall.body.velocity.x * deceleration, -this.firstBall.body.velocity.y * deceleration);
        } else {
            this.firstBall.setVelocity(0, 0).setAcceleration(0, 0);
        }
    }

    createTargets() {
        const targetWidth = config.width; // Ширина каждой полосы мишени
        const targetHeight = 100;
        const targetCount = 5;
        const targetSpacing = 10; // Расстояние между полосами мишеней
    
        const totalHeight = targetCount * (targetHeight + targetSpacing) - targetSpacing;
        const startY = (config.height - 1000 - totalHeight) / 2; // Начальная позиция по Y
    
        for (let i = 0; i < targetCount; i++) {
            const targetY = startY + i * (targetHeight + targetSpacing);
            const color = Phaser.Display.Color.RandomRGB().color; // Генерация случайного цвета
            const target = new Target(this, config.width / 2, targetY, targetWidth, targetHeight, color);
            this.targets.add(target);
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

        const angleSliderWidth = 440;
        const angleSliderHeight = 20;
        const angleSliderX = config.width / 2;
        const angleSliderY = config.height - 100;

        // this.angleSliderTrack = this.add.image(angleSliderX, angleSliderY, "slider_track").setOrigin(0);
    

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
            // const angle = Phaser.Math.Clamp((pointerX - angleSliderX) / angleSliderWidth, 0, 1) * (maxAngle - minAngle) + minAngle;

            const normalizedX = (pointerX - (angleSliderX - angleSliderWidth)) / (angleSliderWidth * 2);
            const angle = Phaser.Math.Linear(minAngle, maxAngle, normalizedX);

            // const velocityX = Math.cos(Phaser.Math.DegToRad(angle)) * 750;
            this.velocityX = angle;

            this.angleSliderThumb.x = Phaser.Math.Clamp(pointerX, angleSliderX - angleSliderWidth, angleSliderX + angleSliderWidth);
        };

        // Create power slider
        const powerSliderWidth = 100;
        const powerSliderHeight = 500;
        const powerSliderX = 1000;
        const powerSliderY = config.height - 500;

        //   this.powerSliderTrack = this.add.image(powerSliderX, powerSliderY, "slider_track_vertical").setOrigin(0);

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
            // const power = Phaser.Math.Clamp(1 - (pointerY - powerSliderY) / powerSliderHeight, 0, 1) * (maxPower - minPower) + minPower;
            const normalizedY = 1 - ((pointerY - (powerSliderY - powerSliderHeight)) / (powerSliderHeight * 2));
            const power = Phaser.Math.Linear(minPower, maxPower, normalizedY);
            this.power = power;

            this.powerSliderThumb.y = Phaser.Math.Clamp(pointerY, powerSliderY - powerSliderHeight, powerSliderY + powerSliderHeight);
        };
    }
}

class Target extends Phaser.GameObjects.Graphics {
    constructor(scene, x, y, width, height, color) {
        super(scene);

        this.x = x;
        this.y = y;

        this.fillStyle(color);
        this.fillRect(-width / 2, -height / 2, width, height);

        this.scene.add.existing(this);
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