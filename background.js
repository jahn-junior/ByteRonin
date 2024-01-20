class Background {
    constructor(game) {
        this.game = game;
        this.image = ASSET_MANAGER.getAsset("./background/background.png");
        // Assume full size of the background image is known
        this.imageWidth = 1024; // Replace with actual width of the image
        this.imageHeight = 768; // Replace with actual height of the image
    };

    update() {
        // Background typically doesn't need to update anything
    }

    draw(ctx) {
        ctx.drawImage(this.image, 0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
    }
}
