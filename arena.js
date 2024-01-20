class Arena {
    constructor(game) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/ground.png");
        this.tiles = [];
    }
    load() {

    };
    update() {

    };

    draw(ctx) {
    };
}
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
        console.log(this.x);
        console.log(this.y);
    };
}