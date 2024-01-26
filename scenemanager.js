class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.hero = new Hero(this.game, 150, 490);
        this.wolf = new Wolf(this.game, -20, 490),
        this.load(levelOne);
    };

    clearEntities() {
        this.game.entities.forEach(function (entity) {
            entity.removeFromWorld = true;
        });
    };

    /* This method loads everything we see on the canvas.
     * @Params level : takes the games level, which loads the coresponding json object.
     */
    load(level) {
        this.level = level;
        this.game.addEntity(new Background(this.game));
      
        for (let i = 0; i<level.floor1.length; i++) {
            let floorOne = level.floor1[i];
            this.game.addEntity(new Floor1(this.game, floorOne.x, floorOne.y));
        }
        for (let i = 0; i<level.floor2.length; i++) {
            let floorTwo = level.floor2[i];
            this.game.addEntity(new Floor2(this.game, floorTwo.x, floorTwo.y));
        }
        for (let i = 0; i<level.floor3.length; i++) {
            let floorThree = level.floor3[i];
            this.game.addEntity(new Floor3(this.game, floorThree.x, floorThree.y));
        }
        for (let i = 0; i<level.underfloor.length; i++) {
            let underfloor = level.underfloor[i];
            this.game.addEntity(new Underfloor(this.game, underfloor.x, underfloor.y));
        }
        for (let i = 0; i<level.lpillar.length; i++) {
            let pLeft = level.lpillar[i];
            this.game.addEntity(new PillarL(this.game, pLeft.x, pLeft.y));
        }
        for (let i = 0; i<level.rpillar.length; i++) {
            let pRight = level.rpillar[i];
            this.game.addEntity(new PillarR(this.game, pRight.x, pRight.y));
        }
        for (let i = 0; i<level.lplatform.length; i++) {
            let platformL = level.lplatform[i];
            this.game.addEntity(new PlatformL(this.game, platformL.x, platformL.y));
        }
        for (let i = 0; i<level.rplatform.length; i++) {
            let platformR = level.rplatform[i];
            this.game.addEntity(new PlatformR(this.game, platformR.x, platformR.y));
        }
        this.game.addEntity(this.hero);
        this.game.addEntity(this.wolf);
    };

    updateAudio() {
        //todo
    };

    update() {
        let xmidpoint = PARAMS.CANVAS_WIDTH / 2 - PARAMS.BLOCKWIDTH / 2;
        let ymidpoint = PARAMS.CANVAS_HEIGHT / 2 - PARAMS.BLOCKWIDTH / 2;
        this.x = this.hero.x - xmidpoint + PARAMS.BLOCKWIDTH / 2;
        this.y = this.hero.y - ymidpoint + PARAMS.BLOCKWIDTH / 2 - PARAMS.BLOCKWIDTH;

    };

    draw(ctx) {

    };
};