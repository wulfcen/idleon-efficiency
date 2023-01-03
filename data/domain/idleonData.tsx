import parseTraps from './traps';
import parseStamps, { updateStamps } from './stamps';
import parseStatues from './statues';
import parsePlayers, { Player, updatePlayers } from './player';
import parseAlchemy, { updateAlchemy } from './alchemy';
import parseBribes from './bribes';
import parseGuild from './guild';
import parseGems from './gemPurchases';
import parseAchievements from './achievements';
import parseLooty from './lootyTracker';
import parseShrines, { updateShrines } from './shrines';
import { initAllItems, Item } from './items';
import parseStorage, { updateStorage } from './storage';
import parseQuests from './quests';
import parsePrayers from './prayers';
import parseRefinery from './refinery';
import parseSaltLick from './saltLick';
import parsePrinter, { updatePrinter } from './printer';
import updateDeathnote from './deathnote';
import parseTaskboard from './tasks';
import { Cloudsave } from './cloudsave';
import parseWorship, { updateWorship } from './worship';
import parseConstruction, { updateConstruction } from './construction';
import parseCards from './cards';
import parseArcade, { updateArcade } from './arcade';
import parseObols from './obols';
import { parseFamily } from './family';
import { parseDungeons } from './dungeons';
import { parseForge, updateForge } from './forge';
import { parseCooking, updateCooking } from './cooking';
import { parseLab, updateLab } from './lab';
import { parseBreeding, updateBreeding } from './breeding';
import { notUndefined } from '../utility';
import parseSigils, { updateSigils } from './sigils';
import { parseAnvil, updateAnvil } from './anvil';
import { updateAlerts } from './alerts';
import { parseAccount, updateAccount } from './account';
import parseDivinity from './divinity';
import parseSailing from './sailing';
import parseGaming from './gaming';


export const safeJsonParse = <T, >(doc: Cloudsave, key: string, emptyValue: T): T => {
    try {
        return JSON.parse(doc.get(key))
    }
    catch (e) {
        //console.debug(key, doc.get(key), e)
    }
    return emptyValue;
}

export class IdleonData {
    private data: Map<string, any>
    private lastUpdated?: Date

    constructor(data: Map<string, any>, lastUpdated?: Date) {
        this.data = data;
        this.lastUpdated = lastUpdated;
    }

    public getData = () => {
        return this.data;
    }

    public getLastUpdated = (raw: boolean = false) => {
        if (raw) {
            return this.lastUpdated;
        }
        if (this.lastUpdated) {
            const resolvedFormat = Intl.DateTimeFormat().resolvedOptions();
            const options: Intl.DateTimeFormatOptions = {
                year: "numeric", month: "numeric", day: "numeric",
                hour: "numeric", minute: "numeric", second: "numeric",
                hour12: resolvedFormat.hour12,
                timeZone: resolvedFormat.timeZone
            };
            return Intl.DateTimeFormat(resolvedFormat.locale, options).format(this.lastUpdated);
        }

        return "";
    }
}


