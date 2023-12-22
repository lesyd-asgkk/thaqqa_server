export {Table_web} from "./table.js";
export {DIVparam_web,DIVselect_web,Button_web,SVGField_web} from "./tbelm.js";
export {Sandbox_web} from "./sandbox.js";

/*
<table>
              <tr class = "項目">
                <td>Id</td>
                <td>Name</td>
                <td>LoadName</td>
                <td>SolGlyphNum</td>
                <td>InitGlyphNum</td>
                <td>MidGlyphNum</td>
                <td>FinGlyphNum</td>
                <td>isVowel</td>
                <td>hasGreedyBond</td>
                <td>isBondtoPrev</td>
                <td>isBondtoNext</td>
                <td>Priority</td>
              </tr>
              <tr class = "項目">
                <td>内部id</td>
                <td>名前</td>
                <td>読み込みファイル名</td>
                <td>独字グリフ数</td>
                <td>頭字グリフ数</td>
                <td>中字グリフ数</td>
                <td>尾字グリフ数</td>
                <td>母音か</td>
                <td>前の子音と優先的に結合するか</td>
                <td>前の子音と結合するか</td>
                <td>後の子音と結合するか</td>
                <td>文字順</td>
              </tr>
              <tr class = "項目">
                <td>&nbsp;</td>
                <td>char</td>
                <td>char</td>
                <td>int</td>
                <td>int</td>
                <td>int</td>
                <td>int</td>
                <td>bool</td>
                <td>bool</td>
                <td>bool</td>
                <td>bool</td>
                <td>int</td>
              </tr>
              <tr class = "data" id = "1">
                <td>1</td>
                
                <td>a</td>
                <td>a</td>
                <td>1</td>
                <td>1</td>
                <td>2</td>
                <td>4</td>
                <td>true</td>
                <td>true</td>
                <td>true</td>
                <td>true</td>
                <td>0</td>
              </tr>
              <tr class = "data svg"  id = "1">
                <td>&nbsp;</td>
              <td colspan="11">ここにSVG</td>

            </tr>
          </div>
              
            </table>
            </div>






            
      const _ParserClose = [
        ["R(A)", "V(null,abig_0)",1],
        ["R(a)", "V(null,a_0)",1],
        ["R(e)", "V(null,e_0)",1],
        ["R(i)", "V(null,i_0)",1],
        ["R(o)", "V(null,o_0)",1],
        ["R(u)", "V(null,u_0)",1],
        ["R(v|ö)", "V(null,v_0)",1],
        ["R(E|ë)", "V(null,eold_0)",1],
        ["R(I|ï)", "V(null,iold_0)",1],
        ["R(t)", "C(null,t_0)",1],
        ["R(k)", "C(null,k_0)",1],
        ["R(q)", "C(null,q_0)",1],
        ["R(')", "C(null,c_0)",1],
        ["R(n)", "C(null,n_0)",1],
        ["R(n)R(g)", "C(null,ng_0)",2],
        ["R(t)R(h)", "C(null,th_0)",2],
        ["R(s)", "C(null,s_0)",1],
        ["R(h)R(y)", "C(null,hy_0)",2],
        ["R(k)R(h)", "C(null,kh_0)",2],
        ["R(q)R(h)", "C(null,qh_0)",2],
        ["R(h)", "C(null,h_0)",1],
        ["R(d)R(h)", "C(null,th_0-d_0)",2],
        ["R(z)", "C(null,s_0-d_0)",1],
        ["R(z)R(h)", "C(null,hy_0-d_0)",2],
        ["R(g)R(h)", "C(null,kh_0-d_0)",2],
        ["R(r)R(h)", "C(null,qh_0-d_0)",2],
        ["R(c)", "C(null,h_0-d_0)",1],
        ["R(l)", "C(null,l_0)",1],
        ["R(r)", "C(null,r_0)",1],
        ["R(t)R(l)", "C(null,tl_0)",2],
        ["R(y)", "C(null,y_0)",1],
        ["R(w)", "C(null,w_0)",1],
        ["(V(*,(?:a|e|i|o|u|v|eold|iold|abig))){2}(C(*)|(P(*)|$))","$1C(null,c_0)$2",0],

        ["(V(*,a)){2}(V(*,[_.Name!='a']))","$1C(null,c_0)$2",0],
        ["(V(*,e)){2}(V(*,[_.Name!='e']))","$1C(null,c_0)$2",0],
        ["(V(*,i)){2}(V(*,[_.Name!='i']))","$1C(null,c_0)$2",0],
        ["(V(*,o)){2}(V(*,[_.Name!='o']))","$1C(null,c_0)$2",0],
        ["(V(*,u)){2}(V(*,[_.Name!='u']))","$1C(null,c_0)$2",0],
        ["(V(*,v)){2}(V(*,[_.Name!='v']))","$1C(null,c_0)$2",0],
        ["(V(*,eold)){2}(V(*,[_.Name!='eold']))","$1C(null,c_0)$2",0],
        ["(V(*,iold)){2}(V(*,[_.Name!='iold']))","$1C(null,c_0)$2",0],
        ["(V(*,abig)){2}(V(*,[_.Name!='abig']))","$1C(null,c_0)$2",0],
        [
          "(V(*)|C(*,[_.Name!='c']_.))C(*,c)(V(*)|C(*,[_.Name!='c']_.))",
          "$1$2",0
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
        ["R(A)", "V(null,abig_0)",1],
        ["R(a)", "V(null,a_0)",1],
        ["R(e)", "V(null,e_0)",1],
        ["R(i)", "V(null,i_0)",1],
        ["R(o)", "V(null,o_0)",1],
        ["R(u)", "V(null,u_0)",1],
        ["R(v|ö)", "V(null,v_0)",1],
        ["R(E|ë)", "V(null,eold_0)",1],
        ["R(I|ï)", "V(null,iold_0)",1],
        ["R(p)", "C(null,t_0-hd_0)",1],
        ["R(h)R(p)", "C(null,th_0-hd_0)",1],
        ["R(h)R(p)R(y)", "C(null,th_0-hd_0-sy_0)",3],
        ["R(b)", "C(null,t_0-d_0-hd_0)",1],
        ["R(t)R(s)", "C(null,tl_0)",2],
        ["R(h)R(t)", "C(null,tl_0-hd_0)",2],
        ["R(c)R(h)", "C(null,tl_0-sy_0)",2],
        ["R(t)", "C(null,t_0)",1],
        ["R(t)R(y)", "C(null,t_0-sy_0)",2],
        ["R(d)", "C(null,t_0-d_0)",1],
        ["R(k)", "C(null,k_0)",1],
        ["R(k)R(y)", "C(null,k_0-sy_0)",2],
        ["R(k)R(w)", "C(null,k_0-sw_0)",2],
        ["R(q)", "C(null,q_0)",1],
        ["R(q)R(w)", "C(null,q_0-sw_0)",2],
        ["R(h)R(q)", "C(null,q_0-hd_0)",2],
        ["R(m)", "C(null,n_0-hd_0)",1],
        ["R(m)R(y)", "C(null,n_0-hd_0-sy_0)",2],
        ["R(n)R(y)", "C(null,n_0-sy_0)",2],
        ["R(n)R(g)", "C(null,ng_0)",2],
        ["R(n)R(g)R(y)", "C(null,ng_0-sy_0)",3],
        ["R(n)R(g)R(w)", "C(null,ng_0-sw_0)",3],
        ["R(t)R(h)", "C(null,th_0)",2],
        ["R(d)R(h)", "C(null,th_0-d_0)",2],
        ["R(s)", "C(null,s_0)",1],
        ["R(s)R(y)", "C(null,s_0-sy_0)",2],
        ["R(z)", "C(null,s_0-d_0)",1],
        ["R(z)R(h)", "C(null,hy_0-d_0)",2],
        ["R(h)R(y)", "C(null,hy_0)",2],
        ["R(k)R(h)", "C(null,kh_0)",2],
        ["R(h)R(w)", "C(null,qh_0-sw_0)",2],
  
        ["R(r)", "C(null,r_0)",1],
        ["R(r)R(y)", "C(null,r_0-sy_0)",2],
        ["R(')", "C(null,c_0)",1],
        ["R(y)", "C(null,y_0)",1],
        ["R(w)", "C(null,w_0)",1],
  
        //hの処理
        ["(C(*)|V(*))R(h)", "$1C(null,kh_0)",-10],
        ["(^|P(*))R(h)", "$1C(null,h_0)",-10],

        ["(^|P(*))R(n)(V(*,(?:a|e|i|o|u|v|eold|iold|abig))|C(*,c)|R(l))","$1C(null,n_0)$2",-15],
        ["(V(*,(?:a|e|i|o|u|v|eold|iold|abig))|R(l))R(n)(V(*,(?:a|e|i|o|u|v|eold|iold|abig))|R(l))","$1C(null,n_0)$2",-15],
        ["(^|P(*))R(n)R(n)","$1C(null,n_0)R(n)",-15],
        ["R(n)R(n)","R(n)C(null,n_0)",-15],
                // V(*,a|e|i|o|u|v|eold|iold|abig)|C(*,c))R(n) -> $1C(null,n)
        //音節内にて、
        //nの処理.とりあえずvng,ngを生やす。参考:https://webutubutu.com/webdesign/10266
  
        //lの処理.とりあえずl(ry
  
        //'の削除
        [
          "(V(*)|C(null,[_.Name!='c']_.))C(null,c)*(V(*)|C(null,[_.Name!='c']_.))",
          "$1$2",-20
        ],
      ];
      const _ParserUniv = [
        ["R( )", "P(space_0)",1],
        ['R(\\")', "V(null,br_0)",1],
        ["R(\\.)", "P(period_0)",1],
        ["R(,)", "P(comma_0)",1],
        ["R(-)", "V(null,hyphen_0)",1],
        ["R(\\n)", "P(newline_0)",1],
      ];
      // :V: -> |V|
      // V: -> V|
      // :V -> |V
      // CC -> C|C
      // VV -> V|V
      // VCVgr -> V|CV
      // VCVxgr -> VC|V
  
      const _toSyl = [
        ["(V(*,[!_.isBondtoPrev&&!_.isBondtoNext]_.))", "Q()$1Q()",-20],
        ["(V(*,[!_.isBondtoPrev&&_.isBondtoNext]_.))", "Q()$1",-20],
        ["(V(*,[_.isBondtoPrev&&!_.isBondtoNext]_.))", "$1Q()",-20],
  
        ["(V(*)|R(n)|R(l))(V(*)|R(n)|R(l))", "$1Q()$2",-20],
        ["(C(*))(C(*))", "$1Q()$2",-20],
  
        ["(V(*)|R(n)|R(l))(C(*))(V(*,[_.hasGreedyBond]_.)|R(n)|R(l))", "$1Q()$2$3",-20],
        ["(V(*)|R(n)|R(l))(C(*))(V(*,[_.hasGreedyBond]_.)|R(n)|R(l))", "$1Q()$2$3",-20],
        ["(V(*)|R(n)|R(l))(C(*))(V(*,[!_.hasGreedyBond]_.))", "$1$2Q()$3",-20],

        ["(Q())+P()(Q())+", "P()",-20],
        ["(Q())+", "Q()",-20],


        ["(^|P())R(n)(P()|$)","$1C(null,ng_0)V(null,v_0)C(null,ng_0)$2",-20],
        //"t","d","ty","n","ny","tl","ch","ht","dh","z","zh"
        //"p","hp","hpy","b","m","my"
        ["R(n)(Q()C(*,(?:t|d|n|tl)|(?:(?:t|tl|n)-sy)|(?:(?:t|th|s|hy)-d)|(?:tl-w)))","V(null,v_0)C(null,n_0)$1",-20],
        ["R(n)(Q()C(*,(?:(?:t|th|n)-hd)|(?:(?:t)-d-hd)|(?:(?:tl|n)-hd-sy)|(?:th-hd-sw))","V(null,v_0)C(null,n_0+hd_0)$1",-20],
        ["R(n)Q()R(l)","V(null,v_0)C(null,n_0)Q()C(null,l_0)R(l)",-20],
        ["R(n)(Q()(?:C(*)|V(*)|P(*)|$))","V(null,v_0)C(null,ng_0)$1",-20],

        ["(C(*,r))R(l)","$1V(null,v_0)C(null,r_0)",-20],
        ["(P()|Q())R(l)(P()|Q())","$1C(null,l_0)V(null,v_0)C(null,l_0)$2",-20],
        ["R(l)","V(null,v_0)C(null,l_0)",-20],
        ["R(n)","V(null,v_0)",-20],
        

        ["C(*,(*))V((*),(*))C(*,(*))", "S($2,$1,$3,$4)",-20],
        ["V((*),(*))C(*,(*))", "S($1,,$2,$3)",-20],
        ["C(*,(*))V((*),(*))", "S($2,$1,$3,)",-20],
        ["V((*),(*))", "S($1,,$2,)",-20],
        ["Q()", "",-30],
      ];
*/