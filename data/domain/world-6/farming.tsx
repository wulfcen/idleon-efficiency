import { SkillsIndex } from "../SkillsIndex";
import { Domain, RawData } from "../base/domain";
import { initMarketInfoRepo } from "../data/MarketInfoRepo";
import { SeedInfoBase, initSeedInfoRepo } from "../data/SeedInfoRepo";
import { Item } from "../items";
import { MarketInfoModel } from "../model/marketInfoModel";
import { SeedInfoModel } from "../model/seedInfoModel";
import { Player } from "../player";
import { ImageData } from "../imageData";
import { nFormatter } from '../../utility';

export class MarketUpgrade {
    level: number = 0;
    unlocked: boolean = false;

    constructor(public index: number, public data: MarketInfoModel) {}

    getNextLevelCost = (currentLevel: number = this.level): MarketUpgradeCost => {
        let cropId = 0;
        if (this.index > 7) {
            // Means it's night market so no crop cost, only magic beans
            let cropId = -1;
        } else {
            if (this.index == 0) {
                // Special calcul for the first upgrade
                cropId = Math.floor(this.data.cropId + this.data.cropIdIncrement * (currentLevel + (2 * Math.floor(currentLevel / 3) + Math.floor(currentLevel / 4))));
            } else {
                cropId = Math.floor(this.data.cropId + this.data.cropIdIncrement * currentLevel);
            }
        }

        const cropCost = Math.floor(this.data.cost * Math.pow(this.data.costExponent, (currentLevel-1)));
        
        return {cropId: cropId, cropQuantity: cropCost};
    }
}

export class Crop {
    discovered: boolean = false;
    quantityOwned: number = 0;

    constructor(public index: number, public seedIndex: number) { }

    static getCropIconData = (cropId: number): ImageData => {
        return {
            location: `FarmCrop${cropId}`,
            height: 20,
            width: 20
        }
    }

    static getMagicBeanIconData = (): ImageData => {
        return {
            location: `FarmCropBean`,
            height: 20,
            width: 20
        }
    }
}

export class Seed {
    constructor(public index: number, public data: SeedInfoModel) {}
}

export class Plot {
    // -1 means the Plot is empty
    seedIndex: number = -1;
    // CropId
    cropIndex: number = 0;
    // If true can't evolve, but can still OverGrow
    locked: boolean = false;
    // Time in seconds since last Collecting or Planting, it stop incrementing once the plant is fully grown
    growthTime: number = 0;
    // Base quantity of crops to be collected 
    quantityToCollect: number = 0;
    // Level of Overgrowth 
    OGlevel: number = 0;
    // seconds since last cycle have ended, reset to 0 once an overgrow cycle end
    // Only start incrementing when plant is fully grown
    overgrowthTime: number = 0;

    // Need to be calculate with external bonuses
    cropEvolutionChance: number = 0;
    nextOGChance: number = 0;
    possibleQtyToCollectMin: number = 0;
    possibleQtyToCollectMax: number = 0;

    constructor(public index: number) { }

    updatePlotNextCropChance = (seed: Seed | undefined, farmingLevel: number, summoningLevel: number, bonusFromMarketUpgrade4: number, bonusFromMarketUpgrade9: number, bonusFromWinningBonus10: number, bonusFromAlchemyBubbleCropChapter: number, bonusFromAlchemyBubbleCropiusMapper: number, bonusFromVial66: number, bonusFromMeal62: number, bonusFromMeal66: number, bonusFromStampCropEvo: number, bonusFromStarSign65: number, bonusFromRiftFarming1: number) => {
        let evolutionChance = 0;
        const seedBaseEvolutionChance = 0.3; // should be seed.data.nextCropChance but Lava seems to use 0.3 for every seed
        const allBonusesEffect = (1 + bonusFromMarketUpgrade4 / 100) * (1 + bonusFromWinningBonus10 / 100) * (1 + bonusFromAlchemyBubbleCropChapter / 100) * (1 + bonusFromAlchemyBubbleCropiusMapper / 100) * (1 + bonusFromVial66 / 100) * (1 + bonusFromMeal62 / 100) * (1 + bonusFromStampCropEvo / 100) * (1 + bonusFromMeal66 * Math.ceil((summoningLevel + 1) / 50) / 100) * Math.max(1, bonusFromMarketUpgrade9) * (1 + 15 * bonusFromRiftFarming1 / 100) * (1 + bonusFromStarSign65 * farmingLevel / 100);
        
        if (seed) {
            if (farmingLevel < 2 || this.cropIndex == seed.data.cropIdMax || this.locked) {
                evolutionChance = 0;            
            } else {                
                evolutionChance = allBonusesEffect * (seedBaseEvolutionChance) * Math.pow(seed.data.nextCropDecay, (this.cropIndex - seed.data.cropIdMin));
            }
        } else {
            evolutionChance = allBonusesEffect;
        }
        

        this.cropEvolutionChance = evolutionChance;
    }

