const inputs = document.querySelectorAll('#octeto1, #octeto2, #octeto3, #octeto4');
const input = document.getElementById('ipCompleta');

input.addEventListener('input', () => {
    const ipCompleta = input.value.trim();
    const octetos = ipCompleta.split('.').map(octeto => parseInt(octeto));

    if (
        octetos.length !== 4 || 
        octetos.some(octeto => isNaN(octeto) || octeto < 0 || octeto > 255)
    ) {
        input.style.borderColor = 'red';
        input.style.boxShadow = '0 0 5px red';
        input.style.color = 'red';
    } else {
        input.style.borderColor = '#00ff00';
        input.style.boxShadow = '0 0 5px #00ff00';
        input.style.color = '#00ff00';
    }
});

document.getElementById('calcular').addEventListener('click', () => {
    const ipCompleta = document.getElementById('ipCompleta').value.trim();
    const octetos = ipCompleta.split('.').map(octeto => parseInt(octeto));
    const resultadoDiv = document.getElementById('resultado');

    if (
        octetos.length !== 4 || 
        octetos.some(octeto => isNaN(octeto) || octeto < 0 || octeto > 255)
    ) {
        resultadoDiv.innerHTML = '<p class="error">Por favor, ingresa una dirección IP válida con 4 octetos separados por puntos.</p>';
        return;
    } else {
        resultadoDiv.innerHTML = ''; // limpiar errores previos
    }

    const [octeto1, octeto2, octeto3, octeto4] = octetos;
    const ip = `${octeto1}.${octeto2}.${octeto3}.${octeto4}`;
    let clase = '';
    let mascara = '';
    let direccion = '';
    let wildcard = '';



    //CALCULOS 
        //calculos clase y mascara
        if (octeto1 >= 1 && octeto1 <= 126) {
            clase = 'Clase A';
            mascara = '255.0.0.0';
        } else if (octeto1 >= 128 && octeto1 <= 191) {
            clase = 'Clase B';
            mascara = '255.255.0.0';
        } else if (octeto1 >= 192 && octeto1 <= 223) {
            clase = 'Clase C';
            mascara = '255.255.255.0';
        } else if (octeto1 >= 224 && octeto1 <= 239) {
            clase = 'Clase D (Multicast)';
            mascara = 'No tiene (Multicast)';
        } else if (octeto1 >= 240 && octeto1 <= 255) {
            clase = 'Clase E (Experimental)';
            mascara = 'No tiene (Experimental)';
        } else {
            clase = 'Clase desconocida';
            mascara = 'no tiene';
        }

        // Direccion privada o pública
        if (
            (octeto1 === 10) ||
            (octeto1 === 172 && octeto2 >= 16 && octeto2 <= 31) ||
            (octeto1 === 192 && octeto2 === 168)
        ) {
            direccion = 'Privada';
        } else {
            direccion = 'Pública';
        }

        // Calcular wildcard
        const [w1, w2, w3, w4] = mascara.split('.').map(Number);
        const max = '255.255.255.255';
        const [max1, max2, max3, max4] = max.split('.').map(Number);
        wildcard = `${max1 - w1}.${max2 - w2}.${max3 - w3}.${max4 - w4}`;
        if (clase === 'clase D (Multicast)' || clase === 'Clase E (Experimental)' || clase === 'Clase desconocida') {
            wildcard = 'N/A';
        }
    //PASOS A BINARIO
        //pasar a binario la ip
        const binarioCompleto = binarioIP(octeto1, octeto2, octeto3, octeto4);

    //FUNCIONES PARA CONVERTIR A BINARIO    

    function binarioIP(n1, n2, n3, n4) {
        let bin = n1.toString(2); 
        let bin2 = n2.toString(2);
        let bin3 = n3.toString(2);
        let bin4 = n4.toString(2);
        const resultado = `${bin.padStart(8, '0')}.${bin2.padStart(8, '0')}.${bin3.padStart(8, '0')}.${bin4.padStart(8, '0')}`; //agregar ceros a la izquierda hasta llegar a 8 car
        return resultado;
        }

        
    // Llamar a la función que muestra la ventana emergente con los datos hasta wildcard
    mostrarVentanaEmergente(ip, clase, mascara, direccion, wildcard, binarioCompleto);
});




//función para mostrar la ventana emergente
function mostrarVentanaEmergente(ip, clase, mascara, direccion, wildcard, binarioCompleto) {
    const ventanaEmergente = document.createElement('div');
    ventanaEmergente.classList.add('ventana-emergente');
    ventanaEmergente.setAttribute('id', 'resultados');


    ventanaEmergente.innerHTML = `
    <h2>Detalles de la IP</h2>
    <p style="margin-bottom: 25px;"><strong>IP:</strong> ${ip} (${direccion})<br><strong>Binario: </strong>${binarioCompleto}</p>
    <p style="margin-bottom: 25px;"><strong>Máscara por defecto:</strong> ${mascara}</p>
    <p><strong>Wildcard:</strong> ${wildcard}</p>
    <p><strong>Clase:</strong> ${clase}</p>
    <button id="cerrarVentana">Cerrar</button>
    `;

    document.body.appendChild(ventanaEmergente);

    document.getElementById('cerrarVentana').addEventListener('click', () => {
        ventanaEmergente.remove();
    });
}
