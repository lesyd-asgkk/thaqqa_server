
class Point {
    constructor(type,x,y,x1,y1,x2,y2,val) {
      this.type = type;
      this.x = this.setPos(x);
      this.y = this.setPos(y);
      this.x1 = this.setPos(x1);
      this.y1 = this.setPos(y1);
      this.x2 = this.setPos(x2);
      this.y2 = this.setPos(y2);
      this.val = this.setPos(val);
      this.digit = 8;
    }
    setPos(val){
      return val != undefined ? Number(val) : undefined;
    }
    roundAll() {
      this.x = this.roundN(this.x);
      this.y = this.roundN(this.y);
      this.x1 = this.roundN(this.x1);
      this.y1 = this.roundN(this.y1);
      this.x2 = this.roundN(this.x2);
      this.y2 = this.roundN(this.y2);
    }
  
    roundN(val, n) {
      n = n != undefined ? n : this.digit;
      return val ;//!= undefined ? Math.round(val * (10 ^ n)) / (10 ^ n) : undefined;
    }
  }
  
class SVG {
    static toStr(param) {
      let type;
      let answer = "";
      for (const p of param) {
        type = p.type;
        switch (type) {
          case "v":
            answer += "v" + p.y + " ";
            break;
          case "h":
            answer += "h" + p.x + " ";
            break;
          case "l":
            answer += "l" + p.x + "," + p.y + " ";
            break;
          case "m":
            answer += "m" + p.x + "," + p.y + " ";
            break;
          case "s":
            answer += "s" + p.x2 + "," + p.y2 + " " + p.x + "," + p.y + " ";
            break;
          case "c":
            answer += "c" + p.x1 + "," + p.y1 + " " + p.x2 + "," + p.y2 + " " +
              p.x + "," + p.y + " ";
            break;
          case "t":
            answer += "t" + p.x + "," + p.y + " ";
            break;
          case "q":
            answer += "q" + p.x1 + "," + p.y1 + " " + p.x + "," + p.y + " ";
            break;
          case "a":
            answer += "a" + p.x1 + "," + p.y1 + "," + p.x2 + "," + p.y2 + "," +
              p.val + "," + p.x + "," + p.y + " ";
            break;
          case "z":
          case "Z":
            answer += "z";
            break;
        }
      }
      return answer;
    }
    static roundAll(param) {
      for (const p of param) {
        p.roundAll();
      }
      return param;
    }
    static convertSVG(param) {
        return SVG.toStr( SVG.toRelative(param));
      }
    static toRelative(param) {
        if(typeof param == "string") return SVG.toRel(SVG.roundAll(SVG.ParseD(param))).d;
        else return SVG.toRel(SVG.roundAll(param)).d;
    }
    static toAbsolute(param) {
        if(typeof param == "string") return SVG.toAbs(SVG.roundAll(SVG.ParseD(param))).d;
        else return SVG.toAbs(SVG.roundAll(param)).d;
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
        return SVG.roundAll(SVG.ParseD(SVG.setSkewer(x0, y0, x1, y1)));
    }
    static setSkewer(x0, y0, x1, y1) {
        if(x1<x0 || y1<y0) return " ";
        return ` M ${x0},${y0} V ${y1} H ${x1} V ${y0} H ${x0} M 0,${y0}`;
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

    static merge2 = function (d0,d1,x0, y0) { //d0とd1を合成。d1の始点はx,y
        return `${d0} M ${x0},${y0} ${d1}`;
    };
    static Domerge3(d0,d1,d2,x0,y0,x1,y1){
        const M = SVG.roundAll(SVG.ParseD(`M ${x0},${y0}`));
        const M1 = SVG.roundAll(SVG.ParseD(`M ${x1},${y1}`));
        return d0.concat(M).concat(d1).concat(M1).concat(d2);
    }
    static merge3 = function (d0,d1,d2,x0,y0,x1,y1) { //d0とd1とd2を合成。
      //d1の始点はx,y d2の始点はx1,y1
      return d0 + " M " + x0 + "," + y0 + " " + d1 + " M " + x1 + "," + y1 + " " +
        d2;
    };
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
              if (typeof abspos.x == "number" && typeof p.x == "number") {
                absposb.x = p.x;
              }
              if (typeof abspos.y == "number" && typeof p.y == "number") {
                abspos.y = p.y;
              }
              absposb.x = abspos.x;
              absposb.y = abspos.y;
    
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
              if (typeof abspos.x == "number" && typeof p.x == "number") {
                abspos.x = p.x;
              }
              if (typeof abspos.y == "number" && typeof p.y == "number") {
                abspos.y = p.y;
              }
              break;
            case "m":
                  q = new Point("M", p.x + abspos.x, p.y + abspos.y);
              abspos.x += p.x;
              abspos.y += p.y;
              absposb.x = abspos.x;
              absposb.y = abspos.y;
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
              abspos.x += p.x;
              abspos.y += p.y;
              break;
            case "l":
                  q = new Point("L", p.x + abspos.x, p.y + abspos.y);
              abspos.x += p.x;
              abspos.y += p.y;
              break;
            case "c":
                  q = new Point("C",
                    p.x + abspos.x,p.y + abspos.y,
                    p.x1 + abspos.x,p.y1 + abspos.y,
                    p.x2 + abspos.x,p.y2 + abspos.y,
                  );
              abspos.x += p.x;
              abspos.y += p.y;
              break;
            case "s":
                  q = new Point("S",
                    p.x + abspos.x,p.y + abspos.y,
                    undefined,undefined,
                    p.x2 + abspos.x,p.y2 + abspos.y,
                  );
              abspos.x += p.x;
              abspos.y += p.y;
              break;
            case "q":
                  q = new Point("Q",
                    p.x + abspos.x,p.y + abspos.y,
                    p.x1 + abspos.x,p.y1 + abspos.y,
                  );
              abspos.x += p.x;
              abspos.y += p.y;
              break;
            case "t":
                  q = new Point("T",
                    p.x + abspos.x,p.y + abspos.y,
                    undefined,undefined
                  );
              abspos.x += p.x;
              abspos.y += p.y;
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
          if (abspos.x != null) {
            left = Math.min(left, abspos.x);
            right = Math.max(right, abspos.x);
          }
          if (abspos.y != null) {
            top = Math.min(top, abspos.y);
            bottom = Math.max(bottom, abspos.y);
          }
        }
        //console.log("uujtuudjfnjgs")
  
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
            if (typeof abspos.x == "number" && typeof p.x == "number") {
              abspos.x += p.x;
            }
            if (typeof abspos.y == "number" && typeof p.y == "number") {
              abspos.y += p.y;
            }
            absposb.x = abspos.x;
            absposb.y = abspos.y;
  
