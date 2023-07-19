// в файл математики при нажатии на старт передаются значения слайдеров, далее рандомно выбирается размер выигрыша, а затем примерное место где должна в таком случае остановиться фишка, кроме того
// в математике расчитывается направление ветра. фишка двигается к месту своей остановки с помощью твина, никакого физического движения по факту не будет

// передается в класс GameMath - положения слайдеров
// класс GameMath возвращает - координаты в которые отправится путешествовать фишка

// 1. мы получаем значения слайдеров, умножаем их на параметры поля, а затем сдивгаем твином фишку на получившиеся координаты
// 2. исходя из того какой множитель зарандомился высчитываем куда надо сдивнуть фишку относительно тех координать из п1
// 3. туда ее и сдивгаем вместо п1, а в сторону сдвига просто рисуем стрелку ветра (которого на самом деле нет)

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
            if (this.sliders[0] < 0.5) {
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