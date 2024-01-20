class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.hero = new Hero(this.game, 150, 500);
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
            let floor = level.floor1[i];
            this.game.addEntity(new Floor1(this.game, floor.x, floor.y));
        }
        for (let i = 0; i<level.pillar1.length; i++) {
            let pillar = level.pillar1[i];
            this.game.addEntity(new Pillar1(this.game, pillar.x, pillar.y));
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