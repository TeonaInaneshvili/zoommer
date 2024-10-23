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
      <a href="${ebiCategory.url}" target="_blank">
        <img src="${ebiCategory.iconUrl}" alt="${ebiCategory.name} Icon" />
        <h4>${ebiCategory.name}</h4>
      </a>
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
  // Get the specific .subcategories-menu for the hovered category
  const ebiSubcategoriesContainer = document.querySelector(
    `.main-parent-category[data-category="${ebiCategoryData.name}"] .subcategories-menu`
  );

  // Check if the image URL exists
  if (ebiCategoryData.imageUrl) {
    // Create or select the image container element
    let ebiImageContainer = ebiSubcategoriesContainer.querySelector(
      ".submenu-bottom-image"
    );

    if (!ebiImageContainer) {
      // Create .submenu-bottom-image div if it doesn't exist yet
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

// Function to initialize Swiper
function ebiInitializeSwiper() {
  new Swiper(".swiper-container", {
    loop: false, // Make the Swiper NOT loop
    navigation: {
      nextEl: ".first__section-swiper-button-next",
      prevEl: ".first__section-swiper-button-prev",
    },
    slidesPerView: 1, // Show one slide at a time
  });
}

// Function to fetch and generate Swiper slides dynamically
async function ebiFetchAndGenerateSwiperSlides() {
  const ebiSwiperWrapper = document.querySelector(
    ".first__section-swiper-wrapper"
  );
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

document.addEventListener("DOMContentLoaded", function () {
  // Existing mutual code to load header and footer
  loadHTML("header.html", "header");
  loadHTML("footer.html", "footer");

  const cartContainer = document.querySelector(".cart-container");
  const cartPopup = document.querySelector(".cart-popup");

  cartContainer.addEventListener("mouseenter", function () {
    // Load cart content if not already loaded
    if (!cartPopup.innerHTML.trim()) {
      fetch("cart.html")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.text();
        })
        .then((data) => {
          cartPopup.innerHTML = data;
        })
        .catch((error) => console.error("Error loading cart.html:", error));
    }
  });

  cartContainer.addEventListener("mouseleave", function () {
    cartPopup.innerHTML = ""; // Optionally clear the content when not hovering
  });

  // Call your custom functions
  ebiGenerateCategories(); // Generates categories dynamically
  ebiFetchAndGenerateSwiperSlides(); // Initializes and generates Swiper slides
});

function loadHTML(filename, elementSelector) {
  fetch(filename)
    .then((response) => response.text())
    .then((data) => {
      document.querySelector(elementSelector).innerHTML = data;
    })
    .catch((error) => console.log("Error loading file:", error));
}

window.onscroll = function () {
  const headerTopPart = document.querySelector(".header__top-part");
  const headerSecondLine = document.getElementById("header__second-line");

  if (window.scrollY > 50) {
    headerTopPart.style.display = "none";
    headerSecondLine.classList.add("scrolled");
  } else {
    headerTopPart.style.display = "flex";
    headerSecondLine.classList.remove("scrolled");
  }
};

document.addEventListener("click", function () {
  // Login pop-up functionality
  const loginButton = document.getElementById("header__log-in");
  const loginButtonBottom = document.querySelector(".header__log-in-bottom");
  const logInPopUpContainer = document.querySelector(
    ".log-in__pop-up-container"
  );
  const popUp = document.getElementById("log-in__pop-up-main-part");
  const closeButton = document.querySelector(".log-in-popup-close");
  const overlay = document.querySelector(".overlay");

  // Function to show the pop-up
  function showPopup(event) {
    event.stopPropagation(); // Stop the click from propagating to other elements
    if (popUp && logInPopUpContainer && overlay) {
      popUp.style.display = "block"; // Show the pop-up
      logInPopUpContainer.style.height = "100vh"; // Set height to 100vh
      overlay.style.display = "block"; // Show the overlay
    }
  }

  // Show the pop-up when either the top or bottom login button is clicked
  if (loginButton) {
    loginButton.addEventListener("click", showPopup);
  }

  if (loginButtonBottom) {
    loginButtonBottom.addEventListener("click", showPopup);
  }

  // Close the pop-up when the close button is clicked
  if (closeButton) {
    closeButton.addEventListener("click", function (event) {
      event.stopPropagation();
      if (popUp && logInPopUpContainer && overlay) {
        popUp.style.display = "none"; // Hide the pop-up
        overlay.style.display = "none"; // Hide the overlay
        logInPopUpContainer.style.height = "0"; // Reset height to 0
      }
    });
  }

  // Close the pop-up and overlay when the overlay itself is clicked
  if (overlay) {
    overlay.addEventListener("click", function () {
      if (popUp && logInPopUpContainer && overlay) {
        overlay.style.display = "none"; // Hide the overlay
        popUp.style.display = "none"; // Hide the pop-up
        logInPopUpContainer.style.height = "0"; // Reset height to 0
      }
    });
  }
});

// Function to load HTML content into a specified element
function loadHTML(filename, elementSelector) {
  fetch(filename)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then((data) => {
      document.querySelector(elementSelector).innerHTML = data;
    })
    .catch((error) => console.log("Error loading file:", error));
}

document.addEventListener("DOMContentLoaded", () => {
  const allCategorySection = document.querySelector(
    ".all-category__section-columns"
  );

  // Fetch the JSON data from the file
  fetch("all-category.json")
    .then((response) => response.json())
    .then((categories) => {
      // Process and display the data
      categories.forEach((category) => {
        const categoryDiv = document.createElement("div");
        categoryDiv.classList.add("category-item");

        const title = document.createElement("h3");
        title.textContent = category.name;

        const childList = document.createElement("ul");
        category.childCategories.forEach((child) => {
          const childItem = document.createElement("li");
          childItem.textContent = child.name;
          childList.appendChild(childItem);
        });

        categoryDiv.appendChild(title);
        categoryDiv.appendChild(childList);
        allCategorySection.appendChild(categoryDiv);
      });
    })
    .catch((error) => {
      console.error("Error fetching the categories:", error);
    });
});

let zoomerApiData = "";
let swiperObject = {
  swiper1: new Swiper(".mySwiper1", {
    slidesPerView: 6,
    direction: getDirection(),
    watchOverflow: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    on: {
      resize: function () {
        this.changeDirection(getDirection());
      },
    },
  }),
  swiper2: new Swiper(".mySwiper2", {
    slidesPerView: 6,
    direction: getDirection(),

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    watchOverflow: true,
    on: {
      resize: function () {
        this.changeDirection(getDirection());
      },
    },
  }),
  swiper3: new Swiper(".mySwiper3", {
    slidesPerView: 6,
    direction: getDirection(),

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    watchOverflow: true,
    on: {
      resize: function () {
        this.changeDirection(getDirection());
      },
    },
  }),
  swiper4: new Swiper(".mySwiper4", {
    slidesPerView: 6,
    direction: getDirection(),
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    watchOverflow: true,
    on: {
      resize: function () {
        this.changeDirection(getDirection());
      },
    },
  }),

  swiper5: new Swiper(".mySwiper5", {
    slidesPerView: 6,
    direction: getDirection(),
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    watchOverflow: true,
    on: {
      resize: function () {
        this.changeDirection(getDirection());
      },
    },
  }),

  swiper6: new Swiper(".mySwiper6", {
    slidesPerView: 6,
    direction: getDirection(),
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    watchOverflow: true,
    on: {
      resize: function () {
        this.changeDirection(getDirection());
      },
    },
  }),

  swiper7: new Swiper(".mySwiper7", {
    slidesPerView: 6,
    direction: getDirection(),
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    watchOverflow: true,
    on: {
      resize: function () {
        this.changeDirection(getDirection());
      },
    },
  }),

  swiper8: new Swiper(".mySwiper8", {
    slidesPerView: 6,
    direction: getDirection(),
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    watchOverflow: true,
    on: {
      resize: function () {
        this.changeDirection(getDirection());
      },
    },
  }),

  swiper9: new Swiper(".mySwiper9", {
    slidesPerView: 6,
    direction: getDirection(),
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    watchOverflow: true,
    on: {
      resize: function () {
        this.changeDirection(getDirection());
      },
    },
  }),

  swiper10: new Swiper(".mySwiper10", {
    slidesPerView: 6,
    direction: getDirection(),
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    watchOverflow: true,
    on: {
      resize: function () {
        this.changeDirection(getDirection());
      },
    },
  }),

  swiper11: new Swiper(".mySwiper11", {
    slidesPerView: 6,
    direction: getDirection(),
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    watchOverflow: true,
    on: {
      resize: function () {
        this.changeDirection(getDirection());
      },
    },
  }),

  swiper12: new Swiper(".mySwiper12", {
    slidesPerView: 6,
    direction: getDirection(),
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    watchOverflow: true,
    on: {
      resize: function () {
        this.changeDirection(getDirection());
      },
    },
  }),

  swiper13: new Swiper(".mySwiper13", {
    slidesPerView: 6,
    direction: getDirection(),
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    watchOverflow: true,
    on: {
      resize: function () {
        this.changeDirection(getDirection());
      },
    },
  }),

  swiper14: new Swiper(".mySwiper14", {
    slidesPerView: 6,
    direction: getDirection(),
    navigation: {
      // nextEl: ".swiper-button-next",
      // prevEl: ".swiper-button-prev",
    },
    watchOverflow: true,
    on: {
      resize: function () {
        this.changeDirection(getDirection());
      },
    },
  }),
};

function getDirection() {
  return (window.innerWidth = "horizontal");
}

function itemHtmlGenerator(item, sectionId) {
  let itemHtml = "";
  const monthlyPrice = (item.price / 12).toFixed(2);

  let saleBadge = "";
  if (item.onSale && item.preSalePrice !== null) {
    saleBadge = `<div class="saleBadge">Sale</div>`;
  }

  let preSalePrice = "";
  if (item.hasDiscount && item.previousPrice !== null) {
    preSalePrice = `<h4 class="oldPrice">${item.previousPrice} ₾</h4>`;
  }

  let iconsGift = "";
  if (item.iconUrl) {
    iconsGift = `<div class="giftIcon">
                    <img class="giftIcoImg" src="${item.iconUrl}" alt="Gift Icon" />
                     </div>`;
  }

  let labelText = "";
  if (item.labelText && item.labelText.trim() !== "") {
    labelText = `<div class="bestPrice">${item.labelText}</div>`;
  }

  let priceItem = `<div class="price">
                      <h4 class="priceText">${item.price} ₾</h4>
                    </div>`;
  if (item.hasDiscount && item.previousPrice !== null) {
    priceItem = `<div class="price">
        <h4 class="priceText salePrice">${item.price} ₾</h4>
        ${preSalePrice}  
      </div>`;
  }
  let addToResView = `onclick="addToRecentlyViewed(${item.id}, ${sectionId})"`;

  itemHtml += `<div class="swiper-slide" >
      <div id="product-${item.id}" class="mainCardbox">
       <div class="imgAndPricePart" ${sectionId ? addToResView : ""}>
        <img class="slider--img" src="${item.imageUrl}" alt="${item.name}" />
        ${saleBadge}
        ${labelText}
        <div class="price-description">
          ${priceItem}
          <p class="monthlyPrice">თვეში: <span>${monthlyPrice} ₾</span> -დან</p>
          <a title="${item.name}" class="cardTitle" href="#">
            ${item.name}
          </a>
        </div>
       </div>
        <div class="iconsBox">
          <div class="compiars">
            <img src="https://zoommer.ge/icons/compare-card.svg" alt="" />
          </div>
          <div class="addCart">
            <img src="https://zoommer.ge/icons/cart-button.svg" alt="" />
            <h4 class="addButtonText">დამატება</h4>
          </div>
          ${iconsGift}
        </div>
      </div>
    </div>`;

  return itemHtml;
}

function addToRecentlyViewed(productId, sectionId) {
  const section = zoomerApiData.section.find(
    (sectionItem) => sectionItem.id === sectionId
  );
  if (!section) return;

  const item = section.products.find((item) => item.id === productId);

  if (!item) return;

  let lastviewedArray = [];
  let lastview = getLastViewedItems();
  if (lastview) {
    lastviewedArray = lastview;
    if (lastviewedArray.find((lastviewItemId) => lastviewItemId === productId))
      return;
    if (lastviewedArray.length === 6) {
      lastviewedArray.splice(0, 1);
      swiperObject.swiper14.removeSlide(0);
    }
    lastviewedArray.push(item.id);
    localStorage.setItem("recentlyViewed", JSON.stringify(lastviewedArray));

    swiperObject.swiper14.appendSlide(itemHtmlGenerator(item));
  } else {
    lastviewedArray.push(item.id);
    localStorage.setItem("recentlyViewed", JSON.stringify(lastviewedArray));
    swiperObject.swiper14.appendSlide(itemHtmlGenerator(item));
  }
}

function showRecentlyVieweds() {
  swiperObject.swiper14.removeAllSlides();
  const lastViewed = getLastViewedItems();
  if (lastViewed) {
    for (const section of zoomerApiData.section) {
      if (section.products) {
        for (const pitem of section.products) {
          if (
            lastViewed.find((lastviewItemId) => lastviewItemId === pitem.id)
          ) {
            swiperObject.swiper14.appendSlide(itemHtmlGenerator(pitem));
          }
        }
      }
    }
  }
}

function getLastViewedItems() {
  let lastview = localStorage.getItem("recentlyViewed");
  if (lastview) return JSON.parse(lastview);
  return null;
}

async function getDataFromZoommerApi() {
  try {
    const response = await fetch("data.json");
    zoomerApiData = await response.json();

    console.log(zoomerApiData);
    let itemIndex = 1;

    for (const section of zoomerApiData.section) {
      if (section.title) {
        const swiperContainer = document.querySelector(".mySwiper" + itemIndex);

        if (
          swiperContainer &&
          !swiperContainer.querySelector(".mySwiper_header")
        ) {
          const newH1 = document.createElement("h1");
          newH1.classList.add("mySwiper_header");
          const textnode = document.createTextNode(section.title);
          newH1.appendChild(textnode);
          swiperContainer.insertBefore(newH1, swiperContainer.firstChild);
        } else {
          console.error("Swiper container not found for index: ", itemIndex);
        }
      }

      const mySwiper14Container = document.querySelector(".mySwiper14");
      if (
        mySwiper14Container &&
        !mySwiper14Container.querySelector(".mySwiper_header")
      ) {
        const newH1ForSwiper14 = document.createElement("h1");
        newH1ForSwiper14.classList.add("mySwiper_header");
        const textnode14 = document.createTextNode("ბოლოს ნანახი");
        newH1ForSwiper14.appendChild(textnode14);
        mySwiper14Container.insertBefore(
          newH1ForSwiper14,
          mySwiper14Container.firstChild
        );
      } else {
        console.error("Swiper container mySwiper14 not found");
      }

      if (section.products) {
        for (let item of section.products) {
          swiperObject["swiper" + itemIndex].appendSlide(
            itemHtmlGenerator(item, section.id)
          );
        }
        itemIndex++;
      }

      if (section.brands) {
        for (let item of section.brands) {
          let slideContent = `<div class="swiper-slide swiperSlide5"><img src="${item.imageUrl}" class="brand--img" alt="Brand Image"></div>`;
          swiperObject["swiper" + itemIndex].appendSlide(slideContent);
        }
        itemIndex++;
      }
    }
    showRecentlyVieweds();
  } catch (e) {
    console.log(e);
  }
}

getDataFromZoommerApi().then();
