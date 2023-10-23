// game.js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.font = "20px Arial";
let maxHealth = 1;

let score = 0;

// Updates the score display on the page.
function updateScoreDisplay() {
  const scoreElement = document.getElementById("scoreDisplay");
  scoreElement.textContent = "Score: " + score;
}

// Generates an enemy at a random x position and with random speed.
function generateEnemy() {
  const enemyWidth = 40;
  const enemySpeed = (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random() * 3); // Random speed between 2 and 5
  const enemy = {
    x: Math.random() * (canvas.width - enemyWidth),
    y: 30,
    width: enemyWidth,
    health: Math.floor(Math.random() * maxHealth) + 1,
    height: 40,
    speed: enemySpeed,
    hitBy: [], // Initialize hitBy as an empty array for every new enemy
  };
  enemies.push(enemy);
}

function playerEnemyCollision(player, enemy) {
  return (
    player.x < enemy.x + enemy.width &&
    player.x + player.width > enemy.x &&
    player.y < enemy.y + enemy.height &&
    player.y + player.height > enemy.y
  );
}
let isGameOver = false; // A flag to indicate game status

// Increment maxHealth every minute.
setInterval(() => {
  maxHealth += 1;
}, 1000); // 60000ms is equal to 1 minute.

// We'll use setInterval to generate enemies periodically.
setInterval(generateEnemy, 2000); // Generate an enemy every 2 seconds.

function isInReloadZone(enemy) {
  return enemy.x < reloadZone.width + 10;
}

function handleCollisions() {
  for (let i = 0; i < player.bullets.length; i++) {
    const laser = player.bullets[i];

    for (let j = enemies.length - 1; j >= 0; j--) {
      const enemy = enemies[j];

      // Ensure the enemy has the hitBy array
      if (!enemy.hitBy) {
        enemy.hitBy = [];
      }

      // Check if any part of the laser intersects with the enemy
      if (
        laser.x > enemy.x &&
        laser.x < enemy.x + enemy.width &&
        ((laser.y > enemy.y && laser.y < enemy.y + enemy.height) ||
          (0 < enemy.y + enemy.height && 0 > enemy.y) || // Top of the canvas intersects with enemy
          (laser.y > enemy.y && laser.y - canvas.height < enemy.y)) &&
        !isInReloadZone(enemy) // Check if enemy is not in the reload zone
      ) {
        // Check if the bullet has already hit this enemy
        if (!enemy.hitBy.includes(laser)) {
          enemy.hitBy.push(laser);
          enemy.health--;

          if (enemy.health <= 0) {
            score += 10;
            updateScoreDisplay();
            enemies.splice(j, 1);
          }
        }
      }
    }
  }
}
function lineRectCollide(x1, y1, x2, y2, rx, ry, rw, rh) {
  // Check top edge
  if (lineLineCollide(x1, y1, x2, y2, rx, ry, rx + rw, ry)) return true;
  // Check bottom edge
  if (lineLineCollide(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh))
    return true;
  // Check left edge
  if (lineLineCollide(x1, y1, x2, y2, rx, ry, rx, ry + rh)) return true;
  // Check right edge
  if (lineLineCollide(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh))
    return true;
  return false;
}

function lineLineCollide(x1, y1, x2, y2, x3, y3, x4, y4) {
  const uA =
    ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  const uB =
    ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  return uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1;
}

const player = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  width: 30,
  height: 30,
  mouseX: canvas.width / 2, // Default to center
  mouseY: canvas.height / 2,
  isShooting: false,
  maxBullets: 10,
  currentBullets: 10,
  speed: 7,
  bullets: [],
  shoot() {
    this.isShooting = true;
    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 2, this.y);
    ctx.lineTo(
      this.x + this.width / 2 + unitX * canvas.height,
      this.y + unitY * canvas.height
    );
    ctx.stroke();

    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 2, this.y);
    ctx.lineTo(this.x + this.width / 2, 0);
    ctx.stroke();

    for (const enemy of enemies) {
      if (
        enemy.x < this.x + this.width / 2 &&
        enemy.x + enemy.width > this.x + this.width / 2
      ) {
        enemy.health -= 1; // Decrease health by 1
        enemy.health = Math.max(enemy.health, 0); // Ensure health doesn't go below 0

        if (enemy.health === 0) {
          const index = enemies.indexOf(enemy);
          enemies.splice(index, 1);
          score += 10;
          updateScoreDisplay();
        }
      }
    }
    if (this.currentBullets > 0) {
      this.bullets.push({ x: this.x + this.width / 2, y: this.y });
      this.currentBullets--;
    }
  },
};

