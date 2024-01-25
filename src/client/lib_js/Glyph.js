
import { Thaqqa_DB,SVG,RegExp_Khhyl,GPOSManager,LetterManager} from "./deps.js";
class GlyphManager{
    
    static async load(){
        await fetch('/server/FontData.svg')
      .then(response => response.json())
      .then(data => {
        try{
        Thaqqa_DB.getTable("GLYPH");
        //Thaqqa_DB.deleteTable("GLYPH");
        }
        catch(_e){
            Thaqqa_DB.createTable({name:"GLYPH"});
            const table = Thaqqa_DB.getTable("GLYPH");
            table.createColumn("ID","INTEGER","",0);
            table.createColumn("Name","char","",1);
            table.createColumn("Path","char","",2);
            for(const d in data){
                table.createData({Name:d,Path:SVG.toRelative(data[d])});
            }
        }
      })
      .catch(error => console.error('Error fetching data:', error));
      return new Promise(resolve => {
            resolve("done");
        });
      }

    static getSVG(name){
        const ans = [];
        const table = Thaqqa_DB.getTable("GLYPH");
        if(table != null){
            const data = table.getData({Name:name});
            for(let i = 0;i<data.length;i++){
                ans.push(data[i].values.Path);
            }
        }
        return ans;
    }
}

class GlyphArray{
    constructor(name,bound,posx,posy,algx,algy,algwhole){
        this.name=name;
        this.d = "";
        this.child = [];//Glyphの配列 入れ子にします
        this.attribute = {};//(将来用)
        this.position = {x:posx??0,y:posy??0};//（parentに対するthisのoffset）
        this.aligment = {x:algx??0,y:algy??0};
        this.algwhole = algwhole; //-1(右から左),0(上から下),1(左から右)
        this.box = {top:0,right:0,bottom:0,left:0};
        this.bound = bound;

        this.initSvg();
    }
    initSvg(){
        let text = this.name;
        for(let _i = 0;_i<2;_i++){
            let r = new RegExp_Khhyl("(L())(L())",{});
            r = r.ParseRegExp()
            const r_ = r.toNormalRegExp();
            const r_fin = new RegExp(r_, "g");
            text = text.replaceAll(r_fin,"$1Q()$2");
        }
        const pSVGData = text.split("Q()");
        for(let i = 0;i<pSVGData.length;i++){
            this.child.push(new Glyph(pSVGData[i]));
        }
    }
    toPath(defaultsize){
        const algwhole = this.algwhole;
        const mutli_ = function (n){return n/(algwhole==0?textdata.Width:textdata.Height)}
        const textdata = Thaqqa_DB.getTable("TEXTDATA").data[0].values;
        const rescale = function(param,size){
            const aa = Snap.parsePathString(Snap.path.toAbsolute(param));
            for(let i = 0;i<aa.length;i++){
                for(let j = 1;j<aa[i].length;j++){
                    aa[i][j] *= mutli_(size);
                }
            }
            return Snap.path.toRelative(aa).toString().toLowerCase();
        }

        this.d = `M ${this.position.x},${this.position.y}`;
        let x = this.position.x;
        let y = this.position.y;

        const nlist = Thaqqa_DB.getTable("PUNCTUATION").getData({"IsNewline":true});
        const nlist_ = [];for(let i = 0;i<nlist.length;i++){nlist_.push(nlist[i].values.Name)};
       
        
        if(this.algwhole==0){
            for(let i = 0;i<this.child.length;i++){
                let m0 = 0;
                let m1 = 0;
                if(i+1 != this.child.length)
                {m1 += GPOSManager.gpos(this.child[i].name+this.child[i+1].name,0,"EX").y1;
                m0 += GPOSManager.gpos(this.child[i].name+this.child[i+1].name,0,"EX").y0;
                }
                if(i != 0){ //
                    m0 += GPOSManager.gpos(this.child[i-1].name+this.child[i].name,0,"EX").y0;
                }   
                if(i == this.child.length-1) m1 += GPOSManager.gpos(this.child[i].name+"Q()",0,"EX").y1;
                
                y += m0*mutli_(defaultsize);
                if(i == 0 ) m0 += GPOSManager.gpos("Q()"+this.child[i].name,0,"EX").y1;

                this.d += `M ${x},${y} `;

                const d = rescale(this.child[i].toPathB(-m0,m1),defaultsize); //16はsize
                this.d += d;
                y += (SVG.getBottom(this.child[i].toPathB(0,0))+m1)*mutli_(defaultsize);
                if(i+1 != this.child.length){const d2 = rescale(this.child[i+1].d,defaultsize);y -= SVG.getTop(d2);}
                
                this.child[i].offset = {x,y};
                if(this.child[i].type.startsWith("P")&&nlist_.includes(this.child[i].glyphname.split("_")[0])){
                    x -= defaultsize;y = 0;
                }
            }
            this.d += `M ${x},${y} `;
        }
        else{
            for(let i = 0;i<this.child.length;i++){
                const h = textdata.Height;
                this.d += rescale(this.child[i].toPathAbs(h,0.5),defaultsize);
               
                if(i!=this.child.length-1)x += defaultsize;//size
                this.child[i].offset = {x,y};
                if(this.child[i].type.startsWith("P")&&nlist_.includes(this.child[i].glyphname.split("_")[0])){
                    x = 0;y += defaultsize;
                }
                this.d += `M ${x},${y} `;
            }
        }
        return this.d;
    }

}

