import { FontManager } from "./Font.js";
import { RegExp_Khhyl } from "./RegExp_Khhyl.js";
class GSUBManager {
    static getGSUB(param) {
            if(typeof param == "string") param = {Name:param};
            if(param instanceof RegExp) param = {Name:param};
            const tables = FontManager.getStaticTable("GSUB");
            return tables.getData(param);
            
        }
    static rewriteGSUB(param,param2){
        if(typeof param == "string") param = {Name:param};
        else if(param instanceof RegExp) param = {Name:param};
        if(typeof param2 == "string") param2 = {Name:param2};
        const tables = FontManager.getStaticTable("GSUB");

        const GSUB_a = GSUBManager.getGSUB(param.Name);
        const GSUB_b = GSUBManager.getGSUB(param.Name);
            if(param.Name != null && GSUB_a.length >= 2 && param2.Name!=null)throw new Error("変更後に重複が発生します");
            if(param2.Name != null && GSUB_b.length != 0)throw new Error("変更後に重複が発生します");
        const b = tables.rewriteData(param,param2,-1);
        return b;
    }
    static deleteGSUB(param,safety){
        safety ??= true;
        if(typeof param == "string") param = {Name:param};
        if(param instanceof RegExp) param = {Name:param};
        if(safety && GSUBManager.getGSUB(param).length > 1) return new Error("削除対象が2つ以上あります。まとめて削除したい場合はsafetyをfalseに指定してください");
        const tables = FontManager.getStaticTable("GSUB");
        const data = tables.deleteData(param,1);
        return data;
    }
    static createGSUB(param){
        if(typeof param == "string") param = {Name:param};
        if(GSUBManager.getGSUB(param).length != 0) return new Error(param+"はすでに存在しています");
        if(typeof param == "string"){
            param ={Name: param, Pattern:"u",Pattern_sub:"DIAC",OffsetX0: 0, OffsetY0: 0,OffsetX1: 0,OffsetY1: 0, Priority:0};
        }
        const table_ = FontManager.getStaticTable(table);
        table_.createData(param);
    }
    static setGSUBColumnAll(){
        GSUBManager.setGSUBColumn();
    }
    static setGSUBColumn(id){
        const table = FontManager.getStaticTable("GSUB");
        const GSUBdata = id==null?table.dataList:table.getData( {ID:id});
        GSUBdata.forEach((i)=>{const r_ = new RegExp_Khhyl(i.getVal("Name"),{}).ParseRegExp().toNormalRegExp();
        table.rewriteData({ID:i.getVal("ID")},{Parsed:r_});});
     }
    static gsub(text,vec){
        const table = FontManager.getStaticTable("GSUB");
        const array = table.getData({Pattern:(vec==0?/(u|v)/:/(u|h)/)});
        const sortalg = function(first, second ){//Priorityの大きい順に並び替える
            if (first.getVal("Order") > second.getVal("Order") ) return 1;
            else if (first.getVal("Order")  < second.getVal("Order") )return -1;
            else{
            if (first.getVal("Priority") > second.getVal("Priority") ) return 1;
            else if (first.getVal("Priority")  < second.getVal("Priority") )return -1;
            return 0};
            }
        array.sort(sortalg);
        array.forEach((i)=>{if(typeof i.getVal("Name") == "string"){ text = text.replaceAll(new RegExp(i.getVal("Parsed"), "g"),i.getVal("NameAlt"));}})
    return text;
    }
}

export{GSUBManager};