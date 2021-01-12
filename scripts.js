(function() {
    const currentFloorEl = document.querySelector('.current-floor');
    const doorsActionEl = document.querySelector('.doors-action');
    const outsidePanelEl = document.querySelector('.outside-panel');
    const insidePanelEl = document.querySelector('.inside-panel');

    outsidePanelEl.addEventListener('click', ousidePanelHandler);
    insidePanelEl.addEventListener('click', insidePanelHandler);

    let currentFloor = 4;
    const elevatorStopsQueue = [];
    const elevatorState = {
        inMotion: false,
        direction: '',
        from: '',
        to: ''
    };
    let idleTimeout;
    let flagFloor = '';

    currentFloorEl.textContent = currentFloor;
    doorsActionEl.textContent = 'Open';

    // Button Interactions
    function ousidePanelHandler(e) {
        buttonIsPressed(e);
    }

    function insidePanelHandler(e) {
        buttonIsPressed(e);
    }

    function buttonIsPressed(element) {
        stopIdle();
        if (element.target.nodeName === 'I') {
            const toFloor = element.target.parentNode.classList[0];
            const direction = element.target.classList[0];
            element.target.classList.add('green');
            if (canHaveIntermediateStop(toFloor, direction)) {
                flagFloor = toFloor;
            } else {
                elevatorStopsQueue.push(toFloor);
                if (!elevatorState.inMotion) {
                    goToSelectedFloors();
                }
            }

        }
        startIdle();
    }

    // Idle Functionality
    function startIdle() {
        idleTimeout = setTimeout(() => moveElevator(currentFloor, 4), 120000);
    }

    function stopIdle() {
        clearTimeout(idleTimeout);
    }

    //Regular and Intermediate Stops Functionality
    async function goToSelectedFloors() {
        elevatorState.inMotion = true;
        while (elevatorStopsQueue.length !== 0) {
            const to = elevatorStopsQueue.shift();
            elevatorState.from = currentFloor;
            elevatorState.to = to;
            await moveElevator(currentFloor, to);
        }
        elevatorState.inMotion = false;
    }

    function canHaveIntermediateStop(toFloor, direction) {
        if (!elevatorState.inMotion) {
            return false;
        }
        if (elevatorState.from === '' && elevatorState.to === '') {
            return false;
        }
        if (elevatorState.direction !== direction && direction !== 'fas') {
            return false;
        }
        if (direction === 'up') {
            if (toFloor < elevatorState.from || toFloor > elevatorState.to) {
                return false;
            }
        }
        if (direction === 'down') {
            if (toFloor > elevatorState.from || toFloor < elevatorState.to) {
                return false;
            }
        }

        return true;
    }

    // Elevator Engine Functionality
    async function moveElevator(from, to) {
        doorsActionEl.textContent = 'Closed';
        if (from < to) {
            // move up
            elevatorState.direction = 'up';
            for (let i = from; i <= to; i++) {
                await nextFloor(i);
            }
        } else if (from > to) {
            // move down
            elevatorState.direction = 'down';
            for (let i = from; i >= to; i--) {
                await nextFloor(i);
            }
        }
        await stopOnFloor(to);
    };

    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

    async function nextFloor(floor) {
        // suboptimal => slow initial start
        await sleep(1000);
        currentFloor = floor;
        currentFloorEl.textContent = floor;
        if (flagFloor == floor) {
            await stopOnFloor(floor);
            flagFloor = '';
        }
    };

    async function stopOnFloor(floor) {
        doorsActionEl.textContent = 'Open';
        elevatorState.direction = '';
        const elements = document.getElementsByClassName(floor);
        for (let i = 0; i < elements.length; i++) {
            [...elements[i].children].forEach(element => {
                element.classList.remove('green');
            });
        }
        await sleep(2000);
    }

})();