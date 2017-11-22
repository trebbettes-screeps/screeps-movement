Creep.prototype.moveToRoom = function(roomName: string, range?: number): number {
  return moveToRoom(this, roomName);
};

function moveToRoom(creep: Creep, roomName: string, range: number = 23): number {
  return creep.moveTo(new RoomPosition(25, 25, roomName), {
      avoidSk: true,
      maxOps: 10000,
      range: range,
  });
}
