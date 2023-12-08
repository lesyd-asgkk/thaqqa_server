import * as Khhyl from "../lib_js/deps.js"
import * as webjs from "./deps.js"


class DIVparam_web{
    constructor(col,type,subtype){
        this.col = col; //
        this.type = type; //float,char,intのいずれか
        this.subtype = subtype; //編集拒否用
    }
}
class DIVselect_web{
    constructor(col,type,subtype){
        this.col = col; //
        this.type = type;//bool,selectのいずれか
        this.subtype = subtype;//selectの選択肢用
    }
}
class Button_web{
    constructor(col,parent,type){
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
        object.setAttribute("width","100");
        object.setAttribute("height","100");
        object.setAttribute("viewBox","-10 0 100 100");
        return object;
    }
}

export {DIVparam_web,DIVselect_web,Button_web,SVGField_web}