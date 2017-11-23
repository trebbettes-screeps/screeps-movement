import {visualisePath} from "./common/visualisePath";
import {serialisePath} from "./common/serialisePath";
import {creepHasMoved, creepIsStuck} from "./common/creep";
import {getTerrainCosts} from "./common/terrainCosts";
import {isTraversable, positionInDirection} from "./common/roomPosition";
import {getCostMatrix} from "./common/costMatrix";
import {getMoveData} from "./common/getMoveData";
import {isSkRoom} from "./common/getRoomType";

Creep.prototype.moveTo = function(...args: any[]): any {
    const xyMove = args[0] instanceof Number;
    const pos = xyMove ? new RoomPosition(args[0], args[1], this.pos.roomName) : args[0].pos || args[0];
    const opts = xyMove ? args[2]  : args[1];
    return moveTo(this, pos, opts);
};

function moveTo(creep: Creep, target: RoomPosition, opts: MovementOptions = {}): number {
  if (creep.spawning || creep.fatigue) {
    return OK;
  }
  if (withinRange(creep, target, opts)) {
    creep.memory._move = undefined;
    return OK;
  }

  let data = getMoveData(creep);
  if (needsNewPath(creep, target, opts, data)) {
    data = getMoveData(creep, true); // RESET MEMORY
    data.dest = target;
    data.path = getPathAsString(creep, target, opts);

  } else if (creepHasMoved(creep)) {
    data.stuck = undefined;
    data.path = trimPath(data);

  } else if (creepIsStuck(creep, opts, target)) {
    data.stuck = undefined;
    opts.avoidCreeps = true;
    data.path = getPathAsString(creep, target, opts);

  } else if (opts.pushPastFilter) {
    pushPast(creep, opts, data);

  }

  data.lastPosition = creep.pos;
  data.offRoad = undefined;

  if (data.path && data.path.length > 0) {
    data.lastMoveAttempt = Game.time;
    const direction = Number(data.path.slice(0, 1));
    return creep.move(direction);
  }

  return ERR_NO_PATH;
}

function trimPath(data: MoveMemory): string {
    data.path = data.path || "";
    return data.path.slice(1, data.path.length);
}

function needsNewPath(c: Creep, target: RoomPosition, opts: MovementOptions, data: MoveMemory): boolean {
  return !data.path || data.path.length === 0 || targetHasChanged(data, target) || needsSkRepath(c, opts, data);
}

function needsSkRepath(creep: Creep, opts: MovementOptions, data: MoveMemory): boolean {
    if (creep.room.controller || !opts.avoidSk || !data.lastPosition) {
        return false;
    }

    if (data.lastPosition.roomName === creep.pos.roomName || !isSkRoom(creep.room.name)) {
        return false;
    }

    opts.avoidRooms = opts.avoidRooms || [];
    opts.avoidRooms.push(data.lastPosition.roomName);
    return true;
}

function getPathAsString(creep: Creep, target: RoomPosition, opts: PathFinderOpts): string {
    const pathResult = getPath(creep, target, opts);
    const colour = pathResult.incomplete ? "red" : opts.avoidCreeps ? "orange" : "white";
    visualisePath([creep.pos, ...pathResult.path], colour);
    return serialisePath(creep.pos, pathResult.path);
}

function withinRange(creep: Creep, target: RoomPosition, opts: MovementOptions): boolean {
    const range = creep.pos.getRangeTo(target);
    return !range || (!!opts.range && range <= opts.range);
}

function targetHasChanged(data: MoveMemory, tgt: RoomPosition): boolean {
    const d = data.dest;
    return !d || d.x !== tgt.x || d.y !== tgt.y || d.roomName !== tgt.roomName;
}

function getPath(creep: Creep, target: RoomPosition, opts: MovementOptions): PathFinderPath {
  const avoidIn = opts.avoidCreeps ? creep.pos.roomName : undefined;
  const terrainCosts = getTerrainCosts(creep);
  opts.plainCost = opts.plainCost === undefined ? terrainCosts.plains : opts.plainCost;
  opts.swampCost = opts.swampCost === undefined ? terrainCosts.swamp : opts.swampCost;
  opts.range = opts.range === undefined ? (isTraversable(target) ? 0 : 1) : opts.range;
  opts.roomCallback = (name: string) => getCostMatrix(name, avoidIn, opts);

  return PathFinder.search(creep.pos, {pos: target, range: opts.range}, opts);
}

function pushPast(creep: Creep, opts: MovementOptions, data: MoveMemory): void {
    const predicate = opts.pushPastFilter;
    if (!predicate) {
        return;
    }

    if (!data.path || (!data.stuck && data.lastPush !== Game.time - 1)) {
        return;
    }

    const pos = positionInDirection(creep.pos, Number(data.path.slice(0, 1)));
    if (!pos) {
        return;
    }

    const otherCreep = pos.lookFor<Creep>(LOOK_CREEPS)[0];
    if (!otherCreep || !otherCreep.my || !predicate(otherCreep)) {
        return;
    }

    const otherData = getMoveData(otherCreep);
    if (otherData.lastMoveAttempt && otherData.lastMoveAttempt >= Game.time - 1) {
        return;
    }

    data.lastPush = Game.time;
    otherCreep.move(otherCreep.pos.getDirectionTo(creep));
    otherCreep.memory._move = undefined;
}
