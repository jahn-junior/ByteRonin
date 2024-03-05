class HealthBar {
  constructor(agent) {
    Object.assign(this, { agent });
  }

  update() {}

  draw(ctx) {
    var ratio = this.agent.currentHealth / this.agent.maxHealth;
    ctx.strokeStyle = "White";
    ctx.lineWidth = 2;
    ctx.fillStyle = "#262626";
    ctx.fillRect(402, 677.5, 595, 35);
    ctx.fillStyle = ratio < 0.2 ? "#e02d19" : ratio < 0.5 ? "#f7eb00" : "#00f719";
    ctx.strokeRect(400, 675, 600, 40);
    ctx.fillRect(402, 677.5, 595 * ratio, 35);
    ctx.font = '17px "Press Start 2P", Courier New';
    ctx.fillStyle = "White";
    ctx.fillText(Math.floor(this.agent.currentHealth) + "/" + this.agent.maxHealth, 805, 705);
    ctx.fillText("Health", 410, 705);
  }
}

class BossHealthBar {
  constructor(agent) {
    Object.assign(this, { agent });
  }

  update() {}

  draw(ctx) {
    var ratio = this.agent.currentHealth / this.agent.maxHealth;
    ctx.strokeStyle = "White";
    ctx.strokeRect(180, 40, 1000, 40);
    ctx.fillStyle = "#262626";
    ctx.fillRect(182, 42.5, 995, 35);
    ctx.fillStyle = "#e02d19";
    ctx.fillRect(182, 42.5, 995 * ratio, 35);
    ctx.fillStyle = "White";
    ctx.font = '17px "Press Start 2P", Courier New';
    ctx.fillText(this.agent.title, 190, 70);
    ctx.fillText(Math.floor(this.agent.currentHealth), 1050, 70);
  }
}

class Score {
  constructor(game, x, y, score, isCrit) {
    Object.assign(this, { game, x, y, score, isCrit });
    this.velocity = -32;
    this.elapsed = 0;
  }

  update() {
    this.elapsed += this.game.clockTick;
    if (this.isCrit == false) {
      if (this.elapsed > 0.5) {
        this.removeFromWorld = true;
      }
    } else {
      if (this.elapsed > 1.5) {
        this.removeFromWorld = true;
      }
    }
    this.y += this.velocity * this.game.clockTick;
  }

  draw(ctx) {
    if (this.isCrit == false) {
      ctx.font = '35px "Press Start 2P"';
      ctx.strokeStyle = "Black";
      ctx.fillStyle = "White";
      ctx.fillText(Math.floor(this.score), this.x, this.y);
      ctx.strokeText(Math.floor(this.score), this.x, this.y);
    } else {
      ctx.strokeStyle = "#8c40ff";
      ctx.fillStyle = "#17ffd8";

      ctx.font = '25px "Press Start 2P"';
      ctx.fillText("  CRIT!", this.x, this.y - 50);
      ctx.strokeText("  CRIT!", this.x, this.y - 50);

      ctx.font = '45px "Press Start 2P"';
      ctx.fillText(Math.floor(this.score), this.x, this.y);
      ctx.strokeText(Math.floor(this.score), this.x, this.y);
    }
  }
}
