class TitleScreen {
  constructor(game) {
    this.game = game;

    this.images = [];
    this.frame = 0;
    this.frameDuration = 1 / 10; // Duration of each frame at 10 FPS
    this.lastFrameChangeTime = 0; // Track when the last frame change occurred
    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/hero.png");
    this.attack = new animator(this.spritesheet, 7 * 60, 0, 60, 54, 4, 0.08, true);
    this.dash = new animator(this.spritesheet, 24 * 60, 0, 60, 54, 6, 0.08, true);
    this.parry = new animator(this.spritesheet, 18 * 60, 0, 60, 54, 1, 0.08, true);

    this.playTitleMusic = true;

    let canvas = document.getElementById("gameWorld");
    canvas.addEventListener("click", () => {
      if (this.playTitleMusic) {
        ASSET_MANAGER.pauseBackgroundMusic();
        ASSET_MANAGER.playAsset("./music/titlePageMusic.wav");
        this.playTitleMusic = false;
      }
    });

    // Load the 39 background images
    for (let i = 0; i < 39; i++) {
      this.images[i] = ASSET_MANAGER.getAsset("./background/MainStage/background" + i + ".png");
    }

    this.wolf = new Wolf(this.game, 200, 490);
    this.orochi = new Orochi(this.game, 300, 350);
    this.samurai = new Samurai(this.game, 700, 350);

    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/hero.png");
    this.title = 0;
    this.selection1 = false;
    this.selection2 = false;
    this.selection3 = false;
  }
  update() {
    let currentTime = this.game.timer.gameTime;
    // Check if it's time to change to the next frame
    if (currentTime - this.lastFrameChangeTime > this.frameDuration) {
      this.frame = (this.frame + 1) % this.images.length; // Cycle through frames
      this.lastFrameChangeTime = currentTime;
    }

    //If we are on the main title page.
    if (this.title == 0) {
      if (this.game.click && this.game.click.y > 4 * PARAMS.BLOCKWIDTH && this.game.click.y < 5 * PARAMS.BLOCKWIDTH) {
        this.title = 1;
        ASSET_MANAGER.playAsset("./sound/lazerButton.wav");
      }
      if (this.game.click && this.game.click.y > 5 * PARAMS.BLOCKWIDTH && this.game.click.y < 6 * PARAMS.BLOCKWIDTH) {
        this.title = 2;
        ASSET_MANAGER.playAsset("./sound/lazerButton.wav");
      }
      if (this.game.click && this.game.click.y > 6 * PARAMS.BLOCKWIDTH && this.game.click.y < 7 * PARAMS.BLOCKWIDTH) {
        this.title = 3;
        ASSET_MANAGER.playAsset("./sound/lazerButton.wav");
      }
      if (this.game.click && this.game.click.y > 7 * PARAMS.BLOCKWIDTH && this.game.click.y < 8 * PARAMS.BLOCKWIDTH) {
        this.title = 4;
        ASSET_MANAGER.playAsset("./sound/lazerButton.wav");
      }
    }
    // If we are on the Contract Title Page.
    else if (this.title == 1) {
      if (this.game.click && this.game.click.y > 1 * PARAMS.BLOCKWIDTH && this.game.click.y < 2 * PARAMS.BLOCKWIDTH) {
        ASSET_MANAGER.playAsset("./sound/lazerButton.wav");
        this.selection1 = true;
        this.selection2 = false;
        this.selection3 = false;
      }
      if (this.game.click && this.game.click.y > 3 * PARAMS.BLOCKWIDTH && this.game.click.y < 4 * PARAMS.BLOCKWIDTH) {
        ASSET_MANAGER.playAsset("./sound/lazerButton.wav");
        this.selection1 = false;
        this.selection2 = true;
        this.selection3 = false;
      }
      if (this.game.click && this.game.click.y > 5 * PARAMS.BLOCKWIDTH && this.game.click.y < 6 * PARAMS.BLOCKWIDTH) {
        ASSET_MANAGER.playAsset("./sound/lazerButton.wav");
        this.selection1 = false;
        this.selection2 = false;
        this.selection3 = true;
      }
      if (this.selection1 && this.game.click && this.game.click.y > 2.5 * PARAMS.BLOCKWIDTH && this.game.click.y < 3 * PARAMS.BLOCKWIDTH) {
        ASSET_MANAGER.playAsset("./sound/lazerReturn.wav");
        this.title = 0;
        this.selection1 = false;
        this.selection2 = false;
        this.selection3 = false;
      }
      if (this.selection2 && this.game.click && this.game.click.y > 4.5 * PARAMS.BLOCKWIDTH && this.game.click.y < 5 * PARAMS.BLOCKWIDTH) {
        ASSET_MANAGER.playAsset("./sound/lazerReturn.wav");
        this.title = 0;
        this.selection1 = false;
        this.selection2 = false;
        this.selection3 = false;
      }
      if (this.selection3 && this.game.click && this.game.click.y > 6.5 * PARAMS.BLOCKWIDTH && this.game.click.y < 7 * PARAMS.BLOCKWIDTH) {
        ASSET_MANAGER.playAsset("./sound/lazerReturn.wav");
        this.title = 0;
        this.selection1 = false;
        this.selection2 = false;
        this.selection3 = false;
      }
      if (this.selection1 && this.game.click && this.game.click.y > 2 * PARAMS.BLOCKWIDTH && this.game.click.y < 2.5 * PARAMS.BLOCKWIDTH) {
        ASSET_MANAGER.playAsset("./sound/lazerButton.wav");
        this.title = 2;
        this.game.camera.load(levelOne, this.wolf);
        this.selection1 = false;
        this.selection2 = false;
        this.selection3 = false;
      } else if (this.selection2 && this.game.click && this.game.click.y > 4 * PARAMS.BLOCKWIDTH && this.game.click.y < 4.5 * PARAMS.BLOCKWIDTH) {
        ASSET_MANAGER.playAsset("./sound/lazerButton.wav");
        this.title = 2;
        this.game.camera.load(levelOne, this.orochi);
        this.selection1 = false;
        this.selection2 = false;
        this.selection3 = false;
      } else if (this.selection3 && this.game.click && this.game.click.y > 6 * PARAMS.BLOCKWIDTH && this.game.click.y < 6.5 * PARAMS.BLOCKWIDTH) {
        ASSET_MANAGER.playAsset("./sound/lazerButton.wav");
        this.title = 2;
        this.game.camera.load(levelOne, this.samurai);
        this.selection1 = false;
        this.selection2 = false;
        this.selection3 = false;
      }
    } else if (this.title == 2 || this.title == 3 || this.title == 4) {
      if (this.game.click && this.game.click.y > 630 && this.game.click.y < 660) {
        ASSET_MANAGER.playAsset("./sound/lazerReturn.wav");
        this.title = 0;
      }
    }
    this.game.click = null;
  }

