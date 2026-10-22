
document.addEventListener('DOMContentLoaded', () => {
  const botonMenu = document.querySelector('.menu-alternar');
  const navegacion = document.querySelector('.navegacion');

  if (botonMenu && navegacion) {
    botonMenu.addEventListener('click', () => {
      const abierto =
        botonMenu.getAttribute('aria-expanded') === 'true';

      botonMenu.setAttribute('aria-expanded', String(!abierto));
      navegacion.classList.toggle('navegacion--abierta', !abierto);
    });

    navegacion.querySelectorAll('a').forEach(enlace => {
      enlace.addEventListener('click', () => {
        navegacion.classList.remove('navegacion--abierta');
        botonMenu.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Actualizar el año si la página tiene este elemento
  const anio = document.getElementById('anio-actual');

  if (anio) {
    anio.textContent = new Date().getFullYear();
  }
});
