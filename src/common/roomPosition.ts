const PASSABLE_STRUCTURES = [STRUCTURE_ROAD, STRUCTURE_CONTAINER, STRUCTURE_PORTAL];

function passableConstructionSite(site: ConstructionSite): boolean {
    return !site.my || site.structureType === STRUCTURE_RAMPART || _.contains(PASSABLE_STRUCTURES, site.structureType);
}

function passableStructure(structure: Structure): boolean {
    return _.contains(PASSABLE_STRUCTURES, structure.structureType) || accessibleRampart(structure);
}

function accessibleRampart(structure: Structure): boolean {
    return structure instanceof StructureRampart && (structure.my || structure.isPublic);
}

export function isBlocking(thing: Structure | ConstructionSite): boolean {
    if (thing instanceof Structure) {
        return !passableStructure(thing);
    }
    return !passableConstructionSite(thing);
}

export function isTraversable(pos: RoomPosition): boolean {
    if (pos.x < 0 || pos.x > 49 || pos.y < 0 || pos.y > 49) {
        return false;
    }
    if (_.includes(OBSTACLE_OBJECT_TYPES, pos.lookFor<string>(LOOK_TERRAIN)[0])) {
        return false;
    }

    if (Game.rooms[pos.roomName]) {
        if (_.find(pos.lookFor(LOOK_STRUCTURES), isBlocking)) {
            return false;
        }
        if (_.find(pos.lookFor(LOOK_CONSTRUCTION_SITES), isBlocking)) {
            return false;
        }
    }
    return true;
}

const offsets: { [dir: number]: [number, number] } = {
    [TOP]: [0, -1],
    [TOP_RIGHT]: [+1, -1],
    [RIGHT]: [+1, 0],
    [BOTTOM_RIGHT]: [+1, +1],
    [BOTTOM]: [0, +1],
    [BOTTOM_LEFT]: [-1, +1],
    [LEFT]: [-1, 0],
    [TOP_LEFT]: [-1, -1],
};

export function positionInDirection(startPos: RoomPosition, direction: number): RoomPosition | null {
    const [xOffset, yOffset]: number[] = offsets[direction];
    const x = startPos.x + xOffset;
    const y = startPos.y + yOffset;
    if (x > 49 || x < 0 || y > 49 || y < 0) {
        return null;
    }
    return new RoomPosition(x, y, startPos.roomName);
}
