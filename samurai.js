class Samurai {
  constructor(game, x, y) {
    Object.assign(this, { game, x, y });

    this.game.samurai = this;
    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/samurai.png");

    this.x = x;
    this.y = y;

    this.dir = 1; // 0 = right, 1 = left
    this.state = 0; // 0 = idle, 1 = running, 2 = charging anim, 3 = primary melee, 4 = projectile blade, 5 = death
    this.phase = 0; // 0 = initial phase, 1 = phase I, 2 = phase II

    this.visualRadius = 400;
    this.speed = 220;
    this.velocityY = 0;
    this.chargingTimer = 0;
    this.meleeTimer = 0;
    this.hitbox = null;
    this.isTeleported = false;
    this.isInvulnerable = false;
    this.dead = false;
    this.deathTick = 0;
    this.canHit = true;
    this.hasAttacked = false;
    this.maxHealth = 3000000;
    this.baseAttack = 1500;
    this.meleeDamage = this.baseAttack * 0.6 * (0.9 + Math.random() * 0.2);
    this.currentHealth = this.maxHealth;
    this.title = "Nano Shogun";
    this.healthbar = new BossHealthBar(this);
    this.playWinScreen = false;

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
    this.animations[0][0] = new animator(this.spritesheet, 3 * SAMURAI_WIDTH, SAMURAI_HEIGHT, SAMURAI_WIDTH, SAMURAI_HEIGHT, 1, 0.08, true);

    this.animations[1][0] = new animator(this.spritesheet, 3 * SAMURAI_WIDTH, 0, SAMURAI_WIDTH, SAMURAI_HEIGHT, 1, 0.08, true);

    // running frames
    this.animations[0][1] = new animator(this.spritesheet, 0, SAMURAI_HEIGHT, SAMURAI_WIDTH, SAMURAI_HEIGHT, 3, 0.08, true);

    this.animations[1][1] = new animator(this.spritesheet, 0, 0, SAMURAI_WIDTH, SAMURAI_HEIGHT, 3, 0.08, true);

    // charging animation frames
    this.animations[0][2] = new animator(this.spritesheet, 4 * SAMURAI_WIDTH, SAMURAI_HEIGHT, SAMURAI_WIDTH, SAMURAI_HEIGHT, 2, 1, true);

    this.animations[1][2] = new animator(this.spritesheet, 4 * SAMURAI_WIDTH, 0, SAMURAI_WIDTH, SAMURAI_HEIGHT, 2, 1, true);

    // primary melee frames
    this.animations[0][3] = new animator(this.spritesheet, 8 * SAMURAI_WIDTH, SAMURAI_HEIGHT, SAMURAI_WIDTH, SAMURAI_HEIGHT, 2, 0.3, true);

    this.animations[1][3] = new animator(this.spritesheet, 8 * SAMURAI_WIDTH, 0, SAMURAI_WIDTH, SAMURAI_HEIGHT, 2, 0.3, true);

    // projectile blade attack frames
    this.animations[0][4] = new animator(this.spritesheet, 6 * SAMURAI_WIDTH, SAMURAI_HEIGHT, SAMURAI_WIDTH, SAMURAI_HEIGHT, 2, 0.3, true);

    this.animations[1][4] = new animator(this.spritesheet, 6 * SAMURAI_WIDTH, 0, SAMURAI_WIDTH, SAMURAI_HEIGHT, 2, 0.3, true);

    // death animations
    this.animations[0][5] = new animator(this.spritesheet, 10 * SAMURAI_WIDTH, SAMURAI_HEIGHT, SAMURAI_WIDTH, SAMURAI_HEIGHT, 3, 0.25, false);

    this.animations[1][5] = new animator(this.spritesheet, 10 * SAMURAI_WIDTH, 0, SAMURAI_WIDTH, SAMURAI_HEIGHT, 3, 0.25, false);
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
    this.box = new boundingbox(this.x - this.game.camera.x + 48, this.y - this.game.camera.y + 26, 36 * PARAMS.SCALE, 56 * PARAMS.SCALE);
  }

  meleeAttack() {
    let chargingLimit = 2;
    let meleeLimit = 0.5;

    if (this.phase != 0) {
      chargingLimit = 1;
      meleeLimit = 0.25;
    }

    if (this.chargingTimer < chargingLimit) {
      this.chargingTimer += 1 * this.game.clockTick;
      this.state = 2;
    } else {
      this.state = 3;
      if (this.meleeTimer < meleeLimit) {
        if (this.meleeTimer < 0.05 && !this.hasAttacked) {
          // active bounding box to be cast for short duration
          ASSET_MANAGER.playAsset("./sound/samuraiSlash.wav");
          if (this.dir == 1) {
            this.hitbox = new boundingbox(this.x - this.game.camera.x, this.y - this.game.camera.y, 48 * PARAMS.SCALE, 64 * PARAMS.SCALE);
          } else {
            this.hitbox = new boundingbox(this.x - this.game.camera.x + 48, this.y - this.game.camera.y, 48 * PARAMS.SCALE, 64 * PARAMS.SCALE);
          }
          this.isTeleported = false;
          this.hasAttacked = true;
        }
        this.meleeTimer += 1 * this.game.clockTick;
      } else {
        this.hasAttacked = false;
        this.hitbox = null;
        this.chargingTimer = 0;
        this.meleeTimer = 0;
      }
    }
  }

  // A special attack that will cast when the hero is at a distance
  projectileAttack() {
    const PROJECTILE_VELOCITY = 900;
    const PROJECTILE_DAMAGE = this.baseAttack * 1.2 * (0.9 + Math.random() * 0.2);
    let chargingLimit = 2;
    let projLimit = 0.5;
    if (this.phase != 0) {
      // more rapid projectile attack if not initial phase
      chargingLimit = 1;
      projLimit = 0.25;
    }

    if (this.chargingTimer < chargingLimit) {
      this.chargingTimer += 1 * this.game.clockTick;
      this.state = 2;
    } else {
      this.state = 4;
      if (this.projectileTimer < projLimit) {
        this.projectileTimer += 1 * this.game.clockTick;
      } else {
        let projX = this.dir == 0 ? this.x - this.game.camera.x + 48 + this.box.width : this.x - this.game.camera.x + 48;
        let proj = new SamuraiProjectile(this.game, projX, this.y - this.game.camera.y + 24, 16 * PARAMS.SCALE, this.box.height / 2, this.dir, PROJECTILE_VELOCITY, PROJECTILE_DAMAGE);

        this.game.addEntity(proj);
        this.game.projectiles.push(proj);
        ASSET_MANAGER.playAsset("./sound/samuraiProj.wav");
        this.chargingTimer = 0;
        this.projectileTimer = 0;
        this.projectileCount = 0;
      }
    }
  }

  teleportAttack() {
    const originalX = this.x;

    // Determine the direction the Samurai should face after teleporting
    this.dir = this.game.hero.dir === 0 ? 0 : 1; // Face opposite direction of the hero

    // Teleport the Samurai behind the hero
    if (this.isTeleported == false) {
      if (this.dir === 0) {
        // Teleport to the left of the hero
        this.x = this.game.hero.x - 128;
        this.isTeleported = true;
      } else {
        // Teleport to the right of the hero
        this.x = this.game.hero.x + 128;
        this.isTeleported = true;
      }
    }
    // Perform a melee attack after teleporting
    this.meleeAttack();
  }

  update() {
    let canMoveLeft = true;
    let canMoveRight = true;
    let movement = this.speed * this.game.clockTick;
    let that = this;
    let healthRatio = this.currentHealth / this.maxHealth;

    this.applyGravity();
    this.updatePosition();

    if (healthRatio < 0.4) {
      this.phase = 2;
      this.baseAttack = 3000;
    } else if (healthRatio < 0.7) {
      this.phase = 1;
    } else {
      this.phase = 0;
    }

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
    if (canSee(this, this.game.hero) && this.x > this.game.hero.x && getDistance(this, this.game.hero) > 150) {
      if (canMoveLeft && this.dir == 1) {
        this.x -= movement;
        this.state = 1;
        this.hitbox = null;
      }
    } else if (canSee(this, this.game.hero) && this.x + 32 * PARAMS.SCALE < this.game.hero.x && getDistance(this, this.game.hero) > 150) {
      if (canMoveRight && this.dir == 0) {
        this.x += movement;
        this.state = 1;
        this.hitbox = null;
      }
    } else {
      this.state = 0;
      this.hitbox = null;
    }

    if (getDistance(this, this.game.hero) <= 200) {
      if (this.phase != 2) {
        this.meleeAttack();
      } else {
        this.teleportAttack();
      }
    } else if (getDistance(this, this.game.hero) > 400) {
      this.projectileAttack();
    }

    if (this.dead) {
      this.state = 5;
      this.deathTick++;
      if (this.deathTick == 80) {
        this.currentHealth = 0;
        this.deathTick = 0;
        this.playWinScreen = true;
        this.removeFromWorld = true;
        this.game.hero.powerUpOne = 1;
        this.game.hero.powerUpTwo = 1;
      }
    }

    this.updateBox();
  }

  draw(ctx) {
    this.animations[this.dir][this.state].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, PARAMS.SCALE);
    this.healthbar.draw(ctx);
  }
}
