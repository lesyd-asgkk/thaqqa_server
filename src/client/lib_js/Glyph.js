
import { Database,SVG,RegExp_Khhyl,GPOSManager,LetterManager} from "./deps.js";
class GlyphManager{
    static load(doc){
        const svg = doc.getElementsByTagName("PATH");
        let d = "M0,0";
        for (const a of svg) {
        const b_ = a.getAttribute("d");

        if (b_ != null) {
          d += b_ + "M0,0";
        }
      }
    table.createData({Name:data,Path:SVG.convertSVG(data[d])});
    }
    static async loadAll(){
        await fetch('/server/FontData.svg')
      .then(response => response.json())
      .then(data => {
        try{
        Database.getTable("GLYPH",true);
        }
        catch(_e){
            Database.createTable({name:"GLYPH"});
            const table = Database.getTable("GLYPH");
            table.createColumn("ID","INTEGER","",0);
            table.createColumn("Name","char","",1);
            table.createColumn("Path","char","",2);
            console.log(data);
            for(const d in data) table.createData({Name:d,Path:SVG.convertSVG(data[d])});
        }
      })
      .catch(error => console.error('Error fetching data:', error));
      return new Promise(resolve => {
            resolve("done");
        });
      }
      /*
    static resetPreSVG(){
        Database.deleteTable("PRERENDER_GLYPH");
        Database.createTable({name:"PRERENDER_GLYPH"});
        const table = Database.getTable("PRERENDER_GLYPH");
        table.createColumn("ID","INTEGER","",0);
        table.createColumn("fullname","char","",1);table.createColumn("name","char","",2);table.createColumn("val","char","",3);
        table.createColumn("form","char","",4);
        table.createColumn("vec","INTEGER","",5);
        table.createColumn("d","char","",10);
        table.createColumn("vtop","float","",20);table.createColumn("vbottom","float","",21);
        table.createColumn("top","float","",22);table.createColumn("bottom","float","",23);
        table.createColumn("child0","char","",30);table.createColumn("child1","char","",31);table.createColumn("child2","char","",32);
        table.createColumn("offx0","float","",40);table.createColumn("offy0","float","",41);
        table.createColumn("aligx","float","",50);table.createColumn("aligy","float","",51);
         table.createColumn("type","char","",60);
    }
    static setPreSVGall(){
        const c0_khhyl = ["","t0","k0","q0","c0","n0","ng0","th0","s0","hy0","kh0","qh0","h0","l0","r0","tl0","y0","w0","th0-d0","s0-d0","hy0-d0","kh0-d0","qh0-d0","h0-d0","x0"]
        const c1_khhyl = ["","t0","k0","q0","c0","n0","ng0","th0","s0","hy0","kh0","qh0","h0","l0","r0","tl0","y0","w0","th0-d0","s0-d0","hy0-d0","kh0-d0","qh0-d0","h0-d0"]
        const v_khhyl = ["a","abig","e","eold","i","iold","o","u","v"]
        const v_khhylH = {abig:["mid","init","mid"],e:["fin","fin","fin"],
        i:["fin","init","fin"],o:["fin","init","init"],
        u:["fin","init","fin"],v:["fin","init","fin"],
        eold:["fin","fin","fin"],iold:["fin","init","init"],
        }
        console.log((c0_khhyl.length*c1_khhyl.length*v_khhyl.length*3+8 )+(c0_khhyl.length*(c1_khhyl.length-1)*v_khhyl.length*3+8 ))
        for(const y in v_khhyl){
            const v = v_khhyl[y];
            const name = `S(sol,,${v}0,)`;
            new Glyph(name,0);
            const name2 = `S(sol,,${v}1,)`;
            if(v!="a")new Glyph(name2,1);
        }
        console.log("Done:sol");

        const c0_san = ["t0-d0","k0-d0",
        "t0-hd0","q0-hd0","n0-hd0","th0-hd0","tl0-hd0",
        "t0-sy0","k0-sy0","n0-sy0","ng0-sy0","s0-sy0","r0-sy0",
        "k0-sw0","q0-sw0","ng0-sw0",
        "t0-d0-hd0","n0-hd0-sy0","th0-hd0-sy0",
        "th0-hd0-sw0","tl0-hd0-sy0"];
        console.log((c0_san.length*(c1_khhyl.length+2)*3)+((c0_san.length*(c1_khhyl.length+1)*3)));
        for(const x in c0_khhyl){const c0 = c0_khhyl[x];
            for(const z in c1_khhyl){const c1 = c1_khhyl[z];
                for(const y in v_khhyl){const v = v_khhyl[y];const form = ["init","mid","fin"];
                    for(const w in form){
                        const vform = (form[w] != "init" && c0 == "t0")?1:0+(form[w] == "fin" && c1 == "t0")?2:0;
                        const tform = (c1 == "t0" && form[w] == "fin" && ["e","o","v","eold","iold"].includes(v));
                        const name = `S(${form[w]},${c0},${v}${vform},${tform?"t1":c1})`;
                        new Glyph(name,0);
                        if(v!="a"){
                        const formb = v_khhylH[v][w];
                        const vb = (form[w] == "fin" && v == "abig") ? "a" : v;
                        const vform_b = (formb != "init" && c0 == "t0")?1:0+(formb == "fin" && ( ["i","v"].includes(v) || c1 == "t0"))?2:0;
                        const nameb = `S(${formb},${c0},${vb}${vform_b},${tform?"t1":c1})`;
                        new Glyph(nameb,1);
                        }
                    }
                }
            }
            console.log(`done:${c0}`)
        }

        console.log(`done:khhyl`)
        for(const x in c0_san){const c0 = c0_khhyl[x];
             for(const y in v_khhyl){const v = v_khhyl[y];const form = ["init","mid","fin"];
                for(const w in form){
                    const vform = (form[w] != "init" && c0 == "t0")?1:0;
                    if(v == "v"){
                        new Glyph( `S(${form[w]},${c0},${v}${vform},n0);`,0);
                        new Glyph( `S(${form[w]},${c0},${v}${vform},ng0);`,0);
                        new Glyph( `S(${form[w]},${c0},${v}${vform},n0-hd0);`,0);
                    }
                    else new Glyph( `S(${form[w]},${c0},${v}${vform},)`,0);
                    
                    if(v!="a"){
                    const formb = v_khhylH[v][w];
                    const vb = (formb == "fin" && v == "abig") ? "a" : v;
                    const vform_b = (formb != "init" && c0 == "t0")?1:0+(formb == "fin" && ( ["i","v"].includes(v) ))?2:0;
                    if(v == "v"){
                        new Glyph( `S(${formb},${c0},${vb}${vform_b},n0)`,1);
                        new Glyph( `S(${formb},${c0},${vb}${vform_b},ng0)`,1);
                        new Glyph( `S(${formb},${c0},${vb}${vform_b},n0-hd0)`,1);
                    }
                    else new Glyph( `S(${formb},${c0},${vb}${vform_b},)`,1);
                    
                    }
                }
            }
            console.log(`done:${c0}`)
        }
        console.log(`done:!}`)
    }
    static setPreSVG(glypharray,overwrite){
        const table = Database.getTable("PRERENDER_GLYPH");
            for(const d in glypharray){
                const g_ = glypharray[d];
                const datab = GlyphManager.getPreSVG(g_.fullname,g_.vec);
                if(datab.length != 0){
                    console.log("skipped");
                    if(overwrite==null||!overwrite) continue;
                    const l_ = g_.child==null?0:g_.child.length;
                    table.rewriteData({ID:datab[0].ID},{
                        name:g_.name,d:g_.d,
                        fullname:g_.fullname,val:g_.val,form:g_.form,
                        vec:g_.vec,vtop:g_.vtop,
                        vbottom:g_.vbottom,top:g_.top,bottom:g_.bottom,
                        child0:l_>0?g_.child[0].fullname:"",child1:l_>1?g_.child[1].fullname:"",child2:l_>2?g_.child[2].fullname:"",
                        offx0:g_.offset.x,offy0:g_.offset.y,
                        aligx:g_.aligment.x,aligy:g_.aligment.y,type:g_.type
                    });
                    continue;
                }
                const l_ = g_.child==null?-1:g_.child.length;
                table.createData({
                    name:g_.name,d:g_.d,
                    fullname:g_.fullname,val:g_.val,form:g_.form,
                    vec:g_.vec,vtop:g_.vtop,
                    vbottom:g_.vbottom,top:g_.top,bottom:g_.bottom,
                    child0:l_>0?g_.child[0].fullname:"",child1:l_>1?g_.child[1].fullname:"",child2:l_>2?g_.child[2].fullname:"",
                    offx0:g_.offset.x,offy0:g_.offset.y,
                    aligx:g_.aligment.x,aligy:g_.aligment.y,type:g_.type
                });
            }
        }
    static getPreSVG(fullname,vec){
        const ans = [];
        const table = Database.getTable("PRERENDER_GLYPH");
        if(table != null){
            const data = table.getData({fullname:fullname,vec:vec});
            for(let i = 0;i<data.length;i++){
                ans.push(data[i].values);
            }
        }
        return ans;
    }//*/

