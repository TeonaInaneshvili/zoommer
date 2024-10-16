let ebiCachedMenuData = null; // Variable to store menu data
let ebiCachedSwiperData = null; // Variable to store swiper data

// Function to fetch menu data
async function ebiFetchMenuData() {
  if (!ebiCachedMenuData) {
    const response = await fetch("ebitashvili_menuData.json");
    ebiCachedMenuData = await response.json(); // Store the fetched data
  }
  return ebiCachedMenuData; // Return the cached data
}

// Function to fetch swiper data
async function ebiFetchSwiperData() {
  if (!ebiCachedSwiperData) {
    const response = await fetch("ebitashvili_swiperData.json");
    ebiCachedSwiperData = await response.json(); // Store the fetched data
  }
  return ebiCachedSwiperData; // Return the cached data
}

// Function to generate the Main Parent Categories dynamically
async function ebiGenerateCategories() {
  const ebiCategoriesContainer = document.querySelector(
    ".first__section-categories"
  );
  const ebiAllCategoryData = await ebiFetchMenuData();

  // Clear existing categories
  ebiCategoriesContainer.innerHTML = "";

  // Loop through the Main Parent Categories (parentItemId is null)
  ebiAllCategoryData.forEach((ebiCategory) => {
    if (ebiCategory.parentItemId === null) {
      const ebiCategoryDiv = document.createElement("div");
      ebiCategoryDiv.classList.add("main-parent-category"); // Added specific class name
      ebiCategoryDiv.setAttribute("data-category", ebiCategory.name);

      // Dynamically create the Main Parent Category image and name
      ebiCategoryDiv.innerHTML = `
        <img src="${ebiCategory.iconUrl}" alt="${ebiCategory.name} Icon" />
        <h4>${ebiCategory.name}</h4>
        <div class="subcategories-menu"></div> <!-- Placeholder for subcategories -->
      `;

      // Append the category to the container
      ebiCategoriesContainer.appendChild(ebiCategoryDiv);
    }
  });

  // Add hover events after generating categories
  ebiAttachHoverEvents();
}

// Function to attach hover events to the Main Parent Categories
function ebiAttachHoverEvents() {
  const ebiCategoryElements = document.querySelectorAll(
    ".main-parent-category"
  );
  ebiCategoryElements.forEach((ebiCategoryElement) => {
    ebiCategoryElement.addEventListener("mouseenter", (event) => {
      const ebiCategoryKey = event.currentTarget.getAttribute("data-category");
      ebiHandleCategoryHover(ebiCategoryKey);
    });

    ebiCategoryElement.addEventListener("mouseleave", () => {
      ebiHideAllSubcategories();
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

  // Loop through the Parent Categories (childItems of Main Parent Categories)
  ebiCategoryData.childItems.forEach((ebiParentCategory) => {
    // Wrap the parent category name in a hyperlink using the 'url' field
    let ebiParentCategoryHTML = `<h4 class="parent-category">
                                   <a href="${ebiParentCategory.url}" target="_blank">${ebiParentCategory.name}</a>
                                 </h4>`; // Display Parent Category name

    // Check for Subcategories (childItems of Parent Category)
    if (ebiParentCategory.childItems) {
      ebiParentCategory.childItems.forEach((ebiSubCategory) => {
        // Display Subcategories
        ebiParentCategoryHTML += `<a href="${ebiSubCategory.url}" class="subcategory-item">${ebiSubCategory.name}</a>`;
      });
    }

    // Create a div for the parent category and add the class
    const ebiParentCategoryDiv = document.createElement("div");
    ebiParentCategoryDiv.classList.add("parent-category-container");
    ebiParentCategoryDiv.innerHTML = ebiParentCategoryHTML;

    // Inject the Parent Category and Subcategories into the container
    ebiSubcategoriesContainer.appendChild(ebiParentCategoryDiv);
  });

  // Show the subcategory menu
  ebiSubcategoriesContainer.style.display = "flex";
}

// Function to display the image at the bottom left of the submenu
function ebiDisplayBottomLeftImage(ebiCategoryData) {
  const ebiSubcategoriesContainer = document.querySelector(
    ".first__section-subcategories"
  );

  // Check if the image URL exists
  if (ebiCategoryData.imageUrl) {
    // Create or select the image container element
    let ebiImageContainer = document.querySelector(".submenu-bottom-image");

    if (!ebiImageContainer) {
      ebiImageContainer = document.createElement("div");
      ebiImageContainer.classList.add("submenu-bottom-image");
      ebiSubcategoriesContainer.appendChild(ebiImageContainer);
    }

    // Set the image inside the container
    ebiImageContainer.innerHTML = `<img src="${ebiCategoryData.imageUrl}" alt="${ebiCategoryData.name} Image" />`;

    // Style the image container to show up at the bottom left
    ebiImageContainer.style.display = "block";
  }
}

// Modify the ebiHandleCategoryHover function to include the image display
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

    // Display the image at the bottom left corner
    ebiDisplayBottomLeftImage(ebiCategoryData);
  }
}

// Function to initialize Swiper
function ebiInitializeSwiper() {
  new Swiper(".swiper-container", {
    loop: false, // Make the Swiper NOT loop
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    slidesPerView: 1, // Show one slide at a time
  });
}

// Function to fetch and generate Swiper slides dynamically
async function ebiFetchAndGenerateSwiperSlides() {
  const ebiSwiperWrapper = document.querySelector(".swiper-wrapper");
  try {
    // Fetch the entire JSON array
    const ebiDataArray = await ebiFetchSwiperData();

    // Since the JSON data is now an array, access the first object
    const ebiData = ebiDataArray[0];

    // Extract the banners array from the JSON object
    const ebiAllSwiperData = ebiData.banners;

    // Check if the data exists
    if (!ebiAllSwiperData) {
      console.error("No banners found in the JSON data.");
      return;
    }

    // Clear existing slides
    ebiSwiperWrapper.innerHTML = "";

    // Generate slides using each banner in the banners array
    ebiAllSwiperData.forEach((ebiBanner) => {
      const ebiSwiperSlide = document.createElement("div");
      ebiSwiperSlide.classList.add("swiper-slide");

      // Create slide content using the banner properties
      ebiSwiperSlide.innerHTML = `
    <img src="${ebiBanner.webImageUrl}" alt="${ebiBanner.title}">
`;

      // Append slide to Swiper wrapper
      ebiSwiperWrapper.appendChild(ebiSwiperSlide);
    });

    // Initialize Swiper once slides are ready
    ebiInitializeSwiper();
  } catch (error) {
    console.error("Failed to fetch swiper data:", error);
  }
}

// Initialize the category generation and Swiper when the page loads
document.addEventListener("DOMContentLoaded", () => {
  ebiGenerateCategories(); // Generate categories
  ebiFetchAndGenerateSwiperSlides(); // Generate Swiper slides
});
