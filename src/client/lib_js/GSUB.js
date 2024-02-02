import { Thaqqa_DB,DataTable,Data } from "./Thaqqa_DB.js";
import { RegExp_Khhyl } from "./RegExp_Khhyl.js";
class GSUBManager {
/*
    static getGSUB(table, param){
        if(table.match(/^(GSUB)$/) == null) throw new Error("テーブル指定エラー");
        if(typeof param == "string") param = {Name:param};
        if(param instanceof RegExp) param = {Name:param};
        const tables = Thaqqa_DB.getTable(table);
        let ans  = [];
        if(tables.constructor.name == "Error") throw tables;
        else{
            const data = tables.getData(param);
            if(data.constructor.name == "Error") throw data;
            else ans = ans.concat(data);
        }
        return ans;
    }

    
    static rewriteGSUB(table,param,param2){
        if(table.match(/^(GSUB)$/) == null) throw new Error("テーブル指定エラー");
        if(typeof param == "string") param = {Name:param};
        else if(param instanceof RegExp) param = {Name:param};
        if(typeof param2 == "string") param2 = {Name:param2};
        const tables = Thaqqa_DB.getTable(table);
        let ans = [];

            if(param.Name != null && GSUBManager.getGSUB(table,param.Name).length >= 2 && param2.Name!=null)throw new Error("変更後に重複が発生します");
            if(param2.Name != null && GSUBManager.getGSUB(table,param2.Name).length != 0)throw new Error("変更後に重複が発生します");
            if(tables.constructor.name == "Error") throw tables;
            else{
                    if(tables instanceof Error){throw tables;}
                    const b = tables.rewriteData(param,param2,-1);
                    ans = ans.concat(b);
                }
            return ans;
    }

    static deleteGSUB(table, param,safety){
        if(table.match(/^(GSUB)$/) == null) throw new Error("テーブル指定エラー");
        safety ??= true;
        if(typeof param == "string") param = {Name:param};
        if(param instanceof RegExp) param = {Name:param};
        
        if(safety && GSUBManager.getGSUB(table,param).length > 1) throw new Error("削除対象が2つ以上あります。まとめて削除したい場合はsafetyをfalseに指定してください");
        const tables = Thaqqa_DB.getTable(table);
        let ans = [];
            if(tables instanceof Error){throw tables;}
            const data = tables.deleteData(param,1);
            ans = ans.concat(data);
            return ans;
    }
    static createGSUB(table,param){//
        if(table.match(/^(GSUB)$/) == null) throw new Error("テーブル指定エラー");
        if(typeof param == "string") param = {Name:param};

        if(GSUBManager.getGSUB(table,param).length != 0) throw new Error(param+"はすでに存在しています");

        const table_ = Thaqqa_DB.getTable(table);
        table_.createData(param);
        }　*/

        static setGSUBColumnAll(){
            const table = Thaqqa_DB.getTable("GSUB");
            const GSUBdata = table.data
            for(let i = 0;i<GSUBdata.length;i++){
                //console.log(GSUBdata[i].values.ID)
                let r = new RegExp_Khhyl(GSUBdata[i].values.Name,{});
                r = r.ParseRegExp()
                const r_ = r.toNormalRegExp();
                table.rewriteData({ID:GSUBdata[i].values.ID},{Parsed:r_});
            }
        }
        static setGSUBColumn(id){
            const table = Thaqqa_DB.getTable("GSUB");
            const GSUBdata = table.getData( {ID:id}); //table.getData( {ID:id});//table.data
            for(let i = 0;i<GSUBdata.length;i++){
                //console.log(GSUBdata[i].values.ID)
                let r = new RegExp_Khhyl(GSUBdata[i].values.Name,{});
                r = r.ParseRegExp()
                const r_ = r.toNormalRegExp();
                table.rewriteData({ID:GSUBdata[i].values.ID},{Parsed:r_});
            }
        }
    static gsub(text,vec){

        const table = Thaqqa_DB.getTable("GSUB");
      const array = table.getData({Pattern:(vec==0?/(u|v)/:/(u|h)/)});
      const sortalg = function(first, second ){//Priorityの大きい順に並び替える
        if (first.values.Order > second.values.Order ) return 1;
        else if (first.values.Order  < second.values.Order )return -1;
        else{
        if (first.values.Priority > second.values.Priority ) return 1;
        else if (first.values.Priority  < second.values.Priority )return -1;
          return 0};
      }
      array.sort(sortalg);
    for(let i = 0;i<array.length;i++){
        if(typeof array[i].values.Name == "string"){
        const r_fin = new RegExp(array[i].values.Parsed, "g");
        text = text.replaceAll(r_fin,array[i].values.NameAlt);
    }
    }
    return text;
    }

    
}

export{GSUBManager};