document.addEventListener("DOMContentLoaded", function () {

    // Elementos del buscador y los filtros
    const campoBusqueda = document.getElementById("buscador-recursos");
    const filtroCarrera = document.getElementById("filtro-carrera");
    const filtroTipo = document.getElementById("filtro-tipo");

    // Botones
    const botonBuscar = document.getElementById("buscar-filtros");
    const botonLimpiar = document.getElementById("limpiar-filtros");

    // Elementos de los resultados
    const tarjetas = document.querySelectorAll(".recurso-card");
    const contadorResultados = document.getElementById("resultado-conteo");
    const mensajeSinResultados = document.getElementById("sin-resultados");
    const botonMostrarTodos = document.getElementById("limpiar-filtros-vacio");

    // Comprobar que existen los elementos necesarios
    if (
        !campoBusqueda ||
        !filtroCarrera ||
        !filtroTipo ||
        !botonBuscar ||
        !botonLimpiar ||
        !contadorResultados ||
        !mensajeSinResultados
    ) {
        console.error("No se encontraron todos los elementos del catálogo.");
        return;
    }

    // Normalizar el texto para ignorar mayúsculas y tildes
    function normalizarTexto(texto) {
        return texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    // Buscar y filtrar los recursos
    function filtrarRecursos() {

        const texto = normalizarTexto(campoBusqueda.value.trim());
        const carreraSeleccionada = filtroCarrera.value;
        const tipoSeleccionado = filtroTipo.value;

        let cantidadVisibles = 0;

        // Recorrer todas las tarjetas de recursos
        tarjetas.forEach(function (tarjeta) {

            // Obtener el contenido de cada tarjeta
            const contenido = normalizarTexto(tarjeta.textContent);

            // Obtener la carrera y el tipo de recurso
            const carrera = tarjeta.dataset.carrera;
            const tipo = tarjeta.dataset.tipo;

            // Comprobar si coincide con el texto escrito
            const coincideTexto = contenido.includes(texto);

            // Comprobar si coincide con la carrera
            const coincideCarrera =
                carreraSeleccionada === "todas" ||
                carrera === carreraSeleccionada;

            // Comprobar si coincide con el tipo de recurso
            const coincideTipo =
                tipoSeleccionado === "todos" ||
                tipo === tipoSeleccionado;

            // Mostrar la tarjeta solo si cumple todos los filtros
            const mostrar =
                coincideTexto &&
                coincideCarrera &&
                coincideTipo;

            tarjeta.hidden = !mostrar;

            // Contar las tarjetas visibles
            if (mostrar) {
                cantidadVisibles++;
            }
        });

        // Actualizar el mensaje de resultados
        contadorResultados.textContent =
            cantidadVisibles === 1
                ? "Se encontró 1 recurso educativo."
                : "Se encontraron " + cantidadVisibles +
                  " recursos educativos.";

        // Mostrar el mensaje si no hay resultados
        mensajeSinResultados.hidden = cantidadVisibles !== 0;
    }

    // Limpiar los filtros y mostrar todos los recursos
    function limpiarFiltros() {

        campoBusqueda.value = "";
        filtroCarrera.value = "todas";
        filtroTipo.value = "todos";

        filtrarRecursos();
    }

    // Buscar solamente al presionar el botón
    botonBuscar.addEventListener("click", function (evento) {
        evento.preventDefault();
        filtrarRecursos();
    });

    // Permitir buscar también al presionar Enter
    campoBusqueda.addEventListener("keydown", function (evento) {
        if (evento.key === "Enter") {
            evento.preventDefault();
            filtrarRecursos();
        }
    });

    // Limpiar los filtros al presionar el botón correspondiente
    botonLimpiar.addEventListener("click", function (evento) {
        evento.preventDefault();
        limpiarFiltros();
    });

    // Botón para mostrar todos los recursos si no hay coincidencias
    if (botonMostrarTodos) {
        botonMostrarTodos.addEventListener("click", function (evento) {
            evento.preventDefault();
            limpiarFiltros();
        });
    }

    // Seleccionar una carrera desde las tarjetas de categorías
    document.querySelectorAll("[data-seleccionar-carrera]")
        .forEach(function (tarjetaCarrera) {

            tarjetaCarrera.addEventListener("click", function () {

                const carrera = this.dataset.seleccionarCarrera;

                // Seleccionar la carrera, sin ejecutar la búsqueda todavía
                filtroCarrera.value = carrera;

                // El usuario presionará Buscar recursos para aplicar el filtro
            });
        });

    // Mostrar todos los recursos al abrir la página
    filtrarRecursos();

});
