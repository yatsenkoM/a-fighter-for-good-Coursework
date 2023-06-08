class InGamePosition {
    constructor(setting, level) {
        this.setting = setting;
        this.level = level;
        this.object = null;
        this.fighter = null;
        this.bullets = [];
        this.lastBulletTime = null;
        this.enemies = [];
        this.bombs = [];
    }
    entry(play) {
        this.imageOfFighter = new Image();
        this.imageOfEnemy = new Image();
        this.turnAround = 1;
        this.horizontalMoving = 1;
        this.verticalMoving = 0;
        this.enemiesAreSinking = false;
        this.enemyPresentSinkingValue = 0;

        let presentLevel = this.level < 11 ? this.level : 10;
        this.enemySpeed = this.setting.enemySpeed + (presentLevel * 7);
        this.bombSpeed = this.setting.bombSpeed + (presentLevel * 10);
        this.bombFrequency = this.setting.bombFrequency + (presentLevel * 0.05);
        this.fighterSpeed = this.setting.fighterSpeed;
        this.object = new Objects();
        this.fighter = this.object.fighter((play.width / 2), play.playBoundaries.bottom, this.imageOfFighter);

        const lines = this.setting.enemyLines;
        const columns = this.setting.enemyColumns;
        const enemiesInitial = [];

        let line, column;
        for (line = 0; line < lines; line++) {
            for (column = 0; column < columns; column++) {
                this.object = new Objects();
                let x, y;
                x = (play.width / 2) + (column * 50) - ((columns - 1) * 25);
                y = (play.playBoundaries.top + 30) + (line * 30);
                enemiesInitial.push(this.object.enemy(
                    x,
                    y,
                    line,
                    column,
                    this.imageOfEnemy,
                    this.level
                ));
            }
        }
        this.enemies = enemiesInitial;
    }
    update(play) {
        const fighter = this.fighter;
        const fighterSpeed = this.fighterSpeed;
        const upSec = this.setting.updateSeconds;
        const bullets = this.bullets;

        if (play.pressedKeys["ArrowLeft"]) {
            fighter.x -= fighterSpeed * upSec;
        }
        if (play.pressedKeys["ArrowRight"]) {
            fighter.x += fighterSpeed * upSec;
        }
        if (play.pressedKeys["Space"]) {
            this.shoot();
        }

        if (fighter.x < play.playBoundaries.left) {
            fighter.x = play.playBoundaries.left;
        }
        if (fighter.x > play.playBoundaries.right) {
            fighter.x = play.playBoundaries.right;
        }

        for (let i = 0; i < bullets.length; i++) {
            let bullet = bullets[i];
            bullet.y -= upSec * this.setting.bulletSpeed;
            if (bullet.y < 0) {
                bullets.splice(i--, 1);
            }
        }

        let reachedSide = false;

        for (let i = 0; i < this.enemies.length; i++) {
            let enemy = this.enemies[i];
            let fresh_x = enemy.x + this.enemySpeed * upSec * this.turnAround * this.horizontalMoving;
            let fresh_y = enemy.y + this.enemySpeed * upSec * this.verticalMoving;
            if (fresh_x > play.playBoundaries.right || fresh_x < play.playBoundaries.left) {
                this.turnAround *= -1;
                reachedSide = true;
                this.horizontalMoving = 0;
                this.verticalMoving = 1;
                this.enemiesAreSinking = true;
            }
            if (reachedSide !== true) {
                enemy.x = fresh_x;
                enemy.y = fresh_y;
            }
        }

        if (this.enemiesAreSinking === true) {
            this.enemyPresentSinkingValue += this.enemySpeed * upSec;
            if (this.enemyPresentSinkingValue >= this.setting.enemySinkingValue) {
                this.enemiesAreSinking = false;
                this.verticalMoving = 0;
                this.horizontalMoving = 1;
                this.enemyPresentSinkingValue = 0;
            }
        }

        const frontLineEnemies = [];
        for (let i = 0; i < this.enemies.length; i++) {
            let enemy = this.enemies[i];
            if (!frontLineEnemies[enemy.column] || frontLineEnemies[enemy.column].line < enemy.line) {
                frontLineEnemies[enemy.column] = enemy;
            }
        }

        for (let i = 0; i < this.setting.enemyColumns; i++) {
            let enemy = frontLineEnemies[i];
            if (!enemy)
                continue;
            let chance = this.bombFrequency * upSec;
            this.object = new Objects();
            if (chance > Math.random()) {
                this.bombs.push(this.object.bomb(enemy.x, enemy.y + enemy.height / 2));
            }
        }
        for (let i = 0; i < this.bombs.length; i++) {
            let bomb = this.bombs[i];
            bomb.y += upSec * this.bombSpeed;
            if (bomb.y > this.height) {
                this.bombs.splice(i--, 1);
            }
        }
        for (let i = 0; i < this.enemies.length; i++) {
            let enemy = this.enemies[i];
            let collision = false;
            for (let j = 0; j < bullets.length; j++) {
                let bullet = bullets[j];
                if (bullet.x >= (enemy.x - enemy.width / 2) && bullet.x <= (enemy.x + enemy.width / 2) &&
                    bullet.y >= (enemy.y - enemy.height / 2) && bullet.y <= (enemy.y + enemy.height / 2)) {
                    bullets.splice(j--, 1);
                    collision = true;
                    play.score += this.setting.pointsPerEnemy;
                }
            }

            if (collision === true) {
                this.enemies.splice(i--, 1);
                play.sounds.playSound('enemyDeath');
            }
        }

        for (let i = 0; i < this.bombs.length; i++) {
            let bomb = this.bombs[i];
            if (bomb.x + 2 >= (fighter.x - fighter.width / 2) &&
                bomb.x - 2 <= (fighter.x + fighter.width / 2) &&
                bomb.y + 6 >= (fighter.y - fighter.height / 2) &&
                bomb.y <= (fighter.y + fighter.height / 2)) {
                this.bombs.splice(i--, 1);
                play.sounds.playSound('wound');
                play.shields--;
            }
        }

        for (let i = 0; i < this.enemies.length; i++) {
            let enemy = this.enemies[i];
            if ((enemy.x + enemy.width / 2) > (fighter.x - fighter.width / 2) &&
                (enemy.x - enemy.width / 2) < (fighter.x + fighter.width / 2) &&
                (enemy.y + enemy.height / 2) > (fighter.y - fighter.height / 2) &&
                (enemy.y - enemy.height / 2) < (fighter.y + fighter.height / 2)) {
                play.sounds.playSound('wound');
                play.shields = -1;
            }
        }

        if (play.shields < 0) {
            play.goToPosition(new GameOverPosition());
        }

        if (this.enemies.length === 0) {
            play.level += 1;
            play.goToPosition(new TransferPosition(play.level));
        }
    }
    shoot() {
        if (this.lastBulletTime === null || ((new Date()).getTime() - this.lastBulletTime) > (this.setting.bulletMaxFrequency)) {
            this.object = new Objects();
            this.bullets.push(this.object.bullet(this.fighter.x, this.fighter.y - this.fighter.height / 2, this.setting.bulletSpeed));
            this.lastBulletTime = (new Date()).getTime();
            play.sounds.playSound('shot');
        }
    }
    draw(play) {
        ctx.clearRect(0, 0, play.width, play.height);
        ctx.drawImage(this.imageOfFighter, this.fighter.x - (this.fighter.width / 2), this.fighter.y - (this.fighter.height / 2));

        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < this.bullets.length; i++) {
            let bullet = this.bullets[i];
            ctx.fillRect(bullet.x - 1, bullet.y - 6, 2, 6);
        }

        for (let i = 0; i < this.enemies.length; i++) {
            let enemy = this.enemies[i];
            ctx.drawImage(this.imageOfEnemy, enemy.x - (enemy.width / 2), enemy.y - (enemy.height / 2));
        }

        ctx.fillStyle = "#441c07";
        for (let i = 0; i < this.bombs.length; i++) {
            let bomb = this.bombs[i];
            ctx.fillRect(bomb.x - 2, bomb.y, 4, 6);
        }

        ctx.font = "16px Montserrat";

        ctx.fillStyle = "#383737";
        ctx.textAlign = "left";
        ctx.fillText("Press S to switch sound effects ON/OFF.Sound:", play.playBoundaries.left, play.playBoundaries.bottom + 70);

        let soundStatus = (play.sounds.muted === true) ? "OFF" : "ON";
        ctx.fillStyle = (play.sounds.muted === true) ? '#FF0000' : '#0B6121';
        ctx.fillText(soundStatus, play.playBoundaries.left + 375, play.playBoundaries.bottom + 70);

        ctx.fillStyle = '#424242';
        ctx.textAlign = "right";
        ctx.fillText("Press P to Pause.", play.playBoundaries.right, play.playBoundaries.bottom + 70);

        ctx.textAlign = "center";
        ctx.fillStyle = '#BDBDBD';

        ctx.font = "bold 24px Montserrat";
        ctx.fillText("Score", play.playBoundaries.right, play.playBoundaries.top - 75);
        ctx.font = "bold 30px Montserrat";
        ctx.fillText(play.score, play.playBoundaries.right, play.playBoundaries.top - 25);

        ctx.font = "bold 24px Montserrat";
        ctx.fillText("Level", play.playBoundaries.left, play.playBoundaries.top - 75);
        ctx.font = "bold 30px Montserrat";
        ctx.fillText(play.level, play.playBoundaries.left, play.playBoundaries.top - 25);

        ctx.textAlign = "center";
        if (play.shields > 0) {
            ctx.fillStyle = '#BDBDBD';
            ctx.font = "bold 24px Montserrat";
            ctx.fillText("Shields", play.width / 2, play.playBoundaries.top - 75);
            ctx.font = "bold 30px Montserrat";
            ctx.fillText(play.shields, play.width / 2, play.playBoundaries.top - 25);
        }
        else {
            ctx.fillStyle = '#ff4d4d';
            ctx.font = "bold 24px Montserrat";
            ctx.fillText("WARNING", play.width / 2, play.playBoundaries.top - 75);
            ctx.fillStyle = '#BDBDBD';
            ctx.fillText("No shields left!", play.width / 2, play.playBoundaries.top - 25);
        }
    }
    keyDown(play, keyboardCode) {
        if (keyboardCode === "KeyS") {
            play.sounds.muteSwitch();
        }
        if (keyboardCode === "KeyP") {
            play.pushPosition(new PausePosition());
        }
    }
}
