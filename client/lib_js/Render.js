import { RegExp_Khhyl, Parser , GSUBManager , Glyph , GPOSManager } from "./deps.js";

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
        return SVGData;
    }
}

export {Render}