  draw(ctx) {
    ctx.drawImage(this.images[this.frame], 0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);

    ctx.strokeStyle = "Black"; // Color of the outline
    ctx.lineWidth = 2; // Thickness of the outline

    const x = 7;
    if (this.title == 0) {
      ctx.font = PARAMS.BLOCKWIDTH + 'px "Press Start 2P"';
      ctx.fillStyle = "White";

      ctx.fillText("Byte Ronin", 6.5 * PARAMS.BLOCKWIDTH, 3.5 * PARAMS.BLOCKWIDTH);
      ctx.strokeText("Byte Ronin", 6.5 * PARAMS.BLOCKWIDTH, 3.5 * PARAMS.BLOCKWIDTH);

      ctx.font = PARAMS.BLOCKWIDTH / 2 + 'px "Press Start 2P"';

      ctx.fillText("PLAY", x * PARAMS.BLOCKWIDTH, 5 * PARAMS.BLOCKWIDTH);
      ctx.strokeText("PLAY", x * PARAMS.BLOCKWIDTH, 5 * PARAMS.BLOCKWIDTH);
      if (this.game.mouse && this.game.mouse.y > 4 * PARAMS.BLOCKWIDTH && this.game.mouse.y < 5 * PARAMS.BLOCKWIDTH) {
        ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/hero.png"), 0, 0, 65, 50, (x - 1.5) * PARAMS.BLOCKWIDTH, 4 * PARAMS.BLOCKWIDTH, 125, 75);
      }

      ctx.fillText("UPGRADES", x * PARAMS.BLOCKWIDTH, 6 * PARAMS.BLOCKWIDTH);
      ctx.strokeText("UPGRADES", x * PARAMS.BLOCKWIDTH, 6 * PARAMS.BLOCKWIDTH);
      if (this.game.mouse && this.game.mouse.y > 5 * PARAMS.BLOCKWIDTH && this.game.mouse.y < 6 * PARAMS.BLOCKWIDTH) {
        ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/hero.png"), 0, 0, 65, 50, (x - 1.5) * PARAMS.BLOCKWIDTH, 5 * PARAMS.BLOCKWIDTH, 125, 75);
      }

      ctx.fillText("CONTROLS", x * PARAMS.BLOCKWIDTH, 7 * PARAMS.BLOCKWIDTH);
      ctx.strokeText("CONTROLS", x * PARAMS.BLOCKWIDTH, 7 * PARAMS.BLOCKWIDTH);
      if (this.game.mouse && this.game.mouse.y > 6 * PARAMS.BLOCKWIDTH && this.game.mouse.y < 7 * PARAMS.BLOCKWIDTH) {
        ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/hero.png"), 0, 0, 65, 50, (x - 1.5) * PARAMS.BLOCKWIDTH, 6 * PARAMS.BLOCKWIDTH, 125, 75);
      }

      ctx.fillText("CREDITS", x * PARAMS.BLOCKWIDTH, 8 * PARAMS.BLOCKWIDTH);
      ctx.strokeText("CREDITS", x * PARAMS.BLOCKWIDTH, 8 * PARAMS.BLOCKWIDTH);
      if (this.game.mouse && this.game.mouse.y > 7 * PARAMS.BLOCKWIDTH && this.game.mouse.y < 8 * PARAMS.BLOCKWIDTH) {
        ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/hero.png"), 0, 0, 65, 50, (x - 1.5) * PARAMS.BLOCKWIDTH, 7 * PARAMS.BLOCKWIDTH, 125, 75);
      }
    } else if (this.title == 1) {
      ctx.font = PARAMS.BLOCKWIDTH / 2 + 'px "Press Start 2P"';
      ctx.fillStyle = "White";
      ctx.fillText("Contract I: Cyber Wolf", 5 * PARAMS.BLOCKWIDTH, 2 * PARAMS.BLOCKWIDTH);
      ctx.strokeText("Contract I: Cyber Wolf", 5 * PARAMS.BLOCKWIDTH, 2 * PARAMS.BLOCKWIDTH);
      if (this.game.mouse && this.game.mouse.y > 1 * PARAMS.BLOCKWIDTH && this.game.mouse.y < 2 * PARAMS.BLOCKWIDTH) {
        ctx.fillStyle = "#4aedff";
        ctx.fillText("Contract I: Cyber Wolf", 5 * PARAMS.BLOCKWIDTH, 2 * PARAMS.BLOCKWIDTH);
        ctx.strokeText("Contract I: Cyber Wolf", 5 * PARAMS.BLOCKWIDTH, 2 * PARAMS.BLOCKWIDTH);
      }
      if (this.selection1) {
        ctx.fillStyle = "White";
        ctx.font = PARAMS.BLOCKWIDTH / 4 + 'px "Press Start 2P"';
        ctx.fillText("Accept", 6 * PARAMS.BLOCKWIDTH, 2.5 * PARAMS.BLOCKWIDTH);

        if (this.game.mouse && this.game.mouse.y > 2 * PARAMS.BLOCKWIDTH && this.game.mouse.y < 2.5 * PARAMS.BLOCKWIDTH) {
          ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/hero.png"), 0, 0, 65, 50, (x - 1.8) * PARAMS.BLOCKWIDTH, 2.0 * PARAMS.BLOCKWIDTH, 70, 35);
        }
        ctx.fillText("Return", 6 * PARAMS.BLOCKWIDTH, 3 * PARAMS.BLOCKWIDTH);

        if (this.game.mouse && this.game.mouse.y > 2.5 * PARAMS.BLOCKWIDTH && this.game.mouse.y < 3 * PARAMS.BLOCKWIDTH) {
          ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/hero.png"), 0, 0, 65, 50, (x - 1.8) * PARAMS.BLOCKWIDTH, 2.5 * PARAMS.BLOCKWIDTH, 70, 35);
        }
      }

      ctx.fillStyle = "White";
      ctx.font = PARAMS.BLOCKWIDTH / 2 + 'px "Press Start 2P"';
      ctx.fillText("Contract II: Cyberhydraic Maiden", 5 * PARAMS.BLOCKWIDTH, 4 * PARAMS.BLOCKWIDTH);
      ctx.strokeText("Contract II: Cyberhydraic Maiden", 5 * PARAMS.BLOCKWIDTH, 4 * PARAMS.BLOCKWIDTH);
      if (this.game.mouse && this.game.mouse.y > 3 * PARAMS.BLOCKWIDTH && this.game.mouse.y < 4 * PARAMS.BLOCKWIDTH) {
        ctx.fillStyle = "#4aedff";
        ctx.fillText("Contract II: Cyberhydraic Maiden", 5 * PARAMS.BLOCKWIDTH, 4 * PARAMS.BLOCKWIDTH);
        ctx.strokeText("Contract II: Cyberhydraic Maiden", 5 * PARAMS.BLOCKWIDTH, 4 * PARAMS.BLOCKWIDTH);
      }
      if (this.selection2) {
        ctx.fillStyle = "White";
        ctx.font = PARAMS.BLOCKWIDTH / 4 + 'px "Press Start 2P"';

        ctx.fillText("Accept", 6 * PARAMS.BLOCKWIDTH, 4.5 * PARAMS.BLOCKWIDTH);
        if (this.game.mouse && this.game.mouse.y > 4 * PARAMS.BLOCKWIDTH && this.game.mouse.y < 4.5 * PARAMS.BLOCKWIDTH) {
          ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/hero.png"), 0, 0, 65, 50, (x - 1.8) * PARAMS.BLOCKWIDTH, 4.0 * PARAMS.BLOCKWIDTH, 70, 35);
        }
        ctx.fillText("Return", 6 * PARAMS.BLOCKWIDTH, 5 * PARAMS.BLOCKWIDTH);
        if (this.game.mouse && this.game.mouse.y > 4.5 * PARAMS.BLOCKWIDTH && this.game.mouse.y < 5 * PARAMS.BLOCKWIDTH) {
          ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/hero.png"), 0, 0, 65, 50, (x - 1.8) * PARAMS.BLOCKWIDTH, 4.5 * PARAMS.BLOCKWIDTH, 70, 35);
        }
      }
      ctx.fillStyle = "White";
      ctx.font = PARAMS.BLOCKWIDTH / 2 + 'px "Press Start 2P"';
      ctx.fillStyle = "White";
      ctx.fillText("Final Contract: Nano Shogun", 5 * PARAMS.BLOCKWIDTH, 6 * PARAMS.BLOCKWIDTH);
      ctx.strokeText("Final Contract: Nano Shogun", 5 * PARAMS.BLOCKWIDTH, 6 * PARAMS.BLOCKWIDTH);
      if (this.game.mouse && this.game.mouse.y > 5 * PARAMS.BLOCKWIDTH && this.game.mouse.y < 6 * PARAMS.BLOCKWIDTH) {
        ctx.fillStyle = "#4aedff";
        ctx.fillText("Final Contract: Nano Shogun", 5 * PARAMS.BLOCKWIDTH, 6 * PARAMS.BLOCKWIDTH);
        ctx.strokeText("Final Contract: Nano Shogun", 5 * PARAMS.BLOCKWIDTH, 6 * PARAMS.BLOCKWIDTH);
      }

      if (this.selection3) {
        ctx.fillStyle = "White";
        ctx.font = PARAMS.BLOCKWIDTH / 4 + 'px "Press Start 2P"';
        ctx.fillText("Accept", 6 * PARAMS.BLOCKWIDTH, 6.5 * PARAMS.BLOCKWIDTH);
        if (this.game.mouse && this.game.mouse.y > 6 * PARAMS.BLOCKWIDTH && this.game.mouse.y < 6.5 * PARAMS.BLOCKWIDTH) {
          ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/hero.png"), 0, 0, 65, 50, (x - 1.8) * PARAMS.BLOCKWIDTH, 6.0 * PARAMS.BLOCKWIDTH, 70, 35);
        }
        ctx.fillText("Return", 6 * PARAMS.BLOCKWIDTH, 7 * PARAMS.BLOCKWIDTH);
        if (this.game.mouse && this.game.mouse.y > 6.5 * PARAMS.BLOCKWIDTH && this.game.mouse.y < 7 * PARAMS.BLOCKWIDTH) {
          ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/hero.png"), 0, 0, 65, 50, (x - 1.8) * PARAMS.BLOCKWIDTH, 6.5 * PARAMS.BLOCKWIDTH, 70, 35);
        }
      }
    } else if (this.title == 2) {
      ctx.font = '40px "Press Start 2P"';
      ctx.fillStyle = "White";
      ctx.strokeStyle = "Black";
      ctx.strokeText("Upgrades", 100, 100);
      ctx.fillText("Upgrades", 100, 100);

      ctx.font = '25px "Press Start 2P"';
      ctx.strokeText("Return", 630, 650);
      ctx.fillText("Return", 630, 650);
      ctx.font = '22px "Press Start 2P"';

      if (this.game.hero.powerUpOne) {
        ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/heroAbilities.png"), 0, 0, 32, 32, 100, 150, 2.5 * PARAMS.BLOCKWIDTH, 2.5 * PARAMS.BLOCKWIDTH);

        ctx.strokeText("Ultimate Ability: [Cardiac Overclock]", 275, 185);
        ctx.strokeText("Increase critical chance to 100% for 5 seconds", 275, 215);
        ctx.strokeText("- (20 second cooldown)", 275, 245);

        ctx.fillText("Ultimate Ability: [Cardiac Overclock]", 275, 185);
        ctx.fillText("Increase critical chance to 100% for 5 seconds", 275, 215);
        ctx.fillText("- (20 second cooldown)", 275, 245);
      } else {
        ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/heroAbilities.png"), 64, 0, 32, 32, 100, 150, 2.5 * PARAMS.BLOCKWIDTH, 2.5 * PARAMS.BLOCKWIDTH);
        ctx.strokeText("Unlock by completing [Contract I: Cyber Wolf]", 275, 185);
        ctx.fillText("Unlock by completing [Contract I: Cyber Wolf]", 275, 185);
      }

      if (this.game.hero.powerUpTwo) {
        ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/heroAbilities.png"), 0, 64, 32, 32, 100, 400, 2.5 * PARAMS.BLOCKWIDTH, 2.5 * PARAMS.BLOCKWIDTH);
        ctx.strokeText("Tactical Ability: [Orbital Strike]", 275, 435);
        ctx.strokeText("Command an orbital strike that targets an enemy", 275, 465);
        ctx.strokeText("that does devastating damage upon impact", 275, 495);
        ctx.strokeText("- (15 second cooldown)", 275, 525);
        ctx.fillText("Tactical Ability: [Orbital Strike]", 275, 435);
        ctx.fillText("Command an orbital strike that targets an enemy", 275, 465);
        ctx.fillText("that does devastating damage upon impact", 275, 495);
        ctx.fillText("- (22 second cooldown)", 275, 525);
      } else {
        ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/heroAbilities.png"), 64, 64, 32, 32, 100, 400, 2.5 * PARAMS.BLOCKWIDTH, 2.5 * PARAMS.BLOCKWIDTH);
        ctx.strokeText("Unlock by completing [Contract II: Cyberhydraic", 275, 435);
        ctx.strokeText("Maiden]", 275, 465);
        ctx.fillText("Unlock by completing [Contract II: Cyberhydraic", 275, 435);
        ctx.fillText("Maiden]", 275, 465);
      }
    } else if (this.title == 3) {
      ctx.font = '40px "Press Start 2P"';
      ctx.fillStyle = "White";
      ctx.fillText("Controls", 100, 100);
      ctx.strokeStyle = "Black";
      ctx.strokeText("Controls", 100, 100);

      ctx.font = '25px "Press Start 2P"';
      ctx.fillText("Return", 630, 650);
      ctx.strokeText("Return", 630, 650);
      ctx.font = '22px "Press Start 2P"';

      ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/wasd.png"), 0, 0, 235, 155, 300, 150, 3 * PARAMS.BLOCKWIDTH, 2.5 * PARAMS.BLOCKWIDTH);
      ctx.strokeText("To move, press W A S D", 420, 185);
      ctx.fillText("To move, press W A S D", 420, 185);

      this.attack.drawFrame(this.game.clockTick, ctx, 20, 350, PARAMS.SCALE);
      ctx.fillText("J To Attack", 20, 385);
      ctx.strokeText("J To Attack", 20, 385);

      this.parry.drawFrame(this.game.clockTick, ctx, 320, 350, PARAMS.SCALE);
      ctx.fillText("K To Parry", 320, 385);
      ctx.strokeText("K To Parry", 320, 385);

      this.dash.drawFrame(this.game.clockTick, ctx, 620, 350, PARAMS.SCALE);
      ctx.fillText("L To Dash", 620, 385);
      ctx.strokeText("L To Dash", 620, 385);

      ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/heroAbilities.png"), 0, 0, 32, 32, 920, 385, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
      ctx.fillText("U for Ultimate", 920, 385);
      ctx.strokeText("U for Ultimate", 920, 385);

      ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/heroAbilities.png"), 0, 64, 32, 32, 920, 485, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
      ctx.fillText("O for Orbital Strike", 920, 485);
      ctx.strokeText("O for Orbital Strike", 920, 485);
    } else if (this.title == 4) {
      ctx.font = '50px "Press Start 2P"';
      ctx.fillStyle = "White";
      ctx.fillText("CREDITS", 500, 100);
      ctx.strokeStyle = "Black";
      ctx.strokeText("CREDITS", 500, 100);

      ctx.font = '40px "Press Start 2P"';
      ctx.fillText("* JJ Coldiron", 400, 200);
      ctx.strokeText("* JJ Coldiron", 400, 200);
      ctx.fillText("* Halim Lee", 400, 300);
      ctx.strokeText("* Halim Lee", 400, 300);
      ctx.fillText("* Nate Mann", 400, 400);
      ctx.strokeText("* Nate Mann", 400, 400);
      ctx.fillText("* Christopher Yuan", 400, 500);
      ctx.strokeText("* Christopher Yuan", 400, 500);

      ctx.font = '25px "Press Start 2P"';
      ctx.fillText("Return", 550, 650);
      ctx.strokeText("Return", 550, 650);
      ctx.font = '22px "Press Start 2P"';
    }
  }
}
