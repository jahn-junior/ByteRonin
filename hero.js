class Hero {
  constructor(game, x, y) {
    Object.assign(this, { game, x, y });

    this.game.hero = this;
    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/hero.png");

    this.x = x;
    this.y = y;
    this.initY = 0;
    this.spawnX = x;
    this.spawnY = y;
    this.radius = 32;

    this.jumpTick = 0; // used for jump deceleration
    this.fallTick = 0; // used for fall acceleration
    this.meleeTick = 101; // value indicates that attack is ready
    this.rangedTick = 101; // value indicates that attack is ready
    this.deathTick = 0;
    this.hitstunTick = 0;
    this.hasFired = false;
    this.parryTimer = 0;

    this.dashTick = 3;
    this.dashCooldown = 5;
    this.dashDisplay = 0;

    this.critUltTick = 0;
    this.critCDTimer = 0;
    this.critCDDisplay = 20;
    this.startCD = 0;
    this.canUseUlt = 1;
    this.orbCD = 30;
    this.activeOrb = null;
    this.nextOrbitalHit = 0;
    this.ultActive = 0;
    this.powerUpOne = 0; // after beating 1st boss, update to 1 (init 0)
    this.powerUpTwo = 0; // after beating 2nd boss, update to 1 (init 0)

    // 0 = right, 1 = left
    this.dir = 0;

    // 0 = idle, 1 = parry, 2 = running, 3 = jumping, 4 = falling, 5 = melee
    // 6 = hitstun, 7 = shoot, 8 = dead, 9 = dash

    this.state = 0;
    this.prevState = 0;

    this.maxHealth = 25000;
    this.speed = 400;
    this.currentHealth = this.maxHealth;
    this.healthbar = new HealthBar(this);
    this.ultIcon = new CritCooldown(this.game, this, 1, 0);
    this.dashIcon = new DashCooldown(this.game, this, 1);
    this.orbitalIcon = new OrbitalCooldown(this.game, this, 1, 0);
    this.critChance = 0.2;
    this.dead = false;
    this.gameover = false;

    this.animations = [];
    this.loadAnimations();

    this.updateBox();
  }

  loadAnimations() {
    const HERO_WIDTH = 60;
    const HERO_HEIGHT = 54;

    for (let i = 0; i < 2; i++) {
      this.animations.push([]);
      for (let j = 0; j < 6; j++) {
        this.animations[i].push([]);
      }
    }

    // idle frames
    this.animations[0][0] = new animator(this.spritesheet, 0, 0, HERO_WIDTH, HERO_HEIGHT, 1, 0.08, true);
    this.animations[1][0] = new animator(this.spritesheet, 0, HERO_HEIGHT, HERO_WIDTH, HERO_HEIGHT, 1, 0.08, true);

    // parry frames
    this.animations[0][1] = new animator(this.spritesheet, 18 * HERO_WIDTH, 0, HERO_WIDTH, HERO_HEIGHT, 1, 0.08, true);
    this.animations[1][1] = new animator(this.spritesheet, 18 * HERO_WIDTH, HERO_HEIGHT, HERO_WIDTH, HERO_HEIGHT, 1, 0.08, true);

    // running frames
    this.animations[0][2] = new animator(this.spritesheet, HERO_WIDTH, 0, HERO_WIDTH, HERO_HEIGHT, 6, 0.08, true);
    this.animations[1][2] = new animator(this.spritesheet, HERO_WIDTH, HERO_HEIGHT, HERO_WIDTH, HERO_HEIGHT, 6, 0.08, true);

    // jumping frames
    this.animations[0][3] = new animator(this.spritesheet, 16 * HERO_WIDTH, 0, HERO_WIDTH, HERO_HEIGHT, 1, 0.08, true);
    this.animations[1][3] = new animator(this.spritesheet, 16 * HERO_WIDTH, HERO_HEIGHT, HERO_WIDTH, HERO_HEIGHT, 1, 0.08, true);

    // falling frames
    this.animations[0][4] = new animator(this.spritesheet, 17 * HERO_WIDTH, 0, HERO_WIDTH, HERO_HEIGHT, 1, 0.08, true);
    this.animations[1][4] = new animator(this.spritesheet, 17 * HERO_WIDTH, HERO_HEIGHT, HERO_WIDTH, HERO_HEIGHT, 1, 0.08, true);

    // melee attack frames
    this.animations[0][5] = new animator(this.spritesheet, 7 * HERO_WIDTH, 0, HERO_WIDTH, HERO_HEIGHT, 4, 0.08, false);
    this.animations[1][5] = new animator(this.spritesheet, 7 * HERO_WIDTH, HERO_HEIGHT, HERO_WIDTH, HERO_HEIGHT, 4, 0.08, false);

    // hitstun frames
    this.animations[0][6] = new animator(this.spritesheet, 19 * HERO_WIDTH, 0, HERO_WIDTH, HERO_HEIGHT, 2, 0.06, true);
    this.animations[1][6] = new animator(this.spritesheet, 19 * HERO_WIDTH, HERO_HEIGHT, HERO_WIDTH, HERO_HEIGHT, 2, 0.06, true);

    // ranged attack frames
    this.animations[0][7] = new animator(this.spritesheet, 11 * HERO_WIDTH, 0, HERO_WIDTH, HERO_HEIGHT, 5, 0.1, false);
    this.animations[1][7] = new animator(this.spritesheet, 11 * HERO_WIDTH, HERO_HEIGHT, HERO_WIDTH, HERO_HEIGHT, 5, 0.1, false);

    // death frames
    this.animations[0][8] = new animator(this.spritesheet, 21 * HERO_WIDTH, 0, HERO_WIDTH, HERO_HEIGHT, 3, 0.3, false);
    this.animations[1][8] = new animator(this.spritesheet, 21 * HERO_WIDTH, HERO_HEIGHT, HERO_WIDTH, HERO_HEIGHT, 3, 0.3, false);

    // dash frames
    this.animations[0][9] = new animator(this.spritesheet, 24 * HERO_WIDTH, 0, HERO_WIDTH, HERO_HEIGHT, 6, 0.08, true);
    this.animations[1][9] = new animator(this.spritesheet, 24 * HERO_WIDTH, HERO_HEIGHT, HERO_WIDTH, HERO_HEIGHT, 6, 0.08, true);
  }

  updateBox() {
    this.box = new boundingbox(this.x + 20 * PARAMS.SCALE - this.game.camera.x, this.y + 16 * PARAMS.SCALE, 21 * PARAMS.SCALE, 37 * PARAMS.SCALE);
  }

  update() {
    let that = this;

    const MAX_FALL_VELOC = 7;
    const MELEE_DURATION = 0.3; // matches up with the animation duration
    const ATTACK_READY = 101; // arbitrary value to signal that the hero can attack again
    const RANGED_DURATION = 0.48;
    const HITSTUN_DURATION = 0.35;
    const DEATH_DURATION = 0.85;
    const PROJECTILE_VELOCITY = 850;
    const DASH_DURATION = 0.25;
    const DASH_COOLDOWN = 2.5;
    const ORBITAL_COOLDOWN = 22;
    const ORBITAL_RATE = 0.25;

    const ORBITAL_DAMAGE = 42500 * (0.9 + Math.random() * 0.2);
    const MELEE_DAMAGE = 15000 * (0.9 + Math.random() * 0.2);
    const PROJECTILE_DAMAGE = 30000 * (0.9 + Math.random() * 0.2);

    let canMoveLeft = true;
    let canMoveRight = true;
    let canTurn = true;
    let offset = this.dir == 0 ? 150 : -50;
    let canUseDash = this.dashCooldown >= DASH_COOLDOWN;
    let canUseOrb = this.orbCD >= ORBITAL_COOLDOWN;

    // state defaults to falling
    if (this.state != 3 && this.state != 6) {
      this.state = 4;
    }

    // collision handling
    this.game.stageTiles.forEach(function (tile) {
      if (that.box.collide(tile.box)) {
        if (that.box.bottom - tile.box.top <= 4 * PARAMS.SCALE) {
          // bottom collision
          if ((that.dir == 0 && that.box.right >= tile.box.left + 5 * PARAMS.SCALE) || (that.dir == 1 && that.box.left <= tile.box.right - 5 * PARAMS.SCALE)) {
            that.jumpTick = 0;
            that.fallTick = 0;
            that.state = 0;
          }
        } else if (that.dir == 0 && that.box.right > tile.box.left) {
          // right collision
          canMoveRight = false;
        } else if (that.dir == 1 && that.box.left < tile.box.right) {
          // left collision
          canMoveLeft = false;
        }

        if (that.prevState == 6 && (Math.abs(that.box.left - tile.box.right) < 8 * PARAMS.SCALE || Math.abs(that.box.right - tile.box.left) < 8 * PARAMS.SCALE)) {
          canMoveRight = false;
          canMoveLeft = false;
        }

        if (that.state == 3 && that.box.top - tile.box.bottom <= 4 * PARAMS.SCALE) {
          // top collision
          if ((that.dir == 0 && that.box.right >= tile.box.left + 5 * PARAMS.SCALE) || (that.dir == 1 && that.box.left <= tile.box.right - 5 * PARAMS.SCALE)) {
            that.jumpTick = 0;
            that.fallTick = 0;
            that.state = 4;
          }
        }
      }
    });

    // parry input
    if (this.game.k && (this.state == 0 || this.state == 1 || this.state == 2)) {
      ASSET_MANAGER.playAsset("./sound/parry.wav");
      canMoveLeft = false;
      canMoveRight = false;
      this.state = 1;
      this.parryTimer += this.game.clockTick;
    } else {
      this.parryTimer = 0;
    }
    console.log(this.parryTimer);

    // dash inputi
    if (this.game.l && (this.state == 0 || this.state == 1 || this.state == 2 || this.state == 3 || this.state == 4)) {
      if (canUseDash) {
        ASSET_MANAGER.playAsset("./sound/dash.wav");
        this.state = 9;
        this.dashTick = 0;
        canTurn = false;
      }
    }

    // dash logic
    if (this.dashTick < DASH_DURATION) {
      this.state = 9;
      this.dashTick += this.game.clockTick;
      if (this.dir == 0) {
        canMoveLeft = false;
        if (canMoveRight) this.x += 750 * this.game.clockTick;
      } else {
        canMoveRight = false;
        if (canMoveLeft) this.x -= 750 * this.game.clockTick;
      }
      this.dashCooldown = 0;
    }

    // refresh cooldown
    if (this.dashCooldown < DASH_COOLDOWN) {
      this.dashCooldown += this.game.clockTick;
      this.dashDisplay = Math.floor(DASH_COOLDOWN - this.dashCooldown);
    }

    let boss = null;
    if (this.game.camera.boss) boss = this.game.camera.boss;

    if (that.hitbox && that.hitbox.collide(boss.box)) {
      if (!boss.isInvulnerable && boss.canHit) {
        // critical hit chance calculation
        if (Math.random() * 1 < that.critChance) {
          that.game.addEntity(new Score(that.game, boss.x - that.game.camera.x + offset, boss.y - that.game.camera.y + 50, MELEE_DAMAGE * 1.5, true));
          boss.currentHealth -= MELEE_DAMAGE * 1.5;
        } else {
          that.game.addEntity(new Score(that.game, boss.x - that.game.camera.x + offset, boss.y - that.game.camera.y + 50, MELEE_DAMAGE, false));
          boss.currentHealth -= MELEE_DAMAGE;
        }
        boss.canHit = false;
      }

      if (boss.currentHealth <= 0) {
        boss.dead = true;
      }
    }

    this.game.projectiles.forEach(function (proj) {
      if (proj.hitbox && boss.box.collide(proj.hitbox) && proj instanceof HeroProjectile) {
        // critical hit chance calculation
        if (!boss.isInvulnerable && boss.canHit) {
          if (Math.random() < that.critChance) {
            const critMultiplier = 1.5;
            const critDamage = proj.damage * critMultiplier;
            that.game.addEntity(new Score(that.game, boss.x - that.game.camera.x + offset, boss.y - that.game.camera.y + 50, critDamage, true));
            boss.currentHealth -= proj.damage * critMultiplier;
          } else {
            that.game.addEntity(new Score(that.game, boss.x - that.game.camera.x + offset, boss.y - that.game.camera.y + 50, proj.damage, false));
            boss.currentHealth -= proj.damage;
          }
        }

        proj.hitbox = new boundingbox(3000, 3000, 1, 1); // teleport the BB outside arena on collision
        proj.removeFromWorld = true;

        if (boss.currentHealth <= 0) {
          boss.dead = true;
        }
      }
    });

    if (this.activeOrb && this.activeOrb.box && boss.box.collide(this.activeOrb.box)) {
      if ((this.activeOrb.timer - 1.5) / ORBITAL_RATE > this.nextOrbitalHit) {
        this.nextOrbitalHit++;
        if (!boss.isInvulnerable) {
          if (Math.random() < that.critChance) {
            boss.currentHealth -= ORBITAL_DAMAGE * 1.5;
            that.game.addEntity(new Score(that.game, boss.x - that.game.camera.x + offset, boss.y - that.game.camera.y + 50, ORBITAL_DAMAGE * 1.5, true));
          } else {
            boss.currentHealth -= ORBITAL_DAMAGE;
            this.game.addEntity(new Score(that.game, boss.x - that.game.camera.x + offset, boss.y - that.game.camera.y + 50, ORBITAL_DAMAGE, false));
          }

          if (boss.currentHealth <= 0) {
            boss.dead = true;
          }
        }
      }
    }

    // melee attack collision receiving from a boss
    if (boss.hitbox && boss.hitbox.collide(that.box)) {
      if (that.state != 6 && that.state != 9) {
        if (that.state == 1) {
          if (that.parryTimer > 0.2) {
            that.currentHealth -= boss.meleeDamage * 0.35;
            ASSET_MANAGER.playAsset("./sound/hit.wav");
          }
        } else {
          that.currentHealth -= boss.meleeDamage;
          ASSET_MANAGER.playAsset("./sound/hit.wav");
          that.state = 6;
        }

        that.hitbox = null;
        that.meleeTick = ATTACK_READY;
        that.rangedTick = ATTACK_READY;

        // reload animations if interrupted
        if (that.meleeTick < MELEE_DURATION) {
          that.animations[0][5] = new animator(that.spritesheet, 7 * 60, 0, 60, 54, 4, 0.08, false);
          that.animations[1][5] = new animator(that.spritesheet, 7 * 60, 54, 60, 54, 4, 0.08, false);
        } else if (that.rangedTick < RANGED_DURATION) {
          that.animations[0][7] = new animator(that.spritesheet, 11 * 60, 0, 60, 54, 5, 0.1, false);
          that.animations[1][7] = new animator(that.spritesheet, 11 * 60, 54, 60, 54, 5, 0.1, false);
        }
      }
    }

    // beam attack collision receiving from a boss
    if (boss.beambox && boss.beambox.collide(that.box)) {
      if (that.state != 1 && that.state != 6 && that.state != 9) {
        ASSET_MANAGER.playAsset("./sound/hit.wav");
        that.currentHealth -= boss.beamDamage;

        boss.beambox = null;
        that.meleeTick = ATTACK_READY;
        that.rangedTick = ATTACK_READY;

        if (that.meleeTick < MELEE_DURATION) {
          that.animations[0][5] = new animator(that.spritesheet, 7 * 60, 0, 60, 54, 4, 0.08, false);
          that.animations[1][5] = new animator(that.spritesheet, 7 * 60, 54, 60, 54, 4, 0.08, false);
        } else if (that.rangedTick < RANGED_DURATION) {
          that.animations[0][7] = new animator(that.spritesheet, 11 * 60, 0, 60, 54, 5, 0.1, false);
          that.animations[1][7] = new animator(that.spritesheet, 11 * 60, 54, 60, 54, 5, 0.1, false);
        }

        that.state = 6;
      }
    }

    // projectile collision
    this.game.projectiles.forEach(function (proj) {
      if (proj.hitbox && that.box.collide(proj.hitbox)) {
        if (that.state != 6 && that.state != 9 && !(proj instanceof HeroProjectile)) {
          if (that.state == 1) {
            if (that.parryTimer > 0.2) {
              that.currentHealth -= 0.35 * proj.damage;
              ASSET_MANAGER.playAsset("./sound/hit.wav");
            }
          } else {
            that.state = 6;
            that.currentHealth -= proj.damage;
            ASSET_MANAGER.playAsset("./sound/hit.wav");
            that.meleeTick = ATTACK_READY;
            that.rangedTick = ATTACK_READY;
          }
          proj.hitbox = null;
          proj.removeFromWorld = true;
        }
      }
    });

    // melee attack input
    if (this.game.j && this.meleeTick == ATTACK_READY && (this.state == 0 || this.state == 1)) {
      ASSET_MANAGER.playAsset("./sound/slash.wav");
      canMoveLeft = false;
      canMoveRight = false;
      canTurn = false;
      this.state = 5;
      this.meleeTick = 0;
    }

    // jump input
    if (this.game.w && (this.state == 0 || this.state == 2)) {
      ASSET_MANAGER.playAsset("./sound/jump.wav");

      this.initY = this.y;
      this.state = 3;
    }

    // ranged attack input
    if (this.game.i && this.rangedTick == ATTACK_READY && (this.state == 0 || this.state == 1)) {
      ASSET_MANAGER.playAsset("./sound/lazerButton.wav");
      canMoveLeft = false;
      canMoveRight = false;
      canTurn = false;
      this.hasFired = false;
      this.state = 7;
      this.rangedTick = 0;
    }

    // ultimate (crit chance) input
    if (this.game.u && this.powerUpOne) {
      if (this.canUseUlt) {
        this.critChance = 1;
        this.ultActive = 1;
        this.canUseUlt = 0;
      }
    }

    // ultimate skill active logic
    if (this.ultActive) {
      this.critUltTick += this.game.clockTick;
      if (this.critUltTick >= 5) {
        this.startCD = 1;
        this.critChance = 0.2; // revert back to regular crit chance
        this.critUltTick = 0;
        this.ultActive = 0;
      }
    }

    // ultimate skill cooldown logic
    if (this.startCD) {
      if (this.critCDTimer < 20) {
        this.critCDTimer += this.game.clockTick;
        this.critCDDisplay -= this.game.clockTick;
      } else {
        this.canUseUlt = 1;
        this.startCD = 0;
        this.critCDTimer = 0;
        this.critCDDisplay = 20;
      }
    }

    if (this.game.o && this.powerUpTwo) {
      if (canUseOrb) {
        this.activeOrb = new OrbitalStrike(this.game);
        this.game.addEntity(this.activeOrb);
        ASSET_MANAGER.playAsset("./sound/orbital.wav");
        this.nextOrbitalHit = 0;
        this.orbCD = 0;
      }
    }

    if (!canUseOrb) {
      this.orbCD += this.game.clockTick;
      this.orbDisplay = Math.floor(ORBITAL_COOLDOWN - this.orbCD);
    }

    // handles state when hero is in the middle of a melee attack
    if (this.meleeTick < MELEE_DURATION) {
      canMoveLeft = false;
      canMoveRight = false;
      canTurn = false;
      this.meleeTick += this.game.clockTick;
      this.state = 5;
      if (this.meleeTick > 0.26 && this.meleeTick < MELEE_DURATION) {
        // enable hitbox on active frames
        if (this.dir == 0) {
          this.hitbox = new boundingbox(this.x + 40 * PARAMS.SCALE - this.game.camera.x, this.y + 20 * PARAMS.SCALE, 24 * PARAMS.SCALE, 34 * PARAMS.SCALE);
        } else {
          this.hitbox = new boundingbox(this.x - 4 * PARAMS.SCALE - this.game.camera.x, this.y + 20 * PARAMS.SCALE, 24 * PARAMS.SCALE, 34 * PARAMS.SCALE);
        }
      } else {
        // disable hitbox on inactive frames
        this.hitbox = null;
      }
    } else {
      // reload animation so that it can play on the next attack
      this.animations[0][5] = new animator(this.spritesheet, 7 * 60, 0, 60, 54, 4, 0.08, false);
      this.animations[1][5] = new animator(this.spritesheet, 7 * 60, 54, 60, 54, 4, 0.08, false);
      this.hitbox = null;
      this.meleeTick = ATTACK_READY;
      boss.canHit = true;
    }

    // handles state when hero is in the middle of a ranged attack
    if (this.rangedTick < RANGED_DURATION) {
      canMoveLeft = false;
      canMoveRight = false;
      canTurn = false;
      this.rangedTick += this.game.clockTick;
      this.state = 7;
      if (this.rangedTick > 0.45 && this.rangedTick < RANGED_DURATION && !this.hasFired) {
        this.hasFired = true;
        let projX = this.x - this.game.camera.x;
        if (this.dir == 0) projX += this.box.width;
        let proj = new HeroProjectile(this.game, projX, this.y - this.game.camera.y + 20 * PARAMS.SCALE, 13 * PARAMS.SCALE, 3 * PARAMS.SCALE, this.dir, PROJECTILE_VELOCITY, PROJECTILE_DAMAGE);
        this.game.addEntity(proj);
        this.game.projectiles.push(proj);
      }
    } else {
      this.animations[0][7] = new animator(this.spritesheet, 11 * 60, 0, 60, 54, 5, 0.1, false);
      this.animations[1][7] = new animator(this.spritesheet, 11 * 60, 54, 60, 54, 5, 0.1, false);

      this.rangedTick = ATTACK_READY;
    }

    // hitstun updates
    if (this.state == 6) {
      if (this.currentHealth <= 0) {
        this.currentHealth = 0;
      }
      if (this.hitstunTick < HITSTUN_DURATION) {
        this.state = 6;
        this.hitstunTick += this.game.clockTick;
        if (this.x < this.game.camera.boss.x) {
          if (canMoveLeft) this.x -= 125 * this.game.clockTick;
        } else {
          if (canMoveRight) this.x += 125 * this.game.clockTick;
        }
        this.y -= 5 - 16 * this.hitstunTick;
      } else {
        this.hitstunTick = 0;
        this.fallTick = 0;
        this.state = 4;
      }
    }

    if (this.currentHealth <= 0 && this.state != 6) {
      this.currentHealth = 0;
      this.dead = true;
      ASSET_MANAGER.pauseBackgroundMusic();
      ASSET_MANAGER.playAsset("./sound/death.wav");
    }
    // y updates for jumping/falling
    if (this.state == 3) {
      if (7 - 16 * this.jumpTick > 0 && this.initY - this.y < 150) {
        // band-aid fix for framerate-dependent jump
        this.jumpTick += this.game.clockTick;
        this.y -= 7 - 16 * this.jumpTick;
      } else {
        this.jumpTick = 0;
        this.fallTick = 0;
        this.state = 4;
      }
    } else if (this.state == 4) {
      this.fallTick += this.game.clockTick;
      this.y += 16 * this.fallTick <= MAX_FALL_VELOC ? 16 * this.fallTick : MAX_FALL_VELOC;
    }

    // updates for left/right movement
    if (this.game.d && !this.game.a) {
      if (this.state == 0 || this.state == 2) this.state = 2;
      if (canTurn) this.dir = 0;
      if (canMoveRight) this.x += this.speed * this.game.clockTick;
    } else if (this.game.a && !this.game.d) {
      if (this.state == 0 || this.state == 2) this.state = 2;
      if (canTurn) this.dir = 1;
      if (canMoveLeft) this.x -= this.speed * this.game.clockTick;
    }

    if (this.dead) {
      this.state = 8;
      this.deathTick += this.game.clockTick;
      if (this.deathTick > DEATH_DURATION) {
        this.x = this.spawnX;
        this.y = this.spawnY;
        this.currentHealth = this.maxHealth;
        this.dead = false;
        this.deathTick = 0;
        this.animations[0][8] = new animator(this.spritesheet, 21 * 60, 0, 60, 54, 3, 0.3, false);
        this.animations[1][8] = new animator(this.spritesheet, 21 * 60, 54, 60, 54, 3, 0.3, false);
        this.gameover = true;
      }
    }

    this.dashIcon = new DashCooldown(this.game, this, canUseDash ? 1 : 0);
    this.ultIcon = new CritCooldown(this.game, this, this.canUseUlt, this.powerUpOne);
    this.orbitalIcon = new OrbitalCooldown(this.game, this, canUseOrb ? 1 : 0, this.powerUpTwo);
    this.updateBox();
  }

  draw(ctx) {
    this.animations[this.dir][this.state].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y, PARAMS.SCALE);

    this.healthbar.draw(ctx);
    this.ultIcon.draw(ctx);
    this.dashIcon.draw(ctx);
    this.orbitalIcon.draw(ctx);
  }
}
