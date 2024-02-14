/**
 * @author Daniel Marín López
 * @version 0.01a
 */


const mastermind = (function () {

    let objetivo = [];

    const COLORES = [
        "orange", "limegreen", "deepskyblue",
        "crimson", "yellow", "indigo",
        "aqua", "hotpink"
    ];

    comprobar = function(intento){

        if (intento.length !== 4) {
            console.log("DEBES METER MÁS/MENOS COLORES");
            return;
        };

        let sol = [];

        const coloresRestantes = [...objetivo];

        intento.forEach((color, index) => {
            if (color === objetivo[index]) {
                sol.push("black");
                coloresRestantes.splice(coloresRestantes.indexOf(color), 1);
            } else if (coloresRestantes.includes(color)) {
                sol.push("white");
                coloresRestantes.splice(coloresRestantes.indexOf(color), 1);
            } else sol.push("znone");
        });
        
        if (sol.every(value => value == "black")) {
            console.log("¡HAS GANADO!");
        } else console.log(`Tu comprobación es ${sol}`);

        return sol.sort();
    }

    init = function(){

        console.log(`
            #################################################
            ########### Bienvenido al MasterMind ############
            #################################################
        `);

        do {
            objetivo.push(Math.floor(Math.random()*COLORES.length));
        } while (objetivo.length < 4);

        objetivo = aColores(objetivo);
    }

    mostrar = function () {
        console.log(`Tu objetivo es: ${objetivo}`);
    }

    const aColores = array => array.map(element => COLORES[element]);

    return {
        init: init,
        comprobar: comprobar,
        mostrar: mostrar,
        COLORES: COLORES
    };

})()

{
    const victoria = () => {
        let set1 = document.querySelector(".set1").getElementsByTagName("div");
        let set2 = document.querySelector(".set2").getElementsByTagName("div");

        const buttons = [...set1, ...set2];

        buttons.forEach(button => button.removeEventListener("click", giveColor));

        document.querySelector(".victoria").style.display = "flex";
    }
    
    const giveColor = function () {
        let intentos = [...document.querySelectorAll(".intento")];

        const intento = intentos.find(intento => intento.getAttribute("data-flag") === "0");

        if (intento) {
            let cells = [...intento.querySelector(".part1").querySelectorAll("div")];
            const divToColor = cells.find(div => !div.getAttribute("data-color"));
    
            if (divToColor) {
                divToColor.setAttribute("data-color", this.className);
                divToColor.classList.add(this.className);
            }            
        }
    }

    const deleteColor = function() {
        if (!!this.getAttribute("data-color")) {
            this.classList.remove(this.getAttribute("data-color"));
            this.setAttribute("data-color", "");            
        }
    }

    const behaviourDivs = () => {
        let cells = [...document.querySelector(".part1").querySelectorAll("div")];

        cells.forEach(div => div.addEventListener("click", deleteColor));
    }

    const comprobación = (intento, colors) => {
        let cells = [...intento.querySelector(".part2").querySelectorAll("div")];
        const resultado = comprobar(colors);
        cells.forEach((div, i) => {
            div.setAttribute("data-color", resultado[i]);
            div.classList.add(resultado[i]);
        });

        let flag = (resultado.every(value => value == "black")) ? true : false;

        return flag;

    }

    const behaviourConf = (clone) => {

        const handleClick = () => {
            let intentos = [...document.querySelectorAll(".intento")];
            
            let newClone = clone.cloneNode(true);
            let newCells = [...newClone.querySelector(".part1").querySelectorAll("div")];

            const intento = intentos.find(intento => intento.getAttribute("data-flag") === "0");

            if (intento) {
                let colors = [];
                let cells = [...intento.querySelector(".part1").querySelectorAll("div")];
    
                if (cells.every(div => !!div.getAttribute("data-color"))) {
                    cells.forEach(div => {
                        div.removeEventListener("click", deleteColor);
                        colors.push(div.getAttribute("data-color"));
                    });
                    if(comprobación(intento, colors)){
                        document.querySelector(".boton").removeEventListener("click", handleClick);
                        victoria();
                    } else {
                        newCells.forEach(div => div.addEventListener("click", deleteColor));
                        document.querySelector("main").insertAdjacentElement("beforeend", newClone);
                    }; 
                    intento.setAttribute("data-flag", "1");                    
                }
            }
        }

        document.querySelector(".boton").addEventListener("click", handleClick);

    }

    const behaviourButtons = () => {
        let set1 = document.querySelector(".set1").getElementsByTagName("div");
        let set2 = document.querySelector(".set2").getElementsByTagName("div");

        const buttons = [...set1, ...set2];

        buttons.forEach(button => button.addEventListener("click", giveColor));
    }

    const behaviouVictory = () => {
        document.querySelector(".iniciar").addEventListener("click", () => location.reload());
        document.querySelector(".cerrar").addEventListener("click", () => document.querySelector(".victoria").style.display = "none");
    }

    const iniciar = function() {
        const cloneIntento = document.querySelector(".intento").cloneNode(true);
        
        behaviourButtons();
        behaviourDivs();
        behaviourConf(cloneIntento);
        behaviouVictory();
        init();

    }

    document.addEventListener("DOMContentLoaded", iniciar);

}