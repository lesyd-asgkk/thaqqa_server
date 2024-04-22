import { FontManager,RegExp_Khhyl } from "../deps.js"; // ,DataTable,Data 

class Parser {
  static getParser(param) {
    if(typeof param == "string") param = {Name:param};
    if(param instanceof RegExp) param = {Name:param};
    const tables = FontManager.getStaticTable("Parser");

    return tables.getData(param);
  }
  static rewriteParser(param,param2){
    if(typeof param == "string") param = {Name:param};
    else if(param instanceof RegExp) param = {Name:param};
    if(typeof param2 == "string") param2 = {Name:param2};
    const tables = FontManager.getStaticTable("Parser");

    const Parser_a = Parser.getParser(param.Name);
    const Parser_b = Parser.getParser(param.Name);
    if(param.Name != null && Parser_a.length >= 2 && param2.Name!=null)throw new Error("変更後に重複が発生します");
    if(param2.Name != null && Parser_b.length != 0)throw new Error("変更後に重複が発生します");

    return tables.rewriteData(param,param2,-1);
  }
  static deleteParser(param,safety){
    safety ??= true;
    if(typeof param == "string") param = {Name:param};
    if(param instanceof RegExp) param = {Name:param};
    if(safety && Parser.getParser(param).length > 1) return new Error("削除対象が2つ以上あります。まとめて削除したい場合はsafetyをfalseに指定してください");
    const tables = FontManager.getStaticTable("Parser");
    return tables.deleteData(param,1);
  }
  static createParser(param){
    if(typeof param == "string") param = {Name:param};
    if(Parser.getParser(param).length != 0) return new Error(`${param}はすでに存在しています`);
    if(typeof param == "string"){
      param ={Name: param, Pattern:"u",Pattern_sub:"DIAC",OffsetX0: 0, OffsetY0: 0,OffsetX1: 0,OffsetY1: 0, Priority:0};
    }
    const table_ = FontManager.getStaticTable(table);
    table_.createData(param);
  }
  static setParserColumnAll(){
    Parser.setParserColumn();
  }
  static setParserColumn(id){
    const table = FontManager.getStaticTable("PARSER");
    const ParserData = id==null?table.dataList:table.getData( {ID:id});
      ParserData.forEach((i) => {const r_ = new RegExp_Khhyl(i.getVal("Name"),{}).ParseRegExp().toNormalRegExp();
      table.rewriteData({ID:i.getVal("ID")},{Parsed:r_});})
    
  }
  static parse(raw,type) {
    const table = FontManager.getStaticTable("PARSER");
    const r_ = raw.split("");
    let raw_new = "";
    r_.forEach((r) => raw_new += `R(${r})`); 
    const array = table.getData({Pattern:(type==0?/(u|c)/:/(u|o)/)});
    const sortalg = function(first, second ){//Priorityの大きい順に並び替える
      if (first.getVal("Order") > second.getVal("Order") ) return 1;
      else if (first.getVal("Order")  < second.getVal("Order") )return -1;
      else{
      if (first.getVal("Priority") > second.getVal("Priority") ) return 1;
      else if (first.getVal("Priority")  < second.getVal("Priority") )return -1;
      return 0};
      }
    array.sort(sortalg);
    array.forEach((i) => {raw_new = raw_new.replaceAll(new RegExp(i.getVal("Parsed"), "g"),i.getVal("NameAlt"));});

  return raw_new;
  }
}
  
export{Parser};