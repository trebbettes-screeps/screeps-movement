export function getMoveData(creep: Creep, reset?: boolean): MoveMemory {
    creep.memory._move = reset ? {} : creep.memory._move || {};
    return creep.memory._move;
}
