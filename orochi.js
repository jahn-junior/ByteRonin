class Orochi { 
    constructor(game, x, y){
        Object.assign(this, {game, x, y});
        this.game.orochi = this;
        this.dir = 1; // 0 = right, 1 = left
        this.state = 4; // 0 = idle, 1 = running, 2 = attacking, 3 = transforming, 4 = phase 2
        this.phase = 0; // 0 = initial phase, 1 = phase2
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/orochi.png");
        this.visualRadius = 550;
        this.speed = 150;
        this.transformTimer = 0;
        this.isTransformed = false;
        this.velocityY = 0;
        this.isInvulnerable = false;
        
        this.title = "Cyberhydraic Maiden"
        this.maxHealth = 800000;
        this.currentHealth = this.maxHealth;
        this.healthbar = new BossHealthBar(this);
        
        this.animations = [];
        
        this.updateBox();
        this.loadAnimations();
    }

    loadAnimations() {
        const OROCHI_WIDTH = 64;
        const OROCHI_HEIGHT = 64;

        for (let i = 0; i < 2; i++) {
            this.animations.push([]);
            for (let j = 0; j < 5; j++) {
                this.animations[i].push([]);
            }
        }

        // idle animations
        this.animations[0][0] = new animator(
            this.spritesheet,
            0, 
            OROCHI_HEIGHT, 
            OROCHI_WIDTH,
            OROCHI_HEIGHT,
            1,
            0.08,
            true
        );

        this.animations[1][0] = new animator(
            this.spritesheet,
            0, 
            0, 
            OROCHI_WIDTH,
            OROCHI_HEIGHT,
            1,
            0.08,
            true
        );

        // running animations
        this.animations[0][1] = new animator(
            this.spritesheet,
            OROCHI_WIDTH,
            OROCHI_HEIGHT,
            OROCHI_WIDTH,
            OROCHI_HEIGHT,
            5,
            0.25,
            true
        );

        this.animations[1][1] = new animator(
            this.spritesheet,
            OROCHI_WIDTH,
            0,
            OROCHI_WIDTH,
            OROCHI_HEIGHT,
            5,
            0.25,
            true
        );

        // attacking animations
        this.animations[0][2] = new animator(
            this.spritesheet,
            6 * OROCHI_WIDTH,
            OROCHI_HEIGHT,
            OROCHI_WIDTH,
            OROCHI_HEIGHT,
            8, 
            0.25,
            true
        );

        this.animations[1][2] = new animator(
            this.spritesheet,
            6 * OROCHI_WIDTH,
            0,
            OROCHI_WIDTH,
            OROCHI_HEIGHT,
            8, 
            0.25,
            true
        );

        // transforming frames
        this.animations[0][3] = new animator(
            this.spritesheet,
            6 * OROCHI_WIDTH,
            OROCHI_HEIGHT,
            OROCHI_WIDTH,
            OROCHI_HEIGHT,
            14, 
            0.25,
            true
        );

        this.animations[1][3] = new animator(
            this.spritesheet,
            6 * OROCHI_WIDTH,
            0,
            OROCHI_WIDTH,
            OROCHI_HEIGHT,
            14, 
            0.25,
            true
        );

        // phase II animations
        this.animations[0][4] = new animator(
            this.spritesheet,
            19 * OROCHI_WIDTH,
            OROCHI_HEIGHT,
            OROCHI_WIDTH,
            OROCHI_HEIGHT,
            1, 
            0.08,
            true
        );

        this.animations[1][4] = new animator(
            this.spritesheet,
            19 * OROCHI_WIDTH,
            0,
            OROCHI_WIDTH,
            OROCHI_HEIGHT,
            1, 
            0.08,
            true
        );

    }

    applyGravity() {
        const GRAVITY = 1000;
        this.velocityY += GRAVITY * this.game.clockTick;
    }

    updatePosition() {
        this.y += this.velocityY * this.game.clockTick;
    }

    isDead() {
        this.currentHealth = 0;
        this.x = 3000; // teleport outside of arena when dead
    }

    transform() {
        this.state = 3;

        if (this.transformTimer < 3.4) {
            this.transformTimer += 1 * this.game.clockTick;
        } else {
            this.state = 4;
            this.phase = 1;
            this.isTransformed = true;
            this.isInvulnerable = false;
        }
    }

    updateBox() {
        if (this.state == 3) { // null hitbox while transforming
            this.box = new boundingbox(
                this.x + 400, 
                this.y - this.game.camera.y + 224,
                25,
                25
            );
        } else if (this.phase == 1) { // smaller bounding box in phase II
            this.box = new boundingbox(
                this.x - this.game.camera.x + 56,
                this.y - this.game.camera.y + 26,
                37 * PARAMS.SCALE,
                56 * PARAMS.SCALE
            );
        } else {
            this.box = new boundingbox(
                this.x - this.game.camera.x,
                this.y - this.game.camera.y + 26,
                64 * PARAMS.SCALE,
                56 * PARAMS.SCALE
            );
        }
    }

    update(){
        let canMoveLeft = true;
        let canMoveRight = true;
        let movement = this.speed * this.game.clockTick;
        let that = this;
        let healthRatio = this.currentHealth / this.maxHealth;

        this.applyGravity();
        this.updatePosition();

        if (healthRatio < 0.5) {
            if (this.state != 4) {
                this.isInvulnerable = true;
            }
            if (!this.isTransformed) {
                this.transform();
            }
            this.speed = 500;
        }

        this.game.stageTiles.forEach(function (tile) {
            if (that.box.collide(tile.box)) {
                if (that.box.bottom - tile.box.top <= 2 * PARAMS.SCALE) {
                    that.y = tile.y - 250;
                    that.velocityY = 0;
                } 
                else if (that.box.right > tile.box.left && that.box.left < tile.box.right) {
                    if (that.dir == 0) { // --> right collisions
                        that.x -= movement;
                        if (that.x <= -800) {
                            that.x = -700;
                        }
                    } else if (that.dir == 1) { // <-- left collisions
                        that.x += movement;
                        if (that.x >= 1200) { // if the orochi clips off the map, then reset it's position inside arena
                            that.x = 1000;
                        }
                    }
                }
            }
        });

        // orochi will always face torwards the hero
        if (this.game.camera.hero.x < this.x) {
            this.dir = 1;
        } else {
            this.dir = 0;
        }        

        // if the hero is within visualRadius of the samurai, it will follow the hero
        if (canSee(this, this.game.hero) && (this.x > this.game.hero.x) && (this.x - this.game.hero.x >= 100)) {
            if (canMoveLeft && this.dir == 1 && this.state != 3) {
                this.x -= movement;
                if (this.phase == 0) {
                    this.state = 1;
                } else {
                    this.state = 4;
                }
                // this.hitbox = null;
            }
        } else if (canSee(this, this.game.hero) && (this.x + 32 * PARAMS.SCALE < this.game.hero.x) && (this.x - this.game.hero.x <= 75)) {
            if (canMoveRight && this.dir == 0 && this.state != 3) {
                this.x += movement;
                if (this.phase == 0) {
                    this.state = 1;
                } else {
                    this.state = 4;
                }
                // this.hitbox = null;
            }
        } else {
            if (this.phase == 0) {
                this.state = 0;
            } else {
                this.state = 4;
            }
            // this.hitbox = null;
        }

        console.log(this.isInvulnerable);

        this.updateBox();
    };

    draw(ctx){
        this.animations[this.dir][this.state].drawFrame(
            this.game.clockTick,
            ctx,
            this.x - this.game.camera.x,
            this.y - this.game.camera.y,
            PARAMS.SCALE
        );
        this.healthbar.draw(ctx);
    };
}
