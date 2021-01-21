import * as engine from './engine.js';

export const elevatorStopsQueue = [];
export const elevatorState = {
    inMotion: false,
    direction: '',
    from: '',
    to: ''
};

export async function goToSelectedFloors() {
    elevatorState.inMotion = true;
    while (elevatorStopsQueue.length !== 0) {
        const to = elevatorStopsQueue.shift();
        elevatorState.from = engine.currentFloor;
        elevatorState.to = to;
        await engine.moveElevator(engine.currentFloor, to);
    }
    elevatorState.inMotion = false;
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