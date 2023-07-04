class GameScene extends Phaser.Scene {
  // наследуется от родительского Phaser
  constructor() {
    super("Game");
  }
  preload() {
    this.load.image("bg", "assets/sprites/background.png"); // метод image загружает изображение
    this.load.image("card", "assets/sprites/card.png"); // метод image загружает изображение
    this.load.image("card1", "assets/sprites/card1.png"); // метод image загружает изображение
    this.load.image("card2", "assets/sprites/card2.png"); // метод image загружает изображение
    this.load.image("card3", "assets/sprites/card3.png"); // метод image загружает изображение
    this.load.image("card4", "assets/sprites/card4.png"); // метод image загружает изображение
    this.load.image("card5", "assets/sprites/card5.png"); // метод image загружает изображение
  }
  create() {
    //2. вывод бэкгранд на canvas на экран пользователю
    this.createBackgraund();
    this.createCards();
    this.start();
  }
  start() {
    this.openedCard = null; // переменная хранит карту которая октрыта на пердыдущем шаге
    this.openedCardsCount = 0; // счетчик октрытых пар
    this.initCards();
  }
  initCards() {
    let positions = this.getCardsPositions(); // получаем массив позиции в новую переменную
    this.cards.forEach((card) => {
      //forEach- пробег по циклу
      let position = positions.pop(); // получаем последнюю позицию в массиве
      card.close();
      card.setPosition(positions.x, positions.y); // установка новой случайной позиции
    });
  }

  createBackgraund() {
    this.add.sprite(0, 0, "bg").setOrigin(0, 0); // перенастраиваем начальную точку отрисовки
  }

  createCards() {
    this.cards = [];
    //let positions = this.getCardsPositions(); // получаем массив позиции в новую переменную
    //Phaser.Utils.Array.Shuffle(positions); // вызываем метод shufflе для отсортировки массива в рандоме
    // при каждой новой итерации в цикле перебора значений карт, при
    //создании карты будет выбираться из отсортированного в
    //случайном порядке массива последний элемент
    for (let value of config.cards) {
      // создаем по 2 экземпляра класса card для каждого идендификатора
      for (let i = 0; i < 2; i++) {
        this.cards.push(new Card(this, value)); // помещаем экземпляр класса card создаваемый через конструктор new card в массив this card, который обявили в методе create card
      }
    }
    this.input.on("gameobjectdown", this.onCardCliked, this); // событие
  }

  onCardCliked(pointer, card) {
    // обработчик события gameobjectdown
    // параметр card- тот спрайт который был нажат
    if (card.opened) {
      return false;
    }
    if (this.openedCard) {
      if (this.openedCard.value === card.value) {
        // если картинки равны- запомнить
        this.openedCard = null;
        ++this.openedCardsCount;
      } else {
        // картинки разыне - скрыть прошлую
        this.openedCard.close();
        this.openedCard = card;
      }
    } else {
      // еще нет октрытой карты
      this.openedCard = card;
    }
    card.open();
    if (this.openedCardsCount === this.cards.length / 2) {
      this.start(); // перезапуск игры в случае выигрыша
    }
  }

  getCardsPositions() {
    let positions = [];
    let cardTexture = this.textures.get("card").getSourceImage();
    let cardWidth = cardTexture.width + 4;
    let cardHeight = cardTexture.height + 4;
    let ofsetX = (this.sys.game.config.width - cardWidth * config.cols) / 2;
    let ofsetY = (this.sys.game.config.height - cardHeight * config.rows) / 2;

    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        positions.push({
          x: ofsetX + col * cardWidth,
          y: ofsetY + row * cardHeight,
        });
      }
    }
    return Phaser.Utils.Array.Shuffle(positions); // вызываем метод shufflе для отсортировки массива в рандоме
  }
}
