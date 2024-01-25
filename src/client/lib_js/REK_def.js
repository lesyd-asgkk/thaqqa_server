import { RegExp_Khhyl } from "./RegExp_Khhyl.js";
import { LetterManager } from "./Letter.js";
class REK_def {
  static rule_form = {
    ["\\*"]: (self, ans, pattern, msg) => {
      if (self.intent.subtype == "V") {
        return REK_def.PREsub_lower(
          self,
          ans,
          pattern,
          "(?:init|mid|fin|sol|null)",
          msg,
          "form",
        );
      }
      return REK_def.PREsub_lower(
        self,
        ans,
        pattern,
        "(?:onset|coda|null)",
        msg,
        "form",
      );
    },
    ["(\\\||(\\\*|\\\+|\\\?)\\\??)"]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_END(self, ans, pattern, msg, msg);
    },
    ["\\\((\\\?(<.*?>)?:)?"]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_br_A(self, ans, pattern, msg);
    },
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
          "V": "VOWEL",
          "C": "CONSONANT",
          "Cd": "DIACRITIC_C",
          "Vd": "DIACRITIC_V",
          "P": "PUNCTUATION",
          "Pd": "DIACRITIC_P",
        };
        const str = self.intent.subtype;
        let AL;
        if (typeof str == "string") {
          AL = LetterManager.getLetter({ Name: /(|.*)/g });
        }
        if (AL == null || AL instanceof Error) throw AL;
        for (const a_ in AL) {
          if(table[str] != AL[a_].parent.name) continue;
          const k = AL[a_].values;
          
          const val = Function("_", `return ${msg}`);
          
          const val2 = val(k);

          if (typeof val2 == "boolean" && val2 == true) {

            hensuu.push(AL[a_].values.Name.toString());
          }
        }
        let letter = "";
        for (let i = 0; i < hensuu.length; i++) {
          letter += "_" + hensuu[i];
          if (i != hensuu.length - 1) letter += "|";
        }
        if(letter == "") letter = "_！空につき受理拒否！"
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
    ["_?\\._?"]: (self, ans, pattern, msg) => {
      const han_i0 = msg.match(/^\._/g);
      const han_i1 = msg.match(/^_\./g);
      const han_i2 = msg.match(/^_?\./g);
      if (han_i2 != null) {
        if (han_i0 != null) {
          return REK_def.PREsub_END(self, ans, pattern, "[a-z]+", han_i2[0]);
        }
        if (han_i1 != null) {
          pattern = pattern.slice(1);
          return REK_def.PREsub_END(self, ans, pattern, "_\\d+", han_i2[0]);
        }
      }
      return REK_def.PREsub_lower(self, ans, pattern, "._.", msg, "g");
    },
    ["^！空につき受理拒否！"]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_END(self, ans, pattern, msg, msg);
    },
    ["^_[A-Za-z]+"]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_END(self, ans, pattern, msg.slice(1), msg);
    },
    ["[A-Za-z]+_?"]: (self, ans, pattern, msg) => {
      const han_i = msg.match(/^[A-Za-z]+/g);
      const type = msg.match(/^[A-Za-z]+_/g);
      if (han_i != null) {
        if (type == null) {
          return REK_def.PREsub_lower(
            self,
            ans,
            pattern,
            han_i[0] + "_.",
            han_i[0],
            "g",
          );
        }
        return REK_def.PREsub_END(self, ans, pattern, han_i[0], han_i[0]);
      }
      return REK_def.PREsub_END(self, ans, pattern, msg, msg);
    },
    ["_"]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_END(self, ans, pattern, msg, msg);
    },
    ["\\d+"]: (self, ans, pattern, msg) => {
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

   static PREsub_br_D(
    self,
    ans,
    pattern,
    letter,
    type,
  ) {
    //S() クソ厄介
    const intent_after = { ...self.intent };
    let i = 1;
    let j = 1;
    for (i = letter.length; i < pattern.length; i++) {
      if (pattern.slice(i, i + 1) == "[") j++;
      else if (pattern.slice(i, i + 1) == "]") j--;
      if (j == 0) break;
    }
    intent_after.type = type;
    intent_after.subtypeb = "[]";
    const t = new RegExp_Khhyl(pattern.slice(letter.length, i), intent_after);
    ans.push(t);
    pattern = pattern.slice(i + 1);
    return [ans, pattern];
  }

  static rule_G = {
    ["-\\*"]: (self, ans, pattern, msg) => {
      self.intent.isFirst = "TRUE";
      return REK_def.PREsub_lower(self, ans, pattern, "(?:|-.(?:-.)*)", msg, "G");
    },
    ["-\\+"]: (self, ans, pattern, msg) => {
      self.intent.isFirst = "TRUE";
      return REK_def.PREsub_lower(self, ans, pattern, "(?:|-.(?:-.)*)", msg, "G");
    },
    ["-\\?"]: (self, ans, pattern, msg) => {
      self.intent.isFirst = "TRUE";
      return REK_def.PREsub_lower(self, ans, pattern, "(?:|-.?)", msg, "G");
    },
    ["\\*"]: (self, ans, pattern, msg) => {
      if (self.intent.isFirst == "FALSE") {
        return REK_def.PREsub_END(self, ans, pattern, msg, msg);
      }
      return REK_def.PREsub_lower(self, ans, pattern, "(?:|.(?:-.)*)", msg, "G");
    },
    ["\\+"]: (self, ans, pattern, msg) => {
      if (self.intent.isFirst == "FALSE") {
        return REK_def.PREsub_END(self, ans, pattern, msg, msg);
      }
      return REK_def.PREsub_lower(self, ans, pattern, ".(?:-.)*", msg, "G");
    },
    ["\\?"]: (self, ans, pattern, msg) => {
      if (self.intent.isFirst == "FALSE") {
        return REK_def.PREsub_END(self, ans, pattern, msg, msg);
      }
      return REK_def.PREsub_lower(self, ans, pattern, ".?", msg, "G");
    },
    ["(\\\||(\\\*|\\\+|\\\?)\\\??)"]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_END(self, ans, pattern, msg, msg);
    },
    ["(\\w|\\.)+"]: (self, ans, pattern, msg) => {
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
    [".*"]: (self, ans, pattern, msg) => {
      return REK_def.PREsub_lower(self, ans, pattern, msg, msg, "g");
    },
    
  };

  static rule_scvpd = {
    [".*?,.*?,.*?,.*"]: (self, ans, pattern, msg) => {
      const seperated = msg.split(",");
      const type = ["form", "G", "G", "G"];
      const subtype = ["V", "C", "V", "C"];
      if (seperated != null && seperated.length == 4) {
        for (let i = 0; i < seperated.length; i++) {
          const intent_after = { ...self.intent };
          intent_after.type = type[i];
          intent_after.isFirst = "TRUE";
          intent_after.subtype = subtype[i];
          intent_after.subtypeb = "none";
          const t = new RegExp_Khhyl(seperated[i], intent_after);
          ans.push(t);
        }
        pattern = pattern.slice(msg.length + 1);
      }
      return [ans, pattern];
    },
    [".*?,.*"]: (self, ans, pattern, msg) => {
      const seperated = msg.split(",");
      const typeB = self.intent.type;
      let type = ["form", "G"];
      if (typeB == "S") {
        type = ["form", "G", "G", "G"];
        const subtype = ["V", "C", "V", "C"];
        const sep2 = seperated.concat("*", "*");
        if (sep2 != null && sep2.length == 4) {
          for (let i = 0; i < sep2.length; i++) {
            const intent_after = { ...self.intent };
            intent_after.type = type[i];
            intent_after.isFirst = "TRUE";
            intent_after.subtype = subtype[i];
            intent_after.subtypeb = "none";
            const t = new RegExp_Khhyl(sep2[i], intent_after);
            ans.push(t);
          }
          pattern = pattern.slice(msg.length + 1);
        }
        return [ans, pattern];
      }
      if (typeB == "X") {
        let answer = [];
        if (seperated != null && seperated.length == 1) {
          answer = REK_def.PREsub_END(self, ans, pattern, seperated[0], msg);
        }
        return answer;
      }
      if (seperated != null && seperated.length == 2) {
        for (let i = 0; i < seperated.length; i++) {
          const intent_after = { ...self.intent };
          intent_after.type = type[i];
          intent_after.isFirst = "TRUE";
          intent_after.subtype = typeB;
          intent_after.subtypeb = "none";
          const t = new RegExp_Khhyl(seperated[i], intent_after);
          ans.push(t);
        }
        pattern = pattern.slice(msg.length + 1);
      }
      return [ans, pattern];
    },
    [".+"]: (self, ans, pattern, msg) => {
      const seperated = msg.split(",");
      const typeB = self.intent.type;
      if (typeB == "S") {
        const type = ["form", "G", "G", "G"];
        const subtype = ["V", "C", "V", "C"];
        const sep2 = seperated.concat("*", "*", "*");
        for (let i = 0; i < sep2.length; i++) {
          const intent_after = { ...self.intent };
          intent_after.type = type[i];
          intent_after.isFirst = "TRUE";
          intent_after.subtype = subtype[i];
          intent_after.subtypeb = "none";
          const t = new RegExp_Khhyl(sep2[i], intent_after);
          ans.push(t);
        }
        pattern = pattern.slice(msg.length + 1);
        return [ans, pattern];
      }
      if (typeB == "C" || typeB == "Cd" || typeB == "V" || typeB == "Vd") {
        const type = ["form", "G"];
        const sep2 = seperated.concat("*");
        for (let i = 0; i < sep2.length; i++) {
          const intent_after = { ...self.intent };
          intent_after.type = type[i];
          intent_after.isFirst = "TRUE";
          intent_after.subtype = typeB;
          intent_after.subtypeb = "none";
          const t = new RegExp_Khhyl(sep2[i], intent_after);
          ans.push(t);
        }
        pattern = pattern.slice(msg.length + 1);
        return [ans, pattern];
      }
      if (typeB == "R") {
        let answer = [];
        if (seperated != null && seperated.length == 1) {
          answer = REK_def.PREsub_END(self, ans, pattern, seperated[0], msg);
        }
        return answer;
      }
      if (seperated != null && seperated.length == 1) {
        const intent_after = { ...self.intent };
        intent_after.type = "G";
        intent_after.isFirst = "TRUE";
        intent_after.subtype = typeB;
        intent_after.subtypeb = "none";
        const t = new RegExp_Khhyl(seperated[0], intent_after);
        ans.push(t);
        pattern = pattern.slice(msg.length + 1);
      }
      return [ans, pattern];
    },
  };

  static rule_l = {
    ["L"]: (self, ans, pattern, _msg) => {
      const hensuu = [
        ["*,*", "C"],
        ["*,*", "V"],
        ["*,*", "Cd"],
        ["*,*", "Vd"],
        ["*", "P"],
        ["*", "Pd"],
        ["*,*,*,*", "S"],
      ];
      for (let i = 0; i < hensuu.length; i++) {
        let intent_after = { ...self.intent };
        intent_after.type = hensuu[i][1];
        intent_after.subtypeb = "none";
        const t = new RegExp_Khhyl(hensuu[i][0], intent_after);
        ans.push(t);

        intent_after = { ...self.intent };
        intent_after.subtypeb = "none";
        intent_after.type = "FINITE";
        intent_after.isend = "TRUE";
        const u = new RegExp_Khhyl("|", intent_after);
        if (i != hensuu.length - 1) ans.push(u);
        pattern = "";
      }
      return [ans, pattern];
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
      ["NULL\\(\\)"]: (self, ans, pattern, msg) => {
        return REK_def.PREsub_END(self, ans, pattern, "NULL\\(\\)", msg);
      },
      ["SEP\\(\\)"]: (self, ans, pattern, msg) => {
        return REK_def.PREsub_END(self, ans, pattern, "SEP\\(\\)", msg);
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
        } else return ["", ""];
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

   static PREsub_END(
    self,
    ans,
    pattern,
    letter,
    msg,
  ) {
    const intent_after = { ...self.intent };
    intent_after.type = "FINITE";
    intent_after.isend = "TRUE";
    intent_after.subtypeb = "none";
    const t = new RegExp_Khhyl(letter, intent_after);
    ans.push(t);

    pattern = pattern.slice(msg.length);
    return [ans, pattern];
  }

   static PREsub_lower(
    self,
    ans,
    pattern,
    letter,
    msg,
    type,
  ) {
    const intent_after = { ...self.intent };
    intent_after.type = type;
    intent_after.subtypeb = "none";
    const t = new RegExp_Khhyl(letter, intent_after);
    ans.push(t);
    pattern = pattern.slice(msg.length);
    return [ans, pattern];
  }
   static PREsub_br_C(
    self,
    ans,
    pattern,
    letter,
    type,
  ) {
    //S() クソ厄介
    const intent_after = { ...self.intent };
    let i = 1;
    let j = 1;
    for (i = letter.length; i < pattern.length; i++) {
      if (pattern.slice(i, i + 1) == "(") j++;
      else if (pattern.slice(i, i + 1) == ")") j--;
      if (j == 0) break;
    }
    intent_after.type = type;
    intent_after.subtypeb = "none";
    const t = new RegExp_Khhyl(pattern.slice(letter.length, i), intent_after);
    ans.push(t);
    pattern = pattern.slice(i + 1);
    return [ans, pattern];
  }

   static PREsub_br_B(
    self,
    ans,
    pattern,
    letter,
  ) {
    //前方の(?<=y) (?<!y)と後方の(?=y) (?!y)  クソ厄介
    const intent_after = { ...self.intent };
    let i;
    let j = 1;
    for (i = 1; i < pattern.length; i++) {
      if (pattern.slice(i, i + 1) == "(") j++;
      else if (pattern.slice(i, i + 1) == ")") j--;
      if (j == 0) break;
    }
    intent_after.subtypeb = letter + "y)";
    const t = new RegExp_Khhyl(pattern.slice(letter.length, i), intent_after);
    ans.push(t);
    pattern = pattern.slice(i + 1);
    return [ans, pattern];
  }
   static PREsub_br_A(
    self,
    ans,
    pattern,
    letter,
  ) {
    //() クソ厄介 (?: (?<Name>: の例外処理も要る
    const intent_after = { ...self.intent };
    let i = 1;
    let j = 1;
    const l = letter.length;
    for (i = 1; i < pattern.length; i++) {
      if (pattern.slice(i, i + 1) == "(") j++;
      else if (pattern.slice(i, i + 1) == ")") j--;
      if (j == 0) break;
    }
    intent_after.subtypeb = pattern.slice(0, l) + ")";
    const t = new RegExp_Khhyl(pattern.slice(letter.length, i), intent_after);
    ans.push(t);
    pattern = pattern.slice(i + 1);
    return [ans, pattern];
  }
   static PREsub_kazu(
    self,
    ans,
    pattern,
    letter,
  ) {
    const intent_after = { ...self.intent };
    intent_after.type = "{n}";
    intent_after.subtype2 = "none";
    intent_after.subtype = "{n}";
    let b = pattern.match(/{\d+,\d+}/);
    if (b != null) intent_after.subtype = "{n,m}";
    else {
      b = pattern.match(/{\d+,}/);
      if (b != null) intent_after.subtype = "{n,}";
    }
    const t = new RegExp_Khhyl(letter, intent_after);
    ans.push(t);
    pattern = pattern.slice(letter.length);
    return [ans, pattern];
  }
}
export{REK_def};