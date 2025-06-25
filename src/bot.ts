import { Bot } from "grammy";
import { Database } from "bun:sqlite";

const db = new Database("s.sqlite");
const bot = new Bot(process.env.BOT_TOKEN!)

bot.chatType("private").command("start", async (ctx) => {
    const user = db.query("SELECT * FROM players WHERE tgId = ?;").get(ctx.from.id.toString())
    if(user) db.run("DELETE FROM players WHERE tgId = ?", [ctx.from.id.toString()])
    db.run("INSERT INTO players (tgId, modId) VALUES (?,?)", [ctx.from.id.toString(), ctx.match])
})

db.run("CREATE TABLE IF NOT EXISTS players (tgId TEXT, modId TEXT)")

bot.start()