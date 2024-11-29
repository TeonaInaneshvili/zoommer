let ebiCachedMenuData = null; // Variable to store menu data

// BURGER MENU BY EBITASHVIL
function onHamburgerClick() {
  if (!firstSectionCategories.classList.contains("open")) {
    firstSectionCategories.classList.add("open");
    ebiGenerateCategories(); // Generate categories upon opening
  } else {
    firstSectionCategories.classList.remove("open");
  }
}

const hamburgerToggle = document.querySelector("#hamburger-toggle");
const firstSectionCategories = document.querySelector(
  "#ebi-first-section-categories"
);

// Function to fetch menu data
async function ebiFetchMenuData() {
  if (!ebiCachedMenuData) {
    const response = await fetch("ebitashvili_menuData.json");
    ebiCachedMenuData = await response.json(); // Store the fetched data
  }
  return ebiCachedMenuData; // Return the cached data
}

// Function to generate the Main Parent Categories dynamically
async function ebiGenerateCategories() {
  const ebiCategoriesContainer = document.querySelector(
    ".first__section-categories"
  );
  const ebiAllCategoryData = await ebiFetchMenuData();

  // Clear existing categories
  ebiCategoriesContainer.innerHTML = "";

  ebiAllCategoryData.forEach((ebiCategory) => {
    if (ebiCategory.parentItemId === null) {
      const ebiCategoryDiv = document.createElement("div");
      ebiCategoryDiv.classList.add("main-parent-category");
      ebiCategoryDiv.setAttribute("data-category", ebiCategory.name);

      // Show the main category image and subcategories
      ebiCategoryDiv.innerHTML = `
      <div  class="main-parent-category-div" class="a-tag-underline">
        <img src="${ebiCategory.iconUrl}" alt="${ebiCategory.name} Icon" />
        <h4>${ebiCategory.name}</h4>
      </div>
      <div class="subcategories-menu"></div>`;

      ebiCategoriesContainer.appendChild(ebiCategoryDiv);

      // Automatically load subcategories
      ebiDisplayParentAndSubcategories(ebiCategory, ebiCategory.name);
    }
  });
}
// Function to attach hover events to the Main Parent Categories
function ebiAttachHoverEvents() {
  const ebiCategoryElements = document.querySelectorAll(
    ".main-parent-category"
  );

  ebiCategoryElements.forEach((ebiCategoryElement) => {
    ebiCategoryElement.addEventListener("mouseenter", async (event) => {
      const ebiCategoryKey = event.currentTarget.getAttribute("data-category");

      // Check if subcategories are already loaded for this category
      const ebiSubcategoriesMenu = event.currentTarget.querySelector(
        ".subcategories-menu"
      );
      if (
        ebiSubcategoriesMenu &&
        ebiSubcategoriesMenu.innerHTML.trim() === ""
      ) {
        await ebiHandleCategoryHover(ebiCategoryKey);
      }
    });

    ebiCategoryElement.addEventListener("mouseleave", () => {
      ebiHideAllSubcategories();

      // Reset the height of .first__section-categories after hover ends
      const ebiCategoriesContainer = document.querySelector(
        ".first__section-categories"
      );
      ebiCategoriesContainer.style.height = ""; // Reset to original height
    });
  });
}

// Function to handle category hover event
async function ebiHandleCategoryHover(ebiCategoryKey) {
  const ebiAllCategoryData = await ebiFetchMenuData();

  // Directly use categoryKey to find the relevant category in the JSON
  const ebiCategoryData = ebiAllCategoryData.find(
    (item) => item.name === ebiCategoryKey
  );

  // Hide any previously visible subcategories
  ebiHideAllSubcategories();

  // Display Parent Categories and Subcategories for the relevant Main Parent Category
  if (ebiCategoryData && ebiCategoryData.childItems) {
    ebiDisplayParentAndSubcategories(ebiCategoryData, ebiCategoryKey);

    // Display the bottom-left image for the Main Parent Category
    ebiDisplayBottomLeftImage(ebiCategoryData);
  }
}

