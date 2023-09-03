// board
var blockSize = 25;
var rows = 30;
var cols = 30;
var board;
var ctx;

// (1) snake_1
var snake1_X = blockSize * 5;
var snake1_Y = blockSize * 5;
var snake1_velocityX = 0;
var snake1_velocityY = 0;
var snake1_body = [];

// (2) snake_2
var snake2_X = blockSize * 15;
var snake2_Y = blockSize * 15;
var snake2_velocityX = 0;
var snake2_velocityY = 0;
var snake2_body = [];

// (3) food
var foodX;
var foodY;

// gameOver
var gameOver = false;

window.onload = function () {
  board = document.getElementById('board');
  board.height = rows * blockSize;
  board.width = cols * blockSize;
  ctx = board.getContext('2d');

  placeFood();
  document.addEventListener('keyup', snake1_changeDirection);
  document.addEventListener('keyup', snake2_changeDirection);
  setInterval(update, 1000 / 10);
};

function update() {
  // gameOver
  if (gameOver) {
    return;
  }

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, board.width, board.height);

  ctx.fillStyle = 'lime';
  ctx.fillRect(foodX, foodY, blockSize, blockSize);

  if (snake1_X == foodX && snake1_Y == foodY) {
    snake1_body.push([foodX, foodY]);
    placeFood();
  }
  if (snake2_X == foodX && snake2_Y == foodY) {
    snake2_body.push([foodX, foodY]);
    placeFood();
  }

  for (let i = snake1_body.length - 1; i > 0; i--) {
    snake1_body[i] = snake1_body[i - 1];
  }
  if (snake1_body.length) {
    snake1_body[0] = [snake1_X, snake1_Y];
  }
  for (let i = snake2_body.length - 1; i > 0; i--) {
    snake2_body[i] = snake2_body[i - 1];
  }
  if (snake2_body.length) {
    snake2_body[0] = [snake2_X, snake2_Y];
  }

  // snake 1
  ctx.fillStyle = 'Red';
  snake1_X += snake1_velocityX * blockSize;
  snake1_Y += snake1_velocityY * blockSize;
  ctx.fillRect(snake1_X, snake1_Y, blockSize, blockSize);
  for (let i = 0; i < snake1_body.length; i++) {
    ctx.fillRect(snake1_body[i][0], snake1_body[i][1], blockSize, blockSize);
  }

  // snake 2
  ctx.fillStyle = 'blue';
  snake2_X += snake2_velocityX * blockSize;
  snake2_Y += snake2_velocityY * blockSize;
  ctx.fillRect(snake2_X, snake2_Y, blockSize, blockSize);
  for (let i = 0; i < snake2_body.length; i++) {
    ctx.fillRect(snake2_body[i][0], snake2_body[i][1], blockSize, blockSize);
  }

  // gameOver 조건
  if (
    snake1_X < 0 ||
    snake1_X > cols * blockSize ||
    snake1_Y < 0 ||
    snake1_Y > rows * blockSize
  ) {
    gameOver = true;
    alert('파란색 지렁이가 이겼습니다!');
  }
  if (
    snake2_X < 0 ||
    snake2_X > cols * blockSize ||
    snake2_Y < 0 ||
    snake2_Y > rows * blockSize
  ) {
    gameOver = true;
    alert('빨간색 지렁이가 이겼습니다!');
  }

  if (snake1_X == snake2_X && snake1_Y == snake2_Y) {
    gameOver = true;
    alert('무승부 입니다.');
  }

  for (let i = 0; i < snake1_body.length; i++) {
    if (snake1_X == snake1_body[i][0] && snake1_Y == snake1_body[i][1]) {
      gameOver = true;
      alert('1파란색 지렁이가 이겼습니다!');
    }
  }
  for (let i = 0; i < snake1_body.length; i++) {
    if (snake2_X == snake1_body[i][0] && snake2_Y == snake1_body[i][1]) {
      gameOver = true;
      alert('2빨간색 지렁이가 이겼습니다!');
    }
  }
  for (let i = 0; i < snake2_body.length; i++) {
    if (snake1_X == snake2_body[i][0] && snake1_Y == snake2_body[i][1]) {
      gameOver = true;
      alert('3파란색 지렁이가 이겼습니다!');
    }
  }
  for (let i = 0; i < snake2_body.length; i++) {
    if (snake2_X == snake2_body[i][0] && snake2_Y == snake2_body[i][1]) {
      gameOver = true;
      alert('4빨간색 지렁이가 이겼습니다!');
    }
  }
}

// util functions
function placeFood() {
  foodX = Math.floor(Math.random() * cols) * blockSize;
  foodY = Math.floor(Math.random() * rows) * blockSize;
}

function snake1_changeDirection(e) {
  if (e.code == 'ArrowUp' && snake1_velocityY != 1) {
    snake1_velocityX = 0;
    snake1_velocityY = -1;
  } else if (e.code == 'ArrowDown' && snake1_velocityY != -1) {
    snake1_velocityX = 0;
    snake1_velocityY = 1;
  } else if (e.code == 'ArrowLeft' && snake1_velocityX != 1) {
    snake1_velocityX = -1;
    snake1_velocityY = 0;
  } else if (e.code == 'ArrowRight' && snake1_velocityX != -1) {
    snake1_velocityX = 1;
    snake1_velocityY = 0;
  }
}

function snake2_changeDirection(e) {
  if (e.code == 'KeyW' && snake2_velocityY != 1) {
    snake2_velocityX = 0;
    snake2_velocityY = -1;
  } else if (e.code == 'KeyS' && snake2_velocityY != -1) {
    snake2_velocityX = 0;
    snake2_velocityY = 1;
  } else if (e.code == 'KeyA' && snake2_velocityX != 1) {
    snake2_velocityX = -1;
    snake2_velocityY = 0;
  } else if (e.code == 'KeyD' && snake2_velocityX != -1) {
    snake2_velocityX = 1;
    snake2_velocityY = 0;
  }
}
