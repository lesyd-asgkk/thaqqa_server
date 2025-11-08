
import * as khhyl from "./lib_js/deps.js";
import * as webjs from "./web_js/deps.js";

function export_(){
  const binaryArrayList = khhyl.FontManager.export_as_Json();
  {
  const binaryArray = binaryArrayList[0];
  const blob = new Blob([JSON.stringify(binaryArray, null, '  ')], {type: 'application\/json'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; 
  link.download = "root.json"; 
  link.click();
  }
  {
    const binaryArray_ = binaryArrayList[1];
    for(const i in binaryArray_){
        const binaryArray = binaryArray_[i];
      const blob = new Blob([JSON.stringify(binaryArray, null, '  ')], {type: 'application\/json'});
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; 
      link.download = `${i}.json`; 
      link.click();
      }
    }
}
  async function main(){

  await khhyl.FontManager.load_all(["default","sanserif","fude","siddham"]);
  await khhyl.GlyphManager.loadAll("default");
  await khhyl.GlyphManager.loadAll("fude");
  await khhyl.GlyphManager.loadAll("sanserif");
  await khhyl.GlyphManager.loadAll("siddham");

  

    const r_ = new khhyl.RegExp_Khhyl("P([_.IsNewline]_-*)",{}).ParseRegExp().toNormalRegExp();
    console.log(r_);
    console.log(khhyl.FontManager.getFont("default"));

    let ta = new webjs.Table_web("VOWEL",$("div.area_tb#vowel")[0],"default");
    ta.draw();
    ta = new webjs.Table_web("DIACRITIC_V",$("div.area_tb#voweld")[0],"default");
    ta.draw();
    ta = new webjs.Table_web("CONSONANT",$("div.area_tb#consonant")[0],"default");
    ta.draw();
    ta = new webjs.Table_web("DIACRITIC_C",$("div.area_tb#consonantd")[0],"default");
    ta.draw();
    ta = new webjs.Table_web("PUNCTUATION",$("div.area_tb#punctuation")[0],"default");
    ta.draw();
    ta = new webjs.Table_web("DIACRITIC_P",$("div.area_tb#punctuationd")[0],"default");
    ta.draw();
    
    let tb;
    tb = new webjs.Table_web("GSUB",$("div.area_tb#gsub")[0],"default");
    tb.draw();
    tb = new webjs.Table_web("F_GSUB",$("div.area_tb#f_gsub")[0],"default");
    tb.draw();
    tb = new webjs.Table_web("PARSER",$("div.area_tb#parser")[0],"default");
    tb.draw();

    tb = new webjs.Table_web("GPOS",$("div.area_tb#gpos")[0],"default");
    tb.draw();

    tb = new webjs.Table_web("ROOTDATA",$("div.area_tb#rootdata")[0],"default");
    tb.draw();
    tb = new webjs.Table_web("FONTDATA",$("div.area_tb#fontdata")[0],"default");
    tb.draw();

    tb = new webjs.Sandbox_web($("div.area_tb#sandbox")[0],"default");  
    tb.draw();

    tb = new webjs.LayoutDebug_web($("div.area_tb#layouttest")[0],"default");
    tb.draw();

    

    /*khhyl.Parser.setParserColumnAll();
    khhyl.GPOSManager.setGPOSColumnAll("default");
    khhyl.GSUBManager.setGSUBColumnAll();*/
    const object = document.createElement("input");
    object.contentEditable = false;
    object.type = "button";
    object.style.display ="block";
    object.value = "jsonとして出力";
    object.name = "export";
    object.addEventListener("click",() => {export_();},true);
    $("div.area_tb#export")[0].appendChild(object);

    
  }
  self.addEventListener("load", async () => {
    console.log("ページが完全に読み込まれました");
    await main();
  });

  