class Glyph{
    constructor(name){ //flag_recは再帰処理判定用

        // name：（使い勝手ゴミなので）仕様変更
        /* {type: (S,P,Pd,C,Cd,V,Vd) ,form :(init,mid,fin,sol,onset,coda) , 
            name:h , val:0
            fullname:h_0
            
            例1：type:S form:init
            name: null val:null
            fullname:h_0,a_0,h_0

            例2：type:C form:onset
            name:h val:0
            fullname: h_0-d_0
            }
        */
        this.fullname = name; 
        this.name = ""; 
        this.d = "";
        this.isroot = false;
        this.parent;
        this.child = [];//Glyphの配列 入れ子にします
        this.attribute = {};//(将来用)
        this.size = 16;
        this.type = "";//S,P,C,Vのいずれか
        this.offset = {x:0,y:0,xb:0,yb:0};//（parentに対するthisのoffset）
        this.gap ={top:0,middle:0,bottom:0}; //上棒、中央、下棒
        this.aligment = {x:0,y:0};
        this.height = {vtop:0,vbottom:0,top:0,bottom:0};
        this.initSvg(name);
        this.toPath();

    }
    initSvg(name){
        const partname = this.partitionName(name);
        if(partname.length == 0){this.isroot = true;
            if(name == null|| name == ""){this.d = "" ,this.aligment = {x:0,y:0};return null;}
            const form = this.form ?? "";
            const temp2 = this.glyphname;
            const name_ = `${this.name}_${form}_${this.val}`
            this.d = (GlyphManager.getSVG(name_));//this.nameがこれ以上分割できない場合。
            let offx = 0;
            let offy = 0;
            
            if(LetterManager.getLetter(temp2[0])[0]){offx = LetterManager.getLetter(temp2[0])[0].values.x_Align;offy = LetterManager.getLetter(temp2[0])[0].values.y_Align;}
            this.aligment = {x:(offx),y:(offy)};
        }
        else{//分割できたら
            this.isroot = false;
            let x0 = 0;
            let y0 = 0;
            let x1;
            let y1;
            
            if(this.type == "S"){
                const k = GPOSManager.gpos(name,0,"IN");
                x0 = k.x0;y0 = k.y0;x1 = k.x1;y1 = k.y1;
            }
            else{
                const k = GPOSManager.gpos(name,0,"DIAC");
                x0 = k.x0;y0 = k.y0;
            }

            for(let i = 0 ; i<partname.length;i++){
                const new_glyph = new Glyph(partname[i]);
                new_glyph.parent = this;
                if(x1 != null && y1 != null && i == 2)new_glyph.offset = {x:x1,y:y1};
                else if(x1 != null && y1 != null && i == 0) new_glyph.offset = {x:x0,y:y0};
                else if(x1 == null && y1 == null && i == 1) new_glyph.offset = {x:x0,y:y0};
                this.child.push(new_glyph);
            }
        } 
    }


