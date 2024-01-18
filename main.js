
const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./TempBackGround.jpg");

ASSET_MANAGER.downloadAll(() => {
    const gameEngine = new GameEngine();
    const canvas = document.getElementById("gameWorld");
    const ctx = canvas.getContext("2d");

    gameEngine.init(ctx);
    // Create and add the background entity
    const background = new Background(gameEngine, "./TempBackGround.jpg");
    gameEngine.addEntity(background);
    gameEngine.start();
});

