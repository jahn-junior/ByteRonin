class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.hero = new Hero(this.game, 150, 490);
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
        this.game.addEntity(this.hero);
    };

    updateAudio() {
        //todo
    };

    update() {  
       let midpoint = PARAMS.CANVAS_WIDTH/2 - PARAMS.BLOCKWIDTH / 2;
       this.x = this.hero.x - midpoint + PARAMS.BLOCKWIDTH;
    };

    draw(ctx) {
    
    };
};