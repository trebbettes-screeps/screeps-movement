export function serialisePath(startPos: RoomPosition, positions: RoomPosition[]): string {
    let path = "";
    if (positions.length === 0) {
        return path;
    }
    for (let i = 0; i < positions.length; i++) {
        const position = positions[i];
        if (i === 0 && startPos.roomName === positions[i].roomName) {
            path += startPos.getDirectionTo(position);
        }
        const nextPosition = positions[i + 1];
        if (nextPosition && nextPosition.roomName === position.roomName) {
            path += position.getDirectionTo(nextPosition);
        }
    }
    return path;
}
