import {Thaqqa_DB,DataTable,Data}  from  "./Thaqqa_DB.ts";
import {LetterManager}  from  "./LetterManager.ts";

export class Featual{ //字母
    declare type : string;
    declare name : string;
    declare form : string;
    declare variant : number;
    constructor(param : string){
        this.type = "null";
        this.name = "null";
        this.form = "null";
        this.variant= 0;
        this.parse(param);
    }
    parse(param : string){// \(文字種),form,name_variant または name_variant
        const a = param.split(",");
        if(a.length >= 2){
            this.type = a[0];
            if(a.length == 3) this.type = a[1];
        }
        const b = a.slice(-1)[0].split("_")
        this.name = b[0];
        this.variant = b[1] == null?0:(Number(b[1]) ?? 0);
    }
    toString(isShort : boolean){
        if(isShort == false){
            return this.type+"("+this.form+","+this.name+(this.variant != null?"_"+this.variant:"")+")";
        }
        return this.name+(this.variant != null?"_"+this.variant:"");
    }
}


export class Alphabet{
    declare featual : Featual[];
    declare type : string;
    declare form : string;
    constructor(featual : Featual[]){
        this.featual = featual;//featualの配列を入れること
        this.type = featual[0].type;
        this.form = "null";
    }
    toString(isShort : boolean){
        let featuals = "";
        for(let i = 0;i<this.featual.length;i++){
            featuals += this.featual[i].toString(true);
            featuals += i!=this.featual.length-1? "-" : "";
        }
        if(isShort == true){
            return featuals;
        }
        return this.type+"("+ ((this.type == "P" || this.type == "Pd" )?"":this.form+",")+featuals+")";
    }
    getAlphabet(){
        if(this.type == "P" || this.type == "\\ex") return this.featual[0].name;
        /*
    (d -> "t+d")    (p -> "t+hd")    (ty -> "t+sy")
    (ky -> "k+sy")    (kw -> "k+sw")    (g -> "k+d")
    (hq -> "q+hd")    (qw -> "q+sw")

    (m -> "n+hd")    (ny -> "n+sy")
    (ngy -> "ng+sy")    (ngw -> "ng+sw")

    dh -> "th+d"    (f -> "th+hd")
    z -> "s+d"
    (sh/sy -> "s+sy")
    zh(/zy) -> "hy+d"
    gh -> "kh+d"
    rh -> "qh+d"
    (hw -> "qh+hw")
    hh -> "h+d"

    ry -> "r+sy"

    (ht -> "tl+sw")(ch -> "tl+sy")
        */

        const conv2 : {[index: string]: string}= {
            ["t-d"]:"d",["t-hd"]:"p",["t-sy"]:"ty",
            ["k-d"]:"g",["k-sy"]:"ky",["k-sw"]:"kw",
            ["q-hd"]:"hq",["q-sw"]:"qw",

            ["n-hd"]:"m",["n-sy"]:"ny",
            ["ng-sy"]:"ngy",["ng-sw"]:"ngw",

            ["th-d"]:"dh",["th-hd"]:"f",
            ["s-d"]:"z",["s-sy"]:"sy",
            ["hy-d"]:"zh",
            ["kh-d"]:"gh",
            ["qh-d"]:"rh",["qh-sw"]:"hw",
            ["h-d"]:"hh",

            ["r-sy"]:"ry",
            ["tl-sw"]:"ht",["tl-sy"]:"ch"
        }
        /*
    (b -> "t+d+hd")
    (my -> "n+hd+sy")
    (hp = "th+hd+sw")
    (hpy = "th+hd+sy")
*/
        const conv3 :{[index: string]: string}= {
            ["t-d-hd"]:"b",["n-hd-sy"]:"my",["th-hd-sw"]:"hp",["th-hd-sy"]:"hpy",
        }
        if(this.featual.length == 1){
            return this.featual[0].name;
        }
        else if(this.featual.length == 2){
            const n = this.featual[0].name+"-"+this.featual[1].name;
            return conv2[n]?? n;
        }
        else if(this.featual.length == 3){
            const n = this.featual[0].name+"-"+this.featual[1].name+"-"+this.featual[2].name;
            return conv3[n]?? n;
        }
        return null;
    }
}
    
 
export class Syllable{
    declare onset? : Alphabet|null;
    declare vowel?: Alphabet|null;
    declare coda? : Alphabet|null;
    declare misc? : Alphabet|null
    constructor(onset:Alphabet|null,vowel:Alphabet|null,coda:Alphabet|null,misc:Alphabet|null){
        this.onset = onset;
        this.vowel = vowel;
        this.coda = coda;
        this.misc = misc;
    }

