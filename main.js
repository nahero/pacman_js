document.addEventListener('DOMContentLoaded', () => {
  // SETUP layout variables
  const grid = document.getElementById('grid');
  const scoreDisplay = document.getElementById('score');
  const pacdotDisplay = document.getElementById('pacdotNumber');
  const width = 28; // 28 x 28 = 784
  const restartButton = document.getElementById('restartButton');
  restartButton.addEventListener('click', startGame);

  const pacAvatar = document.getElementById('pacman');
  const blinky = document.getElementById('blinky');
  const pinky = document.getElementById('pinky');
  const inky = document.getElementById('inky');
  const clyde = document.getElementById('clyde');

  // SETUP dynamic variables
  let score = 0;
  let pacmanCurrentIndex = 0;
  let pacdotNumber = 0;
  let pacmanCoordinates = [];

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

  // DEFINE POSSIBLE DIRECTIONS
  const directions = [
    {
      name: 'left',
      value: -1,
    },
    {
      name: 'right',
      value: +1,
    },
    {
      name: 'up',
      value: -width,
    },
    {
      name: 'down',
      value: +width,
    },
  ];

  let currentDirection = directions[0]; // left
  let nextDirection = currentDirection;

  // createBoard();
  // GHOSTS
  class Ghost {
    constructor(name, startIndex, speed) {
      this.name = name;
      this.startIndex = startIndex;
      this.speed = speed;
      this.currentIndex = startIndex;
      this.coordinates = [];
      this.allowedDirections = [];
      this.timerId = NaN;
      this.isScared = false;
    }
  }

  startGame();

  // Move pacman avatar
  function moveAvatar(actor, coordinates) {
    // console.log('coordinates: ' + coordinates);

    let x = coordinates[0] * 20;
    let y = coordinates[1] * 20;

    if (actor === 'pacman') {
      pacAvatar.style.transform =
        'translateX(' + x + 'px) translateY(' + y + 'px)';
    } else {
      selectAvatar(actor);
      avatar.style.transform =
        'translateX(' + x + 'px) translateY(' + y + 'px)';
    }
  }

  // Get X and Y coordinates
  function getCoordinates(actor, index) {
    // console.log('actor: ' + actor);
    // console.log('index: ' + index);

    if (actor === 'pacman') {
      return (pacmanCoordinates = [index % width, Math.floor(index / width)]);
    } else {
      return (actor.coordinates = [index % width, Math.floor(index / width)]);
    }
  }

  // Auto move Pacman
  function autoMovePacman() {
    setInterval(() => {
      // set currentDirection (default is left)
      // set nextDirection (default = currentDirection, change on keydown)

      // resolveDirection(nextDirection) -- use function with switch/case => return nextIndex
      resolveNextIndex('pacman', nextDirection);

      // check is nextIndex allowed
      if (!allowedMove('pacman', nextIndex)) {
        // --> NOT allowed -> resolveDirection(currentDirection) => return nextIndex
        resolveNextIndex('pacman', currentDirection);
        // check is nextIndex allowed
        if (!allowedMove('pacman', nextIndex)) {
          // --> NOT allowed -> STOP (return currentIndex)
          return;
          // --> IS allowed -> MOVE (currentIndex = nextIndex)
        } else {
          move(nextIndex);
        }
        // --> IS allowed -> MOVE (currentIndex = nextIndex), also currentDirection = nextDirection;
      } else {
        move(nextIndex);
        currentDirection = nextDirection;
      }

      // Visually move Pacman
      // Pacman is separated from pacman-index (actual place on grid) for fluent movement animation
      getCoordinates('pacman', pacmanCurrentIndex);
      moveAvatar('pacman', pacmanCoordinates);

      // Delay action by about half of movement speed, so the effect of moving matches the visual movement
      setTimeout(() => {
        pacdotEaten(pacmanCurrentIndex);
        powerPelletEaten(pacmanCurrentIndex);
      }, 100);
      setTimeout(() => {
        ghostEncounter(pacmanCurrentIndex);
      }, 50);
    }, 200); // Repeat every X miliseconds, lower is faster
  }

  // Ghost encounter
  function ghostEncounter(pacmanCurrentIndex) {
    ghosts.forEach((ghost) => {
      if (ghost.currentIndex === pacmanCurrentIndex) {
        if (ghost.isScared) {
          killGhost(ghost);
        } else gameOver();
      }
    });
  }

  function move(nextIndex) {
    squares[pacmanCurrentIndex].classList.remove('pacman-index');
    squares[nextIndex].classList.add('pacman-index');
    pacmanCurrentIndex = nextIndex;
  }

  function changeDirection(e) {
    switch (e.keyCode) {
      // Left
      case 37:
        nextDirection = directions[0];
        break;
      // Up
      case 38:
        nextDirection = directions[2];
        break;
      // Right
      case 39:
        nextDirection = directions[1];
        break;
      // Down
      case 40:
        nextDirection = directions[3];
        break;
    }
  }

  // Check if next position is allowed and return true or false
  function allowedMove(actor, nextIndex) {
    const list = squares[nextIndex].classList;
    if (actor === 'pacman') {
      if (list.contains('wall') || list.contains('ghost-lair')) {
        return false;
      } else return true;
    } else {
      if (
        list.contains('wall') ||
        list.contains('ghost-index') ||
        list.contains('tunnel')
      ) {
        return false;
      } else return true;
    }
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
  // status can be true or false (scared or not)
  function scaredGhostsToggle(status) {
    ghosts.forEach((ghost) => {
      ghost.isScared = status;
      selectAvatar(ghost);
      if (status) {
        avatar.classList.add('scared');
      } else {
        avatar.classList.remove('scared');
      }
    });
  }

  // SELECT AVATAR HELPER FUNCTION
  function selectAvatar(actor) {
    return (avatar = document.getElementById(actor.name));
  }

  document.addEventListener('keydown', changeDirection);

  // GHOST RANDOM SELECT AN ALLOWED DIRECTION
  function selectDirection(ghost) {
    const directions = ghost.allowedDirections;
    const selectedDirection =
      directions[Math.floor(Math.random() * directions.length)];
    // Math.random generates between 0 and 1, times directions.length
    return selectedDirection.nextIndex;
  }

  // RESOLVE NEXT INDEX FOR ANY ACTOR
  function resolveNextIndex(actor, direction) {
    // set either pacman's or ghost's current index
    index = actor === 'pacman' ? pacmanCurrentIndex : actor.currentIndex;
    return (nextIndex = index + direction.value);
  }

  // MAIN MOVE GHOST FUNCTION
  function moveGhost(ghost) {
    // blinky starts moving
    // others wait for n seconds - pinky is 2nd, inky 3rd, clyde 4th
    // to get out of lair

    // get out of lair sequence

    // get all allowed directions from current position
    // and check if ghost is allowed to move in that direction
    ghosts.forEach((ghost) => {
      // first clear the allowedDirections array so we can store new ones
      ghost.allowedDirections = [];

      console.log(
        ghost.name + ' allowed directions: ',
        ghost.allowedDirections
      );

      directions.forEach((direction) => {
        nextIndex = ghost.currentIndex + direction.value;

        // console.log(ghost.name + ' next index: ' + nextIndex);

        // if allowed, store to ghost.allowedDirections array
        // (this will change every ghost move interval)
        if (allowedMove(ghost, nextIndex)) {
          direction.nextIndex = nextIndex;
          ghost.allowedDirections.push(direction);
        }

        // console.log(ghost.name + ' current index: ' + ghost.currentIndex);

        // console.log(
        //   ghost.name + ' allowed directions: ',
        //   ghost.allowedDirections
        // );
      });
    });

    ghost.timerId = setInterval(() => {
      // pick an allowed direction (random or closer to pacman)
      nextIndex = selectDirection(ghost);
      console.log('selected Direction: ', selectDirection(ghost));
      // move in allowed direction until an intersection, wall, or ghost
      squares[ghost.currentIndex].classList.remove(
        'ghost-index',
        'scared-ghost',
        ghost.name
      );
      squares[nextIndex].classList.add('ghost-index', ghost.name);

      ghost.currentIndex = nextIndex;
      getCoordinates(ghost, ghost.currentIndex);

      // check if ghost is scared
      if (ghost.isScared) {
        squares[ghost.currentIndex].classList.add('scared-ghost');
        avatar = document.getElementById(ghost.name);
        avatar.classList.add('scared');
      }

      // Check for ghost - Pacman encounter
      if (ghost.currentIndex === pacmanCurrentIndex) {
        moveAvatar(ghost, ghost.coordinates);
        if (ghost.isScared) {
          killGhost(ghost);
        } else {
          gameOver();
        }
      }
      moveAvatar(ghost, ghost.coordinates);
    }, ghost.speed);
    // or pacman in range (x,y coords)
    // if intersection, wall, ghost -> pick a new direction -> move (repeat)
    // if pacman in range -> pick direction where next index is closer to pacman
    // pacman not in range -> move normally

    // ghost.timerId = setInterval(() => {
    //   resolveNextIndex(ghost, selectDirection());

    //   if (allowedMove(ghost, nextIndex)) {
    //     squares[ghost.currentIndex].classList.remove(
    //       'ghost-index',
    //       'scared-ghost',
    //       ghost.name
    //     );
    //     squares[nextIndex].classList.add('ghost-index', ghost.name);

    //     // refresh the currentIndex
    //     ghost.currentIndex = nextIndex;
    //     getCoordinates(ghost, ghost.currentIndex);

    //     // check if ghost is scared
    //     if (ghost.isScared) {
    //       squares[ghost.currentIndex].classList.add('scared-ghost');
    //       avatar = document.getElementById(ghost.name);
    //       avatar.classList.add('scared');
    //     }

    //     // Check for ghost - Pacman encounter
    //     if (ghost.currentIndex === pacmanCurrentIndex) {
    //       moveAvatar(ghost, ghost.coordinates);
    //       if (ghost.isScared) {
    //         killGhost(ghost);
    //       } else {
    //         gameOver();
    //       }
    //     }
    //   } else {
    //     resolveNextIndex(ghost, selectDirection());
    //   }
    //   moveAvatar(ghost, ghost.coordinates);
    // }, ghost.speed); // Repeat based on ghost speed
  }

  function killGhost(ghost) {
    score += 100;
    scoreDisplay.innerText = score;
    squares[ghost.currentIndex].classList.remove(
      'ghost-index',
      'scared-ghost',
      ghost.name
    );
    ghost.currentIndex = null;
    clearInterval(ghost.timerId);
    selectAvatar(ghost);
    avatar.classList.remove('scared', ghost.name);
    avatar.classList.add('dead');
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
    pacmanCurrentIndex = null;
    document.removeEventListener('keydown', changeDirection);
    nextDirection = null;
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
    getCoordinates('pacman', pacmanCurrentIndex);
    moveAvatar('pacman', pacmanCoordinates);
    squares[pacmanCurrentIndex].classList.add('pacman-index');

    ghosts = [];
    ghosts.forEach((ghost) => {
      squares[ghost.currentIndex].classList.remove(
        'ghost-index',
        'ghost-scared',
        ghost.name
      );
    });
    ghosts = [
      new Ghost('blinky', 294, 250),
      new Ghost('pinky', 348, 400),
      new Ghost('inky', 351, 300),
      new Ghost('clyde', 352, 500),
    ];
    ghosts.forEach((ghost) => {
      getCoordinates(ghost, ghost.startIndex);
      moveAvatar(ghost, ghost.coordinates);
    });

    // GHOSTS STARTING POSITIONS
    ghosts.forEach((ghost) => {
      squares[ghost.startIndex].classList.add('ghost-index', ghost.name);
    });

    // START MOVING PACMAN
    autoMovePacman();

    // MOVE GHOSTS
    ghosts.forEach((ghost) => moveGhost(ghost));
    // moveGhost(ghosts[0]);
  }
});
