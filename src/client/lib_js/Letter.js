import { Thaqqa_DB } from "./deps.js"; //,DataTable,Data
class LetterManager{
    static getLetter(param){
        if(typeof param == "string") param = {Name:param};
        if(param instanceof RegExp) param = {Name:param};
        const tablename = ["VOWEL","CONSONANT","DIACRITIC_C","DIACRITIC_V","PUNCTUATION","DIACRITIC_P"]
        const tables = (function(tn){const j = [];for(let i = 0 ; i<tn.length;i++){
            j.push(Thaqqa_DB.getTable(tn[i]))
        }return j;})(tablename);
        let ans = [];
        for(let i = 0;i<tables.length;i++){
            if(tables[i] instanceof Error){throw tables[i];}
            const data = tables[i].getData(param);
            ans = ans.concat(data);
        }
        return ans;
    }
    static rewriteLetter(param,param2){
        if(typeof param == "string") param = {Name:param};
        if(param instanceof RegExp) param = {Name:param};
        if(typeof param2 == "string") param2 = {Name:param2};
        const tablename = ["VOWEL","CONSONANT","DIACRITIC_C","DIACRITIC_V","PUNCTUATION","DIACRITIC_P"]
        const tables = (function(tn){const j = [];for(let i = 0 ; i<tn.length;i++){j.push(Thaqqa_DB.getTable(tn[i]))}return j;})(tablename);
        let ans = [];
        if(param.Name != null && LetterManager.getLetter(param.Name).length >= 2 && param2.Name!=null)throw new Error("変更後に重複が発生します");
        if(param2.Name != null && LetterManager.getLetter(param2.Name).length != 0)throw new Error("変更後に重複が発生します");
        for(let i = 0;i<tables.length;i++){
            const b = tables[i].rewriteData(param,param2,-1);
            ans = ans.concat(b);
        }
        return ans;
    }
    static deleteLetter(param,safety){
        safety ??= true;
        if(typeof param == "string") param = {Name:param};
        if(param instanceof RegExp) param = {Name:param};
        if(safety && LetterManager.getLetter(param).length > 1) throw new Error("削除対象が2つ以上あります。まとめて削除したい場合はsafetyをfalseに指定してください");
        const tablename = ["VOWEL","CONSONANT","DIACRITIC_C","DIACRITIC_V","PUNCTUATION","DIACRITIC_P"]
        const tables = (function(tn){const j = [];for(let i = 0 ; i<tn.length;i++){j.push(Thaqqa_DB.getTable(tn[i]))}return j;})(tablename);
        let ans = [];
        for(let i = 0;i<tables.length;i++){
            const data = tables[i].deleteData(param,1);
            ans = ans.concat(data);
        }
        return ans;
    }
    static createLetter(param,type){//
        if(LetterManager.getLetter(typeof param == "string"?param:param.Name).length != 0) throw new Error(param+"はすでに存在しています");
        const TYPE = {["\\c"]:"CONSONANT",["\\v"]:"VOWEL",["\\p"]:"PUNCTUATION",
        ["\\cd"]:"DIACRITIC_C",["\\vd"]:"DIACRITIC_V",["\\pd"]:"DIACRITIC_P"};
        let param2;
        if(typeof param == "string"){
            const TEMPLATE = {["CONSONANT"]:{
                Name: param, LoadName: param,
                OnsetGlyphNum: 1, CodaGlyphNum:1,
                isBondAsFirst: true, isBondAsLast:true
                ,Order:0},["VOWEL"]:{Name:param,LoadName:param,
                SolGlyphNum: 1, InitGlyphNum: 1, MidGlyphNum: 2, FinGlyphNum: 4,
                isVowel: true, isNullVowel:false, hasGreedyBond: true, isBondtoPrev: true, isBondtoNext: true
                ,Order:0},["PUNCTUATION"]:{
                    Name: param, LoadName: param,
                     GlyphNum: 1,IsNewline:false,Order:0
                     },
            ["DIACRITIC_C"]:{Name: param, LoadName: param, //'はc,分離符はx
            OnsetGlyphNum: 1, CodaGlyphNum: 1,x_Align:0,y_Align:0
            ,Order:0},
            ["DIACRITIC_V"]:{Name:param,LoadName:param,
                SolGlyphNum: 1, InitGlyphNum: 1, MidGlyphNum: 2, FinGlyphNum: 4,Order:0,x_Align:0,y_Align:0},
            ["DIACRITIC_P"]:{
                Name: param, LoadName: param,
                 GlyphNum: 1
                 ,Order:0,x_Align:0,y_Align:0}};
                 type = TYPE[type]  ?? type;
            param2 = TEMPLATE[type];
        }
        else param2 = param;
        type = TYPE[type]  ?? type;
        const table = Thaqqa_DB.getTable(type);
        
            if(param2 instanceof Error) throw param2;
            if(table instanceof Error) throw table;
            console.log(param2);
            table.createData(param2);
        return null;
    }
}

export {LetterManager};