            break;
          case "l":
          case "v":
          case "h":
          case "c":
          case "s":
          case "q":
          case "a":
          case "t":
            q = p;
            if (typeof abspos.x == "number" && typeof p.x == "number") {
              abspos.x += p.x;
            }
            if (typeof abspos.y == "number" && typeof p.y == "number") {
              abspos.y += p.y;
            }
            break;
          case "M":
                q = new Point("m", p.x - abspos.x, p.y - abspos.y);
            abspos.x = p.x;
            abspos.y = p.y;
            absposb.x = abspos.x;
            absposb.y = abspos.y;
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
            abspos.x = p.x;
            abspos.y = p.y;
            break;
          case "L":
                q = new Point("l", p.x - abspos.x, p.y - abspos.y);
            abspos.x = p.x;
            abspos.y = p.y;
            break;
          case "C":
                q = new Point("c",
                  p.x - abspos.x,p.y - abspos.y,
                  p.x1 - abspos.x,p.y1 - abspos.y,
                  p.x2 - abspos.x,p.y2 - abspos.y,
                );
            abspos.x = p.x;
            abspos.y = p.y;
            break;
          case "S":
                q = new Point(
                  "s",
                  p.x - abspos.x,p.y - abspos.y,
                  undefined,undefined,
                  p.x2 - abspos.x,p.y2 - abspos.y,
                );
            abspos.x = p.x;
            abspos.y = p.y;
            break;
          case "Q":
                q = new Point(
                  "q",
                  p.x - abspos.x,p.y - abspos.y,
                  p.x1 - abspos.x,p.y1 - abspos.y,
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
        if (abspos.x != null) {
          left = Math.min(left, abspos.x);
          right = Math.max(right, abspos.x);
        }
        if (abspos.y != null) {
          top = Math.min(top, abspos.y);
          bottom = Math.max(bottom, abspos.y);
        }
      }
      //console.log("uujtuudjfnjgs")

