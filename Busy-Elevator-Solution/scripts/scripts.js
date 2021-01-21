import * as engine from './engine.js';
import * as dom from './dom.js';
import * as router from './router.js';

(function() {

    dom.outsidePanelEl.addEventListener('click', ousidePanelHandler);
    dom.insidePanelEl.addEventListener('click', insidePanelHandler);


    let idleTimeout;

    dom.currentFloorEl.textContent = engine.currentFloor;
    dom.doorsActionEl.textContent = 'Open';

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
            if (router.canHaveIntermediateStop(toFloor, direction)) {
                engine.flagFloor = toFloor;
            } else {
                router.elevatorStopsQueue.push(toFloor);
                if (!router.elevatorState.inMotion) {
                    router.goToSelectedFloors();
                }
            }

        }
        startIdle();
    }

    // Idle Functionality
    function startIdle() {
        idleTimeout = setTimeout(() => engine.moveElevator(engine.currentFloor, 4), 120000);
    }

    function stopIdle() {
        clearTimeout(idleTimeout);
    }

})();