    updatePlotNextOGchance = (bonusFromMarketUpgrade11: number, bonusFromPristineCharm11: number, bonusFromStarSign67: number) => {
        this.nextOGChance = Math.pow(0.4, this.OGlevel + 1) * Math.max(1, bonusFromMarketUpgrade11) * (1 + bonusFromPristineCharm11 / 100) * (1 + bonusFromStarSign67 / 100);
    }

    getQuantityToCollect(): number {
        return this.quantityToCollect * Math.max(1, this.getOGmultiplyer());
    }

    getGrowthTimeRequired = (): number => {
        if (this.seedIndex == -1) {
            return 0;
        } else {
            return 14400 * Math.pow(1.5, this.seedIndex);
        }
    }

    getOGmultiplyer = (): number => {
        return Math.min(1E9, Math.max(1, Math.pow(2, this.OGlevel)));
    }

    static getPlotGrowStage(stage: PlotGrowthStage, seedId: number): ImageData {
        if (stage == PlotGrowthStage.Empty || seedId < 0) {
            return {
                location: `FarmPlant0`,
                height: 78,
                width: 86
            }
        } else {
            return {
                location: `FarmPlant${stage + (5 * seedId)}`,
                height: 78,
                width: 86
            }
        }
    }
}

export class CropScientistBonus {
    unlocked: boolean = false;
    bonusValue: number = 0;

    constructor(public bonusText: CropScientistBonusText, public bonusPerCrop: number, public jadeUpgradeId: number) {}
}

export class CropScientist {
    unlocked: boolean = false;
    bonuses: CropScientistBonus[] = [];

    constructor() {
        this.bonuses.push(new CropScientistBonus(CropScientistBonusText.TotalDamage, 20, 27));
        this.bonuses.push(new CropScientistBonus(CropScientistBonusText.PlantEvolutionChance, 1.02, 24));
        this.bonuses.push(new CropScientistBonus(CropScientistBonusText.JadeCoinGain, 8, 25));
        this.bonuses.push(new CropScientistBonus(CropScientistBonusText.CookingSpeed, 1.10, 26));
        this.bonuses.push(new CropScientistBonus(CropScientistBonusText.CashBonus, 15, 23));
        this.bonuses.push(new CropScientistBonus(CropScientistBonusText.ShinyPetLvlUpRate, 7, 28));
    }

    // TODO : call this for update
    updateBonusValues = (cropsFound: number, bonusFromLabBonus17: number) => {
        this.bonuses.forEach(bonus => {
            switch (bonus.bonusText) {
                case CropScientistBonusText.CookingSpeed:
                case CropScientistBonusText.PlantEvolutionChance:
                    bonus.bonusValue = Math.pow(bonus.bonusPerCrop, cropsFound) * (1 + (bonusFromLabBonus17 / 100))
                case CropScientistBonusText.ShinyPetLvlUpRate:
                case CropScientistBonusText.CashBonus:
                case CropScientistBonusText.JadeCoinGain:
                case CropScientistBonusText.TotalDamage:
                default:
                    bonus.bonusValue = (bonus.bonusPerCrop * cropsFound) * (1 + (bonusFromLabBonus17 / 100));
            }
        })
    }

