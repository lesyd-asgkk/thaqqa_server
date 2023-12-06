import { DOMParser, Element } from "./deps.ts";
export class LoadFile {
  static loadJSON(path: string) {
    try {
      const file = Deno.readFileSync(path);
      return file;
    } catch (e) {
      return e;
    }
  }

  static loadAllGlyph(path: string) {
    const decoder = new TextDecoder("utf-8");
    const ans: { [index: string]: string } = {};
    for (const filename of Deno.readDirSync(path)) {
      //console.log(path+"/"+filename.name);
      const file = Deno.readFileSync(path + "/" + filename.name);
      const doc = new DOMParser().parseFromString(
        decoder.decode(file),
        "text/html",
      )!;
      const svg = doc.getElementsByTagName("PATH");

      //console.log("\n\n"+filename.name+"\n\n");

      let d = "M0,0";
      for (const a of svg) {
        const b_ = a.getAttribute("d");

        if (b_ != null) {
          d += b_ + "M0,0";
        }
        //console.log(filename.name);
      }
      //d = SVG.toRelative(d);
      //tables.createData({["ID"]:id,["Name"]:filename.name.slice(0,-4),["Path"]:d});
      ans[filename.name.slice(0, -4)] = d;
    }
    return ans;
  }
}
