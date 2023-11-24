function toggleState(buttonIndex) {
  const listItems = document.querySelectorAll(".guide-list");
  const currentListItem = listItems[buttonIndex - 1];

  const uncheckedSvg = currentListItem.querySelector(".unchecked");
  const checkedSvg = currentListItem.querySelector(".checked");
  const loadingSvg = currentListItem.querySelector(".loading");

  // Update progress bar based on checked state
  const progressBar = document.getElementById("progress-bar");
  const progressCount = document.getElementById("progress-count");

  const currentValue = parseInt(progressCount.textContent);
  const increment = checkedSvg.classList.contains("active") ? -1 : 1;
  const newValue = Math.min(Math.max(currentValue + increment, 0), 5);

  if (checkedSvg.classList.contains("active")) {
    // toggle off
    loadingSvg.classList.add("active");
    checkedSvg.classList.remove("active");

    setTimeout(function () {
      uncheckedSvg.classList.add("active");
      loadingSvg.classList.remove("active");
      updateProgressBar(newValue);
      showNextIncompleteStep(currentListItem);
    }, 500);
  } else {
    // toggle on
    uncheckedSvg.classList.remove("active");
    loadingSvg.classList.add("active");

    setTimeout(function () {
      loadingSvg.classList.remove("active");
      checkedSvg.classList.add("active");
      updateProgressBar(newValue);
      showNextIncompleteStep(currentListItem);
    }, 500);
  }

  function updateProgressBar(value) {
    const incrementPercentage = 20;
    const newWidth = value * incrementPercentage;
    progressBar.style.width = `${newWidth}%`;
    progressCount.textContent = value;
  }

  function showNextIncompleteStep(currentStep) {
    const nextStep = getNextIncompleteStep(currentStep);
    if (nextStep) {
      const nextListDetails = nextStep.querySelector(".list-details");
      const nextListTitle = nextStep.querySelector(".list-title");

      // Hide other list-details
      listItems.forEach((item) => {
        if (item !== nextStep) {
          item.querySelector(".list-details").classList.remove("active");
          item.classList.remove("is-active");
        }
      });

      // Show the next incomplete step
      nextListDetails.classList.add("active");

      // Scroll to the next incomplete step
      nextListTitle.scrollIntoView({ behavior: "smooth" });
    }
  }

  function getNextIncompleteStep(currentStep) {
    const currentIndex = Array.from(listItems).indexOf(currentStep);
    for (let i = currentIndex + 1; i < listItems.length; i++) {
      if (
        !listItems[i].querySelector(".checked").classList.contains("active")
      ) {
        listItems[i].classList.add("is-active");
        return listItems[i];
      }
    }
    // If no next incomplete step, loop back to the first incomplete step
    for (let i = 0; i < currentIndex; i++) {
      if (
        !listItems[i].querySelector(".checked").classList.contains("active")
      ) {
        listItems[i].classList.add("is-active");
        return listItems[i];
      }
    }
    return null;
  }
}

// Add event listener for list-title elements
const listTitles = document.querySelectorAll(".list-title");
listTitles.forEach((title, index) => {
  title.addEventListener("click", () => {
    toggleListDetails(index + 1);
  });
});

let visibleListDetails = null;

function toggleListDetails(buttonIndex) {
  const listItems = document.querySelectorAll(".guide-list");
  const currentListItem = listItems[buttonIndex - 1];

  // Hide other list-details
  listItems.forEach((item) => {
    if (item !== currentListItem) {
      item.querySelector(".list-details").classList.remove("active");
      item.classList.remove("is-active");
    }
  });

  currentListItem.classList.add("is-active");
  const listDetails = currentListItem.querySelector(".list-details");
  const isVisible = listDetails.classList.contains("active");

  if (!isVisible || (isVisible && listDetails !== visibleListDetails)) {
    // Toggle the visibility of list-details only if it's not already visible
    // or if it's visible but corresponds to a different list-title
    listDetails.classList.toggle("active");
    visibleListDetails = isVisible ? null : listDetails;
  }
}

const alertButton = document.getElementById("alert-button");
const profileButton = document.getElementById("profile-button");
const notificationMenu = document.getElementById("notification-menu");
const profileNav = document.getElementById("profile-nav");
const toggleBtn = document.getElementById("toggle-btn");
const closeBtn = document.getElementById("close-btn");
const ctaSection = document.getElementById("cta-section");
const downArrow = document.querySelector(".down-arrow");
const upArrow = document.querySelector(".up-arrow");
const setupGuidePlan = document.querySelector(".setup-guide-plan");

const toggleClass = (className, element) => {
  if (element) {
    element.classList.toggle(className);
  } else {
    console.error("Invalid element provided to toggleClass function");
  }
};

alertButton.addEventListener("click", () =>
  toggleClass("alert-active", notificationMenu)
);

profileButton.addEventListener("click", () =>
  toggleClass("profile-active", profileNav)
);

closeBtn.addEventListener("click", () => (ctaSection.style.display = "none"));

// Set initial state
downArrow.style.opacity = "1";
upArrow.style.opacity = "0";

toggleBtn.addEventListener("click", function () {
  downArrow.style.opacity = downArrow.style.opacity === "1" ? "0" : "1";
  upArrow.style.opacity = upArrow.style.opacity === "0" ? "1" : "0";

  setupGuidePlan.style.display =
    upArrow.style.opacity === "1" ? "block" : "none";
});
