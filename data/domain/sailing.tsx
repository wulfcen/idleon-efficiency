import { initArtifactRepo } from "./data/ArtifactRepo";
import { initIslandInfoRepo, IslandInfoBase } from "./data/IslandInfoRepo";
import { CaptainBonusBase, initCaptainBonusRepo } from './data/CaptainBonusRepo';
import { CaptainBonusModel } from './model/captainBonusModel';
import { GemStore } from "./gemPurchases";
import { ImageData } from "./imageData";
import { IslandInfoModel } from "./model/islandInfoModel";
import { Player } from "./player";
import { SkillsIndex } from "./SkillsIndex";
import { LootyInfo } from "./lootyTracker";
import { Artifact, AshenUrnArtifact, FauxoryTuskArtifact, GenieLampArtifact, ManekiKatArtifact, OperaMaskArtifact, SlabInfluencedArtifact, TriagulonArtifact, WeatherbookArtifact } from "./sailing/artifacts";
import { Cooking } from "./cooking";
import { Sigils } from "./sigils";
import { Divinity } from "./divinity";
import { Card } from "./cards";
import { Alchemy } from "./alchemy";
import { Stamp } from "./stamps";
import { PlayerStatues } from "./statues";

// "Captains": [
//     [0,0,-1,3,6.75,2,0],
//     [0,1,-1,4,259.25,6,0],

// [3] == level
// [0] == Trait1?
// [1] == Trait2?
// [5] == Base of trait 1
// [6] == Base of trait 2

const captainBonuses = initCaptainBonusRepo();

export enum IslandStatus {
    Discoverd,
    Hidden
}

export class CaptainTrait {
    bonus: CaptainBonusModel;
    traitIndex: number;
    constructor(bonus: CaptainBonusBase, public baseValue: number, public currentBonus: number) {
        this.bonus = bonus.data;
        this.traitIndex = bonus.index;
    }

    getBonusText = (includeBase: boolean = true) => {
        return `+${this.currentBonus}%${includeBase ? `(${this.baseValue})` : ""}`;
        //return this.bonus.bonus.replace("{", this.currentBonus.toString());   
    }

    getImageData = () => {
        return {
            location: `SailTra${this.traitIndex}`,
            width: 28,
            height: 23
        }
    }

    static getLootImageData = () => {
        return {
            location: `SailTra1`,
            width: 28,
            height: 23
        }
    }

    static getSpeedImageData = () => {
        return {
            location: `SailTra0`,
            width: 28,
            height: 23
        }
    }
}

export class Captain {
    traits: CaptainTrait[] = [];

    // bonusValues is array of traits, each array holds another array of [traitIndex, bonusValue].
    constructor(public index: number, public level: number, public currentXP: number, traitInfo: number[][]) {
        // If base value is 0, there's no trait.
        traitInfo.forEach(([traitIndex, baseValue]) => {
            if (traitIndex > -1) {
                this.traits.push(new CaptainTrait(captainBonuses[traitIndex], baseValue, baseValue * this.level));
            }
        })
    }

    getExpForNextLevel = () => {
        const firstMath = 9 + Math.pow(this.level, 3);
        const secondMath = Math.pow(1.5, this.level);
        return firstMath * secondMath * Math.pow(1.5, Math.max(this.level - 10, 0));
    }

    getLootBonus = () => {
        return 0;
    }
}

// [1,1,0,10,89.07241619351657,10],
// [2,3,0,10,637.2757311515547,17],
// [0,0,0,9,15.931893278788872,16],
// [3,3,0,12,637.2757311515547,19],
// [-1,-1,-1,5,0,9]

export enum BoatUpgradeType {
    Loot = 0,
    Speed = 1
}
export class Boat {
    sigilBonus: number = 0;
    genieLampBonus: number = 30;

    speed: number = 0;

    // Helper values.
    speedBaseMath = 0;

