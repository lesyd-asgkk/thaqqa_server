import { Thaqqa_DB,DataTable,Data } from "./Thaqqa_DB.js";
import { RegExp_Khhyl } from "./RegExp_Khhyl.js";
class GPOSManager {
    
    static setGPOSColumn(id){
        const table = Thaqqa_DB.getTable("GPOS");
        const GPOSdata = table.getData( {ID:id});//{Name:/.*/g} {ID:id}
        console.log(GPOSdata);
        for(let i = 0;i<GPOSdata.length;i++){
            let r = new RegExp_Khhyl(GPOSdata[i].values.Name,{});
            r = r.ParseRegExp()
            const r_ = r.toNormalRegExp();
            table.rewriteData({ID:GPOSdata[i].values.ID},{Parsed:r_});
            //,Ablidged : r_.split(",")[2]
        }
/*
        const v_ = khhyl.Thaqqa_DB.getTable("VOWEL").getData({Name:/.+/g});

        for(let i = 0;i<GPOSdata.length;i++){
                let r = new RegExp_Khhyl(GPOSdata[i].values.Name,{});
                r = r.ParseRegExp()
                const r_ = r.toNormalRegExp().split("(")[1].join().split(")").slice(0,-1).join().split(",");
                
                const r_form = new RegExp(r_[0], "g");
                const r_gomi = new RegExp(r_[2], "g");
                for(let x =0;x<text_a.length;x++){
                    if(text[x].match(r_form)
                }
                for(let x =0;x<text_b.length;x++){
                    
                }
                

                if(text.match(r_form)){
                    ans.x0 += GPOSdata[i].values.OffsetX0 ;
                    ans.y0 += GPOSdata[i].values.OffsetY0 ;
                    ans.x1 += GPOSdata[i].values.OffsetX1 ;
                    ans.y1 += GPOSdata[i].values.OffsetY1 ;
                }
            }*/
    }
    static getGPOS(param) {
        
            if(typeof param == "string") param = {Name:param};
            if(param instanceof RegExp) param = {Name:param};
            const tables = Thaqqa_DB.getTable("GPOS");
            let ans = [];
                const data = tables.getData(param);
                //console.log(data);
                ans = ans.concat(data);
            return ans;
        }
    
        
        static rewriteGPOS(param){
            
            if(typeof param == "string") param = {Name:param};
            else if(param instanceof RegExp) param = {Name:param};
            if(typeof param2 == "string") param2 = {Name:param2};
            const tables = Thaqqa_DB.getTable("GPOS");
            const ans  = [];
            const GPOS_a = GPOSManager.getGPOS(param.Name);
            const GPOS_b = GPOSManager.getGPOS(param.Name);
                if(param.Name != null && GPOS_a.length >= 2 && param2.Name!=null)throw new Error("変更後に重複が発生します");
                if(param2.Name != null && GPOS_b.length != 0)throw new Error("変更後に重複が発生します");

            const b = tables.rewriteData(param,param2,-1);
            ans.concat(b);
            
            return ans;

        }
    
        static deleteGPOS(param,safety){
            safety ??= true;
            if(typeof param == "string") param = {Name:param};
            if(param instanceof RegExp) param = {Name:param};
            
            if(safety && GPOSManager.getGPOS(param).length > 1) return new Error("削除対象が2つ以上あります。まとめて削除したい場合はsafetyをfalseに指定してください");
            const tables = Thaqqa_DB.getTable("GPOS");
            let ans = [];
                const data = tables.deleteData(param,1);
                ans = ans.concat(data);
                return ans;
                

        }
        static createGPOS(param){//
            if(typeof param == "string") param = {Name:param};
    
            if(GPOSManager.getGPOS(param).length != 0) return new Error(param+"はすでに存在しています");
    
            if(typeof param == "string"){
                param ={Name: param, Pattern:"u",Pattern_sub:"DIAC",OffsetX0: 0, OffsetY0: 0,OffsetX1: 0,OffsetY1: 0, Priority:0};
            }
            const table_ = Thaqqa_DB.getTable(table);
            table_.createData(param);

            }

