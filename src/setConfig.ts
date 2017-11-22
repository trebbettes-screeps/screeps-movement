const defaultConfig: CreepsMovementConfig = {
    calculateCarryWeight: false,
    defaultStuckLimit: 5,
    staticCreepFilter: defaultIsStatic,
    trackHostileRooms: false,
    visualise: true,
};

export let CREEPS_MOVEMENT_CONFIG: CreepsMovementConfig = defaultConfig;

export function setConfigWithDefaults(cfg: CreepsMovementConfig): void {
    CREEPS_MOVEMENT_CONFIG = _.defaults(cfg, defaultConfig);
}

function defaultIsStatic(creep: Creep): boolean {
    return !!creep.memory && creep.memory._moveStatic;
}
