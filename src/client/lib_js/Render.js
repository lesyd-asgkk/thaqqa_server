import { SVG,RegExp_Khhyl, Parser , GSUBManager , Glyph ,GlyphArray, GPOSManager ,Thaqqa_DB } from "./deps.js";

class Render{
    //returns d
    static DrawD(text,lang,alig,option,size){
        switch(option){
            case "parsed":
                text = GSUBManager.gsub(text,alig);
                break;
            default:
                text = Parser.parse(text,lang);
                console.log(text);
                text = GSUBManager.gsub(text,alig);
                console.log(text);
            break;
        }
        let glar = new GlyphArray(text,800,0,0,0,0,alig);
        console.log(size);
        let ans = glar.toPath(size);
        return ans;
    }
}

export {Render}