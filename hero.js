class Hero {
  constructor(game, x, y) {
    Object.assign(this, { game, x, y });

    this.game.hero = this;
    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/hero.png");

    this.x = x;
    this.y = y;
    this.spawnX = x;
    this.spawnY = y;
    this.radius = 32;

    this.jumpTick = 0; // used for jump deceleration
    this.fallTick = 0; // used for fall acceleration
    this.attackTick = 101; // value indicates that attack is ready
    this.hitstunTick = 0;

    this.dir = 0; // 0 = right, 1 = left
    this.state = 0; // 0 = idle, 1 = parry, 2 = running, 3 = jumping, 4 = falling, 5 = attacking, 6 = hitstun

    this.maxHealth = 25000;
    this.currentHealth = this.maxHealth;
    this.healthbar = new HealthBar(this);
    this.dead = false;

    this.baseDamage = 125;
    this.critChance = 0.2; // 20%

    this.animations = [];
    this.loadAnimations();

    this.updateBox();
  }

  isDead() {
    this.dead = true;
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.currentHealth = this.maxHealth;
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

    // running frames
    this.animations[0][2] = new animator(this.spritesheet, HERO_WIDTH, 0, HERO_WIDTH, HERO_HEIGHT, 6, 0.08, true);

    this.animations[1][2] = new animator(
      this.spritesheet,
      HERO_WIDTH,
      HERO_HEIGHT,
      HERO_WIDTH,
      HERO_HEIGHT,
      6,
      0.08,
      true
    );

    // attacking frames
    this.animations[0][5] = new animator(this.spritesheet, 7 * HERO_WIDTH, 0, HERO_WIDTH, HERO_HEIGHT, 4, 0.08, false);

    this.animations[1][5] = new animator(
      this.spritesheet,
      7 * HERO_WIDTH,
      HERO_HEIGHT,
      HERO_WIDTH,
      HERO_HEIGHT,
      4,
      0.08,
      false
    );

    // jumping frames
    this.animations[0][3] = new animator(this.spritesheet, 11 * HERO_WIDTH, 0, HERO_WIDTH, HERO_HEIGHT, 1, 0.08, true);

    this.animations[1][3] = new animator(
      this.spritesheet,
      11 * HERO_WIDTH,
      HERO_HEIGHT,
      HERO_WIDTH,
      HERO_HEIGHT,
      1,
      0.08,
      true
    );

    // falling frames
    this.animations[0][4] = new animator(this.spritesheet, 12 * HERO_WIDTH, 0, HERO_WIDTH, HERO_HEIGHT, 1, 0.08, true);

    this.animations[1][4] = new animator(
      this.spritesheet,
      12 * HERO_WIDTH,
      HERO_HEIGHT,
      HERO_WIDTH,
      HERO_HEIGHT,
      1,
      0.08,
      true
    );

    // parry frames
    this.animations[0][1] = new animator(this.spritesheet, 13 * HERO_WIDTH, 0, HERO_WIDTH, HERO_HEIGHT, 1, 0.08, true);

    this.animations[1][1] = new animator(
      this.spritesheet,
      13 * HERO_WIDTH,
      HERO_HEIGHT,
      HERO_WIDTH,
      HERO_HEIGHT,
      1,
      0.08,
      true
    );

    // add hitstun frames
    this.animations[0][6] = new animator(this.spritesheet, 14 * HERO_WIDTH, 0, HERO_WIDTH, HERO_HEIGHT, 2, 0.06, true);

    this.animations[1][6] = new animator(
      this.spritesheet,
      14 * HERO_WIDTH,
      HERO_HEIGHT,
      HERO_WIDTH,
      HERO_HEIGHT,
      2,
      0.06,
      true
    );
  }

  updateBox() {
    if (this.dead) {
      this.box = new boundingbox(500, 0, 1, 1);
    } else {
      this.box = new boundingbox(
        this.x + 20 * PARAMS.SCALE - this.game.camera.x,
        this.y + 16 * PARAMS.SCALE,
        21 * PARAMS.SCALE,
        37 * PARAMS.SCALE
      );
    }
  }

  update() {
    let that = this;

    const MAX_FALL_VELOC = 7;
    const ATTACK_DURATION = 26; // matches up with the animation duration
    const ATTACK_READY = 101; // arbitrary value to signal that the hero can attack again
    const ACTIVE_FRAME = 21;

    const HITSTUN_DURATION = 25;

    let canMoveLeft = true;
    let canMoveRight = true;
    let canTurn = true;

    // state defaults to falling
    if (this.state != 3 && this.state != 6) {
      this.state = 4;
    }

    // collision handling
    this.game.stageTiles.forEach(function (tile) {
      if (that.box.collide(tile.box)) {
        if (that.box.bottom - tile.box.top <= 4 * PARAMS.SCALE) {
          // bottom collision
          if (
            (that.dir == 0 && that.box.right >= tile.box.left + 5 * PARAMS.SCALE) ||
            (that.dir == 1 && that.box.left <= tile.box.right - 5 * PARAMS.SCALE)
          ) {
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

        if (that.state == 3 && that.box.top - tile.box.bottom <= 4 * PARAMS.SCALE) {
          // top collision
          if (
            (that.dir == 0 && that.box.right >= tile.box.left + 5 * PARAMS.SCALE) ||
            (that.dir == 1 && that.box.left <= tile.box.right - 5 * PARAMS.SCALE)
          ) {
            that.jumpTick = 0;
            that.fallTick = 3;
            that.state = 4;
          }
        }
      }
    });

    // parry input
    if (this.game.k && (this.state == 0 || this.state == 1 || this.state == 2)) {
      canMoveLeft = false;
      canMoveRight = false;
      this.state = 1;
    }

    // melee attack collision
    this.game.bosses.forEach(function (boss) {
      if (that.hitbox && that.hitbox.collide(boss.box)) {
        const MELEE_DMG_MULTIPLIER = 100;
        const randomFactor = 0.9 + Math.random() * 0.2; // random # between 0.9 and 1.1
        const damage = that.baseDamage * MELEE_DMG_MULTIPLIER * randomFactor;

        if (that.dir == 0) {
          // varies where dmg score shows based off of current direction
          that.offset = 150;
        } else {
          that.offset = -50;
        }

        // critical hit chance calculation
        if (Math.random() * 1 < that.critChance) {
          const critMultiplier = 1.5;
          const critDamage = damage * critMultiplier;
          that.game.addEntity(
            new Score(
              that.game,
              boss.x - that.game.camera.x + that.offset,
              boss.y - that.game.camera.y + 50,
              critDamage,
              true
            )
          );
          boss.currentHealth -= damage * critMultiplier;
        } else {
          that.game.addEntity(
            new Score(
              that.game,
              boss.x - that.game.camera.x + that.offset,
              boss.y - that.game.camera.y + 50,
              damage,
              false
            )
          );
          boss.currentHealth -= damage;
        }

        if (boss.currentHealth <= 0) {
          boss.isDead();
        }
      }

      // melee attack collision receiving from a boss
      if (boss.hitbox && boss.hitbox.collide(that.box)) {
        if (that.state != 1 && that.state != 6) {
          that.currentHealth -= boss.meleeDamage;
          that.attackTick = ATTACK_READY;
          that.state = 6;
        }
      }
    });

    // projectile collision
    this.game.projectiles.forEach(function (proj) {
      if (that.box.collide(proj.hitbox)) {
        if (that.state != 6) {
          that.currentHealth -= proj.damage;
          that.attackTick = ATTACK_READY;
          that.state = 6;
        }
      }
    });

    if (that.currentHealth <= 0) {
      that.isDead();
    }

    // attack input
    if (this.game.j && this.attackTick == ATTACK_READY && (this.state == 0 || this.state == 1)) {
      canMoveLeft = false;
      canMoveRight = false;
      canTurn = false;
      this.state = 5;
      this.attackTick = 0;
    }

    // jump input
    if (this.game.w && (this.state == 0 || this.state == 2)) {
      this.state = 3;
    }

    // handles state when hero is mid-attack
    if (this.attackTick < ATTACK_DURATION) {
      canMoveLeft = false;
      canMoveRight = false;
      canTurn = false;
      this.attackTick++;
      this.state = 5;
      if (this.attackTick == ACTIVE_FRAME) {
        // enable hitbox on active frames
        if (this.dir == 0) {
          this.hitbox = new boundingbox(
            this.x + 40 * PARAMS.SCALE - this.game.camera.x,
            this.y + 20 * PARAMS.SCALE,
            24 * PARAMS.SCALE,
            34 * PARAMS.SCALE
          );
        } else {
          this.hitbox = new boundingbox(
            this.x - 4 * PARAMS.SCALE - this.game.camera.x,
            this.y + 20 * PARAMS.SCALE,
            24 * PARAMS.SCALE,
            34 * PARAMS.SCALE
          );
        }
      } else {
        // disable hitbox on inactive frames
        this.hitbox = null;
      }
    } else if (this.attackTick == ATTACK_DURATION) {
      // reload animation so that it can play on the next attack
      this.animations[0][5] = new animator(this.spritesheet, 7 * 60, 0, 60, 54, 4, 0.08, false);
      this.animations[1][5] = new animator(this.spritesheet, 7 * 60, 54, 60, 54, 4, 0.08, false);
      this.attackTick = ATTACK_READY;
    }

    // hitstun updates
    if (this.state == 6) {
      if (this.hitstunTick < HITSTUN_DURATION) {
        this.state = 6;
        this.hitstunTick++;
        if (this.x < this.game.samurai.x) {
          if (canMoveLeft) this.x -= 4;
        } else {
          if (canMoveRight) this.x += 4;
        }
        this.y -= 5 - 0.2 * this.hitstunTick;
      } else {
        this.hitstunTick = 0;
        this.fallTick = 0;
        this.state = 4;
      }
    }

    // y updates for jumping
    if (this.state == 3) {
      if (this.jumpTick < 35) {
        this.jumpTick++;
        this.y -= 7 - 0.2 * this.jumpTick;
      } else {
        this.jumpTick = 0;
        this.fallTick = 0;
        this.state = 4;
      }
    } else if (this.state == 4) {
      this.fallTick++;
      this.y += 0.2 * this.fallTick <= MAX_FALL_VELOC ? 0.2 * this.fallTick : MAX_FALL_VELOC;
    }

    // updates for left/right movement
    if (this.game.d && !this.game.a) {
      if (this.state != 1 && this.state != 3 && this.state != 4 && this.state != 5) this.state = 2;
      if (canTurn) this.dir = 0;
      if (canMoveRight) this.x += 6;
    } else if (this.game.a && !this.game.d) {
      if (this.state != 1 && this.state != 3 && this.state != 4 && this.state != 5) this.state = 2;
      if (canTurn) this.dir = 1;
      if (canMoveLeft) this.x -= 6;
    }

    // console.log(this.state);
    this.updateBox();
  }

  draw(ctx) {
    this.animations[this.dir][this.state].drawFrame(
      this.game.clockTick,
      ctx,
      this.x - this.game.camera.x,
      this.y,
      PARAMS.SCALE
    );
    this.healthbar.draw(ctx);
  }
}
