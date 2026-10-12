const searchInput = document.getElementById("help-search");
const clearSearchButton = document.getElementById("clear-search");
const searchStatus = document.getElementById("search-status");
const questionCount = document.getElementById("question-count");
const noResults = document.getElementById("no-results");
const filterButtons = Array.from(
  document.querySelectorAll(".filter-button")
);
const faqItems = Array.from(
  document.querySelectorAll(".faq-item")
);

let selectedCategory = "all";

function updateQuestions() {
  const searchTerm = searchInput.value.trim().toLocaleLowerCase();
  let visibleCount = 0;

  faqItems.forEach(item => {
    const categoryMatches =
      selectedCategory === "all" ||
      item.dataset.category === selectedCategory;
    const textMatches =
      searchTerm === "" ||
      item.textContent.toLocaleLowerCase().includes(searchTerm);
    const isVisible = categoryMatches && textMatches;

    item.hidden = !isVisible;
    if (!isVisible) {
      item.open = false;
    } else {
      visibleCount += 1;
    }
  });

  questionCount.textContent =
    `${visibleCount} ${visibleCount === 1 ? "question" : "questions"}`;
  noResults.hidden = visibleCount !== 0;
  clearSearchButton.hidden = searchInput.value.length === 0;

  if (searchTerm) {
    searchStatus.textContent =
      `${visibleCount} ${visibleCount === 1 ? "result" : "results"} found`;
  } else {
    searchStatus.textContent = "";
  }
}

searchInput.addEventListener("input", updateQuestions);

clearSearchButton.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.focus();
  updateQuestions();
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;

    filterButtons.forEach(filterButton => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });

    updateQuestions();
  });
});

updateQuestions();
