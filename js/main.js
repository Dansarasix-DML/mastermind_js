/**
 * @author Daniel Marín López
 * @version 1.00c
 */

/**
 * Objeto donde está la lógica entera
 * del mastermind.
 */
const mastermind = (function () {

    //Array donde se almacena el objetivo
    let objetivo = [];

    //Array de colores
    const COLORES = [
        "orange", "limegreen", "deepskyblue",
        "crimson", "yellow", "indigo",
        "aqua", "hotpink"
    ];

    /**
     * Función que comprueba la combinación en el array
     * metido por el usuario y devuelve la comprobación.
     * Si todas las bolas son negras saldrá el mensaje
     * de victoria en la consola.
     */
    comprobar = function(intento){

        if (intento.length !== 4) {
            console.log("DEBES METER MÁS/MENOS COLORES");
            return;
        };

        let sol = [];

        const coloresRestantes = [...objetivo];

        intento.forEach((color, index) => {
            if (color === objetivo[index] && coloresRestantes.includes(color)) {
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

    /**
     * Función que inicializa el array objetivo con colores
     * aleatorios que se pueden repetir
     */
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

    /**
     * Función que muestra el objetivo.
     * ADVERTENCIA: ESTA FUNCIÓN NO SE DEBERÍA
     * LLAMAR EN LA VERSIÓN FINAL.
     */
    mostrar = function () {
        console.log(`Tu objetivo es: ${objetivo}`);
    }

    //Función que mapea el array de números por colores
    const aColores = array => array.map(element => COLORES[element]);

    //Parte pública del mastermind
    return {
        init: init,
        comprobar: comprobar,
        mostrar: mostrar,
        COLORES: COLORES
    };

})()

{
    /**
     * Función que dehabilita los botones de colores
     * y hace visible el mensaje de victoria.
     */
    const victoria = () => {
        let set1 = document.querySelector(".set1").getElementsByTagName("div");
        let set2 = document.querySelector(".set2").getElementsByTagName("div");

        const buttons = [...set1, ...set2];

        buttons.forEach(button => button.removeEventListener("click", giveColor));

        document.querySelector(".victoria").style.display = "flex";

        initSound2();
    }
    
    /**
     * Función de los botones de colores para asignar su color
     * a una casilla. Para ello se recogen los intentos y se busca
     * aquel con el data-flag === 0. Una vez encontrado hacemos el
     * mismo procedimiento pero con las casillas y buscamos aquella
     * cuyo data-color esté vacío para asignarle el color.
     */
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

    /**
     * Función que utilizan las casillas para eliminar
     * el color asignado por el jugador anteriormente.
     */
    const deleteColor = function() {
        if (!!this.getAttribute("data-color")) {
            this.classList.remove(this.getAttribute("data-color"));
            this.setAttribute("data-color", "");            
        }
    }

    /**
     * Función para dar comportamiento a las casillas iniciales.
     */
    const behaviourDivs = () => {
        let cells = [...document.querySelector(".part1").querySelectorAll("div")];

        cells.forEach(div => div.addEventListener("click", deleteColor));
    }

    /**
     * Función que comprueba la combinación del jugador
     * usando el comprobar(colors) del objeto mastermind.
     * El flag que devuelve se usará para indicar cuando
     * dar el mensaje de victoria y dehabilitarlo todo.
     * 
     * @param {*} intento HTMLElement
     * @param {*} colors Array
     * @returns boolean
     */
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

    /**
     * Función para asignarle comportamiento al
     * botón de confirmación (✔️)
     */
    const behaviourConf = (clone) => {

        /**
         * Función que recoge los intentos y mediante el data-flag
         * busca el que no haya cambiado (mucho más cómodo que recoger
         * todo de golpe). Una vez encontrado, deshabilita las casillas
         * y comprueba la combinación.
         * 
         * Si es la combinación ganadora, el botón de deshabilita a si
         * mismo y llama a victoria(), si no añade un clon del 
         * div original (nuevo intento). En ambos casos se pone el
         * data-flag = 1
         */
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

    /**
     * Función para asignarle comportamiento a los
     * botones de colores
     */
    const behaviourButtons = () => {
        let set1 = document.querySelector(".set1").getElementsByTagName("div");
        let set2 = document.querySelector(".set2").getElementsByTagName("div");

        const buttons = [...set1, ...set2];

        buttons.forEach(button => button.addEventListener("click", giveColor));
    }

    /**
     * Funciones para asignarle comportamiento a 
     * los botones de victoria, no es recomendable 
     * usar un callback perode bido a que los 
     * botones no se pueden clicar no pasa nada
     */
    const behaviouVictory = () => {
        document.querySelector(".iniciar").addEventListener("click", () => location.reload());
        document.querySelector(".cerrar").addEventListener("click", () => document.querySelector(".victoria").style.display = "none");
    }


    /**
     * Funciones de Ester Eggs
     */
    const initSound = () => {
        document.querySelector(".head1").addEventListener("click", () => document.querySelector(".audio1").play());
    }

    const initSound2 = () => document.querySelector(".audio2").play()

    /**
     * Función para iniciar el comportamiento
     */
    const iniciar = function() {
        const cloneIntento = document.querySelector(".intento").cloneNode(true);
        initSound();
        behaviourButtons();
        behaviourDivs();
        behaviourConf(cloneIntento);
        behaviouVictory();
        init();

    }

    document.addEventListener("DOMContentLoaded", iniciar);

}