
import * as khhyl from "./client/lib_js/deps.js";
import * as webjs from "./client/web_js/deps.js";

  
  async function main(){
    await khhyl.FontManager.load('/server/fontjson/root.json',true);
    await khhyl.FontManager.load('/server/fontjson/font/default.json',false);

    const tb = new webjs.Sandbox_web($("div.area_tb#sandbox")[0]);
    tb.draw();
  }
  self.addEventListener("load", async () => {
    console.log("ページが完全に読み込まれました");
    await main();
  });