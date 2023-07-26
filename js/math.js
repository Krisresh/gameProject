class GameMath {
    constructor() {}

    randomiseMultiplyer() {
        let multiplayers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0.5, 0.5, 1, 1, 1, 1.5, 1.5, 1.5, 2, 2, 2.5];
        var randomElement = multiplayers[Math.floor(Math.random() * multiplayers.length)];
        return randomElement;
    }

    randomiseTargetsMultiplayers(targetsCount) {
        this.targetsMultiplayers = [];
        for (let i = 0; i < targetsCount; i++) {
            this.targetsMultiplayers[i] = this.randomiseMultiplyer();
        }
        return this.targetsMultiplayers;
    }

    randomiseWind() {
        this.direction = Phaser.Math.Between(0, 359);
        this.strength = Phaser.Math.Between(50, 150);
        return [this.direction, this.strength]
    }
}

window.GameMath = GameMath;