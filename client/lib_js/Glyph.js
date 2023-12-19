
import { Thaqqa_DB,SVG,DataTable,Data,GPOSManager,LetterManager} from "./deps.js";
class GlyphManager{
    
    static async load(){
        await fetch('/server/FontData.svg')
      .then(response => response.json())
      .then(data => {
        //console.log('Received data:', data);
        try{
        Thaqqa_DB.getTable("SVG");
        }
        catch(_e){
            Thaqqa_DB.createTable({name:"SVG"});
            const table = Thaqqa_DB.getTable("SVG");
            table.createColumn("ID","INTEGER","",0);
            table.createColumn("Name","char","",1);
            table.createColumn("Path","char","",2);
            for(const d in data){
                table.createData({Name:d,Path:data[d]});
            }
            console.log(table);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
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

class Glyph{
    constructor(name,offx,offy,algx,algy){
        this.name = name;
        this.d = "";
        this.isroot = false;
        this.parent;
        this.child = [];//Glyphの配列 入れ子にします
        this.attribute = {};//(将来用)
        this.offset = {x:offx??0,y:offy??0};//（parentに対するthisのoffset）
        this.aligment = {x:algx??0,y:algy??0};

        this.height = {vtop:0,vbottom:0,top:0,bottom:0};
        this.initSvg();
        this.toPath();
    }

    
    partitionName(){
        //this.name;
        if(this.name.startsWith("S")){
            //音節ならCo,V,Ccに。空の場合は何も残さない
            const temp = this.name.split("(")[1].split(")")[0].split(",");
            //console.log(temp);
            const onset = temp[1] == "" ? "" : "C("+"onset"+","+temp[1]+")";
            const vowel = temp[2] == "" ? "" :"V("+temp[0]+","+temp[2]+")";
            const coda = temp[3] == "" ? "" :"C("+"coda"+","+temp[3]+")";
            return [onset,vowel,coda];
        }
        else if(this.name.startsWith("P")){
            const temp = this.name.split("(")[1].split(")")[0].split(",")[0];
            const temp2 = temp.split("-");
            if(temp2.length <= 1) return [];//これ以上は分割できない
            else{
                let d_ = "";
                for(let i = 0;i<temp2.length;i++){
                    d_ += temp2[i]+(i==temp2.length-1?"":"-");
                }
                const d = [ this.name.split("(")[0]+"("+d_+")","Pd("+temp2.slice(-1)+")"];
                return d;
            }
        }
        else if(this.name == "") return [];
        else{
            const temp = this.name.split("(")[1].split(")")[0].split(",");
            const temp2 = temp[1].split("-");
            if(temp2.length <= 1) return [];//これ以上は分割できない
            else{
                const l = this.name.split("(")[0];
                let d_ = "";
                for(let i = 0;i<temp2.length-1;i++){
                    d_ += temp2[i]+(i==temp2.length-2?"":"-");
                }
                
                const d = [ l+"("+temp[0]+","+d_+")",l.length == 2 ? l : (l+"d")+"("+temp[0]+","+temp2.slice(-1)+")"];
                return d;
            }
            //Co-d0-d1なら例えば(Co-d0)とd1に分割。
        }
        //音節ならCo,V,Ccに、Co-d0-d1なら例えば(Co-d0)とd1に分割。
        //これ以上分割不能ならfalseを返す
    }

    initSvg(){
        const partname = this.partitionName();
        //console.log(partname.length);
        if(partname.length == 0){this.isroot = true;

            if( this.name == null||this.name == ""){this.d = "" ,this.aligment = {x:0,y:0};return null;}
            const temp = this.name.split(",");
            const form = this.name.startsWith("P") ?"":temp[0].split("(")[1];
            const temp2 = temp.slice(-1)[0].split("_");
            this.d = (GlyphManager.getSVG(temp2[0]+"_"+form+"_"+temp2[1].split(")")[0])[0]);//this.nameがこれ以上分割できない場合。
            let offx = LetterManager.getLetter(temp2[0])[0].values.x_Align;
            let offy = LetterManager.getLetter(temp2[0])[0].values.y_Align;
            if(offx == null) offx = 0;
            if(offy == null) offy = 0;
            console.log(offy)
            this.aligment = {x:(offx),y:(offy)};
            //console.log(this.d);
    }
            else{//分割できたら
            this.isroot = false;
            let x0 = 0;
            let y0 = 0;
            let x1;
            let y1;
            
            if(this.name.startsWith("S")){
                const k = GPOSManager.gpos(this.name,0,"IN");
                x0 = k.x0;y0 = k.y0;x1 = k.x1;y1 = k.y1;
                console.log(k);
            }
            else{
                const k = GPOSManager.gpos(this.name,0,"DIAC");
                x0 = k.x0;y0 = k.y0;
                console.log(k);
            }

            for(let i = 0 ; i<partname.length;i++){
                // \sならGPOS_INTERNALの情報から
                // \cや\v,\pならGPOS_DIACの情報からoffx,offyを指定
                const new_glyph = new Glyph(partname[i]);
                new_glyph.parent = this;
                console.log(x0);console.log(y0);console.log(x1);console.log(y1);
                if(x1 != null && y1 != null && i == 2)new_glyph.offset = {x:x1,y:y1};
                else if(x1 != null && y1 != null && i == 0) new_glyph.offset = {x:x0,y:y0};
                else if(x1 == null && y1 == null && i == 1) new_glyph.offset = {x:x0,y:y0};
                this.child.push(new_glyph);

            }
        } 
    }

    toPathB(top,bottom){
        let k = this.d;
        const width = Thaqqa_DB.getTable("TEXTDATA").data[0].values.Thickness;
        //ここらへんもSnap.Pathの力を使います

        if(this.name.startsWith("S")){
        switch(this.name.split(",")[0].split("S(")[1]){
            case "sol":
                k = k + " M 0,"+(bottom+this.height.bottom);
                k = "M 0,"+(top+this.height.top)+" "+k;
                k = SVG.convertSVG(k);
            break;
            case "init":
                k = "M 0,"+(top)+" "+k + SVG.setSkewer(-width/2,this.height.vbottom,width/2,bottom+this.height.bottom);
                k = SVG.convertSVG(k);
            break;
            case "mid":
                k = SVG.setSkewer(-width/2,top+this.height.top,width/2,this.height.vtop)+" M 0,0 "+k + SVG.setSkewer(-width/2,this.height.vbottom,width/2,bottom+this.height.bottom);
                k = SVG.convertSVG(k);
            break;
                case "fin":
                k = SVG.setSkewer(-width/2,top+this.height.top+(bottom),width/2,this.height.vtop+(bottom)) +" M 0," + ((bottom))+ " "+ k;
                k = SVG.convertSVG(k);
            break;
            }   
        }
        else{k = k + " M 0,"+(bottom+this.height.bottom);
        k = "M 0,"+(top+this.height.top)+" "+k;
        k = SVG.convertSVG(k);}
            return k;
    }
    toPath(){//Svgをpathにする。再帰的に。
        // \\sなら、最初に[1]を、次に[0]と[2]を処理
        // \\v,p,cなら、最初に[0][0]...[0]を、次に[0][0]...[1]、、、[1]を処理
        let ans = "";
        if(this.name.startsWith("S")){
            //console.log(this);
            const c0 = this.child[0].toPath();
            const v = this.child[1].toPath();
            const c1 = this.child[2].toPath();
            const off0 = this.child[0] == null ? {x:0,y:0} :this.child[0].getoffset(v,true);//parentd
            const off1 = this.child[2] == null ? {x:0,y:0} :this.child[2].getoffset(v,true);
            
            ans = SVG.merge3(v,c0,c1,0,off0.y,0,off1.y);

            console.log("\nS");

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
            while(p.parent != null && !p.parent.name.startsWith("S")){
                //console.log(p.name);
                const off = p.parent.child[1].getoffset(ans,false);
                //console.log(off);
                ans = SVG.merge2(ans,p.parent.child[1].d,off.x,off.y);
                //console.log(ans);
                ans = SVG.toRelative(ans);
                //console.log(ans);
                p = p.parent;
                p.d = ans;
            }
        }
        return ans ?? "M 0,0";
    }

    
    getoffset(parentd,issyl){
        const dir_ = {onset:1,coda:-1};
        const dir_v_ = {init:{onset:-1,coda:-1},mid:{onset:1,coda:-1},fin:{onset:1,coda:1},sol:{onset:1,coda:-1}};

        if(this.parent != null && issyl){
            if(this.name.startsWith("V")){
                return {x:0,y:0};
            }
            if(this.name.startsWith("C")){
                const dir = dir_v_[this.parent.name.split("(")[1].split(",")[0]][this.name.split("(")[1].split(",")[0]];

                if(dir>0){ //上側
                    return{x:this.offset.x,y:-SVG.getTop(parentd)-SVG.getBottom(this.d)-this.offset.y};
                }
                else{//下側
                    return{x:this.offset.x,y:SVG.getBottom(parentd)+SVG.getTop(this.d)+this.offset.y};
                }
            }
        }
        else if(!issyl) {
            //console.log(this.name);

            if(this.name.startsWith("C")){
                
                const dir = dir_[this.name.split("(")[1].split(",")[0]];
                const x =  ((SVG.getLeft(parentd)*(1-this.aligment.x*dir)/2+SVG.getRight(parentd) *(1+this.aligment.x*dir)/2)+this.offset.x*dir );
                const y =  (SVG.getTop(parentd)*(1-this.aligment.y)/2+SVG.getBottom(parentd) *(1+this.aligment.y)/2)+this.offset.y ;

                return{x:x,y:y};
            }
            else{
                const x =  ((SVG.getLeft(parentd)*(1-this.aligment.x)/2+SVG.getRight(parentd)*(1+this.aligment.x)/2)+this.offset.x );
                const y =  (SVG.getTop(parentd)*(1-this.aligment.y)/2+SVG.getBottom(parentd) *(1+this.aligment.y)/2)+this.offset.y ;
                return{x:x,y:y};
            }
        }
        return {x:0,y:0};
    }

}

export {Glyph,GlyphManager};