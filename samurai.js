class Samurai {

    constructor(game, x, y) {
        Object.assign(this, { game, x, y });

        this.game.samurai = this;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/samurai.png");

        this.x = x;
        this.y = y;

        this.jumpTick = 0;
        this.fallTick = 0;
        this.isFalling = true;
        this.velocityY = 0;

        this.dir = 1; // 0 = right, 1 = left
        this.state = 0; // 0 = idle, 1 = running, 2 = charging anim, 3 = primary melee, 4 = projectile blade
        this.visualRadius = 400;

        this.animations = [];
        this.updateBox();

        this.loadAnimations();
    }; 

    loadAnimations() {

        const SAMURAI_WIDTH = 64;
        const SAMURAI_HEIGHT = 64;

        for (let i = 0; i < 2; i++) {
            this.animations.push([]);
            for (let j = 0; j < 5; j++) {
                this.animations[i].push([]);
            }
        }

        // idle frames
        this.animations[0][0] = new animator(this.spritesheet, 3 * SAMURAI_WIDTH, SAMURAI_HEIGHT, SAMURAI_WIDTH,
            SAMURAI_HEIGHT, 1, 0.08, true); 

        this.animations[1][0] = new animator(this.spritesheet, 3 * SAMURAI_WIDTH, 0, SAMURAI_WIDTH,
            SAMURAI_HEIGHT, 1, 0.08, true);

        // running frames
        this.animations[0][1] = new animator(this.spritesheet, 0, SAMURAI_HEIGHT, SAMURAI_WIDTH,
            SAMURAI_HEIGHT, 3, 0.08, true);

        this.animations[1][1] = new animator(this.spritesheet, 0, 0, SAMURAI_WIDTH,
            SAMURAI_HEIGHT, 3, 0.08, true);

        // charging animation frames
        this.animations[0][2] = new animator(this.spritesheet, 3 * SAMURAI_WIDTH, SAMURAI_HEIGHT, SAMURAI_WIDTH,
            SAMURAI_HEIGHT, 3, 1, true);

        this.animations[1][2] = new animator(this.spritesheet, 3 * SAMURAI_WIDTH, 0, SAMURAI_WIDTH,
            SAMURAI_HEIGHT, 3, 1, true);

        // primary melee frames
        this.animations[0][3] = new animator(this.spritesheet, 8 * SAMURAI_WIDTH, SAMURAI_HEIGHT, SAMURAI_WIDTH,
            SAMURAI_HEIGHT, 2, 0.3, false);

        this.animations[1][3] = new animator(this.spritesheet, 8 * SAMURAI_WIDTH, 0, SAMURAI_WIDTH,
                SAMURAI_HEIGHT, 2, 0.3, false);

        // projectile blade attack frames
        this.animations[0][4] = new animator(this.spritesheet, 6 * SAMURAI_WIDTH, SAMURAI_HEIGHT, SAMURAI_WIDTH,
            SAMURAI_HEIGHT, 2, 0.3, false);

        this.animations[1][4] = new animator(this.spritesheet, 6 * SAMURAI_WIDTH, 0, SAMURAI_WIDTH,
                SAMURAI_HEIGHT, 2, 0.3, false);
    };

    applyGravity() {
        const GRAVITY = 0.5;
        this.velocityY += GRAVITY;
    }

    updatePosition() {
        this.y += this.velocityY;
    }

    updateBox() {
        this.box = new boundingbox(this.x - this.game.camera.x + 48,
            this.y - this.game.camera.y + 26,
            36 * PARAMS.SCALE,
            56 * PARAMS.SCALE);
    };

    update() {

        let canMoveLeft = true;
        let canMoveRight = true;
        let that = this;

        console.log(this.isFalling);

        this.applyGravity();
        this.updatePosition();

        this.game.stageTiles.forEach(function (tile) {
            if (that.box.collide(tile.box)) {
                if (that.box.bottom - tile.box.top <= 2 * PARAMS.SCALE) { // gravity
                    that.y = tile.y - 250;
                    that.velocityY = 0;
                } else if (that.dir == 0 && that.box.right > tile.box.left) { // right collision -->
                    canMoveRight = false;
                    that.x -= 2;
                    console.log("clause1");
                } else if (that.dir == 1 && that.box.left < tile.box.right) { // left collision <--
                    canMoveLeft = false;
                    console.log("clause2");
                }
            }

        });

        // samurai will always face torwards the hero
        if (this.game.camera.hero.x < this.x){
            this.dir = 1;
        } else {
            this.dir = 0;
        }

        // if the hero is within visualRadius of the samurai, it will follow the hero
        if (canSee(this, this.game.hero) && (this.x > this.game.hero.x) && (this.x - this.game.hero.x >= 10)){
            if (canMoveLeft) { 
                this.x -= 3;
                this.state = 1;
            }
        } else if (canSee(this, this.game.hero) && (this.x < this.game.hero.x) && (this.x - this.game.hero.x <= 10)){
            if (canMoveRight) {
                this.x += 3;
                this.state = 1;
            }
        } else if (getDistance(this, this.game.hero) <= 150 && this.state != 1) {
            this.state = 2
        } else {
            this.state = 0;
        }

        console.log("canMoveLeft: " + canMoveLeft);
        console.log("canMoveRight: " + canMoveRight);

        this.updateBox();
    }

    draw(ctx) {
        this.animations[this.dir][this.state].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, 
            this.y - this.game.camera.y, PARAMS.SCALE);
    };

}