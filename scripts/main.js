const canvas = document.getElementById('Canvas');
canvas.width = 900;
canvas.height = 750;
const ctx = canvas.getContext('2d');

function resize() {
  const height = window.innerHeight - 20;
  const ratio = canvas.width / canvas.height;
  const width = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
}
window.addEventListener('load', resize, false);

class GameBasics {
  constructor(canvas) {
    this.width = canvas.width;
    this.height = canvas.height;

    this.playBoundaries = {
      top: 150,
      bottom: 650,
      left: 100,
      right: 800
    };

    this.level = 1;
    this.score = 0;
    this.shields = 2;

    this.setting = {
      updateSeconds: (1 / 60),
      fighterSpeed: 200,

      bulletSpeed: 130,
      bulletMaxFrequency: 500,

      enemyLines: 4,
      enemyColumns: 8,
      enemySpeed: 35,
      enemySinkingValue: 30,

      bombSpeed: 75,
      bombFrequency: 0.05,

      pointsPerEnemy: 25,
    };

    this.positionContainer = [];

    this.pressedKeys = {};
  }
  presentPosition() {
    return this.positionContainer.length > 0 ? this.positionContainer[this.positionContainer.length - 1] : null;
  }
  goToPosition(position) {
    if (this.presentPosition()) {
      this.positionContainer.length = 0;
    }
    if (position.entry) {
      position.entry(play);
    }
    this.positionContainer.push(position);
  }
  pushPosition(position) {
    this.positionContainer.push(position);
  }
  popPosition() {
    this.positionContainer.pop();
  }
  start() {
    setInterval(function () { gameLoop(play); }, this.setting.updateSeconds * 1000);
    this.goToPosition(new OpeningPosition());
  }
  keyDown(keyboardCode) {
    this.pressedKeys[keyboardCode] = true;
    if (this.presentPosition() && this.presentPosition().keyDown) {
      this.presentPosition().keyDown(this, keyboardCode);
    }
  }
  keyUp(keyboardCode) {
    delete this.pressedKeys[keyboardCode];
  }
}

function gameLoop(play) {
  let presentPosition = play.presentPosition();

  if (presentPosition) {
    if (presentPosition.update) {
      presentPosition.update(play);
    }
    if (presentPosition.draw) {
      presentPosition.draw(play);
    }
  }
}

window.addEventListener("keydown", function (e) {
  const keyboardCode = e.code;
  if (keyboardCode === "ArrowLeft" || keyboardCode === "ArrowRight" || keyboardCode === "Space") { e.preventDefault(); }
  play.keyDown(keyboardCode);
});

window.addEventListener("keyup", function (e) {
  const keyboardCode = e.code;
  play.keyUp(keyboardCode);
});

const play = new GameBasics(canvas);
play.sounds = new Sounds(); 
play.sounds.init();
play.start();
