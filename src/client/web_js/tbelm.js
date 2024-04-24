import * as Khhyl from "../lib_js/deps.js"
// import * as webjs from "./deps.js"


class DIVparam_web{
    constructor(parent,id,val,col,type,subtype){
        this.parent = parent;
        this.id = id;
        this.col = col; //
        this.val = val;
        this.type = type; //float,char,intのいずれか
        this.subtype = subtype; //編集拒否用
    }

    rewrite_content(parent,self,obj){
        const f_numcheck = function(val){//数字かどうかを確かめる。演算式ok
            val = val.toString().split(/[^0-9\+\-\*\/~\(\)\{\}\.]/g);
            if(val.length != 1 ) return null;
            if(val == "") val = 0; //空欄の場合、適当に0か1を埋めとく
            val.join("");
            val = Function('return ('+val+');')();
            return val;
        }
        let val = obj.textContent;
        switch(self.type){
            case "int":
                val = f_numcheck(val);
                if(val == null) val = self.val;
                switch(self.subtype){
                    case "n>=0":
                        val = Math.max(0,val);
                        break;
                    case "n>=1":
                        val = Math.max(1,val);
                        break;
                    case "n={-1,0,1}":
                        val = Math.sign(val);
                    break;
                }
                val = Math.round(val);
            break;
            case "char":
            break;
        }
        if(self.type != "char"){
        val = f_numcheck(val);
            if(val == null) val = self.val;
        }
        const DTTB = Khhyl.FontManager.getStaticTable(this.parent.tablename) ?? Khhyl.FontManager.getFont(this.parent.font).getTable(this.parent.tablename);
        if(DTTB.rewriteData({ID:this.id},{[self.col]:val}))
        {
        if(parent.tablename == "GPOS" && self.col == "Name"){
            Khhyl.GPOSManager.setGPOSColumn(this.id,this.parent.font);
        }
        else if(parent.tablename == "GSUB" && self.col == "Name"){
            Khhyl.GSUBManager.setGSUBColumn(this.id);
        }
        else if(parent.tablename == "PARSER" && self.col == "Name"){
            Khhyl.Parser.setParserColumn(this.id);
        }
        obj.textContent = val;
        self.val = val;}
        parent.draw();
    }

