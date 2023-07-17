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

    getSlidersValues(powerSliderValue, angleSliderValue) {
        this.powerSliderValue = powerSliderValue;
        this.angleSliderValue = angleSliderValue;
        console.log(this.powerSliderValue + " " + this.angleSliderValue);
    }

    randomiseMultiplyer() {
        let multiplayers = [0, 0, 0, 0, 0, 0.5, 0.5, 0.5, 1, 1, 1, 1.5, 1.5, 1.5, 2, 2, 2.5];
        var randomElement = multiplayers[Math.floor(Math.random() * multiplayers.length)];
        return randomElement;
    }

    calculateCoord(multiplayer, targets) {
        this.multiplayer = multiplayer;
        this.targets = targets;

        console.log(this.multiplayer);
        console.log(this.targets);

        if (multiplayer == 0) {
            console.log("MULT = 0");
        } else {
            for (let i = 0; i < 5; i++) {
                if (this.multiplayer == this.targets.children.entries[i].multiplayer) {
                    this.randNumber = Math.random();
                    this.newX = this.randNumber * config.width;
                    this.newY = this.targets.children.entries[i].y + 50 - (this.randNumber * 100);
                    return [this.newX, this.newY];
                }
            }
        }
    }
}

window.GameMath = GameMath;