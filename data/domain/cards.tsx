import { IDforCardBonus, IDforCardSETbonus } from "../maps";
import { SkillsIndex } from "./SkillsIndex";
import { Domain, RawData } from "./base/domain";
import { CardDataBase, initCardRepo } from "./data/CardRepo";
import { EnemyInfo } from "./enemies";
import { ImageData } from "./imageData";
import { Item } from "./items";
import { CardDataModel } from "./model/cardDataModel";
import { Player } from "./player";
import { Rift, SkillMastery } from "./rift";

export const SkillsforIDCardPassiveBonus: Record<SkillsIndex, number[]> = {
    [SkillsIndex.Mining]: [24, 25, 33, 34],
    [SkillsIndex.Smithing]: [],
    [SkillsIndex.Chopping]: [27, 28, 36, 37],
    [SkillsIndex.Fishing]: [30, 31, 39, 45],
    [SkillsIndex.Alchemy]: [],
    [SkillsIndex.Catching]: [32, 40, 41, 75],
    [SkillsIndex.Trapping]: [53, 57, 58],
    [SkillsIndex.Construction]: [],
    [SkillsIndex.Worship]: [52, 54, 55],
    [SkillsIndex.Cooking]: [],
    [SkillsIndex.Breeding]: [],
    [SkillsIndex.Intellect]: [],
    [SkillsIndex.Sailing]: [],
    [SkillsIndex.Divinity]: [],
    [SkillsIndex.Gaming]: []
}

export class Card {
    count: number = 0;
    displayName: string;
    bonusID: number = 0;

    chipBoost: number = 1
    fivestar: boolean = false;
    passive: boolean = false;

    constructor(public index: number, public id: string, public data: CardDataModel) {
        this.displayName = EnemyInfo.find(enemy => enemy.id == id)?.details.Name || "New Monster?";
        if (data.effect.endsWith("(Passive)")) {
            this.passive = true;
        }
        this.bonusID = this.getBonusID();
    }

    getImageData = (): ImageData => {
        return {
            location: `Cards${this.data.cardID}`,
            width: 28,
            height: 36
        }
    }

    getStars = (): number => {
        switch (true) {
            // cchiz is .. special? .. who knows why.
            case this.id == "Boss3B" && this.fivestar && this.count > this.data.perTier * 36: return 5;
            case this.fivestar && this.count > this.data.perTier * 484: return 5;
            case this.count > this.data.perTier * 25: return 4;
            case this.count > this.data.perTier * 9: return 3;
            case this.count > this.data.perTier * 4: return 2;
            case this.count > this.data.perTier: return 1;
            default: return 0;
        }
    }

    getBonus = (): number => {
        if (this.count == 0) {
            return 0;
        }
        const stars = this.getStars();
        return this.data.bonus * (stars + 1) * this.chipBoost;
    }

    getBonusText = (): string => {
        return this.data.effect.replace(/{/, this.getBonus().toString());
    }

    getBorderImageData = (): ImageData => {
        return {
            location: `CardsBorder${this.getStars() + 1}`,
            width: 31,
            height: 43
        }
    }

    getBonusID = (): number => {
        var ID = 0 as number;
        // Find the bonus ID corresponding to the bonus effect of the card
        Object.entries(IDforCardBonus).some(([bonusID, bonusText], index) => {
            if (ID == 0 && bonusText == this.data.effect.replaceAll(' ', '_')) {
                ID = parseInt(bonusID, 10);
                return true;
            }
        })
        return ID;
    }

    static GetTotalBonusForId = (cards: Card[], id: number) => {
        return cards.filter(card => card.data.effect == IDforCardBonus[id].replace(/_/g, ' ')).reduce((sum, card) => sum += card.getBonus(), 0);
    }

    static fromBase = (data: CardDataBase[]) => {
        return data.map((card, index) => new Card(index, card.id, card.data))
    }
}

export interface CardSet {
    text: string
    bonus: number
}

export class CardInfo {
    cards: Card[];
    equippedCards: Card[] = [];
    cardSet: CardSet = { text: 'You don\'t have one equipped!', bonus: 0 };

