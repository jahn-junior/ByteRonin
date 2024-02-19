class SceneManager {
  constructor(game) {
    this.game = game;
    this.game.camera = this;
    this.x = 0;
    this.hero = new Hero(this.game, 150, 300);
    // this.ts = new TitleScreen(this.game);
    // this.title();

    this.boss;
    this.ts = new TitleScreen(this.game);
    this.title();

    // The bosses starting location and object creation is now in titlescreen.js.
    // this.orochi = new Orochi(this.game, 800, 490);
    // this.wolf = new Wolf(this.game, -20, 490);
    // this.samurai = new Samurai(this.game, 700, 300);
    // this.load(levelOne, this.samurai);
  }

  clearEntities() {
    this.game.entities.forEach(function (entity) {
      entity.removeFromWorld = true;
    });
  }
  title() {
    this.game.addEntity(this.ts);
  }
  /* This method loads everything we see on the canvas.
   * @Params level : takes the games level, which loads the coresponding json object.
   */
  load(level, theBoss) {
    this.level = level;
    this.boss = theBoss;
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
  }

  draw(ctx) {}
}
