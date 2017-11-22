# Screeps Movement
This package is a replacement for the standard Screeps `moveTo` function.

It has the following features:

- Path caching / stuck detection
- Avoids static creeps
- Push past other creeps
- Calculates terrain costs
- Avoid source keepers
- Avoid / track hostile rooms

In addition it adds the following methods to the Creep type:

- moveToRoom
- moveOffRoad
- fleeFrom

## Install:
Install via NPM in your local dev environment `npm install screeps-movement`.

Or if you are using the screeps client then create a new module called 'screeps-movement' and 
copy the contents of [this](https://github.com/trebbettes-screeps/screeps-movement/blob/master/dist/movement.js) file into it.

## Usage
Import the module in your `main` file. (At the top outside the loop)

JavaScript: 

```
const Movement = require("screeps-movement");
```

TypeScript: 

```
import * as Movement from "screeps-movement";
``` 

### Configuration
Optionally, you can apply some custom configuration. It isRecommended to do this immediately after the import statement.
```
Movement.setConfig({
  allies: ["SomeOf", "YourFriends", "Usernames"],
  calculateWeights: true,
  defaultStuckLimit: 5,
  staticCreepFilter: (creep) => creep.memory.role === "miner",
  trackHostileRooms: true,
  visualise: true,
});
```

#### creep.moveTo(target, opts?);
The replacement `moveTo` may possibly work with any standard `moveTo` calls you make at present.
However additional options have been added that you can now take advantage of.

Any option you can currently pass in via either the `PathFinderOpts` or `MoveToOpts` as doucmented in the official screeps
documentation has at least a slight chance of working correctly.

However certain things, such as setting the `roomCallBack` will not work or cause unintended consiquences. As such it is
recommended that you use the following options.

```
worker.moveTo(target.pos, {
    avoidSk?: boolean,                          // Avoid SourceKeepers
    maxStuck?: number,                          // Max ticks before repathing due to being stuck
    plainCost?: number,                         // Plain cost (calculated if not specified)
    swampCost?: number,                         // Swamp cost (calculated if not specified)
    avoidRooms?: string[],                      // An array of roomNames to avoid
    avoidCreeps?: boolean,                      // Avoid creeps when pathing
    avoidHostileRooms?: boolean,                // Avoid tracked hostile rooms if trackHostileRooms option is enabled globally
    range?: number,                             // The range to the target you want to reach
    pushPastFilter?: (creep) => boolean,        // A predicate to determin if the creep should push past another creep.
});
```

```
miner.moveTo(source, {
    range: 1,
    pushPastFilter: (creep) => creep.memory.role === "hauler",
});
```

#### creep.moveToRoom(roomName, range?);

Your creep will move to the given room at the given range from room center (default 23).

```
creep.moveToRoom("W7N4"); 
creep.moveToRoom("W7N4", 30); // Move to 5 tiles away from the room.
creep.moveToRoom("W7N4", 10); // Move 15 tiles into the room. 
```


#### creep.moveOffRoad(towards?);

Your creep will move off road.

*towards* - Optional. `RoomObject` | `RoomPosition`.
  
If specified the creep will only move onto an off road spot that is of equal or lesser distance than its current position.
The creep will move towards the target if no offroad spot can be found.

```
if (container.store.energy > creep.carryCapacity || creep.pos.getRangeTo(container) > 5) {
    creep.moveTo(container);
} else {
    creep.moveOffRoad(container);
}
```

#### creep.fleeFrom(targets, distance?, maxRooms?);
Your creep will flee from the targets up to the distance specified (default 10).
maxRooms can optionally be set (default 1).

```
const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
if (enemies.length > 0 && creep.pos.findInRange(enemies, 10).length) {
    creep.fleeFrom(enemies, 7);
}
```
