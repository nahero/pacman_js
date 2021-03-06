'use-strict';

document.addEventListener('DOMContentLoaded', () => {
  var easystar = new EasyStar.js();

  // SETUP layout variables
  const grid = document.getElementById('grid');
  const wallGrid = document.getElementById('walls');
  const scoreDisplay = document.getElementById('score');
  const pacdotDisplay = document.getElementById('pacdotNumber');
  const width = 28; // 28 x 28 = 784
  const restartButton = document.getElementById('restartButton');
  restartButton.addEventListener('click', startGame);

  const pacman = {};
  const pacAvatar = document.getElementById('pacman');
  const blinky = document.getElementById('blinky');
  const pinky = document.getElementById('pinky');
  const inky = document.getElementById('inky');
  const clyde = document.getElementById('clyde');
  const ghostAvatars = [];
  ghostAvatars.push(blinky, pinky, inky, clyde);
  const lairExitIndex = 293;
  const ghostDefaultSpeed = 150;
  const ghostScaredSpeed = 250;
  const pacmanSpeed = 150;

  // SETUP dynamic variables
  let score = 0;
  let pacmanCurrentIndex = 0;
  let pacdotNumber = 0;
  let pacmanCoordinates = [];
  let scaredModifier = false;
  let scaredToggleTimer = null;
  let scaredEndAnimTimer = null;

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
    5,4,4,4,4,4,0,0,0,4,1,1,1,1,1,1,1,1,4,0,0,0,4,4,4,4,4,6,
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
  // prettier-ignore
  const layoutAlt = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,4,1,1,1,2,2,1,1,1,4,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,4,1,1,2,2,2,2,1,1,4,1,1,0,1,1,1,1,1,1],
    [5,4,4,4,4,4,0,0,0,4,1,1,1,1,1,1,1,1,4,0,0,0,4,4,4,4,4,6],
    [1,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,4,4,4,4,1,1,4,4,4,4,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,3,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,3,1],
    [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
    [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ]
  // 0 - pac-dots
  // 1 - wall
  // 2 - ghost-lair
  // 3 - power-pellet
  // 4 - empty
  // 5 - tunnel left
  // 6 - tunnel right

  // EasyStar Pathfinding plugin config
  easystar.setGrid(layoutAlt);
  // easystar.setGrid(twoDimensionalArray);
  easystar.setAcceptableTiles([0, 3, 4]);
  // easystar.setAcceptableTiles(arrayOfAcceptableTiles);

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
  const walls = [];
  let tempIntersections = 0;

  const scatterTargets = {
    topLeft: 29,
    topRight: 54,
    bottomLeft: 729,
    bottomRight: 754,
  };

  // CREATE BOARD FROM LAYOUT
  function createBoard() {
    for (let i = 0; i < layout.length; i++) {
      const square = document.createElement('div');
      grid.appendChild(square);
      // wallGrid.appendChild(square);
      squares.push(square);
      squares[i].classList.add('g');
      // walls.push(square);

      switch (layout[i]) {
        case 0:
          squares[i].classList.add('pac-dot', i);
          tempIntersections = 0;
          directions.forEach((direction) => {
            j = i + direction.value;
            // if (layout[j] == 0 || layout[j] == 4) {
            if ([0, 4].includes(layout[j])) {
              tempIntersections++;
            }
          });
          if (tempIntersections > 2) {
            squares[i].classList.add('intersection');
          }
          break;
        case 1:
          squares[i].classList.add('wall', i);
          // walls[i].classList.add('wall', i);
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
        case 5:
          squares[i].classList.add('tunnel-left', i);
          break;
        case 6:
          squares[i].classList.add('tunnel-right', i);
          break;
      }
    }
  }

  // GHOSTS
  class Ghost {
    constructor(name, startIndex, scatterTarget, pattern) {
      this.name = name;
      this.startIndex = startIndex;
      this.currentIndex = startIndex;
      this.previousIndex = this.currentIndex; // for backwards movement
      this.coordinates = []; // for moving avatar
      this.allowedDirections = [];
      this.currentDirection = {};
      this.timerId = NaN;
      this.speed = ghostDefaultSpeed;
      this.isScared = false;
      this.isRespawning = true;
      this.avatar = null;
      // patterns: 1 - direct, 2 - cutoff, 3 - contain, 4 - intercept
      this.pattern = pattern || 0; // movement pattern
      // behaviours: 1 - wandering, 2 - scatter, 3 - chase
      this.behaviour = 1;
      // scatter targets
      this.scatterTarget = scatterTarget;
    }
  }

  startGame();

  // Place avatar
  function placeAvatar(actor, coords) {
    let x = coords[0] * 20;
    let y = coords[1] * 20;
    if (actor === 'pacman') {
      pacAvatar.style.transform =
        'translateX(' + x + 'px) translateY(' + y + 'px)';
    } else {
      actor.avatar.style.transform =
        'translateX(' + x + 'px) translateY(' + y + 'px)';
    }
  }

  // Move avatar
  function moveAvatar(actor, currentCoords, targetCoords) {
    let currX = currentCoords[0] * 20;
    let currY = currentCoords[1] * 20;
    let x = targetCoords[0] * 20;
    let y = targetCoords[1] * 20;

    let moveProps = [
      { transform: 'translateX(' + currX + 'px) translateY(' + currY + 'px)' },
      { transform: 'translateX(' + x + 'px) translateY(' + y + 'px)' },
    ];
    let moveTiming = {
      duration: actor.speed,
      iterations: 1,
      fill: 'forwards',
    };

    if (actor === 'pacman') {
      // set pacman timing separate from ghosts (onGhostScared changes speed)
      moveTiming.duration = pacmanSpeed;
      pacAvatarMoveAnimation = pacAvatar.animate(moveProps, moveTiming);
      pacAvatarMoveAnimation.play();
    } else {
      ghostAvatarMoveAnimation = actor.avatar.animate(moveProps, moveTiming);
      ghostAvatarMoveAnimation.play();
    }
  }

  // Tunnel move avatar
  function tunnelMoveAvatar(actor, currentCoords, targetCoords) {
    let currX = currentCoords[0] * 20;
    let currY = currentCoords[1] * 20;
    let x = targetCoords[0] * 20;
    let y = targetCoords[1] * 20;

    let moveProps = [
      {
        transform: 'translateX(' + currX + 'px) translateY(' + currY + 'px)',
        opacity: 1,
      },
      {
        transform: 'translateX(' + currX + 'px) translateY(' + currY + 'px)',
        opacity: 0,
        offset: 0.49,
      },
      {
        transform: 'translateX(' + x + 'px) translateY(' + y + 'px)',
        opacity: 0,
        offset: 0.5,
      },
      {
        transform: 'translateX(' + x + 'px) translateY(' + y + 'px)',
        opacity: 1,
      },
    ];
    let moveTiming = {
      duration: actor.speed,
      iterations: 1,
      // easing: 'steps(1, end)',
      fill: 'forwards',
    };

    if (actor === 'pacman') {
      // set pacman timing separate from ghosts (onGhostScared changes speed)
      moveTiming.duration = pacmanSpeed;
      pacAvatarMoveAnimation = pacAvatar.animate(moveProps, moveTiming);
      pacAvatarMoveAnimation.play();
    } else {
      ghostAvatarMoveAnimation = actor.avatar.animate(moveProps, moveTiming);
      ghostAvatarMoveAnimation.play();
    }
  }

  // GET FREE SPOT IN LAIR
  function getLairSpot() {
    let respawnSpot = 349;
    return new Promise((resolve, reject) => {
      if (squares[respawnSpot].classList.contains('ghost-index')) {
        while (squares[respawnSpot].classList.contains('ghost-index')) {
          respawnSpot++;
        }
        resolve(respawnSpot);
      } else {
        resolve(respawnSpot);
      }
    });
  }

  // Special Move avatar (fly to lair etc.)
  function flyBackToLair(ghost) {
    // get current coordinates for animation purposes
    const currentCoords = ghost.coordinates;
    const targetCoords = getGridCoordinates(ghost.currentIndex);

    let currX = currentCoords[0] * 20;
    let currY = currentCoords[1] * 20;
    let x = targetCoords[0] * 20;
    let y = targetCoords[1] * 20;
    let xc = currX + x;
    let yc = currY + y;
    let diffx = Math.abs(currX - x);
    let diffy = Math.abs(currY - y);

    // calc minimum distance between current and target using hypothenuse
    const distance = Math.sqrt(diffx * diffx + diffy * diffy);
    const calcSpeed = distance * 6;

    const flyAnimation = [
      {
        transform:
          'translateX(' +
          currX +
          'px) translateY(' +
          currY +
          'px) translateZ(0) scale(1)',
      },
      {
        transform:
          'translateX(' +
          currX +
          'px) translateY(' +
          currY +
          'px) translateZ(50px) scale(0.2)',
        offset: 0.15,
      },
      {
        transform:
          'translateX(' +
          x +
          'px) translateY(' +
          y +
          'px) translateZ(50px) scale(0.2)',
        offset: 0.85,
      },
      {
        transform:
          'translateX(' +
          x +
          'px) translateY(' +
          y +
          'px) translateZ(0) scale(1)',
      },
    ];
    const flyTiming = {
      duration: calcSpeed,
      easing: 'cubic-bezier(.6,.01,.44,1)',
      iterations: 1,
      fill: 'forwards',
    };

    const flyAnim = ghost.avatar.animate(flyAnimation, flyTiming);
    flyAnim.play();

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        flyAnim.finish();
        resolve();
      }, calcSpeed);
    });
  }

  // Respawning animation
  function animRespawning(avatar) {
    const animRespawning_props = [{ opacity: 1 }, { opacity: 0.2 }];
    const animRespawning_timing = {
      duration: 300,
      easing: 'linear',
      iterations: 10,
      direction: 'alternate',
    };
    const blinkAnim = avatar.animate(
      animRespawning_props,
      animRespawning_timing
    );
    blinkAnim.play();

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        blinkAnim.finish();
        resolve();
      }, 3000);
    });
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
    coordinates = [index % width, Math.floor(index / width)];
    return coordinates;
  }

  // Get X and Y coordinates for any grid index - HELPER
  function testCoordinates(index) {
    coordinates = [index % width, Math.floor(index / width)];
    cl(coordinates);
  }

  // Get index from coordinates
  function getIndex(x, y) {
    index = y * width + x;
    return index;
  }

  // Auto move Pacman
  function autoMovePacman() {
    pacmanTimerId = setInterval(() => {
      const currentGridSpotClass = squares[pacmanCurrentIndex].classList;
      // is pacman currently on tunnel spot and moving into tunnel?
      if (
        (currentGridSpotClass.contains('tunnel-left') &&
          currentDirection === directions[0]) ||
        (currentGridSpotClass.contains('tunnel-right') &&
          currentDirection === directions[1])
      ) {
        // is pacman currently on tunnel-left and moving left?
        if (
          currentGridSpotClass.contains('tunnel-left') &&
          currentDirection === directions[0]
        ) {
          // set next index to tunnel-right spot, keep direction
          nextIndex = 391;
          move(nextIndex);
        } else {
          // set next index to tunnel-left spot, keep direction
          nextIndex = 364;
          move(nextIndex);
        }
      } else {
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
      }

      // Delay action by about half of movement speed, so the effect of moving matches the visual movement
      pacEatTimeout = setTimeout(() => {
        pacdotEaten(pacmanCurrentIndex);
        powerPelletEaten(pacmanCurrentIndex);
      }, pacmanSpeed / 2);
      let pacGhostTimeout = setTimeout(
        pacmanGhostEncounterCheck(),
        pacmanSpeed / 2
      );
    }, pacmanSpeed); // Repeat every X miliseconds, lower is faster
  }

  // Ghost encounter
  function pacmanGhostEncounterCheck() {
    ghosts.forEach((ghost) => {
      if (ghost.currentIndex === pacmanCurrentIndex) {
        if (ghost.isScared && !ghost.isRespawning) {
          killGhost(ghost);
        } else gameOver();
      }
    });
  }

  // Execute move Pacman
  function move(nextIndex) {
    squares[pacmanCurrentIndex].classList.remove('pacman-index');
    squares[nextIndex].classList.add('pacman-index');
    // get grid coordinates on current index before it gets changed in move()
    pacmanCurrentCoords = getGridCoordinates(pacmanCurrentIndex);

    // Visually move Pacman
    // Pacman is separated from pacman-index (actual place on grid) for fluent movement animation
    getCoordinates('pacman', nextIndex);
    // if moving through tunnel
    if (
      (pacmanCurrentIndex === 364 && nextIndex === 391) ||
      (pacmanCurrentIndex === 391 && nextIndex === 364)
    ) {
      tunnelMoveAvatar('pacman', pacmanCurrentCoords, pacmanCoordinates);
    } else {
      // else move normally
      moveAvatar('pacman', pacmanCurrentCoords, pacmanCoordinates);
    }
    pacmanCurrentIndex = nextIndex;
  }

  // Bind keyboard event to change Pacman direction
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
      // change ghost behaviour based on pacdotNumber
      pacdotBehaviourTrigger();
      if (pacdotNumber === 0) {
        victory();
      }
    }
  }

  // POWER-PELLET EATEN
  function powerPelletEaten(currentIndex) {
    // power-pellet related
    if (squares[currentIndex].classList.contains('power-pellet')) {
      squares[currentIndex].classList.remove('power-pellet');
      squares[currentIndex].classList.add('pellet--eaten');
      setTimeout(() => {
        squares[currentIndex].classList.remove('pellet--eaten');
      }, 500);
      //score
      score += 10;
      // scare ghosts
      scaredGhostsToggle(true);
    }
  }

  // TOGGLE SCARED GHOSTS
  // status can be true or false (scared or not)
  function scaredGhostsToggle(status) {
    scaredModifier = status;
    // change speed (lower is faster)
    tempGhostSpeed = status ? ghostScaredSpeed : ghostDefaultSpeed;
    // when scared -> ghost.behaviour = wandering
    if (status) {
      ghosts.forEach((ghost) => {
        ghost.behaviour = 1; // wandering
      });
    }
    // toggle scared class and transition speed
    ghosts.forEach((ghost) => {
      ghost.isScared = ghost.isRespawning ? false : status;
      ghost.speed = ghost.isRespawning ? ghostDefaultSpeed : tempGhostSpeed;
      if (status && !ghost.isRespawning) {
        ghost.avatar.classList.add('scared');
      } else {
        ghost.avatar.classList.remove('scared');
      }
      // ghost.avatar.style.transition =
      //   'transform ' + ghost.speed / 1000 + 's linear';
    });

    if (status) {
      if (scaredToggleTimer) {
        clearTimeout(scaredToggleTimer);
        clearTimeout(scaredEndAnimTimer);
        animateScaredEnd(false);
      }
      scaredEndAnimTimer = setTimeout(() => {
        animateScaredEnd(true);
      }, 7000);
      scaredToggleTimer = setTimeout(() => {
        scaredModifier = !scaredModifier;
        scaredGhostsToggle(false);
        animateScaredEnd(false);
      }, 10000);
    }
  }

  // Scared end animation
  function animateScaredEnd(status) {
    let scaredAnimProps = [
      { borderColor: 'lightskyblue', backgroundColor: 'aqua' },
      { borderColor: 'blue', backgroundColor: 'aqua' },
    ];
    let scaredAnimTiming = {
      duration: 200,
      iterations: 15,
      direction: 'alternate',
      // fill: 'none',
    };
    ghosts.forEach((ghost) => {
      if (ghost.isScared) {
        ghostScaredEndAnimation = ghost.avatar.animate(
          scaredAnimProps,
          scaredAnimTiming
        );
        if (status) {
          ghostScaredEndAnimation.play();
        } else {
          ghostScaredEndAnimation.finish();
        }
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

  // RESOLVE TARGET INDEX FOR ANY ACTOR AND FIXED OFFSET (grid spots away)
  function resolveTargetIndex(actor, direction, offset) {
    const index = actor === pacman ? pacmanCurrentIndex : actor.currentIndex;
    const directionValue = offset ? direction.value * offset : direction.value;
    return (nextIndex = index + directionValue);
  }

  // GET ALLOWED DIRECTIONS based on current index
  function getAllowedDirections(ghost) {
    // console.log('getAllowedDirections', ghost.name);

    // first clear the allowedDirections array so we can store new ones
    ghost.allowedDirections = [];
    // let nextIndex = 0;

    if (ghost.allowedDirections.length === 0) {
      // calculate all 4 directions from current position (currentIndex)
      directions.forEach((direction) => {
        let nextIndex = ghost.currentIndex + direction.value;

        // now check if ghost is allowed to move in that direction
        // if allowed, store to ghost.allowedDirections array
        // (this will change every ghost move interval)
        if (allowedMove(ghost, nextIndex)) {
          direction.nextIndex = nextIndex;
          ghost.allowedDirections.push(direction);
        }
      });
    }
    // console.log('getallowed END');
  }

  // GHOST RANDOM SELECT AN ALLOWED DIRECTION
  function selectDirection(ghost) {
    // console.log('selectDirection START', ghost.name);

    const directions = ghost.allowedDirections;
    if (ghost.allowedDirections.length > 0) {
      const directionIndex = Math.floor(Math.random() * directions.length);
      // Math.random generates between 0 and 1, times directions.length
      const selectedDirection = directions[directionIndex];

      // check if moving backwards: nextIndex === previousIndex
      if (selectedDirection.nextIndex === ghost.previousIndex) {
        // is moving backwards the only option?
        if (ghost.allowedDirections.length === 1) {
          ghost.currentDirection = selectedDirection;
        } else {
          ghost.allowedDirections.splice(directionIndex, 1);
          const selectedDirection =
            ghost.allowedDirections[
              Math.floor(Math.random() * directions.length)
            ];
          ghost.currentDirection = selectedDirection;
        }
      } else {
        ghost.currentDirection = selectedDirection;
      }
    } else {
      // console.log('No allowed direction' + ghost.name);
    }
    // console.log('selectDirection END');
  }

  // CHECK FOR INTERSECTION returns true or false
  function onIntersection(currentIndex) {
    return squares[currentIndex].classList.contains('intersection');
  }

  // MOVE GHOST AND AVATAR
  function moveGhost(ghost) {
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
    const currentCoords = getGridCoordinates(ghost.currentIndex);
    getCoordinates(ghost, ghost.currentDirection.nextIndex);

    // check if ghost is scared
    if (ghost.isScared && !ghost.isRespawning) {
      squares[ghost.currentIndex].classList.add('scared-ghost');
      ghost.avatar.classList.add('scared');
    }

    // if moving through tunnel
    if (
      (ghost.currentIndex === 364 &&
        ghost.currentDirection.nextIndex === 391) ||
      (ghost.currentIndex === 391 && ghost.currentDirection.nextIndex === 364)
    ) {
      tunnelMoveAvatar(ghost, currentCoords, ghost.coordinates);
    } else {
      // else move normally
      moveAvatar(ghost, currentCoords, ghost.coordinates);
    }

    ghost.currentIndex = ghost.currentDirection.nextIndex;

    // Check for ghost - Pacman encounter
    let pacGhostTimeout = setTimeout(pacmanGhostEncounterCheck(ghost), 100);
  }

  // GHOST MOVEMENT
  function ghostMovement(ghost) {
    const currentGridSpotClass = squares[ghost.currentIndex].classList;

    // is ghost currently on tunnel spot and moving into tunnel?
    if (
      (currentGridSpotClass.contains('tunnel-left') &&
        ghost.currentDirection.name === 'left') ||
      (currentGridSpotClass.contains('tunnel-right') &&
        ghost.currentDirection.name === 'right')
    ) {
      // is ghost currently on tunnel-left and moving left?
      if (
        currentGridSpotClass.contains('tunnel-left') &&
        ghost.currentDirection.name === 'left'
      ) {
        // set next index to tunnel-right spot, keep direction
        ghost.currentDirection.nextIndex = 391;
        moveGhost(ghost);
      } else {
        // set next index to tunnel-left spot, keep direction
        ghost.currentDirection.nextIndex = 364;
        moveGhost(ghost);
      }
    } else {
      // Check for intersection
      if (onIntersection(ghost.currentIndex)) {
        getAllowedDirections(ghost);
        selectDirection(ghost);
      } else {
        // Check if ghost was already moving in one direction
        // we want it to continue in same direction if not on intersection
        if (ghost.currentDirection.name) {
          const nextIndex = ghost.currentIndex + ghost.currentDirection.value;
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

      // check if ghost is stuck (no allowed directions)
      // if not stuck then move, otherwise do nothing (stop for a cycle)
      if (ghost.allowedDirections.length > 0) {
        moveGhost(ghost);
      }
    }
  }

  // MAIN MOVE GHOST FUNCTION
  function startGhostMovement(ghost) {
    if (!ghost.isRespawning) {
      switch (ghost.behaviour) {
        case 1: // wandering
          ghostMovement(ghost);
          console.log('Wandering...');
          break;
        case 2: // scatter
          // target is ghost.scatterTarget, pattern is 1 - move direct to target
          chaseTarget(ghost, ghost.scatterTarget, 1);
          console.log('Scattering...');
          break;
        case 3: // chase
          chaseTarget(ghost, pacman, ghost.pattern);
          console.log('CHASE!');
          break;

        default:
          // wandering
          ghostMovement(ghost);
          break;
      }
      ghost.timerId = setTimeout(startGhostMovement, ghost.speed, ghost);
    }
  }

  // INIT GHOST
  function initGhost(ghost) {
    ghost.isRespawning = true;

    // ghost is now expected to be inside lair, move until exit
    if (ghost.currentIndex === lairExitIndex) {
      ghost.isRespawning = false;
      startGhostMovement(ghost);
    } else {
      moveTowardTarget(ghost, lairExitIndex);
      ghost.timerId = setTimeout(initGhost, ghost.speed, ghost);
    }
  }

  // MOVE TOWARD TARGET
  function moveTowardTarget(ghost, targetIndex) {
    // get target coords
    const targetCoords = getGridCoordinates(targetIndex);
    // get current coords
    const currentCoords = getGridCoordinates(ghost.currentIndex);
    // get allowed directions -> return allowed next indexes
    getAllowedDirections(ghost);
    // check if ghost is stuck (no allowed directions)
    if (ghost.allowedDirections.length > 0) {
      // get coords for each allowed next index
      ghost.allowedDirections.forEach((allowedDirection) => {
        const directionCoords = getGridCoordinates(allowedDirection.nextIndex);
        // for each next coords calculate if closer to target coords
        if (ifCoordsCloser(currentCoords, directionCoords, targetCoords)) {
          ghost.currentDirection = allowedDirection;
        }
      });
      moveGhost(ghost);
    } else {
      console.log(ghost.name + " can't move", ghost.allowedDirections);
    }

    // return new Promise((resolve, reject) => {
    //   if (ghost.currentIndex === targetIndex) {
    //     console.log('reached Exit');
    //     clearTimeout(ghost.timerId);
    //     resolve();
    //   } else {
    //     // ghostMovement(ghost);
    //     console.log('Still moving');
    //     ghost.timerId = setTimeout(
    //       moveTowardTarget,
    //       ghostSpeed,
    //       ghost,
    //       targetIndex
    //     );
    //   }
    // });
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

  // FIND PATH
  function chaseTarget(ghost, target, pattern) {
    /*
    patterns:
    1 - DIRECT: target pacman directly
    2 - CUTOFF: target 3 spots in front of pacman (move to eat if 3 or closer)
    3 - CONTAIN: move towards pacman if 8+ spots away, move away if closer
    4 - INTERCEPT: target spot relative to another actor who is targeting pacman
    */
    const startCoords = getGridCoordinates(ghost.currentIndex);
    const startX = startCoords[0];
    const startY = startCoords[1];

    let targetIndex;
    let targetCoords;
    let targetX;
    let targetY;

    let movePattern = pattern || ghost.pattern;

    // set target coords according to pattern
    switch (movePattern) {
      case 1: // direct
        targetCoords =
          target === pacman
            ? getGridCoordinates(pacmanCurrentIndex)
            : getGridCoordinates(target);
        break;
      case 2: // cutoff
        targetIndex = resolveTargetIndex(pacman, currentDirection, 3);

        if (
          0 <= targetIndex &&
          targetIndex <= 768 &&
          allowedMove(ghost, targetIndex) &&
          targetIndex != ghost.currentIndex
        ) {
          targetCoords = getGridCoordinates(targetIndex);
          squares[targetIndex].classList.add('target', ghost.name);
          setTimeout(() => {
            squares[targetIndex].classList.remove('target', ghost.name);
          }, 200);
        } else {
          console.log('Moving free');
          ghostMovement(ghost);
        }
        // if targetIndex < 0 or >768
        // if reached targetIndex (no path.x or path.y)
        break;
    }

    if (targetCoords) {
      targetX = targetCoords[0];
      targetY = targetCoords[1];
      easystar.findPath(startX, startY, targetX, targetY, pathCallback);

      function pathCallback(path) {
        if (path === null) {
          console.log('Path was not found.');
        } else {
          // PATH MOVEMENT
          const nextIndex = getIndex(path[1].x, path[1].y);
          ghost.currentDirection.nextIndex = nextIndex;
          moveGhost(ghost);

          // LIGHT UP THE PATH :)
          // path.forEach((gridSpot) => {
          //   let gridIndex = getIndex(gridSpot.x, gridSpot.y);
          //   squares[gridIndex].classList.add('allowed-move');
          //   setTimeout(() => {
          //     squares[gridIndex].classList.remove('allowed-move');
          //   }, ghost.speed - 10);
          // });
        }
      }
      easystar.calculate();
    }
  }

  // BEHAVIOUR TRIGGER
  function pacdotBehaviourTrigger() {
    // switch behaviours by pacdots remaining, max = 234
    let newBehaviour =
      pacdotNumber >= 200 || (pacdotNumber < 150 && pacdotNumber >= 100)
        ? 1
        : 3;

    ghosts.forEach((ghost) => {
      ghost.behaviour = ghost.isScared ? ghost.behaviour : newBehaviour; // wandering
    });
  }

  /*
  1 if behaviour = chase -> chaseTarget(ghost.pattern)
  2 if behaviour = scatter -> scatter(ghost.partOfGrid)
  2a scatter = reach a target (or within few spots), then switch to wandering
  3 if behaviour = wandering -> random movement (ghostMovement)
  4 if scared -> set behaviour to wandering + set lower speed
  
  behaviours:
  CHASE: different patterns
  WANDERING: default ghost movement
  SCATTER: different parts of grid
  */

  // KILL GHOST
  function killGhost(ghost) {
    // Reset ghost attributes (timer, allowed directions...)
    resetGhost(ghost);

    const ghostPosition = squares[ghost.currentIndex];
    // reset ghost and ghost grid index
    ghostPosition.classList.remove('ghost-index', 'scared-ghost', ghost.name);
    ghost.currentIndex = null;
    // change avatar
    ghost.avatar.classList.remove('scared');
    // ghost.avatar.classList.add('dead');

    // update score
    score += 100;
    scoreDisplay.innerText = score;
    // animate score
    ghostPosition.classList.add('ghost-score');
    setTimeout(() => {
      ghostPosition.classList.remove('ghost-score');
    }, 1000);

    respawnGhost(ghost);
  }

  // RESPAWN GHOST
  function respawnGhost(ghost) {
    // 1. get first free lair spot (for multiple killed ghosts)
    getLairSpot().then((respawnSpot) => {
      ghost.currentIndex = respawnSpot;
      squares[ghost.currentIndex].classList.add('ghost-index', ghost.name);
      // 2. fly the avatar back to lair
      flyBackToLair(ghost).then(() => {
        // 3. after flying done -> blink anim and wait for cooldown period
        animRespawning(ghost.avatar).then(() => {
          // 4. after cooldown -> init ghost
          initGhost(ghost);
        });
      });
    });
  }

  // Reset ghost attributes helper
  function resetGhost(ghost) {
    ghost.isRespawning = true;
    ghost.isScared = false;
    ghost.speed = ghostDefaultSpeed;
    clearTimeout(ghost.timerId);
    ghost.allowedDirections = [];
    ghost.direction = {};
  }

  // VICTORY
  function victory() {
    document.removeEventListener('keydown', changeDirection);
    clearTimeout(pacmanTimerId);
    ghosts.forEach((ghost) => {
      clearTimeout(ghost.timerId);
    });
    alert('You win! Score: ' + score);
  }

  // GAME OVER
  function gameOver() {
    squares[pacmanCurrentIndex].classList.add('pacman-deceased');
    clearTimeout(pacmanTimerId);
    pacmanCurrentIndex = null;
    nextDirection = null;
    document.removeEventListener('keydown', changeDirection);
    ghosts.forEach((ghost) => {
      clearTimeout(ghost.timerId);
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

  // CONSOLE LOG HELPER
  function cl(value) {
    return console.log(value);
  }

  // CONSOLE LOG ALL
  function consoleLogAll(ghost, message) {
    console.log(message);
    // prettier-ignore
    console.log(ghost.name 
    +' /currentIndex: '+ghost.currentIndex 
    +' /previousIndex: '+ghost.previousIndex 
    +' /allowedDirections: '+ghost.allowedDirections
    +' /currentDirection: ',ghost.currentDirection 
    +' /timerId: '+ghost.timerId 
    +' /isRespawning: '+ghost.isRespawning);
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
    placeAvatar('pacman', pacmanCoordinates);
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
      // new Ghost('name', startIndex, scatterTarget, pattern)
      new Ghost('blinky', 349, scatterTargets.topLeft, 1),
      new Ghost('pinky', 348, scatterTargets.topRight, 2),
      new Ghost('inky', 350, scatterTargets.bottomLeft, 1),
      new Ghost('clyde', 351, scatterTargets.bottomRight, 2),
    ];

    function initializeGhosts() {
      ghosts.forEach((ghost) => {
        // Add ghost to grid
        squares[ghost.startIndex].classList.add('ghost-index', ghost.name);
        // Place ghost avatars
        getCoordinates(ghost, ghost.startIndex);
        ghost.avatar = selectAvatar(ghost);
        placeAvatar(ghost, ghost.coordinates);
        // Set ghost speed
        ghost.speed = ghostDefaultSpeed;
      });
    }

    // CALL INIT GHOSTS
    initializeGhosts();

    // START MOVING PACMAN
    autoMovePacman();

    // TEST GHOST
    // ghosts[0].timerId = setInterval(() => {
    //   moveTowardTarget(ghosts[0], pacmanCurrentIndex);
    // }, ghostSpeed);

    // getGhostOutOfLair(ghosts[2]);
    // getGhostOutOfLair(ghosts[3]);

    // MOVE GHOSTS
    // ghosts.forEach((ghost) => startGhostMovement(ghost));
    initGhost(ghosts[0]);

    // Get Pinky out of lair
    setTimeout(() => {
      initGhost(ghosts[1]);
    }, 1000);

    // Get Inky out of lair
    setTimeout(() => {
      initGhost(ghosts[2]);
    }, 2000);

    // Get Clyde out of lair
    setTimeout(() => {
      initGhost(ghosts[3]);
    }, 3000);
  }
});
