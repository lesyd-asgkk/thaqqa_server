import * as Khhyl from "../lib_js/deps.js"
import {DIVparam_web,DIVselect_web,Button_web,SVGField_web} from "./deps.js"

class Row_web{
    constructor(parent){
        this.content = [];//1行目
        this.contentsub = [];//2行目
        this.parent=parent;
    }
    SortByOrder(columndesc){
        const sortalg = function(first, second){//Priorityの小さい順に並び替える
            const f = columndesc.indexOf(first.col).order;
            const s = columndesc.indexOf(second.col).order;
            if (f < s) return -1;
            else if (f  > s)return 1;
            else return 0;
          }
          this.content.sort(sortalg);
    }
    draw(table){
        const tr = document.createElement('tr'); 
        const len = this.content.length;
        for(let x=0;x<len;x++){
            const td = document.createElement('td');
            const obj = new Button_web("","","Add");
    
            td.appendChild(obj.draw());
            tr.appendChild(td);
        }
        {
        const td = document.createElement('td');
        const obj = new Button_web("","","Add");

        td.appendChild(obj.draw());
        tr.appendChild(td);
        }
        {
            const td = document.createElement('td');
            const obj = new SVGField_web();
    
            td.appendChild(obj.draw());
            td.setAttribute("rowspan",2);
            td.setAttribute("colspan",(len-1).toString());
            tr.appendChild(td);
            }
            table.appendChild(tr);
            {
                const tr = document.createElement('tr'); 

                const td = document.createElement('td');
                const obj = new Button_web("","","Delete");
        
                td.appendChild(obj.draw());
                tr.appendChild(td);
                table.appendChild(tr);
                }
    }
}
class ColumnDesc_web{
    constructor(parent){
        this.name;
        this.type;
        this.desc;
        this.order;
        this.parentloc=parent;
    }
    setElm(cl){
        this.name = cl.name;
        this.desc = cl.desc;
        this.order = cl.order;
        switch(cl.type){
            case "INTEGER":
                this.type = "int";
            break;
            case "boolean":
                this.type = "bool";
            break;
            default:
                this.type = cl.type;
            break;
        }
    }
    draw(tr){
        const drawlist = ["order","name","desc","type"];
        for(let y = 0;y<4;y++){
            const td = document.createElement('td');
            const obj = document.createElement('div');
            obj.contentEditable = true;
            obj.textContent = this[drawlist[y]];
            td.appendChild(obj);
            tr[y].appendChild(td);
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
        for(let y = 0;y<4;y++){
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
            console.log(CL);
            for(const cl of CL){
                const ct = new ColumnDesc_web(this);
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
        this.row_desc = new RowDesc_web(this.loc); //
        this.row = [];
    }

    draw(){   
        const tb = document.createElement('table');
        this.row_desc.SetColumns(this.tablename);
        this.row_desc.SortbyOrder()
        this.row_desc.draw(tb);
        
        const tr = document.createElement('tr'); 
        const len = this.row_desc.content.length;
        //for(let y = 0;y<row.length;y++) this.row.draw(tb);
        {
            const td = document.createElement('td');
            const obj = new Button_web("","","Add");
    
            td.appendChild(obj.draw());
            tr.appendChild(td);
            tb.appendChild(tr);
            }
        {
            const td = document.createElement('td');
            const obj = new SVGField_web();
    
            td.appendChild(obj.draw());
            td.setAttribute("rowspan",2);
            td.setAttribute("colspan",(len-1).toString());
            tr.appendChild(td);
            }
            tb.appendChild(tr);
            {
                const tr = document.createElement('tr'); 

                const td = document.createElement('td');
                const obj = new Button_web("","","Delete");
        
                td.appendChild(obj.draw());
                tr.appendChild(td);
                tb.appendChild(tr);
                }
        this.loc.appendChild(tb);
        
    }
    /*
    async addColumn(y){

        let tr = document.createElement('tr');
        let naming = "";
        let td = document.createElement('td');
        let delbutton = $("input#buttonorigin").clone(false,false)[0];
        delbutton.contentEditable = false;
        
        delbutton.type = "button";
        delbutton.style.display ="block";
        delbutton.value = "消す";
        delbutton.addEventListener("click",() => {},true);
        td.appendChild(delbutton);
        tr.appendChild(td);
        
    for (const x in this.category) {            
        // th・td部分のループ
        //console.log(x);
        
        let td = document.createElement('td');
        const cat = this.category[x]; //

        let TT = (await DB.getTable(this.tablename,"%"))[0];

        //console.log(TT);
        //console.log(cat);
        td.classList.add(cat,x);
        let ins;//instance。とりあえず打ち込むデータ
            
        switch(cat[0]){
            case "integer":
            case "double":
            case "string":
            ins = document.createElement('div');
            ins.contentEditable = true;
            ins.classList.add(cat,x);
            //console.log(x);
            //console.log(TT["columns"].indexOf(x))
            //console.log(y[TT["columns"].indexOf(x)])
            ins.textContent = y[TT["columns"].indexOf(x)];
            if(cat[0] == "string"){}
            ins.id = naming;
            ins.addEventListener("blur",() => {this.rewrite_content(ins);},true);
            td.appendChild(ins);
            break;
                
            case "boolean":
            ins = document.createElement("input");
            ins.contentEditable = false;
            ins.type = "checkbox";
            ins.id = naming;
            ins.checked = y[ TT["columns"]. indexOf(x)]=="true";
            ins.classList.add(cat,x);
            ins.value = "a0";
            ins.addEventListener("click",() => {this.rewrite_content(ins);},true);
            td.appendChild(ins);
            break;

            case "select":
            ins = document.createElement("select");
            ins.contentEditable = false;
            ins.classList.add(cat[0],x);
            ins.id = naming;
            for(let i = 0;i<3;i++){
                let option = document.createElement("option");
                option.value = (i-1);
                option.selected = y[ TT["columns"]. indexOf(x)] == (i-1);
                let text = {["x"]:["内側(-1)","中央(0)","外側(1)"],["y"]:["上側(-1)","中央(0)","下側(1)"]}
                option.textContent = text[cat[1]][i];
                option.addEventListener("click",() => {this.rewrite_content(ins);},true);
                ins.appendChild(option);
            }
            td.appendChild(ins);
            break;
            case "svg":
                ins = $("svg#svgField").clone(false,false)[0];
                while(ins.firstChild){
                    ins.removeChild(ins.firstChild);
                  }
                //console.log(ins);
                //ins = document.createElement("svg");
                //ins.contentEditable = false;
                ins.classList.add(cat,x);
                ins.style.display ="block";
                ins.id = naming;
                td.appendChild(ins);
                //ins.setAttribute("xmlns","http://www.w3.org/2000/svg");
                //ins.setAttribute("display","block");
                ins.setAttribute("width","0");
                ins.setAttribute("height","0");
                ins.setAttribute("viewBox","-10 0 100 100");
                let path = $("svg#svgField path").clone()[0];
                //path.id = "0";
                path.setAttribute("fill","none");
                path.setAttribute("stroke","black");
                path.setAttribute("stroke-width",0);
                path.setAttribute("fill","black");

                path.setAttribute("d","");
                ins.appendChild(path);
        break;
        }
            
            tr.appendChild(td); // td要素をtr要素の子要素に追加
            
        }
        delbutton.id = naming;
        // tr要素をtable要素の子要素に追加
        this.table.appendChild(tr);

    }*/
}

export {Table_web};