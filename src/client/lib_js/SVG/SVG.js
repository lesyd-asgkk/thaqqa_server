
class Point {
    constructor(type,x,y,x1,y1,x2,y2,val) {
      this.type = type;
      this.x = this.setPos(x);this.y = this.setPos(y);
      this.x1 = this.setPos(x1);this.y1 = this.setPos(y1);
      this.x2 = this.setPos(x2);this.y2 = this.setPos(y2);
      this.val = this.setPos(val);this.digit = 8;
    }
    setPos(val){
      return val != undefined ? Number(val) : undefined;
    }
    roundAll() {
      this.x = this.roundN(this.x);this.y = this.roundN(this.y);
      this.x1 = this.roundN(this.x1);this.y1 = this.roundN(this.y1);
      this.x2 = this.roundN(this.x2);this.y2 = this.roundN(this.y2);
    }
  
    roundN(val, n) { //現在機能なし
      n = n != undefined ? n : this.digit;
      return val ;//!= undefined ? Math.round(val * (10 ^ n)) / (10 ^ n) : undefined;
    }
  }
  
class SVG {
    static toStr(param) {
      let type;
      let answer = "";

      let j = 0;
      for (let i = 0; i<param.length-1;i++) {
        if(param[i+j].type == "m" && param[i+1].type == "m"){
          param[i+j].x += param[i+1].x;param[i+j].y += param[i+1].y;
          param[i+1] = new Point("n", 0, 0); //空にする
          j--;
        }
        else if(param[i+j].type == "M" && param[i+1].type == "M"){
          param[i+j].x += param[i+1].x;param[i+j].y += param[i+1].y;
          param[i+1] = new Point("n", 0, 0); //空にする
          j--;
        }
        else j = 0;
      }

      param = param.filter((i) => (i.type!="n"));
      /*
      const eps = 1e-8;
      const f_abs = function(i_){let ans = 0;i_.forEach(j => ans+=j*j);return ans;}
      param = param.filter((i) => (i.type!="m" || !(f_abs([i.x,i.y]) < eps) ));
      param = param.filter((i) => (i.type!="l" || !(f_abs([i.x,i.y]) < eps) ));
      param = param.filter((i) => (i.type!="h" || !(Math.abs(i.x) < eps )));
      param = param.filter((i) => (i.type!="v" || !(Math.abs(i.y) < eps )));
      param = param.filter((i) => (i.type!="c" || !(f_abs([i.x,i.y]) < eps && f_abs([i.x1,i.y1]) < eps && f_abs([i.x2,i.y2]) < eps )));
      */
      for (const p of param) {
        type = p.type;
        switch (type) {
          case "v": answer += `v${p.y} `; break;
          case "h": answer += `h${p.x} `; break;
          case "l": answer += `l${p.x},${p.y} `; break;
          case "m": answer += `m${p.x},${p.y} `; break;
          case "s": answer += `s${p.x2},${p.y2} ${p.x},${p.y} `; break;
          case "c": answer += `c${p.x1},${p.y1} ${p.x2},${p.y2} ${p.x},${p.y} `;break;
          case "t": answer += `t${p.x},${p.y} `; break;
          case "q": answer += `q${p.x1},${p.y1} ${p.x},${p.y} `; break;
          case "a": answer += `a${p.x1},${p.y1},${p.x2},${p.y2},${p.val},${p.x},${p.y} `; break;
          case "z":case "Z":answer += "z"; break;
        }
      }
      return answer;
    }
    static roundAll(param) {
      /*for (const p of param) {
        p.roundAll();
      }*/
      return param;
    }
    static convertSVG(param) {
        return SVG.toStr( SVG.toRelative(param));
      }
    static toRelative(param) {
        if(typeof param == "string") return SVG.AbbervM(SVG.toRel(SVG.roundAll(SVG.ParseD(param))).d);
        else return SVG.AbbervM(SVG.toRel(SVG.roundAll(param)).d);
    }
    static toAbsolute(param) {
        if(typeof param == "string") return SVG.AbbervM(SVG.toAbs(SVG.roundAll(SVG.ParseD(param))).d);
        else return SVG.AbbervM(SVG.toAbs(SVG.roundAll(param)).d);
    }
    static getLeft(param) {
      //console.log(SVG.toRel(SVG.roundAll(SVG.ParseD(param))).left)
      if(typeof param == "string") return SVG.toRel(SVG.roundAll(SVG.ParseD(param))).left;
      else return SVG.toRel(SVG.roundAll(param)).left;
      //SVG.ParseDを省く
    }
    static getRight(param) {
      //console.log(SVG.toRel(SVG.roundAll(SVG.ParseD(param))).right)
      if(typeof param == "string") return SVG.toRel(SVG.roundAll(SVG.ParseD(param))).right;
      else return SVG.toRel(SVG.roundAll(param)).right;
    }
    static getTop(param) {
      //console.log(SVG.toRel(SVG.roundAll(SVG.ParseD(param))).top)
      if(typeof param == "string") return SVG.toRel(SVG.roundAll(SVG.ParseD(param))).top;
      else return SVG.toRel(SVG.roundAll(param)).top;
    }
    static getBottom(param) {
      //console.log(SVG.toRel(SVG.roundAll(SVG.ParseD(param))).bottom)
      if(typeof param == "string") return SVG.toRel(SVG.roundAll(SVG.ParseD(param))).bottom;
      else return SVG.toRel(SVG.roundAll(param)).bottom;
    }
  
