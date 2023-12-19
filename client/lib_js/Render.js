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
        //const textdata = Thaqqa_DB.getTable("TEXTDATA").data[0].values;
        if(alig==0){
            for(let i = 0;i<pSVGData.length;i++){
                console.log(SVGData[i]);
                let m = 0;
                if(i+1 != pSVGData.length) m = GPOSManager.gpos(pSVGData[i]+pSVGData[i+1],alig,"EX").y0;
                ans += SVGData[i].toPathB(0,m);
                y += SVG.getBottom(SVGData[i].d)+m;
                if(i+1 != pSVGData.length) y -= SVG.getTop(SVGData[i+1].d);
                ans += "M 0,"+y+ " ";
            }
        }
        else{
            for(let i = 0;i<pSVGData.length-1;i++){
                let topgap = {init:0,mid:(100-k0[2])/2,fin:100-k0[2],sol:(100-k0[2])/2};
            }
        }

        return ans;
    }
}

export {Render}