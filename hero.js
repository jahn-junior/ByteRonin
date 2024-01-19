class Hero {

    constructor(game, x, y) {
        Object.assign(this, { game, x, y });

        this.game.hero = this;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/hero.png");

        // this.x = 150;
        // this.y = 500;

        this.dir = 0; // 0 = right, 1 = left
        this.state = 0; // 0 = idle, 1 = parry, 2 = running, 3 = jumping, 4 = attacking

        this.health = 100;
        this.baseDamage = 50;

        this.animations = [];
        this.loadAnimations();
    };

    loadAnimations() {

        for (let i = 0; i < 2; i++) {
            this.animations.push([]);
            for (let j = 0; j < 5; j++) {
                this.animations[i].push([]);
            }
        }

        // idle frames
        this.animations[0][0] = new animator(this.spritesheet, 0, 0, 50, 29, 1, 0.08, true);
        this.animations[1][0] = new animator(this.spritesheet, 0, 29, 50, 29, 1, 0.08, true);

        // parry frames
        this.animations[0][1] = new animator(this.spritesheet, 50, 0, 50, 29, 1, 0.07, true);
        this.animations[1][1] = new animator(this.spritesheet, 50, 29, 50, 29, 1, 0.07, true);

        // running frames
        this.animations[0][2] = new animator(this.spritesheet, 100, 0, 50, 29, 6, 0.08, true);
        this.animations[1][2] = new animator(this.spritesheet, 100, 29, 50, 29, 6, 0.08, true);

        // jumping frames
        this.animations[0][3] = new animator(this.spritesheet, 400, 0, 50, 29, 2, 0.5, true);
        this.animations[1][3] = new animator(this.spritesheet, 400, 29, 50, 29, 2, 0.5, true);

        // attacking frames
        this.animations[0][4] = new animator(this.spritesheet, 500, 0, 50, 29, 4, 0.06, true);
        this.animations[1][4] = new animator(this.spritesheet, 500, 29, 50, 29, 4, 0.06, true);
    };

    update() {

        if (this.game.d && !this.game.a) {
            this.dir = 0;
            this.state = 2;
        } else if (this.game.a && !this.game.d) {
            this.dir = 1;
            this.state = 2;
        } else {
            this.state = 0;
        }

        if (this.game.w) {
            this.jump();
        }
        if (this.game.j) {
            this.state = 4; // TEMPORARY
        }
        if (this.game.k) {
            this.state = 1; // TEMPORARY
        }

        if (this.state == 2) {
            if (this.dir == 0) {
                this.x += 5;
            } else {
                this.x -= 5;
            }
        }
    };

    jump() {
        // TODO
    };

    basicAttack() {
        // TODO
    };

    parry() {
        // TODO
    };

    draw(ctx) {
        this.animations[this.dir][this.state].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y, PARAMS.SCALE);
    };
}