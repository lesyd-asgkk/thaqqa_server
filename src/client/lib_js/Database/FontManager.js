/*
◎真・Database.jsonの構造
◯db_common.json
・Parser
・GSUB(共通部分)
・Letter(共通部分)

◯(fontname)/db.json
・Fontdata
・Letter（非共通部分）（予備）
・GSUB
・GPOS
・Glyph

◎javascript側では
・FontManagerを新設し、中にfontList:Font[]を入れる。
・Fontを新設し、中にtableList[]を入れる。
・Tableにfont項目を追加（※parent枠）
・Parser,GSUB（共通）,Letter（共通）はstatic ParserManagerのように。（最悪FontManagerに紐づけ）
・

*/

import { DataTable } from "../deps.js";

class FontManager {
    static fontList = [];
    static staticTableList = [];

    
    static import(data,isroot,filename) {
        //console.log(data);
        
        if(!isroot){
            const font = FontManager.createFont(filename);
            for(const i in data)
            {
            font.tableList.push(new DataTable(data[i],font));
        }
        }
        else{
        for(const i in data)
        {
            if(!FontManager.getStaticTable(data[i].name))
            {FontManager.staticTableList.push(new DataTable(data[i],FontManager));}} 
      }
    }
  
    static async load(path,isroot){
      await fetch(path)//
    .then(response => response.json())
    .then(data => {
      FontManager.import(data,isroot,isroot?null:path.split("/").slice(-1)[0].split(".")[0]);
    })
    .catch(error => console.error('Error fetching data:', error));
    }
  
    //*
    static export(){
      const binaryArrayList = FontManager.export_as_Json();
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
      static export_as_Json() {
      const json_data_common= {};
      const json_data= {};
      for (const j in FontManager.staticTableList) {
            const table = FontManager.staticTableList[j];
            const table_data= {};const column_data = {};
            table.columnList.forEach((h) => {column_data[h.name] = {name:h.name,id:h.id,type:h.type,order:h.order,subtype:h.subtype};});
            table_data.name = table.name;
            table_data.columnList = column_data;
            const data_data = {};
          const f = function(h,v_){table.columnList.forEach((i) => {const c = i.name;v_[c] = h.valueList[c];});}
          table.dataList.forEach((h) => {const v_ = {}; f(h,v_); data_data[h.valueList.ID] = v_;});
            table_data.data = data_data;
            json_data_common[table.name] = table_data;
      }
      for (const n in FontManager.fontList){
        const font = FontManager.fontList[n];
        const font_data= {};
        for (const j in font.tableList) {
            
            const table = font.tableList[j];
            const table_data= {};const column_data = {};
            
            table.columnList.forEach((h) => {column_data[h.name] = {name:h.name,id:h.id,type:h.type,order:h.order,subtype:h.subtype};});
            table_data.name = table.name;
            table_data.columnList = column_data;
        
            const data_data = {};
            const f = function(h,v_){table.columnList.forEach((i) => {const c = i.name;v_[c] = h.valueList[c];});}
            table.dataList.forEach((h) => {const v_ = {}; f(h,v_); data_data[h.valueList.ID] = v_;});
  
            table_data.data = data_data;
            font_data[table.name] = table_data;
            }
        json_data[font.name] = font_data;
        }
      return [json_data_common,json_data];
    }
     //*/

    static getFont(name,debug) { //nameのテーブルを返す。無かったらnullで
      debug??=false;
      for (const i in FontManager.fontList) {
        if (FontManager.fontList[i].name == name) return FontManager.fontList[i];
      }
      if(debug)throw new Error(`${name}は存在しません`);else return null;
    }
  
    
    static createFont(name) {
      try {
          if (FontManager.getFont(name) != null) {
            const errmessage = `${name}は既に存在します`;
            throw new Error(errmessage);
          }
        const creation = new Font(name);
        FontManager.fontList.push(creation);
        return creation;
      } catch (e) {
        throw e;
      }
    }
    static deleteFont(name) {
      try {
        const deletion = FontManager.getFont(name,true);
        const index = FontManager.fontList.indexOf(deletion);
        FontManager.fontList.splice(index, 1);
      } catch (e) {
        throw e;
      }
    }
    static rewriteFont(name, name_alt) {
      try {
        const errmessage = [];
        const table_rewrite = FontManager.getFont(name);
        if (table_rewrite==null) errmessage.push(`${name}は存在しません`);
        if (FontManager.getFont(name_alt) != null) errmessage.push(`${name_alt}は既に存在します`);
        if (errmessage.length != 0) throw new Error(errmessage.join("\n"));
        
        if (table_rewrite != null) table_rewrite.name = name_alt;
      } catch (e) {
        throw e;
      }
    }


    static getStaticTable(name,debug) { //nameのテーブルを返す。無かったらnullで
        debug??=false;
        for (const i in FontManager.staticTableList) {
          if (FontManager.staticTableList[i].name == name) return FontManager.staticTableList[i];
        }
        
        if(debug)throw new Error(`${name}は存在しません`);else return null;
      }
    
      static createStaticTable(name) {
        try {
            if (FontManager.getStaticTable(name) != null) {
              const errmessage = `${name}は既に存在します`;
              throw new Error(errmessage);
            }
          const creation = new DataTable(name);
          FontManager.staticTableList.push(creation);
          return creation;
        } catch (e) {
          throw e;
        }
      }
      static deleteStaticTable(name) {
        try {
          const deletion = FontManager.getStaticTable(name,true);
          const index = FontManager.staticTableList.indexOf(deletion);
          FontManager.staticTableList.splice(index, 1);
        } catch (e) {
          throw e;
        }
      }
      static rewriteStaticTable(name, name_alt) {
        try {
          const errmessage = [];
          const table_rewrite = FontManager.getStaticTable(name);
          if (table_rewrite==null) errmessage.push(`${name}は存在しません`);
          if (FontManager.getStaticTable(name_alt) != null) errmessage.push(`${name_alt}は既に存在します`);
          if (errmessage.length != 0) throw new Error(errmessage.join("\n"));
          
          if (table_rewrite != null) table_rewrite.name = name_alt;
        } catch (e) {
          throw e;
        }
      }

      
}
class Font {
    constructor(name){
        this.name=name;
        this.tableList = [];
    }

    getTable(name,debug) { //nameのテーブルを返す。無かったらnullで
        debug??=false;
        for (const i in this.tableList) {
          if (this.tableList[i].name == name) return this.tableList[i];
        }
        if(debug)throw new Error(`${name}は存在しません`);else return null;
      }
    
    createTable(name) {
        try {
            if (this.getTable(name) != null) {
              const errmessage = `${name}は既に存在します`;
              throw new Error(errmessage);
            }
          const creation = new DataTable(name);
          this.tableList.push(creation);
          return creation;
        } catch (e) {
          throw e;
        }
      }
    deleteTable(name) {
        try {
          const deletion = this.getTable(name,true);
          const index = this.tableList.indexOf(deletion);
          this.tableList.splice(index, 1);
        } catch (e) {
          throw e;
        }
      }
    rewriteTable(name, name_alt) {
        try {
          const errmessage = [];
          const table_rewrite = this.getTable(name);
          if (table_rewrite==null) errmessage.push(`${name}は存在しません`);
          if (this.getTable(name_alt) != null) errmessage.push(`${name_alt}は既に存在します`);
          if (errmessage.length != 0) throw new Error(errmessage.join("\n"));
          
          if (table_rewrite != null) table_rewrite.name = name_alt;
        } catch (e) {
          throw e;
        }
      }
}
export{FontManager,Font}