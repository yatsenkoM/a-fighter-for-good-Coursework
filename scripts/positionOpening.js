class OpeningPosition {
    constructor() {
    }
    draw(play) {
        ctx.clearRect(0, 0, play.width, play.height);
        ctx.font = "80px Montserrat";
        ctx.textAlign = "center";
        const gradient = ctx.createLinearGradient((play.width / 2 - 180), (play.height / 2), (play.width / 2 + 180), (play.height / 2));
        gradient.addColorStop("0", "yellow");
        gradient.addColorStop("0.5", "red");
        gradient.addColorStop("1.0", "yellow");
        ctx.fillStyle = gradient;
        ctx.fillText("A fighter for good", play.width / 2, play.height / 2 - 70);

        ctx.font = "40px Montserrat";
        ctx.fillStyle = '#22b200';
        ctx.fillText("Press 'Space' to start.", play.width / 2, play.height / 2);

        ctx.fillStyle = '#2e2f00';
        ctx.fillText("Game Controls", play.width / 2, play.height / 2 + 210);
        ctx.fillText("Left Arrow : Move Left", play.width / 2, play.height / 2 + 260);
        ctx.fillText("Right Arrow : Move Right", play.width / 2, play.height / 2 + 300);
        ctx.fillText("Space : Fire", play.width / 2, play.height / 2 + 340);
    }
    keyDown(play, keyboardCode) {
        if (keyboardCode === 32) {
            play.level = 1;
            play.score = 0;
            play.shields = 2;
            play.goToPosition(new TransferPosition(play.level));
        }
    }
}