    toString(){
        if(this.misc != null){
            return this.misc.toString(false);
        }
        else{
        const form = this.vowel == null?"null":this.vowel.form;
        let alphabets = ",";
        alphabets += (this.onset==null?"":this.onset.toString(true))+","; 
        alphabets += (this.vowel==null?"":this.vowel.toString(true))+","; 
        alphabets += (this.coda==null?"":this.coda.toString(true)); 
        return "S(" + (form ?? "null")+alphabets+")";
        }
    }

    
    //Parse,parse_NL,setSyllable,setNL,toStringの移植
    //やって 
}

export class Parser{

    static ParseAll(raw: string,type:number){

        return Parser.toString(Parser.setNL(Parser.setSyllable(Parser.parse_NL(Parser.parse(raw,type),type),type),type),type);

    }
    static toString(syl: Syllable[],type:number){//正規表現が適応しやすい形（String）に変更する
        let ans = "";
        for(let i = 0;i<syl.length;i++){
            ans += syl[i].toString();
        }
        return ans;
    }

    static setNL(syl : Syllable[],type:number){
        const new_alpha = function(type:string,letter:string){
            const l = letter.split("-");
            const ans = [];
            for(let i = 0;i<l.length;i++){
                ans.push(new Featual(type+(i!=0?"d":"")+","+l[i]))
            }
            return new Alphabet(ans);
        }

        if(type == 0) return syl;
        else{
            doublebreak : for(let i = syl.length-1;i>=0;i--){
                if(syl[i].constructor.name != "Syllable" || syl[i].vowel == null){continue;}
                else if(((syl[i] as Syllable).vowel as Alphabet).getAlphabet() == "N"){
                    if(i == syl.length-1){//最期尾ならvngを挿入
                
                        syl[i].vowel = new_alpha("V","v");
                        syl[i].coda = new_alpha("C","ng");
                    }
                    else{
                        for(let j = i+1;j<=syl.length;j++){
                    //console.log(syl[j][1].length);

                            if(j==syl.length){
                            syl[i].coda = new_alpha("C","ng");
                            break;
                            }
                        else if(syl[i].constructor.name == "Syllable" && syl[j].vowel != null&& LetterManager.getLetter(((syl[j] as Syllable).vowel as Alphabet).featual[0].name)[0].values.isVowel){
                        //ちゃんと母音なら
                            if(syl[j].onset == null){
                            //なにもないなら N->N
                            syl[i].coda = new_alpha("C","ng");
                        }
    //ty|ny|ts|ch なら N -> n
    //(ht -> "tl+sw")
                        else if(syl[j].constructor.name != "Syllable"){}
                        else {
                            const onset_ = ((syl[j] as Syllable).onset as Alphabet).getAlphabet();
                            const table_n =["t","d","ty","n","ny","tl","ch","ht","dh","z","zh"];
                            const table_m =["p","hp","hpy","b","m","my"];

                            if(onset_ == null) {syl[i].coda = new_alpha("C","ng");}
                            else if(typeof onset_ == "string"){
                                if(onset_ == "r"){ //r
                                    syl[i].coda = new_alpha("C","n");
                                    syl[j].onset = new_alpha("C","l");
                                    continue doublebreak;
                                }
                                for(let i = 0;i<table_n.length;i++){
                                    if(onset_ == table_n[i]){ // t,d,ty,n,ny,tl,ht,ch,dh,z,zh
                                    syl[i].coda = new_alpha("C","n");
                                    continue doublebreak;
                                    }
                                }
                                for(let i = 0;i<table_m.length;i++){
                                    if(onset_ == table_m[i]){ // p,hp,hpy,b,m,my
                                    syl[i].coda = new_alpha("C","n-hd");
                                    continue doublebreak;
                                    }
                                }
                                //その他
                                syl[i].coda = new_alpha("C","ng");
                                }
                            }
                        }
                        syl[i].vowel = new_alpha("V","v");
                        break;
                        }
                    }
                }
                else if(((syl[i] as Syllable).vowel as Alphabet).getAlphabet() == "L"){
                //console.log("yay");
                    if(syl[i].onset == null){
                        syl[i].onset = new_alpha("C","l");
                        syl[i].coda = new_alpha("C","l");
                        }
                    else if(((syl[i] as Syllable).onset as Alphabet).getAlphabet() == "r"){
                        syl[i].coda = new_alpha("C","r");
                        }
                    else{
                        syl[i].coda = new_alpha("C","l");
                        }
                    syl[i].vowel = new_alpha("V","v");
                    }
                }
            }
        return syl;
    }

