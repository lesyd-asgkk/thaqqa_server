import * as Khhyl from "../lib_js/deps.js"
class Sandbox_web{
    constructor(loc){
        this.loc = loc; //設置してある場所
        this.sizetext;
        this.textbox;
        this.align = [];
        this.lang = [];
        this.svgdownloadbutton;
        this.youaredrawing;
        this.SVG;
    }
    
    setSVG(self){
        let alig = 0;
        let lang = 0;
        for(const v of self.align){
            if(v.option.checked == true) alig = v.option.value;
        }
        for(const v of self.lang){
            if(v.option.checked == true) lang = v.option.value;
        }
        const d = Khhyl.Render.DrawD(self.textbox.value,lang,(alig==2?0:1),{size:Number(self.sizetext.value),parse:"none",font:"SanSerif_0_0_0_0"});
        // Khhyl.Render.DrawD(self.textbox.value,Number(self.sizetext.value),lang,(alig==2?0:1),"none",null)
        // 
        self.SVG.path.setAttribute("d",d);

        const gap_ = 5;
        const x0 = Khhyl.SVG.getLeft(d);
        const x1 = Khhyl.SVG.getRight(d)+gap_;
        const y0 = Khhyl.SVG.getTop(d);
        const y1 = Khhyl.SVG.getBottom(d)+gap_;

        const shrink_x = 32/32;
        const HEIGHT = y1-y0;
        const WIDTH = x1-x0;
        self.SVG.field.setAttribute("width",(WIDTH*shrink_x).toString());
        self.SVG.field.setAttribute("height",(HEIGHT*shrink_x).toString());
        self.SVG.field.setAttribute("viewBox",`${x0} ${y0} ${WIDTH} ${HEIGHT}`);

    }
    draw(){ //次ここやる
        while( this.loc.firstChild ){
            this.loc.removeChild( this.loc.firstChild );
          }
          const  downloadSvg = function(svgNode, filename) {
            const svgText = new XMLSerializer().serializeToString(svgNode);
            const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
            const svgUrl = URL.createObjectURL(svgBlob);
          
            const a = document.createElement('a');
            a.href = svgUrl;
            a.download = filename;
          
            document.body.appendChild(a);
            a.click();
          
            document.body.removeChild(a);
            URL.revokeObjectURL(svgUrl);
          }

          const renderb = document.createElement("input");
          renderb.contentEditable = false;
          renderb.style.display ="block";
          renderb.type = "button";
          renderb.value = "ダウンロードする";
          renderb.addEventListener("click",() => {downloadSvg(this.SVG.field,"param")},true);
          this.svgdownloadbutton = renderb;
          this.loc.appendChild(this.svgdownloadbutton);

        const textinput = document.createElement("input");
        textinput.contentEditable = false;
        textinput.style.display ="block";
        textinput.type = "number";
        textinput.value = "16";
        this.sizetext = textinput;
        this.loc.appendChild(this.sizetext);

        const textarea = document.createElement("textarea");
        textarea.contentEditable = false;
        textarea.style.display ="block";
        //text.type = "text";
        textarea.value = "khehyelughun";
        this.textbox = textarea;
        this.loc.appendChild(this.textbox);

        {
            this.align = [];
            const text = ["左横書き","右横書き","縦書き"];
            for(let i = 0;i<text.length;i++){
                const option = document.createElement("input");
                option.type = "radio";
                option.name = "align";
                option.value = i;
                option.checked = (i == 0);

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
            const text = ["東果語","東果汽陸語"];
            for(let i = 0;i<text.length;i++){
                const option2 = document.createElement("input");
                option2.type = "radio";
                option2.name = "lang";
                option2.value = i;
                option2.checked = (i == 0);

                const label2 = document.createElement("label");
                label2.for = option2.id;
                label2.textContent = text[i];

                this.lang.push({option:option2,label:label2});
                this.loc.appendChild(this.lang[i].option);
                this.loc.appendChild(this.lang[i].label);
            }
        }

        const drawbutton = document.createElement("input");
        drawbutton.contentEditable = false;
        drawbutton.style.display ="block";
        drawbutton.type = "button";
        drawbutton.value = "表記してみる";
        drawbutton.addEventListener("click",() => {this.setSVG(this)},true);
        this.button = drawbutton;
        this.loc.appendChild(this.button);

        const object = $("div#storage svg#svgField").clone(false,false)[0];
        while(object.firstChild)object.removeChild(object.firstChild);
        object.style.display ="block";
        const path = $("div#storage svg#svgField path").clone()[0];
        path.setAttribute("stroke","black");
        path.setAttribute("stroke-width",0);
        path.setAttribute("fill","black");
        this.SVG = {field:object,path:path};
        this.SVG.field.appendChild(this.SVG.path);
        this.loc.appendChild(this.SVG.field);
        
    }
}

export {Sandbox_web};