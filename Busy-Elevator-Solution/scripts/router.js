import * as engine from './engine.js';

export const routesQueue = [];
export const elevatorState = {
    inMotion: false,
    direction: '',
    from: '',
    to: ''
};

export async function goToSelectedFloors() {
    elevatorState.inMotion = true;
    while (routesQueue.length !== 0) {
        const currentRoute = routesQueue.shift();
        // elevatorState.from = engine.currentFloor;
        // elevatorState.to = to;
        console.log(currentRoute);
        await engine.moveElevator(engine.currentFloor, currentRoute);
    }
    elevatorState.inMotion = false;
}

export function addToRoutesQueue(floor, direction) {
    for (const route of routesQueue) {
        if (route.stops.includes(floor) || route.end == floor) {
            break;
        }
        if (direction) {
            if (direction !== route.direction) {
                continue;
            }
        }
        if (route.direction === 'up') {
            if (floor < route.start || floor > route.end) {
                continue;
            }
        } else {
            if (floor > route.start || floor < route.end) {
                continue;
            }
        }

        route.stops.push(floor);
        route.stops.sort((a, b) => a - b);
        return;
    }

    const route = createRoute(floor);
    routesQueue.push(route);
}

function createRoute(floor) {
    const route = {
        stops: [],
        end: +floor
    }

    if (routesQueue.length > 0) {
        route.start = routesQueue[routesQueue.length - 1].end;
    } else {
        route.start = engine.currentFloor;
    }

    if (route.start < route.end) {
        route.direction = 'up';
    } else {
        route.direction = 'down';
    }

    return route;
}

export function canHaveIntermediateStop(toFloor, direction) {
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