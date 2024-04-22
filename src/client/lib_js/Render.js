import { Parser , GSUBManager ,GlyphArray,SVG} from "./deps.js";

class Render{
    //text:string型
    //lang:0,1の2択
    //alig:-1,0,1の3択
    //option:設定とか
    //size:初期サイズ。普通は16
    //pos:表示位置。

    //text , lang,alig,{option:,size:,pos:,...}とかの形にしたほうが良さそう
    static DrawD(text,size,lang,alig,option,position){
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
        if(position == null) position = {posx:0,posy:0,aligx:-1,aligy:-1};
        console.log(text);
        const glar = new GlyphArray(text,alig,false,{top:800,right:800,bottom:800,left:800},{x:position.posx,y:position.posy},{x:position.aligx,y:position.aligy});
        const ans = SVG.convertSVG(glar.toPath(size));
        return ans;
    }
}

export {Render}