class Background {
    constructor(game) {
        this.game = game;
        this.images = [];
        this.frame = 0;
        this.frameDuration = 1 / 10; // Duration of each frame at 10 FPS
        this.lastFrameChangeTime = 0; // Track when the last frame change occurred

        // Load the 39 background images
        for (let i = 0; i < 39; i++) {
            this.images[i] = ASSET_MANAGER.getAsset("./background/background" + i + ".png");
        }
    }

    update() {
        let currentTime = this.game.timer.gameTime;

        // Check if it's time to change to the next frame
        if (currentTime - this.lastFrameChangeTime > this.frameDuration) {
            this.frame = (this.frame + 1) % this.images.length; // Cycle through frames
            this.lastFrameChangeTime = currentTime;
        }
    }

    draw(ctx) {
        ctx.drawImage(this.images[this.frame], 0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
    }
}

