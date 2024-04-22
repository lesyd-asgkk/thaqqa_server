import { FontManager,RegExp_Khhyl } from "../deps.js";

class GSUBF_Manager {
    static getGSUBF(param,font) {
            if(typeof param == "string") param = {Name:param};
            if(param instanceof RegExp) param = {Name:param};
            const table_ = FontManager.getFont(font).getTable("GSUB");
            return table_.getData(param);
            
        }
    static rewriteGSUBF(param,param2,font){
        if(typeof param == "string") param = {Name:param};
        else if(param instanceof RegExp) param = {Name:param};
        if(typeof param2 == "string") param2 = {Name:param2};
        const table_ = FontManager.getFont(font).getTable("GSUB");

        const GSUB_a = GSUBF_Manager.getGSUBF(param.Name,font);
        const GSUB_b = GSUBF_Manager.getGSUBF(param.Name,font);
            if(param.Name != null && GSUB_a.length >= 2 && param2.Name!=null)throw new Error("変更後に重複が発生します");
            if(param2.Name != null && GSUB_b.length != 0)throw new Error("変更後に重複が発生します");
        const b = table_.rewriteData(param,param2,-1);
        return b;
    }
    static deleteGSUBF(param,font,safety){
        safety ??= true;
        if(typeof param == "string") param = {Name:param};
        if(param instanceof RegExp) param = {Name:param};
        if(safety && GSUBF_Manager.getGSUBF(param,font).length > 1) return new Error("削除対象が2つ以上あります。まとめて削除したい場合はsafetyをfalseに指定してください");
        const table_ = FontManager.getFont(font).getTable("GSUB");
        const data = table_.deleteData(param,1);
        return data;
    }
    static createGSUBF(param,font){
        if(typeof param == "string") param = {Name:param};
        if(GSUBF_Manager.getGSUBF(param,font).length != 0) return new Error(param+"はすでに存在しています");
        if(typeof param == "string"){
            param ={Name: param, Pattern:"u",Pattern_sub:"DIAC",OffsetX0: 0, OffsetY0: 0,OffsetX1: 0,OffsetY1: 0, Priority:0};
        }
        const table_ = FontManager.getFont(font).getTable("GSUB");
        table_.createData(param);
    }
    static setGSUBFColumnAll(font){
        GSUBF_Manager.setGSUBFColumn(font);
    }
    static setGSUBFColumn(id,font){
        const table = FontManager.getFont(font).getTable("GSUB");
        const GSUBdata = id==null?table.dataList:table.getData( {ID:id});
        GSUBdata.forEach((i)=>{const r_ = new RegExp_Khhyl(i.getVal("Name"),{}).ParseRegExp().toNormalRegExp();
        table.rewriteData({ID:i.getVal("ID")},{Parsed:r_});});
     }
    static gsub(text,vec,font){
        const table = FontManager.getFont(font).getTable("GSUB");
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

export{GSUBF_Manager};