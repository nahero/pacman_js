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
  const ghostAvatars = [];
  ghostAvatars.push(blinky, pinky, inky, clyde);

  // SETUP dynamic variables
  let score = 0;
  let pacmanCurrentIndex = 0;
  let pacdotNumber = 0;
  let pacmanCoordinates = [];
  let ghostSpeed = 200;

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
    1,1,1,1,1,1,0,1,1,4,1,1,2,2,2,2,1,1,4,1,1,0,1,1,1,1,1,1,
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

  const squares = [];
  let tempIntersections = 0;

  // CREATE BOARD FROM LAYOUT
  function createBoard() {
    for (let i = 0; i < layout.length; i++) {
      const square = document.createElement('div');
      grid.appendChild(square);
      squares.push(square);

      switch (layout[i]) {
        case 0:
          squares[i].classList.add('pac-dot', i);
          tempIntersections = 0;
          directions.forEach((direction) => {
            j = i + direction.value;
            if (layout[j] == 0 || layout[j] == 4) {
              tempIntersections++;
            }
          });
          if (tempIntersections > 2) {
            squares[i].classList.add('intersection');
          }
          break;
        case 1:
          squares[i].classList.add('wall', i);
          break;
        case 2:
          squares[i].classList.add('ghost-lair', i);
          break;
        case 3:
          squares[i].classList.add('power-pellet');
          break;
        case 4:
          tempIntersections = 0;
          directions.forEach((direction) => {
            j = i + direction.value;
            if (layout[j] == 0 || layout[j] == 4) {
              tempIntersections++;
            }
          });
          if (tempIntersections > 2) {
            squares[i].classList.add('intersection');
          }
          break;
      }
    }
  }

  // createBoard();
  // GHOSTS
  class Ghost {
    constructor(name, startIndex) {
      this.name = name;
      this.startIndex = startIndex;
      this.currentIndex = startIndex;
      this.previousIndex = this.currentIndex; // for backwards movement
      this.coordinates = []; // for moving avatar
      this.allowedDirections = [];
      this.currentDirection = {};
      this.timerId = NaN;
      this.isScared = false;
      this.isRespawning = true;
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

  // Get X and Y coordinates for actors
  function getCoordinates(actor, index) {
    if (actor === 'pacman') {
      return (pacmanCoordinates = [index % width, Math.floor(index / width)]);
    } else {
      return (actor.coordinates = [index % width, Math.floor(index / width)]);
    }
  }

  // Get X and Y coordinates for any grid index
  function getGridCoordinates(index) {
    return (coordinates = [index % width, Math.floor(index / width)]);
  }

  // Auto move Pacman
  function autoMovePacman() {
    pacmanTimerId = setInterval(() => {
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

      setTimeout(pacmanGhostEncounterCheck(), 100);
    }, 200); // Repeat every X miliseconds, lower is faster
  }

  // Ghost encounter
  function pacmanGhostEncounterCheck() {
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
        list.contains('tunnel') ||
        (!actor.isRespawning && list.contains('ghost-lair'))
      ) {
        return false;
      } else return true;
    }
  }

  // PAC-DOT EATEN
  function pacdotEaten(currentIndex) {
    if (squares[currentIndex].classList.contains('pac-dot')) {
      squares[currentIndex].classList.remove('pac-dot');
      squares[currentIndex].classList.add('pac-dot--eaten');
      setTimeout(() => {
        squares[currentIndex].classList.remove('pac-dot--eaten');
      }, 400);
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
      squares[currentIndex].classList.add('pellet--eaten');
      setTimeout(() => {
        squares[currentIndex].classList.remove('pellet--eaten');
      }, 500);
      score += 10;
      scaredGhostsToggle(true);
      ghostSpeed = 300;
      ghostAvatars.forEach((ghost) => {
        ghost.style.transition = 'transform ' + ghostSpeed / 1000 + 's linear';
      });
      setTimeout(() => {
        scaredGhostsToggle(false);
        ghostSpeed = 200;
        ghostAvatars.forEach((ghost) => {
          ghost.style.transition =
            'transform ' + ghostSpeed / 1000 + 's linear';
        });
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

  // RESOLVE NEXT INDEX FOR ANY ACTOR
  function resolveNextIndex(actor, direction) {
    // set either pacman's or ghost's current index
    index = actor === 'pacman' ? pacmanCurrentIndex : actor.currentIndex;
    return (nextIndex = index + direction.value);
  }

  // GET ALLOWED DIRECTIONS based on current index
  function getAllowedDirections(ghost) {
    // first clear the allowedDirections array so we can store new ones
    ghost.allowedDirections = [];

    // calculate all 4 directions from current position (currentIndex)
    directions.forEach((direction) => {
      nextIndex = ghost.currentIndex + direction.value;

      // now check if ghost is allowed to move in that direction
      // if allowed, store to ghost.allowedDirections array
      // (this will change every ghost move interval)
      if (allowedMove(ghost, nextIndex)) {
        direction.nextIndex = nextIndex;
        ghost.allowedDirections.push(direction);
      }
    });
  }

  // GHOST RANDOM SELECT AN ALLOWED DIRECTION
  function selectDirection(ghost) {
    const directions = ghost.allowedDirections;
    const directionIndex = Math.floor(Math.random() * directions.length);
    // Math.random generates between 0 and 1, times directions.length
    const selectedDirection = directions[directionIndex];
    console.log('selectedDirection.nextIndex: ' + selectedDirection.nextIndex);
    console.log('ghost.previousIndex: ' + ghost.previousIndex);
    console.log(
      'ghost.allowedDirections.length: ' + ghost.allowedDirections.length
    );

    // check if moving backwards: nextIndex === previousIndex
    if (selectedDirection.nextIndex === ghost.previousIndex) {
      // is moving backwards the only option?
      if (ghost.allowedDirections.length === 1) {
        ghost.currentDirection = selectedDirection;
      } else {
        ghost.allowedDirections.splice(directionIndex, 1);
        console.log('ghost.allowedDirections: ', ghost.allowedDirections);
        console.log('directions: ', directions);

        const selectedDirection =
          ghost.allowedDirections[
            Math.floor(Math.random() * directions.length)
          ];
        ghost.currentDirection = selectedDirection;
      }
    } else {
      ghost.currentDirection = selectedDirection;
    }
  }

  // CHECK FOR INTERSECTION returns true or false
  function onIntersection(currentIndex) {
    return squares[currentIndex].classList.contains('intersection');
  }

  // MOVE GHOST AND AVATAR
  function moveGhost(ghost) {
    // move in allowed direction until an intersection, wall, or ghost
    squares[ghost.currentIndex].classList.remove(
      'ghost-index',
      'scared-ghost',
      ghost.name
    );
    squares[ghost.currentDirection.nextIndex].classList.add(
      'ghost-index',
      ghost.name
    );
    ghost.previousIndex = ghost.currentIndex;
    ghost.currentIndex = ghost.currentDirection.nextIndex;
    getCoordinates(ghost, ghost.currentIndex);

    // check if ghost is scared
    if (ghost.isScared) {
      squares[ghost.currentIndex].classList.add('scared-ghost');
      avatar = document.getElementById(ghost.name);
      avatar.classList.add('scared');
    }

    moveAvatar(ghost, ghost.coordinates);

    // Check for ghost - Pacman encounter
    setTimeout(pacmanGhostEncounterCheck(), 100);
  }

  function ghostMovement(ghost) {
    // Check for intersection
    if (onIntersection(ghost.currentIndex)) {
      getAllowedDirections(ghost);
      selectDirection(ghost);
    } else {
      // Check if ghost was already moving in one direction
      // we want it to continue in same direction if not on intersection
      if (ghost.currentDirection.name) {
        nextIndex = ghost.currentIndex + ghost.currentDirection.value;
        if (allowedMove(ghost, nextIndex)) {
          ghost.currentDirection.nextIndex = nextIndex;
        } else {
          getAllowedDirections(ghost);
          selectDirection(ghost);
        }
      } else {
        getAllowedDirections(ghost);
        selectDirection(ghost);
      }
    }
    moveGhost(ghost);
  }

  // MAIN MOVE GHOST FUNCTION
  function startGhostMovement(ghost) {
    ghostMovement(ghost);
    ghost.timerId = setTimeout(startGhostMovement, ghostSpeed, ghost);
  }

  // MAIN MOVE GHOST FUNCTION
  // function startGhostMovement(ghost) {
  //   ghostMovement(ghost);
  //   ghost.timerId = setTimeout(startGhostMovement, ghostSpeed, ghost);
  // }

  // GET OUT OF LAIR SEQUENCE
  function getGhostOutOfLair(ghost) {
    ghost.isRespawning = true;
    // set exit index
    const exitIndex = 293;
    // move towards exit index until reached
    if (ghost.currentIndex != exitIndex) {
      ghost.timerId = setInterval(() => {
        moveTowardTarget(ghost, exitIndex);
      }, 200);
    } else {
      startGhostMovement(ghost);
    }
  }

  // MOVE TOWARD TARGET
  function moveTowardTarget(ghost, targetIndex) {
    // get target coords
    targetCoords = getGridCoordinates(targetIndex);
    // get current coords
    currentCoords = getGridCoordinates(ghost.currentIndex);
    // get allowed directions -> return allowed next indexes
    getAllowedDirections(ghost);
    // get coords for each allowed next index
    ghost.allowedDirections.forEach((allowedDirection) => {
      directionCoords = getGridCoordinates(allowedDirection.nextIndex);
      // for each next coords calculate if closer to target coords
      if (ifCoordsCloser(currentCoords, directionCoords, targetCoords)) {
        ghost.currentDirection = allowedDirection;
      }
      moveGhost(ghost);
    });
    //
  }

  // CHECK IF COORDS ARE CLOSER TO TARGET
  function ifCoordsCloser(currentCoords, nextCoords, targetCoords) {
    currX = currentCoords[0];
    currY = currentCoords[1];
    nextX = nextCoords[0];
    nextY = nextCoords[1];
    targetX = targetCoords[0];
    targetY = targetCoords[1];
    if (
      Math.abs(currX - targetX) > Math.abs(nextX - targetX) ||
      Math.abs(currY - targetY) > Math.abs(nextY - targetY)
    ) {
      return true;
    } else return false;
  }

  // KILL GHOST
  function killGhost(ghost) {
    score += 100;
    scoreDisplay.innerText = score;
    ghostPosition = squares[ghost.currentIndex];
    // remove ghost index and animate score
    ghostPosition.classList.remove('ghost-index', 'scared-ghost', ghost.name);
    ghost.currentIndex = null;
    clearInterval(ghost.timerId);
    ghostPosition.classList.add('ghost-score');
    setTimeout(() => {
      ghostPosition.classList.remove('ghost-score');
    }, 400);
    // change avatar
    selectAvatar(ghost);
    avatar.classList.remove('scared');
    avatar.classList.add('dead');
    respawnGhost(ghost);
  }

  // RESPAWN GHOST
  function respawnGhost(ghost) {
    // on ghost killed, fly the avatar back to lair:
    // get first free spot in lair (or set index manually)
    ghost.currentIndex = 348;
    // animate avatar from current coords to lair coords
    selectAvatar(ghost);
    getCoordinates(ghost, ghost.currentIndex);
    moveAvatar(ghost, ghost.coordinates);
    // reinitiate ghost
    // move out of lair and start movement
    getAllowedDirections(ghost);
    startGhostMovement(ghost);
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
    clearInterval(pacmanTimerId);
    pacmanCurrentIndex = null;
    nextDirection = null;
    document.removeEventListener('keydown', changeDirection);
    ghosts.forEach((ghost) => {
      clearInterval(ghost.timerId);
      ghost.currentIndex = null;
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
      new Ghost('blinky', 294),
      new Ghost('pinky', 348),
      new Ghost('inky', 350),
      new Ghost('clyde', 351),
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

    // TEST GHOST
    // moveTowardTarget(ghosts[0], pacmanCurrentIndex);
    getGhostOutOfLair(ghosts[2]);

    // MOVE GHOSTS
    // ghosts.forEach((ghost) => startGhostMovement(ghost));
    // startGhostMovement(ghosts[0]);

    // Get Pinky out of lair
    // setTimeout(() => {
    //   ghosts[1].currentDirection.nextIndex = 349;
    //   moveGhost(ghosts[1]);
    // }, 3000);
    // setTimeout(() => {
    //   ghosts[1].currentDirection.nextIndex = 321;
    //   moveGhost(ghosts[1]);
    // }, 3200);
    // setTimeout(() => {
    //   ghosts[1].currentDirection.nextIndex = 293;
    //   moveGhost(ghosts[1]);
    //   startGhostMovement(ghosts[1]);
    // }, 3400);

    // // Get Inky out of lair
    // setTimeout(() => {
    //   ghosts[2].currentDirection.nextIndex = 322;
    //   moveGhost(ghosts[2]);
    // }, 6000);
    // setTimeout(() => {
    //   ghosts[2].currentDirection.nextIndex = 294;
    //   moveGhost(ghosts[2]);
    //   startGhostMovement(ghosts[2]);
    // }, 6200);

    // // Get Clyde out of lair
    // setTimeout(() => {
    //   ghosts[3].currentDirection.nextIndex = 350;
    //   moveGhost(ghosts[3]);
    // }, 9000);
    // setTimeout(() => {
    //   ghosts[3].currentDirection.nextIndex = 322;
    //   moveGhost(ghosts[3]);
    // }, 9200);
    // setTimeout(() => {
    //   ghosts[3].currentDirection.nextIndex = 294;
    //   moveGhost(ghosts[3]);
    //   startGhostMovement(ghosts[3]);
    // }, 9400);
  }
});
