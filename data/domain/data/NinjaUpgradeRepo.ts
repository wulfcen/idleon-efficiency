import { NinjaUpgradeModel } from '../model/ninjaUpgradeModel';

export class NinjaUpgradeBase { constructor(public index: number, public data: NinjaUpgradeModel) { } }



export const initNinjaUpgradeRepo = () => {
    return [    
        new NinjaUpgradeBase(0, <NinjaUpgradeModel>{
                "screenX": 382,
                "screenY": 45,
                "x1": 21,
                "x2": 11,
                "name": "Name",
                "x3": "filler",
                "bonus": "Desc",
                "x6": 10000,
                "x7": 1.1,
                "x8": 0,
                "x9": 308,
                "x10": 17
            }),
        new NinjaUpgradeBase(1, <NinjaUpgradeModel>{
                "screenX": 477,
                "screenY": 45,
                "x1": 39,
                "x2": 44,
                "name": "Name",
                "x3": "filler",
                "bonus": "Desc",
                "x6": 10000,
                "x7": 1.1,
                "x8": 0,
                "x9": 403,
                "x10": 17
            }),
        new NinjaUpgradeBase(2, <NinjaUpgradeModel>{
                "screenX": 631,
                "screenY": 47,
                "x1": 35,
                "x2": 70,
                "name": "Respect for the Art",
                "x3": 3,
                "bonus": "+{% bonus Sneaking EXP gain.",
                "x6": 8500,
                "x7": 1.12,
                "x8": 8,
                "x9": 557,
                "x10": 17
            }),
        new NinjaUpgradeBase(3, <NinjaUpgradeModel>{
                "screenX": 746,
                "screenY": 47,
                "x1": 117,
                "x2": 43,
                "name": "Name",
                "x3": 1,
                "bonus": "Desc",
                "x6": 10000,
                "x7": 1.1,
                "x8": 0,
                "x9": 863,
                "x10": 16
            }),
        new NinjaUpgradeBase(4, <NinjaUpgradeModel>{
                "screenX": 549,
                "screenY": 92,
                "x1": 52,
                "x2": 43,
                "name": "Way of Haste",
                "x3": 1,
                "bonus": "+{% action speed. So instead of actions taking an hour, it's under an hour!",
                "x6": 48000,
                "x7": 1.35,
                "x8": 2,
                "x9": 474,
                "x10": 89
            }),
        new NinjaUpgradeBase(5, <NinjaUpgradeModel>{
                "screenX": 746,
                "screenY": 164,
                "x1": 12,
                "x2": 49,
                "name": "Mahjong Boosters",
                "x3": 4,
                "bonus": "+{% Door Damage and Untie Rate.",
                "x6": 17500,
                "x7": 1.25,
                "x8": 15,
                "x9": 715,
                "x10": 89
            }),
        new NinjaUpgradeBase(6, <NinjaUpgradeModel>{
                "screenX": 122,
                "screenY": 196,
                "x1": 16,
                "x2": 18,
                "name": "Shuriken Sensei",
                "x3": 1,
                "bonus": "Raise the max LV of Shuriken found to +{, also increases rarity of Shuriken found.",
                "x6": 1000000,
                "x7": 1.45,
                "x8": 10,
                "x9": 93,
                "x10": 123
            }),
        new NinjaUpgradeBase(7, <NinjaUpgradeModel>{
                "screenX": 383,
                "screenY": 149,
                "x1": 31,
                "x2": 63,
                "name": "Kunai Knowledge",
                "x3": 1,
                "bonus": "Raise the max LV of Kunai found to +{, also increases rarity of Kunai found.",
                "x6": 10000,
                "x7": 1.45,
                "x8": 12,
                "x9": 308,
                "x10": 117
            }),
        new NinjaUpgradeBase(8, <NinjaUpgradeModel>{
                "screenX": 650,
                "screenY": 191,
                "x1": 11,
                "x2": 21,
                "name": "Currency Conduit",
                "x3": 1,
                "bonus": "+{% bonus Jade Coins found per Sneaking LV",
                "x6": 1250,
                "x7": 1.1,
                "x8": 14,
                "x9": 618,
                "x10": 117
            }),
        new NinjaUpgradeBase(9, <NinjaUpgradeModel>{
                "screenX": 877,
                "screenY": 91,
                "x1": 31,
                "x2": 69,
                "name": "Name",
                "x3": "filler",
                "bonus": "Desc",
                "x6": 10000,
                "x7": 1.1,
                "x8": 9,
                "x9": 803,
                "x10": 117
            }),
        new NinjaUpgradeBase(10, <NinjaUpgradeModel>{
                "screenX": 168,
                "screenY": 246,
                "x1": 66,
                "x2": 12,
                "name": "Glove Ingenuity",
                "x3": 1,
                "bonus": "Raise the max LV of Gloves found to +{, also increases rarity of Gloves found.",
                "x6": 100000,
                "x7": 1.4,
                "x8": 0,
                "x9": 93,
                "x10": 214
            }),
        new NinjaUpgradeBase(11, <NinjaUpgradeModel>{
                "screenX": 266,
                "screenY": 149,
                "x1": 42,
                "x2": 65,
                "name": "Charm Collector",
                "x3": 1,
                "bonus": "Raise the max LV of Charms found to +{, also increases rarity of Charms found.",
                "x6": 250000,
                "x7": 1.43,
                "x8": 7,
                "x9": 234,
                "x10": 214
            }),
        new NinjaUpgradeBase(12, <NinjaUpgradeModel>{
                "screenX": 445,
                "screenY": 244,
                "x1": 50,
                "x2": 10,
                "name": "Nunchaku Grip",
                "x3": 1,
                "bonus": "Raise the max LV of Nunchaku found to +{, also increases rarity of Nunchaku found.",
                "x6": 350,
                "x7": 1.43,
                "x8": 13,
                "x9": 371,
                "x10": 214
            }),
        new NinjaUpgradeBase(13, <NinjaUpgradeModel>{
                "screenX": 0,
                "screenY": 0,
                "x1": 0,
                "x2": 0,
                "name": "Way of Stealth",
                "x3": 1,
                "bonus": "+{ Stealth per Sneaking Lv. Stealth is what lowers detection rate.",
                "x6": 50,
                "x7": 1.08,
                "x8": 0,
                "x9": 494,
                "x10": 214
            }),
        new NinjaUpgradeBase(14, <NinjaUpgradeModel>{
                "screenX": 568,
                "screenY": 244,
                "x1": 49,
                "x2": 10,
                "name": "Looting Ambition",
                "x3": 1,
                "bonus": "Successfully sneaking now has a small chance of finding items. }x Item Find Chance.",
                "x6": 80,
                "x7": 1.3,
                "x8": 13,
                "x9": 618,
                "x10": 214
            }),
        new NinjaUpgradeBase(15, <NinjaUpgradeModel>{
                "screenX": 692,
                "screenY": 244,
                "x1": 23,
                "x2": 11,
                "name": "Thick Skin",
                "x3": 2,
                "bonus": "When detected, getting Knocked Out lasts for {% less time.",
                "x6": 3650,
                "x7": 1.5,
                "x8": 14,
                "x9": 715,
                "x10": 214
            }),
        new NinjaUpgradeBase(16, <NinjaUpgradeModel>{
                "screenX": 789,
                "screenY": 243,
                "x1": 74,
                "x2": 12,
                "name": "Star Sweeping",
                "x3": 1,
                "bonus": "Insta-revive a knocked out ninja by dragging them to the Safe Area, up to { times a day.",
                "x6": 25000,
                "x7": 25,
                "x8": 15,
                "x9": 863,
                "x10": 214
            })    
]
}