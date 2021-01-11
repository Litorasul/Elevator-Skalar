(function() {
    const currentFloorEl = document.querySelector('.current-floor');
    const doorsActionEl = document.querySelector('.doors-action');
    const outsidePanelEl = document.querySelector('.outside-panel');
    const insidePanelEl = document.querySelector('.inside-panel');

    outsidePanelEl.addEventListener('click', ousidePanelHandler);
    insidePanelEl.addEventListener('click', insidePanelHandler);

    let currentFloor = 4;
    let idleTimeout;

    currentFloorEl.textContent = currentFloor;
    doorsActionEl.textContent = 'Open';

    // Buttons Interaction
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

            moveElevator(currentFloor, toFloor);
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
        doorsActionEl.textContent = 'Open';
    };

    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

    async function nextFloor(floor) {
        // suboptimal => slow initial start
        await sleep(1000);
        currentFloor = floor;
        currentFloorEl.textContent = floor;
    };

})();