function getSelectValues(select) {
    var result = [];
    var options = select && select.options;
    var opt;
  
    for (var i=0, iLen=options.length; i<iLen; i++) {
        opt = options[i];
  
        if (opt.selected) {
            result.push(opt.value || opt.text);
        }
    }
    return result;
}

window.addEventListener("load",function(){
    document.getElementById("inp-pret").onchange=function(){
        document.getElementById("infoRange").innerHTML=`(${this.value})`
    }


    //document.getElementById("filtrare").addEventListener("click",function(){})
    document.getElementById("filtrare").onclick = function(){
        var inpNume = document.getElementById("inp-nume").value.trim().toLowerCase();
        var inpIngrediente = document.getElementById("inp-ingrediente").value.trim().toLowerCase();
        var vRadio = document.getElementsByName("gr-rad");
        var inpGramaj = "toate";
        for(let r of vRadio)
        {
            if(r.checked)
            {
                inpGramaj = r.value;
                break;
            }
        }

        let minGramaj, maxGramaj;
        if(inpGramaj!="toate")
        {
            var aux = inpGramaj.split(":")
            minGramaj = parseInt(aux[0])
            maxGramaj = parseInt(aux[1])
        }

        var inpPret = parseInt(document.getElementById("inp-pret").value)

        var inpDim = document.getElementById("inp-dimensiune").value.trim().toLowerCase();
        var inpDim2 = getSelectValues(document.getElementById("inp-dimensiune2"));

        var vCheck = document.getElementsByName("gr_check");
        var inpDim3 = [];
        for(let c of vCheck)
        {
            if(c.checked)
            {
                inpDim3.push(c.value || c.text);;
            }
        }

        var produse = document.getElementsByClassName("produs");
        /*
        var valid = true;
        if(inpNume.contains("/"))
            valid = false;

        console.log(valid);*/

        for(let produs of produse)
        {
            let valNume = produs.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();
            let cond1 = valNume.startsWith(inpNume)

            let valGramaj = parseInt(produs.getElementsByClassName("val-gramaj")[0].innerHTML);
            let cond2 = (inpGramaj=="toate" || (minGramaj <= valGramaj && valGramaj <maxGramaj))

            let valPret = parseFloat(produs.getElementsByClassName("val-pret")[0].innerHTML);
            let cond3 = valPret>inpPret;

            let valDimensiune = produs.getElementsByClassName("val-dimensiune")[0].innerHTML.trim().toLowerCase();
            let cond4 = (inpDim == "toate") || (inpDim == valDimensiune);

            let valIngrediente = produs.getElementsByClassName("val-ingrediente")[0].innerHTML.trim().toLowerCase();
            let cond5 = valIngrediente.includes(inpIngrediente);

            let valDimensiune2 = produs.getElementsByClassName("val-dimensiune")[0].innerHTML.trim().toLowerCase();
            let cond6 = !(inpDim2.includes(valDimensiune2));

            let valDimensiune3 = produs.getElementsByClassName("val-dimensiune")[0].innerHTML.trim().toLowerCase();
            let cond7 = inpDim3.includes(valDimensiune3);

            if(cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7)
            {
                produs.style.display="grid";
            }else
            {
                produs.style.display="none";
            }
        }
    }

    document.getElementById("resetare").onclick= function(){
        
        if(confirm("Doriti sa resetati filtrele?")==true)
        {
            document.getElementById("inp-nume").value="";
            document.getElementById("inp-ingrediente").value="";
            document.getElementById("inp-pret").value=document.getElementById("inp-pret").min;
            document.getElementById("inp-dimensiune").value="toate";
            document.getElementById("inp-dimensiune2").value="niciuna";
            document.getElementById("i_rad4").checked=true;
            var vCheck = document.getElementsByName("gr_check");
            for(let c of vCheck)
            {
                c.checked = true;
            }
            var produse=document.getElementsByClassName("produs");
            document.getElementById("infoRange").innerHTML="(0)";
            for (let prod of produse){
                prod.style.display="grid";
            }
        }
    }

    function sorteaza(semn){
        var produse = document.getElementsByClassName("produs");
        var v_produse = Array.from(produse);
        v_produse.sort(function(a,b){
            let dim_a = a.getElementsByClassName("val-dimensiune")[0].innerHTML;
            let dim_b = b.getElementsByClassName("val-dimensiune")[0].innerHTML;
            if(dim_a == dim_b){
                let pret_a = parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML);
                let pret_b = parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML);
                return semn * (pret_a-pret_b);
            }
            return semn * (dim_a.localeCompare(dim_b));
        })
        for(let prod of v_produse){
            prod.parentNode.appendChild(prod);
        }

    }

    document.getElementById("sortCrescNume").onclick = function(){sorteaza(1)}
    document.getElementById("sortDescrescNume").onclick = function(){sorteaza(-1)}

    window.onkeydown = function(e){
        if(e.key == "c" && e.altKey){
            var suma = 0;
            var produse = document.getElementsByClassName("produs");
            for(let produs of produse){
                var stil = getComputedStyle(produs);
                if(stil.display != "none"){
                    suma+=parseFloat(produs.getElementsByClassName("val-pret")[0].innerHTML);
                }
            }
            if(!document.getElementById("par_suma")){
                let p = document.createElement("p");
                p.innerHTML = suma;
                p.id="par_suma";
                let container = document.getElementById("produse");
                container.insertBefore(p, container.children[0]);
                setTimeout(function(){
                    let par = document.getElementById("par_suma")
                    if(par){
                        par.remove()
                    }
                }, 2000);
            }
        }
    }
})