    constructor(cardData: Record<string, number>, cardSetData: Map<string, number>, equippedCardsData: string[]) {
        this.cards = Card.fromBase(initCardRepo());
        const cardSetInfo = Object.entries(cardSetData)[0];
        if (cardSetInfo) {
            this.cardSet = {
                text: cardSetInfo[0],
                bonus: cardSetInfo[1]
            };
        }
        if (equippedCardsData) {
            equippedCardsData.forEach((card) => {
                const theCard = this.cards.find(x => x.id == card);
                if (theCard) {
                    this.equippedCards.push(theCard);
                }
                else {
                    this.equippedCards.push(new Card(-1, "Empty", { bonus: -1, cardID: "Empty", category: "Empty", effect: "Empty", order: -1, perTier: -1 }))
                }
            });
        }

        this.cards.forEach((card, _) => {
            card.count = cardData[card.id];
        });
    }

    getCardSetText = (): string => {
        return this.cardSet.text.replace(/_/g, " ").replace("{", this.cardSet.bonus.toString());
    }

    getBonusForId = (id: number) => {
        if (this.cardSet.text == IDforCardSETbonus[id]) {
            return this.cardSet.bonus;
        }
        return 0;
    }
}

export class Cards extends Domain {
    getRawKeys(): RawData[] {
        return [
            { key: "Cards0", default: {}, perPlayer: false }
        ]
    }

    init(allItems: Item[], charCount: number) {
        return Card.fromBase(initCardRepo());
    }

    parse(data: Map<string, any>): void {
        const cardData = data.get("Cards0") as Record<string, number>;
        const cards = data.get(this.getDataKey()) as Card[];

        cards.forEach(card => {
            card.count = cardData[card.id] ?? 0;
        })
    }
}

export const initCards = () => {
    return Card.fromBase(initCardRepo());
}

export const updateCards = (data: Map<string, any>) => {
    const cards = data.get("cards") as Card[];
    const rift = data.get("rift") as Rift;
    const players = data.get("players") as Player[];
    const optLacc = data.get("OptLacc");

    const skillMastery = rift.bonuses.find(bonus => bonus.name == "Skill Mastery") as SkillMastery;

    if (skillMastery?.active) {
        Object.entries(skillMastery.skillLevels).map(([skillAsString, skillLevel], index) => {
            const skillName = SkillsIndex[parseInt(skillAsString)];
            const skillIndex = SkillsIndex[skillName as keyof typeof SkillsIndex];

            if (SkillsforIDCardPassiveBonus[skillIndex].length > 0 && skillMastery.getSkillRank(skillIndex) >= 3) {

                SkillsforIDCardPassiveBonus[skillIndex].forEach(bonusID => {
                    ((cards) ? cards.filter(card => card.bonusID == bonusID) : []).forEach(card => {
                        card.passive = true;
                    })
                    players.flatMap(player => player.cardInfo?.cards ?? []).filter(card => card.bonusID == bonusID).forEach(card => {
                        card.passive = true;
                    })
                })                
            }
        })
    }

    if (rift.bonuses.find(bonus => bonus.name == "Ruby Cards")?.active) {
        cards.forEach(card => {
            card.fivestar = true;
        })
        // I should probably not duplicate cards at some point, but for now ...
        players.flatMap(player => player.cardInfo?.cards ?? []).forEach(card => {
            card.fivestar = true;
        })
    }
    else if (optLacc.length > 155 && optLacc[155] != 0) {
        const cardifiedFiveStarCards = (optLacc[155] as string).split(",");
        cardifiedFiveStarCards.forEach(cardId => {
            cards.forEach(card => {
                if (card.id == cardId) {
                    card.fivestar = true;
                }
            })
            // I should probably not duplicate cards at some point, but for now ...
            players.flatMap(player => player.cardInfo?.cards ?? []).forEach(card => {
                if (card.id == cardId) {
                    card.fivestar = true;
                }
            })
        })
    }
}