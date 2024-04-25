import * as khhyl from "../lib_js/deps.js"
class LayoutDebug_web{
    constructor(loc){
        this.loc = loc; //設置してある場所
        this.sizetext;
        this.textbox;
        this.textbox_diac0;
        this.textbox_diac1;
        this.fontbox;
        this.align = [];
        this.lang = [];
        this.button;
        this.youaredrawing;
        this.SVG;
    }
    setSVG(self){
        let alig = 0;let lang = 0;
        
        for(const v of self.align){if(v.option.checked == true) alig = v.option.value;}
        for(const v of self.lang){if(v.option.checked == true) lang = v.option.value;}

        const c0_ = khhyl.FontManager.getStaticTable("CONSONANT").getData({isBondAsFirst:true});
        const c1_ = khhyl.FontManager.getStaticTable("CONSONANT").getData({isBondAsLast:true});
        const C0 = [""];const C1 = [""];
        const V = self.textbox.value;

        const form = ((n) => {
            switch(n){
            case "音節毎(頭)":
                return  "init"
            case "音節毎(中)":
                return "mid";
            case "音節毎(尾)":
                return "fin";
            default:
                return "null";
            }
        })(lang);
        
        for(let i = 0;i<c0_.length;i++){
            for(let j = 0;j<c0_[i].getVal("OnsetGlyphNum");j++){
                C0.push(`${c0_[i].getVal("Name")}${j}${self.textbox_diac0.value}`)
            }
        }
        for(let i = 0;i<c1_.length;i++){
            for(let j = 0;j<c1_[i].getVal("CodaGlyphNum");j++){
                C1.push(`${c1_[i].getVal("Name")}${j}${self.textbox_diac1.value}`)
            }
        }
        let text = "";
        switch(lang){ //"パーツ毎","音節毎","音節間毎"
            case "パーツ毎":
            break;
            case "音節毎(頭)":case "音節毎(中)":case "音節毎(尾)":
                for(let x = 0;x<C0.length;x++){
                    for(let z = 0;z<C1.length;z++){
                        text += `S(${form},${C0[x]},${V},${C1[z]})`;
                        text += `P(space0)`;
                    }
                    text += `P(newline0)P(newline0)`;
                }
            break;
            case "音節間毎":
            break;
        }

        let d = "";
        while(this.SVG.field.firstChild)this.SVG.field.removeChild(this.SVG.field.firstChild);

        const path = $("div#storage svg#svgField path").clone()[0];
        path.setAttribute("fill","none");
        path.setAttribute("stroke","black");path.setAttribute("stroke-width",0);
        path.setAttribute("fill","black");path.setAttribute("d",d);

        const d_ = khhyl.Render.DrawD(text,lang,[1,-1,0][alig],{size:Number(self.sizetext.value),parse:"parsedplus",font:self.fontbox.value});
        d += d_.d_str;
d.d
        const x0 = d_.left;const x1 = d_.right;
        const y0 = d_.top;const y1 = d_.bottom;
        const HEIGHT = y1-y0;const WIDTH = x1-x0;
        this.SVG.field.setAttribute("width",(WIDTH).toString());
        this.SVG.field.setAttribute("height",(HEIGHT).toString());
        this.SVG.field.setAttribute("viewBox",`${x0} ${y0} ${WIDTH} ${HEIGHT}`);
        path.setAttribute("d",d);this.SVG.field.appendChild(path);

    }
    draw(){ //次ここやる
        while(this.loc.firstChild)this.loc.removeChild(this.loc.firstChild) ;
        const textinput = document.createElement("input");
        textinput.contentEditable = false;
        textinput.style.display ="block";
        textinput.type = "number";
        textinput.value = "16";
        this.sizetext = textinput;
        this.loc.appendChild(this.sizetext);

        for(let i = 0;i<3;i++){
            const textarea = document.createElement("textarea");
            textarea.contentEditable = false;
            textarea.style.display ="block";

            textarea.value = ["a0","d0","d0"][i];
            switch(i){
                case 0: this.textbox = textarea;       break;
                case 1: this.textbox_diac0 = textarea; break;
                case 2: this.textbox_diac1 = textarea; break;
            }
            this.loc.appendChild(textarea);
        }
        
        {
            this.align = [];
            const text = ["左横書き","右横書き","縦書き"];
            for(let i = 0;i<text.length;i++){
                const option = document.createElement("input");
                option.type = "radio";option.name = "align";
                option.value = i;option.checked = (i == 0);

                const label = document.createElement("label");
                label.for = option.id;
                label.textContent = text[i];

                this.align.push({option:option,label:label});
                this.loc.appendChild(this.align[i].option);
                this.loc.appendChild(this.align[i].label);
            }
            const br =  document.createElement("br");
            this.loc.appendChild(br);
        }
        {
            this.lang = [];
            const text = ["パーツ毎","音節毎(頭)","音節毎(中)","音節毎(尾)","音節間毎"];
            for(let i = 0;i<text.length;i++){
                const option2 = document.createElement("input");
                option2.type = "radio";option2.name = "lang";
                option2.value = text[i];option2.checked = (i == 0);

                const label2 = document.createElement("label");
                label2.for = option2.id;label2.textContent = text[i];

                this.lang.push({option:option2,label:label2});
                this.loc.appendChild(this.lang[i].option);this.loc.appendChild(this.lang[i].label);
            }
        }
        const fontarea = document.createElement("input");
        fontarea.type = "text";
        fontarea.contentEditable = false;
        fontarea.style.display ="block";

        fontarea.value = "default";
        this.fontbox = fontarea;

        this.loc.appendChild(this.fontbox);
        const br =  document.createElement("br");
        this.loc.appendChild(br);

        const drawbutton = document.createElement("input");
        drawbutton.contentEditable = false;drawbutton.style.display ="block";
        drawbutton.type = "button";drawbutton.value = "表記してみる";
        drawbutton.addEventListener("click",() => {this.setSVG(this)},true);
        this.button = drawbutton;
        this.loc.appendChild(this.button);

        const object = $("div#storage svg#svgField").clone(false,false)[0];
        while(object.firstChild)object.removeChild(object.firstChild);
        object.style.display ="block";
        this.SVG = {field:object};
        this.loc.appendChild(this.SVG.field);
        
    }
}

export {LayoutDebug_web};