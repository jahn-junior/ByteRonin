class WinScreenThree {
    constructor(game) {
      this.game = game;
      this.elapsed = 0;
      ASSET_MANAGER.pauseBackgroundMusic();
    }
    update() {
      this.elapsed += this.game.clockTick;
      if (this.elapsed > 3) {
        this.game.camera.clearEntities();
        this.game.addEntity(new TitleScreen(this.game));
        this.game.hero.powerUpOne = 1;
        this.game.hero.powerUpTwo = 1;
      }
    }
  
    draw(ctx) {
      ctx.font = PARAMS.BLOCKWIDTH + 'px "Press Start 2P"';
  
      ctx.fillStyle = "Black";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
      ctx.fillStyle = "Red";
      ctx.fillText("Byte Ronin", 5.7 * PARAMS.BLOCKWIDTH, 3.1 * PARAMS.BLOCKWIDTH);
      ctx.fillStyle = "#42f5f2";
      ctx.fillText("Byte Ronin", 5.6 * PARAMS.BLOCKWIDTH, 3 * PARAMS.BLOCKWIDTH);
  
      ctx.fillStyle = "Red";
      ctx.fillText("YOU WIN", 6.1 * PARAMS.BLOCKWIDTH, 6.1 * PARAMS.BLOCKWIDTH);
      ctx.fillStyle = "#42f5f2";
      ctx.fillText("YOU WIN", 6 * PARAMS.BLOCKWIDTH, 6 * PARAMS.BLOCKWIDTH);
    }
  }

  class WinScreenTwo {
    constructor(game) {
      this.game = game;
      this.elapsed = 0;
      this.spritesheet = ASSET_MANAGER.getAsset("./sprites/heroAbilities.png");
      this.samurai = new Samurai(this.game, 700, 350);
      this.animations = [];
      this.animations[0] = new animator(this.spritesheet, 0, 64, 32, 32, 1, 0.08, true);
      ASSET_MANAGER.pauseBackgroundMusic();
    }
    update() {
        if (this.game.click && this.game.click.y > 6.5 * PARAMS.BLOCKWIDTH && this.game.click.y < 7.5 * PARAMS.BLOCKWIDTH) {
            this.game.camera.load(levelOne, this.samurai);
            this.game.hero.powerUpOne = 1;
            this.game.hero.powerUpTwo = 1;
        } else if (this.game.click && this.game.click.y > 7.6 * PARAMS.BLOCKWIDTH && this.game.click.y < 8.5 * PARAMS.BLOCKWIDTH) {
            this.game.camera.clearEntities();
            this.game.addEntity(new TitleScreen(this.game)); // Return to menu
            this.game.hero.powerUpOne = 1;
            this.game.hero.powerUpTwo = 1;
        }
    }
  
    draw(ctx) {
      ctx.font = '22px "Press Start 2P"';
  
      ctx.fillStyle = "Black";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
      ctx.fillStyle = "Red";
      ctx.fillText("Upgrade unlocked:", 3.7 * PARAMS.BLOCKWIDTH, 3.1 * PARAMS.BLOCKWIDTH);
      ctx.fillText("[Orbital Strike]", 3.6 * PARAMS.BLOCKWIDTH, 3.6 * PARAMS.BLOCKWIDTH);
      ctx.fillText("Press 'O' to command an orbital stike on an enemy", 3.7 * PARAMS.BLOCKWIDTH, 4.1 * PARAMS.BLOCKWIDTH);
      ctx.fillText("(22 second cooldown)", 3.7 * PARAMS.BLOCKWIDTH, 4.6 * PARAMS.BLOCKWIDTH);
      ctx.fillStyle = "#42f5f2";
      ctx.fillText("Upgrade unlocked:", 3.7 * PARAMS.BLOCKWIDTH, 3 * PARAMS.BLOCKWIDTH);
      ctx.fillText("[Orbital Strike]", 3.6 * PARAMS.BLOCKWIDTH, 3.5 * PARAMS.BLOCKWIDTH);
      ctx.fillText("Press 'O' to command an orbital stike on an enemy", 3.7 * PARAMS.BLOCKWIDTH, 4.0 * PARAMS.BLOCKWIDTH);
      ctx.fillText("(22 second cooldown)", 3.7 * PARAMS.BLOCKWIDTH, 4.5 * PARAMS.BLOCKWIDTH);

      ctx.fillStyle = "Red";
      ctx.fillText("Continue", 3.7 * PARAMS.BLOCKWIDTH, 7.1 * PARAMS.BLOCKWIDTH);
      ctx.fillStyle = "#42f5f2";
      ctx.fillText("Continue", 3.7 * PARAMS.BLOCKWIDTH, 7 * PARAMS.BLOCKWIDTH);

      ctx.fillStyle = "Red";
      ctx.fillText("Return to Title", 3.7 * PARAMS.BLOCKWIDTH, 8.1 * PARAMS.BLOCKWIDTH);
      ctx.fillStyle = "#42f5f2";
      ctx.fillText("Return to Title", 3.7 * PARAMS.BLOCKWIDTH, 8 * PARAMS.BLOCKWIDTH);

      this.animations[0].drawFrame(
        this.game.clockTick,
        ctx,
        75,
        165,
        PARAMS.SCALE
      )
    }
  }

  class WinScreenOne {
    constructor(game) {
      this.game = game;
      this.elapsed = 0;
      this.spritesheet = ASSET_MANAGER.getAsset("./sprites/heroAbilities.png");
      this.orochi = new Orochi(this.game, 300, 350);
      this.animations = [];
      this.animations[0] = new animator(this.spritesheet, 0, 0, 32, 32, 1, 0.08, true);
      ASSET_MANAGER.pauseBackgroundMusic();
    }
    update() {
        if (this.game.click && this.game.click.y > 6.5 * PARAMS.BLOCKWIDTH && this.game.click.y < 7.5 * PARAMS.BLOCKWIDTH) {
            this.game.camera.load(levelOne, this.orochi);
            this.game.hero.powerUpOne = 1;
            this.game.hero.powerUpTwo = 0;
        } else if (this.game.click && this.game.click.y > 7.6 * PARAMS.BLOCKWIDTH && this.game.click.y < 8.5 * PARAMS.BLOCKWIDTH) {
            this.game.camera.clearEntities();
            this.game.addEntity(new TitleScreen(this.game));
            this.game.hero.powerUpOne = 1;
            this.game.hero.powerUpTwo = 0;
        }
    }
  
    draw(ctx) {
      ctx.font = '22px "Press Start 2P"';
  
      ctx.fillStyle = "Black";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
      ctx.fillStyle = "Red";
      ctx.fillText("Upgrade unlocked:", 3.7 * PARAMS.BLOCKWIDTH, 3.1 * PARAMS.BLOCKWIDTH);
      ctx.fillText("[Cardiac Overclock]", 3.6 * PARAMS.BLOCKWIDTH, 3.6 * PARAMS.BLOCKWIDTH);
      ctx.fillText("Press 'U' for 100% crit chance for 5 seconds", 3.7 * PARAMS.BLOCKWIDTH, 4.1 * PARAMS.BLOCKWIDTH);
      ctx.fillText("(20 second cooldown)", 3.7 * PARAMS.BLOCKWIDTH, 4.6 * PARAMS.BLOCKWIDTH);
      ctx.fillStyle = "#42f5f2";
      ctx.fillText("Upgrade unlocked:", 3.7 * PARAMS.BLOCKWIDTH, 3 * PARAMS.BLOCKWIDTH);
      ctx.fillText("[Cardiac Overclock]", 3.6 * PARAMS.BLOCKWIDTH, 3.5 * PARAMS.BLOCKWIDTH);
      ctx.fillText("Press 'U' for 100% crit chance for 5 seconds", 3.7 * PARAMS.BLOCKWIDTH, 4.0 * PARAMS.BLOCKWIDTH);
      ctx.fillText("(20 second cooldown)", 3.7 * PARAMS.BLOCKWIDTH, 4.5 * PARAMS.BLOCKWIDTH);

      ctx.fillStyle = "Red";
      ctx.fillText("Continue", 3.7 * PARAMS.BLOCKWIDTH, 7.1 * PARAMS.BLOCKWIDTH);
      ctx.fillStyle = "#42f5f2";
      ctx.fillText("Continue", 3.7 * PARAMS.BLOCKWIDTH, 7 * PARAMS.BLOCKWIDTH);

      ctx.fillStyle = "Red";
      ctx.fillText("Return to Title", 3.7 * PARAMS.BLOCKWIDTH, 8.1 * PARAMS.BLOCKWIDTH);
      ctx.fillStyle = "#42f5f2";
      ctx.fillText("Return to Title", 3.7 * PARAMS.BLOCKWIDTH, 8 * PARAMS.BLOCKWIDTH);

      this.animations[0].drawFrame(
        this.game.clockTick,
        ctx,
        75,
        165,
        PARAMS.SCALE
      )
    }
  }
  