    static getSVG(name){
        const ans = [];
        const table = Database.getTable("GLYPH");
        if(table != null){
            const data = table.getData({Name:name});
            data.forEach((i) => ans.push(i.getVal("Path")));
        }
        return ans;
    }
}

class GlyphArray{
    constructor(name,vec,iswrap,box,pos,alg){
        this.name=name;
        this.d = "";
        this.childList = [];//Glyphの配列 入れ子にします
        this.attribute = {};//(将来用)
        this.position = {x:pos.x??0,y:pos.y??0};//（parentに対するthisのoffset）
        this.aligment = {x:alg.x??0,y:alg.y??0};
        this.vec = vec; //-1(右から左),0(上から下),1(左から右)
        this.box = box;//{top:0,right:0,bottom:0,left:0};
        this.iswrap = iswrap;// 端で折り返すか？
        this.initSvg();
    }
    initSvg(){
        const r_ = new RegExp_Khhyl("(L())(L())",{}).ParseRegExp().toNormalRegExp();
        const text = this.name.replaceAll(new RegExp(r_, "g"),"$1Sep()$2").replaceAll(new RegExp(r_, "g"),"$1Sep()$2");

        const pSVGData = text.split("Sep()");
        
        pSVGData.forEach((i)=> this.childList.push(new Glyph(i , this.vec)))
    }
    toPath(defaultsize){
        const vec = this.vec;
        const mutli_ = function (n){return n/(vec==0?textdata.WidthV:textdata.Height)}
        // 単に『em_』へと変える
        const textdata = Database.getTable("TEXTDATA").dataList[0].valueList;
        const rescale = function(param,size){
            const s_ = mutli_(size);
            const aa = SVG.toAbsolute(param);

                for(const i of aa){
                    if(i.x!=undefined) i.x*=s_;
                    if(i.y!=undefined) i.y*=s_;
                    if(i.x1!=undefined) i.x1*=s_;
                    if(i.y1!=undefined) i.y1*=s_;
                    if(i.x2!=undefined) i.x2*=s_;
                    if(i.y2!=undefined) i.y2*=s_;
                    if(i.val!=undefined) i.val*=s_;
            }
            console.log(aa);
            return SVG.convertSVG(aa);
        }

        this.d = `M ${this.position.x},${this.position.y}`;
        let x = this.position.x;
        let y = this.position.y;
        const nlist = Database.getTable("PUNCTUATION").getData({"IsNewline":true});
        const nlist_ = nlist.map((i) =>i.getVal("Name"));

        if(this.vec==0){
            let isnewline = true;
            for(let i = 0;i<this.childList.length;i++){
                //m0 -> gap_above , m1 -> gap_below
                let gap_above = 0;let gap_below = 0;

                gap_below += GPOSManager.gpos(this.childList[i].fullname,this.vec,"INEX").y1; // 下方向
                gap_above += GPOSManager.gpos(this.childList[i].fullname,this.vec,"INEX").y0; // 上方向

                
                //上方向
                if(i == 0 ) gap_above += GPOSManager.gpos("Null()"+this.childList[i].fullname,this.vec,"EX").y1;
                else gap_above += GPOSManager.gpos(this.childList[i-1].fullname+this.childList[i].fullname,this.vec,"EX").y1;

                // AB A(下方向)
                if(i != this.childList.length-1) gap_below += GPOSManager.gpos(this.childList[i].fullname+this.childList[i+1].fullname,this.vec,"EX").y0;
                else gap_below += GPOSManager.gpos(this.childList[i].fullname+"Null()",this.vec,"EX").y0;

                y += gap_above*mutli_(defaultsize);

                const j_ = (this.childList[i].type == "P")||(this.childList[i].form == "sol")
                const d = rescale(this.childList[i].toPathB(!j_?-gap_above:(0),gap_below),defaultsize); //16はsize
                if(isnewline){
                    y -= (SVG.getTop(this.childList[i].toPathB(0,0))-gap_above)*mutli_(defaultsize);
                    isnewline = false;
                }
                this.d += `M ${x},${y} `;this.d += SVG.convertSVG(d);
                y += (SVG.getBottom(this.childList[i].toPathB(0,0))+gap_below)*mutli_(defaultsize);
                if(i+1 != this.childList.length){const d2 = rescale(this.childList[i+1].d,defaultsize);y -= SVG.getTop(d2);}
                
                this.childList[i].offset = {x,y};
                if(nlist_.includes(this.childList[i].name)){
                    x -= defaultsize;y = 0;isnewline = true;
                }
            }
            this.d += `M ${x},${y} `;
        }
        else{
            for(let i = 0;i<this.childList.length;i++){
                const h = textdata.Height;
                const d_new = rescale(this.childList[i].toPathAbs(h,0.5+GPOSManager.gpos(this.childList[i].fullname,this.vec,"INEX").y1/textdata.Height),defaultsize);

                const x_abs = defaultsize*textdata.WidthV/textdata.Height;
                const x_rel = -SVG.getLeft(d_new)+SVG.getRight(d_new)+defaultsize*textdata.WidthV/textdata.Height;

                x += (!textdata.isWidthHRel ? x_abs/2 : x_rel/2);
                this.d += `M ${x},${y} `;this.d += SVG.convertSVG(d_new);
               

                if(i!=this.childList.length-1)x += (!textdata.isWidthHRel ? x_abs/2 : x_rel/2);//size
                this.childList[i].offset = {x,y};
                if(nlist_.includes(this.childList[i].name)){
                    x = 0;y += defaultsize*((textdata.Height+textdata.TopGapH)/textdata.Height);
                }
            }
            this.d += `M ${x},${y} `;
        }
        return this.d;
    }

}

