document.addEventListener('DOMContentLoaded', () => {
  // SETUP layout variables
  const grid = document.getElementById('grid');
  const scoreDisplay = document.getElementById('score');
  const pacdotDisplay = document.getElementById('pacdotNumber');
  const width = 28; // 28 x 28 = 784
  const restartButton = document.getElementById('restartButton');
  restartButton.addEventListener('click', startGame);

  const pacAvatar = document.getElementById('pacman');

  // SETUP dynamic variables
  let score = 0;
  let pacmanCurrentIndex = 0;
  let pacdotNumber = 0;
  let pacmanCoordinates = [];
  let currentDirection = 'left';
  let nextDirection = currentDirection;

  //  LAYOUT
  // prettier-ignore
  const layout = [
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1,
    1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1,
    1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,
    1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,1,1,2,2,1,1,1,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
    4,4,4,4,4,4,0,0,0,4,1,1,1,1,1,1,1,1,4,0,0,0,4,4,4,4,4,4,
    1,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,4,4,4,4,1,1,4,4,4,4,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,3,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,3,1,
    1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
    1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
    1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,
    1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
    1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
  ]
  // 0 - pac-dots
  // 1 - wall
  // 2 - ghost-lair
  // 3 - power-pellet
  // 4 - empty

  const squares = [];

  // CREATE BOARD FROM LAYOUT
  function createBoard() {
    console.log('createBoard executed');

    for (let i = 0; i < layout.length; i++) {
      const square = document.createElement('div');
      grid.appendChild(square);
      squares.push(square);

      switch (layout[i]) {
        case 0:
          squares[i].classList.add('pac-dot', i);
          break;
        case 1:
          squares[i].classList.add('wall');
          break;
        case 2:
          squares[i].classList.add('ghost-lair', i);
          break;
        case 3:
          squares[i].classList.add('power-pellet');
          break;
      }
    }
  }

  // createBoard();
  // GHOSTS
  class Ghost {
    constructor(name, startIndex, speed) {
      this.name = name;
      this.startIndex = startIndex;
      this.speed = speed;
      this.currentIndex = startIndex;
      this.timerId = NaN;
      this.isScared = false;
    }
  }

  startGame();

  // Move pacman avatar
  function moveAvatar(coordinates) {
    let x = coordinates[0] * 20;
    let y = coordinates[1] * 20;

    pacAvatar.style.transform =
      'translateX(' + x + 'px) translateY(' + y + 'px)';
  }

  // Get X and Y coordinates
  function getCoordinates(index) {
    return (pacmanCoordinates = [index % width, Math.floor(index / width)]);
  }

  // Auto move Pacman
  function autoMovePacman() {
    setInterval(() => {
      // set currentDirection (default is left)
      // set nextDirection (default = currentDirection, change on keydown)

      // resolveDirection(nextDirection) -- use function with switch/case => return nextIndex
      resolveDirection(nextDirection);

      // check is nextIndex allowed
      if (!allowedMove(nextIndex)) {
        // --> NOT allowed -> resolveDirection(currentDirection) => return nextIndex
        resolveDirection(currentDirection);
        // check is nextIndex allowed
        if (!allowedMove(nextIndex)) {
          // --> NOT allowed -> STOP (return currentIndex)
          return;
          // --> IS allowed -> MOVE (currentIndex = nextIndex)
        } else {
          move(nextIndex);
        }
        // --> IS allowed -> MOVE (currentIndex = nextIndex) + currentDirection = nextDirection;
      } else {
        move(nextIndex);
        currentDirection = nextDirection;
      }

      pacdotEaten(pacmanCurrentIndex);
      powerPelletEaten(pacmanCurrentIndex);

      getCoordinates(pacmanCurrentIndex);

      console.log(pacmanCoordinates);
      moveAvatar(pacmanCoordinates);

      // Ghost encounter
      ghosts.forEach((ghost) => {
        if (ghost.currentIndex === pacmanCurrentIndex) {
          if (ghost.isScared) {
            killGhost(ghost);
          } else gameOver();
        }
      });

      // REPEAT
    }, 200);
  }

  function move(nextIndex) {
    squares[pacmanCurrentIndex].classList.remove('pacman-index');
    squares[nextIndex].classList.add('pacman-index');
    pacmanCurrentIndex = nextIndex;
  }

  function resolveDirection(direction) {
    switch (direction) {
      // Left: check if on left edge (28 / 28 = 1, modulo 0)
      case 'left':
        if (pacmanCurrentIndex % width !== 0) {
          nextIndex = pacmanCurrentIndex - 1;
        }
        break;
      case 'up':
        if (pacmanCurrentIndex - width >= 0) {
          nextIndex = pacmanCurrentIndex - width;
        }
        break;
      case 'right':
        if (pacmanCurrentIndex % width < width - 1) {
          nextIndex = pacmanCurrentIndex + 1;
        }
        break;
      case 'down':
        if (pacmanCurrentIndex + width < width * width) {
          nextIndex = pacmanCurrentIndex + width;
        }
        break;
    }
    return nextIndex;
  }

  function changeDirection(e) {
    switch (e.keyCode) {
      case 37:
        nextDirection = 'left';
        break;

      // Up
      case 38:
        nextDirection = 'up';
        break;

      // Right
      case 39:
        nextDirection = 'right';
        break;

      // Down
      case 40:
        nextDirection = 'down';
        break;
    }
  }

  // Check if next position is allowed and return true or false
  function allowedMove(nextIndex) {
    if (
      squares[nextIndex].classList.contains('wall') ||
      squares[nextIndex].classList.contains('ghost-lair')
    ) {
      return false;
    } else return true;
  }

  // PAC-DOT EATEN
  function pacdotEaten(currentIndex) {
    if (squares[currentIndex].classList.contains('pac-dot')) {
      squares[currentIndex].classList.remove('pac-dot');
      score++;
      scoreDisplay.innerText = score;
      pacdotNumber--;
      pacdotDisplay.innerText = pacdotNumber;
      if (pacdotNumber === 0) {
        victory();
      }
    }
  }

  // POWER-PELLET EATEN
  function powerPelletEaten(currentIndex) {
    if (squares[currentIndex].classList.contains('power-pellet')) {
      squares[currentIndex].classList.remove('power-pellet');
      score += 10;
      scaredGhostsToggle(true);
      setTimeout(() => {
        scaredGhostsToggle(false);
      }, 10000);
    }
  }

  // TOGGLE SCARED GHOSTS
  // send status as true or false = scare or unscare
  function scaredGhostsToggle(status) {
    ghosts.forEach((ghost) => {
      ghost.isScared = status;
    });
  }

  // document.addEventListener('keydown', movePacman);
  document.addEventListener('keydown', changeDirection);

  // GHOST RANDOM SELECT DIRECTION
  function selectDirection() {
    const directions = ['left', 'right', 'up', 'down'];
    const selectedDirection =
      directions[Math.floor(Math.random() * directions.length)];
    // Math.random generates between 0 and 1; * directions.length = 0 and 3
    return selectedDirection;
  }

  // GHOST - CALCULATE NEXT INDEX
  function resolveGhostMovement(ghost) {
    let ghostCurrentIndex = ghost.currentIndex;
    switch (selectDirection()) {
      // Left
      case 'left':
        if (ghostCurrentIndex % width !== 0) {
          nextIndex = ghostCurrentIndex - 1;
        }
        break;
      // Up
      case 'up':
        if (ghostCurrentIndex - width >= 0) {
          nextIndex = ghostCurrentIndex - width;
        }
        break;
      // Right
      case 'right':
        if (ghostCurrentIndex % width < width - 1) {
          nextIndex = ghostCurrentIndex + 1;
        }
        break;
      // Down
      case 'down':
        if (ghostCurrentIndex + width < width * width) {
          nextIndex = ghostCurrentIndex + width;
        }
        break;
    }
    return nextIndex;
  }

  // GHOST - CHECK IF NEXT INDEX IS AN ALLOWED POSITION
  function ghostAllowedPosition(nextIndex) {
    if (
      squares[nextIndex].classList.contains('wall') ||
      squares[nextIndex].classList.contains('ghost')
    ) {
      return false;
    } else return true;
  }

  // MAIN MOVE GHOST FUNCTION
  function moveGhost(ghost) {
    ghost.timerId = setInterval(() => {
      resolveGhostMovement(ghost);

      if (ghostAllowedPosition(nextIndex)) {
        squares[ghost.currentIndex].classList.remove(
          'ghost',
          'scared-ghost',
          ghost.name
        );
        squares[nextIndex].classList.add('ghost', ghost.name);

        // refresh the currentIndex
        ghost.currentIndex = nextIndex;
        // check if ghost is scared
        if (ghost.isScared) {
          squares[ghost.currentIndex].classList.add('scared-ghost');
        }

        // Check for ghost - Pacman encounter
        if (ghost.currentIndex === pacmanCurrentIndex) {
          if (ghost.isScared) {
            killGhost(ghost);
          } else {
            gameOver();
          }
        }
      } else {
        resolveGhostMovement(ghost);
      }
    }, ghost.speed);
  }

  function killGhost(ghost) {
    score += 100;
    scoreDisplay.innerText = score;
    squares[ghost.currentIndex].classList.remove(
      'ghost',
      'scared-ghost',
      ghost.name
    );
    ghost.currentIndex = null;
    clearInterval(ghost.timerId);
  }

  // VICTORY
  function victory() {
    document.removeEventListener('keydown', changeDirection);
    ghosts.forEach((ghost) => {
      clearInterval(ghost.timerId);
    });
    alert('You win! Score: ' + score);
  }

  // GAME OVER
  function gameOver() {
    squares[pacmanCurrentIndex].classList.add('pacman-deceased');
    document.removeEventListener('keydown', changeDirection);
    ghosts.forEach((ghost) => {
      clearInterval(ghost.timerId);
    });
    alert('You dieded!');
    // showRestartButton();
  }

  function showRestartButton() {
    restartButton.classList.add('visible');
  }
  function hideRestartButton() {
    restartButton.classList.remove('visible');
  }

  // START NEW GAME
  function startGame() {
    createBoard();

    scoreDisplay.innerText = score;

    layout.forEach((element) => {
      if (element === 0) {
        pacdotNumber++;
      }
    });
    pacdotDisplay.innerText = pacdotNumber;

    // PACMAN STARTING POSITION
    pacmanCurrentIndex = 573;
    getCoordinates(pacmanCurrentIndex);
    moveAvatar(pacmanCoordinates);
    squares[pacmanCurrentIndex].classList.add('pacman-index');

    ghosts = [];
    ghosts.forEach((ghost) => {
      squares[ghost.currentIndex].classList.remove(
        'ghost',
        'ghost-scared',
        ghost.name
      );
    });
    ghosts = [
      new Ghost('blinky', 347, 250),
      new Ghost('pinky', 348, 400),
      new Ghost('inky', 351, 300),
      new Ghost('clyde', 352, 500),
    ];

    // GHOSTS STARTING POSITIONS
    ghosts.forEach((ghost) => {
      squares[ghost.startIndex].classList.add('ghost', ghost.name);
    });

    // START MOVING PACMAN
    autoMovePacman();

    // MOVE GHOSTS
    ghosts.forEach((ghost) => moveGhost(ghost));
    // moveGhost(ghosts[0]);
  }
});
