// app.ts
Deno.env.set("DENO_VERBOSE_WARNINGS", "1");

import { Application, Router, send } from "./deps.ts";
import { path } from "./deps.ts";
import { fs } from "./deps.ts";
import { LoadFile } from "./LoadFile.ts";

const app = new Application();
const router = new Router();
const srcPath_def = path.join(Deno.cwd());

function f(router: Router, srcPath_def: string, path_sub: string) {
  try {
    const srcPath = path.join(Deno.cwd(), path_sub);
    const htmlFiles = fs.walkSync(srcPath, {
      includeDirs: true,
      exts: [".html", ".js", ".css"],
    });
    for (const entry of htmlFiles) {
      const root = Deno.cwd();
      const relativePath = `/${
        path.relative(srcPath_def, entry.path).replaceAll("\\", "/")
      }`;
      console.log(`root:${root}\nファイル名:${relativePath}\n`);
      router.get(`${relativePath}`, async (ctx) => { //.replaceAll("\\", "/")
        await send(ctx, `${relativePath}`, {
          root: root,
        });
      });
    }
  } catch (_e) {
    const srcPath = path.join(Deno.cwd(), "src/" + path_sub);
    const htmlFiles = fs.walkSync(srcPath, {
      includeDirs: true,
      exts: [".html", ".js", ".css"],
    });
    for (const entry of htmlFiles) {
      const root = Deno.cwd();
      const relativePath = `/${path.relative(srcPath_def, entry.path)}`;
      console.log(`root:${root}\nファイル名:${relativePath}\n`);
      router.get(`/${relativePath}`, async (ctx) => { //
        await send(ctx, `${relativePath}`, {
          root: root,
        });
      });
    }
  }
}

f(router, srcPath_def, "client");
f(router, srcPath_def, "");
router.get(`/server/init.json`, async (ctx) => {
  const data = LoadFile.loadJSON("./server/init.json");
  ctx.response.body = data.buffer; // Uint8Arrayをバイナリデータとしてクライアントに送信
  ctx.response.headers.set("Content-Type", "application/octet-stream"); // コンテンツタイプを設定
});
router.get(`/server/fontjson/root.json`, async (ctx) => {
  const data = LoadFile.loadJSON("./server/fontjson/root.json");
  ctx.response.body = data.buffer; // Uint8Arrayをバイナリデータとしてクライアントに送信
  ctx.response.headers.set("Content-Type", "application/octet-stream"); // コンテンツタイプを設定
});
const entry_ = ["default", "sanserif", "fude", "siddham"];
for (const entry of entry_) {
  router.get(`/server/fontjson/font/${entry}.json`, async (ctx) => {
    const data = LoadFile.loadJSON(`./server/fontjson/font/${entry}.json`);
    ctx.response.body = data.buffer; // Uint8Arrayをバイナリデータとしてクライアントに送信
    ctx.response.headers.set("Content-Type", "application/octet-stream"); // コンテンツタイプを設定
  });
}
router.get(`/server/FontData.svg`, async (ctx) => {
  const data = LoadFile.loadAllGlyph("./server/Font_Data_siddham");
  ctx.response.body = data; // Uint8Arrayをバイナリデータとしてクライアントに送信
  ctx.response.headers.set("Content-Type", "application/octet-stream"); // コンテンツタイプを設定
});
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server started on port 8000");
await app.listen({ port: 8000 });
