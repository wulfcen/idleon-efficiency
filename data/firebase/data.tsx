import { FirebaseApp } from "firebase/app";
import { Unsubscribe } from "firebase/auth";
import { child, Database, get, getDatabase, goOnline, ref } from "firebase/database";
import { doc, Firestore, getDoc, initializeFirestore, onSnapshot } from "firebase/firestore";
import { cloudsaveConverter } from "../domain/cloudsave";

export class FirestoreData {
    app: FirebaseApp;
    db: Firestore;
    realDB: Database;

    charNames: string[] = [];
    serverVars: Record<string, any> = {};

    onUpdateFunction: Function
    unsubscribe: Unsubscribe | undefined = undefined;

    constructor(public uid: string, app: FirebaseApp, onUpdate: Function) {
        this.app = app;
        this.db = initializeFirestore(app, {});
        this.realDB = getDatabase(app);
        this.getServerVars();
        this.getCharNames();
        this.subscribeToAccountData();
        this.onUpdateFunction = onUpdate;
    }

    getCharNames = async () => {
        if (!this.realDB) {
            this.realDB = getDatabase(this.app);
        }
        goOnline(this.realDB);
        const dbRef = ref(this.realDB);
        try {
            const charSnapshot = await get(child(dbRef, `_uid/${this.uid}`))
            if (charSnapshot && charSnapshot.exists()) {
                this.charNames = charSnapshot.val() as string[];
            } else {
                console.log("No data available");
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    subscribeToAccountData = async () => {
        // make sure we have char names before subscribing to more data.
        // This is a fallback in case the constructor didn't do it for some reason.
        if (this.charNames.length == 0) {
            await this.getCharNames();
        }
        this.unsubscribe = onSnapshot(doc(this.db, "_data", this.uid).withConverter(cloudsaveConverter),
            { includeMetadataChanges: true }, (doc) => {
                if (doc.exists()) {
                    const cloudsave = doc.data();
                    this.onUpdateFunction(cloudsave, this.charNames, this.serverVars);
                }
            });
    }

    getServerVars = async () => {
        if (this.db?.type == "firestore") {
            const res = await getDoc(doc(this.db, "_vars", "_vars"));
            if (res.exists()) {
                this.serverVars = res.data() as Record<string, any>;
            }
        }
    }
}