const keyFunctionMap: Record<string, Function> = {
    "stamps": (doc: Cloudsave, allItems: Item[], charCount: number) => parseStamps(doc.get("StampLv"), doc.get("StampLvM"), allItems),
    "traps": (doc: Cloudsave, charCount: number) => parseTraps([...Array(charCount)].map((_, i) => { return doc.get(`PldTraps_${i}`) })),
    "statues": (doc: Cloudsave, charCount: number) => parseStatues([...Array(charCount)].map((_, i) => safeJsonParse(doc, `StatueLevels_${i}`, [])), safeJsonParse(doc, `StuG`, [])),
    "anvil": (doc: Cloudsave, allItems: Item[], charCount: number) => parseAnvil(
        [...Array(charCount)].map((_, i) => doc.get(`AnvilPA_${i}`)), 
        [...Array(charCount)].map((_, i) => doc.get(`AnvilPAstats_${i}`)), 
        [...Array(charCount)].map((_, i) => doc.get(`AnvilPAselect_${i}`)),
        allItems),
    "timeAway": (doc: Cloudsave, charCount: number) => JSON.parse(doc.get('TimeAway')),
    "cauldronBubbles": (doc: Cloudsave, charCount: number) => doc.get('CauldronBubbles'),
    "prayers": (doc: Cloudsave, charCount: number) => parsePrayers(safeJsonParse(doc, "PrayOwned", [])),
    "cards": (doc: Cloudsave, charCount: number) => parseCards(safeJsonParse(doc, 'Cards0', {})),
    "players": (doc: Cloudsave, accountData: Map<string, any>, allItems: Item[], charCount: number) => parsePlayers(doc, accountData, allItems, charCount),
    "alchemy": (doc: Cloudsave, allItems: Item[], charCount: number) => parseAlchemy(doc.get("CauldronInfo"), doc.get("CauldUpgLVs"), allItems),
    "bribes": (doc: Cloudsave, charCount: number) => parseBribes(doc.get("BribeStatus")),
    "guild": (doc: Cloudsave, charCount: number) => parseGuild(safeJsonParse(doc, "Guild", []),),
    "gems": (doc: Cloudsave, charCount: number) => parseGems(safeJsonParse(doc, 'GemItemsPurchased', [])),
    "achievements": (doc: Cloudsave, charCount: number) => parseAchievements(safeJsonParse(doc, 'AchieveReg', []), safeJsonParse(doc, 'SteamAchieve', [])),
    "lootyData": (doc: Cloudsave, allItems: Item[], charCount: number) => parseLooty(safeJsonParse(doc, "Cards1", []), allItems),
    "rawData": (doc: Cloudsave, charCount: number) => doc.toJSON(),
    "POExtra": (doc: Cloudsave, charCount: number) => {
        return {
            streak: doc.get("CYDeliveryBoxStreak"),
            complete: doc.get("CYDeliveryBoxComplete"),
            misc: doc.get("CYDeliveryBoxMisc"),
        }
    },
    "shrines": (doc: Cloudsave, charCount: number) => parseShrines(safeJsonParse(doc, "Shrine", [])),
    "storage": (doc: Cloudsave, accountData: Map<string, any>, allItems: Item[], charCount: number) => parseStorage(doc, accountData.get("playerNames"), allItems, JSON.parse(doc.get("InvStorageUsed"))),
    "constellations": (doc: Cloudsave, charCount: number) => safeJsonParse(doc, "SSprog", []),
    "quests": (doc: Cloudsave, accountData: Map<string, any>, allItems: Item[], charCount: number) => parseQuests(doc, accountData, allItems, charCount),
    "refinery": (doc: Cloudsave, charCount: number) => parseRefinery(safeJsonParse(doc, "Refinery", [])),
    "saltLick": (doc: Cloudsave, charCount: number) => parseSaltLick(safeJsonParse(doc, "SaltLick", [])),
    "printer": (doc: Cloudsave, charCount: number) => parsePrinter(safeJsonParse(doc, "Print", []), charCount),
    "taskboard": (doc: Cloudsave, charCount: number) => parseTaskboard(safeJsonParse(doc, `TaskZZ0`, []), safeJsonParse(doc, `TaskZZ1`, []), safeJsonParse(doc, `TaskZZ2`, []), safeJsonParse(doc, `TaskZZ3`, []), safeJsonParse(doc, `TaskZZ4`, []), safeJsonParse(doc, `TaskZZ5`, [])),
    "worship": (doc: Cloudsave, accountData: Map<string, any>, charCount: number) => parseWorship(safeJsonParse(doc,"TotemInfo", [])),
    "construction": (doc: Cloudsave, charCount: number) => parseConstruction(safeJsonParse(doc, "Tower", []), doc.get("OptLacc")),
    "arcade": (doc: Cloudsave, charCount: number) => parseArcade(safeJsonParse(doc, "ArcadeUpg", []), doc.get("OptLacc")),
    "obols": (doc: Cloudsave, allItems: Item[], charCount: number) => parseObols(doc, charCount, allItems),
    "dungeons": (doc: Cloudsave, charCount: number) => parseDungeons(safeJsonParse(doc, "DungUpg", []), doc.get("OptLacc")),
    "forge": (doc: Cloudsave, allItems: Item[], charCount: number) => parseForge(doc.get("ForgeItemQty"), doc.get("ForgeIntProg"), doc.get("ForgeItemOrder"), doc.get("ForgeLV"), allItems),
    "cooking": (doc: Cloudsave, charCount: number) => parseCooking(safeJsonParse(doc, "Cooking", []), safeJsonParse(doc, "Meals", [])),
    "lab": (doc: Cloudsave, charCount: number) => parseLab(safeJsonParse(doc, "Lab", []), charCount),
    "breeding": (doc: Cloudsave, charCount: number) => parseBreeding(safeJsonParse(doc, "PetsStored", []), safeJsonParse(doc, "Pets", []), doc.get("OptLacc"), safeJsonParse(doc, "Territory", []), safeJsonParse(doc, "Breeding", [])),
    "sigils": (doc: Cloudsave, charCount: number) => parseSigils(safeJsonParse(doc, "CauldronP2W", []), safeJsonParse(doc, "CauldronJobs1", [])),
    "account": (doc: Cloudsave, allItems: Item[], charCount: number) => parseAccount(doc, allItems),
    "divinity": (doc: Cloudsave, charCount: number) => parseDivinity(charCount, doc.get("Divinity") as number[], [...Array(charCount)].map((_, index) =>doc.get(`AFKtarget_${index}`))),
    "sailing": (doc: Cloudsave, charCount: number) => parseSailing(safeJsonParse(doc, "Sailing", []), safeJsonParse(doc, "Boats", []), safeJsonParse(doc, "Captains", [])),
    "gaming": (doc: Cloudsave, charCount: number) => parseGaming(safeJsonParse(doc, "Gaming", []), safeJsonParse(doc, "GamingSprout", [])),
}