class Glyph{
    constructor(name,vec){ //flag_recは再帰処理判定用
        this.vec = vec;
        this.fullname = name; 
        this.name = ""; 
        this.d = "";
        this.val = -1;
        this.form = "";
        this.isroot = false;
        this.parent;
        this.childList = [];//Glyphの配列 入れ子にします
        this.attribute = {};//(将来用)
        this.size = 16;
        this.type = "";//S,P,C,Vのいずれか
        this.offset = {x:0,y:0};//（parentに対するthisのoffset）
        this.gap ={top:0,middle:0,bottom:0}; //上棒、中央、下棒
        this.aligment = {x:0,y:0};
        this.height = {vtop:0,vbottom:0,top:0,bottom:0};
        this.initSvg(name);
        this.toPath();
    }
    initSvg(name){
        /*const preGLYPH_ = GlyphManager.getPreSVG(name,this.vec);

        if(preGLYPH_.length!=0){
        
            const pr_ = preGLYPH_[0];
            this.d=pr_.d;this.name=pr_.name;
            this.fullname=pr_.fullname;this.val=pr_.val;
            this.vec=pr_.vec;
            this.vtop=pr_.vtop;this.vbottom=pr_.vbottom;
            this.top=pr_.top;this.bottom=pr_.bottom;
            this.offset={x:pr_.offx0,y:pr_.offy0};
            this.aligment={x:pr_.aligx,y:pr_.aligy};
            this.type = pr_.type;
            if(pr_.child0 != "") this.child.push(new Glyph(pr_.child0,this.vec))
            if(pr_.child1 != "") this.child.push(new Glyph(pr_.child1,this.vec))
            if(pr_.child2 != "") this.child.push(new Glyph(pr_.child2,this.vec))
            
        return null;
        }//*/
        //console.log(name);
        const partname = this.partitionName(name);
        //console.log(partname);
        if(partname.length == 0){this.isroot = true;
            if(name == null|| name == ""){this.d = [] ,this.aligment = {x:0,y:0};return [];}
            const form = this.form ?? "";
            const name_ = `${this.name}_${form}_${this.val}`
            const dt = (GlyphManager.getSVG(name_)[0]) ?? "M 0,0";
            this.d = SVG.toRelative(dt);//this.nameがこれ以上分割できない場合。
            
            let offx = 0;let offy = 0;
            if(LetterManager.getLetter(this.name).length > 0){offx = LetterManager.getLetter(this.name)[0].getVal("x_Align");offy = LetterManager.getLetter(this.name)[0].getVal("y_Align");}
            this.aligment = {x:(offx),y:(offy)};
        }
        else{//分割できたら
            this.isroot = false;
            let x0 = 0;let y0 = 0;
            let x1;let y1;
            if(this.type == "S"){
                const k = GPOSManager.gpos(name,this.vec,"IN");
                x0 = k.x0;y0 = k.y0;x1 = k.x1;y1 = k.y1;
            }
            else{
                const k = GPOSManager.gpos(name,this.vec,"DIAC");
                x0 = k.x0;y0 = k.y0;
            }
            for(let i = 0 ; i<partname.length;i++){
                const new_glyph = new Glyph(partname[i],this.vec);
                new_glyph.parent = this;
                if(x1 != null && y1 != null && i == 2)new_glyph.offset = {x:x1,y:y1};
                else if(x1 != null && y1 != null && i == 0) new_glyph.offset = {x:x0,y:y0};
                else if(x1 == null && y1 == null && i == 1) new_glyph.offset = {x:x0,y:y0};
                this.childList.push(new_glyph);
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
            const onset = temp[1] == "" ? "" : `C(onset,${temp[1]})`;
            const vowel = temp[2] == "" ? "" : `V(${temp[0]},${temp[2]})`;
            const coda = temp[3] == "" ? "" : `C(coda,${temp[3]})`;
            return [onset,vowel,coda];
            }
            else if(name.startsWith("P")){
                const temp = name.split("(")[1].split(")")[0].split(",")[0];
                this.glyphname = name.split("(")[1].split(")")[0];
                const temp2 = temp.split("-");
            if(temp2.length <= 1){this.name = temp2[0].split(/\d+/g)[0];this.val = temp2[0].split(/[A-Za-z]+/g)[1]; return []}//これ以上は分割できない
            else{
                let d_ = "";
                for(let i = 0;i<temp2.length;i++){
                 d_ += temp2[i]+(i==temp2.length-1?"":"-");
                }
            const d = [ `${name.split("(")[0]}(${d_}),Pd(${temp2.slice(-1)})`];
            return d;
            }
        }
        else{
            const temp = name.split("(")[1].split(")")[0].split(",");
            this.glyphname = temp.slice(1).join(",");
            this.form = temp[0];
            const temp2 = temp[1].split("-");
                if(temp2.length <= 1){this.name = temp2[0].split(/\d+/g)[0];this.val = temp2[0].split(/[A-Za-z]+/g)[1]; return []}//これ以上は分割できない
                else{
                    const l = name.split("(")[0];
                    let d_ = "";
                    for(let i = 0;i<temp2.length-1;i++)d_ += temp2[i]+(i==temp2.length-2?"":"-");
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
        let path = this.toPath() ?? SVG.createM(0,0); 
        if(path.length == 0) path = SVG.createM(0,0); 
        const width = Database.getTable("TEXTDATA").dataList[0].getVal("Thickness");
        const VH = vowelhratio*height
        const vt = (this.height.vbottom-this.height.vtop)/2;
        const vt_b = (-this.height.bottom-this.height.top)/2;
        if(this.type == "S"){
            switch(this.form){
                case "sol":
                    path = SVG.toRelative(path);
                    path = SVG.createGap(path,0,VH-vt);
                    path = SVG.toRelative(path);
                break;
                case "init":
                //initはM 0,0
                //vbottom~heightの棒
                    path = SVG.toRelative(path);
                    path = SVG.createGap(path,0,0);
                    path = path.concat(SVG.createSkewer(-width/2,this.height.vbottom,width/2,height));
                    path = SVG.toRelative(path);
                    this.gap = {top:0,middle:this.height.vbottom,bottom:height};
                break;
                case "mid":
                    path = SVG.toRelative(path);
                    path = SVG.createGap(path,0,VH+vt_b-vt);
                    path = path.concat(SVG.createSkewer(-width/2,VH+vt_b+this.height.vtop,width/2,height)).concat(SVG.createSkewer(-width/2,this.height.vbottom,width/2,VH+vt_b-vt));
                    path = SVG.toRelative(path);
                    this.gap = {top:VH+vt_b-vt,middle:VH+vt_b-vt,bottom:height};
        //(midのみ)0~vowelhratio*height-(vbottom-vheight)/2の棒
        //M 0,(vowelhratio*height+(vbottom-vheight)/2) 
        //(midのみ)vowelhratio*height+(vbottom-vheight)/2~heightの棒
                break;
                case "fin":
        //finはM 0,height-(bottom-top)
        //0~max(vbottom,vtop)の棒
                    path = SVG.toRelative(path);
                    path = SVG.createGap(path,0,height-(this.height.bottom-this.height.vtop));
                    path = path.concat(SVG.createSkewer(-width/2,0,width/2,height-(this.height.bottom-this.height.vtop)));
                    path = SVG.toRelative(path);
                    this.gap = {top:0,middle:height-(this.height.bottom-this.height.vtop),bottom:0};
                break;
                }   
        } else{
        path = SVG.toRelative(path);
        path = SVG.createGap(path,0,VH+vt);
        path = SVG.toRelative(path);
        this.gap = {top:VH-vt,middle:VH,bottom:VH+vt};
        }
    return path;
    }
    toPathB(top,bottom){
        let path = this.toPath() ?? SVG.createM(0,0); 
        if(path.length == 0)path = SVG.createM(0,0); 
        const width = Database.getTable("TEXTDATA").dataList[0].getVal("Thickness");
        if(this.type == "S"){
            const v = this.childList[1].glyphname.split(/\d+/g)[0];
            const v_null = Database.getTable("VOWEL").getData({Name:v})[0].getVal("isNullVowel");
        if(v_null){
            const stick = SVG.createSkewer(-width/2,top+this.height.top,width/2,this.height.vtop).concat(SVG.createSkewer(-width/2,this.height.vbottom,width/2,bottom+this.height.bottom));
            switch(this.form){
                case "sol":
                    path = SVG.toRelative(path);
                    path = SVG.createGap(path);
                    path = path.concat(SVG.createM(0,bottom+this.height.bottom));
                    path = SVG.toRelative(path);
                    path = SVG.createGap(path,0,top+this.height.top);
                    path = SVG.toRelative(path);
                break;
                case "init":case "mid":case "fin":
                    path = SVG.toRelative(path);
                    path = SVG.createGap(path,0,0).concat(stick);
                    path = SVG.toRelative(path);
                    break;
            }
        }
        else {
            switch(this.form){
                case "sol":
                    path = SVG.toRelative(path);
                    path = path.concat(SVG.createM(0,bottom+this.height.bottom));
                    path = SVG.toRelative(path);
                    path = SVG.createGap(path,0,top+this.height.top);
                    path = SVG.toRelative(path);
                break;
                case "init":
                    path = SVG.toRelative(path);
                    path = SVG.createGap(path,0,top);
                    path = path.concat(SVG.createSkewer(-width/2,top+this.height.vbottom,width/2,bottom+this.height.bottom));
                    path = SVG.toRelative(path);
                break;
                case "mid":
                    path = SVG.toRelative(path);
                    path = SVG.createGap(path,0,0);
                    path = path.concat(SVG.createSkewer(-width/2,top+this.height.top,width/2,this.height.vtop));
                    path = path.concat(SVG.createSkewer(-width/2,this.height.vbottom,width/2,bottom+this.height.bottom));
                    path = SVG.toRelative(path);
                break;
                case "fin":
                    path = SVG.toRelative(path);
                    path = SVG.createGap(path,0,0);
                    path = path.concat(SVG.createSkewer(-width/2,top+this.height.top,width/2,this.height.vtop + (v_null? bottom: 0)));
                    path = SVG.toRelative(path);
                break;
                }
            }
        }        
        else{
            path = path.concat(SVG.createM(0,bottom+this.height.bottom));
            path = SVG.createGap(path,0,top+this.height.top);
            path = SVG.toRelative(path);
        }
        this.gap = {top:top,middle:0,bottom:bottom};
        return path;
    }
    toPath(){//Svgをpathにする。再帰的に。
        let ans = [];
        if(this.type == "S"){
            const c0 = this.childList[0].toPath();
            const v = this.childList[1].toPath();
            const c1 = this.childList[2].toPath();
            const offs = this.getoffset(this.childList[1],true,true)
            const off0 = offs[0];//this.childList[0].name_b.glyphname == null ? {x:0,y:0} :this.childList[0].getoffset(v,true);//parentd
            const off1 = offs[1];//this.childList[2].name_b.glyphname == null ? {x:0,y:0} :this.childList[2].getoffset(v,true);
            ans = SVG.Domerge3(v,c0,c1,0,off0.y,0,off1.y);
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
            while(p.childList.length != 0) p = p.childList[0];
                ans = p.d;
                const dir_ = {onset:1,coda:-1,sol:1,init:1,mid:1,fin:1};
            while(p.parent != null && p.parent.type != "S"){
                const dir  = p.type.startsWith("C") ? dir_[p.form] : 1;
                const off = p.parent.getoffset("",false,true);
                const child_d = p.parent.childList[1].d;
                const off_childx = dir*(SVG.getRight(child_d)+SVG.getLeft(child_d))/2;
                const off_childy = (SVG.getTop(child_d)-SVG.getBottom(child_d)/2);
                ans = SVG.Domerge2(ans,child_d,off.x+off_childx,off.y+off_childy);
                ans = SVG.toRelative(ans);
                p = p.parent;p.d = ans;
            }
        }
        return ans ?? SVG.createM(0,0);
    }
    getoffset(){
        //V-Vd部分のみ動作未検証
        if(this.type == "S"){
            const v = this.childList[1].glyphname.split(/\d+/g)[0];
            const v_null = Database.getTable("VOWEL").getData({Name:v})[0].getVal("isNullVowel");
            const c0offset = this.childList.length>0?this.childList[0].offset:{x:0,y:0};
            const c2offset = this.childList.length>2?this.childList[2].offset:{x:0,y:0};
            const c0d = this.childList.length>0?this.childList[0].d:null;
            const c1d = this.childList[1].d;
            const c2d = this.childList.length>2?this.childList[2].d:null;
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
                        return [{x:c0offset.x,y:SVG.getTop(c1d)-SVG.getBottom(c0d ?? "M 0,0")+c0offset.y},{x:c2offset.x,y:SVG.getBottom(c1d)+SVG.getTop(c2d ?? "M 0,0")+c2offset.y}];
                    case "fin":
                        return [{x:c0offset.x,y:SVG.getTop(c1d)-bottomgap+c0offset.y},{x:c2offset.x,y:SVG.getTop(c1d)-bottomgap+c2offset.y}];
                }
            }
        }
        else{
            if(this.childList.length < 1) return {x:0,y:0};
            const parentd = this.childList[0].d
            const off1 = this.childList[1].offset;
            const alig1 = this.childList[1].aligment;
             if(this.type.startsWith("C")){
                const dir_ = {onset:1,coda:-1};
                const dir = dir_[this.form];
                const x =  (SVG.getLeft(parentd)*(1-alig1.x*dir)/2+SVG.getRight(parentd) *(1+alig1.x*dir)/2)+off1.x*dir;
                const y =  (SVG.getTop(parentd)*(1-alig1.y)/2+SVG.getBottom(parentd) *(1+alig1.y)/2)+off1.y;
                return{x:x,y:y};
            } else{
                const x =  (SVG.getLeft(parentd)*(1-alig1.x)/2+SVG.getRight(parentd)*(1+alig1.x)/2)+off1.x;
                const y =  (SVG.getTop(parentd)*(1-alig1.y)/2+SVG.getBottom(parentd)*(1+alig1.y)/2)+off1.y;
                return{x:x,y:y};
            }
        }
        return {x:0,y:0};
    }
}

export {Glyph,GlyphArray,GlyphManager};