class OrbitalStrike {

    constructor(game) {
        Object.assign(this, {game});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/orbital.png");
        this.animations = [];

        this.animations[0] = new animator(this.spritesheet, 0, 0, 64, 256, 3, 0.5, true);

        this.animations[1] = new animator(this.spritesheet, 192, 0, 64, 256, 2, 0.25, true);

        this.animations[2] = new animator(this.spritesheet, 0, 0, 64, 256, 1, 0.5, true);

        this.x = -500;
        this.y = -50;
        this.timer = 0;

        this.box = null;
        this.updateBox();

        // 0 = warming up, 1 = active
        this.state = 0;
    }

    updateBox() {
        this.box = new boundingbox(
            this.x + 48,
            this.y,
            48 * PARAMS.SCALE,
            1200
        );
    }

    update() {
        const STARTUP = 1.5;
        const DURATION = 4;

        let boss = null;
        if (this.game.camera.boss) {
            boss = this.game.camera.boss;
            this.x = boss.x - this.game.camera.x;
        }

        this.timer += this.game.clockTick;

        if (this.timer < STARTUP) {
            this.y += 25 * this.game.clockTick;
            this.state = 0;
            this.box = null;
        } else if (this.timer < DURATION) {
            this.state = 1;
            this.updateBox();
        } else  if (this.timer < DURATION + STARTUP) {
            this.state = 2;
            this.y -= 100 * this.game.clockTick;
            this.box = null;
        }
    }

    draw(ctx) {
        this.animations[this.state].drawFrame(
            this.game.clockTick,
            ctx,
            this.x,
            this.y,
            PARAMS.SCALE
        );
    }
}