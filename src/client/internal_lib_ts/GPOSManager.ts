
import {RegExp_Khhyl} from  "./RegExp_Khhyl.ts";
import {Thaqqa_DB,DataTable,Data}  from  "./Thaqqa_DB.ts";

export class GPOSManager {
    
    static getGPOS(table:string,param:string|{[index: string]: RegExp|string|boolean|number}) {
            if(table.match(/^(GPOS_DIAC|GPOS_IN_V|GPOS_IN_H|GPOS_EX_V|GPOS_EX_H)$/) == null) throw new Error("テーブル指定エラー");
            if(typeof param == "string") param = {Name:param};
            if(param instanceof RegExp) param = {Name:param};
            const tables = Thaqqa_DB.getTable(table);
            let ans : Data[] = [];
                const data = tables.getData(param);
                ans = ans.concat(data);
            return ans;
        }
    
        
        static rewriteGPOS(table : string,param:string|{[index: string]: RegExp|string|boolean|number},param2:string|{[index: string]: string|boolean|number}){
            if(table.match(/^(GPOS_DIAC|GPOS_IN_V|GPOS_IN_H|GPOS_EX_V|GPOS_EX_H)$/) == null) return new Error("テーブル指定エラー");
            if(typeof param == "string") param = {Name:param};
            else if(param instanceof RegExp) param = {Name:param};
            if(typeof param2 == "string") param2 = {Name:param2};
            const tables = Thaqqa_DB.getTable(table);
            const ans : Data[] = [];
            const GPOS_a = GPOSManager.getGPOS(table,param.Name as string);
            const GPOS_b = GPOSManager.getGPOS(table,param.Name as string);
                if(param.Name != null && GPOS_a.length >= 2 && param2.Name!=null)throw new Error("変更後に重複が発生します");
                if(param2.Name != null && GPOS_b.length != 0)throw new Error("変更後に重複が発生します");

            const b = tables.rewriteData(param,param2,-1);
            ans.concat(b);
            
            return ans;

        }
    
        static deleteGPOS(table:string, param:RegExp|string|{[index: string]: RegExp|string|boolean|number},safety:boolean){
            if(table.match(/^(GPOS_DIAC|GPOS_IN_V|GPOS_IN_H|GPOS_EX_V|GPOS_EX_H)$/) == null) return new Error("テーブル指定エラー");
            safety ??= true;
            if(typeof param == "string") param = {Name:param};
            if(param instanceof RegExp) param = {Name:param};
            
            if(safety && GPOSManager.getGPOS(table,param).length > 1) return new Error("削除対象が2つ以上あります。まとめて削除したい場合はsafetyをfalseに指定してください");
            const tables = Thaqqa_DB.getTable(table);
            let ans : Data[] = [];
                const data = tables.deleteData(param,1);
                ans = ans.concat(data);
                return ans;
                

        }
        static createGPOS(table:string,param:string|{[index: string]: string|boolean|number}){//
            if(table.match(/^(GPOS_DIAC|GPOS_IN_V|GPOS_IN_H|GPOS_EX_V|GPOS_EX_H)$/) == null) return new Error("テーブル指定エラー");
            if(typeof param == "string") param = {Name:param};
    
            if(GPOSManager.getGPOS(table,param).length != 0) return new Error(param+"はすでに存在しています");
    
            if(typeof param == "string"){
                const TEMPLATE : {[index: string]: {[index: string]:string|boolean|number}}= {["GPOS_DIAC"]:{
                    Name: param, OffsetX: 0,OffsetY: 0,Group:"", Priority:0},
                    ["GPOS_IN_V"]:{
                        Name: param, OffsetX0: 0, OffsetY0: 0,OffsetX1: 0,OffsetY1: 0,Group:"", Priority:0},
                    ["GPOS_IN_H"]:{
                        Name: param, OffsetX0: 0, OffsetY0: 0,OffsetX1: 0,OffsetY1: 0,Group:"", Priority:0},
                    ["GPOS_EX_V"]:{
                        Name: param, OffsetY: 0,Group:"",Priority:0},
                    ["GPOS_EX_H"]:{
                        Name: param, OffsetY: 0,Group:"",Priority:0}
                    };
    
                param = TEMPLATE[table];
            }
            const table_ = Thaqqa_DB.getTable(table);
            table_.createData(param);

            }
    
    static gpos_ex(text : string,vec:number){
        let y = 0;
        const array : {[index: string]: string|boolean|number}[] = [];
        const table = Thaqqa_DB.getTable(vec == 0?"GPOS_EX_H":"GPOS_EX_V");
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
        if(table != null){
            for(let i = 0;i<table.data.length;i++){
        
                let r = new RegExp_Khhyl((array[i].Name as string),{});
                r = r.ParseRegExp()
                const r_ = r.toNormalRegExp();
                //console.log("-------");
                //console.log(array[i].Name);
                //console.log(r_);
        
                const r_fin = new RegExp(r_, "g");
                //console.log(r_fin);
                if(text.match(r_fin)){
                    if(typeof table.data[i].values.OffsetY == "number") y += (table.data[i].values.OffsetY as number);
                }
            }
        } 
        return y;
    }
    static gpos_in(text : string,vec:number){
        let x0 = 0;
        let y0 = 0;
        let x1 = 0;
        let y1 = 0;
        const array : {[index: string]: string|boolean|number}[] = [];
        const table = Thaqqa_DB.getTable(vec == 0?"GPOS_IN_H":"GPOS_IN_V");

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
            for(let i = 0;i<table.data.length;i++){
                let r = new RegExp_Khhyl((array[i].Name as string),{});
                r = r.ParseRegExp()
                const r_ = r.toNormalRegExp();
               //console.log("-------");
                //console.log(array[i].Name);
                //console.log(r_);
        
                const r_fin = new RegExp(r_, "g");
                //console.log(r_fin);
                if(text.match(r_fin)){
                    x0 += (table.data[i].values.OffsetX0 as number);
                    y0 += (table.data[i].values.OffsetY0 as number);
                    x1 += (table.data[i].values.OffsetX1 as number);
                    y1 += (table.data[i].values.OffsetY1 as number);
                }
            }
            return {x0:x0,y0:y0,x1:x1,y1:y1};

        
    }
    static gpos_diac(text : string,_vec:number){
        let x = 0;
        let y = 0;
        const array : {[index: string]: string|boolean|number}[] = [];
        const table = Thaqqa_DB.getTable("GPOS_DIAC");
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
        console.log(text);
            for(let i = 0;i<table.data.length;i++){
                let r = new RegExp_Khhyl((array[i].Name as string),{});
                r = r.ParseRegExp()
                const r_ = r.toNormalRegExp();
                //console.log("-------");
                //console.log(array[i].Name);
                //console.log(r_);
        
                const r_fin = new RegExp(r_, "g");
                //console.log(r_fin);
                if(text.match(r_fin)){
                    x += array[i].OffsetX as number;
                    y += array[i].OffsetY as number;
                }
            }
            return {x:x,y:y};
        
    }
    
}