      if(left == Infinity) left = 0;if(top == Infinity) top = 0;
      if(right == -Infinity) right = 0;if(bottom == -Infinity) bottom = 0;
      return { d: answer, top: top, left: left, right: right, bottom: bottom };
    }
  
    static ParseD(str) {
      const str_b = str.split(" ");
      str = "";
      for (let i = 0; i < str_b.length; i++) {
        str += str_b[i];
        if (i != str_b.length - 1) {
          if (str_b[i].match(/\d$/) && str_b[i + 1].match(/^(-|\d)/)) str += " ";
        }
        //
      }
      const answer = [];
      let precommand = "";
      while (str != null || str != "") {
        //console.log(str);
        if (str.match(/^( )/g) != null) {
          str = str.slice(1);
          continue;
        }
        if (str.match(/^(Z|z)/g) != null) {
          const type = str.match(/^(Z|z)/g);
          if (type != null) {
            answer.push(new Point(type[0]));
            str = str.slice(1);
            continue;
          }
        } else if (str.match(/^(M|m|L|l|V|v|H|h|C|c|S|s|Q|q|T|t|A|a)/g) != null) {
          const type = str.match(/^(M|m|L|l|V|v|H|h|C|c|S|s|Q|q|T|t|A|a)/g);
          if (type != null) {
            precommand = type[0];
            str = str.slice(1);
            continue;
          } else break;
        }
        //数字判定 (-?(\d|\.)+(e-?(\d|\.)+)?)
        if (
          str.match(
            /^(\d|\.|e|-)+( |,)(\d|\.|e|-)+( |,)(\d|\.|e|-)+( |,)(\d|\.|e|-)+( |,)(\d|\.|e|-)+( |,)(\d|\.|e|-)+( |,)(\d|\.|e|-)+/g,
          ) != null
        ) {
          const type = precommand.match(/^(A|a)/g);
          const len = str.match(
            /^(\d|\.|e|-)+( |,)(\d|\.|e|-)+( |,)(\d|\.|e|-)+( |,)(\d|\.|e|-)+( |,)(\d|\.|e|-)+( |,)(\d|\.|e|-)+( |,)(\d|\.|e|-)+/g,
          );
          if (type != null && len != null) {
            const n = len[0].match(/(\d|\.|e|-)+/g);
            if (n != null) {
              answer.push(
                new Point(
                  precommand,
                  Number(n[5]),Number(n[6]),
                  Number(n[0]),Number(n[1]),
                  Number(n[2]),Number(n[3]),
                  Number(n[4])
                ),
              );
              str = str.slice(len[0].length);
            }
            continue;
          }
        }
        if (
          str.match(
            /^(\d|\.|e|-)+( |,)(\d|\.|e|-)+( |,)(\d|\.|e|-)+( |,)(\d|\.|e|-)+( |,)(\d|\.|e|-)+( |,)(\d|\.|e|-)+/g,
          ) != null
        ) {
          const type = precommand.match(/^(C|c)/g);
          const len = str.match(
            /^(\d|\.|e|-)+( |,)(\d|\.|e|-)+( |,)(\d|\.|e|-)+( |,)(\d|\.|e|-)+( |,)(\d|\.|e|-)+( |,)(\d|\.|e|-)+/g,
          );
          if (type != null && len != null) {
            const n = len[0].match(/(\d|\.|e|-)+/g);
            if (n != null) {
              answer.push(
                new Point(
                  precommand,
                  Number(n[4]),Number(n[5]),
                  Number(n[0]),Number(n[1]),
                  Number(n[2]),Number(n[3])
                ),
              );
              str = str.slice(len[0].length);
            }
            continue;
          }
        }
        if (
          str.match(
            /^(\d|\.|e|-)+( |,)(\d|\.|e|-)+( |,)(\d|\.|e|-)+( |,)(\d|\.|e|-)+/g,
          ) != null
        ) {
          const type = precommand.match(/^(S|s|Q|q)/g);
          const len = str.match(
            /^(\d|\.|e|-)+( |,)(\d|\.|e|-)+( |,)(\d|\.|e|-)+( |,)(\d|\.|e|-)+/g,
          );
          if (type != null && len != null) {
            const n = len[0].match(/(\d|\.|e|-)+/g);
            const type2 = precommand.match(/^(S|s)/g);
            if (n != null) {
              if (type2 != null) {
                answer.push(
                  new Point(
                    precommand,
                    Number(n[2]),Number(n[3]),
                    Number(n[0]),Number(n[1])
                  ),
                );
              } else {answer.push(
                  new Point(
                    precommand,
                    Number(n[2]),Number(n[3]),
                    undefined,undefined,
                    Number(n[0]),Number(n[1])
                  ),
                );}
              str = str.slice(len[0].length);
            }
            continue;
          }
        }
        if (str.match(/^(\d|\.|e|-)+( |,)(\d|\.|e|-)+/g) != null) {
          const type = precommand.match(/^(M|m|L|l|T|t)/g);
          const len = str.match(/^(\d|\.|e|-)+( |,)(\d|\.|e|-)+/g);
          if (type != null && len != null) {
            const n = len[0].match(/(\d|\.|e|-)+/g);
            if (n != null) {
              answer.push(new Point(precommand, Number(n[0]), Number(n[1])));
              if (precommand == "M") precommand = "L";
              else if (precommand == "m") precommand = "l";
              str = str.slice(len[0].length);
            }
            continue;
          }
        }
        if (str.match(/^(\d|\.|e|-)+/g) != null) {
          const type = precommand.match(/^(H|h|V|v)/g);
          const len = str.match(/^(\d|\.|e|-)+/g);
          if (type != null && len != null) {
            const type2 = precommand.match(/^(V|v)/g);
            if (type2 != null) {
              answer.push(new Point(precommand, undefined, Number(len[0])));
            } else answer.push(new Point(precommand, Number(len[0])));
            str = str.slice(len[0].length);
            continue;
          } else break;
        } else break;
      }
      if (str != null && str != "") throw Error("エラー:" + str);
      return answer;
    }
  }
  export {SVG};