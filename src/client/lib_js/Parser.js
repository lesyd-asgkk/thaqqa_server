import { Database } from "./Database.js"; // ,DataTable,Data 
import { RegExp_Khhyl } from "./RegExp_Khhyl.js";
class Parser {
  static getParser(param) {
    if(typeof param == "string") param = {Name:param};
    if(param instanceof RegExp) param = {Name:param};
    const tables = Database.getTable("Parser");
    let ans = [];
    const data = tables.getData(param);
    ans = ans.concat(data);
    return ans;
  }
  static rewriteParser(param,param2){
    if(typeof param == "string") param = {Name:param};
    else if(param instanceof RegExp) param = {Name:param};
    if(typeof param2 == "string") param2 = {Name:param2};
    const tables = Database.getTable("Parser");
    const ans  = [];
    const Parser_a = Parser.getParser(param.Name);
    const Parser_b = Parser.getParser(param.Name);
    if(param.Name != null && Parser_a.length >= 2 && param2.Name!=null)throw new Error("変更後に重複が発生します");
    if(param2.Name != null && Parser_b.length != 0)throw new Error("変更後に重複が発生します");
    const b = tables.rewriteData(param,param2,-1);
     ans.concat(b);
    return ans;
  }
  static deleteParser(param,safety){
    safety ??= true;
    if(typeof param == "string") param = {Name:param};
    if(param instanceof RegExp) param = {Name:param};
    if(safety && Parser.getParser(param).length > 1) return new Error("削除対象が2つ以上あります。まとめて削除したい場合はsafetyをfalseに指定してください");
    const tables = Database.getTable("Parser");
    let ans = [];
    const data = tables.deleteData(param,1);
    ans = ans.concat(data);
    return ans;
  }
  static createParser(param){
    if(typeof param == "string") param = {Name:param};
    if(Parser.getParser(param).length != 0) return new Error(param+"はすでに存在しています");
    if(typeof param == "string"){
      param ={Name: param, Pattern:"u",Pattern_sub:"DIAC",OffsetX0: 0, OffsetY0: 0,OffsetX1: 0,OffsetY1: 0, Priority:0};
    }
    const table_ = Database.getTable(table);
    table_.createData(param);
  }
  static setParserColumnAll(){
    const table = Database.getTable("PARSER");
    const ParserData = table.data
    for(let i = 0;i<ParserData.length;i++){
      let r = new RegExp_Khhyl(ParserData[i].values.Name,{});
      r = r.ParseRegExp()
      const r_ = r.toNormalRegExp();
      table.rewriteData({ID:ParserData[i].values.ID},{Parsed:r_});
    }
  }
  static setParserColumn(id){
    const table = Database.getTable("PARSER");
    const ParserData = table.getData( {ID:id});
    for(let i = 0;i<ParserData.length;i++){
      let r = new RegExp_Khhyl(ParserData[i].values.Name,{});
      r = r.ParseRegExp()
      const r_ = r.toNormalRegExp();
      table.rewriteData({ID:ParserData[i].values.ID},{Parsed:r_});
    }
  }
  static parse(raw,type) {
    const table = Database.getTable("PARSER");
    const r_ = raw.split("");
    let raw_new = "";
    for(const r of r_) raw_new += `R(${r})`
    const array = table.getData({Pattern:(type==0?/(u|c)/:/(u|o)/)});
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
      const r_fin = new RegExp(array[i].values.Parsed, "g");
      raw_new = raw_new.replaceAll(r_fin,array[i].values.NameAlt);
    }
  return raw_new;
  }
}
  
export{Parser};