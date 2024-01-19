class Background {
    constructor(game) {
        this.game = game;
        this.image = ASSET_MANAGER.getAsset("./TempBackGround.jpg");
    }

    update() {
        // Background typically doesn't need to update anything
    }

    draw(ctx) {
        ctx.drawImage(this.image, 0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
    }
}