    static setSyllable(raw : Alphabet[],type:number){//Syllableに落とし込む
        const stack_cvdp = function(ls : Alphabet[],isd:boolean){
            //typeに応じてcvdpのラベルを貼る。
            let ans = "";
            for(let l of ls){
                switch(l.type){
                    case "\\ex":
                        ans += "v";
                    break;
                    case "V":
                    case "C":
                    case "P":
                        ans += l.type.toLowerCase();
                    break;
                    case "Vd":
                    case "Cd":
                    case "Pd":
                        ans += l.type.slice(0,1).toUpperCase();
                    break;
                    }
                }
            return ans;
            }
            const stack_cvdp_n = function(ls:Alphabet[],isd:boolean,n:number){
                return stack_cvdp(ls,isd).slice(-n); ///stack_cvdpの後ろからn番目からを返す。
            }

            const makesyl = function(l:Alphabet[]) : Syllable | null{
                let ans;
                const j = stack_cvdp(l,false);
                switch(j){
                    case "p":
                    case "P":
                    case "C":
                    case "V":
                        ans = new Syllable(null,null,null,l[0]);//そのまま返す
                        break;
                    case "c":
                        ans = new Syllable(null,null,null,l[0]);
                        break;
                    case "v":
                        ans = new Syllable(null,l[0],null,null);
                        break;
                    case "cv":
                        ans = new Syllable(l[0],l[1],null,null);
                        break;
                    case "vc":
                        ans = new Syllable(null,l[0],l[1],null);
                        break;
                    case "cvc":
                        ans = new Syllable(l[0],l[1],l[2],null);
                        break;
                    default:
                        ans = null;
                    }
                return ans;
            }
        
            const tosyl = function(ans : Syllable[],cur:Alphabet[],minus:boolean,zero:boolean){//minus,zeroは分ける場所
                //とりあえずぶつ切りにした後
                //cur以外をmakesylにかける
                //minusがonなら、最後以外 cur:最後
                //zeroがonなら、全部 cur:空
                //m,zがonなら、最後以外|最後 cur:空
                if(minus&&zero){
                    const a = makesyl(cur.slice(0,-1));
                    const b = makesyl(cur.slice(-1));
                    if(a != null) ans.push(a);
                    if(b != null) ans.push(b);
                    return [];
                }
                else if(minus){
                    const a = makesyl(cur.slice(0,-1));
                    if(a != null) ans.push(a);
                    return cur.slice(-1);
                }
                else if(zero){
                    const a = makesyl(cur);
                    if(a != null) ans.push(a);
                    return [];
                }
                else{//CVCV用 クソだるい
                    let j = 0;
                    for(let i = cur.length-1;i>=0;i--){
                        j--;
                        if(cur[cur.length+j].type == "C") break;
                    }
                    const a = makesyl(cur.slice(0,j));
                    if(a != null) ans.push(a);
                    return cur.slice(j);
                }
            }
        //getAlphabet()
        const ans :Syllable[]= [];let current:Alphabet[] = [];
        for(const l of raw){
            current.push(l);
            console.log(current);

            if(stack_cvdp([l],false)=="p"){
            current = tosyl(ans,current,true,true);
            //console.log(ans);
            //音節化処理関数をここに。直前|p|にする
            continue;
            }
        if(stack_cvdp([l],false)=="v")//isBondtoPrev == false.
        {
            if(l.getAlphabet() == "N" || l.getAlphabet() == "L"){}
            else{
                if(!(LetterManager.getLetter(l.featual[0].name)[0].values.isBondtoPrev) && !(LetterManager.getLetter(l.featual[0].name)[0].values.isBondtoNext)){
                //音節化処理関数をここに。直前|v|で分ける
                current = tosyl(ans,current,true,true);
                continue;
            }
            else if(!(LetterManager.getLetter(l.featual[0].name)[0].values.isBondtoPrev)){
                //音節化処理関数をここに。直前+v|で分ける
                current = tosyl(ans,current,false,true);
                continue;
            }
            else if(!(LetterManager.getLetter(l.featual[0].name)[0].values.isBondtoNext)){
                //音節化処理関数をここに。直前|vで分ける
                current = tosyl(ans,current,true,false);
                continue;
            }}
        }
        if(stack_cvdp([l],false)=="c")
        {
            if(!(LetterManager.getLetter(l.featual[0].name)[0].values.isBondAsLast)){
                //音節化処理関数をここに。直前+c|で分ける
                current = tosyl(ans,current,false,true);
                continue;
            }
            /*else{
                //音節化処理関数をここに。直前|cで分ける
                current = tosyl(ans,current,true,false);
                continue;
            }*/
        }
        if(current.length>=2){
            if(stack_cvdp_n(current,false,2) == "cc"){
                //音節化処理関数をここに。c|cで分ける
                current = tosyl(ans,current,true,false);
                continue;
            }
            else if(stack_cvdp_n(current,false,2) == "vv"){
                //音節化処理関数をここに。v|vで分ける
                current = tosyl(ans,current,true,false);
                continue;
            }
        }
        if(stack_cvdp(current,false).length==3){
            if(stack_cvdp_n(current,false,3) == "vcv"){
                if(LetterManager.getLetter(l.featual[0].name)[0].values.hasGreedyBond){
                    current = tosyl(ans,current,false,false);
                    //音節化処理関数をここに。CV|CVで分ける
                    continue;
                }
                else{
                    current = tosyl(ans,current,true,false);
                    //音節化処理関数をここに。CVC|Vで分ける
                    continue;
                }
            }
        }
        if(stack_cvdp(current,false).length>=4){
            if(stack_cvdp_n(current,false,4) == "cvcv"){
                if(LetterManager.getLetter(l.featual[0].name)[0].values.hasGreedyBond){
                    current = tosyl(ans,current,false,false);
                    //音節化処理関数をここに。CV|CVで分ける
                    continue;
                }
                else{
                    current = tosyl(ans,current,true,false);
                    //音節化処理関数をここに。CVC|Vで分ける
                    continue;
                }
            }
        }
       }

       if(current.length != 0){const k = makesyl(current);if(k!=null) ans.push(k);}
       return ans;
    }