// ORDER IS IMPORTANT!
const postProcessingMap: Record<string, Function> = {
    "storage": (doc: Cloudsave, accountData: Map<string, any>) => updateStorage(accountData),
    "deathnote": (doc: Cloudsave, accountData: Map<string, any>) => updateDeathnote(accountData),
    "lab": (doc: Cloudsave, accountData: Map<string, any>) => updateLab(accountData),
    "stamps": (doc: Cloudsave, accountData: Map<string, any>) => updateStamps(accountData),
    "alchemy": (doc: Cloudsave, accountData: Map<string, any>) => updateAlchemy(accountData),
    "family": (doc: Cloudsave, accountData: Map<string, any>) => parseFamily(accountData.get("players") as Player[]),
    "forge": (doc: Cloudsave, accountData: Map<string, any>) => updateForge(accountData.get("forge"), accountData.get("gems")),
    "cooking": (doc: Cloudsave, accountData: Map<string, any>) => updateCooking(accountData),
    "breeding": (doc: Cloudsave, accountData: Map<string, any>) => updateBreeding(accountData),
    "shrines": (doc: Cloudsave, accountData: Map<string, any>) => updateShrines(accountData),
    "players": (doc: Cloudsave, accountData: Map<string, any>) => updatePlayers(accountData),
    "printer": (doc: Cloudsave, accountData: Map<string, any>) => updatePrinter(accountData),
    "sigils": (doc: Cloudsave, accountData: Map<string, any>) => updateSigils(accountData),
    "worship": (doc: Cloudsave, accountData: Map<string, any>) => updateWorship(accountData),
    "anvil": (doc: Cloudsave, accountData: Map<string, any>) => updateAnvil(accountData),
    "arcade": (doc: Cloudsave, accountData: Map<string, any>) => updateArcade(accountData),
    "alerts": (doc: Cloudsave, accountData: Map<string, any>) => updateAlerts(accountData),
    "account": (doc: Cloudsave, accountData: Map<string, any>) => updateAccount(accountData),
    "construction": (doc: Cloudsave, accountData: Map<string, any>) => updateConstruction(accountData),
}

export const updateIdleonData = async (data: Cloudsave, charNames: string[], allItems: Item[], serverVars: Record<string, any>, isStatic: boolean = false) => {
    let accountData = new Map();
    accountData.set("playerNames", charNames);
    accountData.set("itemsData", allItems);
    accountData.set("servervars", serverVars);

    const validCharCount = [...Array(charNames.length)].map((_, i) => data.get(`Lv0_${i}`) as number[]).filter(notUndefined).length;
    Object.entries(keyFunctionMap).forEach(([key, toExecute]) => {
        try {
            if (key == "players" || key == "storage" || key == "quests") {
                accountData.set(key, toExecute(data, accountData, allItems, validCharCount));
            }
            else if (key == "worship") {
                accountData.set(key, toExecute(data, accountData, validCharCount));
            }
            else if (key == "lootyData" || key == "obols" || key == "alchemy" || key == "forge" || key == "stamps" || key == "anvil" || key == "account") {
                accountData.set(key, toExecute(data, allItems, validCharCount));
            }
            else {
                accountData.set(key, toExecute(data, validCharCount));
            }
        }
        catch (e) {
            console.debug(e);
            console.log(`Failed parsing ${key}`);
            accountData.set(key, undefined);
        }
    })

    // Do post parse processing (twice for some edge cases)
    Object.entries(postProcessingMap).forEach(([key, toExecute]) => {
        try {
            accountData.set(key, toExecute(data, accountData));
        }
        catch (e) {
            console.debug(e);
            console.log(`Failed post-processing ${key}`);
            accountData.set(key, undefined);
        }
    })

    const saveGlobalTime = JSON.parse(data.get("TimeAway"))["GlobalTime"] as number;
    const lastUpdated = isStatic ? new Date(saveGlobalTime * 1000) : new Date()
    const newData = new IdleonData(accountData, lastUpdated);

    return newData;
}
