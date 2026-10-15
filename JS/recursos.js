document.addEventListener("DOMContentLoaded", function () {

    // Elementos del buscador y los filtros
    const campoBusqueda = document.getElementById("buscador-recursos");
    const filtroCarrera = document.getElementById("filtro-carrera");
    const filtroTipo = document.getElementById("filtro-tipo");

    // Botones
    const botonBuscar = document.getElementById("buscar-filtros");
    const botonLimpiar = document.getElementById("limpiar-filtros");

    // Elementos de resultados
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

    // Filtrar los recursos
    function filtrarRecursos() {

        const texto = normalizarTexto(campoBusqueda.value.trim());
        const carreraSeleccionada = filtroCarrera.value;
        const tipoSeleccionado = filtroTipo.value;

        let cantidadVisibles = 0;

        tarjetas.forEach(function (tarjeta) {

            // Obtener el contenido, la carrera y el tipo
            const contenido = normalizarTexto(tarjeta.textContent);
            const carrera = tarjeta.dataset.carrera;
            const tipo = tarjeta.dataset.tipo;

            // Comprobar si coincide con los filtros
            const coincideTexto = contenido.includes(texto);

            const coincideCarrera =
                carreraSeleccionada === "todas" ||
                carrera === carreraSeleccionada;

            const coincideTipo =
                tipoSeleccionado === "todos" ||
                tipo === tipoSeleccionado;

            const mostrar =
                coincideTexto &&
                coincideCarrera &&
                coincideTipo;

            // Mostrar u ocultar la tarjeta
            tarjeta.hidden = !mostrar;

            if (mostrar) {
                cantidadVisibles++;
            }
        });

        // Actualizar el contador
        contadorResultados.textContent =
            cantidadVisibles === 1
                ? "Se encontró 1 recurso educativo."
                : "Se encontraron " + cantidadVisibles +
                  " recursos educativos.";

        // Mostrar el mensaje si no hay resultados
        mensajeSinResultados.hidden = cantidadVisibles !== 0;
    }

    // Limpiar los filtros
    function limpiarFiltros() {

        campoBusqueda.value = "";
        filtroCarrera.value = "todas";
        filtroTipo.value = "todos";

        filtrarRecursos();
    }

    // Activar el botón Buscar recursos
    botonBuscar.addEventListener("click", filtrarRecursos);

    // Permitir buscar presionando Enter
    campoBusqueda.addEventListener("keydown", function (evento) {
        if (evento.key === "Enter") {
            filtrarRecursos();
        }
    });

    // También actualizar al escribir o cambiar los filtros
    campoBusqueda.addEventListener("input", filtrarRecursos);
    filtroCarrera.addEventListener("change", filtrarRecursos);
    filtroTipo.addEventListener("change", filtrarRecursos);

    // Activar el botón Limpiar filtros
    botonLimpiar.addEventListener("click", limpiarFiltros);

    // Botón para mostrar todos los recursos cuando no hay coincidencias
    if (botonMostrarTodos) {
        botonMostrarTodos.addEventListener("click", limpiarFiltros);
    }

    // Permitir seleccionar una carrera desde sus tarjetas
    document.querySelectorAll("[data-seleccionar-carrera]")
        .forEach(function (tarjetaCarrera) {

            tarjetaCarrera.addEventListener("click", function () {

                const carrera = this.dataset.seleccionarCarrera;

                filtroCarrera.value = carrera;

                filtrarRecursos();
            });
        });

    // Mostrar todos los recursos al abrir la página
    filtrarRecursos();

});