    static parse_NL(raw : Featual[],type:number){
        const TYPE : {[index:string]:string}= {["CONSONANT"]:"C",["VOWEL"]:"V",["PUNCTUATION"]:"P",
        ["DIACRITIC_C"]:"Cd",["DIACRITIC_V"]:"Vd",["DIACRITIC_P"]:"Pd",
    ["reigai"]:"\\ex"};
        
        let ans = [];
        let ans_sub = []; // new Alphabet();
        for(let i = 0 ;i<raw.length;i++){
            let typ = LetterManager.getLetter(raw[i].name);
            let ty = "";
            if(typ.length == 0) ty = "reigai";
            else ty = typ[0].parent.name;
            raw[i].type = TYPE[ty];
            if(ans_sub.length != 0 && TYPE[ty] == "C" || TYPE[ty] == "V" || TYPE[ty] == "P" || TYPE[ty] == "\\ex" ){
                ans.push(new Alphabet(ans_sub));
                ans_sub = []; //空にする
            }
            ans_sub.push(raw[i]);
        }
        if(ans_sub.length != 0) ans.push(new Alphabet(ans_sub));

        //とりあえず、c,v,cに纏める

        if(type == 0){//東果語の場合。母音とc自身以外に挟まれるcを消す
            //語頭 cc,語中ccc,語後cccも間に"v"を挟む？

            if(ans[0].getAlphabet() == "C"){
                ans[0] = new Alphabet([new Featual("C,c_0")]);
            }
            //else{};

            for(let i = 1 ;i<ans.length-1;i++){
                if(ans[i].getAlphabet() == "C"){
                if(ans[i-1].type != "V" && ans[i-1].getAlphabet() != "c" && ans[i+1].type != "\\v" && ans[i+1].getAlphabet() != "C" ) continue;
                ans[i] = new Alphabet([new Featual("C,c_0")]);  
            }
            }
            if(ans.slice(-1)[0].getAlphabet() == "C"){
                ans.slice(-1)[0] = new Alphabet([new Featual("C,c_0")]); 
            }
        }
        else if(type == 1){//汽陸語の場合 まず無条件に"C"はけす
            if(ans.length == 1){//単独の時
                //(何もしない)
                if(ans[0].type == "\\ex" && ans[0].getAlphabet() == "H") ans[0] = new Alphabet([new Featual("C,h_0")]);
                //Hをhにする
            }
            else{
                //頭が[母音]N,またはN[母音]なら放置。
                //H -> h
                if(ans[0].type == "\\ex" && ans[0].getAlphabet() == "H") ans[0] = new Alphabet([new Featual("C,h_0")]);
                if(ans[0].type == "V" && ans[1].getAlphabet() == "N") ans[1] = new Alphabet([new Featual("C,n_0")]);
                if(ans[0].getAlphabet() == "N" && !(ans[1].type == "V") && !(ans[1].getAlphabet() == "C")) ans[0] = new Alphabet([new Featual("C,n_0")]);
                for(let i = 1 ;i<ans.length-1;i++){
                    //頭が[母音]N,またはN[母音]なら放置。
                    //H -> kh
                    if(ans[i].type == "\\ex" && ans[i].getAlphabet() == "H") ans[i] = new Alphabet([new Featual("C,kh_0")]);
                    if( (ans[i].type == "V" || !(ans[i].getAlphabet() == "L")) && ans[i+1].getAlphabet() == "N") ans[i+1] = new Alphabet([new Featual("C,n_0")]);
                    if(ans[i].getAlphabet() == "N" && !(ans[i+1].type == "V") && !(ans[i+1].getAlphabet() == "C")) ans[i] = new Alphabet([new Featual("C,n_0")]);
                }
            }
        }
        ans = ans.filter(n => n.getAlphabet() != "C");
        return ans;
    }

