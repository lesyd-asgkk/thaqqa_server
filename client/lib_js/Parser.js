import { Thaqqa_DB,DataTable,Data } from "./Thaqqa_DB.js";
import { RegExp_Khhyl } from "./RegExp_Khhyl.js";
class Parser {

    static Define(){
      
            const table = Thaqqa_DB.getTable("Parser");

      console.log(table);
    }

    static test(raw,type) {

      const table = Thaqqa_DB.getTable("Parser");

      const _ParserClose = table.getData({Pattern:"c"});
      const _ParserUniv = table.getData({Pattern:"u"});
      const _ParserOpen =table.getData({Pattern:"o"});

      const r_ = raw.split("");
      let raw_new = "";
      for(const r of r_){
        raw_new += `R(${r})`
      }
      const array = (type==0?_ParserClose:_ParserOpen).concat(_ParserUniv);
      const sortalg = function(first, second ){//Priorityの大きい順に並び替える
        if (first.values.Order > second.values.Order ) return 1;
        else if (first.values.Order  < second.values.Order )return -1;
        else{
        if (first.values.Priority > second.values.Priority ) return -1;
        else if (first.values.Priority  < second.values.Priority )return 1;
          return 0};
      }
      array.sort(sortalg);

      for(let i = 0;i<array.length;i++){
        
        let r = new RegExp_Khhyl(array.values.Name,{});
        r = r.ParseRegExp()
        const r_ = r.toNormalRegExp();
        const r_fin = new RegExp(r_, "g");

        /*console.log("-------");
        console.log(array[i][0]);
        console.log(r_fin);
        */
        raw_new = raw_new.replaceAll(r_fin,array.values.NameAlt);
    }
    return raw_new;
    }
  }
  
export{Parser};