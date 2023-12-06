export class Featual { //字母
  declare type: string;
  declare name: string;
  declare form: string;
  declare variant: number;
  constructor(param: string) {
    this.type = "null";
    this.name = "null";
    this.form = "null";
    this.variant = 0;
    this.parse(param);
  }
  parse(param: string) { // \(文字種),form,name_variant または name_variant
    const a = param.split(",");
    if (a.length >= 2) {
      this.type = a[0];
      if (a.length == 3) this.type = a[1];
    }
    const b = a.slice(-1)[0].split("_");
    this.name = b[0];
    this.variant = b[1] == null ? 0 : (Number(b[1]) ?? 0);
  }
  toString(isShort: boolean) {
    if (isShort == false) {
      return this.type + "(" + this.form + "," + this.name +
        (this.variant != null ? "_" + this.variant : "") + ")";
    }
    return this.name + (this.variant != null ? "_" + this.variant : "");
  }
}

export class Alphabet {
  declare featual: Featual[];
  declare type: string;
  declare form: string;
  constructor(featual: Featual[]) {
    this.featual = featual; //featualの配列を入れること
    this.type = featual[0].type;
    this.form = "null";
  }
  toString(isShort: boolean) {
    let featuals = "";
    for (let i = 0; i < this.featual.length; i++) {
      featuals += this.featual[i].toString(true);
      featuals += i != this.featual.length - 1 ? "-" : "";
    }
    if (isShort == true) {
      return featuals;
    }
    return this.type + "(" +
      ((this.type == "P" || this.type == "Pd") ? "" : this.form + ",") +
      featuals + ")";
  }
  getAlphabet() {
    if (this.type == "P" || this.type == "\\ex") return this.featual[0].name;
    /*
    (d -> "t+d")    (p -> "t+hd")    (ty -> "t+sy")
    (ky -> "k+sy")    (kw -> "k+sw")    (g -> "k+d")
    (hq -> "q+hd")    (qw -> "q+sw")

    (m -> "n+hd")    (ny -> "n+sy")
    (ngy -> "ng+sy")    (ngw -> "ng+sw")

    dh -> "th+d"    (f -> "th+hd")
    z -> "s+d"
    (sh/sy -> "s+sy")
    zh(/zy) -> "hy+d"
    gh -> "kh+d"
    rh -> "qh+d"
    (hw -> "qh+hw")
    hh -> "h+d"

    ry -> "r+sy"

    (ht -> "tl+sw")(ch -> "tl+sy")
        */

    const conv2: { [index: string]: string } = {
      ["t-d"]: "d",
      ["t-hd"]: "p",
      ["t-sy"]: "ty",
      ["k-d"]: "g",
      ["k-sy"]: "ky",
      ["k-sw"]: "kw",
      ["q-hd"]: "hq",
      ["q-sw"]: "qw",

      ["n-hd"]: "m",
      ["n-sy"]: "ny",
      ["ng-sy"]: "ngy",
      ["ng-sw"]: "ngw",

      ["th-d"]: "dh",
      ["th-hd"]: "f",
      ["s-d"]: "z",
      ["s-sy"]: "sy",
      ["hy-d"]: "zh",
      ["kh-d"]: "gh",
      ["qh-d"]: "rh",
      ["qh-sw"]: "hw",
      ["h-d"]: "hh",

      ["r-sy"]: "ry",
      ["tl-sw"]: "ht",
      ["tl-sy"]: "ch",
    };
    /*
    (b -> "t+d+hd")
    (my -> "n+hd+sy")
    (hp = "th+hd+sw")
    (hpy = "th+hd+sy")
    */
    const conv3: { [index: string]: string } = {
      ["t-d-hd"]: "b",
      ["n-hd-sy"]: "my",
      ["th-hd-sw"]: "hp",
      ["th-hd-sy"]: "hpy",
    };
    if (this.featual.length == 1) {
      return this.featual[0].name;
    } else if (this.featual.length == 2) {
      const n = this.featual[0].name + "-" + this.featual[1].name;
      return conv2[n] ?? n;
    } else if (this.featual.length == 3) {
      const n = this.featual[0].name + "-" + this.featual[1].name + "-" +
        this.featual[2].name;
      return conv3[n] ?? n;
    }
    return null;
  }
}

