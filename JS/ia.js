(() => {
  "use strict";

  const toolCards = Array.from(document.querySelectorAll(".tool-card"));
  const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
  const searchInput = document.getElementById("toolSearch");
  const noResults = document.getElementById("noResults");
  const recommendation = document.getElementById("recommendation");
  const recommendationTitle = document.getElementById("recommendation-title");
  const recommendationText = document.getElementById("recommendation-text");

  let activeFilter = "all";

  const recommendations = {
    explicar: {
      title: "Para comprender un tema",
      text: "Prioriza ChatGPT, Gemini o Claude para pedir explicaciones, ejemplos y ejercicios paso a paso."
    },
    documentos: {
      title: "Para estudiar un PDF o tus apuntes",
      text: "NotebookLM es especialmente útil cuando quieres trabajar directamente con las fuentes que tú proporcionas."
    },
    presentar: {
      title: "Para crear una presentación",
      text: "Gamma ayuda a generar una primera estructura visual; Canva es útil para editar y presentar el resultado."
    },
    examinar: {
      title: "Para prepararte para un examen",
      text: "Combina una IA conversacional para generar preguntas con Quizlet o NotebookLM para practicar y repasar."
    },
    organizar: {
      title: "Para organizar tu estudio",
      text: "Puedes pedir a ChatGPT o Gemini un plan de estudio a partir de tus materias, fechas y tiempo disponible."
    }
  };

  function normalize(text) {
    return String(text || "")
      .toLocaleLowerCase("es")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function filterTools() {
    const query = normalize(searchInput ? searchInput.value.trim() : "");
    let visible = 0;

    toolCards.forEach((card) => {
      const categories = (card.dataset.category || "").split(/\s+/).filter(Boolean);
      const searchText = normalize(`${card.dataset.search || ""} ${card.innerText || ""}`);
      const categoryMatch = activeFilter === "all" || categories.includes(activeFilter);
      const queryMatch = !query || searchText.includes(query);
      const show = categoryMatch && queryMatch;
      card.hidden = !show;
      if (show) visible += 1;
    });

    if (noResults) noResults.hidden = visible !== 0;
  }

  function setActiveFilter(filter) {
    activeFilter = filter || "all";
    filterButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.filter === activeFilter);
    });
    filterTools();
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => setActiveFilter(button.dataset.filter));
  });

  if (searchInput) searchInput.addEventListener("input", filterTools);

  document.querySelectorAll(".need-card").forEach((card) => {
    card.addEventListener("click", () => {
      const key = card.dataset.recommend;
      const data = recommendations[key];
      if (!data || !recommendation) return;

      recommendation.hidden = false;
      recommendationTitle.textContent = data.title;
      recommendationText.textContent = data.text;

      const nextFilter = ["explicar", "documentos", "presentar", "examinar", "organizar"].includes(key) ? key : "all";
      setActiveFilter(nextFilter);
      recommendation.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });

  document.querySelectorAll("[data-jump-filter]").forEach((link) => {
    link.addEventListener("click", () => {
      const filter = link.dataset.jumpFilter || "all";
      window.setTimeout(() => setActiveFilter(filter), 80);
    });
  });

  document.querySelectorAll(".tool-logo img").forEach((img) => {
    img.addEventListener("error", () => {
      const wrapper = img.closest(".tool-logo");
      if (!wrapper) return;
      wrapper.classList.add("fallback");
      wrapper.setAttribute("data-fallback", img.dataset.fallback || "AI");
    }, { once: true });
  });

  filterTools();
})();
