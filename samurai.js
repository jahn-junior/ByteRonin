class Samurai {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });

        this.game.samurai = this;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/samurai.png");

        this.x = x;
        this.y = y;

        this.dir = 1; // 0 = right, 1 = left
        this.state = 0; // 0 = idle, 1 = running, 2 = charging anim, 3 = primary melee, 4 = projectile blade

        this.visualRadius = 400;
        this.speed = 300;
        this.velocityY = 0;
        this.chargingTimer = 0;
        this.meleeTimer = 0;
        this.projectileCount = 0;
        this.hitbox = null;

        this.maxHealth = 2000000;
        this.damage = 600 * (0.9 + Math.random() * 0.2);
        this.currentHealth = this.maxHealth;
        this.title = "Nano Shogun";
        this.healthbar = new BossHealthBar(this);

        this.animations = [];
        this.updateBox();

        this.loadAnimations();
    }

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
        this.animations[0][0] = new animator(
            this.spritesheet,
            3 * SAMURAI_WIDTH,
            SAMURAI_HEIGHT,
            SAMURAI_WIDTH,
            SAMURAI_HEIGHT,
            1,
            0.08,
            true
        );

        this.animations[1][0] = new animator(
            this.spritesheet,
            3 * SAMURAI_WIDTH,
            0,
            SAMURAI_WIDTH,
            SAMURAI_HEIGHT,
            1,
            0.08,
            true
        );

        // running frames
        this.animations[0][1] = new animator(
            this.spritesheet,
            0,
            SAMURAI_HEIGHT,
            SAMURAI_WIDTH,
            SAMURAI_HEIGHT,
            3,
            0.08,
            true
        );

        this.animations[1][1] = new animator(this.spritesheet, 0, 0, SAMURAI_WIDTH, SAMURAI_HEIGHT, 3, 0.08, true);

        // charging animation frames
        this.animations[0][2] = new animator(
            this.spritesheet,
            4 * SAMURAI_WIDTH,
            SAMURAI_HEIGHT,
            SAMURAI_WIDTH,
            SAMURAI_HEIGHT,
            2,
            1,
            true
        );

        this.animations[1][2] = new animator(
            this.spritesheet,
            4 * SAMURAI_WIDTH,
            0,
            SAMURAI_WIDTH,
            SAMURAI_HEIGHT,
            2,
            1,
            true
        );

        // primary melee frames
        this.animations[0][3] = new animator(
            this.spritesheet,
            8 * SAMURAI_WIDTH,
            SAMURAI_HEIGHT,
            SAMURAI_WIDTH,
            SAMURAI_HEIGHT,
            2,
            0.3,
            true
        );

        this.animations[1][3] = new animator(
            this.spritesheet,
            8 * SAMURAI_WIDTH,
            0,
            SAMURAI_WIDTH,
            SAMURAI_HEIGHT,
            2,
            0.3,
            true
        );

        // projectile blade attack frames
        this.animations[0][4] = new animator(
            this.spritesheet,
            6 * SAMURAI_WIDTH,
            SAMURAI_HEIGHT,
            SAMURAI_WIDTH,
            SAMURAI_HEIGHT,
            2,
            0.3,
            true
        );

        this.animations[1][4] = new animator(
            this.spritesheet,
            6 * SAMURAI_WIDTH,
            0,
            SAMURAI_WIDTH,
            SAMURAI_HEIGHT,
            2,
            0.3,
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

    updateBox() {
        this.box = new boundingbox(
            this.x - this.game.camera.x + 48,
            this.y - this.game.camera.y + 26,
            36 * PARAMS.SCALE,
            56 * PARAMS.SCALE
        );
    }

    meleeAttack() {
        if (this.chargingTimer < 2) {
            this.chargingTimer += 1 * this.game.clockTick;
            this.state = 2;
        } else {
            this.state = 3;
            if (this.meleeTimer < 0.5) {
                if (this.meleeTimer < 0.1) {
                    // active bounding box to be cast for short duration
                    if (this.dir == 1) {
                        this.hitbox = new boundingbox(
                            this.x - this.game.camera.x,
                            this.y - this.game.camera.y,
                            48 * PARAMS.SCALE,
                            64 * PARAMS.SCALE
                        );
                    } else {
                        this.hitbox = new boundingbox(
                            this.x - this.game.camera.x + 48,
                            this.y - this.game.camera.y,
                            48 * PARAMS.SCALE,
                            64 * PARAMS.SCALE
                        );
                    }
                }
                this.meleeTimer += 1 * this.game.clockTick;
            } else {
                this.hitbox = null;
                this.chargingTimer = 0;
                this.meleeTimer = 0;
                this.projectileCount += 1;
            }
        }
    }

    // A special attack that will cast after every 3rd melee attack
    projectileAttack() {
        const PROJECTILE_VELOCITY = 10;
        const PROJECTILE_DAMAGE = 1500 * (0.9 + Math.random() * 0.2);

        if (this.chargingTimer < 2) {
            this.chargingTimer += 1 * this.game.clockTick;
            this.state = 2;
        } else {
            this.state = 4;
            if (this.meleeTimer < 0.5) {
                this.meleeTimer += 1 * this.game.clockTick;
            } else {
                let projX =
                    this.dir == 0 ? this.x - this.game.camera.x + 48 + this.box.width : this.x - this.game.camera.x + 48;
                let proj = new SamuraiProjectile(
                    this.game,
                    projX,
                    this.y - this.game.camera.y + 26,
                    16 * PARAMS.SCALE,
                    this.box.height,
                    this.dir,
                    PROJECTILE_VELOCITY,
                    "samurai-proj",
                    PROJECTILE_DAMAGE
                );

                this.game.addEntity(proj);
                this.game.projectiles.push(proj);

                this.chargingTimer = 0;
                this.meleeTimer = 0;
                this.projectileCount = 0;
            }
        }
    }

    update() {
        let canMoveLeft = true;
        let canMoveRight = true;
        let movement = this.speed * this.game.clockTick;
        let that = this;

        this.applyGravity();
        this.updatePosition();

        this.game.stageTiles.forEach(function (tile) {
            if (that.box.collide(tile.box)) {
                if (that.box.bottom - tile.box.top <= 2 * PARAMS.SCALE) {
                    // gravity
                    that.y = tile.y - 250;
                    that.velocityY = 0;
                } else if (that.box.right > tile.box.left && that.box.left < tile.box.right) {
                    if (that.dir == 0) {
                        // --> right collisions
                        that.x -= movement;
                        if (that.x <= -800) {
                            that.x = -700;
                        }
                    } else if (that.dir == 1) {
                        // <-- left collisions
                        that.x += movement;
                        if (that.x >= 1200) {
                            // if the samurai clips off the map, then reset it's position inside arena
                            that.x = 1000;
                        }
                    }
                }
            }
        });

        // samurai will always face torwards the hero
        if (this.game.camera.hero.x < this.x) {
            this.dir = 1;
        } else {
            this.dir = 0;
        }

        // if the hero is within visualRadius of the samurai, it will follow the hero
        if (canSee(this, this.game.hero) && this.x > this.game.hero.x && this.x - this.game.hero.x >= 100) {
            if (canMoveLeft && this.dir == 1) {
                this.x -= movement;
                this.state = 1;
                this.hitbox = null;
            }
        } else if (
            canSee(this, this.game.hero) &&
            this.x + 32 * PARAMS.SCALE < this.game.hero.x &&
            this.x - this.game.hero.x <= 75
        ) {
            if (canMoveRight && this.dir == 0) {
                this.x += movement;
                this.state = 1;
                this.hitbox = null;
            }
        } else {
            this.state = 0;
            this.hitbox = null;
        }

        // samurai will start charging an attack when hero is close enough
        if (getDistance(this, this.game.hero) <= 150) {
            if (this.projectileCount == 3) {
                // after every 3rd melee, a projectile blade will be cast
                this.projectileAttack();
            } else {
                this.meleeAttack();
            }
        }

        // console.log(this.x);
        // console.log(this.y);

        this.updateBox();
    }

    draw(ctx) {
        this.animations[this.dir][this.state].drawFrame(
            this.game.clockTick,
            ctx,
            this.x - this.game.camera.x,
            this.y - this.game.camera.y,
            PARAMS.SCALE
        );
        this.healthbar.draw(ctx);
    }
}
