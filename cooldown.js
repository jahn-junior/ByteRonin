class CritCooldown {
    constructor(game, agent, state, unlocked) {
        Object.assign(this, {game, agent, state, unlocked});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/heroAbilities.png");
        this.animations = [];
        this.animations[0] = new animator( // inactive crit icon
            this.spritesheet,
            32,
            0,
            32,
            32,
            1,
            0.08,
            true
        );
        this.animations[1] = new animator( // active crit icon
            this.spritesheet,
            0,
            0,
            32,
            32,
            1,
            0.08,
            true
        );
        this.animations[2] = new animator( // locked crit icon
            this.spritesheet,
            64,
            0,
            32,
            32,
            1,
            0.08,
            true
        );
    };

    update() {

    };

    draw(ctx) {
        if (this.unlocked) {
            this.animations[this.state].drawFrame(
                this.game.clockTick,
                ctx,
                1010,
                675,
                PARAMS.SCALE / 2
            );
            if (this.state == 0) {
                ctx.font = '20px "Press Start 2P", Courier New';
                ctx.fillStyle = "White";
                ctx.fillText(Math.floor(this.agent.critCDDisplay), 1025, 720);
            };
        } else {
            this.animations[2].drawFrame(
                this.game.clockTick,
                ctx,
                1010,
                675,
                PARAMS.SCALE / 2
            );
        }
    };
}

class DashCooldown {
    constructor(game, agent, state) {
        Object.assign(this, {game, agent, state});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/heroAbilities.png");
        this.animations = [];
        this.animations[0] = new animator( // inactive dash icon
            this.spritesheet,
            32,
            32,
            32,
            32,
            1,
            0.08,
            true
        );
        this.animations[1] = new animator( // active dash icon
            this.spritesheet,
            0,
            32,
            32,
            32,
            1,
            0.08,
            true
        );
    };

    update() {

    };

    draw(ctx) {
        this.animations[this.state].drawFrame(
            this.game.clockTick,
            ctx,
            1082,
            675,
            PARAMS.SCALE / 2
        );
        if (this.state == 0) {
            ctx.font = '20px "Press Start 2P", Courier New';
            ctx.fillStyle = "White";
            ctx.fillText(Math.floor(this.agent.dashDisplay), 1105, 720);
        };
    };
}

class OrbitalCooldown {
    constructor(game, agent, state, unlocked) {
        Object.assign(this, {game, agent, state, unlocked});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/heroAbilities.png");
        this.animations = [];
        this.animations[0] = new animator( // inactive orbital icon
            this.spritesheet,
            32,
            64,
            32,
            32,
            1,
            0.08,
            true
        );
        this.animations[1] = new animator( // active orbital icon
            this.spritesheet,
            0,
            64,
            32,
            32,
            1,
            0.08,
            true
        );
        this.animations[2] = new animator( // locked orbital icon
            this.spritesheet,
            64,
            64,
            32,
            32,
            1,
            0.08,
            true
        );
    };

    update() {

    };

    draw(ctx) {
        if (!this.unlocked) {
            this.animations[2].drawFrame(
                this.game.clockTick,
                ctx,
                1154,
                675,
                PARAMS.SCALE / 2
            );
        } else {
            this.animations[this.state].drawFrame(
                this.game.clockTick,
                ctx,
                1154,
                675,
                PARAMS.SCALE / 2
            );
            if (this.state == 0) {
                ctx.font = '20px "Press Start 2P", Courier New';
                ctx.fillStyle = "White";
                ctx.fillText(Math.floor(this.agent.orbDisplay), 1166, 720);
            };
        }
    };
}