import * as khhyl from "./lib_js/deps.js";
import * as webjs from "./web_js/deps.js";

async function main() {
  await khhyl.Thaqqa_DB.load();

  await khhyl.GlyphManager.load();

  //khhyl.GPOSManager.setGPOSColumn()

  let tb;

  tb = new webjs.Sandbox_web($("div.area_tb#sandbox")[0]);
  tb.draw();

  tb = new webjs.LayoutDebug_web($("div.area_tb#layouttest")[0]);
  tb.draw();

  const object = document.createElement("input");
  object.contentEditable = false;
  object.type = "button";
  object.style.display = "block";
  object.value = "jsonとして出力";
  object.name = "export";
  object.addEventListener("click", () => {
    khhyl.Thaqqa_DB.export();
  }, true);
  $("div.area_tb#export")[0].appendChild(object);

  //$(this.where)[0]
}

self.addEventListener("load", async () => {
  console.log("ページが完全に読み込まれました");

  await main();
});
