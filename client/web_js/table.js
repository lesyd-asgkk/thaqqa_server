import * as Khhyl from "../lib_js/deps.js"

class Table_web{
    constructor(tn,loc){
        this.tn = tn; //
        this.loc = loc; //設置してあるdivの名前
    }

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

    }
}