
import * as KhHyL_TH from "./lib_js/deps.js";
let SQL;
async function init(){

    const initSqlJs = window.initSqlJs;
    SQL = await initSqlJs({
      // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
      // You can omit locateFile completely when running in node
      locateFile: file => `https://sql.js.org/dist/${file}`
    });

    //document.write(`<script src=\"./main.js\"></script> `);
  }
  
  async function main(){
    await KhHyL_TH.Thaqqa_DB.load();



    console.log("----------");
    let k;
    k = KhHyL_TH.Parser.test("suzus'ha koratl", 0);
    k = KhHyL_TH.GSUBManager.gsub(k, 0);
    console.log(k);
    k = KhHyL_TH.Parser.test("rlryoi knngwahye", 1);
    k = KhHyL_TH.GSUBManager.gsub("rlryoi knngwahye", 1);
    console.log(k);
//S(null,*)S(null,s_0-d_0,u_0,s_0)S(null,h_0,a_0,)P(space_0)S(null,k_0,o_0,)S(null,r_0,a_0,tl_0)
    k = KhHyL_TH.Parser.test("nnrenl rnteknpa", 1);
    k = KhHyL_TH.GSUBManager.gsub("nnrenl rnteknpa", 1);
    console.log(k);

  }


  self.addEventListener("load", async () => {
    console.log("ページが完全に読み込まれました");
    await init();
    await main();

  });