    getBonus(bonus: CropScientistBonusText): number {
        const foundBonus = this.bonuses.find(foundBonus => foundBonus.bonusText == bonus && foundBonus.unlocked == true);

        if (foundBonus) {
            return foundBonus.bonusValue;
        } else {
            return 0;
        }
    }

    getBonusText(bonus: CropScientistBonusText, cropsFound: number): string {
        return bonus.replace(/{/, nFormatter(this.getBonus(bonus)));
    }
}

export class Farming extends Domain {
    farmPlots: Plot[] = [];
    marketUpgrades: MarketUpgrade[] = initMarketInfoRepo().map((upgrade) => { return new MarketUpgrade(upgrade.index, upgrade.data) });
    seeds: Seed[] = initSeedInfoRepo().map((seed) => { return new Seed(seed.index, seed.data) });;
    cropDepot: Crop[] = [];
    cropScientist: CropScientist = new CropScientist();

    canOvergrow: boolean = false;
    magicBeansOwned: number = 0;
    instaGrowToolLeft: number = 0;
    
    farmingLevel: number = 0;
    growthRate: number = 0;
    magicBeansFromDepot: number = 0;

    getRawKeys(): RawData[] {
        return [
            { key: "FarmPlot", perPlayer: false, default: []},
            { key: "FarmCrop", perPlayer: false, default: []},
            { key: "FarmUpg", perPlayer: false, default: []},
        ]
    }

    init(allItems: Item[], charCount: number) {
        return this;
    }

    parse(data: Map<string, any>): void {
        const farming = data.get(this.dataKey) as Farming;
        const cropsData = data.get("FarmCrop") as Object;
        const plotsData = data.get("FarmPlot") as number[][];
        const upgradesData = data.get("FarmUpg") as number[];
        const upgradesLevels = upgradesData.slice(2, -2);

        farming.magicBeansOwned = upgradesData[1];
        farming.instaGrowToolLeft = upgradesData[19];

        farming.cropDepot = [];
        farming.seeds.forEach((seed) => {
            for (let i = seed.data.cropIdMin; i <= seed.data.cropIdMax; i++) {
                farming.cropDepot.push(new Crop(i, seed.index));
            }
        })
        
        for (const [cropId, qty] of Object.entries(cropsData)) {
            const crop = farming.cropDepot.find(crop => crop.index == Number(cropId));
            if (crop) {
                crop.discovered = true;
                crop.quantityOwned = Number(qty);
            }
        }

        farming.marketUpgrades.forEach((upgrade) => {
            if (upgrade.index < upgradesLevels.length) {
                upgrade.level = upgradesLevels[upgrade.index];
            }
        });

        farming.farmPlots = [];
        plotsData.forEach((plotInfo, index) => {
            let plot: Plot = new Plot(index);
            plot.seedIndex = plotInfo[0];
            // If seedIndex = -1 then the plot is empty, so no more information are needed (all other plotInfo should be at 0 anyway in this case)
            if (plot.seedIndex > -1) {
                plot.growthTime = plotInfo[1];
                plot.cropIndex = plotInfo[2] + (farming.seeds.find(seed => seed.index == plot.seedIndex)?.data.cropIdMin ?? 0);
                plot.locked = (plotInfo[3] == 1);
                plot.quantityToCollect = plotInfo[4];
                plot.OGlevel = plotInfo[5];
                plot.overgrowthTime = plotInfo[6];
            }
            farming.farmPlots.push(plot);
        });
    }
    
    updateUnlockedMarketBonuses = () => {
        const cropsFound = this.getDiscoveredCropsNumber();
        this.marketUpgrades.forEach(upgrade => {
            upgrade.unlocked = (upgrade.data.cropReq <= cropsFound);
        });
    }
    
