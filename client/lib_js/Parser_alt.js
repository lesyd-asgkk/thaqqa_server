import { Thaqqa_DB,DataTable,Data } from "./Thaqqa_DB.js";
import { RegExp_Khhyl } from "./RegExp_Khhyl.js";
class Parser_Alt {
    static test(raw,type) {
      const _ParserClose = [
        ["R(A)", "V(null,abig_0)"],
        ["R(a)", "V(null,a_0)"],
        ["R(e)", "V(null,e)"],
        ["R(i)", "V(null,i)"],
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
          "(V(*)|C(null,[_.Name!='c']_.))C(null,c)(C(null,c)*)(V(*)|C(null,[_.Name!='c']_.))",
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
          "(V(*)|C(null,[_.Name!='c']_.))C(null,c)*(V(*)|C(null,[_.Name!='c']_.))",
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
        ["(V(*,[!_.isBondtoPrev&&!_.isBondtoNext]_.))", "Q()$1Q()"],
        ["(V(*,[!_.isBondtoPrev&&_.isBondtoNext]_.))", "Q()$1"],
        ["(V(*,[_.isBondtoPrev&&!_.isBondtoNext]_.))", "$1Q()"],
  
        ["(V(*))(V(*))", "$1Q()$2"],
        ["(C(*))(C(*))", "$1Q()$2"],
  
        ["(V(*)|R(n)|R(l))(C(*))(V(*,[_.hasGreedyBond]_.)|R(n)|R(l))", "$1Q()$2$3"],
        ["(V(*)|R(n)|R(l))(C(*))(V(*,[!_.hasGreedyBond]_.))", "$1$2Q()$3"],
        ["C(*,(*))V((*),(*))C(*,(*))", "S($2,$1,$3,$4)"],
        ["V((*),(*))C(*,(*))", "S($1,,$2,$3)"],
        ["C(*,(*))V((*),(*))", "S($2,$1,$3,)"],
        ["V((*),(*))", "S($1,,$2,)"],
      ];
      //
      let r_ = raw.split("");
    raw = "";
      for(const r of r_){
        raw += `R(${r})`
      }
      let array = _ParserClose.concat(_ParserUniv).concat(_toSyl);
      console.log(array);
      for(let i = 0;i<array.length;i++){
        
        let r = new RegExp_Khhyl(array[i][0],{});
        r = r.ParseRegExp()
        const r_ = r.toNormalRegExp();
        console.log("-------");
        console.log(array[i][0]);
        console.log(r);
        console.log(r_);

        const r_fin = new RegExp(r_, "g");
        //console.log(r_fin);
        raw = raw.replaceAll(r_fin,array[i][1]);
        //console.log(text)
    }
    return raw;
    }
  }
  
export{Parser_Alt};