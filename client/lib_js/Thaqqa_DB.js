
export class Thaqqa_DB {
    static table = [];

    static async async_loadData() {
        const table_backup = Thaqqa_DB.table;
        Thaqqa_DB.table = [];//中身をリセットする
        try {
            const k = await DB.data.exec("select name from sqlite_master where type='table';");
            for (let v of k[0]["values"]) {
                let newtable = new DataTable(v[0]);
                await newtable.async_loadTable();
                Thaqqa_DB.table.push(newtable);
            }
        }
        catch (error) {
            console.error(error);
            Thaqqa_DB.table = table_backup;
            const errmessage = "databaseの読み込みに失敗しました";
            return new Promise(resolve => { resolve(new Error(errmessage)); });
        }
    }
    static async async_saveData() {
        let saved = new SQL.Database();
        try {
            const sqlt = Thaqqa_DB.table;
            for (let j = 0; j < sqlt.length; j++) {
                const table = sqlt[j];
                let create = "CREATE TABLE IF NOT EXISTS " + table.name + "(";
                for (let i = 0; i < table.columns.length; i++) {
                    const c = table.columns[i]["name"];
                    create += c + " ";//columns
                    create += table.columns[i]["type"];//columnsの型
                    create += (i != table.columns.length - 1 ? ", " : "");//最後じゃなかったらコンマをつける
                }
                create += ");"; //);で終わってろ
                //console.log(create);
                await saved.run(create);

                let sqlstr = "";

                for (let h = 0; h < table.data.length; h++) {
                    sqlstr += "INSERT INTO " + table.name + " VALUES ("
                    for (let i = 0; i < table.columns.length; i++) {
                        
                        const c = table.columns[i]["name"];
                        const isnumber = (table.columns[i]["type"] == "INTEGER" || table.columns[i]["type"] == "float");//数字の場合の例外処理
                        const isnumberb = (table.columns[i]["type"] == "INTEGER" || table.columns[i]["type"] == "float" || table.columns[i]["type"] == "bool");//数字の場合の例外処理
                        const str = isnumber ? "" : "'";
                        const val = isnumberb ? table.data[h].values[c] : table.data[h].values[c].split("'").join("''");//'の対策
                        sqlstr += str + val + str + (i != table.columns.length - 1 ? ", " : "");
                    }
                    sqlstr += ");"; //);で終わってろ
                    //console.log(sqlstr);
                    
                }
                console.log(sqlstr);
                await saved.run(sqlstr);
            }
        }
        catch (error) {
            console.error(error);
            const errmessage = "databaseの保存に失敗しました";
            return new Promise(resolve => { resolve(new Error(errmessage)); });
        }
    }
  static isavailableType(str) {
    if (str == "char" || str == "float" || str == "INTEGER" || str == "bool") {
      return true;
    }
    return false;
  }
  static getTable(name) { //nameのテーブルを返す。無かったらnullで
    for (let i = 0; i < Thaqqa_DB.table.length; i++) {
      if (Thaqqa_DB.table[i].name == name) return Thaqqa_DB.table[i];
    }
    throw new Error(name + "というテーブルは存在しません");
  }

  static createTable(name) {
    try {
      for (let i = 0; i < Thaqqa_DB.table.length; i++) {
        if (Thaqqa_DB.table[i].name == name) {
          const errmessage = name + "というTableは既に存在します";
          throw new Error(errmessage);
        }
      }
      const newtable = new DataTable(name);
      Thaqqa_DB.table.push(newtable);
    } catch (e) {
      throw e;
    }
  }
  static deleteTable(name) {
    try {
      const table_del = Thaqqa_DB.getTable(name);
      if (table_del instanceof Error) throw table_del;
      const index = Thaqqa_DB.table.indexOf(table_del);
      Thaqqa_DB.table.splice(index, 1);
    } catch (e) {
      throw e;
    }
  }
  static rewriteTable(name_old, name_new) {
    try {
      let errmessage = "";
      const table_rewrite = Thaqqa_DB.getTable(name_old);
      if (table_rewrite instanceof Error) throw table_rewrite;
      if (Thaqqa_DB.getTable(name_new) != null) { //既にそのテーブルがある場合の処理
        errmessage += name_new + "というTableは既に存在します";
      }
      if (errmessage != "") throw new Error(errmessage);
      if (table_rewrite != null) table_rewrite.name = name_new;
    } catch (e) {
      throw e;
    }
  }
}

export class DataTable {
  static type = "DataTable";
  constructor(name) {
    this.name = name;
    this.columns = []; //{name:"",type:""}
    this.data = [];
  }

