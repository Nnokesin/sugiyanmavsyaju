const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// -----------------------------
// 背景設定（無限スクロール）
// -----------------------------
const bgImg = new Image();
bgImg.src = "background.png";  // ← 追加した背景画像名
let bgY1 = 0;
let bgY2 = -400;   // canvas高さと同じにする（400）

function drawBackground() {
  ctx.drawImage(bgImg, 0, bgY1, 400, 400);
  ctx.drawImage(bgImg, 0, bgY2, 400, 400);

  // 下方向へスクロール
  bgY1 += 2;
  bgY2 += 2;

  // 1枚目が下に抜けたらリセット
  if (bgY1 >= 400) {
    bgY1 = -400;
  }
  if (bgY2 >= 400) {
    bgY2 = -400;
  }
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
// 敵
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

for (let i = 0; i < enemyCount; i++) {
  spawnEnemy();
}

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
    speedY: -6
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    shoot();
  }
});

function updateBullets() {
  bullets.forEach((b) => {
    b.y += b.speedY;
  });

  bullets = bullets.filter((b) => b.y > -20);
}

// -----------------------------
// 当たり判定
// -----------------------------
function checkCollisions() {
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
      }
    });
  });
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

// -----------------------------
// メインループ
// -----------------------------
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();
  drawPlayer();
  drawEnemies();
  drawBullets();

  updateEnemies();
  updateBullets();
  checkCollisions();

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
});
