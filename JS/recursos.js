document.addEventListener("DOMContentLoaded", function () {

    const campoBusqueda = document.getElementById("buscador-recursos");
    const filtroCarrera = document.getElementById("filtro-carrera");
    const filtroTipo = document.getElementById("filtro-tipo");
    const botonBuscar = document.getElementById("buscar-filtros");
    const botonLimpiar = document.getElementById("limpiar-filtros");
    const tarjetas = document.querySelectorAll(".recurso-card");
    const contadorResultados = document.getElementById("resultado-conteo");
    const mensajeSinResultados = document.getElementById("sin-resultados");
    const botonMostrarTodos = document.getElementById("limpiar-filtros-vacio");

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
    function normalizarTexto(texto) {
        return texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }
    function filtrarRecursos() {
        const texto = normalizarTexto(campoBusqueda.value.trim());
        const carreraSeleccionada = filtroCarrera.value;
        const tipoSeleccionado = filtroTipo.value;

        let cantidadVisibles = 0;

        tarjetas.forEach(function (tarjeta) {
            const contenido = normalizarTexto(tarjeta.textContent);
            const carrera = tarjeta.dataset.carrera;
            const tipo = tarjeta.dataset.tipo;
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

            tarjeta.hidden = !mostrar;
            if (mostrar) {
                cantidadVisibles++;
            }
        });
        contadorResultados.textContent =
            cantidadVisibles === 1
                ? "Se encontró 1 recurso educativo."
                : "Se encontraron " + cantidadVisibles +
                  " recursos educativos.";
        mensajeSinResultados.hidden = cantidadVisibles !== 0;
    }
    function limpiarFiltros() {
        campoBusqueda.value = "";
        filtroCarrera.value = "todas";
        filtroTipo.value = "todos";
        filtrarRecursos();
    }
    botonBuscar.addEventListener("click", function (evento) {
        evento.preventDefault();
        filtrarRecursos();
    });
    campoBusqueda.addEventListener("keydown", function (evento) {
        if (evento.key === "Enter") {
            evento.preventDefault();
            filtrarRecursos();
        }
    });
    botonLimpiar.addEventListener("click", function (evento) {
        evento.preventDefault();
        limpiarFiltros();
    });
    if (botonMostrarTodos) {
        botonMostrarTodos.addEventListener("click", function (evento) {
            evento.preventDefault();
            limpiarFiltros();
        });
    }
    document.querySelectorAll("[data-seleccionar-carrera]")
        .forEach(function (tarjetaCarrera) {
            tarjetaCarrera.addEventListener("click", function () {
                const carrera = this.dataset.seleccionarCarrera;
                filtroCarrera.value = carrera;
            });
        });
    filtrarRecursos();
});
