export { SVG } from "./SVG.js";


class Database {
    static tableList = [];
    static import(data) {
      for(const t_n in data){
        const t = new DataTable(data[t_n]);
        Database.tableList.push(t);
      }
    }

    static toFontFile(){


    }


   static async load(){
    await fetch('/server/init.json')
  .then(response => response.json())
  .then(data => {
    Database.import(data);
  })
  .catch(error => console.error('Error fetching data:', error));
  }

  //*
  static export(){
    const binaryArray = Database.export_as_Json();
    const blob = new Blob([JSON.stringify(binaryArray, null, '  ')], {type: 'application\/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; 
    link.download = "example.json"; 
    link.click();
  }

    static export_as_Json() {
    const sqlt = Database.tableList;
    const json_data= {};

    for (let j = 0; j < sqlt.length; j++) {
      const table = sqlt[j];
      const table_data= {};

      const column_data = {};
      for (let i = 0; i < table.columnList.length; i++) {
        const tmp = table.columnList[i];
        column_data[tmp.name] = {name:tmp.name,id:tmp.id,type:tmp.type,order:tmp.order,subtype:tmp.subtype};
      }
      table_data.name = table.name;
      table_data.columnList = column_data;
      

      const data_data = {};
      for (let h = 0; h < table.data.length; h++) {
        const value_data = {};
        for (let i = 0; i < table.columnList.length; i++) {
          const c = table.columnList[i]["name"];
          value_data[c] = table.data[h].values[c];
        }
        data_data[h] = value_data;
      }

      table_data.data = data_data;

      json_data[table.name] = table_data;
    }

    return json_data;
  }
   //*/
  static isavailableType(str) {
    if (str == "char" || str == "float" || str == "INTEGER" || str == "bool") {
      return true;
    }
    return false;
  }
  static getTable(name) { //nameのテーブルを返す。無かったらnullで
    for (const i in Database.tableList) {
      if (Database.tableList[i].name == name) return Database.tableList[i];
    }
    throw new Error(name + "というテーブルは存在しません");
  }

  static createTable(name) {
    try {
      for (const i in Database.tableList) {
        if (Database.tableList[i].name == name) {
          const errmessage = name + "というTableは既に存在します";
          throw new Error(errmessage);
        }
      }
      const newtable = new DataTable(name);
      Database.tableList.push(newtable);
    } catch (e) {
      throw e;
    }
  }
  static deleteTable(name) {
    try {
      const table_del = Database.getTable(name);
      if (table_del instanceof Error) throw table_del;
      const index = Database.tableList.indexOf(table_del);
      Database.tableList.splice(index, 1);
    } catch (e) {
      throw e;
    }
  }
  static rewriteTable(name_old, name_new) {
    try {
      let errmessage = "";
      const table_rewrite = Database.getTable(name_old);
      if (table_rewrite instanceof Error) throw table_rewrite;
      if (Database.getTable(name_new) != null) { //既にそのテーブルがある場合の処理
        errmessage += name_new + "というTableは既に存在します";
      }
      if (errmessage != "") throw new Error(errmessage);
      if (table_rewrite != null) table_rewrite.name = name_new;
    } catch (e) {
      throw e;
    }
  }
}

class DataTable {
  constructor(dt) {
    this.name = dt.name;
    this.columnList = []; //{name:"",type:"",desc:"",order:0,subtype : ""}
    this.dataList = [];
    this.desc = ""; //データの説明
    this.load(dt)
  }
  load(dt){
    const COLUMN = dt.column;
    const DATA = dt.data;
    for(const cn in COLUMN){
      const c = COLUMN[cn];
      const k = {name:c.name,type:c.type,desc:c.desc,order:c.order,subtype:c.subtype};
      this.columnList.push(k);
    }
    for(const dn in DATA){
      const d = new Data(this);
      for(const k in DATA[dn]){
        const type = dt.column[k].type;let tmp = DATA[dn][k];
        if(type == "char"){tmp = tmp.toString()}
        else if(type == "bool"){tmp = typeof tmp == "boolean" ? tmp : tmp=="true"}
        else{tmp = Number(tmp);}
        DATA[dn][k] = tmp;
      }
      d.values = DATA[dn];
      this.dataList.push(d);
    }
  }
  getColumn(name) {
    try {
      for (let i = 0; i < this.columnList.length; i++) {
        if (this.columnList[i]["name"] == name) return this.columnList[i];
      }
      return null;
    } catch (e) {
      throw e;
    }
  }
  createColumn(name,type,desc,priorty,val_init) {
    //val_initは未使用 一応後付で作るかも
    try {
      let errmessage = "";
      for (let i = 0; i < this.columnList.length; i++) {
        if (this.columnList[i]["name"] == name) {
          errmessage += name + "というColumnは既に存在します    ";
        }
      }
      if (Database.isavailableType(type) == false) { //そんな型指定できない時の処理
        errmessage += type + "という型は指定できません";
      }
      else if(val_init == null){ //空だったら
          const val_ = {INTEGER:1,float:0.0,bool:false,char:""};
          val_init = val_[type];
        }
        else{ //なんか入ってた場合。
          const val_ = {INTEGER:"number",float:"number",bool:"boolean",char:"string"};
          const val2_ = typeof val_init;
          if(val2_ != val_[type]){errmessage += `${type}"型で${val_init}は初期値に指定できません`;}
          }
      if (errmessage != "") throw new Error(errmessage);
      this.columnList.push({ name: name, type: type ,desc : desc,priorty : priorty});
      for (let i = 0; i < this.DataList.length; i++) {
        this.DataList[i].values[name] = val_init;
      }
    } catch (e) {
      throw e;
    }
  }

  deleteColumn(name) { //使うな
    try {
      const column_del = this.getColumn(name);
      if (column_del == null) { //そんなものがない時の処理
        const errmessage = name + "というColumnは存在しません　　";
        throw new Error(errmessage);
      }
      const index = this.columnList.indexOf(column_del);
      this.columnList.splice(index, 1);
      for (let i = 0; i < this.DataList.length; i++) {
        delete this.DataList[i].values[name];
      }
    } catch (e) {
      throw e;
    }
  }
  rewriteColumn(name_old, name_new,genre) { //あんま使う機会ない
    try {
      genre ??= "name";
      let errmessage = "";
      const rewrite = this.getColumn(name_old);
      if (rewrite == null) { //そんなものがない時の処理
        errmessage += name_old + "というColumnは存在しません　　";
      }
      if (genre == "name"&& this.getColumn(name_new) != null) { //既にそれがある場合の処理
        errmessage += name_new + "というColumnは既に存在します　　";
      }
      //genre = [name,type,desc,order,subtype] 以外だったら
      if (errmessage != "") throw new Error(errmessage);
      if (rewrite != null) rewrite[genre] = name_new;
      if(genre == "name"){
      for (let i = 0; i < this.DataList.length; i++) {
        const newdata = this.DataList[i].values[name_old];
        this.DataList[i].values[name_new] = newdata;
        delete this.DataList[i].values[name_old];
        }
      }
    } catch (e) {
      throw e;
    }
  }

  getData(param_reg) { //param_regは{Name://,...}って感じ
    const errorcol = [];
    try {
      for (const col in param_reg) {
        if (this.getColumn(col) == null) errorcol.push(col);
      }
      if (errorcol.length != 0) {
        const errmessage = "Table名" + this.name +
          "に以下のcolumnは存在しません:" + errorcol;
        throw new Error(errmessage);
      }
      const ans = [];
      skip: for (let i = 0; i < this.dataList.length; i++) {
        for (const col in param_reg) {
          if (param_reg[col] instanceof RegExp) {
            if (!(param_reg[col]).exec(this.dataList[i].values[col].toString())) continue skip;
          }
          else{
            if (param_reg[col] != this.dataList[i].values[col]) continue skip;
          } 
        }
        
        ans.push(this.dataList[i]);
      }
      return ans;
    } catch (e) {
      throw e;
    }
  }

  getLeastID(){
    const IDs = [];
    for(let i=0;i<this.dataList.length;i++){
      IDs.push(this.dataList[i].values.ID);
    }
    IDs.sort((a,b) => (a-b));
    let last = -1;
    for(let i=0;i<IDs.length;i++){
      if(IDs[i]-last > 1) return last+1;
      else last++;
    }
    return Math.max(last+1,0);
  }

  createData(param) { //paramは{Name:"",...}って感じ。IDは不要（自動で付与します）
    let errmessage = "";
    const errorcol = [];
    const ID_ = this.getLeastID();
    param.ID =ID_;
    try {
      skip: for (const col of this.columnList) {
        for (const p in param) {
          if (col.name == p) continue skip;
        }
        errorcol.push(col.name);
      }
      if (errorcol.length != 0) {
        errmessage += "以下のcolumnが不足しています:" + errorcol;
      }
      /*const len = this.getData(param);
            if(len.length) errmessage += "与えた値を満たすDataは既に存在します："+param;*/
      if (errmessage != "") throw new Error(errmessage);
      const data_new = new Data(this);
      data_new.values = param;
      this.dataList.push(data_new);
    } catch (e) {
      throw e;
    }
  }
  //delMAXに負の値を指定してください
  deleteData(param_reg,delMAX) 
  { //param_regは{Name://,...}って感じ
    delMAX ??= 1;
    let errmessage = "";
    const data_del = this.getData(param_reg);
    try {
      if (delMAX >= 0 && data_del.length > delMAX) {
        errmessage += "指定された最大削除可能数(" + delMAX +
          ")を超えています(初期値:1)";
      }
      if (errmessage != "") throw new Error(errmessage);

      for (let i = 0; i < data_del.length; i++) {
        const index = this.dataList.indexOf(data_del[i]);
        this.dataList.splice(index, 1);
      }
    } catch (e) {
      throw e;
    }

    return data_del; //削除したデータ数を返す？
  }
  rewriteData(param_reg,param,reMAX,) { 
    //param_regは{Name://,...}って感じ
    reMAX ??= 1;
    //干渉したデータ数を返す？
    let errmessage = "";
    try {
      const data_del = this.getData(param_reg);
      if (reMAX >= 0 && data_del.length > reMAX) {
        errmessage += "指定された最大変更可能数(" + reMAX +
          ")を超えています(初期値:1)";
      }
      if (errmessage != "") throw new Error(errmessage);

      for (let i = 0; i < data_del.length; i++) {
        for (const p in param) data_del[i].values[p] = param[p];
      }
      return data_del;
    } catch (e) {
      throw e;
    }
  }
}

export default class Data {
    constructor(parent) {
    this.parent = parent;
    this.values = {}; //{name:"",val:""}
  }
}

export {Database,DataTable,Data}