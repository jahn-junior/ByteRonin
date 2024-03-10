class SamuraiProjectile {

    constructor(game, x, y, w, h, dir, veloc, damage) {
        Object.assign(this, { game, x, y, w, h, dir, veloc, damage });

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/samuraiProjectile.png")
        this.animations = [];
        this.animations[0] = new animator(this.spritesheet, 64, 0, 64, 64, 1, 0.08, true); // right projectile blade -->
        this.animations[1] = new animator(this.spritesheet, 0, 0, 64, 64, 1, 0.08, true); // left projectile blade <--
        this.updateBox();

    };

    updateBox() {
        this.hitbox = new boundingbox(this.x, this.y + 72, this.w, this.h);
    };

    update() {
        let that = this;
        this.x += (this.dir == 0 ? this.veloc : -1 * this.veloc) * this.game.clockTick;
        this.updateBox();
        this.game.stageTiles.forEach(function (tile) {
            if (that.hitbox.collide(tile.box)) {
                if (that.hitbox.right > tile.box.left && that.hitbox.left < tile.box.right) {
                    that.hitbox = new boundingbox(3000, 3000, 1, 1); // teleport the BB outside arena on collision
                    that.removeFromWorld = true;
                }
            }
        });
    };

    draw(ctx) {
        if (this.dir == 0) {
            this.animations[this.dir].drawFrame( // separate clause to match right blade to it's box
                this.game.clockTick,
                ctx,
                this.x - 200,
                this.y - this.game.camera.y,
                PARAMS.SCALE
            );
        } else {
            this.animations[this.dir].drawFrame(
                this.game.clockTick,
                ctx,
                this.x,
                this.y - this.game.camera.y,
                PARAMS.SCALE
            );
        }
    };
}

class HeroProjectile {

    constructor(game, x, y, w, h, dir, veloc, damage) {
        Object.assign(this, { game, x, y, w, h, dir, veloc, damage });

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/hero.png");
        this.animations = [];
        this.animations[0] = new animator(this.spritesheet, 0, 108, 13, 3, 1, 0.08, true);
        this.updateBox();
    };

    updateBox() {
        this.hitbox = new boundingbox(this.x, this.y, this.w, this.h);
    }

    update() {
        let that = this;
        this.x += (this.dir == 0 ? this.veloc : -1 * this.veloc) * this.game.clockTick;
        this.updateBox();
        this.game.stageTiles.forEach(function (tile) {
            if (that.hitbox.collide(tile.box)) {
                if (that.hitbox.right > tile.box.left && that.hitbox.left < tile.box.right) {
                    that.hitbox = new boundingbox(3000, 3000, 1, 1); // teleport the BB outside arena on collision
                    that.removeFromWorld = true;
                }
            }
        });
    };

    draw(ctx) {
        if (this.dir == 0) {
            this.animations[0].drawFrame(
                this.game.clockTick,
                ctx,
                this.x + 100,
                this.y + 25 - this.game.camera.y,
                PARAMS.SCALE
            );
        } else {
            this.animations[0].drawFrame(
                this.game.clockTick,
                ctx,
                this.x,
                this.y + 25 - this.game.camera.y,
                PARAMS.SCALE
            );
        }
    };
}

class OrochiProjectile {

    constructor(game, x, y, w, h, dir, veloc, damage) {
        Object.assign(this, { game, x, y, w, h, dir, veloc, damage });

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/orochiProjectile.png");
        this.animations = [];
        this.animations[0] = new animator(this.spritesheet, 0, 0, 64, 64, 1, 0.08, true);
        this.updateBox();
    };

    updateBox() {
        this.hitbox = new boundingbox(this.x + 64, this.y - this.game.camera.y, this.w, this.h);
    }

    update() {
        let that = this;
        this.x += (this.dir == 0 ? this.veloc : -1 * this.veloc) * this.game.clockTick;
        this.updateBox();
        this.game.stageTiles.forEach(function (tile) {
            if (that.hitbox.collide(tile.box)) {
                if (that.hitbox.right > tile.box.left && that.hitbox.left < tile.box.right) {
                    that.hitbox = new boundingbox(3000, 3000, 1, 1); // teleport the BB outside arena on collision
                    that.removeFromWorld = true;
                }
            }
        });
    };

    draw(ctx) {
        this.animations[0].drawFrame(
            this.game.clockTick,
            ctx,
            this.x,
            this.y - this.game.camera.y - 96,
            PARAMS.SCALE
        );
    };
}

class wolfProjectile {
    constructor(game, x, y, w, h, dir, veloc, damage) {
    Object.assign(this, { game, x, y, w, h, dir, veloc, damage });

    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/wolfProjectile.png")
    this.animations = [];
    this.animations[0] = new animator(this.spritesheet, 34, 3, 32, 32, 1, 0.08, true)
    this.animations[1] = new animator(this.spritesheet, 0, 3, 32,32, 1, 0.08, true)


    
    this.updateBox();
    };

    updateBox() {
        if (this.dir == 1) {
            this.hitbox = new boundingbox(this.x, this.y - this.game.camera.y, this.w, this.h);
        } else {
            this.hitbox = new boundingbox(this.x - 142, this.y - this.game.camera.y, this.w, this.h);
        }
    }

    update() {
        let that = this;
        this.x += (this.dir == 0 ? this.veloc : -1 * this.veloc) * this.game.clockTick;
        this.updateBox();
        this.game.stageTiles.forEach(function (tile) {
            if (that.hitbox.collide(tile.box)) {
                if (that.hitbox.right > tile.box.left && that.hitbox.left < tile.box.right) {
                    that.hitbox = new boundingbox(3000, 3000, 1, 1); // teleport the BB outside arena on collision
                    that.removeFromWorld = true;
                }
            }
        });
    };

    draw(ctx) {
        if (this.dir == 0) {
            this.animations[this.dir].drawFrame( // separate clause to match right blade to it's box
                this.game.clockTick,
                ctx,
                this.x - 200,
                this.y - this.game.camera.y,
                PARAMS.SCALE
            );
        } else {
            this.animations[this.dir].drawFrame(
                this.game.clockTick,
                ctx,
                this.x,
                this.y - this.game.camera.y,
                PARAMS.SCALE
            );
        }
    };
};