    draw(){
        const object = document.createElement('div');
        object.classList.add(this.col);
        object.textContent = this.val;
        object.name = this.id;
        if(this.subtype != "ID" && this.subtype != "PARSED"){ //編集拒否用
            object.contentEditable = true;
            object.addEventListener("blur",() => {this.rewrite_content(this.parent,this,object);},true);
        }
        return object;
    }

}
class DIVselect_web{
    constructor(parent,id,val,col,type,subtype,select){
        this.parent = parent;
        this.id = id;
        this.col = col; //
        this.val = val;
        this.type = type;//bool,selectのいずれか
        this.subtype = subtype;//selectの選択肢用
        this.select = select;
    }
    rewrite_content(parent,self,obj){
        const val = obj.checked;
        const val2 = obj.value;
        const DTTB = Khhyl.FontManager.getStaticTable(self.parent.tablename) ?? Khhyl.FontManager.getFont(this.parent.font).getTable(this.parent.tablename);
        switch(this.type){
            case "bool":
                if(DTTB.rewriteData({ID:this.id},{[self.col]:val}))
        {obj.checked = val;
         self.val = val;}
            break;

            case "select":
                if(DTTB.rewriteData({ID:this.id},{[self.col]:val2}))
                {obj.checked = val2;
                 self.val = val2;}
            break;
        }
        
        parent.draw();
    }
    draw(){
        let object;
        switch(this.type){
            case "bool":
            object = document.createElement("input");
            object.type = "checkbox";
            object.contentEditable = false;
            object.classList.add(this.col);
            object.name = this.id;
            object.checked = this.val;
            object.addEventListener("click",() => {this.rewrite_content(this.parent,this,object);},true);
            break;
            case "select":
                object = document.createElement("select");
                object.contentEditable = false;
                object.classList.add(this.col);
                for(let i = 0;i<this.select.length;i++){
                    const option = document.createElement("option");
                    option.value = this.select[i][0];
                    option.selected = this.select[i][0] == this.val;
                    option.textContent = this.select[i][1];
                    object.appendChild(option);
                }
                object.addEventListener("change",() => {this.rewrite_content(this.parent,this,object);},true);
                break;
                
        }
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
    rewrite_content(parent,self){
        const DTTB = Khhyl.FontManager.getStaticTable(self.parent.tablename) ?? Khhyl.FontManager.getFont(this.parent.font).getTable(this.parent.tablename);
        if(self.type == "Add"){

            switch(self.parent.tablename){
                case "GSUB":
                    {
                    const p = self.id != null? DTTB.getData({ID:self.id})[0].valueList:{Pattern:"u",Priority:0,Order:0};
                    DTTB.createData({Priority:p.Priority,Pattern:p.Pattern,Name:"",NameAlt:"",Order:p.Order,Parsed:""});
                    }
                break;
                case "PARSER":
                    {
                        const p = self.id != null? DTTB.getData({ID:self.id})[0].valueList:{Pattern:"u",Priority:0,Order:0};
                        DTTB.createData({Priority:p.Priority,Pattern:p.Pattern,Name:"",NameAlt:"",Order:p.Order,Parsed:""});
                    }
                break;
                case "GPOS":
                    {
                        const p = self.id != null? DTTB.getData({ID:self.id})[0].valueList:{Pattern:"u",Pattern_sub:"d",Order:0};
                        DTTB.createData({Pattern:p.Pattern,Pattern_sub:p.Pattern_sub,Parsed:"",Name:"",OffsetX0:0,OffsetY0:0,OffsetX1:0,OffsetY1:0,Order:p.Order});
                    }
                    break;
                case "PUNCTUATION":
                case "VOWEL":
                case "CONSONANT":
                case "DIACRITIC_P":
                case "DIACRITIC_V":
                case "DIACRITIC_C":
                    {
                    Khhyl.LetterManager.createLetter("新規データ",parent.tablename);
                    }
                break;
            }
        }
        else if(self.type == "Delete"){
            if(!globalThis.confirm("ID = "+ self.id +"\nを消去します")) return false;//削除しなかった
            DTTB.deleteData({ID:self.id})
        }
        parent.draw();
    }
    draw(){
        const object = document.createElement("input");
        object.contentEditable = false;
        object.type = "button";
        object.style.display ="block";
        object.value = this.type;
        object.name = this.id;
        object.addEventListener("click",() => {this.rewrite_content(this.parent,this);},true);
        return object;
    }
}

class SVGField_web{
    constructor(col,parent){
        this.col = col; //
        this.parent = parent;//親の名前
    }
    draw(id){
        let d = "M0,0V100H100V0Z M20,20H80V80H20Z"
        let x0 = 0;
        let x1 = 100;
        let y0 = 0;
        let y1 = 100;
        
        const Letter_T = ["VOWEL","DIACRITIC_V","CONSONANT","DIACRITIC_C","PUNCTUATION","DIACRITIC_P",]
        if(Letter_T.includes(this.parent.tablename)){
        const DTTB = Khhyl.FontManager.getStaticTable(this.parent.tablename) ?? Khhyl.FontManager.getFont(this.parent.font).getTable(this.parent.tablename);
        const n = DTTB.getData({ID:id})[0].getVal("Name");
        
        d = "M0,0";
        let listb = ["sol","init","mid","fin"];
        if(["CONSONANT","DIACRITIC_C"].includes(this.parent.tablename)) listb = ["onset","coda"];
        else if(["PUNCTUATION","DIACRITIC_P"].includes(this.parent.tablename)) listb = [""];
        
        let i_ = 0;
        for(let j = 0 ; j<listb.length;j++){
        const list = Khhyl.GlyphManager.getSVG(new RegExp("^"+n+"_"+listb[j]),this.parent.font);
                for(let i = 0;i<list.length;i++){
                d +=` M${(1+i_+j/2)*100},${0} ${list[i]}`;
                i_++;
                }
            }
            x0 = Khhyl.SVG.getLeft(d);
            x1 = Khhyl.SVG.getRight(d);
            y0 = Khhyl.SVG.getTop(d);
            y1 = Khhyl.SVG.getBottom(d);
        }
        const object = $("div#storage svg#svgField").clone(false,false)[0];
        while(object.firstChild)object.removeChild(object.firstChild);
        object.style.display ="block";
        const path = $("div#storage svg#svgField path").clone()[0];
        path.setAttribute("fill","none");
        path.setAttribute("stroke","black");
        path.setAttribute("stroke-width",0);
        path.setAttribute("fill","black");
        path.setAttribute("d",d);
        object.appendChild(path);

        const shrink_x = 32/150;
        const HEIGHT = y1-y0;
        const WIDTH = x1-x0;
        object.setAttribute("width",(WIDTH*shrink_x).toString());
        object.setAttribute("height",(HEIGHT*shrink_x).toString());
        object.setAttribute("viewBox",`${x0} ${y0} ${WIDTH} ${HEIGHT}`);
        return object;
    }
}

export {DIVparam_web,DIVselect_web,Button_web,SVGField_web}