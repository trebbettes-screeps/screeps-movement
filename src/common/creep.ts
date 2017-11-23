import {CREEPS_MOVEMENT_CONFIG} from "../config";
import {getMoveData} from "./getMoveData";

function positionIsBlocked(creep: Creep, target: RoomPosition, range: number = 0): boolean {
    if (creep.pos.getRangeTo(target) > range) {
        return false;
    }
    return target.lookFor(LOOK_CREEPS).length > 0;
}

export function creepIsStuck(creep: Creep, opts: MovementOptions, checkAvailability?: RoomPosition): boolean {
    const data = getMoveData(creep);
    if (checkAvailability && positionIsBlocked(creep, checkAvailability, opts.range)) {
        data.stuck = 0;
        return false;
    }
    data.stuck = (data.stuck || 0) + 1;
    const maxStuck = opts.maxStuck || CREEPS_MOVEMENT_CONFIG.defaultStuckLimit || 5;
    if (CREEPS_MOVEMENT_CONFIG.visualise && data.stuck > 1 && data.stuck < maxStuck) {
        const radius = data.stuck / (maxStuck - 1) / 2;
        creep.room.visual.circle(creep.pos, {fill: "#680000", radius});
    }
    return !!data.stuck && data.stuck >= maxStuck;
}

export function creepHasMoved(creep: Creep): boolean {
    const data = getMoveData(creep);
    if (bouncingOnExit(creep, data)) {
        return false;
    }
    if (data.lastPosition) {
        return !creep.pos.isEqualTo(data.lastPosition.x, data.lastPosition.y);
    }
    return false;
}

function isExitTile(pos: RoomPosition): boolean {
    return pos.x === 0 || pos.x === 49 || pos.y === 0 || pos.y === 49;
}

function bouncingOnExit(creep: Creep, data: MoveMemory): boolean {
    return isExitTile(creep.pos) && isExitTile(_.create(RoomPosition.prototype, data.lastPosition));
}
