class GameOverPosition {
    constructor() {
    }
    draw(play) {
        ctx.clearRect(0, 0, play.width, play.height);
        ctx.font = "40px Montserrat";
        ctx.textAlign = "center";
        ctx.fillStyle = '#ffffff';
        ctx.fillText("Game Over!", play.width / 2, play.height / 2 - 120);

        ctx.font = "36px Montserrat";
        ctx.fillStyle = '#22b200';
        ctx.fillText("You've reached level " + play.level + " and your score is " + play.score + ".", play.width / 2, play.height / 2 - 40);

        ctx.font = "36px Montserrat";
        ctx.fillStyle = '#0bbe00';
        ctx.fillText("Press 'Space' to continue.", play.width / 2, play.height / 2 + 40);
    }
    keyDown(play, keyboardCode) {
        if (keyboardCode === 32) {
            play.goToPosition(new OpeningPosition());
        }
    }
}
