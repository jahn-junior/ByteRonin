class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.hero = new Hero(this.game, 150, 650);
        this.load();
    };

    clearEntities() {
        this.game.entities.forEach(function (entity) {
            entity.removeFromWorld = true;
        });
    };

    load() {
        // this.clearEntities();
        this.game.addEntity(new Arena(this.game));
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