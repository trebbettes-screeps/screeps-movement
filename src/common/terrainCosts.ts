import {CREEPS_MOVEMENT_CONFIG} from "../setConfig";

export function getTerrainCosts(creep: Creep): { plains: number, swamp: number } {
    if (!CREEPS_MOVEMENT_CONFIG.calculateWeights) {
        return {plains: 2, swamp: 5};
    }
    const data = getCreepWeightInfo(creep);
    const ratio = data.weighted / data.move;
    return {
        plains: ratio <= 1 ? 1 : 2,
        swamp: getSwampCost(ratio),
    };
}

function getSwampCost(ratio: number): number {
    const clamped = ratio < 0.2 ? 0.2 : ratio > 1 ? 1 : ratio;
    return Math.ceil(clamped * 5);
}

function getCreepWeightInfo(creep: Creep): { weighted: number, move: number } {
    const bodyParts = _.countBy(creep.body,
        (p: BodyPartDefinition) => p.type === MOVE || p.type === CARRY ? p.type : "weighted");

    bodyParts.weighted = bodyParts.weighted || 0;
    return {
        move: bodyParts.move || 0,
        weighted: bodyParts[CARRY] ? Math.ceil(_.sum(creep.carry) / 50) + bodyParts.weighted : bodyParts.weighted,
    };
}
