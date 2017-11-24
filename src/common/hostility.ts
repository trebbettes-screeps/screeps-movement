import {CREEPS_MOVEMENT_CONFIG} from "../config";

export function roomHostilityCheck(roomName: string): boolean {
    return CREEPS_MOVEMENT_CONFIG.trackHostileRooms && Memory.rooms[roomName] && Memory.rooms[roomName]._hostile;
}

export function setHostileRoom(room: Room): void {
    if (CREEPS_MOVEMENT_CONFIG.trackHostileRooms) {
        room.memory._hostile = roomIsHostile(room);
    }
}

function roomIsHostile(room: Room): true | undefined {
    const c = room.controller;
    if (!c || !c.owner || c.my || c.level < 3) {
        return;
    }
    if (CREEPS_MOVEMENT_CONFIG.allies && _.contains(CREEPS_MOVEMENT_CONFIG.allies, c.owner.username)) {
        return;
    }
    return true;
}
