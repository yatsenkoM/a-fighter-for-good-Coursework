class Objects {
	constructor() {
	}
	fighter(x, y, imageOfFighter) {
		this.x = x;
		this.y = y;
		this.width = 34;
		this.height = 28;
		this.imageOfFighter = imageOfFighter;
		this.imageOfFighter.src = "images/fighter.png";
		return this;
	}
	bullet(x, y) {
		this.x = x;
		this.y = y;
		return this;
	}
	enemy(x, y, line, column, imageOfEnemy, level) {
		this.x = x;
		this.y = y;
		this.line = line;
		this.column = column;
		this.width = 32;
		this.height = 24;
		this.imageOfEnemy = imageOfEnemy;
		this.level = level;
		this.imageOfEnemy.src = (this.level % 2 === 0) ? "images/enemy2.png" : "images/enemy1.png";
		return this;
	}
	bomb(x, y) {
		this.x = x;
		this.y = y;
		return this;
	}
}
