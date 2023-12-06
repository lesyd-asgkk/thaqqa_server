import {
    DOMParser,
    Element,
  } from "https://deno.land/x/deno_dom@v0.1.43/deno-dom-wasm.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

import { SVG } from "./SVG.ts";
import { Thaqqa_DB,DataTable } from "./Thaqqa_DB.ts";
import { LetterManager } from "./LetterManager.ts";
import { GPOSManager } from "./GPOSManager.ts";

export class SVGManager{
    static loadAllGlyph(path : string){
        const decoder = new TextDecoder("utf-8");
        let id = 0;
        for  (const filename of Deno.readDirSync(path)) {
            //console.log(path+"/"+filename.name);
            const file = Deno.readFileSync(path+"/"+filename.name);
            const doc = new DOMParser().parseFromString(decoder.decode(file), 'text/html')!;
            const svg = doc.getElementsByTagName("PATH");

           //console.log("\n\n"+filename.name+"\n\n");
            const tables = Thaqqa_DB.getTable("GLYPH");
            
            
            let d = "M0,0";
            for(const a of svg) {
                
                const b_ = a.getAttribute("d");
                
                if(b_ != null)
                {
                    d += b_ + "M0,0";
                }
                //console.log(filename.name);

            }
            d = SVG.toRelative(d);
            tables.createData({["ID"]:id,["Name"]:filename.name.slice(0,-4),["Path"]:d});
            id += 1;
        }
    }
    static getSVG(name:string){
        const ans = [];
        const table = Thaqqa_DB.getTable("GLYPH");
        const data = table.getData({Name:name});
            for(let i = 0;i<data.length;i++)ans.push(data[i].values.Path);
            return ans;
        }

    static createGSUB(param:string|{[index: string]: string|boolean|number}){//

        if(typeof param == "string") param = {Name:param};

        if(SVGManager.getSVG((param.Name as string)).length != 0) throw new Error(param+"はすでに存在しています");

        const table_ = Thaqqa_DB.getTable("GLYPH");
        table_.createData(param);
        }
    }

export class Glyph{

    declare name : string;
    declare d : string;
    declare isroot : boolean;
    declare parent? : Glyph;
    declare child : Glyph[];
    declare attribute;
    declare offset : {[index : string]:number};
    declare aligment : {[index : string]:number};
    declare height : {[index : string]:number};
    constructor(name:string,offx?:number,offy?:number,algx?:number,algy?:number){
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
           
            const temp = this.name.split(",");
            const form = this.name.startsWith("P") ?"":temp[0].split("(")[1];
            const temp2 = temp.slice(-1)[0].split("_");
            //console.log(temp2[0]+"_"+form+"_"+temp2[1].split(")")[0]);
            this.d = (SVGManager.getSVG(temp2[0]+"_"+form+"_"+temp2[1].split(")")[0])[0] as string);//this.nameがこれ以上分割できない場合。
            let offx = LetterManager.getLetter(temp2[0])[0].values.x_Align;
            let offy = LetterManager.getLetter(temp2[0])[0].values.y_Align;
            if(offx == null) offx = 0;
            if(offy == null) offy = 0;
            console.log(offy)
            this.aligment = {x:(offx as number),y:(offy as number)};
            //console.log(this.d);
    }
            else{//分割できたら
            this.isroot = false;
            let x0 = 0;
            let y0 = 0;
            let x1;
            let y1;
            
            if(this.name.startsWith("S")){
                const k = GPOSManager.gpos_in(this.name,1);
                x0 = k.x0;y0 = k.y0;x1 = k.x1;y1 = k.y1;
                console.log(k);
            }
            else{
                console.log(this.name);
                const k = GPOSManager.gpos_diac(this.name,1);
                x0 = k.x;y0 = k.y;
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
            
            ans = SVG.createMerge3(v,c0,c1,0,off0.y,0,off1.y);

            console.log("\nS");

            ans = SVG.toRelative(ans);

            this.height.vtop = SVG.getTop(v);
            this.height.vbottom = SVG.getBottom(v);
            this.height.top = off0.y;
            this.height.bottom = off1.y;
            this.d = ans;
        }
        else{
            // deno-lint-ignore no-this-alias
            let p : Glyph = this; 
            while(p.child.length != 0){
                
                p = p.child[0];
            }
                ans = p.d;
            while(p.parent != null && !p.parent.name.startsWith("S")){
                //console.log(p.name);
                const off = p.parent.child[1].getoffset(ans,false);
                //console.log(off);
                ans = SVG.createMerge2(ans,p.parent.child[1].d,off.x,off.y);
                //console.log(ans);
                ans = SVG.toRelative(ans);
                //console.log(ans);
                p = p.parent;
                p.d = ans;
            }
        }
        return ans ?? "M 0,0";
    }

    
    getoffset(parentd:string,issyl:boolean){
        const dir_ : {[index: string]:number}= {onset:1,coda:-1};
        const dir_v_ : {[index: string]:{[index: string]:number}}= {init:{onset:-1,coda:-1},mid:{onset:1,coda:-1},fin:{onset:1,coda:1},sol:{onset:1,coda:-1}};
        console.log(this.offset.x);
        console.log(this.offset.y);
        
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