    static createSkewer(x0,y0,x1,y1){
      if(x1<x0 || y1<y0) return [];
        return SVG.roundAll(SVG.ParseD(` M ${x0},${y0} V ${y1} H ${x1} V ${y0} H ${x0} M 0,${y0}`));
    }

    static createM(x0,y0){
        const M = SVG.roundAll(SVG.ParseD(`M ${x0},${y0}`));
        return M;}
    static createGap(d0,x0,y0){
        const M = SVG.roundAll(SVG.ParseD(`M ${x0},${y0}`));
        return M.concat(d0);
    }
    static Domerge2(d0,d1,x0, y0){
        const M = SVG.roundAll(SVG.ParseD(`M ${x0},${y0}`));
        return d0.concat(M).concat(d1);
    }

    static Domerge3(d0,d1,d2,x0,y0,x1,y1){
        const M = SVG.roundAll(SVG.ParseD(`M ${x0},${y0}`));
        const M1 = SVG.roundAll(SVG.ParseD(`M ${x1},${y1}`));
        return d0.concat(M).concat(d1).concat(M1).concat(d2);
    }

    static AbbervM(param){return param}
    static toAbs(param) {
        const answer = [];
        let q;
        let type;
        const abspos = new Point("n", 0, 0);
        let left = Infinity;
        let top = Infinity;
        let right = -Infinity;
        let bottom = -Infinity;
        const absposb = new Point("n", undefined, undefined);
        for (const p of param) {
          type = p.type;
          switch (type) {
            case "M":
              q = p;
              if (typeof p.x == "number") absposb.x = p.x;
              if (typeof p.y == "number") abspos.y = p.y;
              absposb.x = abspos.x;absposb.y = abspos.y;
              break;
            case "L":
            case "V":
            case "H":
            case "C":
            case "S":
            case "Q":
            case "A":
            case "T":
              q = p;
              if (typeof p.x == "number") abspos.x = p.x;
              if (typeof p.y == "number") abspos.y = p.y;
              break;
            case "m":
              q = new Point("M", p.x + abspos.x, p.y + abspos.y);
              abspos.x += p.x;abspos.y += p.y;
              absposb.x = abspos.x;absposb.y = abspos.y;
              break;
            case "v":
              q = new Point("V", undefined, p.y + abspos.y);
              abspos.y += p.y;
              break;
            case "h":
              q = new Point("H", p.x + abspos.x, undefined);
              abspos.x += p.x;
              break;
            case "a":
              q = new Point("A",
              p.x - abspos.x,p.y + abspos.y,p.x1,p.y1,p.x2,p.y2,p.val);
              abspos.x += p.x;abspos.y += p.y;
              break;
            case "l":
              q = new Point("L", p.x + abspos.x, p.y + abspos.y);
              abspos.x += p.x;abspos.y += p.y;
              break;
            case "c":
              q = new Point("C",
                p.x + abspos.x,p.y + abspos.y,
                p.x1 + abspos.x,p.y1 + abspos.y,
                p.x2 + abspos.x,p.y2 + abspos.y,
                );
              abspos.x += p.x;abspos.y += p.y;
              break;
            case "s":
              q = new Point("S",
                p.x + abspos.x,p.y + abspos.y,
                undefined,undefined,
                p.x2 + abspos.x,p.y2 + abspos.y,
              );
              abspos.x += p.x;abspos.y += p.y;
              break;
            case "q":
              q = new Point("Q",
                p.x + abspos.x,p.y + abspos.y,
                p.x1 + abspos.x,p.y1 + abspos.y,
              );
              abspos.x += p.x;abspos.y += p.y;
              break;
            case "t":
              q = new Point("T",
                p.x + abspos.x,p.y + abspos.y,
                undefined,undefined
              );
              abspos.x += p.x;abspos.y += p.y;
              break;
            case "z":
            case "Z":
              q = p;
              abspos.x = absposb.x;abspos.y = absposb.y;
              absposb.x = undefined;absposb.y = undefined;
              break;
          }
          if (q == undefined) throw Error();
          answer.push(q);
          if (abspos.x != null) {left = Math.min(left, abspos.x);right = Math.max(right, abspos.x);}
          if (abspos.y != null) {top = Math.min(top, abspos.y); bottom = Math.max(bottom, abspos.y);}
        }
  
        if(left == Infinity) left = 0;if(top == Infinity) top = 0;
        if(right == -Infinity) right = 0;if(bottom == -Infinity) bottom = 0;
        return { d: answer, top: top, left: left, right: right, bottom: bottom };
      }
    static toRel(param) {
      const answer = [];
      let q;
      let type;
      const abspos = new Point("n", 0, 0);
      let left = Infinity;
      let top = Infinity;
      let right = -Infinity;
      let bottom = -Infinity;
      const absposb = new Point("n", undefined, undefined);
      for (const p of param) {
        type = p.type;
        switch (type) {
          case "m":
            q = p;
            if (typeof p.x == "number") abspos.x += p.x;
            if (typeof p.y == "number") abspos.y += p.y;
            absposb.x = abspos.x;absposb.y = abspos.y;
            break;
          case "l":case "v":case "h":
          case "c":case "s":
          case "q":case "t":
          case "a":
            q = p;
            if (typeof p.x == "number") abspos.x += p.x;
            if (typeof p.y == "number") abspos.y += p.y;
            break;
          case "M":
            q = new Point("m", p.x - abspos.x, p.y - abspos.y);
            abspos.x = p.x;abspos.y = p.y;
            absposb.x = abspos.x;absposb.y = abspos.y;
            break;
          case "V":
            q = new Point("v", undefined, p.y - abspos.y);
            abspos.y = p.y;
            break;
          case "H":
            q = new Point("h", p.x - abspos.x, undefined);
            abspos.x = p.x;
            break;
          case "A":
            q = new Point("a",
            p.x - abspos.x,p.y - abspos.y,p.x1,p.y1,p.x2,p.y2,p.val);
            abspos.x = p.x;abspos.y = p.y;
            break;
          case "L":
            q = new Point("l", p.x - abspos.x, p.y - abspos.y);
            abspos.x = p.x;abspos.y = p.y;
            break;
          case "C":
            q = new Point("c",
            p.x - abspos.x,p.y - abspos.y,
            p.x1 - abspos.x,p.y1 - abspos.y,
            p.x2 - abspos.x,p.y2 - abspos.y
            );
            abspos.x = p.x;abspos.y = p.y;
            break;
          case "S":
              q = new Point(
                "s",
                p.x - abspos.x,p.y - abspos.y,
                undefined,undefined,
                p.x2 - abspos.x,p.y2 - abspos.y
              );
            abspos.x = p.x;
            abspos.y = p.y;
            break;
          case "Q":
              q = new Point(
                "q",
                p.x - abspos.x,p.y - abspos.y,
                p.x1 - abspos.x,p.y1 - abspos.y
              );
            abspos.x = p.x;
            abspos.y = p.y;
            break;
          case "T":
              q = new Point(
                "t",
                p.x - abspos.x,p.y - abspos.y,
                undefined,undefined
              );
            abspos.x = p.x;
            abspos.y = p.y;
            break;
          case "z":
          case "Z":
            q = p;
            abspos.x = absposb.x;abspos.y = absposb.y;
            absposb.x = undefined;absposb.y = undefined;
            break;
        }
        if (q == undefined) throw Error();
        answer.push(q);

        if (abspos.x != undefined) {left = Math.min(left, abspos.x);right = Math.max(right, abspos.x);}
        if (abspos.y != undefined) {top = Math.min(top, abspos.y); bottom = Math.max(bottom, abspos.y);}
      }
      
      if(left == Infinity) left = 0;if(top == Infinity) top = 0;
      if(right == -Infinity) right = 0;if(bottom == -Infinity) bottom = 0;
      return { d: answer, top: top, left: left, right: right, bottom: bottom };
    }
    //string型
    static ParseD(str) {
      const str_proto= str;
      //const regf = function(reg,reg2,loop,flag){return RegExp( new Array(loop).fill(reg.source).join(reg2.source),flag);}
      
      const str_b = str.split(/([A-Za-z])/g).join(" ").split(/(?: |,)/g).filter((x) => ![" ",""].includes(x));
      str = "";
      const answer = [];
      //const REGn = /-?\d+(\.\d+)?(e-?\d+)?/g; //数字判定 (\d|\.|e|-)+ -> -?\d+(\.\d+)?(e-?\d+)?
      let precommand = "";
      let i = 0;
      while (i < str_b.length) {
        if ([" ",""].includes(str_b[i])) {
          i++;
        }
        else{switch(str_b[i]){
          case "Z": case "z": case "A":case "a": case "C": case "c":
          case "Q": case "q": case "S": case "s": case "M": case "m":
          case "L": case "l": case "H": case "h": case "V": case "v":
            precommand = str_b[i];
            i++;
            break;
          default:break;
          }
          switch(precommand){
            case "Z": case "z": 
              answer.push(new Point(precommand));
              precommand = "";
            break;
            case "A":case "a":
              answer.push(new Point(precommand,str_b[i+5],str_b[i+6],str_b[i],str_b[i+1],str_b[i+2],str_b[i+3],str_b[i+4]));
              i+=7;
            break;
            case "C": case "c":
              answer.push(new Point(precommand,str_b[i+4],str_b[i+5],str_b[i],str_b[i+1],str_b[i+2],str_b[i+3]));
              i+=6;
            break;
            case "Q": case "q": 
              answer.push(new Point(precommand,str_b[i+2],str_b[i+3],str_b[i],str_b[i+1]));
              i+=4;
            break;
            case "S": case "s": 
              answer.push(new Point(precommand,str_b[i+2],str_b[i+3],null,null,str_b[i],str_b[i+1]));
              i+=4;
            break;
            case "M": case "m":
            case "L": case "l": 
              answer.push(new Point(precommand,str_b[i],str_b[i+1]));
              precommand = ["M","L"].includes(precommand)?"L":"l";
              i+=2;
            break;
            case "H": case "h": 
              answer.push(new Point(precommand,str_b[i]));
              i+=1;
            break;
            case "V": case "v":
              answer.push(new Point(precommand,null,str_b[i]));
              i+=1;
            break;
            default:
            throw Error(`SVG要素にエラーがあります: ${str_proto}`);
          }
      }
     }
     return answer;
    }
  }
  export {SVG};