    constructor(public index: number, public assignIsland: Island | undefined, public distanceTravelled: number, public lootUpgrades: number, public speedUpgrades: number, public captain: Captain | undefined) { }

    getSpeedUpgradeType = () => {
        if (this.index < 2) {
            return this.index;
        }
        if (this.index < 5) {
            return 1 + 2 * (this.index - 2)
        }

        return Math.min(30, 2 * (this.index - 4));
    }

    getLootUpgradeType = () => {
        if (this.index < 4) {
            return 0;
        }

        return Math.min(30, 1 + 2 * (this.index - 4));
    }

    getUpgradeCost = (type: BoatUpgradeType) => {
        const lootType = type == BoatUpgradeType.Loot ? this.getLootUpgradeType() : this.getSpeedUpgradeType();
        const currentUpgradeLevel = type == BoatUpgradeType.Loot ? this.lootUpgrades : this.speedUpgrades;

        if (lootType == 0) {
            return Math.round((5 + 4 * currentUpgradeLevel) * Math.pow(1.17 - .12 * currentUpgradeLevel / (currentUpgradeLevel + 200), currentUpgradeLevel));
        }

        if (lootType % 2 == 1) {
            return Math.round((5 + 2 * currentUpgradeLevel) * Math.pow(1.15 - .1 * currentUpgradeLevel / (currentUpgradeLevel + 200), currentUpgradeLevel))
        }

        return Math.round((2 + currentUpgradeLevel) * Math.pow(1.12 - .07 * currentUpgradeLevel / (currentUpgradeLevel + 200), currentUpgradeLevel));
    }

    getLootValue = (
        { lootUpgrades = this.lootUpgrades, includeCaptain = true }
            : { lootUpgrades?: number, includeCaptain?: boolean } = { lootUpgrades: this.lootUpgrades, includeCaptain: true }
    ) => {
        // Check if captain is boosting the value.
        const captainBonus = includeCaptain ?
            this.captain?.traits.filter(trait => trait.bonus.bonus.includes("Loot Value")).reduce((sum, trait) => sum += trait.currentBonus, 0) ?? 0
            : 0;

        const firstMath = 2 + Math.pow(Math.floor(lootUpgrades / 8), 2);
        return (5 + firstMath * lootUpgrades) * (1 + (this.sigilBonus + (captainBonus + this.genieLampBonus)) / 100);
    }

    getSpeedValue = (
        { speedUpgrades = this.speedUpgrades, includeCaptain = true, islandBound = false }
            : { speedUpgrades?: number, includeCaptain?: boolean, islandBound?: boolean } = { speedUpgrades: this.speedUpgrades, includeCaptain: true, islandBound: false }
    ) => {
        // Check if captain is boosting the value.
        const captainBonus = includeCaptain ?
            this.captain?.traits.filter(trait => trait.bonus.bonus.includes("Boat Speed")).reduce((sum, trait) => sum += trait.currentBonus, 0) ?? 0
            : 0;

        const firstMath = 5 + Math.pow(Math.floor(speedUpgrades / 7), 2);
        const boatSpeed = (10 + firstMath * speedUpgrades) * (1 + captainBonus / 100) * this.speedBaseMath;
        if (islandBound && this.assignIsland) {
            return Math.min(boatSpeed, (this.assignIsland.data.distance * 60) / 120);
        }

        return boatSpeed;
    }
}

export class Island {
    artifacts: Artifact[] = [];
    status: IslandStatus = IslandStatus.Hidden;
    discoverProgress: number = -1;

    constructor(public index: number, public data: IslandInfoModel) { }

    getImageData = (): ImageData => {
        return {
            location: `SailIsland${this.index}`,
            height: 20,
            width: 20,
        }
    }

    static fromBase = (data: IslandInfoBase[]): Island[] => {
        return data.map(island => new Island(island.index, island.data));
    }
}

export class Ship {
    lootLevel: number = 0;
    speedLevel: number = 0;

}

