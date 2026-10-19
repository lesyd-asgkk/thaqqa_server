Deno.env.set("DENO_VERBOSE_WARNINGS", "1");

import { Application, Router, send } from "./deps.ts";
import { fs, path } from "./deps.ts";
import { LoadFile } from "./LoadFile.ts";

const app = new Application();
const router = new Router();

const root = Deno.cwd();

// src 側：静的ファイル配信
function registerStaticRoutes(
  router: Router,
  directory: string,
  urlPrefix = "",
) {
  for (
    const entry of fs.walkSync(directory, {
      includeDirs: false,
      exts: [".html", ".js", ".css"],
    })
  ) {
    // ディレクトリを基準にした相対パス
    const relativePath = path.relative(directory, entry.path)
      .replaceAll("\\", "/");

    // URL を生成
    const urlPath = `/${
      [urlPrefix, relativePath]
        .filter(Boolean)
        .join("/")
    }`;

    console.log(`ファイル名: ${urlPath}`);

    router.get(urlPath, async (ctx) => {
      await send(ctx, entry.path, {
        root: "/",
      });
    });
  }
}

// server 側：データ配信
function registerServerRoutes(router: Router) {
  router.get("/server/init.json", (ctx) => {
    const data = LoadFile.loadJSON("./server/init.json");
    ctx.response.body = data.buffer;
    ctx.response.headers.set(
      "Content-Type",
      "application/octet-stream",
    );
  });

  router.get("/server/fontjson/root.json", (ctx) => {
    const data = LoadFile.loadJSON("./server/fontjson/root.json");
    ctx.response.body = data.buffer;
    ctx.response.headers.set(
      "Content-Type",
      "application/octet-stream",
    );
  });

  const entries = ["SanSerif_0_0_0_0"];

  for (const entry of entries) {
    router.get(`/server/fontjson/font/${entry}.json`, (ctx) => {
      const data = LoadFile.loadJSON(
        `./server/fontjson/font/${entry}.json`,
      );
      ctx.response.body = data.buffer;
      ctx.response.headers.set(
        "Content-Type",
        "application/octet-stream",
      );
    });
  }

  router.get("/server/FontData.svg", (ctx) => {
    const data = LoadFile.loadAllGlyph("./server/Font_Data_linear");
    ctx.response.body = data;
    ctx.response.headers.set(
      "Content-Type",
      "application/octet-stream",
    );
  });
}

// ルート登録
registerStaticRoutes(
  router,
  path.join(root, "src", "client"),
);

registerStaticRoutes(
  router,
  root,
  "",
);

registerServerRoutes(router);

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server started on port 8000");
await app.listen({ port: 8000 });
