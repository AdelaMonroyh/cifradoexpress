// script.js

// Función de cifrado César
function cifrarCesar() {
    const texto = document.getElementById('cesarText').value;
    const desplazamiento = parseInt(document.getElementById('cesarShift').value);
    if (!texto || desplazamiento <= 0) {
        alert("Por favor, ingresa un texto válido y un desplazamiento mayor a 0.");
        return;
    }
    let resultado = '';
    for (let i = 0; i < texto.length; i++) {
        const charCode = texto.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
            resultado += String.fromCharCode(((charCode - 65 + desplazamiento) % 26) + 65); // Mayúsculas
        } else if (charCode >= 97 && charCode <= 122) {
            resultado += String.fromCharCode(((charCode - 97 + desplazamiento) % 26) + 97); // Minúsculas
        } else {
            resultado += texto[i];
        }
    }
    document.getElementById('cesarResult').innerText = resultado;
}

// Función de descifrado César
function descifrarCesar() {
    const texto = document.getElementById('cesarText').value;
    const desplazamiento = parseInt(document.getElementById('cesarShift').value);
    if (!texto || desplazamiento <= 0) {
        alert("Por favor, ingresa un texto válido y un desplazamiento mayor a 0.");
        return;
    }
    let resultado = '';
    for (let i = 0; i < texto.length; i++) {
        const charCode = texto.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
            resultado += String.fromCharCode(((charCode - 65 - desplazamiento + 26) % 26) + 65); // Mayúsculas
        } else if (charCode >= 97 && charCode <= 122) {
            resultado += String.fromCharCode(((charCode - 97 - desplazamiento + 26) % 26) + 97); // Minúsculas
        } else {
            resultado += texto[i];
        }
    }
    document.getElementById('cesarResult').innerText = resultado;
}

// Función de cifrado Escítala
function cifrarEscitala() {
    const mensaje = document.getElementById('escitalaText').value.replace(/\s+/g, ''); // Elimina espacios
    const columnas = parseInt(document.getElementById('escitalaColumns').value);
    if (!mensaje || columnas <= 0) {
        alert("Por favor, ingresa un texto válido y un número de columnas mayor a 0.");
        return;
    }

    const longitud = mensaje.length;
    const filas = Math.ceil(longitud / columnas);
    const matriz = Array.from({ length: filas }, () => Array(columnas).fill(''));

    // Llenar la matriz con el mensaje
    for (let i = 0; i < longitud; i++) {
        const fila = Math.floor(i / columnas);
        const columna = i % columnas;
        matriz[fila][columna] = mensaje[i];
    }

    // Crear el mensaje cifrado
    let mensajeCifrado = '';
    for (let col = 0; col < columnas; col++) {
        for (let row = 0; row < filas; row++) {
            if (matriz[row][col] !== '') {
                mensajeCifrado += matriz[row][col];
            }
        }
    }

    document.getElementById('escitalaResult').innerText = mensajeCifrado;
}

// Función de descifrado Escítala
function descifrarEscitala() {
    const mensajeCifrado = document.getElementById('escitalaText').value.replace(/\s+/g, '');
    const columnas = parseInt(document.getElementById('escitalaColumns').value);
    if (!mensajeCifrado || columnas <= 0) {
        alert("Por favor, ingresa un texto válido y un número de columnas mayor a 0.");
        return;
    }

    const longitud = mensajeCifrado.length;
    const filas = Math.ceil(longitud / columnas);
    const matriz = Array.from({ length: filas }, () => Array(columnas).fill(''));

    const numFullColumns = longitud % columnas;

    let index = 0;
    for (let col = 0; col < columnas; col++) {
        for (let row = 0; row < filas; row++) {
            if (numFullColumns !== 0 && col >= numFullColumns && row === filas - 1) continue;
            if (index < longitud) {
                matriz[row][col] = mensajeCifrado[index++];
            }
        }
    }

    let mensajeDescifrado = '';
    for (let row = 0; row < filas; row++) {
        for (let col = 0; col < columnas; col++) {
            if (matriz[row][col] !== '') {
                mensajeDescifrado += matriz[row][col];
            }
        }
    }

    document.getElementById('escitalaResult').innerText = mensajeDescifrado;
}

// Mantén las funciones adicionales para Camellia, Schnorr y MD5 que ya tenías.
// Función para cifrar con Camellia
// Función para cifrar con Camellia
async function cifrarCamellia() {
    const nombre = document.getElementById('nombre').value;
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;

    // Asegúrate de que los datos no estén vacíos antes de enviar la solicitud
    if (!nombre || !fechaNacimiento) {
        alert('Por favor, completa ambos campos: Nombre y Fecha de Nacimiento.');
        return;
    }

    try {
        const response = await fetch('/cifrar-camellia', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, fechaNacimiento })
        });

        // Verificar si la respuesta no es 200 OK
        if (!response.ok) {
            const errorData = await response.json();
            alert(`Error en el servidor: ${errorData.error}`);
            return;
        }

        // Intentar convertir la respuesta a JSON
        const data = await response.json();
        document.getElementById('resultadoCamellia').innerText = `Nombre cifrado: ${data.nombreCifrado}, Fecha cifrada: ${data.fechaCifrada}`;
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Error al comunicarse con el servidor. Verifica la consola para más detalles.');
    }
}
// Función para descifrar con Camellia
async function descifrarCamellia() {
    // Obtener el nombre y fecha cifrados del formulario
    const nombreCifrado = document.getElementById('nombreCifrado').value;
    const fechaCifrada = document.getElementById('fechaCifrada').value;

    // Verificar que los campos no estén vacíos
    if (!nombreCifrado || !fechaCifrada) {
        alert('Por favor, introduce el nombre y la fecha cifrada para descifrar.');
        return;
    }

    try {
        // Enviar solicitud de descifrado al backend
        const response = await fetch('/descifrar-camellia', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreCifrado, fechaCifrada })
        });

        // Verificar si la respuesta no es 200 OK
        if (!response.ok) {
            const errorData = await response.json();
            alert(`Error en el servidor: ${errorData.error}`);
            return;
        }

        // Obtener los datos descifrados y mostrarlos en la sección de resultado
        const data = await response.json();
        document.getElementById('resultadoCamellia').innerText = `Nombre Original: ${data.nombreOriginal}, Fecha Original: ${data.fechaOriginal}`;
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Error al comunicarse con el servidor. Verifica la consola para más detalles.');
    }
}

// Función para generar hash con MD5
async function generarHashMD5() {
    const contrasena = document.getElementById('contrasena').value;
    const response = await fetch('/generar-hash-md5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contrasena })
    });
    const data = await response.json();
    document.getElementById('resultadoMD5').innerText = `Hash: ${data.hash}`;
}
// Función para copiar el resultado al portapapeles
function copiarResultado(elementId) {
    const resultado = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(resultado).then(() => {
        alert("Resultado copiado al portapapeles.");
    }, () => {
        alert("No se pudo copiar el resultado.");
    });
}

// Función para firmar con Schnorr
async function firmarSchnorr() {
    const tarjetaCredito = document.getElementById('tarjetaCredito').value;
    const dni = document.getElementById('dni').value;

    if (!tarjetaCredito || !dni) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    try {
        const response = await fetch('/firma-schnorr', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tarjetaCredito, dni })
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Error en el servidor: ${errorData.error}`);
            return;
        }

        const data = await response.json();
        document.getElementById('resultadoSchnorr').innerText = `Firma: ${JSON.stringify(data.firma)}, Clave Pública: ${data.clavePublica}`;
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Error al comunicarse con el servidor. Verifica la consola para más detalles.');
    }
}