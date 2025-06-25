import { Elysia, t } from "elysia";
import { Database } from "bun:sqlite";
import { Bot, InputFile } from "grammy";

const db = new Database("s.sqlite");
const bot = new Bot(process.env.BOT_TOKEN!);
const app = new Elysia()
  .post("/check", ({ body }) => {
    const player = db.query("SELECT * FROM players WHERE modId = ?").get(body.modId)
    console.log(player)
    if(!player) return "false"
    return "true"
  }, {
    body: t.Object({
      access: t.String(),
      modId: t.String()
    })
  })
  .post("/upload", async ({ body, set }) => {
    const info = JSON.parse(body.info)
    const tgUser = db.query("SELECT tgId FROM players WHERE modId = ?").get(info.modId) as { tgId: string; }
    if(!tgUser) { set.status = "Forbidden"; return; }
    bot.api.sendVideoNote(tgUser.tgId, new InputFile(body.video[0].stream()))
  }, {
    body: t.Object({
      info: t.String({
        type: "application/json",
      }),
      video: t.Files({
        type: "video/mp4"
      })
    })
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
