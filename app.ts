// app.ts
import { Application, Router, send } from "./deps.ts";
import { path } from "./deps.ts";
import { fs } from "./deps.ts";
import { LoadFile } from "./LoadFile.ts";

const app = new Application();
const router = new Router();
const srcPath_def = path.join(Deno.cwd());
{
  let srcPath = path.join(Deno.cwd(), "client");
  let htmlFiles = fs.walkSync(srcPath, {
    includeDirs: true,
    exts: [".html", ".js", ".css"],
  });

  for (const entry of htmlFiles) {
    const root = Deno.cwd();
    const relativePath = `${path.relative(srcPath_def, entry.path)}`;
    console.log(`root:${root}`);
    console.log(`ファイル名:${relativePath}`);
    console.log("\n");
    router.get(`${relativePath}`, async (ctx) => { //.replaceAll("\\", "/")
      await send(ctx, `${relativePath}`, {
        root: root,
      });
    });
  }
}

router.get(`/server/init.json`, async (ctx) => {
  const data = LoadFile.loadJSON("./server/init.json");
  ctx.response.body = data.buffer; // Uint8Arrayをバイナリデータとしてクライアントに送信
  ctx.response.headers.set("Content-Type", "application/octet-stream"); // コンテンツタイプを設定
});
router.get(`/server/FontData.svg`, async (ctx) => {
  const data = LoadFile.loadAllGlyph("./server/Font_Data_linear");
  ctx.response.body = data; // Uint8Arrayをバイナリデータとしてクライアントに送信
  ctx.response.headers.set("Content-Type", "application/octet-stream"); // コンテンツタイプを設定
});
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server started on port 8000");
await app.listen({ port: 8000 });
