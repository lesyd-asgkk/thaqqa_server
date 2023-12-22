import * as Khhyl from "../lib_js/deps.js"
import {DIVparam_web,DIVselect_web,Button_web,SVGField_web} from "./deps.js"

class Row_web{
    constructor(id,parent){
        this.id = id;
        this.content = [];//1行目
        this.contentsub = [];//2行目
        this.parent=parent;
    }
    setContent(value,table){
        const DTTB = Khhyl.Thaqqa_DB.getTable(table);
        const sublistlist = {
            "AligX":[[-1,"□→‖←□(-1)"],[0,"・｜・(0)"],[1,"⇐■｜■⇒(1)"]],
            "AligY":[[-1,"↑(-1)"],[0,"・(0)"],[1,"⇓(1)"]],
            "LANG":[["u","共通(u)"],["c","🐍東(c)"],["o","汽🐟(o)"]],
            "GPOS":[["DIAC","DIAC"],["IN","IN"],["EX","EX"]],
            "AligWhole":[["v","↓(v)"],["h","⇔(h)"],["u","共通(u)"]]
        }
        for(const v in value){

            const type = DTTB.getColumn(v).type;
            const subtype = DTTB.getColumn(v).subtype;
            switch(type){
                case "INTEGER":
                    if(subtype == "AligX" || subtype == "AligY"){
                        this.content.push(new DIVselect_web(this.parent,this.id,value[v],v,"select",subtype,sublistlist[subtype]));
                    }
                    else
                    {
                    this.content.push(new DIVparam_web(this.parent,this.id,value[v],v,"int",subtype));
                    }
                break;
                case "float":
                    this.content.push(new DIVparam_web(this.parent,this.id,value[v],v,"float",subtype));
                break;
                case "char":
                    if(subtype == "LANG" || subtype == "GPOS"|| subtype == "AligWhole"){
                        this.content.push(new DIVselect_web(this.parent,this.id,value[v],v,"select",subtype,sublistlist[subtype]));
                    }
                    else{
                    this.content.push(new DIVparam_web(this.parent,this.id,value[v],v,"char",subtype));
                    }
                break;
                case "bool":
                    this.content.push(new DIVselect_web(this.parent,this.id,value[v],v,"bool",subtype));
                break;
                default:
                break;
            }
        }
    }
    SortbyOrder(table){
        const DTTB = Khhyl.Thaqqa_DB.getTable(table);
        const sortalg = function(first, second){//Priorityの小さい順に並び替える
            const f = DTTB.getColumn(first.col).order;
            const s = DTTB.getColumn(second.col).order;
            if ( f < s ) return -1;
            else if ( f > s )return 1;
            else return 0;
          }
          this.content.sort(sortalg);
    }
    draw_first(table){
        const len = this.content.length;
        const tr = document.createElement('tr'); 
        tr.name = this.id;
        for(let x = 0;x<len;x++){
            const td = document.createElement('td');

            td.appendChild(this.content[x].draw());
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    draw_second(table){
        const len = this.content.length;
        {
            const tr = document.createElement('tr'); 
            tr.classList.add("svg");
            tr.name = this.id;
            {
            const td = document.createElement('td');
            const obj = new Button_web(this.parent,this.id,"","Delete");
            td.appendChild(obj.draw());
            tr.appendChild(td);
            }

            {
                const td = document.createElement('td');
                const obj = new SVGField_web(this.id,this.parent);
                td.appendChild(obj.draw(this.id));
                td.setAttribute("rowspan",2);
                td.setAttribute("colspan",(len-1).toString());
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        {
            const tr = document.createElement('tr'); 
            tr.classList.add("svg");
            const td = document.createElement('td');
            const obj = new Button_web(this.parent,this.id,"","Add");
            td.appendChild(obj.draw());
            tr.appendChild(td);
            table.appendChild(tr);
        }

    }
    draw(table){
        this.draw_first(table);
        this.draw_second(table);
    }
}
class ColumnDesc_web{
    static drawlist = ["order","name","desc","type","subtype"];
    static sublist = {
        //ID:ID(変更不能) Alig:[-1,0,1] FREE_0:0以上 FREE_1:1以上
        "int":["none","n>=0","n>=1","ID","AligX","AligY"],
        //NAME:名前用（重複不可）
        "char":["none","NAME_L","NAME","LANG","AligWhole","GPOS"],
        
        "bool":["none"],
        
        "float":["none"]
    };

    constructor(parent){
        this.name;
        this.type;
        this.desc;
        this.order;
        this.subtype;
        this.parent=parent;
    }
    rewrite_content(parent,self,obj,older){
        try{
        const f_numcheck = function(val){//数字かどうかを確かめる。演算式ok
            val = val.split(/[^0-9\+\-\*\/~\(\)\{\}\.]/g);
            if(val.length != 1 ) return null;
            if(val == "") val = 0; //空欄の場合、適当に0か1を埋めとく
            val.join("");
            val = Function('return ('+val+');')();
            return val;
        }
        let val = "";
        switch(obj.name){
            case "name":
            case "desc":
            case "order":
                val = obj.textContent;
                break;
            case "subtype":
            case "type":
                val = obj.value;
        }
        if(obj.name == "order"){
        val = f_numcheck(val);//計算する
        if(val == null) val = older;
        }

        Khhyl.Thaqqa_DB.getTable(parent.tablename).rewriteColumn(self.name,val,obj.name);
        parent.draw();
        }
        catch(e){
            obj.textContent = older;
            console.log(e);}
            
    }
    setElm(cl){
        this.name = cl.name;
        this.desc = cl.desc;
        this.order = cl.order;
        this.subtype = cl.subtype;
        switch(cl.type){
            case "INTEGER":
                this.type = "int";
            break;
            default:
                this.type = cl.type;
            break;
        }
        this.order = cl.order;
    }
    draw(tr){ 
        for(let y = 0;y<ColumnDesc_web.drawlist.length;y++){
            const td = document.createElement('td');
            if(ColumnDesc_web.drawlist[y] == "type" || ColumnDesc_web.drawlist[y] == "subtype"){
                const object = document.createElement("select");
                object.contentEditable = false;
                object.name = ColumnDesc_web.drawlist[y];
                let text = ["int","char","bool","float"];
                let textB = ["INTEGER","char","bool","float"];

                if(ColumnDesc_web.drawlist[y] == "subtype"){
                    text = ColumnDesc_web.sublist[this.type];
                    textB = ColumnDesc_web.sublist[this.type];
                }
                for(let i = 0;i<text.length;i++){
                    const option = document.createElement("option");
                    option.value = textB[i];
                    option.selected = (this[ColumnDesc_web.drawlist[y]] == text[i]);
                    option.textContent = text[i];
                    object.appendChild(option);
                }
                object.addEventListener("change",() => {this.rewrite_content(this.parent,this,object);},true);
                td.appendChild(object);
                tr[y].appendChild(td);
            }
            else{
                const object = document.createElement('div');
                object.contentEditable = true;
                object.name = ColumnDesc_web.drawlist[y];
                object.textContent = this[ColumnDesc_web.drawlist[y]];
                object.addEventListener("blur",() => {this.rewrite_content(this.parent,this,object,this[ColumnDesc_web.drawlist[y]]);},true);
                td.appendChild(object);
                tr[y].appendChild(td);
                }
            }


    }
}

class RowDesc_web{
    constructor(parent){
        this.content = [];
        this.parent=parent;
    }
    draw(table){
        const tr = []; 
        for(let y = 0;y<ColumnDesc_web.drawlist.length;y++){
            const tr_ = document.createElement('tr');
            tr_.classList.add("項目");
            tr.push(tr_);
            table.appendChild(tr_);
        }
        for(let x = 0;x<this.content.length;x++){
            this.content[x].draw(tr);
        }
        

    }
    SetColumns(tablename){
        const DTTB = Khhyl.Thaqqa_DB.getTable(tablename);
        if(DTTB != null){
            this.content = [];
            const CL = DTTB.columns;
            for(const cl of CL){
                const ct = new ColumnDesc_web(this.parent);
                ct.setElm(cl);
                this.content.push(ct);
            }
        }
    }
    SortbyOrder(){
        const sortalg = function(first, second){//Priorityの小さい順に並び替える

            if (first.order < second.order ) return -1;
            else if (first.order  > second.order )return 1;
            else return 0;
          }
          this.content.sort(sortalg);
    }
}
class Table_web{
    constructor(tablename,loc){
        this.tablename = tablename; //
        this.loc = loc; //設置してある場所
        this.row_desc = new RowDesc_web(this); //
        this.row = [];
    }
    createRow(){
        const DTTB = Khhyl.Thaqqa_DB.getTable(this.tablename);
        if(DTTB != null){
            this.content = [];
            const VALUES = DTTB.data;
            const sortalg = function(first, second){//Priorityの小さい順に並び替える
                if (first.values.Order < second.values.Order ) return -1;
                else if (first.values.Order  > second.values.Order )return 1;
                else return 0;
              }
              const sortalg_OP = function(first, second ){//Priorityの大きい順に並び替える
                if (first.values.Order > second.values.Order ) return 1;
                else if (first.values.Order  < second.values.Order )return -1;
                else{
                if (first.values.Priority > second.values.Priority ) return 1;
                else if (first.values.Priority  < second.values.Priority )return -1;
                  return 0};
              }
              const sortalg_GPOS = function(first, second ){//Priorityの大きい順に並び替える
                const val = {"h":-1,"u":0,"v":1};
                const val2 = {"DIAC":-1,"IN":0,"EX":1};
                if (val2[first.values.Pattern_sub] > val2[second.values.Pattern_sub] ) return 1;
                else if (val2[first.values.Pattern_sub]  < val2[second.values.Pattern_sub] )return -1;
                else{
                    if (val[first.values.Pattern] > val[second.values.Pattern] ) return 1;
                    else if (val[first.values.Pattern]  < val[second.values.Pattern] )return -1;
                  return 0};
              }
              if(VALUES.length > 0 && DTTB.getColumn("Order") != null)
              {if(DTTB.getColumn("Priority") != null) VALUES.sort(sortalg_OP);
              else VALUES.sort(sortalg);}
              if(VALUES.length > 0 && DTTB.name == "GPOS") VALUES.sort(sortalg_GPOS);
              for(let v =0;v<VALUES.length;v++){
                const d = new Row_web(VALUES[v].values.ID,this);

                d.setContent(VALUES[v].values,this.tablename);
                this.row.push(d);
            }


        }
    }
    draw(){
        while( this.loc.firstChild ){
            this.loc.removeChild( this.loc.firstChild );
          }
        const tb = document.createElement('table');
        this.row_desc = new RowDesc_web(this);
        this.row_desc.SetColumns(this.tablename);
        this.row_desc.SortbyOrder()
        this.row_desc.draw(tb);
        this.row = [];

        this.createRow();
        
        const len = this.row_desc.content.length;
        {
            const tr = document.createElement('tr'); 
            tr.classList.add("svg");
            tr.name = this.id;
            for(let _i = 0;_i<0;_i++){
                const td = document.createElement('td');
                const obj = document.createElement('div');
                td.appendChild(obj);
                tr.appendChild(td);
                }
            {
            const td = document.createElement('td');
            const obj = new Button_web(this,null,"","Add");
            td.appendChild(obj.draw());
            tr.appendChild(td);
            }
            {
                const td = document.createElement('td');
                td.setAttribute("rowspan",1);
                td.setAttribute("colspan",(len-1).toString());
                tr.appendChild(td);
            }
            tb.appendChild(tr);
        }
        for(let y = 0;y<this.row.length;y++){
            this.row[y].SortbyOrder(this.tablename);
            this.row[y].draw(tb);
        }
        this.loc.appendChild(tb);
    }
}

export {Table_web};