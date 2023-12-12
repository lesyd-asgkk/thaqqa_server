import * as Khhyl from "../lib_js/deps.js"
import * as webjs from "./deps.js"


class DIVparam_web{
    constructor(parent,id,val,col,type,subtype){
        this.parent = parent;
        this.id = id;
        this.col = col; //
        this.val = val;
        this.type = type; //float,char,intのいずれか
        this.subtype = subtype; //編集拒否用
        console.log(this.col);
    }

    rewrite_content(parent,self,obj){
        const f_numcheck = function(val){//数字かどうかを確かめる。演算式ok
            val = val.split(/[^0-9\+\-\*\/~\(\)\{\}\.]/g);
            if(val.length != 1 ) return null;
            if(val == "") val = 0; //空欄の場合、適当に0か1を埋めとく
            val.join("");
            val = Function('return ('+val+');')();
            return val;
        }
        let val = obj.textContent;
        val = f_numcheck(val);//計算する
        console.log(val);
        if(val == null) val = self.val;
        console.log({ID:this.id});
        console.log(Khhyl.Thaqqa_DB.getTable(parent.tablename).getData({ID:this.id}));
        if(Khhyl.Thaqqa_DB.getTable(parent.tablename).rewriteData({ID:this.id},{[self.col]:val}))
        {obj.textContent = val;
        self.val = val;}
        parent.draw();
    }

    draw(){
        const object = document.createElement('div');
        object.contentEditable = true;//編集拒否依存
        object.classList.add(this.col);
        object.textContent = this.val;
        object.name = this.id;
        object.addEventListener("blur",() => {this.rewrite_content(this.parent,this,object);},true);
        return object;
    }

}
class DIVselect_web{
    constructor(parent,id,val,col,type,subtype){
        this.parent = parent;
        this.id = id;
        this.col = col; //
        this.val = val;
        this.type = type;//bool,selectのいずれか
        this.subtype = subtype;//selectの選択肢用
    }
    draw(){
        const object = document.createElement("input");
        object.type = "checkbox";
        object.contentEditable = false;
        object.classList.add(this.col);
        object.name = this.id;
        object.checked = this.val;
        return object;
    }
}
class Button_web{
    constructor(parent,id,col,type){
        this.parent = parent;
        this.id = id;
        this.col = col; //
        this.parent = parent;//親の名前
        this.type = type;//削除か追加か
    }
    draw(){
        const object = document.createElement("input");
        object.contentEditable = false;
        object.type = "button";
        object.style.display ="block";
        object.value = this.type;
        object.name = this.id;
        object.addEventListener("click",() => {},true);
        return object;
    }
}
class SVGField_web{
    constructor(col,parent){
        this.col = col; //
        this.parent = parent;//親の名前
    }
    draw(d){//dは表示させるpathのd
        const object = $("div#storage svg#svgField").clone(false,false)[0];
        while(object.firstChild)object.removeChild(object.firstChild);
        object.style.display ="block";
        //ins.setAttribute("xmlns","http://www.w3.org/2000/svg");
        //ins.setAttribute("display","block");
        const path = $("div#storage svg#svgField path").clone()[0];
        path.setAttribute("fill","none");
        path.setAttribute("stroke","black");
        path.setAttribute("stroke-width",0);
        path.setAttribute("fill","black");

        path.setAttribute("d","M10,0 L90,100 L100,100 L100,90 L0,10 L0,0 Z");
        object.appendChild(path);
        object.setAttribute("width","16");
        object.setAttribute("height","16");
        object.setAttribute("viewBox","-10 0 100 100");
        return object;
    }
}

export {DIVparam_web,DIVselect_web,Button_web,SVGField_web}