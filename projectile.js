class Projectile {

    constructor(game, x, y, w, h, dir, veloc, sprite, damage) {
        Object.assign(this, { game, x, y, w, h, dir, veloc, sprite, damage });

        //this.spritesheet = ASSET_MANAGER.getAsset("./sprites/${sprite}.png")
        this.animations = [];
        this.updateBox();

    };

    updateBox() {
        this.hitbox = new boundingbox(this.x, this.y, this.w, this.h);
    };

    update() {
        this.x += (this.dir == 0 ? this.veloc : -1 * this.veloc);
        this.updateBox();
    };

    draw(ctx) {
        ctx.fillRect(this.x, this.y, this.w, this.h);
    };
}