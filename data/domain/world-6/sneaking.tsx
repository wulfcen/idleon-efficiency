import { letterToNumber } from "../../utility";
import { SkillsIndex } from "../SkillsIndex";
import { Alchemy, AlchemyConst, CauldronIndex } from "../alchemy";
import { Domain, RawData } from "../base/domain";
import { initJadeUpgradeRepo } from "../data/JadeUpgradeRepo";
import { BaseNinjaItemBase, initNinjaItemRepo } from "../data/NinjaItemRepo";
import { NinjaUpgradeBase, initNinjaUpgradeRepo } from "../data/NinjaUpgradeRepo";
import { ImageData } from "../imageData";
import { Item } from "../items";
import { JadeUpgradeModel } from "../model/jadeUpgradeModel";
import { NinjaUpgradeModel } from "../model/ninjaUpgradeModel";

export enum SneakingActivity {
    Sneaking = "Sneaking",
    Breaching = "Breaching",
    Untying = "Untying",
    Tied = "Tied",
    KnockedOut = "Knocked Out",
}

export interface SneakingEquipment {
    name: string
    level: number
}

export class SneakingPlayer {
    activity: SneakingActivity = SneakingActivity.Tied;
    equipment: SneakingEquipment[] = [];
    // The action timer is based on this, action time - time past will tell you how long till next action calculation.
    timePast: number = 0;

    floor: number = 9;
    // Temp holding of raw info so it's easier to map.
    rawData: number[];
    constructor(public index: number, public level: number, activityInfo: number[], equipment: SneakingEquipment[]) {
        this.rawData = activityInfo;
        this.floor = activityInfo[0];
        // activityInfo[1] can be one of two things:
        // Positive -> Seconds spent actively doing a task (could be sneaking, untying or breaching)
        // Negative -> Seconds spent being down
        if (activityInfo[1] != 0) {
            // TODO: Make this smarter, probably based on equipment?
            this.activity = SneakingActivity.Sneaking;
        }
        if (activityInfo[1] < 0) {
            this.activity = SneakingActivity.KnockedOut;
        }
        this.equipment = equipment;
    }
}

const jadeUpgradeDisplayOrder = [0, 12, 5, 8, 22, 27, 18, 1, 17, 24, 19, 25, 13, 16, 26, 7, 9, 23, 14, 20, 28, 2, 3, 15, 10, 11, 6, 21, 29, 30, 31, 32, 38, 39, 34, 36, 4, 33, 35, 37];

export class JadeUpgrade {
    purchased: boolean = false;

    // This comes from servervars -> A_empoExpon
    // Setting default value to what it was first time I looked at it :shrug:.
    costExponent: number = 2.52;

    constructor(public index: number, public data: JadeUpgradeModel, public displayOrder: number = 0) {}

    getImageData = (): ImageData => {
        return {
            location: `NjJupg${this.index}`,
            height: 78,
            width: 128
        }
    }

    unlockCost = (): number => {
        return (
            (300 + 500 * this.displayOrder + Math.pow(this.displayOrder, 3)) 
            * Math.pow(this.costExponent, this .displayOrder)
        )
    }
}

export class SneakingUpgrade {
    unlocked: boolean = false;
    level: number = 0;
    bonusPerLvl: number = 0;
    shouldBeDisplayed: boolean = true;
    bubbleDiscount: number = 0;
    itemDiscount: number = 0;

    constructor(public index: number, public data: NinjaUpgradeModel) {
        if(Number.isFinite(data.bonusPerLvl)) {
            // If value is a valid number, use it.
            this.bonusPerLvl = data.bonusPerLvl as number;
        } 
        this.shouldBeDisplayed = (data.name != "Name");
    }

    nextLevelCost = (): number => {
        if (this.index == 8) {
            return (1 / (1 + this.itemDiscount / 100)) *  (1 / (1 + this.bubbleDiscount / 100)) * this.data.costBase * Math.pow(this.data.costExponent, this.level);
        } else {
            return (1 / (1 + this.itemDiscount / 100)) * this.data.costBase * Math.pow(this.data.costExponent, this.level);
        }
    }

    getBonus = (level: number = this.level): number => {
        return level * this.bonusPerLvl;
    }

    getImageData = (): ImageData => {
        return {
            location: `NjUpgI${this.index}`,
            height: 62,
            width: 62
        }
    }

    getBonusText = (level: number = this.level): string => {
        //This bonus is special so need to do a special treatment
        if (this.index == 14) {
            const bonus = 1 + (this.getBonus(level)/100);

            return this.data.bonus.replace(/}/, bonus.toString());
        } else {
            return this.data.bonus.replace(/{/, this.getBonus(level).toString());
        }
    }

