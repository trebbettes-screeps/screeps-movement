import {CREEPS_MOVEMENT_CONFIG} from "../setConfig";

export function getTerrainCosts(creep: Creep): { plains: number, swamp: number } {
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
    const calcCarry = CREEPS_MOVEMENT_CONFIG.calculateCarryWeight;

    const unWeightedParts = calcCarry ? [MOVE, CARRY] : [MOVE];
    const bodyParts = _.countBy(creep.body,
        (p: BodyPartDefinition) => _.contains(unWeightedParts, p.type) ? p.type : "weighted");

    bodyParts.weighted = bodyParts.weighted || 0;
    return {
        move: bodyParts.move || 0,
        weighted: bodyParts[CARRY] ? Math.ceil(_.sum(creep.carry) / 50) + bodyParts.weighted : bodyParts.weighted,
    };
}
