class Floor1 {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/ground.png");
    }
    load() {

    };
    update() {

    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet, 
            0, 
            64, 
            64, 
            64, 
            this.x- this.game.camera.x, 
            this.y,  PARAMS.BLOCKWIDTH * 1.75, 
            PARAMS.BLOCKWIDTH *1.75);
    };
}

class Floor2 {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/ground.png");
    }
    load() {

    };
    update() {

    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet, 
            64, 
            64, 
            64, 
            64, 
            this.x- this.game.camera.x, 
            this.y,  
            PARAMS.BLOCKWIDTH * 1.75, PARAMS.BLOCKWIDTH * 1.75);
    };
}