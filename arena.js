class Arena {
    constructor(game) {
        this.game = game;
        this.image = ASSET_MANAGER.getAsset("./map/background.png");
        // Assume full size of the background image is known
        this.imageWidth = 1024; // Replace with actual width of the image
        this.imageHeight = 768; // Replace with actual height of the image
    };
    
    update() {

    };

    draw(ctx) {
        ctx.drawImage(this.image, 0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
        // let xView = this.game.camera.x;
        // let sx = xView % this.imageWidth;
        // let destX = -(20 * PARAMS.BITWIDTH); // Start drawing at the left edge of the canvas
        // // Continue drawing slices until the entire canvas width is covered
        // while (destX < PARAMS.CANVAS_WIDTH) {
        //     let sliceWidth = Math.min(this.imageWidth - sx, PARAMS.CANVAS_WIDTH - destX);
        //     ctx.drawImage(this.image, sx, 0, sliceWidth, this.imageHeight, destX, 0, sliceWidth, PARAMS.CANVAS_HEIGHT);
        //     destX += sliceWidth;
        //     sx = 0; // After the first slice, start from the beginning of the image
        // }
    }
}