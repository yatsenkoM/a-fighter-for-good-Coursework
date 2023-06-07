function PausePosition() {
}

PausePosition.prototype.draw = function(play) {
    ctx.clearRect(0, 0, play.width, play.height);
    ctx.font="40px Montserrat";
    ctx.fillStyle = '#ffffff';
    ctx.textAlign="center";
    ctx.fillText("Paused", play.width / 2, play.height/2 - 300);

    ctx.fillStyle = '#D7DF01';
	ctx.font="36px Montserrat";
	ctx.fillText("P: back to the current game", play.width / 2, play.height/2 - 250 );
    ctx.fillText("ESC: quit the current game", play.width / 2, play.height/2 - 210);
    
    ctx.font="40px Montserrat";
    ctx.fillStyle = '#ffffff';
	ctx.fillText("Game controls reminder", play.width / 2, play.height/2 - 120);
	ctx.fillStyle = '#D7DF01';
	ctx.font="36px Montserrat";
	ctx.fillText("Left Arrow : Move Left", play.width / 2, play.height/2 - 70);
	ctx.fillText("Right Arrow : Move Right", play.width / 2, play.height/2 - 30);
	ctx.fillText("Space : Fire", play.width / 2, play.height/2 + 10);
};

PausePosition.prototype.keyDown = function(play, keyboardCode) {
    if(keyboardCode === 80) {
        play.popPosition();
    }
    if(keyboardCode === 27) {
        play.pushPosition(new GameOverPosition());
    }
};
