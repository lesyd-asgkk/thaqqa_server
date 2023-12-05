// app.ts
import { Application, Router, send } from "./deps.ts";
import { path } from "./deps.ts";
import { fs } from "./deps.ts";

const app = new Application();
const router = new Router();
const srcPath_def = path.join(Deno.cwd());
{
  let srcPath = path.join(Deno.cwd(), "client");
  let htmlFiles = fs.walkSync(srcPath, {
    includeDirs: true,
    exts: [".html", ".js"],
  });

  for (const entry of htmlFiles) {
    const root = Deno.cwd();
    const relativePath = `\\${path.relative(srcPath_def, entry.path)}`;
    console.log(`root:${root}`);
    console.log(`ファイル名:${relativePath}`);
    console.log("\n");
    router.get(`${relativePath}`.replaceAll("\\", "/"), async (ctx) => {
      await send(ctx, `${relativePath}`, {
        root: root,
      });
    });
  }
}

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server started on port 8000");
await app.listen({ port: 8000 });