export class Syllable {
  declare onset?: Alphabet | null;
  declare vowel?: Alphabet | null;
  declare coda?: Alphabet | null;
  declare misc?: Alphabet | null;
  constructor(
    onset: Alphabet | null,
    vowel: Alphabet | null,
    coda: Alphabet | null,
    misc: Alphabet | null,
  ) {
    this.onset = onset;
    this.vowel = vowel;
    this.coda = coda;
    this.misc = misc;
  }

  toString() {
    if (this.misc != null) {
      return this.misc.toString(false);
    } else {
      const form = this.vowel == null ? "null" : this.vowel.form;
      let alphabets = ",";
      alphabets += (this.onset == null ? "" : this.onset.toString(true)) + ",";
      alphabets += (this.vowel == null ? "" : this.vowel.toString(true)) + ",";
      alphabets += this.coda == null ? "" : this.coda.toString(true);
      return "S(" + (form ?? "null") + alphabets + ")";
    }
  }

  //R()ベースの変換規則を作る。面倒癖ーーーーー
  //
}

export class Parser_Alt {
  static test() {
    const _ParserClose = [
      ["R(A)", "V(null,abig_0)"],
      ["R(a)", "V(null,a_0)"],
      ["R(e)", "V(null,e)"],
      ["i", "V(null,i)"],
      ["R(o)", "V(null,o_0)"],
      ["R(u)", "V(null,u_0)"],
      ["R(v|ö)", "V(null,v_0)"],
      ["R(E|ë)", "V(null,eold_0)"],
      ["R(I|ï)", "V(null,iold_0)"],
      ["R(t)", "C(null,t_0)"],
      ["R(k)", "C(null,k_0)"],
      ["R(q)", "C(null,q_0)"],
      ["R(')", "C(null,c_0)"],
      ["R(n)", "C(null,n_0)"],
      ["R(ng)", "C(null,ng_0)"],
      ["R(t)R(h)", "C(null,th_0)"],
      ["R(s)", "C(null,s_0)"],
      ["R(h)R(y)", "C(null,hy_0)"],
      ["R(k)R(h)", "C(null,kh_0)"],
      ["R(q)R(h)", "C(null,qh_0)"],
      ["R(h)", "C(null,h_0)"],
      ["R(d)R(h)", "C(null,th_0-d_0)"],
      ["R(z)", "C(null,s_0-d_0)"],
      ["R(z)R(h)", "C(null,hy_0-d_0)"],
      ["R(g)R(h)", "C(null,kh_0-d_0)"],
      ["R(r)R(h)", "C(null,qh_0-d_0)"],
      ["R(c)", "C(null,h_0-d_0)"],
      ["R(l)", "C(null,l_0)"],
      ["R(r)", "C(null,r_0)"],
      ["R(t)R(l)", "C(null,tl_0)"],
      ["R(y)", "C(null,y_0)"],
      ["R(w)", "C(null,w_0)"],
      [
        "(V(*)|C(null,[r.name!='c']_.))C(null,c)(C(null,c)*)(V(*)|C(null,[r.name!='c']_.))",
        "$1$2$3",
      ],
    ];

    //[aiueov]
    //[bcdfghjklmnpqrstwxyz']

    // ^n$ -> CM
    //^Cn -> CM
    // C$ -> CM
    //^nC -> MC
    //nn -> nM
    //nC -> nC
    //n[^V]) -> nM
    const _ParserOpen = [
      ["R(A)", "V(null,abig_0)"],
      ["R(a)", "V(null,a_0)"],
      ["R(e)", "V(null,e)"],
      ["i", "V(null,i)"],
      ["R(o)", "V(null,o_0)"],
      ["R(u)", "V(null,u_0)"],
      ["R(v|ö)", "V(null,v_0)"],
      ["R(E|ë)", "V(null,eold_0)"],
      ["R(I|ï)", "V(null,iold_0)"],
      ["R(p)", "C(null,t_0-hd_0)"],
      ["R(h)R(p)", "C(null,th_0-hd_0)"],
      ["R(h)R(p)R(y)", "C(null,th_0-hd_0-sy_0)"],
      ["R(b)", "C(null,t_0-d_0-hd_0)"],
      ["R(t)R(s)", "C(null,tl_0)"],
      ["R(h)R(t)", "C(null,tl_0-hd_0)"],
      ["R(c)R(h)", "C(null,tl_0-sy_0)"],
      ["R(t)", "C(null,t_0)"],
      ["R(t)R(y)", "C(null,t_0-sy_0)"],
      ["R(d)", "C(null,t_0-d_0)"],
      ["R(k)", "C(null,k_0)"],
      ["R(k)R(y)", "C(null,k_0-sy_0)"],
      ["R(k)R(w)", "C(null,k_0-sw_0)"],
      ["R(q)", "C(null,q_0)"],
      ["R(q)R(w)", "C(null,q_0-sw_0)"],
      ["R(h)R(q)", "C(null,q_0-hd_0)"],
      ["R(m)", "C(null,n_0-hd_0)"],
      ["R(m)", "C(null,n_0-hd_0-sy_0)"],
      ["R(n)R(y)", "C(null,n_0-sy_0)"],
      ["R(n)R(g)", "C(null,ng_0)"],
      ["R(n)R(g)R(y)", "C(null,ng_0-sy_0)"],
      ["R(n)R(g)R(w)", "C(null,ng_0-sw_0)"],
      ["R(t)R(h)", "C(null,th_0)"],
      ["R(d)R(h)", "C(null,th_0-d_0)"],
      ["R(s)", "C(null,s_0)"],
      ["R(s)R(y)", "C(null,s_0-sy_0)"],
      ["R(z)", "C(null,s_0-d_0)"],
      ["R(z)R(h)", "C(null,hy_0-d_0)"],
      ["R(h)R(y)", "C(null,hy_0)"],
      ["R(k)R(h)", "C(null,kh_0)"],
      ["R(h)R(w)", "C(null,qh_0-sw_0)"],
      ["H", "C(null,h_0)"],

      ["R(r)", "C(null,r_0)"],
      ["R(r)R(y)", "C(null,r_0-sy_0)"],
      ["R(')", "C(null,c_0)"],
      ["R(y)", "C(null,y_0)"],
      ["R(w)", "C(null,w_0)"],

      //hの処理
      ["(C(*)|V(*))R(h)", "$1C(null,kh_0)"],
      ["(^|P(*))R(h)", "$1C(null,h_0)"],

      //音節内にて、
      //nの処理.とりあえずvng,ngを生やす。参考:https://webutubutu.com/webdesign/10266

      //lの処理.とりあえずl(ry

      //'の削除
      [
        "(V(*)|C(null,[r.name!='c']_.))C(null,c)*(V(*)|C(null,[r.name!='c']_.))",
        "$1$2",
      ],
    ];
    const _ParserUniv = [
      ["R( )", "P(space_0)"],
      ['R(\\")', "V(null,br_0)"],
      ["R(\\.)", "P(period_0)"],
      ["R(,)", "P(comma_0)"],
      ["R(-)", "V(null,hyphen_0)"],
      ["R(\\n)", "P(newline_0)"],
    ];
    // :V: -> |V|
    // V: -> V|
    // :V -> |V
    // CC -> C|C
    // VV -> V|V
    // VCVgr -> V|CV
    // VCVxgr -> VC|V

    const _toSyl = [
      ["(V(*,[!_.isBondtoPrev&&!_.isBondtoNext]))", "P()$1P()"],
      ["(V(*,[!_.isBondtoPrev&&_.isBondtoNext]))", "P()$1"],
      ["(V(*,[_.isBondtoPrev&&!_.isBondtoNext]))", "$1P()"],

      ["(V(*))(V(*))", "$1P()$2"],
      ["(C(*))(C(*))", "$1P()$2"],

      ["(V(*)|R(n)|R(l))(C(*))(V(*,[_.hasGreedyBond])|R(n)|R(l))", "$1P()$2$3"],
      ["(V(*)|R(n)|R(l))(C(*))(V(*,[!_.hasGreedyBond]))", "$1$2P()$3"],
    ];
    //
  }
}
