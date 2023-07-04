class Card extends Phaser.GameObjects.Sprite {
  constructor(scene, value) {
    // получаем два параметра ссылка на обьект сцены и переменная position
    super(scene, 0, 0, "card"); //'card' + value, где value разворачивает карты\\ конструктор класса Phaser\ установка карты в координаты 00
    this.scene = scene; // ссылка на сцену
    this.value = value; // устанавливает свое изображение для карты
    this.setOrigin(0, 0);
    this.scene.add.existing(this); // выведет на сцену объект спрайт
    this.setInteractive(); // данный игровой объект является интерактивным
    //this.on("pointerdown", this.open, this); //событие нажатия
    this.opened = false;
  }

  open() {
    this.opend = true;
    this.setTexture("card" + this.value); // метод чтобы при нажатии на карту открывалось соответствуюшее приложение
  }

  close() {
    this.opend = false;
    this.setTexture("card"); // метод закрытия карты
  }
} //класс card прифаб; должен быть унаследован от класса спрайта