    // TODO : call this function for update
    updateGrowthRate = (bonusFromVial64: number, bonusFromWinnerBonus2: number) => {
        this.growthRate = Math.max(1, this.getMarketUpgradeBonusValue(10)) * (1 + (this.getMarketUpgradeBonusValue(2) + bonusFromVial64) / 100) * (1 + bonusFromWinnerBonus2 / 100);
    }
    
    // TODO : call this function for update
    updateBeansFromConvertinCurrentDepot = (jadeUpgradeBonus15: number) => {
        let fromCrops = 0;
        
        this.cropDepot.filter(crop => crop.quantityOwned > 0).forEach(crop => {
            fromCrops += (crop.quantityOwned * Math.pow(2.5, crop.seedIndex) * Math.pow(1.08, crop.index));
        });
        
        this.magicBeansFromDepot = Math.pow(fromCrops, 0.5) * this.getMarketUpgradeBonusValue(6) * Math.max(1, jadeUpgradeBonus15);
    }

    // TODO : call this function for update
    updatePlotsOGChance = (bonusFromMarketUpgrade11: number, bonusFromPristineCharm11: number, bonusFromStarSign67: number) => {
        this.farmPlots.forEach(plot => {
            plot.updatePlotNextOGchance(bonusFromMarketUpgrade11, bonusFromPristineCharm11, bonusFromStarSign67);
        });
    }
    
    // TODO : call this function for update
    updatePlotsEvolutionChance = (summoningLevel: number, bonusFromMarketUpgrade4: number, bonusFromMarketUpgrade9: number, bonusFromWinningBonus10: number, bonusFromAlchemyBubbleCropChapter: number, bonusFromAlchemyBubbleCropiusMapper: number, bonusFromVial66: number, bonusFromMeal62: number, bonusFromMeal66: number, bonusFromStampCropEvo: number, bonusFromStarSign65: number, bonusFromRiftFarming1: number) => {
        this.farmPlots.forEach(plot => {
            const seed = this.seeds.find(seed => seed.index == plot.seedIndex);
            plot.updatePlotNextCropChance(seed, this.farmingLevel, summoningLevel, bonusFromMarketUpgrade4, bonusFromMarketUpgrade9, bonusFromWinningBonus10, bonusFromAlchemyBubbleCropChapter, bonusFromAlchemyBubbleCropiusMapper, bonusFromVial66, bonusFromMeal62, bonusFromMeal66, bonusFromStampCropEvo, bonusFromStarSign65, bonusFromRiftFarming1);
        });
    }

    // TODO : call this function for update
    updatePossibleQuantityToCollect = (bonusFromMarketUpgrade1: number, bonusFromGemShopBonus139: number) => {
        const min = Math.floor(1 + (0 + (bonusFromMarketUpgrade1 + 20 * bonusFromGemShopBonus139) / 100));
        const max = Math.floor(1 + (0.999 + (bonusFromMarketUpgrade1 + 20 * bonusFromGemShopBonus139) / 100));

        this.farmPlots.forEach(plot => {
            plot.possibleQtyToCollectMin = min;
            plot.possibleQtyToCollectMax = max;
        });
    }
    
    getCropsWithStockEqualOrGreaterThan = (stockLimit: number): number => {
        return this.cropDepot.filter(crop => crop.quantityOwned >= stockLimit).length;
    }

