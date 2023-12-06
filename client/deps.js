document.write(`<script src=\"./lib_js/Thaqqa_DB.js\"></script> `);
async function init(){
    {const filename = 
        ["Glyph.js",//"Thaqqa_DB.js",
        "GPOS.js","GSUB.js",
        "Letter.js","Parser.js","Parser_alt.js",
        "RegExp_Khhyl.js","Rek_def.js",
        "SVG.js",
    ];
    
    for(const f of filename)
    document.write(`<script src=\"./lib_js/${f}\"></script> `);
    //type = 'module'
    }

    
    const initSqlJs = window.initSqlJs;
    SQL = await initSqlJs({
      // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
      // You can omit locateFile completely when running in node
      locateFile: file => `https://sql.js.org/dist/${file}`
    });
  }

  async function main(){
    await Thaqqa_DB.import("/server/default.db");
    console.log(await Thaqqa_DB.async_loadData() );
  }

  async function funcall(){
    await init();
    
    await main();
    }
    
    funcall();
