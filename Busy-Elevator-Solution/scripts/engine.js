import * as dom from './dom.js';

// Elevator Engine Functionality
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

export let currentFloor = 4;
export let flagFloor = '';

export async function moveElevator(from, route) {
    dom.doorsActionEl.textContent = 'Closed';
    if (from < route.end) {
        // move up
        for (let i = from; i <= route.end; i++) {
            await nextFloor(i, route.stops);
        }
    } else if (from > route.end) {
        // move down
        for (let i = from; i >= route.end; i--) {
            await nextFloor(i, route.stops);
        }
    }
    await stopOnFloor(route.end);
};

async function nextFloor(floor, stops) {
    // suboptimal => slow initial start
    await sleep(1000);
    currentFloor = floor;
    dom.currentFloorEl.textContent = floor;
    if (stops[0] == floor) {
        await stopOnFloor(floor);
        stops.shift();
    }
};

export async function stopOnFloor(floor) {
    dom.doorsActionEl.textContent = 'Open';
    const elements = document.getElementsByClassName(floor);
    for (let i = 0; i < elements.length; i++) {
        [...elements[i].children].forEach(element => {
            element.classList.remove('green');
        });
    }
    await sleep(2000);
}