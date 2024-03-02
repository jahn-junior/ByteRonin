class GameOver {
    constructor(game) {
        this.game = game;
        this.elapsed = 0;
        ASSET_MANAGER.pauseBackgroundMusic();
    }
    update() {
        this.elapsed += this.game.clockTick;
        if (this.elapsed > 2) {
            this.game.camera.clearEntities();
            this.game.addEntity(new TitleScreen(this.game));
        }
    }

    draw(ctx) {
        ctx.font = PARAMS.BLOCKWIDTH + 'px "Press Start 2P"';

        ctx.fillStyle = "Black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.fillStyle = "White";
        ctx.fillText("Byte Ronin", 5.7 * PARAMS.BLOCKWIDTH, 3.1 * PARAMS.BLOCKWIDTH);
        ctx.fillStyle = "Red";
        ctx.fillText("Byte Ronin", 5.6 * PARAMS.BLOCKWIDTH, 3 * PARAMS.BLOCKWIDTH);

        ctx.fillStyle = "White";
        ctx.fillText("GAME OVER", 6.1 * PARAMS.BLOCKWIDTH, 6.1 * PARAMS.BLOCKWIDTH);
        ctx.fillStyle = "Red";
        ctx.fillText("GAME OVER", 6 * PARAMS.BLOCKWIDTH, 6 * PARAMS.BLOCKWIDTH);
    }
}