    static parse(raw : string,type : number){
        //入力文字列 → [letter+letter,letter...]の形で返す
        //変換不能な文字を含んでいるならfalseを返す
        const array = []; 
        let table = Thaqqa_DB.getTable("PARSER_UNIV");
        if(table != null){
            table = (table as DataTable);
            for(let i = 0;i<table.data.length;i++){
            array.push(table.data[i].values);
        }
        } 
        table = Thaqqa_DB.getTable(type == 0?"PARSER_CLOSE":"PARSER_OPEN");
        if(table != null){
            table = (table as DataTable);
            for(let i = 0;i<table.data.length;i++){
                array.push(table.data[i].values);
            }
        }
        
        const sortalg = function(first : {[index: string]: string|boolean|number}, second : {[index: string]: string|boolean|number}){//Priorityの大きい順に並び替える
            if (first.Priority > second.Priority ) return -1;
            else if (first.Priority  < second.Priority )return 1;
            else return 0;
          }
          array.sort(sortalg);

        let raw_ : (string | string[]|Featual)[]= [raw]; //これを分割し続ける

        for(let c = 0;c<array.length;c++){
            // const 変換対象 = array[c];
            const Convert = (array[c].NameAlt as string).split(" ");;
            for(let i = 0;i<raw_.length;i++){
                if(typeof raw_[i] != "string") continue;//飛ばす
                if((array[c].Name as string).startsWith("/")&&(array[c].Name as string).endsWith("/")&&(array[c].Name as string).length>1){
                    const c2 = new RegExp((array[c].Name as string).substring(1, (array[c].Name as string).length-1));
                    if(typeof raw_[i] == "string") raw_[i] = (raw_[i] as string).split(c2);
                }
                else raw_[i] = (raw_[i] as string).split((array[c].Name as string));
                    for(let j = (raw_[i] as string[]).length-1;j>=1;j--){
                        for(let k = Convert.length-1;k>=0;k--){
                            (raw_[i] as (string|Featual)[]).splice(j,0,new Featual(Convert[k]));
                        }
                    }
                let rw : (string |Featual)[]= [];
                for(let j = 0;j<raw_.length;j++){
                    rw = rw.concat(raw_[j]);
                }
                raw_ = rw;
            }
        }
        raw_ = raw_.filter(n => n != "" && n != "+"); //""と「無い」は要らね
        for(let j = 0;j<raw_.length;j++){
            if(typeof raw_[j] == "string") throw Error("変換失敗："+raw_); //将来的にエラーを返す
        }        
        let ans : Featual[] = [];
        for(let i = 0;i<raw_.length;i++){
            let r = raw_[i];
            if(typeof r != "string"){
                if(r instanceof Featual) ans.push(r);
            }
        }
        return ans;
    }
}