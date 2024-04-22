
import * as khhyl from "./client/lib_js/deps.js";
import * as webjs from "./client/web_js/deps.js";

  
  async function main(){
    await khhyl.Thaqqa_DB.load();
    await khhyl.GlyphManager.loadAll();

    const tb = new webjs.Sandbox_web($("div.area_tb#sandbox")[0]);
    tb.draw();
  }
  self.addEventListener("load", async () => {
    console.log("ページが完全に読み込まれました");
    await main();
  });