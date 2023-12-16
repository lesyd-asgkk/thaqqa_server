class Sandbox_web{
    constructor(loc){
        this.loc = loc; //設置してある場所

    }
    draw(){
        while( this.loc.firstChild ){
            this.loc.removeChild( this.loc.firstChild );
          }
        const text = document.createElement("input");
        text.contentEditable = false;
        text.style.display ="block";
        text.type = "text";
        text.value = "khehyelughun";
        this.loc.appendChild(text);

        for(let i = 0;i<3;i++){
            const option = document.createElement("input");
            option.type = "radio";
            option.name = "vec";
            option.value = i;
            option.checked = (i == 0);
            const text = ["左横書き","右横書き","縦書き"];

            const label = document.createElement("label");
            label.for = option.id;
            label.textContent = text[i];

            this.loc.appendChild(option);
            this.loc.appendChild(label);
        }
        const br =  document.createElement("br");
        this.loc.appendChild(br);
        for(let i = 0;i<2;i++){
            const option2 = document.createElement("input");
            option2.type = "radio";
            option2.name = "lang";
            option2.value = i;
            option2.checked = (i == 0);
            const text = ["東果語","東果汽陸語"];

            const label = document.createElement("label");
            label.for = option2.id;
            label.textContent = text[i];

            this.loc.appendChild(option2);
            this.loc.appendChild(label);
        }

        const drawbutton = document.createElement("input");
        drawbutton.contentEditable = false;
        drawbutton.style.display ="block";
        drawbutton.type = "button";
        drawbutton.value = "表記してみる";
        drawbutton.addEventListener("click",() => {},true);
        this.loc.appendChild(drawbutton);

        let d = "M0,0V100H100V0Z M20,20H80V80H20Z"
        let x0 = 0;
        let x1 = 100;
        let y0 = 0;
        let y1 = 100;

        const object = $("div#storage svg#svgField").clone(false,false)[0];
        while(object.firstChild)object.removeChild(object.firstChild);
        object.style.display ="block";
        const path = $("div#storage svg#svgField path").clone()[0];
        path.setAttribute("fill","none");
        path.setAttribute("stroke","black");
        path.setAttribute("stroke-width",0);
        path.setAttribute("fill","black");
        path.setAttribute("d",d);
        object.appendChild(path);

        const shrink_x = 32/150;
        const HEIGHT = y1-y0;
        const WIDTH = x1-x0;
        object.setAttribute("width",(WIDTH*shrink_x).toString());
        object.setAttribute("height",(HEIGHT*shrink_x).toString());
        object.setAttribute("viewBox",`${x0} ${y0} ${x1} ${y1}`);
        this.loc.appendChild(object);
        
    }
}

export {Sandbox_web};