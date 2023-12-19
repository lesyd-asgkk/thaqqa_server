import * as Khhyl from "../lib_js/deps.js"
class Sandbox_web{
    constructor(loc){
        this.loc = loc; //設置してある場所
        this.textbox;
        this.align = [];
        this.lang = [];
        this.button;
        this.youaredrawing;
        this.SVG;
    }
    setSVG(self){
        let alig = 0;
        let lang = 0;
        for(const v of this.align){
            console.log(v);
            if(v.option.checked == true) alig = v.option.value;
        }
        for(const v of this.lang){
            console.log(v);
            if(v.option.checked == true) lang = v.option.value;
        }
        console.log(Khhyl.Render.DrawD(self.textbox.value,lang,alig==2?0:1));
    }
    draw(){ //次ここやる
        while( this.loc.firstChild ){
            this.loc.removeChild( this.loc.firstChild );
          }
        const text = document.createElement("input");
        text.contentEditable = false;
        text.style.display ="block";
        text.type = "text";
        text.value = "khehyelughun";
        this.textbox = text;
        this.loc.appendChild(this.textbox);

        this.align = [];
        this.lang = [];
        for(let i = 0;i<3;i++){
            const option = document.createElement("input");
            option.type = "radio";
            option.name = "align";
            option.value = i;
            option.checked = (i == 0);
            const text = ["左横書き","右横書き","縦書き"];

            const label = document.createElement("label");
            label.for = option.id;
            label.textContent = text[i];

            this.align.push({option:option,label:label});
            this.loc.appendChild(this.align[i].option);
            this.loc.appendChild(this.align[i].label);
        }
        const br =  document.createElement("br");
        this.loc.appendChild(br);
        for(let i = 0;i<2;i++){
            const option2 = document.createElement("input");
            option2.type = "radio";
            option2.name = "lang";
            option2.value = i;
            option2.checked = (i == 0);
            const text = ["東果語","東果汽陸語"];

            const label2 = document.createElement("label");
            label2.for = option2.id;
            label2.textContent = text[i];

            this.lang.push({option:option2,label:label2});
            this.loc.appendChild(this.lang[i].option);
            this.loc.appendChild(this.lang[i].label);
        }

        const drawbutton = document.createElement("input");
        drawbutton.contentEditable = false;
        drawbutton.style.display ="block";
        drawbutton.type = "button";
        drawbutton.value = "表記してみる";
        drawbutton.addEventListener("click",() => {this.setSVG(this)},true);
        this.button = drawbutton;
        this.loc.appendChild(this.button);

        let d = "M0,0V100H100V0Z M20,20H80V80H20Z"
        let x0 = 0;
        let x1 = 100;
        let y0 = 0;
        let y1 = 100;

        const object = $("div#storage svg#svgField").clone(false,false)[0];
        while(object.firstChild)object.removeChild(object.firstChild);
        object.style.display ="block";
        const path = $("div#storage svg#svgField path").clone()[0];
        path.setAttribute("fill","none");
        path.setAttribute("stroke","black");
        path.setAttribute("stroke-width",0);
        path.setAttribute("fill","black");
        path.setAttribute("d",d);
        

        const shrink_x = 32/150;
        const HEIGHT = y1-y0;
        const WIDTH = x1-x0;
        object.setAttribute("width",(WIDTH*shrink_x).toString());
        object.setAttribute("height",(HEIGHT*shrink_x).toString());
        object.setAttribute("viewBox",`${x0} ${y0} ${x1} ${y1}`);
        this.SVG = {field:object,path:path};
        this.SVG.field.appendChild(this.SVG.path);
        this.loc.appendChild(this.SVG.field);
        
    }
}

export {Sandbox_web};