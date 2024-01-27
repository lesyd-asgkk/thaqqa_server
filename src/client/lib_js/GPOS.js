import { Thaqqa_DB,DataTable,Data } from "./Thaqqa_DB.js";
import { RegExp_Khhyl } from "./RegExp_Khhyl.js";
class GPOSManager {
    
    static setGPOSColumn(id){
        const table = Thaqqa_DB.getTable("GPOS");
        const GPOSdata = table.data //table.getData( {ID:id});//
        for(let i = 0;i<GPOSdata.length;i++){
            console.log(GPOSdata[i].values.ID)
            let r = new RegExp_Khhyl(GPOSdata[i].values.Name,{});
            r = r.ParseRegExp()
            const r_ = r.toNormalRegExp();
            table.rewriteData({ID:GPOSdata[i].values.ID},{Parsed:r_});
        }
    }
    static getGPOS(param) {
        
            if(typeof param == "string") param = {Name:param};
            if(param instanceof RegExp) param = {Name:param};
            const tables = Thaqqa_DB.getTable("GPOS");
            let ans = [];
                const data = tables.getData(param);
                ans = ans.concat(data);
            return ans;
        }
    
        
        static rewriteGPOS(param,param2){
            
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

    static gpos(text,vec,rule){

        //gposINの内部処理について
        //真面目に処理すると膨大すぎてパンクする。
        
        //そこで
        //まず「常識的に取りうる範囲の全てのoffset集」を計算しておく
        //非常識な値のみ個別計算
        //これで多分解決

        const ans = {x0:0,y0:0,x1:0,y1:0}
        
        const GPOSdata =  GPOSManager.getGPOS({Pattern:(vec==0?/(u|v)/:/(u|h)/),Pattern_sub:rule});
        for(let i = 0;i<GPOSdata.length;i++){
            //if(rule == "IN" && text.match(new RegExp(GPOSdata[i].values.Ablidged, "g")) == null) continue;
                const r_fin = new RegExp((rule == "EX" ? "^": "")+GPOSdata[i].values.Parsed+(rule == "EX" ? "$": ""), "g");
                
                if(text.match(r_fin) != null){
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