const reloadZone = {
  x: 0,
  y: 0,
  width: 50,
  height: canvas.height,
};

const enemies = [
  {
    x: canvas.width / 4,
    y: 30,
    width: 40,
    height: 40,
    speed: 2,
    health: Math.floor(Math.random() * maxHealth) + 1,
    hitBy: [],
  },
  {
    x: (canvas.width * 3) / 4,
    y: 30,
    width: 40,
    height: 40,
    speed: -2,
    health: Math.floor(Math.random() * maxHealth) + 1,
  },
];

function drawPlayer() {
  ctx.fillStyle = "green";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawEnemies() {
  for (const enemy of enemies) {
    // Draw enemy rectangle
    ctx.fillStyle = "red";
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

    // Draw enemy health
    ctx.fillStyle = "white";
    ctx.textAlign = "center"; // this will center the text
    ctx.textBaseline = "middle"; // this will center the text vertically
    ctx.fillText(
      enemy.health.toString(),
      enemy.x + enemy.width / 2,
      enemy.y + enemy.height / 2
    );
  }
}
function drawArrowToMouse() {
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(player.x + player.width / 2, player.y);
  ctx.lineTo(player.mouseX, player.mouseY);
  ctx.stroke();
}

canvas.addEventListener("mousemove", function (e) {
  const rect = canvas.getBoundingClientRect();
  player.mouseX = e.clientX - rect.left;
  player.mouseY = e.clientY - rect.top;
});

function drawBullets() {
  ctx.strokeStyle = "yellow";
  ctx.lineWidth = 5;

  for (const bullet of player.bullets) {
    ctx.beginPath();
    ctx.moveTo(bullet.x, bullet.y);
    ctx.lineTo(
      bullet.x + bullet.unitX * canvas.height,
      bullet.y + bullet.unitY * canvas.height
    );
    ctx.stroke();
    bullet.x += bullet.unitX * 5; // 5 is the speed multiplier
    bullet.y += bullet.unitY * 5;
  }
}
document.addEventListener("click", () => {
  player.shoot();
});

function update() {
  if (isGameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (player.movingLeft && player.x > 0) {
    player.x -= player.speed;
  }
  if (player.movingRight && player.x + player.width < canvas.width) {
    player.x += player.speed;
  }
  if (playerInReloadZone()) {
    player.currentBullets = player.maxBullets;
  }
  for (const bullet of player.bullets) {
    bullet.x += bullet.unitX * 5; // 5 is the speed multiplier
    bullet.y += bullet.unitY * 5;
  }

  for (const enemy of enemies) {
    enemy.x += enemy.speed;
    if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
      enemy.speed = -enemy.speed;
      enemy.y += 40; // Move down a bit
    }
  }

  drawPlayer();
  drawEnemies();
  drawBullets();
  drawArrowToMouse();

  drawReloadZone();

  handleCollisions();

  // ... (rest of the code remains unchanged)

  // Check for collisions between player and enemies
  for (const enemy of enemies) {
    if (playerEnemyCollision(player, enemy)) {
      isGameOver = true;
      displayGameOverScreen();
      return;
    }
  }
  requestAnimationFrame(update);
}
function displayGameOverScreen() {
  // Clear the entire canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set the font properties
  ctx.font = "40px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Set the fill color to red
  ctx.fillStyle = "red";

  // Display the "You Lose" text in the center of the canvas
  ctx.fillText("play again", canvas.width / 2, canvas.height / 2 - 50);

  // Show the play again button
  document.getElementById("playAgainBtn").style.display = "block"; // Show the 'Play Again' button
}
document.getElementById("playAgainBtn").addEventListener("click", function () {
  resetGame(); // You'll need to implement this function in your game.js script.
  document.getElementById("playAgainBtn").style.display = "none"; // Hide the 'Play Again' button after it's clicked
});
function resetGame() {
  location.reload(); // Reloads the current page
}

function drawReloadZone() {
  ctx.fillStyle = "rgba(0, 0, 255, 0.3)"; // Semi-transparent blue
  ctx.fillRect(reloadZone.x, reloadZone.y, reloadZone.width, reloadZone.height);

  // Set a smaller font size for the bullets text
  ctx.font = "15px Arial";
  ctx.fillStyle = "white";

  // Adjust the position if needed
  ctx.font = "15px Arial";
  ctx.textAlign = "center"; // Center the text horizontally
  ctx.textBaseline = "middle"; // Center the text vertically
  ctx.fillStyle = "white";

  // Set the coordinates to the center of the canvas
  ctx.fillText(
    `Bullets: ${player.currentBullets}`,
    canvas.width / 2,
    canvas.height / 2
  );
}

function playerInReloadZone() {
  return player.x < reloadZone.width;
}
document.addEventListener("keydown", (e) => {
  if (e.key === "a") player.movingLeft = true;
  if (e.key === "d") player.movingRight = true;
});
player.shoot = function () {
  this.isShooting = true;

  // Check if the player is in the reload zone, if yes, return early without shooting
  if (playerInReloadZone()) {
    return;
  }

  // Check if the player is out of bullets
  if (this.currentBullets <= 0) return;

  const dirX = this.mouseX - (this.x + this.width / 2);
  const dirY = this.mouseY - this.y;
  const len = Math.sqrt(dirX * dirX + dirY * dirY);
  const unitX = dirX / len;
  const unitY = dirY / len;

  const laserEndX = this.x + this.width / 2 + unitX * canvas.height;
  const laserEndY = this.y + unitY * canvas.height;

  ctx.strokeStyle = "yellow";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(this.x + this.width / 2, this.y);
  ctx.lineTo(laserEndX, laserEndY);
  ctx.stroke();

  for (const enemy of enemies) {
    if (
      lineRectCollide(
        this.x + this.width / 2,
        this.y,
        laserEndX,
        laserEndY,
        enemy.x,
        enemy.y,
        enemy.width,
        enemy.height
      )
    ) {
      enemy.health -= 1;
      if (enemy.health <= 0) {
        const index = enemies.indexOf(enemy);
        enemies.splice(index, 1);
        score += 10;
        updateScoreDisplay();
      }
    }
  }

  this.bullets.push({ x: this.x + this.width / 2, y: this.y, unitX, unitY });
  this.currentBullets--;
};

document.addEventListener("keyup", (e) => {
  if (e.key === "a") player.movingLeft = false;
  if (e.key === "d") player.movingRight = false;
});

update();

// game.js
let isIndexContent = true; // By default, we're on the index.html content

document
  .getElementById("switchContentBtn")
  .addEventListener("click", function () {
    if (isIndexContent) {
      fetch("about.html")
        .then((response) => response.text())
        .then((data) => {
          document.body.innerHTML = data;
          document.body.insertAdjacentHTML(
            "beforeend",
            '<button id="switchContentBtn">Switch Content</button>'
          );
          addSwitchEventListener(); // Re-add the event listener
          isIndexContent = false;
        });
    } else {
      location.reload(); // Reload the page to return to the index.html content
    }
  });

function addSwitchEventListener() {
  document
    .getElementById("switchContentBtn")
    .addEventListener("click", function () {
      if (isIndexContent) {
        fetch("about.html")
          .then((response) => response.text())
          .then((data) => {
            document.body.innerHTML = data;
            document.body.insertAdjacentHTML(
              "beforeend",
              '<button id="switchContentBtn">Switch Content</button>'
            );
            addSwitchEventListener(); // Re-add the event listener
            isIndexContent = false;
          });
      } else {
        location.reload(); // Reload the page to return to the index.html content
      }
    });
}
