import { RegExp_Khhyl,LetterManager } from "../deps.js";

class REK_def {
  static rule_form = {
    ["\\*"]: (self, ans, pattern, msg) => {
      if (self.intent.subtype == "V") {
        return REK_def.PREsub_lower(self,ans,pattern,"(?:init|mid|fin|sol|null)",msg,"form");
      }
      return REK_def.PREsub_lower(self,ans,pattern,"(?:onset|coda|null)",msg,"form");
    },
    // |記号、または(*+?)? があったら
    ["(\\\||(\\\*|\\\+|\\\?)\\\??)"]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_END(self, ans, pattern, msg, msg);
    },//()の類
    ["\\\((\\\?(<.*?>)?:)?"]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_br_A(self, ans, pattern, msg);
    },//文字
    ["[A-Za-z]+"]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_END(self, ans, pattern, msg, msg);
    },
    [" "]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_END(self, ans, pattern, "", msg);
    },
  };

  static rule_script = {
    [".+"]: //[]
      (self, ans, pattern, msg) => {
        
        const hensuu = [];
        const table = {
          "V": "VOWEL","C": "CONSONANT","P": "PUNCTUATION",
          "Vd": "DIACRITIC_V", "Cd": "DIACRITIC_C","Pd": "DIACRITIC_P"};
        const str = self.intent.subtype;
        let AL;
        if (typeof str == "string") {
          AL = LetterManager.getLetter({ Name: /(|.*)/g });
        }
        if (AL == null || AL instanceof Error) throw AL;
        for (const a_ of AL) {
          if(table[str] != a_.parent.name) continue;
          const k = a_.valueList;
          const val = Function("_", `return ${msg}`);
          const val2 = val(k);
          if (typeof val2 == "boolean" && val2 == true) {
            hensuu.push(a_.getVal("Name").toString());
          }
        }
        const letter = hensuu.length!=0?hensuu.join("|"):"_（無し）";
        //if(letter == "") letter = "_（無し）";
        return REK_def.PREsub_lower(self, ans, pattern, letter, msg, "g");
      },
  };
  static rule_g= {
    ["(\\\||(\\\*|\\\+|\\\?)\\\??)"]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_END(self, ans, pattern, msg, msg);
    },
    // [(条件の羅列)]
    ["\\["]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_br_D(self, ans, pattern, msg, "script");
    },
    ["\\."]: (self, ans, pattern, msg) => {
          return REK_def.PREsub_END(self, ans, pattern, "[A-Za-z]+", msg);
    },
    ["！空につき受理拒否！"]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_END(self, ans, pattern, msg, msg);
    },
    ["_"]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_END(self, ans, pattern, "\\d+", msg);
    },
    ["[A-Za-z]+"]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_END(self, ans, pattern, msg, msg);
    },
    ["\\d+"]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_END(self, ans, pattern, msg, msg);
    },
    ["\\(\\\?<?[=!]"]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_br_B(self, ans, pattern, msg);
    },
    ["\\((\\\?(<.*?>)?:)?"]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_br_A(self, ans, pattern, msg);
    },
    ["{\\\d+(,|,\\\d+)?}"]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_kazu(self, ans, pattern, msg);
    },
    [" "]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_END(self, ans, pattern, "", msg);
    },
  };



  static rule_G = {
    ["-\\*"]: (self, ans, pattern, msg) => {
      self.intent.isFirst = "TRUE";
      return REK_def.PREsub_lower(self, ans, pattern, "(?:|-._(?:-._)*)", msg, "G");
    },
    ["-\\+"]: (self, ans, pattern, msg) => {
      self.intent.isFirst = "TRUE";
      return REK_def.PREsub_lower(self, ans, pattern, "(?:|-._(?:-._)*)", msg, "G");
    },
    ["-\\?"]: (self, ans, pattern, msg) => {
      self.intent.isFirst = "TRUE";
      return REK_def.PREsub_lower(self, ans, pattern, "(?:|-._?)", msg, "G");
    },
    ["\\*"]: (self, ans, pattern, msg) => {
      if (self.intent.isFirst == "FALSE") {
        return REK_def.PREsub_END(self, ans, pattern, msg, msg);
      }
      return REK_def.PREsub_lower(self, ans, pattern, "(?:|._(?:-._)*)", msg, "G");
    },
    ["\\+"]: (self, ans, pattern, msg) => {
      if (self.intent.isFirst == "FALSE") {
        return REK_def.PREsub_END(self, ans, pattern, msg, msg);
      }
      return REK_def.PREsub_lower(self, ans, pattern, "._(?:-._)*", msg, "G");
    },
    ["\\?"]: (self, ans, pattern, msg) => {
      if (self.intent.isFirst == "FALSE") {
        return REK_def.PREsub_END(self, ans, pattern, msg, msg);
      }
      return REK_def.PREsub_lower(self, ans, pattern, "(?:._)?", msg, "G");
    },
    ["(\\\||(\\\*|\\\+|\\\?)\\\??)"]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_END(self, ans, pattern, msg, msg);
    },
    ["(\\[.+?\\]|[A-Za-z]|\\d+|_|\\.)+"]: (self, ans, pattern, msg) => {
      self.intent.isFirst = "FALSE";
      return REK_def.PREsub_lower(self, ans, pattern, msg, msg, "g");
    },
    ["-"]: (self, ans, pattern, msg) => {
      self.intent.isFirst = "TRUE";
      return REK_def.PREsub_END(self, ans, pattern, msg, msg);
    },
    ["\\\(\\\?<?[=!]"]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_br_B(self, ans, pattern, msg);
    },
    ["\\\((\\\?(<.*?>)?:)?"]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_br_A(self, ans, pattern, msg);
    },
    ["{\\\d+(,|,\\\d+)?}"]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_kazu(self, ans, pattern, msg);
    },
    [" "]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_END(self, ans, pattern, "", msg);
    },
    
  };

  static rule_scvpd = {
    [".*?,.*?,.*?,.*"]: (self, ans, pattern, msg) => {
      const seperated = msg.split(",");
      const type = ["form", "G", "G", "G"];
      const subtype = ["V", "C", "V", "C"];
      const typeB = self.intent.type;
      if (seperated != null && seperated.length == 4 && typeB == "S") {
        for (let i = 0; i < seperated.length; i++) {
          const intent_after = { ...self.intent };
          intent_after.type = type[i];intent_after.isFirst = "TRUE";intent_after.subtype = subtype[i];intent_after.subtypeb = "none";
          const t = new RegExp_Khhyl(seperated[i], intent_after);
          ans.push(t);
        }
        pattern = pattern.slice(msg.length + 1);
        return [ans, pattern];
      }
      throw Error(`${self.intent.type}(${msg})は不正な正規表現です`);
    },
    [".*?,.*"]: (self, ans, pattern, msg) => {
      const seperated = msg.split(",");
      const typeB = self.intent.type;
      
      if (seperated != null && seperated.length == 2) {
      if (typeB == "S") {
        const type = ["form", "G", "G", "G"];
        const subtype = ["V", "C", "V", "C"];
        const sep2 = seperated.concat("*", "*");
          for (let i = 0; i < sep2.length; i++) {
            const intent_after = { ...self.intent };
            intent_after.type = type[i];intent_after.isFirst = "TRUE";
            intent_after.subtype = subtype[i];intent_after.subtypeb = "none";
            const t = new RegExp_Khhyl(sep2[i], intent_after);
            ans.push(t);
          }
          pattern = pattern.slice(msg.length + 1);
          return [ans,pattern];
        }
      else if (typeB == "X") {
        const condition = seperated != null && seperated.length == 1;
        return condition?REK_def.PREsub_END(self, ans, pattern, seperated[0], msg):[];
      }
      else if (["V","Vd","C","Cd"].includes(typeB)){
        for (let i = 0; i < seperated.length; i++) {
          const intent_after = { ...self.intent };
          const type = ["form", "G"];
          intent_after.type = type[i];intent_after.isFirst = "TRUE";
          intent_after.subtype = typeB;intent_after.subtypeb = "none";
          const t = new RegExp_Khhyl(seperated[i], intent_after);
          ans.push(t);
        }
        pattern = pattern.slice(msg.length + 1);
        return [ans, pattern];
        }
      }
      throw Error(`${self.intent.type}(${msg})は不正な正規表現です`);
    },
    [".+"]: (self, ans, pattern, msg) => {
      const seperated = msg.split(",");
      const typeB = self.intent.type;
      if (seperated != null && seperated.length == 1){
      if (typeB == "S") {
        const type = ["form", "G", "G", "G"];
        const subtype = ["V", "C", "V", "C"];
        const sep2 = seperated.concat("*", "*", "*");
        for (let i = 0; i < sep2.length; i++) {
          const intent_after = { ...self.intent };
          intent_after.type = type[i];intent_after.isFirst = "TRUE";
          intent_after.subtype = subtype[i];intent_after.subtypeb = "none";
          const t = new RegExp_Khhyl(sep2[i], intent_after);
          ans.push(t);
        }
        pattern = pattern.slice(msg.length + 1);
        return [ans, pattern];
      }
      else if (["C","Cd","V","Vd"].includes(typeB)) {
        const type = ["form", "G"];
        const sep2 = seperated.concat("*");
        for (let i = 0; i < sep2.length; i++) {
          const intent_after = { ...self.intent };
          intent_after.type = type[i];intent_after.isFirst = "TRUE";
          intent_after.subtype = typeB;intent_after.subtypeb = "none";
          const t = new RegExp_Khhyl(sep2[i], intent_after);
          ans.push(t);
        }
        pattern = pattern.slice(msg.length + 1);
        return [ans, pattern];
      }
      else if (["R"].includes(typeB)) {
        const condition = seperated != null && seperated.length == 1;
        return condition?REK_def.PREsub_END(self, ans, pattern, seperated[0], msg):[];
      }
      else if (["P","Pd"].includes(typeB)) {
        const intent_after = { ...self.intent };
        intent_after.type = "G";
        intent_after.isFirst = "TRUE";
        intent_after.subtype = typeB;
        intent_after.subtypeb = "none";
        const t = new RegExp_Khhyl(seperated[0], intent_after);
        ans.push(t);
        pattern = pattern.slice(msg.length + 1);
        return [ans, pattern];
      }
      }
      throw Error(`${self.intent.type}(${msg})は不正な正規表現です`);
    },
  };

  static rule_l = {
    ["L"]: (self, ans, pattern, _msg) => {
      const hensuu = [
        ["*,*", "C"],["*,*", "V"],
        ["*,*", "Cd"],["*,*", "Vd"],
        ["*", "P"],["*", "Pd"],
        ["*,*,*,*", "S"]
      ];
      const letter = hensuu.map((i) => `${i[1]}(${i[0]})`).join("|");
      return REK_def.PREsub_lower(self, ans, pattern, letter, _msg, "");
    },
  };
  static rule_SEN = {
    ["\\\^"]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_END(self, ans, pattern, msg, msg);
    },
    ["\\\$"]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_END(self, ans, pattern, msg, msg);
    },
    ["(\\\||(\\\*|\\\+|\\\?)\\\??)"]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_END(self, ans, pattern, msg, msg);
    },
      ["Null\\(\\)"]: (self, ans, pattern, msg) => {
        return REK_def.PREsub_END(self, ans, pattern, "Null\(\\)", msg);
      },
      ["Sep\\(\\)"]: (self, ans, pattern, msg) => {
        return REK_def.PREsub_END(self, ans, pattern, "Sep\\(\\)", msg);
      },
    ["L\\(\\)"]: //PREsub_br_Cを用いる。
      (self, ans, pattern, msg) => {
        return REK_def.PREsub_lower(self, ans, pattern, "L", msg, "L");
      },
    ["(R|X|S|[CVP]d?)\\("]: //PREsub_br_Cを用いる。
      (self, ans, pattern, msg) => {
        const type = msg.match(/^L|R|X|S|[CVP]d?/g);
        if (type != null) {
          return REK_def.PREsub_br_C(self, ans, pattern, msg, type[0]);
        } else throw Error(`不正な値です：${msg}`);
      },
    ["\\\(\\\?<?[=!]"]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_br_B(self, ans, pattern, msg);
    },
    ["\\\((\\\?(<.*?>)?:)?"]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_br_A(self, ans, pattern, msg);
    },
    ["{\\\d+(,|,\\\d+)?}"]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_kazu(self, ans, pattern, msg);
    },
    [" "]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_END(self, ans, pattern, "", msg);
    },
  };
