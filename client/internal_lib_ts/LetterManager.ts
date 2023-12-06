import {Thaqqa_DB,DataTable,Data}  from  "./Thaqqa_DB.ts";

export class LetterManager{
    static getLetter(param:RegExp|string|{[index: string]: RegExp|string|boolean|number}){
        if(typeof param == "string") param = {Name:param};
        if(param instanceof RegExp) param = {Name:param};
        const tablename = ["VOWEL","CONSONANT","DIACRITIC_C","DIACRITIC_V","PUNCTUATION","DIACRITIC_P"]
        const tables = (function(tn){const j = [];for(let i = 0 ; i<tn.length;i++){
            j.push(Thaqqa_DB.getTable(tn[i]))
        }return j;})(tablename);

        let ans : Data[] = [];
            for(let i = 0;i<tables.length;i++){
                if(tables[i] instanceof Error){throw tables[i];}
                const data = (tables[i] as DataTable).getData(param);
                ans = ans.concat(data);
            }
            return ans;
    }

    static getLetter_B(table:string,param:RegExp|string|{[index: string]: RegExp|string|boolean|number}){
        if(typeof param == "string") param = {Name:param};
        if(param instanceof RegExp) param = {Name:param};
        if(table.match(/^(VOWEL|CONSONANT|DIACRITIC_C|DIACRITIC_V|PUNCTUATION|DIACRITIC_P)$/) == null) return new Error("テーブル指定エラー");
        const tablename = [table]
        const tables = (function(tn){const j = [];for(let i = 0 ; i<tn.length;i++){
            j.push(Thaqqa_DB.getTable(tn[i]))
        }return j;})(tablename);

        let ans : Data[] = [];
            for(let i = 0;i<tables.length;i++){
                if(tables[i] instanceof Error){throw tables[i];}
                const data = (tables[i] as DataTable).getData(param);
                ans = ans.concat(data);
            }
            return ans;
    }

    static rewriteLetter(param:string|{[index: string]: RegExp|string|boolean|number},param2:string|{[index: string]: string|boolean|number}){
        if(typeof param == "string") param = {Name:param};
        if(param instanceof RegExp) param = {Name:param};
        if(typeof param2 == "string") param2 = {Name:param2};
        const tablename = ["VOWEL","CONSONANT","DIACRITIC_C","DIACRITIC_V","PUNCTUATION","DIACRITIC_P"]
        const tables = (function(tn){const j = [];for(let i = 0 ; i<tn.length;i++){j.push(Thaqqa_DB.getTable(tn[i]))}return j;})(tablename);
        let ans : Data[] = [];
            if(param.Name != null && LetterManager.getLetter(param.Name as string).length >= 2 && param2.Name!=null)throw new Error("変更後に重複が発生します");
            if(param2.Name != null && LetterManager.getLetter(param2.Name as string).length != 0)throw new Error("変更後に重複が発生します");
            for(let i = 0;i<tables.length;i++){
                const b = tables[i].rewriteData(param,param2,-1);
                ans = ans.concat(b);
            }
            return ans;
    }
    static deleteLetter(param:string|{[index: string]: RegExp|string|boolean|number},safety:boolean){
        safety ??= true;
       
            if(typeof param == "string") param = {Name:param};
            if(param instanceof RegExp) param = {Name:param};
            if(safety && LetterManager.getLetter(param).length > 1) throw new Error("削除対象が2つ以上あります。まとめて削除したい場合はsafetyをfalseに指定してください");
            const tablename = ["VOWEL","CONSONANT","DIACRITIC_C","DIACRITIC_V","PUNCTUATION","DIACRITIC_P"]
            const tables = (function(tn){const j = [];for(let i = 0 ; i<tn.length;i++){j.push(Thaqqa_DB.getTable(tn[i]))}return j;})(tablename);
            let ans : Data[] = [];
            for(let i = 0;i<tables.length;i++){
                const data = tables[i].deleteData(param,1);
                ans = ans.concat(data);
            }
            return ans;

    }
    static createLetter(param:string|{[index: string]: string|boolean|number},type:string){//

        if(LetterManager.getLetter(typeof param == "string"?param:param.Name as string).length != 0) throw new Error(param+"はすでに存在しています");
        const TYPE : {[index: string]: string|boolean|number}= {["\\c"]:"CONSONANT",["\\v"]:"VOWEL",["\\p"]:"PUNCTUATION",
        ["\\cd"]:"DIACRITIC_C",["\\vd"]:"DIACRITIC_V",["\\pd"]:"DIACRITIC_P"};
        
        let param2 : {[index: string]: string|boolean|number};
        if(typeof param == "string"){
            const TEMPLATE : {[index: string]:{[index: string]: string|boolean|number}} = {["\\c"]:{
                Name: param, LoadName: param,
                OnsetGlyphNum: 1, CodaGlyphNum:1,
                isBondAsFirst: true, isBondAsLast:true
                ,Priority:0},["\\v"]:{Name:param,LoadName:param,
                SolGlyphNum: 1, InitGlyphNum: 1, MidGlyphNum: 2, FinGlyphNum: 4,
                isVowel: true, hasGreedyBond: true, isBondtoPrev: true, isBondtoNext: true
                ,Priority:0},["\\p"]:{
                    Name: param, LoadName: param,
                     GlyphNum: 1
                     ,Priority:0},
            ["\\cd"]:{Name: param, LoadName: param, //'はc,分離符はx
            OnsetGlyphNum: 1, CodaGlyphNum: 1
            ,Priority:0},
            ["\\vd"]:{Name:param,LoadName:param,
                SolGlyphNum: 1, InitGlyphNum: 1, MidGlyphNum: 2, FinGlyphNum: 4,Priority:0},
            ["\\pd"]:{
                Name: param, LoadName: param,
                 GlyphNum: 1
                 ,Priority:0}};
            param2 = TEMPLATE[type];
        }
        else param2 = param;
        type = TYPE[type] as string ?? type as string;
        const table = Thaqqa_DB.getTable(type);
        
            if(param2 instanceof Error) throw param2;
            if(table instanceof Error) throw table;
            table.createData(param2 as {[index: string]: string|boolean|number});
        return null;
    }
}