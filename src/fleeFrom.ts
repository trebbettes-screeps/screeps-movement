import {getCostMatrix} from "./common/costMatrix";
import {creepHasMoved, creepIsStuck} from "./common/creep";
import {getMoveData} from "./common/getMoveData";
import {serialisePath} from "./common/serialisePath";
import {visualisePath} from "./common/visualisePath";

Creep.prototype.fleeFrom = function(targets: RoomObject[], dist?: number, maxRooms?: number): number {
    return fleeFrom(this, targets, dist, maxRooms);
};

function fleeFrom(creep: Creep, targets: RoomObject[], dist: number = 10, maxRooms: number = 1): number {
    const inRange = _.some(targets, (ro: RoomObject) => creep.pos.getRangeTo(ro) < dist);
    let data = getMoveData(creep);

    if (!inRange) {
        creep.memory._move = {};
        return OK;
    }

    if (data.fleeTick && data.fleeTick < Game.time - 1) {
        data = getMoveData(creep, true);
    }

    data.fleeTick = Game.time;

    if (!data.fleePath || !data.fleePath.length) {
        data.stuck = 0;
        data.fleePath = getPath(creep, targets, dist, maxRooms);

    } else if (creepHasMoved(creep)) {
        data.stuck = 0;
        data.fleePath = trimFleePath(data);

    } else if (creepIsStuck(creep, {maxStuck: 2})) {
        data.stuck = 0;
        data.fleePath = getPath(creep, targets, dist, maxRooms);
    }
    data.lastPosition = creep.pos;

    if (data.fleePath && data.fleePath.length > 0) {
        const direction = Number(data.fleePath.slice(0, 1));
        return creep.move(direction);
    }
    return ERR_NO_PATH;
}

function getPath(creep: Creep, targets: RoomObject[], range: number, maxRooms?: number): string {
    const goals = _.map(targets, (t: RoomObject) => ({pos: t.pos, range}));
    const pathResult = PathFinder.search(creep.pos, goals, {
      flee: true,
      maxRooms,
      plainCost: 2,
      roomCallback: (roomName: string): CostMatrix | boolean => getCostMatrix(roomName, creep.pos.roomName),
    });
    visualisePath(pathResult.path, "yellow");
    return serialisePath(creep.pos, pathResult.path);
}

function trimFleePath(data: MoveMemory): string {
    data.fleePath = data.fleePath || "";
    return data.fleePath.slice(1, data.fleePath.length);
}