    /*
    static gpos_ex(text,vec){
        let y = 0;
        const array = [];
        const table = Thaqqa_DB.getTable(vec == 0?"GPOS_EX_H":"GPOS_EX_V");
            if(table instanceof Error) throw table;
            for(let i = 0;i<table.data.length;i++){
            array.push(table.data[i].values);
        } 
        const sortalg = function(first, second){//Priorityの大きい順に並び替える
            if (first.Priority > second.Priority ) return 1;
                else if (first.Priority  < second.Priority )return -1;
                else return 0;
                }
        array.sort(sortalg);
        if(table != null){
            for(let i = 0;i<table.data.length;i++){
        
                let r = new RegExp_Khhyl(array[i].Name,{});
                r = r.ParseRegExp()
                const r_ = r.toNormalRegExp();
                //console.log("-------");
                //console.log(array[i].Name);
                //console.log(r_);
        
                const r_fin = new RegExp(r_, "g");
                //console.log(r_fin);
                if(text.match(r_fin)){
                    if(typeof table.data[i].values.OffsetY == "number") y += table.data[i].values.OffsetY ;
                }
            }
        } 
        return y;
    }
    static gpos_in(text,vec){
        let x0 = 0;
        let y0 = 0;
        let x1 = 0;
        let y1 = 0;
        const array = [];
        const table = Thaqqa_DB.getTable(vec == 0?"GPOS_IN_H":"GPOS_IN_V");

            if(table instanceof Error) throw table;
            for(let i = 0;i<table.data.length;i++){
            array.push(table.data[i].values);
        } 
        const sortalg = function(first , second){//Priorityの大きい順に並び替える
            if (first.Priority > second.Priority ) return 1;
                else if (first.Priority  < second.Priority )return -1;
                else return 0;
                }
        array.sort(sortalg);
            for(let i = 0;i<table.data.length;i++){
                let r = new RegExp_Khhyl(array[i].Name,{});
                r = r.ParseRegExp()
                const r_ = r.toNormalRegExp();
               //console.log("-------");
                //console.log(array[i].Name);
                //console.log(r_);
        
                const r_fin = new RegExp(r_, "g");
                //console.log(r_fin);
                if(text.match(r_fin)){
                    x0 += table.data[i].values.OffsetX0;
                    y0 += table.data[i].values.OffsetY0;
                    x1 += table.data[i].values.OffsetX1;
                    y1 += table.data[i].values.OffsetY1;
                }
            }
            return {x0:x0,y0:y0,x1:x1,y1:y1};

        
    }
    static gpos_diac(text,_vec){
        let x = 0;
        let y = 0;
        const array = [];
        const table = Thaqqa_DB.getTable("GPOS_DIAC");
            if(table instanceof Error) throw table;
            for(let i = 0;i<table.data.length;i++){
            array.push(table.data[i].values);
        } 
        const sortalg = function(first , second){//Priorityの大きい順に並び替える
            if (first.Priority > second.Priority ) return 1;
                else if (first.Priority  < second.Priority )return -1;
                else return 0;
                }
        array.sort(sortalg);
        console.log(text);
            for(let i = 0;i<table.data.length;i++){
                let r = new RegExp_Khhyl(array[i].Name,{});
                r = r.ParseRegExp()
                const r_ = r.toNormalRegExp();
                //console.log("-------");
                //console.log(array[i].Name);
                //console.log(r_);
        
                const r_fin = new RegExp(r_, "g");
                //console.log(r_fin);
                if(text.match(r_fin)){
                    x += array[i].OffsetX ;
                    y += array[i].OffsetY ;
                }
            }
            return {x:x,y:y};
        
    }*/

    static gpos(text,vec,rule){

        //gposINの内部処理について
        //真面目に処理すると膨大すぎてパンクする。
        //そこで予め、[Nameの母音部分]にマッチする母音全てを紐づける→[Nameのform部分](ry
        //これで高々総当り回数は324回程度となる。

        //console.log(vec);
        //console.log(rule);
        const ans = {x0:0,y0:0,x1:0,y1:0}
        
        const GPOSdata =  GPOSManager.getGPOS({Pattern:(vec==0?/(u|v)/:/(u|h)/),Pattern_sub:rule});
        //console.log(GPOSdata);
        for(let i = 0;i<GPOSdata.length;i++){
            //if(rule == "IN" && text.match(new RegExp(GPOSdata[i].values.Ablidged, "g")) == null) continue;
                const r_fin = new RegExp((rule == "EX" ? "^": "")+GPOSdata[i].values.Parsed+(rule == "EX" ? "$": ""), "g");
                
                if(text.match(r_fin) != null){
                    console.log(text);
                    console.log(GPOSdata[i].values.Name);
                    ans.x0 += GPOSdata[i].values.OffsetX0 ;
                    ans.y0 += GPOSdata[i].values.OffsetY0 ;
                    ans.x1 += GPOSdata[i].values.OffsetX1 ;
                    ans.y1 += GPOSdata[i].values.OffsetY1 ;
                }
            }
            return ans;
        
    }
}

export{GPOSManager};