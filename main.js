const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./map/background.png")
ASSET_MANAGER.queueDownload("./sprites/hero.png")

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;
	gameEngine.init(ctx);

	gameEngine.addEntity(new Hero(gameEngine));
	gameEngine.addEntity(new Arena(gameEngine));
	gameEngine.start();
});
