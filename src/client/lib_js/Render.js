import { Parser , GSUBManager ,GlyphArray } from "./deps.js";

class Render{
    //returns d
    static DrawD(text,lang,alig,option,size,pos){
        switch(option){
            case "parsedplus":
                break;
            case "parsed":
                text = GSUBManager.gsub(text,alig);
                break;
            default:
                text = Parser.parse(text,lang);
                text = GSUBManager.gsub(text,alig);
            break;
        }
        if(pos == null) pos = {x:0,y:0};
        const glar = new GlyphArray(text,800,pos.x,pos.y,0,0,alig);
        const ans = glar.toPath(size);
        return ans;
    }
}

export {Render}