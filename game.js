const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// -----------------------------
// プレイヤー設定
// -----------------------------
let x = 200;
let y = 320;   // 下側スタート
let speed = 5;

const playerImg = new Image();
playerImg.src = "player.png";

// -----------------------------
// 敵キャラ設定
// -----------------------------
const enemyImg = new Image();
enemyImg.src = "enemy.png";

let enemies = [];
let enemyCount = 10;  // ←敵の最初の数（好きに増やせる）

function spawnEnemy() {
  enemies.push({
    x: Math.random() * 360,
    y: Math.random() * 150,
    speedY: 1 + Math.random() * 2
  });
}

for (let i = 0; i < enemyCount; i++) {
  spawnEnemy();
}

// -----------------------------
// 弾設定
// -----------------------------
let bullets = [];

function shoot() {
  bullets.push({
    x: x + 18,    // プレイヤー中央あたり
    y: y,
    speedY: -6   // 上に進む
  });
}

// スペースキーで弾を撃つ
document.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    shoot();
  }
});

// -----------------------------
// 敵の動作
// -----------------------------
function updateEnemies() {
  enemies.forEach((enemy) => {
    enemy.y += enemy.speedY;

    // 下に消えたら上に復活
    if (enemy.y > 400) {
      enemy.y = -40;
      enemy.x = Math.random() * 360;
    }
  });
}

// -----------------------------
// 弾の動作
// -----------------------------
function updateBullets() {
  bullets.forEach((b) => {
    b.y += b.speedY;
  });

  // 範囲外を削除
  bullets = bullets.filter((b) => b.y > -20);
}

// -----------------------------
// 当たり判定（簡易）
// -----------------------------
function checkCollisions() {
  bullets.forEach((b, bIndex) => {
    enemies.forEach((e, eIndex) => {
      if (
        b.x < e.x + 70 &&
        b.x + 5 > e.x &&
        b.y < e.y + 70 &&
        b.y + 10 > e.y
      ) {
        // 敵と弾の削除
        enemies.splice(eIndex, 1);
        bullets.splice(bIndex, 1);

        // 新しい敵を追加
        spawnEnemy();
      }
    });
  });
}

// -----------------------------
// 描画関係
// -----------------------------
function drawPlayer() {
  if (playerImg.complete) {
    ctx.drawImage(playerImg, x, y, 40, 40);
  }
}

function drawEnemies() {
  enemies.forEach((enemy) => {
    if (enemyImg.complete) {
      ctx.drawImage(enemyImg, enemy.x, enemy.y, 70, 70);
    }
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
