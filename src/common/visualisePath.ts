import {CREEPS_MOVEMENT_CONFIG} from "../setConfig";

export function visualisePath(positions: RoomPosition[], color: string): void {
    if (!CREEPS_MOVEMENT_CONFIG.visualise) {
        return;
    }
    const byRoom = _.groupBy(positions, (rp: RoomPosition) => rp.roomName);
    _.forEach(byRoom, (roomPositions: RoomPosition[], roomName: any): void => {
        if (Game.rooms[roomName]) {
            const points = _.map(roomPositions, (p: RoomPosition) => [p.x, p.y] as [number, number]);
            Game.rooms[roomName].visual.poly(points, {lineStyle: "dashed", stroke: color});
        }
    });
}
