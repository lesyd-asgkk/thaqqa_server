import { SVG,RegExp_Khhyl, Parser , GSUBManager , Glyph , GPOSManager ,Thaqqa_DB } from "./deps.js";

class Render{
    //returns d
    static DrawD(text,lang,alig,option){
        switch(option){
            case "parsed":
                text = GSUBManager.gsub(text,alig);
                break;
            default:
                text = GSUBManager.gsub(Parser.parse(text,lang),alig);
            break;
        }
        for(let _i = 0;_i<2;_i++){
            let r = new RegExp_Khhyl("(L())(L())",{});
            r = r.ParseRegExp()
            const r_ = r.toNormalRegExp();
            const r_fin = new RegExp(r_, "g");
            text = text.replaceAll(r_fin,"$1Q()$2");
        }
        const pSVGData = text.split("Q()");
        const SVGData = [];
        for(let i = 0;i<pSVGData.length;i++){
            SVGData.push(new Glyph(pSVGData[i]));
        }
        let ans = "";

        let x = 0;
        let y = 0;
        const textdata = Thaqqa_DB.getTable("TEXTDATA").data[0].values;
        if(alig==0){
            for(let i = 0;i<pSVGData.length;i++){

                let form = "sol"
                if(this.name.startsWith("S")) form = this.name.split(",")[0].split("S(")[1];
                

                let m = 0;
                if(i+1 != pSVGData.length) m = GPOSManager.gpos(pSVGData[i]+pSVGData[i+1],0,"EX").y0;
                ans += SVGData[i].toPathB(0,(form=="init"||form=="mid")?m:0);
                y += SVG.getBottom(SVGData[i].d)+m;
                if(i+1 != pSVGData.length) y -= SVG.getTop(SVGData[i+1].d);
                console.log("M = " + m);
                console.log("Y = " + y);
                ans += "M 0,"+y+ " ";
            }
        }
        else{
            for(let i = 0;i<pSVGData.length;i++){
                const h = textdata.Height;
                //const topgap = {init:0,mid:b/2,fin:textdata.Height+vh,sol:b/2};
                ans += SVGData[i].toPathAbs(h,0.5);

                x += textdata.Width;
                ans += "M "+x+ ",0 ";
            }
        }
        const aa = Snap.parsePathString(Snap.path.toAbsolute(ans));
        for(let i = 0;i<aa.length;i++){
            for(let j = 1;j<aa[i].length;j++){
                aa[i][j] *= 16/(alig==0?textdata.Width:textdata.Height);
            }
        }
        ans = Snap.path.toRelative(aa).toString().toLowerCase();
        return ans;
    }
}

export {Render}