    getMarketUpgradeBonusValue = (upgradeId: number): number  => {
        const upgrade = this.marketUpgrades.find(upgrade => upgrade.index == upgradeId);

        if (upgrade) {
            switch (upgradeId) {
                case 7:
                    // No bonus there yet
                    return 0;
                case 9: // GMO
                    return this.getMarketUpgradeBonusValue(15) * Math.pow(1 + upgrade.level * upgrade.data.bonusPerLvl / 100, this.getCropsWithStockEqualOrGreaterThan(200));
                case 11:
                    return 1 + (upgrade.level * upgrade.data.bonusPerLvl) / 100;
                case 10: //GMO
                    return this.getMarketUpgradeBonusValue(15) * (1 + upgrade.level * upgrade.data.bonusPerLvl * this.getCropsWithStockEqualOrGreaterThan(1000) / 100);
                case 12: //GMO
                    return this.getMarketUpgradeBonusValue(15) * (1 + upgrade.level * upgrade.data.bonusPerLvl * this.getCropsWithStockEqualOrGreaterThan(2500) / 100);
                case 13:
                    // No bonus there yet
                    return 0;
                case 14: //GMO
                    return this.getMarketUpgradeBonusValue(15) * (1 + (upgrade.level * upgrade.data.bonusPerLvl * this.getCropsWithStockEqualOrGreaterThan(10000)) / 100);
                case 15: //GMO
                    return 1 + (upgrade.level * upgrade.data.bonusPerLvl * this.getCropsWithStockEqualOrGreaterThan(100000)) / 100;
                default:    
                    return upgrade.level * upgrade.data.bonusPerLvl;
            }
        } else {
            return 0;
        }
    }

    getMarketUpgradeBonusText = (upgradeId: number): string  => {
        const upgrade = this.marketUpgrades.find(upgrade => upgrade.index == upgradeId);

        if (upgrade) {
            switch (upgradeId) {
                case 7:
                    // No bonus there yet
                    return upgrade.data.bonus;
                case 9: // GMO
                    return upgrade.data.bonus.replace(/}/, nFormatter(upgrade.level * upgrade.data.bonusPerLvl)) + " (Total bonus : x"+ this.getMarketUpgradeBonusValue(upgradeId).toString()+")";
                case 11:
                    return upgrade.data.bonus.replace(/}/, nFormatter(this.getMarketUpgradeBonusValue(upgradeId)));
                case 13:
                    // No bonus there yet
                    return upgrade.data.bonus;
                case 10: //GMO
                case 12: //GMO
                case 14: //GMO
                case 15: //GMO
                    return upgrade.data.bonus.replace(/{/, nFormatter(upgrade.level * upgrade.data.bonusPerLvl)) + " (Total bonus : +"+nFormatter((this.getMarketUpgradeBonusValue(upgradeId)-1)*100)+"%)";
                default:    
                    return upgrade.data.bonus.replace(/{/, nFormatter(this.getMarketUpgradeBonusValue(upgradeId)));
            }
        } else {
            return "";
        }
    }

    getDiscoveredCropsNumber = (): number => {
        return this.cropDepot.filter(crop => crop.discovered == true).length;
    }

    static getDayMarketImageData = (): ImageData => {
        return {
            location: `FarmStT0`,
            height: 53,
            width: 60
        }
    }

    static getNightMarketImageData = (): ImageData => {
        return {
            location: `FarmStT1`,
            height: 53,
            width: 60
        }
    }

    static getCropDepotImageData = (): ImageData => {
        return {
            location: `FarmStT2`,
            height: 53,
            width: 60
        }
    }
}

// TODO : Once all calculations have been done, need to make other updateFarming functions to load bonus from other sources (functions with TODO : call this function for update)
export const updateFarmingLevel = (data: Map<string, any>) => {
    const farming = data.get("farming") as Farming;
    const players = data.get("players") as Player[];

    farming.farmingLevel = players[0]?.skills.get(SkillsIndex.Farming)?.level ?? 0;
}

export interface MarketUpgradeCost {
    cropId: number,
    cropQuantity: number,
}

export enum CropScientistBonusText {
    CashBonus = "+{% cash from mobs",
    PlantEvolutionChance = "{x Plant Evolution Chance in Gaming (multiplicative)",
    JadeCoinGain = "+{% Jade Coin Gain",
    CookingSpeed = "{x Cooking Speed (multiplicative)",
    TotalDamage = "+{% Total Damage",
    ShinyPetLvlUpRate = "+{% Shiny Pet Lv Up Rate and Pet Breeding Rate"
}

export enum PlotGrowthStage {
    Empty = 0,
    Planted = 1,
    GrowStage1 = 2,
    GrowStage2 = 3,
    GrowStage3 = 4,
    GrowStage4 = 5,
    Grown = 6,
}