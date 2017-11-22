import {isTraversable} from "./common/roomPosition";
import {getMoveData} from "./common/getMoveData";

Creep.prototype.moveOffRoad = function(towards?: RoomObject): number {
  return moveOffRoad(this, towards);
};

function moveOffRoad(creep: Creep, towards?: RoomObject): number {
  const data = getMoveData(creep);
  if (data.offRoad === Game.time - 1) {
    data.offRoad = Game.time;
    return OK;
  }
  const inOffroadPosition = isOffRoadPosition(creep.pos);
  if (inOffroadPosition) {
    data.path = appendMoveToPath(creep, data);
    data.offRoad = Game.time;
    return OK;
  }
  const positions = getNearbyPositions(creep.pos);
  const validPositions = _.filter(positions,
    (rp: RoomPosition) => isOffRoadPosition(rp) && withinRange(rp, creep.pos, towards) && noCreep(rp));

  if (validPositions.length) {
    data.offRoadFrom = creep.pos;
    return creep.move(creep.pos.getDirectionTo(validPositions[0]));
  } else if (towards) {
    return creep.moveTo(towards, {range: 1});
  }
  return ERR_NO_PATH;
}

function appendMoveToPath(creep: Creep, data: MoveMemory): string | undefined {
  if (data.offRoadFrom) {
    const path =  data.path ? data.path.slice(1, data.path.length) : "";
    const newPath = creep.pos.getDirectionTo(data.offRoadFrom.x, data.offRoadFrom.y) + path;
    data.lastPosition = undefined;
    data.offRoadFrom = undefined;
    return newPath;
  }
  return data.path;
}

function withinRange(rp: RoomPosition, startPos: RoomPosition, towards?: RoomObject): boolean {
  if (!towards) {
    return true;
  }
  return rp.getRangeTo(towards) <= startPos.getRangeTo(towards);
}

function noCreep(rp: RoomPosition): boolean {
  return rp.lookFor(LOOK_CREEPS).length === 0;
}

function isOffRoadPosition(rp: RoomPosition): boolean {
  return isTraversable(rp) &&
    !_.some(rp.lookFor(LOOK_STRUCTURES), (s: Structure): boolean => s instanceof StructureRoad);
}

function getNearbyPositions(startPos: RoomPosition): RoomPosition[] {
  const positions: RoomPosition[] = [];
  const offsets = [-1, 0, 1];
  _.forEach(offsets, (x: number) =>
    _.forEach(offsets, (y: number) => {
      const p = new RoomPosition(startPos.x + x, startPos.y + y, startPos.roomName);
      if (p.x > 0 && p.x < 49 && p.y > 0 && p.y < 49) {
        positions.push(p);
      }
    }));
  return positions;
}
