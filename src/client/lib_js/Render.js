import { Parser , GSUBManager ,GlyphArray } from "./deps.js";

class Render{
    //text:string型
    //lang:0,1の2択
    //alig:-1,0,1の3択
    //option:設定とか
    //size:初期サイズ。普通は16
    //pos:表示位置。
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