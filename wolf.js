class Wolf { 
    constructor(game, x, y){
        Object.assign(this, {game, x, y});

        this.game.wolf = this;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/wolf.png")

        this.x = x;
        this.y = y;

        this.dir = 1; // 0 = right; 1 = left
        this.state = 0; //0 = idle, 1 = walk, 2 = dash, 3 = jump; 4 = slash; 5 = howl; 6 = charging animation; 7 = dead; 8 = falling
        this.phase = 0; //0 = phase 1; 1 = phase 2

        this.visualRadius = 200; //will follow the player but this is used for the howl attack
        this.speed = 100;
        this.velocityY = 0;
        this.chargingTimer = 0;
        this.meleeTimer = 0;
        this.projectileCount = 0;
        this.hitbox = null;
        this.dashCooldown = 4;
        this.dashTick = 0;
        this.dash = false;
        this.howlCooldown = 4;
        this.jumpCooldown = 0;
        this.vertex = {x: 0, y: 0};
        this.howlTimer = 0;
        
        this.maxHealth = 500000;
        this.baseAttack = 800;
        this.meleeDamage = (this.baseAttack * 0.5) * (0.9 + Math.random() * 0.2)
        this.currentHealth = this.maxHealth;
        this.title = "Cyber Wolf";
        this.healthbar = new BossHealthBar(this);

        this.animation = [];
        this.animation[0] = new animator(this.spritesheet, 110, 7, 47, 33, 1,1, true);
        this.animation[1] = new animator(this.spritesheet, 62, 7, 47, 33, 1, 1, true)
        this.updateBox();
    }

    jumpToPlayer() {
        JUMP_COOLDOWN = 6;

        this.state = 3;
        this.vertex.x = (this.x + this.game.hero.x) / 2;
        this.vertex.y = this.y >= this.game.hero.y ? this.y + 200 : this.game.hero.y + 200;

        this.A = ((this.y - this.vertex.y) / Math.pow((this.x - this.vertex.x), 2));

        this.x += 2;

        let newY = -(this.A * Math.pow((this.x - this.vertex.x), 2)) + this.vertex.y - 400;

        // Check for collisions with tiles
        let tileCollided = false;
        this.game.stageTiles.forEach(tile => {
            if (this.box.collide(tile.box) && newY > tile.y) {
                // Stop the jump if there's a collision with the tile and the new position is below the tile
                newY = tile.y;
                tileCollided = true;
            }
        });

        if (!tileCollided) {
            // Update the position if there's no collision with tiles
            this.y = newY;
        } else {
            // If there's a collision, stop the jump
            this.velocityY = 0;
            this.jumpCooldown = 0;
            this.applyGravity();
            this.updatePosition();
        }

    }

    applyGravity() {
        const GRAVITY = 1000
        this.velocityY += GRAVITY * this.game.clockTick
      }
    
      updatePosition() {
        this.y += this.velocityY * this.game.clockTick
      }

    isDead() {
        this.currentHealth = 0
        this.x = 3000
    }

    dashAttack(){
        // const DASH_COOLDOWN = 4
        // const DASH_DURATION = 1
        // if (this.dashTick < DASH_DURATION) {
        //     this.state = 9;
        //     this.dashTick += this.game.clockTick;
        //     if (this.dir == 0) {
        //       canMoveLeft = false;
        //       if (canMoveRight) this.x += 750 * this.game.clockTick;
        //     } else {
        //       canMoveRight = false;
        //       if (canMoveLeft) this.x -= 750 * this.game.clockTick;
        //     }
        //     this.dashCooldown = 0;
        //   }
    }

    updateBox() {
        this.box = new boundingbox(this.x - this.game.camera.x,
            this.y - this.game.camera.y,
            190, 130)
    }
    


    howlAttack(){
        if(this.howlTimer >  20){
            this.howlTimer = 0;
            if(canSee(this, this.game.hero)){
                this.game.hero.canUseUlt = 0;
            }
        } else{
            this.howlTimer = 0;
        }
    }

    projectileAttack() {
        const PROJ_VELOCITY = 650;
        const PROJECTILE_DAMAGE = (this.baseAttack * 0.8) * (0.9 + Math.random() * 0.2);
        let chargingLimit = 0.8
        let projLimit = 1
        if (this.phase != 0) {
            chargingLimit = 1;
            projLimit = 0.4;
        }
        if (this.chargingTimer < chargingLimit) {
            this.chargingTimer += 1 * this.game.clockTick;
            this.state = 6
        } else{ 
            this.state = 4;
            if (this.projectileTimer < projLimit) {
                this.projectileTimer += 1 * this.game.clockTick;
            } else {
                let projX =
                    this.dir == 0 ? this.x - this.game.camera.x + 48 + this.box.width : this.x - this.game.camera.x + 48;
                let proj = new wolfProjectile(
                    this.game,
                    projX,
                    this.y - this.game.camera.y + 20,
                    20 * PARAMS.SCALE,
                    this.box.height / 1.5,
                    this.dir,
                    PROJ_VELOCITY,
                    PROJECTILE_DAMAGE
                );

                this.game.addEntity(proj);
                this.game.projectiles.push(proj);

                this.chargingTimer = 0;
                this.projectileTimer = 0;
                this.projectileCount = 0;
            }
        }
    }


    update() {
        this.disableHero += this.game.clockTick;
        let canMoveLeft = true
        let canMoveRight = true
        let movement = this.speed * this.game.clockTick
        let that = this
        let healthRatio = this.currentHealth / this.maxHealth
        

        let canHowl = this.howlCooldown >= 15





        if (healthRatio < 0.4) {
            this.phase = 1;
            this.dashCooldown = 2.5
            this.baseAttack = 2000;
        } else {
            this.phase = 0;
        }

        this.game.stageTiles.forEach(function (tile) {
            if (that.box.collide(tile.box)) {
              if (that.box.bottom - tile.box.top <= 2 * PARAMS.SCALE) {
                // gravity
                that.y = tile.y - 250
                that.velocityY = 0
              } else if (that.box.top < tile.box.bottom) {
                that.applyGravity();
                that.updatePosition()
              }else if (that.box.right > tile.box.left && that.box.left < tile.box.right) {
                if (that.dir == 0) {
                  // --> right collisions
                  that.x -= movement
                  if (that.x <= -800) {
                    that.x = -700
                  }
                } else if (that.dir == 1) {
                  // <-- left collisions
                  that.x += movement
                  if (that.x >= 1200) {
                    // if the samurai clips off the map, then reset it's position inside arena
                    that.x = 1000
                  }
                }
              }
            }
        })

        if (this.game.camera.hero.x < this.x) {
            this.dir = 1
        } else {
            this.dir = 0
        }

        if (canSee(this, this.game.hero) && (this.x > this.game.hero.x) && (getDistance(this, this.game.hero) > 150)) {
            if (canMoveLeft && this.dir == 1) {
                this.x -= movement;
                this.state = 1;
                this.hitbox = null;
            }
        } else if (canSee(this, this.game.hero) && (this.x + 32 * PARAMS.SCALE < this.game.hero.x) 
        && (getDistance(this, this.game.hero) > 150)) {
            if (canMoveRight && this.dir == 0) {
                this.x += movement;
                this.state = 1;
                this.hitbox = null;
            }
        } else {
            this.state = 0;
            this.hitbox = null;
        }


        if (canSee(this, this.game.hero) && (this.x > this.game.hero.x) && (getDistance(this, this.game.hero) > 150)) {
            if (canMoveLeft && this.dir == 1) {
                this.x -= movement;
                this.state = 1;
                this.hitbox = null;
            }
        } else if (canSee(this, this.game.hero) && (this.x + 32 * PARAMS.SCALE < this.game.hero.x) 
        && (getDistance(this, this.game.hero) > 150)) {
            if (canMoveRight && this.dir == 0) {
                this.x += movement;
                this.state = 1;
                this.hitbox = null;
            }
        } else {
            this.state = 0;
            this.hitbox = null;
        }

        if(getDistance(this, this.game.hero) <= 300){
            if(this.phase!= 6){
                this.dashAttack();
            } else {
                this.jumpToPlayer();
            }
        } else{
            this.projectileAttack();
        }

        if(this.game.hero.canUseUlt == 0 && this.disableHero >= 15){
            this.game.hero.canUseUlt = 1;
        }

        if (this.dead) {
            this.state = 7;
            this.deathTick++;
            if (this.deathTick == 80) {
                this.currentHealth = 0;
                this.deathTick = 0;
                this.playWinScreen = true;
                this.removeFromWorld = true;
            }
        }






        this.updateBox();

    };

    draw(ctx){
        this.animation[this.dir].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, PARAMS.SCALE);
        ctx.strokeStyle = 'Red';
        ctx.strokeRect(this.box.x , this.box.y, this.box.width, this.box.height);
        //use this for animations with an added attack array frame maybe???
        //this.animations[this.dir][this.state].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y, PARAMS.SCALE); 
    };
}
