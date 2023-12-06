
import {RegExp_Khhyl} from  "./RegExp_Khhyl.ts";
import {Thaqqa_DB,DataTable,Data}  from  "./Thaqqa_DB.ts";


export class GSUBManager {

    static getGSUB(table:string, param:RegExp|string|{[index: string]: RegExp|string|boolean|number} ){
        if(table.match(/^(GSUB|GSUB_V|GSUB_H)$/) == null) throw new Error("テーブル指定エラー");
        if(typeof param == "string") param = {Name:param};
        if(param instanceof RegExp) param = {Name:param};
        const tables = Thaqqa_DB.getTable(table);
        let ans : Data[] = [];
        if(tables.constructor.name == "Error") throw tables;
        else{
            const data = (tables as DataTable).getData(param);
            if(data.constructor.name == "Error") throw data;
            else ans = ans.concat(data);
        }
        return ans;
    }

    
    static rewriteGSUB(table : string,param:string|{[index: string]: RegExp|string|boolean|number},param2:string|{[index: string]: string|boolean|number}){
        if(table.match(/^(GSUB|GSUB_V|GSUB_H)$/) == null) throw new Error("テーブル指定エラー");
        if(typeof param == "string") param = {Name:param};
        else if(param instanceof RegExp) param = {Name:param};
        if(typeof param2 == "string") param2 = {Name:param2};
        const tables = Thaqqa_DB.getTable(table);
        let ans : Data[] = [];

            if(param.Name != null && GSUBManager.getGSUB(table,param.Name as string).length >= 2 && param2.Name!=null)throw new Error("変更後に重複が発生します");
            if(param2.Name != null && GSUBManager.getGSUB(table,param2.Name as string).length != 0)throw new Error("変更後に重複が発生します");
            if(tables.constructor.name == "Error") throw tables;
            else{
                    if(tables instanceof Error){throw tables;}
                    const b = (tables as DataTable).rewriteData(param,param2,-1);
                    ans = ans.concat(b);
                }
            return ans;
    }

    static deleteGSUB(table:string, param:RegExp|string|{[index: string]: RegExp|string|boolean|number},safety:boolean){
        if(table.match(/^(GSUB|GSUB_V|GSUB_H)$/) == null) throw new Error("テーブル指定エラー");
        safety ??= true;
        if(typeof param == "string") param = {Name:param};
        if(param instanceof RegExp) param = {Name:param};
        
        if(safety && GSUBManager.getGSUB(table,param).length > 1) throw new Error("削除対象が2つ以上あります。まとめて削除したい場合はsafetyをfalseに指定してください");
        const tables = Thaqqa_DB.getTable(table);
        let ans : Data[] = [];
            if(tables instanceof Error){throw tables;}
            const data = (tables as DataTable).deleteData(param,1);
            ans = ans.concat(data);
            return ans;
    }
    static createGSUB(table:string,param:string|{[index: string]: string|boolean|number}){//
        if(table.match(/^(GSUB|GSUB_V|GSUB_H)$/) == null) throw new Error("テーブル指定エラー");
        if(typeof param == "string") param = {Name:param};

        if(GSUBManager.getGSUB(table,param).length != 0) throw new Error(param+"はすでに存在しています");

        if(typeof param == "string"){
            const TEMPLATE : {[index: string]: {[index: string]:string|boolean|number}}= {
                ["GSUB"]:{
                    Name: param, NameAlt:"", Priority:0},
                ["GSUB_H"]:{
                    Name: param, NameAlt:"", Priority:0},
                ["GSUB_V"]:{
                    Name: param, NameAlt:"", Priority:0},
            };

            param = TEMPLATE[table];
        }
        const table_ = Thaqqa_DB.getTable(table);
        table_.createData(param);
        }

        
    static gsub(text : string,vec:number){

        const array = []; 
        let table = Thaqqa_DB.getTable("GSUB");
            if(table instanceof Error) throw table;
            for(let i = 0;i<table.data.length;i++){
            array.push(table.data[i].values);
        } 
        table = Thaqqa_DB.getTable(vec == 0?"GSUB_H":"GSUB_V");
            if(table instanceof Error) throw table;
            for(let i = 0;i<table.data.length;i++){
                array.push(table.data[i].values);
        }
        const sortalg = function(first : {[index: string]: string|boolean|number}, second: {[index: string]: string|boolean|number}){//Priorityの大きい順に並び替える
            if (first.Priority > second.Priority ) return 1;
                else if (first.Priority  < second.Priority )return -1;
                else return 0;
                }
    array.sort(sortalg);
    //console.log(array);
    for(let i = 0;i<array.length;i++){
        if(typeof array[i].Name == "string"){
        
        let r = new RegExp_Khhyl((array[i].Name as string),{});
        r = r.ParseRegExp()
        const r_ = r.toNormalRegExp();
        //console.log("-------");
        //console.log(array[i].Name);
        //console.log(r_);

        const r_fin = new RegExp(r_, "g");
        //console.log(r_fin);
        text = text.replaceAll(r_fin,(array[i].NameAlt as string));
        //console.log(text);
    }
    }
    return text;
    }
}