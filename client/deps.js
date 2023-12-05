{const filename = 
    ["Thaqqa_DB.js","Glyph.js",
    "GPOS.js","GSUB.js",
    "Letter.js","Parser.js","Parser_alt.js",
    "RegExp_Khhyl.js","Rek_def.js",
    "SVG.js",
];

for(const f of filename)
document.write(`<script type = 'module' src=\"./lib_js/${f}\"></script> `);

}