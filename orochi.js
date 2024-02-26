class Orochi { 
    constructor(game, x, y){
        Object.assign(this, {game, x, y});
        this.game.orochi = this;
        this.dir = 1; // 0 = right, 1 = left
        this.state = 4; // 0 = idle, 1 = running, 2 = attacking, 3 = transforming, 4 = phase 2, 5 = death
        this.phase = 0; // 0 = initial phase, 1 = phase2
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/orochi.png");
        this.visualRadius = 550;
        this.speed = 100;
        this.baseAttack = 1000;
        this.chargingTimer = 0;
        this.transformTimer = 0;
        this.isTransformed = false;
        this.velocityY = 0;
        this.isInvulnerable = false;
        this.dead = false;
        this.deathTick = 0;
        
        
        this.title = "Cyberhydraic Maiden"
        this.maxHealth = 1500000;
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

        // death animations
        this.animations[0][5] = new animator(
            this.spritesheet,
            20 * OROCHI_WIDTH,
            OROCHI_HEIGHT,
            OROCHI_WIDTH,
            OROCHI_HEIGHT,
            3,
            0.25,
            false
        );

        this.animations[1][5] = new animator(
            this.spritesheet,
            20 * OROCHI_WIDTH,
            0,
            OROCHI_WIDTH,
            OROCHI_HEIGHT,
            3,
            0.25,
            false
        )

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
        this.state = 5;

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

    // A beam attack that casts in phase II
    // beamAttack() {
    //     // const BEAM_DAMAGE = (this.baseAttack * 6) * (0.9 + Math.random() * 0.2);

    //     // let beamX =
    //     //     this.dir == 0 ? this.x - this.game.camera.x + 48 + this.box.width : this.x - this.game.camera.x + 48;
    //     // let beam = new OrochiBeam(
    //     //     this.game,
    //     //     beamX,
    //     //     this.y - this.game.camera.y + 120,
    //     //     this.dir, 
    //     //     BEAM_DAMAGE
    //     // );
    //     // this.game.addEntity(beam);
    //     // this.game.projectiles.push(beam);
    //     // beam.draw();
    // }

    // A special attack that will cast when the hero is at a distance
    projectileAttack() {
        const PROJECTILE_VELOCITY = 7;
        const PROJECTILE_DAMAGE = (this.baseAttack * 1.2) * (0.9 + Math.random() * 0.2);
        let chargingLimit = 2.05;

        if (this.chargingTimer < chargingLimit) {
            this.state = 2;
            this.chargingTimer += 1 * this.game.clockTick;
        } else {
            let projX =
                this.dir == 0 ? this.x - this.game.camera.x + 48 + this.box.width : this.x - this.game.camera.x + 48;
            let proj = new OrochiProjectile(
                this.game,
                projX,
                this.y - this.game.camera.y + 120,
                16 * PARAMS.SCALE,
                10 * PARAMS.SCALE,
                this.dir,
                PROJECTILE_VELOCITY,
                PROJECTILE_DAMAGE
            );

            this.game.addEntity(proj);
            this.game.projectiles.push(proj);

            this.chargingTimer = 0;
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
            this.speed = 300;
        }

        // ground tile collision
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

        // projectile collision
        this.game.projectiles.forEach(function (proj) {
            if (that.box.collide(proj.hitbox)) {
                if (!(proj instanceof OrochiProjectile)) {
                    that.offset = that.game.hero.dir == 0 ? 150 : -50;

                    // critical hit chance calculation
                    if (Math.random() * 1 < that.game.hero.critChance) {
                        const critMultiplier = 1.5;
                        const critDamage = proj.damage * critMultiplier;
                        that.game.addEntity(
                            new Score(
                            that.game,
                            that.x - that.game.camera.x + that.offset,
                            that.y - that.game.camera.y + 50,
                            critDamage,
                            true
                            )
                        );
                        that.currentHealth -= proj.damage * critMultiplier;
                    } else {
                        that.game.addEntity(
                            new Score(
                            that.game,
                            that.x - that.game.camera.x + that.offset,
                            that.y - that.game.camera.y + 50,
                            proj.damage,
                            false
                            )
                        );
                        that.currentHealth -= proj.damage;
                    }            
                    proj.hitbox = new boundingbox(3000, 3000, 1, 1); // teleport the BB outside arena on collision
                    proj.removeFromWorld = true;

                    if (that.currentHealth <= 0) {
                        that.dead = true;
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
        if (canSee(this, this.game.hero) && (this.x > this.game.hero.x) && (getDistance(this, this.game.hero) > 300)) {
            if (canMoveLeft && this.dir == 1 && this.state != 3) {
                this.x -= movement;
                if (this.phase == 0) {
                    this.state = 1;
                } else {
                    this.state = 4;
                }
            }
        } else if (canSee(this, this.game.hero) && (this.x + 32 * PARAMS.SCALE < this.game.hero.x) 
        && (getDistance(this, this.game.hero) > 300)) {
            if (canMoveRight && this.dir == 0 && this.state != 3) {
                this.x += movement;
                if (this.phase == 0) {
                    this.state = 1;
                } else {
                    this.state = 4;
                }
            }
        } else {
            if (this.phase == 0) {
                this.state = 0;
            } else {
                this.state = 4;
            }
        }

        // attack logic
        // if (getDistance(this, this.game.hero) <= 200) {
        //     if (this.phase != 1) {
        //         // this.meleeAttack();
        //     } else {
        //         this.beamAttack();
        //     }
        // } else 
        if (getDistance(this, this.game.hero) > 400 && this.state != 3) {
            if (this.phase != 1) {
                this.projectileAttack();
            }
        }

        if (this.dead) {
            this.state = 5;
            this.deathTick++;
            if (this.deathTick == 80) {
                this.currentHealth = 0;
                this.dead = false;
                this.deathTick = 0;
                this.removeFromWorld = true;
            }
        }

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
