import {CREEPS_MOVEMENT_CONFIG} from "../config";
import {isSkRoom} from "./getRoomType";
import {roomHostilityCheck} from "./hostility";
import {isBlocking, isTraversable} from "./roomPosition";

export function getCostMatrix(roomName: string, avoidCreepsIn?: string, opts?: MovementOptions): CostMatrix | boolean {

    if (opts && opts.avoidRooms && _.contains(opts.avoidRooms, roomName)) {
        return false;
    }

    if (roomHostilityCheck(roomName)) {
        return false;
    }

    const room = Game.rooms[roomName];
    if (room) {
        if (avoidCreepsIn && roomName === avoidCreepsIn) {
            return getCreepMatrix(room);
        } else if (opts && opts.avoidSk && isSkRoom(roomName)) {
            return getSkMatrix(room);
        } else {
            return getDefaultMatrix(room);
        }
    }
    return true;
}

export function getDefaultMatrix(room: Room): CostMatrix {
    if (room.__defaultMatrix) {
        return room.__defaultMatrix;
    }

    const matrix = new PathFinder.CostMatrix();

    _.forEach(room.find(FIND_STRUCTURES), (s: Structure) => {
        if (s instanceof StructureRoad) {
            matrix.set(s.pos.x, s.pos.y, 1);
        } else if (isBlocking(s)) {
            matrix.set(s.pos.x, s.pos.y, 0xff);
        }
    });

    _.forEach(room.find(FIND_CONSTRUCTION_SITES), (cs: ConstructionSite): void => {
        if (isBlocking(cs)) {
            matrix.set(cs.pos.x, cs.pos.y, 0xff);
        }
    });

    if (CREEPS_MOVEMENT_CONFIG.staticCreepFilter) {
        _.forEach(room.find(FIND_CREEPS), (c: Creep): void => {
            if (CREEPS_MOVEMENT_CONFIG.staticCreepFilter!(c)) {
                matrix.set(c.pos.x, c.pos.y, 0xff);
            }
        });
    }

    return room.__defaultMatrix = matrix;
}

export function getCreepMatrix(room: Room): CostMatrix {
    if (room.__creepMatrix) {
        return room.__creepMatrix;
    }
    const clonedMatrix = getDefaultMatrix(room).clone();

    _.forEach(room.find(FIND_CREEPS), (c: Creep) => {
        clonedMatrix.set(c.pos.x, c.pos.y, 0xff);
    });

    return room.__creepMatrix = clonedMatrix;
}

export function getSkMatrix(room: Room): CostMatrix {
    if (room.__skMatrix) {
        return room.__skMatrix;
    }
    const matrix = getDefaultMatrix(room).clone();
    const toAvoid = [
        ...room.find<RoomObject>(FIND_SOURCES),
        ...room.find(FIND_MINERALS),
    ];
    const range = 4;
    _.forEach(toAvoid, (center: RoomObject) => {
        for (let xO = -range; xO <= range; xO++) {
            for (let yO = -range; yO <= range; yO++) {
                if (isTraversable(new RoomPosition(center.pos.x + xO, center.pos.y + yO, room.name))) {
                    matrix.set(center.pos.x + xO, center.pos.y + yO, 0xff);
                }
            }
        }
    });
    return room.__skMatrix = matrix;
}
