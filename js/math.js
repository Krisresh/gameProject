class GameMath {
    constructor() {
        // super();
    }

    createScores() {
        this.scores = 0;
    }

    getScores() {
        return this.scores;
    }

    scoresWhenStart(bet) {
        this.scores -= bet;
    }

    getSlidersValues(powerSliderValue, angleSliderValue) {
        this.powerSliderValue = powerSliderValue;
        this.angleSliderValue = angleSliderValue;
        return [this.powerSliderValue, this.angleSliderValue]
    }

    randomiseMultiplyer() {
        let multiplayers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0.5, 0.5, 1, 1, 1, 1.5, 1.5, 1.5, 2, 2, 2.5];
        var randomElement = multiplayers[Math.floor(Math.random() * multiplayers.length)];
        return randomElement;
    }

    calculateWind(sliderY, mathY) {
        if (mathY < sliderY) {
            return "arrow_up";
        } else {
            return "arrow_down";
        }
    }

    calculateCoord(multiplayer, targets, sliders, bet) {
        this.multiplayer = multiplayer;
        this.targets = targets;
        this.sliders = sliders;
        this.bet = bet;

        console.log(this.multiplayer);
        console.log(this.targets);

        if (multiplayer == 0) {
            if (this.sliders[0] > (this.targets.children.entries[0].y + 300) / 2) {
                this.randNumber = Math.random();
                this.newX = this.sliders[1];
                this.newY = (this.targets.children.entries[0].y + ((1920 - this.targets.children.entries[0].y - 500) * this.randNumber));
                this.arrow = this.calculateWind(this.powerSliderValue, this.newY);
                return [this.newX, this.newY, this.arrow];
            } else {
                this.randNumber = Math.random();
                this.newX = this.sliders[1];
                this.newY = (this.targets.children.entries[4].y * this.randNumber);
                this.arrow = this.calculateWind(this.powerSliderValue, this.newY);
                return [this.newX, this.newY, this.arrow];
            }
        } else {
            for (let i = 0; i < 5; i++) {
                if (this.multiplayer == this.targets.children.entries[i].multiplayer) {
                    this.randNumber = Math.random();
                    this.newX = this.sliders[1];
                    this.newY = this.targets.children.entries[i].y + 50 - (this.randNumber * 100);
                    this.scores = this.scores + (this.bet * this.targets.children.entries[i].multiplayer);
                    this.arrow = this.calculateWind(this.powerSliderValue, this.newY);
                    return [this.newX, this.newY, this.arrow];
                }
            }
        }
    }
}

window.GameMath = GameMath;