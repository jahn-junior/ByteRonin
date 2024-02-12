class TitleScreen {
    constructor(game) {
        this.game = game;

        this.images = [];
        this.frame = 0;
        this.frameDuration = 1 / 10; // Duration of each frame at 10 FPS
        this.lastFrameChangeTime = 0; // Track when the last frame change occurred

        // Load the 39 background images
        for (let i = 0; i < 39; i++) {
            this.images[i] = ASSET_MANAGER.getAsset("./background/MainStage/background" + i + ".png");
        }

       
        this.wolf = new Wolf(this.game, 200, 490);
        this.orochi = new Orochi(this.game, 800, 450);
        this.samurai = new Samurai(this.game, 700, 355);

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/hero.png");
        this.title = 0;
        this.selection1 = false;
        this.selection2 = false;
        this.selection3 = false;
        const attack = new animator(this.spritesheet, 10 * this.game.HERO_WIDTH, 0, this.game.HERO_WIDTH, this.game.HERO_HEIGHT, 4, 0.06, true);
    }
    update () {
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
        }
        if (this.game.click && this.game.click.y > 5 * PARAMS.BLOCKWIDTH && this.game.click.y < 6.5 * PARAMS.BLOCKWIDTH) {
          this.title = 2;
        }
     }
     // If we are on the Play Title Page.
    else if (this.title == 1) {
        if (this.game.click && this.game.click.y > 1 * PARAMS.BLOCKWIDTH && this.game.click.y < 2 * PARAMS.BLOCKWIDTH) {
            this.selection1 = true;
            this.selection2 = false;
            this.selection3 = false;
          }
        if (this.game.click && this.game.click.y > 3* PARAMS.BLOCKWIDTH && this.game.click.y < 4 * PARAMS.BLOCKWIDTH) {
            this.selection1 = false;
            this.selection2 = true;
            this.selection3 = false;
        }
        if (this.game.click && this.game.click.y > 5 * PARAMS.BLOCKWIDTH && this.game.click.y < 6 * PARAMS.BLOCKWIDTH) {
            this.selection1 = false;
            this.selection2 = false;
            this.selection3 = true;
        }
        if (this.selection1 && this.game.click && this.game.click.y > 2.5 * PARAMS.BLOCKWIDTH && this.game.click.y < 3 * PARAMS.BLOCKWIDTH) {
            this.title = 0;
            this.selection1 = false;
            this.selection2 = false;
            this.selection3 = false;
        }
        if (this.selection2 && this.game.click && this.game.click.y > 4.5 * PARAMS.BLOCKWIDTH && this.game.click.y < 5 * PARAMS.BLOCKWIDTH) {
            this.title = 0;
            this.selection1 = false;
            this.selection2 = false;
            this.selection3 = false;
        }
        if (this.selection3 && this.game.click && this.game.click.y > 6.5 * PARAMS.BLOCKWIDTH && this.game.click.y < 7 * PARAMS.BLOCKWIDTH) {
            this.title = 0;
            this.selection1 = false;
            this.selection2 = false;
            this.selection3 = false;
        }
        if (this.game.click && this.game.click.y > 2 * PARAMS.BLOCKWIDTH && this.game.click.y < 2.5 * PARAMS.BLOCKWIDTH) {
            this.game.camera.load(levelOne, this.wolf);
        }
        if (this.game.click && this.game.click.y > 4 * PARAMS.BLOCKWIDTH && this.game.click.y < 4.5 * PARAMS.BLOCKWIDTH) {
            this.game.camera.load(levelOne, this.orochi);
        }
        if (this.game.click && this.game.click.y > 6 * PARAMS.BLOCKWIDTH && this.game.click.y < 6.5 * PARAMS.BLOCKWIDTH) {
            this.game.camera.load(levelOne, this.samurai);
        }
    }
    this.game.click = null;
}

    draw(ctx) {
        ctx.drawImage(this.images[this.frame], 0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);

        ctx.strokeStyle = "Black"; // Color of the outline
        ctx.lineWidth = 2; // Thickness of the outline

        const x = 8;
        if(this.title == 0) { 
            ctx.font = PARAMS.BLOCKWIDTH + 'px "Press Start 2P"';
            ctx.fillStyle = "White";

            ctx.fillText("Byte Ronin", 6 * PARAMS.BLOCKWIDTH, 2 * PARAMS.BLOCKWIDTH);
            ctx.strokeText("Byte Ronin", 6 * PARAMS.BLOCKWIDTH, 2 * PARAMS.BLOCKWIDTH);

            ctx.font = PARAMS.BLOCKWIDTH/2 + 'px "Press Start 2P"';

            ctx.fillText("PLAY", x * PARAMS.BLOCKWIDTH, 5 * PARAMS.BLOCKWIDTH);
            ctx.strokeText("PLAY", x * PARAMS.BLOCKWIDTH, 5 * PARAMS.BLOCKWIDTH);
            if ((this.game.mouse && this.game.mouse.y > 4 * PARAMS.BLOCKWIDTH && this.game.mouse.y < 5 * PARAMS.BLOCKWIDTH)) {
                ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/hero.png"), 0, 0, 50, 29, (x- 1.5) * PARAMS.BLOCKWIDTH, 4 * PARAMS.BLOCKWIDTH, 125, 75);
            }

            ctx.fillText("UPGRADES", x * PARAMS.BLOCKWIDTH, 6 * PARAMS.BLOCKWIDTH);
            ctx.strokeText("UPGRADES", x * PARAMS.BLOCKWIDTH, 6 * PARAMS.BLOCKWIDTH);
            if ((this.game.mouse && this.game.mouse.y > 5 * PARAMS.BLOCKWIDTH && this.game.mouse.y < 6 * PARAMS.BLOCKWIDTH)) {
                ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/hero.png"), 0, 0, 50, 29, (x- 1.5) * PARAMS.BLOCKWIDTH, 5 * PARAMS.BLOCKWIDTH, 125, 75);;
            }

            ctx.fillText("CONTROLS", x * PARAMS.BLOCKWIDTH, 7 * PARAMS.BLOCKWIDTH);
            ctx.strokeText("CONTROLS", x * PARAMS.BLOCKWIDTH, 7 * PARAMS.BLOCKWIDTH);
            if ((this.game.mouse && this.game.mouse.y > 6 * PARAMS.BLOCKWIDTH && this.game.mouse.y < 7 * PARAMS.BLOCKWIDTH)) {
                ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/hero.png"), 0, 0, 50, 29, (x- 1.5) * PARAMS.BLOCKWIDTH, 6 * PARAMS.BLOCKWIDTH, 125, 75);
            }
            
        } else if (this.title == 1) {
            ctx.font = PARAMS.BLOCKWIDTH/2 + 'px "Press Start 2P"';
            ctx.fillStyle = "White";
            ctx.fillText("Contract I: Cyber Wolf", 5* PARAMS.BLOCKWIDTH, 2 * PARAMS.BLOCKWIDTH);
            ctx.strokeText("Contract I: Cyber Wolf", 5* PARAMS.BLOCKWIDTH, 2 * PARAMS.BLOCKWIDTH);
            if ((this.game.mouse && this.game.mouse.y > 1 * PARAMS.BLOCKWIDTH && this.game.mouse.y < 2 * PARAMS.BLOCKWIDTH)) {
                ctx.fillStyle = "Red";
                ctx.fillText("Contract I: Cyber Wolf", 5 * PARAMS.BLOCKWIDTH, 2 * PARAMS.BLOCKWIDTH);
                ctx.strokeText("Contract I: Cyber Wolf", 5 * PARAMS.BLOCKWIDTH, 2 * PARAMS.BLOCKWIDTH);
            }
            if (this.selection1) {
                ctx.fillStyle = "White";
                ctx.font = PARAMS.BLOCKWIDTH/4 + 'px "Press Start 2P"';
                ctx.fillText("Accept", 7 * PARAMS.BLOCKWIDTH, 2.5 * PARAMS.BLOCKWIDTH);
               
                if ((this.game.mouse && this.game.mouse.y > 2 * PARAMS.BLOCKWIDTH && this.game.mouse.y < 2.5* PARAMS.BLOCKWIDTH)) {
                    ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/hero.png"), 0, 0, 50, 29, (x - 1.8) * PARAMS.BLOCKWIDTH, 2.1 * PARAMS.BLOCKWIDTH, 50, 25);
                }
                ctx.fillText("Return", 7 * PARAMS.BLOCKWIDTH, 3 * PARAMS.BLOCKWIDTH);
               
                if ((this.game.mouse && this.game.mouse.y > 2.5 * PARAMS.BLOCKWIDTH && this.game.mouse.y < 3* PARAMS.BLOCKWIDTH)) {
                    ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/hero.png"), 0, 0, 50, 29, (x - 1.8) * PARAMS.BLOCKWIDTH, 2.6 * PARAMS.BLOCKWIDTH, 50, 25);
                }
               
            }


            ctx.fillStyle = "White";
            ctx.font = PARAMS.BLOCKWIDTH/2 + 'px "Press Start 2P"';
            ctx.fillText("Contract II: Cyber Orochi", 5 * PARAMS.BLOCKWIDTH, 4 * PARAMS.BLOCKWIDTH);
            ctx.strokeText("Contract II: Cyber Orochi", 5 * PARAMS.BLOCKWIDTH, 4 * PARAMS.BLOCKWIDTH);
            if ((this.game.mouse && this.game.mouse.y > 3 * PARAMS.BLOCKWIDTH && this.game.mouse.y < 4 * PARAMS.BLOCKWIDTH)) {
                ctx.fillStyle = "Red";
                ctx.fillText("Contract II: Cyber Orochi", 5 * PARAMS.BLOCKWIDTH, 4 * PARAMS.BLOCKWIDTH);
                ctx.strokeText("Contract II: Cyber Orochi", 5 * PARAMS.BLOCKWIDTH, 4 * PARAMS.BLOCKWIDTH);
            }
            if (this.selection2) {
                ctx.fillStyle = "White";
                ctx.font = PARAMS.BLOCKWIDTH/4 + 'px "Press Start 2P"';

                ctx.fillText("Accept", 7 * PARAMS.BLOCKWIDTH, 4.5 * PARAMS.BLOCKWIDTH);
                if ((this.game.mouse && this.game.mouse.y > 4 * PARAMS.BLOCKWIDTH && this.game.mouse.y < 4.5* PARAMS.BLOCKWIDTH)) {
                    ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/hero.png"), 0, 0, 50, 29, (x - 1.8) * PARAMS.BLOCKWIDTH, 4.1 * PARAMS.BLOCKWIDTH, 50, 25);
                }
                ctx.fillText("Return", 7 * PARAMS.BLOCKWIDTH, 5 * PARAMS.BLOCKWIDTH);
                if ((this.game.mouse && this.game.mouse.y > 4.5 * PARAMS.BLOCKWIDTH && this.game.mouse.y < 5* PARAMS.BLOCKWIDTH)) {
                    ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/hero.png"), 0, 0, 50, 29, (x - 1.8) * PARAMS.BLOCKWIDTH, 4.6 * PARAMS.BLOCKWIDTH, 50, 25);
                }

            }
            ctx.fillStyle = "White";
            ctx.font = PARAMS.BLOCKWIDTH/2 + 'px "Press Start 2P"';
            ctx.fillStyle = "White";
            ctx.fillText("Final Contract: Mecha Samurai", 5 * PARAMS.BLOCKWIDTH, 6* PARAMS.BLOCKWIDTH);
            ctx.strokeText("Final Contract: Mecha Samurai", 5 * PARAMS.BLOCKWIDTH, 6* PARAMS.BLOCKWIDTH);
            if ((this.game.mouse && this.game.mouse.y > 5 * PARAMS.BLOCKWIDTH && this.game.mouse.y < 6 * PARAMS.BLOCKWIDTH)) {
                ctx.fillStyle = "Red";
                ctx.fillText("Final Contract: Mecha Samurai", 5 * PARAMS.BLOCKWIDTH, 6 * PARAMS.BLOCKWIDTH);
                ctx.strokeText("Final Contract: Mecha Samurai", 5 * PARAMS.BLOCKWIDTH, 6* PARAMS.BLOCKWIDTH);
            }

            if (this.selection3) {
                ctx.fillStyle = "White";
                ctx.font = PARAMS.BLOCKWIDTH/4 + 'px "Press Start 2P"';
                ctx.fillText("Accept", 7 * PARAMS.BLOCKWIDTH, 6.5 * PARAMS.BLOCKWIDTH);
                if ((this.game.mouse && this.game.mouse.y > 6 * PARAMS.BLOCKWIDTH && this.game.mouse.y < 6.5* PARAMS.BLOCKWIDTH)) {
                    ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/hero.png"), 0, 0, 50, 29, (x - 1.8) * PARAMS.BLOCKWIDTH, 6.1 * PARAMS.BLOCKWIDTH, 50, 25);
                }
                ctx.fillText("Return", 7 * PARAMS.BLOCKWIDTH, 7 * PARAMS.BLOCKWIDTH);
                if ((this.game.mouse && this.game.mouse.y > 6.5 * PARAMS.BLOCKWIDTH && this.game.mouse.y < 7* PARAMS.BLOCKWIDTH)) {
                    ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/hero.png"), 0, 0, 50, 29, (x - 1.8) * PARAMS.BLOCKWIDTH, 6.6 * PARAMS.BLOCKWIDTH, 50, 25);
                }

            }
        }
    };
}