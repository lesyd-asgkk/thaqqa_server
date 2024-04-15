import { Database } from "./Database.js";
import { RegExp_Khhyl } from "./RegExp_Khhyl.js";
class GSUBManager {
    static getGSUB(param) {
            if(typeof param == "string") param = {Name:param};
            if(param instanceof RegExp) param = {Name:param};
            const tables = Database.getTable("GSUB");
            let ans = [];
            const data = tables.getData(param);
            ans = ans.concat(data);
            return ans;
        }
    static rewriteGSUB(param,param2){
        if(typeof param == "string") param = {Name:param};
        else if(param instanceof RegExp) param = {Name:param};
        if(typeof param2 == "string") param2 = {Name:param2};
        const tables = Database.getTable("GSUB");
        const ans  = [];
        const GSUB_a = GSUBManager.getGSUB(param.Name);
        const GSUB_b = GSUBManager.getGSUB(param.Name);
            if(param.Name != null && GSUB_a.length >= 2 && param2.Name!=null)throw new Error("変更後に重複が発生します");
            if(param2.Name != null && GSUB_b.length != 0)throw new Error("変更後に重複が発生します");
        const b = tables.rewriteData(param,param2,-1);
        ans.concat(b);
        return ans;
    }
    
    static deleteGSUB(param,safety){
        safety ??= true;
        if(typeof param == "string") param = {Name:param};
        if(param instanceof RegExp) param = {Name:param};
        if(safety && GSUBManager.getGSUB(param).length > 1) return new Error("削除対象が2つ以上あります。まとめて削除したい場合はsafetyをfalseに指定してください");
        const tables = Database.getTable("GSUB");
        let ans = [];
        const data = tables.deleteData(param,1);
        ans = ans.concat(data);
        return ans;
    }
    static createGSUB(param){
        if(typeof param == "string") param = {Name:param};
        if(GSUBManager.getGSUB(param).length != 0) return new Error(param+"はすでに存在しています");
        if(typeof param == "string"){
            param ={Name: param, Pattern:"u",Pattern_sub:"DIAC",OffsetX0: 0, OffsetY0: 0,OffsetX1: 0,OffsetY1: 0, Priority:0};
        }
        const table_ = Database.getTable(table);
        table_.createData(param);
    }
    static setGSUBColumnAll(){
        const table = Database.getTable("GSUB");
        const GSUBdata = table.dataList
        for(let i = 0;i<GSUBdata.length;i++){
            let r = new RegExp_Khhyl(GSUBdata[i].values.Name,{});
            r = r.ParseRegExp()
            const r_ = r.toNormalRegExp();
            table.rewriteData({ID:GSUBdata[i].values.ID},{Parsed:r_});
        }
    }
    static setGSUBColumn(id){
        const table = Database.getTable("GSUB");
        const GSUBdata = table.getData( {ID:id});
        for(let i = 0;i<GSUBdata.length;i++){
        let r = new RegExp_Khhyl(GSUBdata[i].values.Name,{});
        r = r.ParseRegExp()
        const r_ = r.toNormalRegExp();
        table.rewriteData({ID:GSUBdata[i].values.ID},{Parsed:r_});
        }
     }
    static gsub(text,vec){
        const table = Database.getTable("GSUB");
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