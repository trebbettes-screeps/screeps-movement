export const isSkRoom = _.memoize((roomName: string): boolean => {

    const coordinates = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
    if (!coordinates) {
        return false;
    }

    const x = Number(coordinates[1]) % 10;
    const y = Number(coordinates[2]) % 10;

    if (x === 5 && y === 5) {
        return false;
    }

    return x >= 4 && x <= 6 && y >= 4 && y <= 6;

});
