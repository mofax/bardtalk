import fs from "fs";
const cwd = process.cwd();
const envPath = `${cwd}/.env`;
export function dotEnv() {
    const env = {};
    fs.readFileSync(envPath, "utf8").split("\n").forEach((line) => {
        const [key, value] = line.split("=");
        env[key] = value;
    });
    return Object.freeze(env);
}
