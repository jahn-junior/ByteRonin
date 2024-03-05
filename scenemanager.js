class SceneManager {
  constructor(game) {
    this.game = game;
    this.game.camera = this;
    this.x = 0;
    this.hero = new Hero(this.game, 150, 300);
    this.boss;
    this.bossSet = 0;
    this.ts = new TitleScreen(this.game);
    this.gameover = new GameOver(this.game);
    this.winscreen = null;
    this.title();
  }

  clearEntities() {
    this.game.entities.forEach(function (entity) {
      entity.removeFromWorld = true;
    });
  }
  title() {
    this.clearEntities();
    this.game.addEntity(this.ts);
  }
  /* This method loads everything we see on the canvas.
   * @Params level : takes the games level, which loads the coresponding json object.
   */
  load(level, theBoss) {
    this.level = level;
    this.boss = theBoss;
    this.bossSet = 1;
    this.clearEntities();
    this.game.bosses.push(this.boss);
    this.game.addEntity(new Background(this.game));

    if (level.floor1) {
      for (let i = 0; i < level.floor1.length; i++) {
        let floorOne = level.floor1[i];
        let tile = new Floor1(this.game, floorOne.x, floorOne.y);
        this.game.addEntity(tile);
        this.game.addStageTile(tile);
      }
    }
    if (level.floor2) {
      for (let i = 0; i < level.floor2.length; i++) {
        let floorTwo = level.floor2[i];
        let tile = new Floor2(this.game, floorTwo.x, floorTwo.y);
        this.game.addEntity(tile);
        this.game.addStageTile(tile);
      }
    }
    if (level.floor3) {
      for (let i = 0; i < level.floor3.length; i++) {
        let floorThree = level.floor3[i];
        let tile = new Floor3(this.game, floorThree.x, floorThree.y);
        this.game.addEntity(tile);
        this.game.addStageTile(tile);
      }
    }
    if (level.underfloor) {
      for (let i = 0; i < level.underfloor.length; i++) {
        let underfloor = level.underfloor[i];
        let tile = new Underfloor(this.game, underfloor.x, underfloor.y);
        this.game.addEntity(tile);
        this.game.addStageTile(tile);
      }
    }
    if (level.lpillar) {
      for (let i = 0; i < level.lpillar.length; i++) {
        let pLeft = level.lpillar[i];
        let tile = new PillarL(this.game, pLeft.x, pLeft.y);
        this.game.addEntity(tile);
        this.game.addStageTile(tile);
      }
    }
    if (level.rpillar) {
      for (let i = 0; i < level.rpillar.length; i++) {
        let pRight = level.rpillar[i];
        let tile = new PillarR(this.game, pRight.x, pRight.y);
        this.game.addEntity(tile);
        this.game.addStageTile(tile);
      }
    }
    if (level.lplatform) {
      for (let i = 0; i < level.lplatform.length; i++) {
        let platformL = level.lplatform[i];
        let tile = new PlatformL(this.game, platformL.x, platformL.y);
        this.game.addEntity(tile);
        this.game.addStageTile(tile);
      }
    }
    if (level.rplatform) {
      for (let i = 0; i < level.rplatform.length; i++) {
        let platformR = level.rplatform[i];
        let tile = new PlatformR(this.game, platformR.x, platformR.y);
        this.game.addEntity(tile);
        this.game.addStageTile(tile);
      }
    }
    if (level.music) {
      ASSET_MANAGER.pauseBackgroundMusic();
      ASSET_MANAGER.playAsset(level.music);
    }

    this.game.addEntity(this.boss);
    this.game.addEntity(this.hero);
  }

  updateAudio() {
    var mute = document.getElementById("mute").checked;
    var volume = document.getElementById("volume").value;

    ASSET_MANAGER.muteAudio(mute);
    ASSET_MANAGER.adjustVolume(volume);
  }

  update() {
    let xmidpoint = PARAMS.CANVAS_WIDTH / 2 - PARAMS.BLOCKWIDTH / 2;
    let ymidpoint = PARAMS.CANVAS_HEIGHT / 2 - PARAMS.BLOCKWIDTH / 2;
    this.x = this.hero.x - xmidpoint + PARAMS.BLOCKWIDTH / 2;
    this.y = this.hero.y - ymidpoint + PARAMS.BLOCKWIDTH / 2 - PARAMS.BLOCKWIDTH;
    this.updateAudio();

    // Logic for when a boss dies.
    if (this.bossSet) {
      if (this.boss.playWinScreen) {
        this.boss.playWinScreen = false;
        this.clearEntities();
        this.game.clearStageTile();

        if (this.boss.title == "Cyberhydraic Maiden") {
          this.game.addEntity(new WinScreenTwo(this.game));
          this.hero = new Hero(this.game, 150, 300);
          this.game.hero.powerUpTwo = 1;
        } else if (this.boss.title == "Nano Shogun") {
          this.hero = new Hero(this.game, 150, 300);
          this.game.addEntity(new WinScreenThree(this.game));
        } else {
          this.game.addEntity(new WinScreenOne(this.game));
          this.hero = new Hero(this.game, 150, 300);
          this.game.hero.powerUpOne = 1;
        }
      }
    }

    // Logic for when hero dies. Lets expand on this.
    if (this.game.hero.gameover) {
      this.game.hero.gameover = false;
      this.clearEntities();
      this.game.addEntity(new GameOver(this.game));
      this.game.clearStageTile();
      this.hero = new Hero(this.game, 150, 300);
    }
  }

  draw(ctx) {}
}