// Sailing: [
//    [-1,-1,-1,-1,3000,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//    [660.9760136675222,176.57040000000018,3.8640000000000043,151.72152500000084,313.4682,23.24000000000001,-0.01,5512.430243750001,40.99,-0.01,-0.01,-0.01,-0.01,-0.01,-0.01,-0.01,-0.01,-0.01,-0.01,-0.01,-0.01,-0.01,-0.01,-0.01,-0.01,-0.01,-0.01,-0.01,-0.01,-0.01,-0.01],
//    [5,5],
//    [1,1,2,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]


export class Sailing {
    artifacts: Artifact[] = Artifact.fromBase(initArtifactRepo());
    islands: Island[] = Island.fromBase(initIslandInfoRepo());
    boats: Boat[] = [];
    captains: Captain[] = [];
    loot: number[] = [];

    maxChests: number = 5;
    captainsUnlocked = 1;
    boatsUnlocked = 1;

    nextCaptainCost = () => {
        return (60 * this.captainsUnlocked + 15 * Math.pow(this.captainsUnlocked, 2)) * Math.pow(1.43, this.captainsUnlocked) * .6;
    }

    nextBoatCost = () => {
        return (60 * this.boatsUnlocked + 15 * Math.pow(this.boatsUnlocked, 2)) * Math.pow(1.43, this.boatsUnlocked);
    }

    constructor() {
        // Map artifacts to islands to make display easier.
        let artifactIndex = 0;
        this.islands.forEach(island => {
            island.artifacts = this.artifacts.slice(artifactIndex, artifactIndex + island.data.artifactsPerIsland);
            artifactIndex += island.data.artifactsPerIsland;
        })
    }
    // if ("NewCaptBoatSlot" == e) return 0 == s ? (60 * r + 15 * Math.pow(r, 2)) * Math.pow(1.43, r) * .6 : (60 * r + 15 * Math.pow(r, 2)) * Math.pow(1.43, r);
    static getLootImageData = (lootIndex: number): ImageData => {
        return {
            location: `SailT${lootIndex}`,
            height: 22,
            width: 22
        };
    }
}

export default function parseSailing(sailingData: number[][], boatData: number[][], captainData: number[][]) {
    const sailing = new Sailing();

    if (sailingData.length == 0) {
        return sailing;
    }

    sailing.loot = sailingData[1];

    // Sailing index 3 = array of artifacts found or not.
    sailingData[3].forEach((artifact, index) => {
        sailing.artifacts[index].updateStatus(artifact);
    })

    sailing.islands.forEach(island => {
        if (sailingData[0][island.index] == -1) {
            island.status = IslandStatus.Discoverd;
        }
        else {
            island.discoverProgress = sailingData[0][island.index];
        }
    });

    sailing.captainsUnlocked = Math.round(sailingData[2][0] + 1);
    sailing.boatsUnlocked = Math.round(sailingData[2][1] + 1);

    captainData.forEach((captain, cIndex) => {
        if (cIndex < sailing.captainsUnlocked && captain[0] != -1) {
            sailing.captains.push(new Captain(cIndex, captain[3], captain[4], [[captain[1], captain[5]], [captain[2], captain[6]]]));
        }
    })

    // [1,4,1,14,1827.7902880492559,17],
    // [2,4,1,14,1290.5608459374048,23]
    boatData.forEach((boat, bIndex) => {
        if (bIndex < sailing.boatsUnlocked && (boat[3] + boat[5]) != 0) {
            const boatCaptain = boat[0] < sailing.captains.length ? sailing.captains[boat[0]] : undefined;
            const targetIsland = boat[1] != -1 && boat[1] < sailing.islands.length ? sailing.islands[boat[1]] : undefined;
            sailing.boats.push(new Boat(bIndex, targetIsland, boat[4], boat[3], boat[5], boatCaptain));
        }
    })

    return sailing;
}

