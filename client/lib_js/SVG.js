export default class SVG {

    static convertSVG(param){
        //console.log(param);
        return Snap.path.toRelative(param).toString().toLowerCase();
        //return SVG.toStr(SVG.roundAll(SVG.toRel(SVG.ParseD(param))));
    }

    static getBottom(param) {
        return Snap.path.getBBox(param).y2;
    }
    static getTop(param) {
        return Snap.path.getBBox(param).y;
    }
    static getRight(param) {
        return Snap.path.getBBox(param).x2;
    }
    static getLeft(param) {
        return Snap.path.getBBox(param).x;
    }
    static setSkewer(x0,y0,x1,y1){
        return " M "+(x0)+","+(y0)+ " V "+(y1)+ " H " + x1 + " V "+(y0) + " H " + (x0) + " M "+(0)+","+(y0);
    }
    static merge2 = function(d0,d1,x,y){ //d0とd1を合成。d1の始点はx,y
        return d0+" M "+x+","+y+" "+d1;
    }
    static merge3 = function(d0,d1,d2,x,y,x1,y1){ //d0とd1とd2を合成。
        //d1の始点はx,y d2の始点はx1,y1
        return d0+" M "+x+","+y+" "+d1+" M "+x1+","+y1+" "+d2;
    }
}

export {SVG}