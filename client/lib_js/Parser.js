import { Thaqqa_DB,DataTable,Data } from "./Thaqqa_DB.js";
import { RegExp_Khhyl } from "./RegExp_Khhyl.js";
class Parser {


/*
    const _ParserClose = [
      ["R(A)", "V(null,abig_0)",1],
      ["R(a)", "V(null,a_0)",1],
      ["R(e)", "V(null,e_0)",1],
      ["R(i)", "V(null,i_0)",1],
      ["R(o)", "V(null,o_0)",1],
      ["R(u)", "V(null,u_0)",1],
      ["R(v|ö)", "V(null,v_0)",1],
      ["R(E|ë)", "V(null,eold_0)",1],
      ["R(I|ï)", "V(null,iold_0)",1],
      ["R(t)", "C(null,t_0)",1],
      ["R(k)", "C(null,k_0)",1],
      ["R(q)", "C(null,q_0)",1],
      ["R(')", "C(null,c_0)",1],
      ["R(n)", "C(null,n_0)",1],
      ["R(n)R(g)", "C(null,ng_0)",2],
      ["R(t)R(h)", "C(null,th_0)",2],
      ["R(s)", "C(null,s_0)",1],
      ["R(h)R(y)", "C(null,hy_0)",2],
      ["R(k)R(h)", "C(null,kh_0)",2],
      ["R(q)R(h)", "C(null,qh_0)",2],
      ["R(h)", "C(null,h_0)",1],
      ["R(d)R(h)", "C(null,th_0-d_0)",2],
      ["R(z)", "C(null,s_0-d_0)",1],
      ["R(z)R(h)", "C(null,hy_0-d_0)",2],
      ["R(g)R(h)", "C(null,kh_0-d_0)",2],
      ["R(r)R(h)", "C(null,qh_0-d_0)",2],
      ["R(c)", "C(null,h_0-d_0)",1],
      ["R(l)", "C(null,l_0)",1],
      ["R(r)", "C(null,r_0)",1],
      ["R(t)R(l)", "C(null,tl_0)",2],
      ["R(y)", "C(null,y_0)",1],
      ["R(w)", "C(null,w_0)",1],
      ["(V(*,(?:a|e|i|o|u|v|eold|iold|abig))){2}(C(*)|(P(*)|$))","$1C(null,c_0)$2",0],

      ["(V(*,a)){2}(V(*,[_.Name!='a']))","$1C(null,c_0)$2",0],
      ["(V(*,e)){2}(V(*,[_.Name!='e']))","$1C(null,c_0)$2",0],
      ["(V(*,i)){2}(V(*,[_.Name!='i']))","$1C(null,c_0)$2",0],
      ["(V(*,o)){2}(V(*,[_.Name!='o']))","$1C(null,c_0)$2",0],
      ["(V(*,u)){2}(V(*,[_.Name!='u']))","$1C(null,c_0)$2",0],
      ["(V(*,v)){2}(V(*,[_.Name!='v']))","$1C(null,c_0)$2",0],
      ["(V(*,eold)){2}(V(*,[_.Name!='eold']))","$1C(null,c_0)$2",0],
      ["(V(*,iold)){2}(V(*,[_.Name!='iold']))","$1C(null,c_0)$2",0],
      ["(V(*,abig)){2}(V(*,[_.Name!='abig']))","$1C(null,c_0)$2",0],
      [
        "(V(*)|C(*,[_.Name!='c']_.))C(*,c)(V(*)|C(*,[_.Name!='c']_.))",
        "$1$2",0
      ],
    ];*/


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
        if (first.values.Priority > second.values.Priority ) return 1;
        else if (first.values.Priority  < second.values.Priority )return -1;
          return 0};
      }
      array.sort(sortalg);

      //console.log(array);
      for(let i = 0;i<array.length;i++){
        //console.log(array[i].values.Name);
        //if(array[i].values.Order >= 90 && array[i].values.Priority != 1) continue;
        let r = new RegExp_Khhyl(array[i].values.Name,{});
        r = r.ParseRegExp()
        const r_ = r.toNormalRegExp();
        const r_fin = new RegExp(r_, "g");


        //console.log("-------");

        /**/
        raw_new = raw_new.replaceAll(r_fin,array[i].values.NameAlt);
    }
    return raw_new;
    }
  }
  
export{Parser};