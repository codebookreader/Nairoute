import {initializeApp,cert,getApps} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";
import {readFileSync} from "fs";
import { get } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.resolve(__dirname,"../../serviceKey.json");
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath,"utf-8"));

 export const app = !getApps().length ? 
initializeApp({
    credential:cert(serviceAccount)
}):
getApps()[0];
export const auth = getAuth(app);