// Function to hide all subcategories and the bottom-left image
function ebiHideAllSubcategories() {
  const ebiSubcategoryMenus = document.querySelectorAll(".subcategories-menu");
  ebiSubcategoryMenus.forEach((menu) => {
    menu.style.display = "none";
  });

  // Hide the bottom-left image if any are displayed
  const ebiBottomImage = document.querySelector(".submenu-bottom-image");
  if (ebiBottomImage) {
    ebiBottomImage.style.display = "none";
  }
}

// Function to build and inject HTML for all Parent Categories and Subcategories
function ebiDisplayParentAndSubcategories(ebiCategoryData, ebiCategoryKey) {
  const ebiCategoryDiv = document.querySelector(
    `.main-parent-category[data-category="${ebiCategoryKey}"]`
  );
  const ebiSubcategoriesContainer = ebiCategoryDiv.querySelector(
    ".subcategories-menu"
  );

  // Clear previous subcategories
  ebiSubcategoriesContainer.innerHTML = "";

  ebiCategoryData.childItems.forEach((ebiParentCategory) => {
    // Create the h4 element for the parent category and add the class
    const ebiParentCategoryTitle = document.createElement("h4");
    ebiParentCategoryTitle.classList.add("parent-category");
    ebiParentCategoryTitle.textContent = ebiParentCategory.name;

    // Append the h4 element directly to the container
    ebiSubcategoriesContainer.appendChild(ebiParentCategoryTitle);

    // Create a div for the parent category container
    const ebiParentCategoryDiv = document.createElement("div");
    ebiParentCategoryDiv.classList.add("parent-category-container");

    // Append subcategories if they exist
    if (ebiParentCategory.childItems) {
      ebiParentCategory.childItems.forEach((ebiSubCategory) => {
        ebiParentCategoryDiv.innerHTML += `
          <a href="${ebiSubCategory.url}" class="subcategory-item">
          <span class= "subcategory-item-name">${ebiSubCategory.name}</span>
            <img src="${ebiSubCategory.imageUrl}" alt="${ebiSubCategory.name} Image" class="subcategory-image" />
           
          </a>
        `;
      });
    }

    // Append the parent category container div to the main container
    ebiSubcategoriesContainer.appendChild(ebiParentCategoryDiv);
  });

  // Show the subcategory menu
  ebiSubcategoriesContainer.style.display = "flex";
}

// Function to display the image at the bottom left of the submenu
function ebiDisplayBottomLeftImage(ebiCategoryData) {
  const ebiSubcategoriesContainer = document.querySelector(
    `.main-parent-category[data-category="${ebiCategoryData.name}"] .subcategories-menu`
  );

  if (ebiCategoryData.imageUrl) {
    let ebiImageContainer = ebiSubcategoriesContainer.querySelector(
      ".submenu-bottom-image"
    );

    if (!ebiImageContainer) {
      ebiImageContainer = document.createElement("div");
      ebiImageContainer.classList.add("submenu-bottom-image");
      ebiSubcategoriesContainer.appendChild(ebiImageContainer);
    }

    ebiImageContainer.innerHTML = `<img src="${ebiCategoryData.imageUrl}" alt="${ebiCategoryData.name} Image" />`;
    ebiImageContainer.style.display = "block";
  }
}

// Initialize the menu data and generate categories on page load
document.addEventListener("DOMContentLoaded", async () => {
  const ebiCategoriesContainer = document.querySelector(
    "#ebi-first-section-categories"
  );
  if (ebiCategoriesContainer) {
    ebiCategoriesContainer.style.visibility = "hidden"; // Hide initially
  }

  await ebiGenerateCategories();

  if (ebiCategoriesContainer) {
    ebiCategoriesContainer.style.visibility = "visible"; // Show after loading
  }
});
