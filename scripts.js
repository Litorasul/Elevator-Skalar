(function() {
    const currentFloorEl = document.querySelector('.current-floor');
    const doorsActionEl = document.querySelector('.doors-action');
    const outsidePanelEl = document.querySelector('.outside-panel');
    const insidePanelEl = document.querySelector('.inside-panel');

    outsidePanelEl.addEventListener('click', ousidePanelHandler);
    insidePanelEl.addEventListener('click', insidePanelHandler);

    let currentFloor = 4;
    const elevatorStopsQueue = [];
    let idleTimeout;
    let inMotion = false;

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
            element.target.classList.add('green');
            elevatorStopsQueue.push(toFloor);
            if (!inMotion) {
                goToSelectedFloors();
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
        inMotion = true;
        while (elevatorStopsQueue.length !== 0) {
            const to = elevatorStopsQueue.shift();
            await moveElevator(currentFloor, to);
        }
        inMotion = false;
    }


    // Elevator Engine Functionality
    async function moveElevator(from, to) {
        doorsActionEl.textContent = 'Closed';
        if (from < to) {
            // move up
            for (let i = from; i <= to; i++) {
                await nextFloor(i);
            }
        } else if (from > to) {
            // move down
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
    };

    async function stopOnFloor(floor) {
        doorsActionEl.textContent = 'Open';
        const elements = document.getElementsByClassName(floor);
        for (let i = 0; i < elements.length; i++) {
            [...elements[i].children].forEach(element => {
                element.classList.remove('green');
            });
        }
        await sleep(2000);
    }

})();