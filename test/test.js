import Chatbot from '../lib/bot.js';
import { dotEnv } from './dotenv.js';

async function main() {
    const env = dotEnv();
    const bot = new Chatbot(env['BARD_KEY'], env['SNlM0e']);
    bot.ask("Write a poem in the voice of Maya Angelou?").then((results) => {
        console.log(results);
    }).catch(error => {
        console.log("Error", error.message);
    });
}
main();
