const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;  


// -----------------------------
// 背景（無限スクロール）
// -----------------------------
const bgImg = new Image();
bgImg.src = "background.png";

let bgY1 = 0;
let bgY2 = -400;

function drawBackground() {
  ctx.drawImage(bgImg, 0, bgY1, 400, 400);
  ctx.drawImage(bgImg, 0, bgY2, 400, 400);

  bgY1 += 2;
  bgY2 += 2;

  if (bgY1 >= 400) bgY1 = -400;
  if (bgY2 >= 400) bgY2 = -400;
    // スコア表示
    ctx.fillStyle = "yellow";
    ctx.font = "20px Arial";
    ctx.fillText("桜ポイント: " + score, 10, 30);
}

// -----------------------------
// プレイヤー
// -----------------------------
let x = 180;
let y = 320;
let speed = 5;

const playerImg = new Image();
playerImg.src = "player.png";

// -----------------------------
// 通常の敵（雑魚）
// -----------------------------
const enemyImg = new Image();
enemyImg.src = "enemy.png";

let enemies = [];
let enemyCount = 5;

function spawnEnemy() {
  enemies.push({
    x: Math.random() * 360,
    y: Math.random() * -200,
    speedY: 1 + Math.random() * 2
  });
}

for (let i = 0; i < enemyCount; i++) spawnEnemy();

function updateEnemies() {
  enemies.forEach((e) => {
    e.y += e.speedY;

    if (e.y > 420) {
      e.y = -40;
      e.x = Math.random() * 360;
    }
  });
}

// -----------------------------
// 弾
// -----------------------------
let bullets = [];

function shoot() {
  bullets.push({
    x: x + 18,
    y: y,
    speedY: -7
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === " ") shoot();
});

function updateBullets() {
  bullets.forEach((b) => b.y += b.speedY);
  bullets = bullets.filter((b) => b.y > -20);
}

// -----------------------------
// ボス設定
// -----------------------------
const bossImg = new Image();
bossImg.src = "boss.png";   // ← 追加したボス画像を用意してね

let boss = {
  x: 120,
  y: -200,           // 上から登場
  width: 160,
  height: 160,
  speedY: 1,
  HP: 50,            // ボスのHP
  alive: false,
  appearTime: 600    // この時間(フレーム)後に出現
};

let frame = 0;

function updateBoss() {
  if (!boss.alive) return;

  // 登場演出（上から降りてくる）
  if (boss.y < 40) {
    boss.y += boss.speedY;
  }
}

// -----------------------------
// 当たり判定（弾 vs 敵 / ボス）
// -----------------------------
function checkCollisions() {

  // ---- 雑魚敵との衝突 ----
  bullets.forEach((b, bi) => {
    enemies.forEach((e, ei) => {
      if (
        b.x < e.x + 40 &&
        b.x + 5 > e.x &&
        b.y < e.y + 40 &&
        b.y + 10 > e.y
      ) {
        enemies.splice(ei, 1);
        bullets.splice(bi, 1);
        spawnEnemy();
        score += 1;
      }
    });
  });

  // ---- ボスと弾の衝突 ----
  if (boss.alive) {
    bullets.forEach((b, bi) => {
      if (
        b.x < boss.x + boss.width &&
        b.x + 5 > boss.x &&
        b.y < boss.y + boss.height &&
        b.y + 10 > boss.y
      ) {
        bullets.splice(bi, 1);
        boss.HP -= 1;

        if (boss.HP <= 0) {
          boss.alive = false;
          alert("クソ桜撃破！！");
          score += 10;
        }
      }
    });
  }
}

// -----------------------------
// 描画
// -----------------------------
function drawPlayer() {
  ctx.drawImage(playerImg, x, y, 40, 40);
}

function drawEnemies() {
  enemies.forEach((e) => {
    ctx.drawImage(enemyImg, e.x, e.y, 40, 40);
  });
}

function drawBullets() {
  ctx.fillStyle = "yellow";
  bullets.forEach((b) => {
    ctx.fillRect(b.x, b.y, 5, 10);
  });
}

function drawBoss() {
  if (boss.alive) {
    ctx.drawImage(bossImg, boss.x, boss.y, boss.width, boss.height);

    // HPバー
    ctx.fillStyle = "red";
    ctx.fillRect(boss.x, boss.y - 10, boss.width * (boss.HP / 50), 5);

    ctx.strokeStyle = "black";
    ctx.strokeRect(boss.x, boss.y - 10, boss.width, 5);


  }
}

// -----------------------------
// メインループ
// -----------------------------
function draw() {
  frame++;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();
  drawPlayer();
  drawEnemies();
  drawBullets();
  drawBoss();

  updateEnemies();
  updateBullets();
  checkCollisions();
  updateBoss();

  // 一定時間後にボス出現
  if (frame === boss.appearTime) {
    boss.alive = true;
  }

  requestAnimationFrame(draw);
}

draw();

// -----------------------------
// プレイヤー移動
// -----------------------------
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") x -= speed;
  if (e.key === "ArrowRight") x += speed;
  if (e.key === "ArrowUp") y -= speed;
  if (e.key === "ArrowDown") y += speed;
  if (collision(player, enemy)) {
    score -= 1;
}
});
