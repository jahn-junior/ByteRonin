
const ASSET_MANAGER = new AssetManager();

<<<<<<< HEAD
ASSET_MANAGER.queueDownload("./sprites/hero.png")

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;
	gameEngine.init(ctx);

	gameEngine.addEntity(new hero(gameEngine));
	gameEngine.start();
=======
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
>>>>>>> halim
});

