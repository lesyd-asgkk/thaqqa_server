
import * as khhyl from "./lib_js/deps.js";
import * as webjs from "./web_js/deps.js";

  
  async function main(){
    await khhyl.Thaqqa_DB.load();

    await khhyl.GlyphManager.load();

    let ta = new webjs.Table_web("VOWEL",$("div.area_tb#vowel")[0]);
    ta.draw();
    ta = new webjs.Table_web("DIACRITIC_V",$("div.area_tb#voweld")[0]);
    ta.draw();
    ta = new webjs.Table_web("CONSONANT",$("div.area_tb#consonant")[0]);
    ta.draw();
    ta = new webjs.Table_web("DIACRITIC_C",$("div.area_tb#consonantd")[0]);
    ta.draw();
    ta = new webjs.Table_web("PUNCTUATION",$("div.area_tb#punctuation")[0]);
    ta.draw();
    ta = new webjs.Table_web("DIACRITIC_P",$("div.area_tb#punctuationd")[0]);
    ta.draw();
    let tb;
    tb = new webjs.Table_web("GSUB",$("div.area_tb#gsub")[0]);
    tb.draw();
    tb = new webjs.Table_web("Parser",$("div.area_tb#parser")[0]);
    tb.draw();

    tb = new webjs.Table_web("GPOS",$("div.area_tb#gpos")[0]);
    tb.draw();

    tb = new webjs.Sandbox_web($("div.area_tb#sandbox")[0]);
    tb.draw();

    tb = new webjs.LayoutDebug_web($("div.area_tb#layouttest")[0]);
    tb.draw();

    const object = document.createElement("input");
    object.contentEditable = false;
    object.type = "button";
    object.style.display ="block";
    object.value = "jsonとして出力";
    object.name = "export";
    object.addEventListener("click",() => {khhyl.Thaqqa_DB.export();},true);
    $("div.area_tb#export")[0].appendChild(object);
  

    //$(this.where)[0]
  }


  self.addEventListener("load", async () => {
    console.log("ページが完全に読み込まれました");
   
    await main();

  });