    partitionName(name){
        this.fullname = name;
        if(name == "") return [];
        else{ 
            this.type = name.split("(")[0];
        if(name.startsWith("S")){
            //音節ならCo,V,Ccに。空の場合は何も残さない
            const temp = name.split("(")[1].split(")")[0].split(",");
            this.glyphname = temp.slice(1).join(",");
            this.form = temp[0];
            const onset = temp[1] == "" ? "" : "C("+"onset"+","+temp[1]+")";
            const vowel = temp[2] == "" ? "" :"V("+temp[0]+","+temp[2]+")";
            const coda = temp[3] == "" ? "" :"C("+"coda"+","+temp[3]+")";
            return [onset,vowel,coda];
        }
        else if(name.startsWith("P")){
            const temp = name.split("(")[1].split(")")[0].split(",")[0];
            this.glyphname = name.split("(")[1].split(")")[0];
            const temp2 = temp.split("-");
            if(temp2.length <= 1){this.name = temp2[0].split("_")[0];this.val = temp2[0].split("_")[1]; return []}//これ以上は分割できない
            else{
                let d_ = "";
                for(let i = 0;i<temp2.length;i++){
                    d_ += temp2[i]+(i==temp2.length-1?"":"-");
                }
                const d = [ name.split("(")[0]+"("+d_+")","Pd("+temp2.slice(-1)+")"];
                return d;
            }
        }
        else{
            const temp = name.split("(")[1].split(")")[0].split(",");
            this.glyphname = temp.slice(1).join(",");
            this.form = temp[0];
            const temp2 = temp[1].split("-");
            if(temp2.length <= 1){this.name = temp2[0].split("_")[0];this.val = temp2[0].split("_")[1]; return []}//これ以上は分割できない
            else{
                const l = name.split("(")[0];
                let d_ = "";
                for(let i = 0;i<temp2.length-1;i++){
                    d_ += temp2[i]+(i==temp2.length-2?"":"-");
                }
                
                const d = [ l+"("+temp[0]+","+d_+")",l.length == 2 ? l : (l+"d")+"("+temp[0]+","+temp2.slice(-1)+")"];
                return d;
            }
            //Co-d0-d1なら例えば(Co-d0)とd1に分割。
        }
        }
        //音節ならCo,V,Ccに、Co-d0-d1なら例えば(Co-d0)とd1に分割。
        //これ以上分割不能ならfalseを返す
    }



