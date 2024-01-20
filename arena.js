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
        ctx.drawImage(this.spritesheet, 0, 0, 129, 65, this.x- this.game.camera.x, this.y,  PARAMS.BLOCKWIDTH * 5, PARAMS.BLOCKWIDTH * 2.5);
    };
}

class Pillar1 {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/ground.png");
    }
    load() {

    };
    update() {

    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet, 129, 0, 255, 65, this.x- this.game.camera.x, this.y,  PARAMS.BLOCKWIDTH * 5, PARAMS.BLOCKWIDTH * 2.5);
    };
}