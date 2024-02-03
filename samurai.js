class Samurai {

    constructor(game, x, y) {
        Object.assign(this, { game, x, y });

        this.game.samurai = this;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/samurai.png");

        this.x = x;
        this.y = y;
        this.jumpTick = 0;
        this.fallTick = 0;

        this.dir = 1; // 0 = right, 1 = left
        this.state = 0; // 0 = idle, 1 = running, 2 = charging anim, 3 = primary melee, 4 = projectile blade
        this.visualRadius = 400;

        this.animations = [];

        this.loadAnimations();

        // this.updateBox();
    }; 

    loadAnimations() {

        const SAMURAI_WIDTH = 64;
        const SAMURAI_HEIGHT = 64;

        for (let i = 0; i < 2; i++) {
            this.animations.push([]);
            for (let j = 0; j < 2; j++) {
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

    // updateBox() {
    //     this.box = new boundingbox(this.x + (15 * PARAMS.SCALE) - this.game.camera.x,
    //         this.y + (6 * PARAMS.SCALE),
    //         19 * PARAMS.SCALE,
    //         22 * PARAMS.SCALE);
    // };

    update() {

        // samurai will always face torwards the hero
        if (this.game.camera.hero.x < this.x){
            this.dir = 1;
        } else {
            this.dir = 0;
        }

        // if the hero is within visualRadius of the samurai, it will follow the herod
        if (canSee(this, this.game.hero) && (this.x > this.game.hero.x) && (this.x - this.game.hero.x >= 10)){
            this.x -= 3;
            this.state = 1;
        } else if (canSee(this, this.game.hero) && (this.x < this.game.hero.x) && (this.x - this.game.hero.x <= 10)){
            this.x += 3;
            this.state = 1;
        } else if (getDistance(this, this.game.hero) <= 100 && this.state != 1) {
            this.state = 2
        } else {
            this.state = 0;
        }



        // let that = this;

        // const MAX_FALL_VELOC = 7;

        // let canMoveLeft = true;
        // let canMoveRight = true;

        // // state defaults to falling
        // if (this.state != 3) {
        //     this.state = 4;
        // }

        // collision handling
        // this.game.stageTiles.forEach(function (tile) {
        //     if (that.box.collide(tile.box)) {
        //         if (that.box.bottom - tile.box.top <= 4 * PARAMS.SCALE) {
        //             if (that.dir == 0 && that.box.right >= tile.box.left + 3 * PARAMS.SCALE ||
        //                 that.dir == 1 && that.box.left <= tile.box.right - 3 * PARAMS.SCALE) {
        //                 that.jumpTick = 0;
        //                 that.fallTick = 0;
        //                 that.state = 0;
        //             }
        //         // } else if (that.dir == 0 && that.box.right > tile.box.left) {
        //         //     canMoveRight = false;
        //         // } else if (that.dir == 1 && that.box.left < tile.box.right) {
        //         //     canMoveLeft = false;
        //         // }

        //         if (that.state == 3 && that.box.top - tile.box.bottom <= 4 * PARAMS.SCALE) {
        //             if (that.dir == 0 && that.box.right >= tile.box.left + 3 * PARAMS.SCALE ||
        //                 that.dir == 1 && that.box.left <= tile.box.right - 3 * PARAMS.SCALE) {
        //                 that.jumpTick = 0;
        //                 that.fallTick = 3;
        //                 that.state = 4;
        //             }
        //         }
        //     }
        // });

        // jump
        // if (this.game.w && this.state != 3 && this.state != 4) {
        //     this.state = 3;
        //     this.deltaY = -24;
        // }

        // // y updates for jumping
        // if (this.state == 3) {
        //     if (this.jumpTick < 35) {
        //         this.jumpTick++;
        //         this.y -= 7 - (0.2 * this.jumpTick);
        //     } else {
        //         this.jumpTick = 0;
        //         this.fallTick = 0;
        //         this.state = 4;
        //     }
        // } else if (this.state == 4) {
        //     this.fallTick++;
        //     this.y += 0.2 * this.fallTick <= MAX_FALL_VELOC ? 0.2 * this.fallTick : MAX_FALL_VELOC;
        // }

        // // updates for left/right movement
        // if (this.game.d && !this.game.a) {
        //     if (this.state != 3 && this.state != 4) this.state = 2;
        //     this.dir = 0;
        //     if (canMoveRight) this.x += 5;
        // } else if (this.game.a && !this.game.d) {
        //     if (this.state != 3 && this.state != 4) this.state = 2;
        //     this.dir = 1;
        //     if (canMoveLeft) this.x -= 5;
        // }

        // console.log(this.state);
        // this.updateBox();
    }

    draw(ctx) {
        this.animations[this.dir][this.state].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, 
            this.y - this.game.camera.y, PARAMS.SCALE);
    };

}