export const updateSailing = (data: Map<string, any>) => {
    const sailing = data.get("sailing") as Sailing;
    const gemStore = data.get("gems") as GemStore;
    const players = data.get("players") as Player[];
    const looty = data.get("lootyData") as LootyInfo;
    const cooking = data.get("cooking") as Cooking;
    const sigils = data.get("sigils") as Sigils;
    const divinity = data.get("divinity") as Divinity;
    const cards = data.get("cards") as Card[];
    const stamps = data.get("stamps") as Stamp[][];
    const statues = data.get("statues") as PlayerStatues[];
    const alchemy = data.get("alchemy") as Alchemy;


    // Max chests
    const chestPurchases = gemStore.purchases.find(upgrade => upgrade.index == 130)?.pucrhased ?? 0;
    sailing.maxChests += Math.min(Math.round(5 + chestPurchases), 19);

    // Sailing Related
    (sailing.artifacts[27] as OperaMaskArtifact).goldOwned = sailing.loot[0];

    // Skills related.
    (sailing.artifacts[5] as GenieLampArtifact).sailingLevel = players[0].skills.get(SkillsIndex.Sailing)?.level ?? 0;
    (sailing.artifacts[3] as FauxoryTuskArtifact).sailingLevel = players[0].skills.get(SkillsIndex.Sailing)?.level ?? 0;
    (sailing.artifacts[23] as WeatherbookArtifact).gamingLevel = players[0].skills.get(SkillsIndex.Gaming)?.level ?? 0;

    // Slab related.
    (sailing.artifacts[2] as SlabInfluencedArtifact).lootyCount = looty.rawData.length;
    (sailing.artifacts[10] as SlabInfluencedArtifact).lootyCount = looty.rawData.length;
    (sailing.artifacts[18] as SlabInfluencedArtifact).lootyCount = looty.rawData.length;
    (sailing.artifacts[20] as SlabInfluencedArtifact).lootyCount = looty.rawData.length;

    // Highest level
    const highestLevel = players.reduce((maxLevel, player) => maxLevel = player.level > maxLevel ? player.level : maxLevel, 0);
    (sailing.artifacts[1] as ManekiKatArtifact).highestLevel = highestLevel;
    (sailing.artifacts[11] as AshenUrnArtifact).highestLevel = highestLevel;

    // Cooking related.
    (sailing.artifacts[13] as TriagulonArtifact).turkeyOwned = cooking.meals[0].count;

    // Speed base math
    const purrmepPlayer = divinity.gods[6].linkedPlayers.at(0); // purrmep is limited to only 1 player linked.
    const cardBonus = cards.filter(card => card.data.effect.includes("Sailing Speed (Passive)")).reduce((sum, card) => sum += card.getBonus(), 0);
    const divinityMinorBonus = purrmepPlayer ? divinity.gods[6].getPassiveBonus(purrmepPlayer) : 0;
    const stampBonus = stamps.flatMap(tab => tab).reduce((sum, stamp) => sum += stamp.data.effect == "SailSpd" ? stamp.getBonus() : 0, 0);
    const mealBonus = cooking.getMealBonusForKey("Sailing");
    const firstMath = (1 + (divinityMinorBonus + cardBonus + alchemy.getBubbleBonusForKey("Y1")) / 125) * (1 + divinity.gods[4].getBlessingBonus() / 100);
    const speedBaseMath = firstMath * (1 + divinity.gods[6].getBlessingBonus() / 100)
        * (1 + (divinity.gods[9].getBlessingBonus() + sailing.artifacts[10].getBonus() + stampBonus + statues[0].statues[24].getBonus() + mealBonus + alchemy.getVialBonusForKey("SailSpd")) / 125);

    // Update boat impacts
    sailing.boats.forEach(boat => {
        boat.genieLampBonus = sailing.artifacts[5].getBonus()
        boat.sigilBonus = sigils.sigils[21].getBonus();
        boat.speedBaseMath = speedBaseMath;
    });


    return sailing;
}