    toPathAbs(height,vowelhratio){
        let k = this.toPath();k ??= "M 0,0";
        const width = Thaqqa_DB.getTable("TEXTDATA").data[0].values.Thickness;
        const VH = vowelhratio*height
        const vt = (this.height.vbottom-this.height.vtop)/2;
        const vt_b = (-this.height.bottom-this.height.top)/2;
        if(this.type == "S"){
            switch(this.form){
                case "sol":
                    k = SVG.convertSVG(k);
                    k = "M 0,"+(VH-vt)+""+k;
                    k = SVG.convertSVG(k);
                break;
                case "init":
                    //initはM 0,0
                    //vbottom~heightの棒
                    k = SVG.convertSVG(k);
                    k = "M 0,0 "+k+SVG.setSkewer(-width/2,this.height.vbottom,width/2,height);
                    k = SVG.convertSVG(k);
                    this.gap = {top:0,middle:this.height.vbottom,bottom:height};
                break;
                case "mid":
                    k = SVG.convertSVG(k);
                    k = "M 0,"+(VH+vt_b-vt)+""+k+SVG.setSkewer(-width/2,VH+vt_b+vt,width/2,height)+SVG.setSkewer(-width/2,0,width/2,VH+vt_b-vt);
                    k = SVG.convertSVG(k);
                    this.gap = {top:VH+vt_b-vt,middle:VH+vt_b-vt,bottom:height};
        //(midのみ)0~vowelhratio*height-(vbottom-vheight)/2の棒
        //M 0,(vowelhratio*height+(vbottom-vheight)/2) 
        //(midのみ)vowelhratio*height+(vbottom-vheight)/2~heightの棒
                break;
                case "fin":
        //finはM 0,height-(bottom-top)
        //0~max(vbottom,vtop)の棒
                    k = SVG.convertSVG(k);
                    k = "M 0,"+(height-(this.height.bottom-this.height.vtop))+" "+k+SVG.setSkewer(-width/2,0,width/2,height-(this.height.bottom-this.height.vtop));
                    k = SVG.convertSVG(k);
                    this.gap = {top:0,middle:height-(this.height.bottom-this.height.vtop),bottom:0};
                break;
                }   
            }
            else{
                k = SVG.convertSVG(k);
                k = "M 0,"+(VH+vt)+""+k;
                k = SVG.convertSVG(k);
                this.gap = {top:VH-vt,middle:VH,bottom:VH+vt};
            }
                return k;
    }
    toPathB(top,bottom){
        let k = this.toPath();
        k ??= "M 0,0";
        const width = Thaqqa_DB.getTable("TEXTDATA").data[0].values.Thickness;
        //ここらへんもSnap.Pathの力を使います

        if(this.type == "S"){
            const v = this.child[1].glyphname.split("_")[0];
            const v_null = Thaqqa_DB.getTable("VOWEL").getData({Name:v})[0].values.isNullVowel;
        if(v_null){
            switch(this.form){
                case "sol":
                    k = SVG.convertSVG(k);
                    k = k + " M 0,"+(bottom+this.height.bottom);
                    k = "M 0,"+(top+this.height.top)+" "+k;
                    k = SVG.convertSVG(k);
                break;
                case "init":
                    k = SVG.convertSVG(k);
                    k = "M 0,"+(bottom)+" "+k + SVG.setSkewer(-width/2,top+this.height.top,width/2,this.height.vtop)+SVG.setSkewer(-width/2,this.height.vbottom,width/2,bottom+this.height.bottom);
                    k = SVG.convertSVG(k);
                    break;
                case "mid":
                    k = SVG.convertSVG(k);
                    k = "M 0,"+(0)+" "+k + SVG.setSkewer(-width/2,top+this.height.top,width/2,this.height.vtop)+SVG.setSkewer(-width/2,this.height.vbottom,width/2,bottom+this.height.bottom);
                    k = SVG.convertSVG(k);
                    break;
                case "fin":
                    k = SVG.convertSVG(k);
                    k = "M 0,"+(top)+" "+k + SVG.setSkewer(-width/2,top+this.height.top,width/2,this.height.vtop)+SVG.setSkewer(-width/2,this.height.vbottom,width/2,bottom+this.height.bottom);
                    k = SVG.convertSVG(k);
                break;
        }
        }{
            switch(this.form){
            case "sol":
                k = SVG.convertSVG(k);
                k = k + " M 0,"+(bottom+this.height.bottom);
                k = "M 0,"+(top+this.height.top)+" "+k;
                k = SVG.convertSVG(k);
            break;
            case "init":
                k = SVG.convertSVG(k);
                k = "M 0,"+(top)+" "+k + SVG.setSkewer(-width/2,top+this.height.vbottom,width/2,bottom+this.height.bottom);
                k = SVG.convertSVG(k);
            break;
            case "mid":
                k = SVG.convertSVG(k);
                k = " M 0,0 "+k + SVG.setSkewer(-width/2,top+this.height.top,width/2,this.height.vtop)+SVG.setSkewer(-width/2,this.height.vbottom,width/2,bottom+this.height.bottom);
                k = SVG.convertSVG(k);
            break;
                case "fin":
                k = SVG.convertSVG(k);
                k = " M 0," + (0)+ " "+ k + SVG.setSkewer(-width/2,top+this.height.top,width/2,this.height.vtop + (v_null? bottom: 0));
                k = SVG.convertSVG(k);
            break;
    }}

    }        
    else{k = k + " M 0,"+(bottom+this.height.bottom);
    k = "M 0,"+(top+this.height.top)+" "+k;
    k = SVG.convertSVG(k);}
        this.gap = {top:top,middle:0,bottom:bottom};
            return k;
    }
    toPath(){//Svgをpathにする。再帰的に。
        // \\sなら、最初に[1]を、次に[0]と[2]を処理
        // \\v,p,cなら、最初に[0][0]...[0]を、次に[0][0]...[1]、、、[1]を処理
        let ans = "";
        if(this.type == "S"){
            const c0 = this.child[0].toPath();
            const v = this.child[1].toPath();
            const c1 = this.child[2].toPath();
            const offs = this.getoffset(this.child[1],true,true)
            const off0 = offs[0];//this.child[0].name_b.glyphname == null ? {x:0,y:0} :this.child[0].getoffset(v,true);//parentd
            const off1 = offs[1];//this.child[2].name_b.glyphname == null ? {x:0,y:0} :this.child[2].getoffset(v,true);
            
            ans = SVG.merge3(v,c0,c1,0,off0.y,0,off1.y);
            ans = SVG.toRelative(ans);

            this.height.vtop = SVG.getTop(v);
            this.height.vbottom = SVG.getBottom(v);
            this.height.bottom = SVG.getBottom(ans);
            this.height.top = SVG.getTop(ans);
            this.d = ans;
        }
        else{
            // deno-lint-ignore no-this-alias
            let p = this; 
            while(p.child.length != 0){
                p = p.child[0];
            }
                ans = p.d;
                const dir_ = {onset:1,coda:-1};
               
            while(p.parent != null && p.parent.type != "S"){
                
                const dir  = p.type.startsWith("C") ? dir_[p.form] : 1;
                const off = p.parent.getoffset("",false,true);
                ans = SVG.merge2(ans,p.parent.child[1].d,off.x+dir*(SVG.getRight(p.parent.child[1].d)+SVG.getLeft(p.parent.child[1].d))/2,off.y+(SVG.getTop(p.parent.child[1].d)-SVG.getBottom(p.parent.child[1].d)/2));
                ans = SVG.toRelative(ans);
                p = p.parent;
                p.d = ans;
            }
        }
        return ans ?? "M 0,0";
    }

    
    getoffset(){
        //V-Vd部分のみ動作未検証
            if(this.type == "S"){
                const v = this.child[1].glyphname.split("_")[0];
                const v_null = Thaqqa_DB.getTable("VOWEL").getData({Name:v})[0].values.isNullVowel;

                const c0offset = this.child.length>0?this.child[0].offset:{x:0,y:0};
                    const c2offset = this.child.length>2?this.child[2].offset:{x:0,y:0};
                    const c0d = this.child.length>0?this.child[0].d:null;
                    const c1d = this.child[1].d;
                    const c2d = this.child.length>2?this.child[2].d:null;
                    const topgap = c0d !=null?(c2d!=null ? Math.min(SVG.getTop(c0d),SVG.getTop(c2d)):SVG.getTop(c2d)):(c2d!=null ? SVG.getTop(c2d):0);
                    const bottomgap = c0d !=null?(c2d!=null ? Math.max(SVG.getBottom(c0d),SVG.getBottom(c2d)):SVG.getBottom(c2d)):(c2d!=null ? SVG.getBottom(c2d):0);

                if(v_null){
                    return [{x:c0offset.x,y:SVG.getBottom(c1d)+topgap+c0offset.y},{x:c2offset.x,y:SVG.getBottom(c1d)+topgap+c2offset.y}];
                }
                else{
                    switch(this.form){
                        case "init":
                            return [{x:c0offset.x,y:SVG.getBottom(c1d)+topgap+c0offset.y},{x:c2offset.x,y:SVG.getBottom(c1d)+topgap+c2offset.y}];
                        case "mid":
                        case "sol":
                            return [{x:c0offset.x,y:SVG.getTop(c1d)+SVG.getBottom(c0d ?? "M 0,0")+c0offset.y},{x:c2offset.x,y:SVG.getBottom(c1d)+SVG.getTop(c2d ?? "M 0,0")+c2offset.y}];
                        case "fin":
                            return [{x:c0offset.x,y:SVG.getTop(c1d)-bottomgap+c0offset.y},{x:c2offset.x,y:SVG.getTop(c1d)-bottomgap+c2offset.y}];
                    }
                }
            }
            else{
                if(this.child.length < 1) return {x:0,y:0};
                const parentd = this.child[0].d
                const off1 = this.child[1].offset;
                const alig1 = this.child[1].aligment;

                if(this.type.startsWith("C")){
                    const dir_ = {onset:1,coda:-1};
                    const dir = dir_[this.form];

                    const x =  (SVG.getLeft(parentd)*(1-alig1.x*dir)/2+SVG.getRight(parentd) *(1+alig1.x*dir)/2)+off1.x*dir;
                    const y =  (SVG.getTop(parentd)*(1-alig1.y)/2+SVG.getBottom(parentd) *(1+alig1.y)/2)+off1.y ;
                    return{x:x,y:y};
                }
                else{
                    const x =  (SVG.getLeft(parentd)*(1-alig1.x)/2+SVG.getRight(parentd)*(1+alig1.x)/2)+off1.x;
                    const y =  (SVG.getTop(parentd)*(1-alig1.y)/2+SVG.getBottom(parentd) *(1+alig1.y)/2)+off1.y ;
                    return{x:x,y:y};
                }
            }
        
        return {x:0,y:0};
    }

}

export {Glyph,GlyphArray,GlyphManager};