//self,ans,pattern,何という文字列に変換するか,msg
  static PREsub_END(self,ans,pattern,letter,msg){
    const intent_after = { ...self.intent };
    intent_after.type = "FINITE";intent_after.isend = "TRUE";
    intent_after.subtypeb = "none";
    const t = new RegExp_Khhyl(letter, intent_after);
    ans.push(t);
    pattern = pattern.slice(msg.length);
    return [ans, pattern];
  }
  //self,ans,pattern,何という文字列に変換するか,msg,type(次の階層)
  static PREsub_lower(self,ans,pattern,letter,msg,type){
    const intent_after = { ...self.intent };
    intent_after.type = type;intent_after.subtypeb = "none";
    const t = new RegExp_Khhyl(letter, intent_after);
    ans.push(t);
    pattern = pattern.slice(msg.length);
    return [ans, pattern];
  }
  //[] とか。
  static PREsub_br_D(self,ans,pattern,letter,type) {
    const intent_after = { ...self.intent };
    let i = 1; let j = 1;
    for (i = letter.length; i < pattern.length; i++) {
      if (pattern.slice(i, i + 1) == "[") j++;
      else if (pattern.slice(i, i + 1) == "]") j--;
      if (j == 0) break;
    }
    if(j!=0) throw Error(`${pattern}([任意の文字列])のような括弧類が閉じていません`);
    intent_after.type = type;intent_after.subtypeb = "[]";
    const t = new RegExp_Khhyl(pattern.slice(letter.length, i), intent_after);
    ans.push(t);
    pattern = pattern.slice(i + 1);
    return [ans, pattern];
  }
  //()類 lowerと同じ引数 「S()」とか「L()」みたいなやつ
  static PREsub_br_C(self,ans,pattern,letter,type){
    const intent_after = { ...self.intent };
    let i = 1; //カッコの閉じる場所
    let j = 1; 
    for (i = letter.length; i < pattern.length; i++) {
      if (pattern.slice(i, i + 1) == "(") j++;
      else if (pattern.slice(i, i + 1) == ")") j--;
      if (j == 0) break;
    }
    if(j!=0) throw Error("S()のような括弧類が閉じていません");
    intent_after.type = type;intent_after.subtypeb = "none";
    const t = new RegExp_Khhyl(pattern.slice(letter.length, i), intent_after);
    ans.push(t);
    pattern = pattern.slice(i + 1);
    return [ans, pattern];
  }
  //前方の(?<=y) (?<!y)と後方の(?=y) (?!y)  クソ厄介
  static PREsub_br_B(self,ans,pattern,letter){
    const intent_after = { ...self.intent };
    let i = 1;
    let j = 1;
    for (i = 1; i < pattern.length; i++) {
      if (pattern.slice(i, i + 1) == "(") j++;
      else if (pattern.slice(i, i + 1) == ")") j--;
      if (j == 0) break;
    }
    if(j!=0) throw Error("(?<=y)、(?=y)のような括弧類が閉じていません");
    intent_after.subtypeb = letter + "y)";
    const t = new RegExp_Khhyl(pattern.slice(letter.length, i), intent_after);
    ans.push(t);
    pattern = pattern.slice(i + 1);
    return [ans, pattern];
  }
  //() クソ厄介 (?: (?<Name>: の例外処理も要る
   static PREsub_br_A(self,ans,pattern,letter){
    const intent_after = { ...self.intent };
    let i = 1; // br_end
    let j = 1; // 
    const br_start = letter.length; // ?:や<Name>:とか
    for (i = 1; i < pattern.length; i++) {
      if (pattern.slice(i, i + 1) == "(") j++;
      else if (pattern.slice(i, i + 1) == ")") j--;
      if (j == 0) break;
    }
    if(j!=0) throw Error(`${pattern}(<任意の文字列>)のような括弧類が閉じていません`);
    intent_after.subtypeb = pattern.slice(0, br_start) + ")";
    const t = new RegExp_Khhyl(pattern.slice(br_start, i), intent_after);
    ans.push(t);
    pattern = pattern.slice(i + 1);
    return [ans, pattern];
  }
  //{}とか 
  static PREsub_kazu(self,ans,pattern,letter){
    const intent_after = { ...self.intent };
    intent_after.type = "{n}";
    intent_after.subtype2 = "none";
    intent_after.subtype = "{n}";
    let b = pattern.match(/{\d+,\d+}/);
    if (b != null) intent_after.subtype = "{n,m}";
    else {
      b = pattern.match(/{\d+,}/);
      if (b != null) intent_after.subtype = "{n,}";
      else{if(pattern.match(/{\d+}/) == null)throw Error("{n(,m)}の中が不正です"); }
    }
    const t = new RegExp_Khhyl(letter, intent_after);
    ans.push(t);
    pattern = pattern.slice(letter.length);
    return [ans, pattern];
  }
}
export{REK_def};