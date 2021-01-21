import * as dom from './dom.js';
import * as router from './router.js';

// Elevator Engine Functionality
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

export let currentFloor = 4;
export let flagFloor = '';

export async function moveElevator(from, to) {
    dom.doorsActionEl.textContent = 'Closed';
    if (from < to) {
        // move up
        router.elevatorState.direction = 'up';
        for (let i = from; i <= to; i++) {
            await nextFloor(i);
        }
    } else if (from > to) {
        // move down
        router.elevatorState.direction = 'down';
        for (let i = from; i >= to; i--) {
            await nextFloor(i);
        }
    }
    await stopOnFloor(to);
};

async function nextFloor(floor) {
    // suboptimal => slow initial start
    await sleep(1000);
    currentFloor = floor;
    dom.currentFloorEl.textContent = floor;
    if (flagFloor == floor) {
        await stopOnFloor(floor);
        flagFloor = '';
    }
};

export async function stopOnFloor(floor) {
    dom.doorsActionEl.textContent = 'Open';
    router.elevatorState.direction = '';
    const elements = document.getElementsByClassName(floor);
    for (let i = 0; i < elements.length; i++) {
        [...elements[i].children].forEach(element => {
            element.classList.remove('green');
        });
    }
    await sleep(2000);
}