/*


export class SVGManager{
    static loadAllGlyph(path : string){
        const decoder = new TextDecoder("utf-8");
        let id = 0;
        for  (const filename of Deno.readDirSync(path)) {
            //console.log(path+"/"+filename.name);
            const file = Deno.readFileSync(path+"/"+filename.name);
            const doc = new DOMParser().parseFromString(decoder.decode(file), 'text/html')!;
            const svg = doc.getElementsByTagName("PATH");

           //console.log("\n\n"+filename.name+"\n\n");
            const tables = Thaqqa_DB.getTable("GLYPH");


            let d = "M0,0";
            for(const a of svg) {

                const b_ = a.getAttribute("d");

                if(b_ != null)
                {
                    d += b_ + "M0,0";
                }
                //console.log(filename.name);

            }
            d = SVG.toRelative(d);
            tables.createData({["ID"]:id,["Name"]:filename.name.slice(0,-4),["Path"]:d});
            id += 1;
        }
    }
    static getSVG(name:string){
        const ans = [];
        const table = Thaqqa_DB.getTable("GLYPH");
        const data = table.getData({Name:name});
            for(let i = 0;i<data.length;i++)ans.push(data[i].values.Path);
            return ans;
        }

    static createGSUB(param:string|{[index: string]: string|boolean|number}){//

        if(typeof param == "string") param = {Name:param};

        if(SVGManager.getSVG((param.Name as string)).length != 0) throw new Error(param+"はすでに存在しています");

        const table_ = Thaqqa_DB.getTable("GLYPH");
        table_.createData(param);
        }
    }


*/
