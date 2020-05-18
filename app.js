document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('grid');
  const scoreDisplay = document.getElementById('score');
  let score = 0;
  scoreDisplay.innerText = score;

  const width = 28; // 28 x 28 = 784

  //  LAYOUT
  // prettier-ignore
  const layout = [
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,1,1,2,2,1,1,1,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
    4,4,4,4,4,4,0,0,0,4,1,2,2,2,2,2,2,1,4,0,0,0,4,4,4,4,4,4,
    1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,1,
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
          squares[i].classList.add('pac-dot');
          break;
        case 1:
          squares[i].classList.add('wall');
          break;
        case 2:
          squares[i].classList.add('ghost-lair');
          break;
        case 3:
          squares[i].classList.add('power-pellet');
          break;
      }
    }
  }

  createBoard();

  // PACMAN STARTING POSITION
  let pacmanCurrentIndex = 490;
  squares[pacmanCurrentIndex].classList.add('pacman');

  // MOVE PACMAN
  function movePacman(e) {
    // console.log('currentIndex: ' + pacmanCurrentIndex);

    squares[pacmanCurrentIndex].classList.remove('pacman');
    switch (e.keyCode) {
      // Left: check if on left edge (28 / 28 = 1, modulo 0)
      // also check if next position is allowed
      case 37:
        if (pacmanCurrentIndex % width !== 0) {
          nextIndex = pacmanCurrentIndex - 1;
          allowedPosition(nextIndex);
        }
        break;

      // Up
      case 38:
        if (pacmanCurrentIndex - width >= 0) {
          nextIndex = pacmanCurrentIndex - width;
          allowedPosition(nextIndex);
        }
        break;

      // Right
      case 39:
        if (pacmanCurrentIndex % width < width - 1) {
          nextIndex = pacmanCurrentIndex + 1;
          allowedPosition(nextIndex);
        }
        break;

      // Down
      case 40:
        if (pacmanCurrentIndex + width < width * width) {
          nextIndex = pacmanCurrentIndex + width;
          allowedPosition(nextIndex);
        }
        break;
    }
    squares[pacmanCurrentIndex].classList.add('pacman');
    pacdotEaten(pacmanCurrentIndex);
    e.preventDefault();
  }

  // Check if next position is allowed and return either next position or current one
  function allowedPosition(nextIndex) {
    // Conditions
    if (
      squares[nextIndex].classList.contains('wall') ||
      squares[nextIndex].classList.contains('ghost-lair')
    ) {
      return pacmanCurrentIndex;
    } else return (pacmanCurrentIndex = nextIndex);
  }

  // PAC-DOT EATEN
  function pacdotEaten(currentIndex) {
    if (squares[currentIndex].classList.contains('pac-dot')) {
      squares[currentIndex].classList.remove('pac-dot');
      score++;
      scoreDisplay.innerText = score;
    }
  }

  document.addEventListener('keyup', movePacman);

  // GHOSTS
  class Ghost {
    constructor(name, startIndex, speed) {
      this.name = name;
      this.startIndex = startIndex;
      this.speed = speed;
      this.currentIndex = startIndex;
      this.timerId = NaN;
    }
  }

  ghosts = [
    new Ghost('blinky', 348, 250),
    new Ghost('pinky', 376, 400),
    new Ghost('inky', 351, 300),
    new Ghost('clyde', 379, 500),
  ];

  // GHOSTS STARTING POSITIONS
  ghosts.forEach((ghost) => {
    squares[ghost.startIndex].classList.add('ghost', ghost.name);
  });

  // MOVE GHOSTS
  // ghosts.forEach((ghost) => moveGhost(ghost));
  moveGhost(ghosts[0]);

  function selectDirection() {
    const directions = ['left', 'right', 'up', 'down'];
    const selectedDirection =
      directions[Math.floor(Math.random() * directions.length)];
    // Math.random generates between 0 and 1; * directions.length = 0 and 3
    return selectedDirection;
  }

  function resolveGhostMovement(ghost) {
    let ghostCurrentIndex = ghost.currentIndex;
    switch (selectDirection()) {
      // Left: check if on left edge (28 / 28 = 1, modulo 0)
      // also check if next position is allowed
      case 'left':
        if (ghostCurrentIndex % width !== 0) {
          nextIndex = ghostCurrentIndex - 1;
        }
        break;
      // Up
      case 'up':
        if (pacmanCurrentIndex - width >= 0) {
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
    console.log('next ghost index: ' + nextIndex);
    return nextIndex;
  }

  function moveGhost(ghost) {
    console.log('ghost: ', ghost);
    // console.log('selectedDirection: ' + selectedDirection);
    // console.log('ghostCurrentIndex: ' + ghostCurrentIndex);

    ghost.timerId = setInterval(() => {
      resolveGhostMovement(ghost);

      if (ghostAllowedPosition(nextIndex)) {
        squares[ghost.currentIndex].classList.remove(
          'ghost',
          'scared-ghost',
          ghost.name
        );
        squares[nextIndex].classList.add('ghost', ghost.name);
      } else resolveGhostMovement(ghost);
      // console.log('ghost nextIndex: ' + nextIndex);
    }, ghost.speed);
  }

  // Check if next position is allowed for ghost and return either next position or current one
  function ghostAllowedPosition(nextIndex) {
    if (
      squares[nextIndex].classList.contains('wall') ||
      squares[nextIndex].classList.contains('ghost')
    ) {
      return false;
    } else return true;
  }

  // moveGhost(ghosts[0]);
});
