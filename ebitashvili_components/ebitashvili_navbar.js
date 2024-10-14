let cachedCategoryData = null; // Variable to store the fetched data

// Fetch the JSON dynamically using the Fetch API and store it in a variable
async function fetchCategoryData() {
  if (!cachedCategoryData) {
    // Check if data has already been fetched
    const response = await fetch(
      "ebitashvili_components/ebitashvili_menuData.json"
    );
    cachedCategoryData = await response.json(); // Store the fetched data
  }
  return cachedCategoryData; // Return the cached data
}

// Using Event Delegation for Hover Events
document
  .querySelector(".first__section-categories")
  .addEventListener("mouseover", (event) => {
    if (event.target.closest(".category")) {
      const categoryKey = event.target
        .closest(".category")
        .getAttribute("data-category");
      handleCategoryHover(categoryKey);
    }
  });

// Function to handle category hover event
async function handleCategoryHover(categoryKey) {
  const allCategoryData = await fetchCategoryData();

  // Find the category data by its 'data-category' attribute
  const categoryMap = {
    "mobile-phones": "მობილურები",
    tabs: "ტაბები",
    "laptops-it": "ლეპტოპები | IT",
    "audio-systems": "აუდიო სისტემა",
    gaming: "Gaming",
    "tv-monitors": "TV | მონიტორები",
    "photo-video": "ფოტო | ვიდეო",
  };

  const categoryName = categoryMap[categoryKey];
  const categoryData = allCategoryData.find(
    (item) => item.name === categoryName
  );

  // Display subcategories for the relevant category
  if (categoryData && categoryData.childItems) {
    displaySubcategories(categoryData);
  }
}

// Efficiently build HTML and inject it for all categories
function displaySubcategories(categoryData) {
  const subcategoriesContainer = document.getElementById(
    "subcategories-container"
  );

  // Clear previous content
  subcategoriesContainer.innerHTML = "";

  // Build HTML for subcategories
  let subcategoriesHTML = `<h3>${categoryData.name}</h3>`;

  categoryData.childItems.forEach((childItem) => {
    subcategoriesHTML += `<a href="${childItem.url}" class="subcategory-item">${childItem.name}</a>`;
  });

  // Inject the built HTML into the container
  subcategoriesContainer.innerHTML = subcategoriesHTML;
}