  async async_loadTable() {
    try {
        //中身の一覧
        const k = await DB.data.exec('PRAGMA table_info (' + this.name + ")");
        //const k = await DB.data.exec("SELECT * FROM " + this.name );
        for (const v of k[0]["values"]) {
            this.columns.push({name:v[1],type:v[2]});
        }
        const l = (await DB.data.exec("SELECT * FROM " + this.name))[0];
        if (l == null) return true;
        for (const v of l["values"]) {
            let new_data = new Data(this);
            for (const w of l["columns"]) {
                new_data.values[w] = v[l["columns"].indexOf(w)];
            }
            this.data.push(new_data);
        }
    }
    catch (error) {
        console.error(error);
        const errmessage = "tablename" + this.name + "の読み込みに失敗しました";
        return new Promise(resolve => { resolve(new Error(errmessage)); });
    }
}

  getColumn(name) {
    try {
      for (let i = 0; i < this.columns.length; i++) {
        if (this.columns[i]["name"] == name) return this.columns[i];
      }
      throw new Error("name=" + name + "のcolumnは存在しません");
    } catch (e) {
      throw e;
    }
  }

  createColumn(
    name,
    type,
    val_init,
  ) {
    //val_initは未使用 一応後付で作るかも
    try {
      let errmessage = "";

      for (let i = 0; i < this.columns.length; i++) {
        if (this.columns[i]["name"] == name) {
          errmessage += name + "というColumnは既に存在します　　";
        }
      }

      if (Thaqqa_DB.isavailableType(type) == false) { //そんな型指定できない時の処理
        errmessage += type + "という型は指定できません";
      }
      switch (type) {
        case "INTEGER":
          val_init = 0;
          break;
        case "float":
          val_init = 0.0;
          break;
        case "bool":
          val_init = false;
          break;
        case "char":
          val_init = "";
          break;
      }
      /*
            if(不正な値だったら){
                errmessage += type+"型で+"val_init"は初期値に指定できません";
            }
            */
      if (errmessage != "") throw new Error(errmessage);
      this.columns.push({ name: name, type: type });
      for (let i = 0; i < this.data.length; i++) {
        this.data[i].values[name] = val_init;
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
      const index = this.columns.indexOf(column_del);
      this.columns.splice(index, 1);
      for (let i = 0; i < this.data.length; i++) {
        delete this.data[i].values[name];
      }
    } catch (e) {
      throw e;
    }
  }
  rewriteColumn(name_old, name_new) { //あんま使う機会ない
    try {
      let errmessage = "";
      const rewrite = this.getColumn(name_old);
      if (rewrite == null) { //そんなものがない時の処理
        errmessage += name_old + "というColumnは存在しません　　";
      }
      if (this.getColumn(name_new) != null) { //既にそれがある場合の処理
        errmessage += name_new + "というColumnは既に存在します　　";
      }
      if (errmessage != "") throw new Error(errmessage);
      if (rewrite != null) rewrite["name"] = name_new;
      for (let i = 0; i < this.data.length; i++) {
        this.data[i].values[name_new] = this.data[i].values[name_old];
        this.data[i].values[name_old] = "";
        delete this.data[i].values[name_old];
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
      skip: for (let i = 0; i < this.data.length; i++) {
        for (const col in param_reg) {
          if (typeof param_reg[col] === "string") {
            if (param_reg[col] != this.data[i].values[col]) continue skip;
          } else if (param_reg[col] instanceof RegExp) {
            if (
              !(param_reg[col]).exec(
                this.data[i].values[col].toString(),
              )
            ) continue skip;
          }
        }
        ans.push(this.data[i]);
      }
      return ans;
    } catch (e) {
      throw e;
    }
  }
  createData(param) { //paramは{Name:"",...}って感じ
    let errmessage = "";
    const errorcol = [];
    try {
      skip: for (const col of this.columns) {
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
      this.data.push(data_new);
    } catch (e) {
      throw e;
    }
  }
  //delMAXに負の値を指定してください
  deleteData(
    param_reg,
    delMAX,
  ) { //param_regは{Name://,...}って感じ
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
        const index = this.data.indexOf(data_del[i]);
        this.data.splice(index, 1);
      }
    } catch (e) {
      throw e;
    }

    return data_del; //削除したデータ数を返す？
  }
  rewriteData(
    param_reg,
    param,
    reMAX,
  ) { //param_regは{Name://,...}って感じ
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
export class Data {
    constructor(parent) {
    this.parent = parent;
    this.values = {}; //{name:"",val:""}
  }
}
