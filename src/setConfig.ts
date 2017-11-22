const defaultConfig: CreepsMovementConfig = {
    allies: [],
    visualise: true,
    calculateWeights: true,
    trackHostileRooms: false,
    staticCreepFilter: defaultIsStatic,
    defaultStuckLimit: 5,
};

export let CREEPS_MOVEMENT_CONFIG: CreepsMovementConfig = defaultConfig;

export function setConfigWithDefaults(cfg: CreepsMovementConfig): void {
    CREEPS_MOVEMENT_CONFIG = _.defaults(cfg, defaultConfig);
}

function defaultIsStatic(creep: Creep): boolean {
    return !!creep.memory && creep.memory._moveStatic;
}
