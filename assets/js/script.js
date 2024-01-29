let intentoActual = 1;
const maxIntentos = 6;
let palabraObjetivo = "";
let longitudPalabra;

const urlApi = "https://challenge.trio.dev/api/v1/wordle-words#";

function obtenerPalabraDeLaAPI() {
    fetch(urlApi)
        .then(response => {
            if (response.ok) {
                return response.json(); 
            } else {
                throw new Error('Error en la solicitud: ' + response.statusText);
            }
        })
        .then(data => {
            seleccionarPalabraObjetivo(data);
        })
        .catch(error => {
            console.error('Hubo un problema con la operación fetch: ' + error.message);
        });
}

function seleccionarPalabraObjetivo(palabras) {
    if (palabras.length > 0) {
        const indiceAleatorio = Math.floor(Math.random() * palabras.length);
        palabraObjetivo = palabras[indiceAleatorio].toLowerCase();
        longitudPalabra = palabraObjetivo.length;
        console.log("Palabra Objetivo:", palabraObjetivo);
        inicializarJuego();
    }
}

function inicializarJuego() {
    for (let i = 1; i <= maxIntentos; i++) {
        for (let j = 1; j <= longitudPalabra; j++) {
            let campo = document.getElementById('char' + i + '-' + j);
            campo.value = ''; // Limpiar campos
            campo.classList.remove('correcto', 'posicionIncorrecta', 'incorrecto');

            // Habilitar solo los campos de la primera fila
            if (i === 1) {
                campo.removeAttribute('disabled');
            } else {
                campo.setAttribute('disabled', true);
            }
        }
    }

    configurarMovimientoCampos();
}

function verificarPalabra() {
    let intento = "";
    for (let i = 1; i <= longitudPalabra; i++) {
        intento += document.getElementById('char' + intentoActual + '-' + i).value.toLowerCase();
    }

    if (intento.length < longitudPalabra) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    evaluarIntento(intento);

    if (intento === palabraObjetivo) {
        alert('¡Adivinaste la palabra!');
        finalizarJuego();
    } else if (intentoActual === maxIntentos) {
        alert('Fin del juego. No adivinaste la palabra: ' + palabraObjetivo);
        finalizarJuego();
    } else {
        prepararSiguienteIntento();
    }
}

function evaluarIntento(intento) {
    let letrasObjetivo = palabraObjetivo.split('');

    for (let i = 1; i <= longitudPalabra; i++) {
        let letraIntento = intento[i - 1];
        let campoTexto = document.getElementById('char' + intentoActual + '-' + i);

        campoTexto.classList.remove('correcto', 'posicionIncorrecta', 'incorrecto');

        if (letraIntento === letrasObjetivo[i - 1]) {
            campoTexto.classList.add('correcto');
        } else if (letrasObjetivo.includes(letraIntento)) {
            campoTexto.classList.add('posicionIncorrecta');
        } else {
            campoTexto.classList.add('incorrecto');
        }
    }
}

function prepararSiguienteIntento() {

        // Deshabilitar la fila actual
        cambiarEstadoFila(intentoActual, true);

        // Incrementar el intento actual
        intentoActual++;
    
        // Habilitar la siguiente fila y establecer el enfoque en el primer campo
        if (intentoActual <= maxIntentos) {
            cambiarEstadoFila(intentoActual, false);
            document.getElementById('char' + intentoActual + '-1').focus();
        }
}


function cambiarEstadoFila(numFila, deshabilitar) {
    for (let i = 1; i <= longitudPalabra; i++) {
        let campo = document.getElementById('char' + numFila + '-' + i);
        deshabilitar ? campo.setAttribute('disabled', true) : campo.removeAttribute('disabled');
    }
}

function finalizarJuego() {
    for (let i = 1; i <= maxIntentos; i++) {
        cambiarEstadoFila(i, true);
    }
}

document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        verificarPalabra();
    }
});

document.addEventListener('DOMContentLoaded', inicializarJuego);




function moveToNextField(current, next) {
    document.getElementById(current).addEventListener('input', function() {
        if (this.value.length === this.maxLength) {
            let nextField = document.getElementById(next);
            if (nextField) {
                nextField.focus();
            }
        }
    });
}

function moveToPreviousField(current, prev) {
    document.getElementById(current).addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && this.value.length === 0) {
            let prevField = document.getElementById(prev);
            if (prevField) {
                prevField.focus();
            }
        }
    });
}

function configurarMovimientoCampos() {
    for (let fila = 1; fila <= maxIntentos; fila++) {
        for (let columna = 1; columna <= longitudPalabra; columna++) {
            let currentId = 'char' + fila + '-' + columna;
            let nextId = columna < longitudPalabra ? 'char' + fila + '-' + (columna + 1) : fila < maxIntentos ? 'char' + (fila + 1) + '-1' : '';
            let prevId = columna > 1 ? 'char' + fila + '-' + (columna - 1) : fila > 1 ? 'char' + (fila - 1) + '-' + longitudPalabra : '';

            if (nextId) {
                moveToNextField(currentId, nextId);
            }
            if (prevId) {
                moveToPreviousField(currentId, prevId);
            }
        }
    }
}

inicializarJuego();
configurarMovimientoCampos();

function reiniciarJuego() {

    intentoActual = 1;
    inicializarJuego();
    document.getElementById('char1-1').focus();
    obtenerPalabraDeLaAPI();
}

obtenerPalabraDeLaAPI();

document.getElementById('resetButton').addEventListener('click', reiniciarJuego);