    static fromBase = (data: NinjaUpgradeBase[]): SneakingUpgrade[] => {
       return data.map((value) => new SneakingUpgrade(value.index, value.data));
    }
}

export class Sneaking extends Domain {
    inventory: SneakingEquipment[] = [];
    players: SneakingPlayer[] = [];
    jade: number = 0;

    // Store the item source data so we can make decisions based on it.
    baseItems: BaseNinjaItemBase[] = initNinjaItemRepo();
    sneakingUpgrades: SneakingUpgrade[] = SneakingUpgrade.fromBase(initNinjaUpgradeRepo());
    jadeUpgrades: JadeUpgrade[] = initJadeUpgradeRepo()
        .filter(base => !["idk", "Idk yet"].includes(base.data.bonus))
        .map(
        base => new JadeUpgrade(base.index, base.data, jadeUpgradeDisplayOrder.indexOf(base.index))
    );
    // Last index of "Ninja" has boolean flags for pristine charms, need to map the index to the charm name (index is in the end)
    
    // You have loot: Njloot.png

    updateUnlockedUpgrades = () => {
        this.sneakingUpgrades.forEach(upgrade => {
            upgrade.unlocked = upgrade.data.unlockId == 0 ? true : (this.sneakingUpgrades.find(value => value.index == upgrade.data.unlockId)?.level?.valueOf() || 0) > 0 || false;
        });
    }
    
    static getJadeImageData = (): ImageData => {
        return {
            location: "W6item0_x1",
            width: 36,
            height: 36
        }
    }

    getRawKeys(): RawData[] {
        return [
            { key: "Ninja", perPlayer: false, default: []},
            {key: "Lv0_", perPlayer: true, default: []},
        ]
    }

    init(allItems: Item[], charCount: number) {
        return this;
    }

    parse(data: Map<string, any>): void {
        const sneaking = data.get(this.dataKey) as Sneaking;
        const ninjaData = data.get("Ninja") as any[];
        const serverVars = data.get("servervars");

        // reset old data
        sneaking.players = [];

        sneaking.jade = ninjaData[102][1];

        ninjaData.slice(0, 10).forEach((playerInfo: number[], index) => {
            const playerLevel = data.get(`Lv0_${index}`) as number[];
            const sneakingLevel = playerLevel[SkillsIndex.Sneaking];
            // Equipment per player is stored in 4 different indexes, starting from 10.
            // Figure how the starting index of current player.
            const startingIndex = 10 + 4 * index;
            // get 4 indexes from the array starting from starting index.
            const playerEquipment = ninjaData.slice(startingIndex, startingIndex + 4)
            sneaking.players.push(new SneakingPlayer(index, sneakingLevel, playerInfo, playerEquipment))
        }) 

        ninjaData.slice(60,99).forEach((equipment: {name: string, level: number}) => {
            if(equipment.name != "Blank") {
                sneaking.inventory.push({name: equipment.name, level: equipment.level});
            }
        });

        const sneakingUpgradesLevels: number[] = ninjaData[103];
        sneaking.sneakingUpgrades.forEach(upgrade => {
            if(upgrade.index < sneakingUpgradesLevels.length) {
                upgrade.level = sneakingUpgradesLevels[upgrade.index];
            }
        });
        sneaking.updateUnlockedUpgrades();

        // Yes, Lava stores the enabled upgrades as letters in a single string, need to take that and convert to indexes.
        const lettersOfEnabledUpgrades = ninjaData[102][9]
        const purchasedUpgrades: number[] = [];
        for (const upgradeLetter of lettersOfEnabledUpgrades) {
            purchasedUpgrades.push(letterToNumber(upgradeLetter));
        }
        sneaking.jadeUpgrades.forEach(upgrade => {
            upgrade.purchased = purchasedUpgrades.includes(upgrade.index);
            upgrade.costExponent = serverVars["A_empoExpon"];
        })
    }
}

export const updateSneaking = (data: Map<string, any>) => {
    const alchemy = data.get("alchemy") as Alchemy;
    const sneaking = data.get("sneaking") as Sneaking;

    // The bubble say that the exponent part is reduced, but that's actually just a standard price reduction from what I calculated
    const currencyConduitUpgrade = sneaking.sneakingUpgrades.find(upgrade => upgrade.index == 8);
    if (currencyConduitUpgrade) {
        currencyConduitUpgrade.bubbleDiscount = alchemy.getBonusForBubble(CauldronIndex.Kazam, AlchemyConst.LoCostMoJade);
    }
}