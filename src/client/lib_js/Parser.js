import { Thaqqa_DB } from "./Thaqqa_DB.js"; // ,DataTable,Data 
import { RegExp_Khhyl } from "./RegExp_Khhyl.js";
class Parser {
  static setParserColumnAll(){
    const table = Thaqqa_DB.getTable("PARSER");
    const ParserData = table.data
    for(let i = 0;i<ParserData.length;i++){
        //console.log(GSUBdata[i].values.ID)
        let r = new RegExp_Khhyl(ParserData[i].values.Name,{});
        r = r.ParseRegExp()
        const r_ = r.toNormalRegExp();
        table.rewriteData({ID:ParserData[i].values.ID},{Parsed:r_});
    }
}
    static setParserColumn(id){
        const table = Thaqqa_DB.getTable("PARSER");
        const ParserData = table.getData( {ID:id}); //table.getData( {ID:id});//table.data
        for(let i = 0;i<ParserData.length;i++){
            //console.log(GSUBdata[i].values.ID)
            let r = new RegExp_Khhyl(ParserData[i].values.Name,{});
            r = r.ParseRegExp()
            const r_ = r.toNormalRegExp();
            table.rewriteData({ID:ParserData[i].values.ID},{Parsed:r_});
        }
    }
    static parse(raw,type) {

      const table = Thaqqa_DB.getTable("PARSER");

      const r_ = raw.split("");
      let raw_new = "";
      for(const r of r_){
        raw_new += `R(${r})`
      }

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