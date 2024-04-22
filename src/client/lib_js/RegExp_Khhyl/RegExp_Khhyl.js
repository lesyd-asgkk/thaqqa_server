import { REK_def } from "./REK_def.js";
/*lex+yacc的なことでもする？

        開始^
        終了$
        
        囲い(前) ( (?: (?<[A-Za-z]+> 
        囲い(後) ) 

        前b(?<=y)(?<!y)
        後 * + ?  {0|[1-9][0-9]} {0|[1-9][0-9],} {0|[1-9][0-9],0|[1-9][0-9]} 
           *? +? ??  {0|[1-9][0-9]}? {0|[1-9][0-9],}? {0|[1-9][0-9],0|[1-9][0-9]}?
        後b(?=y) (?!=y)
        分割 |
        
        特殊文字 \\0|[1-9][0-9] \\k<[A-Za-z]+>

        

        括弧okって時
        x := (?: ( | \(\?: | \(<.*?> ) x)

        前b okって時
        x := \(\?<!|= x\) x
        
        後okってとき
        x := x(\* | \+ | \? | {n} | {n,} | {n,m})\? 

        後b okって時
        x := x \( \?!|= x\)

        分割 okって時
        x := x | x

        キャプチャokって時
        x := \[1-9][0-9]* \k<.*?>


    使用可能な文字
    n := [A-Za-z]+|.
    v := 0|[1-9][0-9]*|.

    字母の定義 
    
    ↑一旦トークナイズする。理解不能文が一周したらエラーを返す

    g := n_v
      := n
      := .
    ↑解釈不能な場合は一旦gに移す
    g_sub := g
          := +  .(-.)* に変換。
          := *  (空|.(-.)*) に変換
    ↑解釈不能な場合は一旦g_subに移す
    G := g_sub(-g_sub)*


    取りうる形状の定義
    form_v := (init|mid|fin|sol)
    form_c := (onset|coda)
    
    音節の定義
    S := \\s[form_v,G?,G?,G?]
           \\s[form_v,\*]
           \\s[\*]

    単独字母の定義
    C := \\c[form_c,G]
    Cd := \\cd[form_c,G]
    
    V := \\v[form_v,G]
    Vd := \\vd[form_v,G]
    
    P := \\p[G]
    Pd := \\pd[G]

    X := \\x[.*,"type"] 東果世界に存在する東果文字以外の文字。
    R := \\r[.] 端的に言えば俺らの使ってる文字

    
    東果文字の全部。「.」的な
    L := \\l

    あらゆる文字。
    L_ALL := \\lx

    L_ALL := \\L

    文
*/

class RegExp_Khhyl {
    constructor(pattern,intent) {
        this.pattern = pattern;
        this.intent = intent; //基本的には指定する
        this.child = [];
    }
    //Tokenize -> Parse -> Tokenize（変更点が無くなるまで繰り返す）
    toNormalRegExp() {
        let ans = "";
        for (let i = 0; i < this.child.length; i++) {
                ans += this.child[i].toNormalRegExp() + ((this.intent.type.match(/[SRX]|[CVP]d?/g)!=null)&&i!=this.child.length-1?",":"");
        }
        ans += this.pattern;
        switch(this.intent.type){
            case "R":
            case "X":
            case "C":
            case "Cd":
            case "V":
            case "Vd":
            case "P":
            case "Pd":
            case "S":
                ans = `${this.intent.type}\\(${ans}\\)`;// 例えば、S(ans)の形にする。(?:\k<S0>)のようにするのは境界を脱したときにする？
                break;
            case "L":
                ans = `(?:${ans})`;
                break;
        }
        if(this.intent.subtypeb != null && this.intent.subtypeb.match(/^\(/)!=null){
            ans = `${this.intent.subtypeb.slice(0,-1)}${ans})`; 
        }
        else if(this.intent.subtypeb != null && this.intent.subtypeb.match(/^\[/)!=null){
            ans = `(?:${ans})`; 
        }
        return ans;
    }
    ParseRegExp(){
        this.intent.type ??= "";
            
        const rule = [];
        switch(this.intent.type){
            case "":
                rule.push("rule_SEN");
            break;
            case "L":
                rule.push("rule_l");
            break;
            case "form":
                rule.push("rule_form");
            break;
            case "R":case "X":
            case "S":
            case "C":case "Cd":
            case "V":case "Vd":
            case "P":case "Pd":
                rule.push("rule_scvpd");
            break;
            case "G":
                rule.push("rule_G");
            break;
            case "g":
                rule.push("rule_g");
            break;
            case "script":     
                rule.push("rule_script");     
            break;
        }
        if(rule.length != 0){
            const k = this.ParseRegExp_sub(REK_def[rule[0]]);
            if(k instanceof Error)throw k;
            this.child = k; 
            for(const i of this.child){
                const k = i.ParseRegExp();
                if(k instanceof Error)throw k;
            }  
        }
        return this;
    }
    ParseRegExp_sub(rules) {
        let ans  = [];
        let count = 10000;
        doublebreak:while (this.pattern != "") {
            //console.log(`${this.intent.type} : ${this.pattern}`);
            for(const infi in rules){
                if(count == 0)break;
                count--;
                if(this.pattern != null && this.pattern.match(new RegExp(`^${infi}`,"g")) != null){
                    const moji = this.pattern.match(new RegExp(`^${infi}`,"g"));
                    if(moji != null){
                        const k = rules[infi](this,ans,this.pattern,moji[0]);
                        const k0 = k[0];const k1 = k[1];
                        if(Array.isArray(k0)) ans = k0;
                        if(typeof k1 == "string") this.pattern = k1;
                        continue doublebreak;}
                }
            }
            break doublebreak; //通らなかった場合。
        }
        if([null,""].includes(this.pattern).length==0){throw Error(`変換エラー:${this.pattern}${ans}`)}
        return ans;
    }
}


export{RegExp_Khhyl};