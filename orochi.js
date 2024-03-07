class Orochi {
  constructor(game, x, y) {
    Object.assign(this, { game, x, y });
    this.game.orochi = this;
    this.dir = 1; // 0 = right, 1 = left
    this.state = 4; // 0 = idle, 1 = running, 2 = attacking, 3 = transforming, 4 = phase 2, 5 = death, 6 = beam (charging), 7 = beam (active)
    this.phase = 0; // 0 = initial phase, 1 = phase2
    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/orochi.png");
    this.beamsprite = ASSET_MANAGER.getAsset("./sprites/orochiBeam.png");
    this.visualRadius = 1500;
    this.speed = 100;
    this.baseAttack = 700;
    this.chargingTimer = 0;
    this.beamTimer = 0;
    this.beambox = null;
    this.beamDamage = this.baseAttack * 1.75 * (0.9 + Math.random() * 0.2);
    this.transformTimer = 0;
    this.isTransformed = false;
    this.play = true;
    this.velocityY = 0;
    this.isInvulnerable = false;
    this.dead = false;
    this.deathTick = 0;
    this.canHit = true;
    this.playWinScreen = false;

    this.title = "Cyberhydraic Maiden";
    this.maxHealth = 2000000;
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
    this.animations[0][0] = new animator(this.spritesheet, 0, OROCHI_HEIGHT, OROCHI_WIDTH, OROCHI_HEIGHT, 1, 0.08, true);

    this.animations[1][0] = new animator(this.spritesheet, 0, 0, OROCHI_WIDTH, OROCHI_HEIGHT, 1, 0.08, true);

    // running animations
    this.animations[0][1] = new animator(this.spritesheet, OROCHI_WIDTH, OROCHI_HEIGHT, OROCHI_WIDTH, OROCHI_HEIGHT, 5, 0.25, true);

    this.animations[1][1] = new animator(this.spritesheet, OROCHI_WIDTH, 0, OROCHI_WIDTH, OROCHI_HEIGHT, 5, 0.25, true);

    // attacking animations
    this.animations[0][2] = new animator(this.spritesheet, 6 * OROCHI_WIDTH, OROCHI_HEIGHT, OROCHI_WIDTH, OROCHI_HEIGHT, 8, 0.25, true);

    this.animations[1][2] = new animator(this.spritesheet, 6 * OROCHI_WIDTH, 0, OROCHI_WIDTH, OROCHI_HEIGHT, 8, 0.25, true);

    // transforming frames
    this.animations[0][3] = new animator(this.spritesheet, 6 * OROCHI_WIDTH, OROCHI_HEIGHT, OROCHI_WIDTH, OROCHI_HEIGHT, 14, 0.25, true);

    this.animations[1][3] = new animator(this.spritesheet, 6 * OROCHI_WIDTH, 0, OROCHI_WIDTH, OROCHI_HEIGHT, 14, 0.25, true);

    // phase II animations
    this.animations[0][4] = new animator(this.spritesheet, 19 * OROCHI_WIDTH, OROCHI_HEIGHT, OROCHI_WIDTH, OROCHI_HEIGHT, 1, 0.08, true);

    this.animations[1][4] = new animator(this.spritesheet, 19 * OROCHI_WIDTH, 0, OROCHI_WIDTH, OROCHI_HEIGHT, 1, 0.08, true);

    // death animations
    this.animations[0][5] = new animator(this.spritesheet, 20 * OROCHI_WIDTH, OROCHI_HEIGHT, OROCHI_WIDTH, OROCHI_HEIGHT, 3, 0.25, false);

    this.animations[1][5] = new animator(this.spritesheet, 20 * OROCHI_WIDTH, 0, OROCHI_WIDTH, OROCHI_HEIGHT, 3, 0.25, false);

    // beam attack charging animations
    this.animations[0][6] = new animator(this.beamsprite, 0, 64, 448, 64, 2, 1, true);

    this.animations[1][6] = new animator(this.beamsprite, 0, 0, 448, 64, 2, 1, true);

    // beam attack active animations
    this.animations[0][7] = new animator(this.beamsprite, 2 * 448, 64, 448, 64, 1, 1, true);

    this.animations[1][7] = new animator(this.beamsprite, 2 * 448, 0, 448, 64, 1, 1, true);
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
    if (this.play) {
      ASSET_MANAGER.playAsset("./sound/transform.wav");
      this.play = false;
    }
    if (this.transformTimer < 3.4) {
      this.transformTimer += 1 * this.game.clockTick;
    } else {
      this.state = 4;
      this.phase = 1;
      this.isTransformed = true;
      this.isInvulnerable = false;
      this.play = true;
    }
  }

  // A beam attack that casts in phase II
  beamAttack() {
    this.state = 6;
    let beamLimit = 2;
    if (this.play) {
      ASSET_MANAGER.playAsset("./sound/beam.wav");
      this.play = false;
    }

    if (this.beamTimer < beamLimit) {
      this.beamTimer += 1 * this.game.clockTick;
    } else {
      this.state = 7;

      if (this.beamTimer < beamLimit + 0.1) {
        // active beambox for short duration

        let beamX = this.dir == 0 ? this.x + 130 : this.x - this.game.camera.x - 1750;
        this.beambox = new boundingbox(beamX, this.y - this.game.camera.y, 448 * PARAMS.SCALE, 64 * PARAMS.SCALE);
        this.beamTimer += 1 * this.game.clockTick;
      } else {
        this.beambox = null;
        this.beamTimer = 0;
        this.play = true;
      }
    }
  }

  // A special attack that will cast when the hero is at a distance
  projectileAttack() {
    const PROJECTILE_VELOCITY = 650;
    const PROJECTILE_DAMAGE = this.baseAttack * 1.2 * (0.9 + Math.random() * 0.2);
    let chargingLimit = 2.05;

    if (this.chargingTimer < chargingLimit) {
      this.state = 2;
      this.chargingTimer += 1 * this.game.clockTick;
    } else {
      let projX = this.dir == 0 ? this.x - this.game.camera.x - 64 + this.box.width : this.x - this.game.camera.x - 80;
      let proj = new OrochiProjectile(this.game, projX, this.y - this.game.camera.y + 120, 16 * PARAMS.SCALE, 10 * PARAMS.SCALE, this.dir, PROJECTILE_VELOCITY, PROJECTILE_DAMAGE);

      this.game.addEntity(proj);
      ASSET_MANAGER.playAsset("./sound/orochiLazer.wav");
      this.game.projectiles.push(proj);

      this.chargingTimer = 0;
    }
  }

  updateBox() {
    if (this.phase == 1) {
      // smaller bounding box in phase II
      this.box = new boundingbox(this.x - this.game.camera.x + 56, this.y - this.game.camera.y + 26, 37 * PARAMS.SCALE, 56 * PARAMS.SCALE);
    } else {
      this.box = new boundingbox(this.x - this.game.camera.x, this.y - this.game.camera.y + 26, 64 * PARAMS.SCALE, 56 * PARAMS.SCALE);
    }
  }

  update() {
    let canMoveLeft = true;
    let canMoveRight = true;
    let movement = this.speed * this.game.clockTick;
    let that = this;
    let healthRatio = this.currentHealth / this.maxHealth;

    this.applyGravity();
    this.updatePosition();

    if (healthRatio < 0.5) {
      if (this.state != 4 && this.state != 6 && this.state != 7) {
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
              // if the orochi clips off the map, then reset it's position inside arena
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
    if (this.state != 3) {
      if (canSee(this, this.game.hero) && this.x > this.game.hero.x && getDistance(this, this.game.hero) > 300) {
        if (canMoveLeft && this.dir == 1 && this.state != 3) {
          this.x -= movement;
          if (this.phase == 0) {
            this.state = 1;
          } else {
            this.state = 4;
          }
        }
      } else if (canSee(this, this.game.hero) && this.x + 32 * PARAMS.SCALE < this.game.hero.x && getDistance(this, this.game.hero) > 300) {
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
    }

    // attack logic
    if (this.state != 3) {
      if (this.phase == 1) {
        if (getDistance(this, this.game.hero) <= 300) {
          this.beamAttack();
        }
      } else {
        if (getDistance(this, this.game.hero) <= 400) {
          this.projectileAttack();
        }
      }
    }

    if (this.dead) {
      this.state = 5;
      this.deathTick++;
      if (this.deathTick == 80) {
        this.currentHealth = 0;
        this.dead = false;
        this.playWinScreen = true;
        this.deathTick = 0;
        this.removeFromWorld = true;
      }
    }

    this.updateBox();
  }

  draw(ctx) {
    if ((this.state == 6 || this.state == 7) && this.dir == 1) {
      // adjustment for the alignment of orochiBeam.png facing left
      this.animations[this.dir][this.state].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x - 1550, this.y - this.game.camera.y, PARAMS.SCALE);
    } else {
      this.animations[this.dir][this.state].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, PARAMS.SCALE);
    }
    this.healthbar.draw(ctx);
  }
}
