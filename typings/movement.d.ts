declare module 'screeps-movement' {
    function setConfig(cfg: CreepsMovementConfig): void;
}

interface Creep {
    fleeFrom(targets: RoomObject[], dist?: number, maxRooms?: number): number;
    moveOffRoad(towards?: RoomObject, maxRange?: number): number;
    moveToRoom(roomName: string): number;
    setStatic(value?: boolean): void;
    isStatic(): boolean;
}

interface CreepsMovementConfig {
    allies?: string[];
    visualise?: boolean;
    calculateWeights?: boolean;
    trackHostileRooms?: boolean;
    defaultStuckLimit?: number;
    staticCreepFilter?: (creep: Creep) => boolean | false;
}

interface MoveToOpts {
    avoidSk?: boolean;
    maxStuck?: number;
    plainCost?: number;
    swampCost?: number;
    avoidRooms?: string[];
    avoidCreeps?: boolean;
    avoidHostileRooms?: boolean;
    roomCallback?: (roomName: string) => CostMatrix | boolean;
    range?: number;
    pushPastFilter?: (creep: Creep) => boolean;
}

interface MoveMemory {
    lastPosition?: RoomPosition;
    lastMoveAttempt?: number;
    stuck?: number;
    path?: string;
    dest?: RoomPosition;
    onExitTile?: boolean;
    fleePath?: string;
    fleeTick?: number;
    offRoad?: number;
    offRoadFrom?: RoomPosition;
    lastPush?: number;
}

interface PathFinderOpts {
    avoidRooms?: string[];
    avoidCreeps?: boolean;
    avoidHostileRooms?: boolean;
    avoidSk?: boolean;
    maxStuck?: number;
    range?: number;
    pushPastFilter?: (creep: Creep) => boolean;
}

type MovementOptions = PathFinderOpts | MoveToOpts;

interface Room {
    __skMatrix: CostMatrix;
    __creepMatrix: CostMatrix;
    __defaultMatrix: CostMatrix;
}

interface CreepMemory {
    _move?: MoveMemory;
    _skRepath?: string;
    _moveStatic?: boolean;
}

interface RoomMemory {
    _hostile?: boolean;
}
