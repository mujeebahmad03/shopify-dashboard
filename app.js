const alertButton = document.getElementById("alert-button");
const profileButton = document.getElementById("profile-button");
const notificationMenu = document.getElementById("notification-menu");
const profileNav = document.getElementById("profile-nav");
const toggleOnboardingSteps = document.getElementById(
  "toggle-onboarding-steps"
);
const closeBtn = document.getElementById("close-btn");
const ctaSection = document.getElementById("cta-section");
const downArrow = document.querySelector(".down-arrow");
const upArrow = document.querySelector(".up-arrow");
const setupGuidePlan = document.getElementById("setup-guide-plan");

function toggleState(buttonIndex) {
  const listItems = document.querySelectorAll(".guide-list");
  const currentListItem = listItems[buttonIndex - 1];

  const uncheckedSvg = currentListItem.querySelector(".unchecked");
  const checkedSvg = currentListItem.querySelector(".checked");
  const loadingSvg = currentListItem.querySelector(".loading");

  const checkboxButton = currentListItem.querySelector(".check-box");
  const isChecked = checkedSvg.classList.contains("active");
  checkboxButton.setAttribute("aria-checked", isChecked.toString());

  if (isChecked) {
    currentListItem.querySelector(".list-details").classList.remove("active");
  }
  // Get the list title for updating the aria-label
  const listTitle = currentListItem.querySelector(".list-title").textContent;

  // Update progress bar based on checked state
  const progressBar = document.getElementById("progress-bar");
  const progressCount = document.getElementById("progress-count");

  const currentValue = parseInt(progressCount.textContent);
  const increment = isChecked ? -1 : 1;
  const newValue = Math.min(Math.max(currentValue + increment, 0), 5);

  if (isChecked) {
    // toggle off
    loadingSvg.classList.add("active");
    checkedSvg.classList.remove("active");
    progressCount.setAttribute("aria-label", "Loading, please wait...");

    setTimeout(function () {
      uncheckedSvg.classList.add("active");
      loadingSvg.classList.remove("active");
      updateProgressBar(newValue);
      showNextIncompleteStep(currentListItem);
      checkboxButton.setAttribute(
        "aria-label",
        `Marked ${listTitle} as not completed`
      );
      checkboxButton.setAttribute("aria-checked", "false");

      progressCount.setAttribute(
        "aria-label",
        `Successfully Marked ${listTitle} as not completed`
      );
    }, 3000);
  } else {
    // toggle on
    uncheckedSvg.classList.remove("active");
    loadingSvg.classList.add("active");

    progressCount.setAttribute("aria-label", "Loading, please wait...");

    setTimeout(function () {
      loadingSvg.classList.remove("active");
      checkedSvg.classList.add("active");
      updateProgressBar(newValue);
      showNextIncompleteStep(currentListItem);
      checkboxButton.setAttribute(
        "aria-label",
        `Marked ${listTitle} as completed`
      );
      checkboxButton.setAttribute("aria-checked", "true");
      progressCount.setAttribute(
        "aria-label",
        `Successfully Marked ${listTitle} as completed`
      );
    }, 3000);
  }

  function updateProgressBar(value) {
    const incrementPercentage = 20;
    const newWidth = value * incrementPercentage;
    progressBar.style.width = `${newWidth}%`;
    progressCount.textContent = `${value} / 5 completed`;

    // Reset aria-live after a short delay to allow multiple updates to be announced
    setTimeout(() => {
      progressCount.setAttribute("aria-live", "off");
    }, 100);
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

function toggleMenu({
  menuTrigger,
  menu,
  className,
  labelWhenClosed,
  labelWhenOpen,
  menuItemsSelector,
}) {
  const allMenuItems = menu.querySelectorAll(menuItemsSelector);
  const isExpanded = menuTrigger.getAttribute("aria-expanded") === "true";
  menu.classList.toggle(className);

  toggleAriaLabel(isExpanded, menuTrigger, labelWhenOpen, labelWhenClosed);

  if (isExpanded) {
    closeMenu(menuTrigger, menu);
    return;
  }

  openMenu(menuTrigger, menu, allMenuItems, className);
}

const closeMenu = (menuTrigger, menu) => {
  menuTrigger.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-hidden", "true");
  menuTrigger.focus();
};

const toggleAriaLabel = (
  isExpanded,
  menuTrigger,
  labelWhenOpen,
  labelWhenClosed
) => {
  if (menuTrigger.getAttribute("aria-label")) {
    const newLabel = isExpanded
      ? labelWhenClosed || "Collapsed"
      : labelWhenOpen || "Exapanded";
    menuTrigger.setAttribute("aria-label", newLabel);
  }
};

const openMenu = (menuTrigger, menu, allMenuItems, className) => {
  const handleEscapeKeyPress = (event) => {
    if (event.key === "Escape") {
      toggleMenu({ menuTrigger, menu, className });
      document.removeEventListener("keyup", handleEscapeKeyPress);
    }
  };

  menuTrigger.setAttribute("aria-expanded", "true");
  menu.setAttribute("aria-hidden", "false");
  if (allMenuItems.item(0)) {
    allMenuItems.item(0).focus();
  } else {
    return;
  }

  document.addEventListener("keyup", handleEscapeKeyPress);

  allMenuItems.forEach((menuItem, index) => {
    const handleArrowKeyPress = (event) =>
      handleArrowKey(event, index, allMenuItems);
    menuItem.addEventListener("keyup", handleArrowKeyPress);
  });
};

const handleArrowKey = (event, index, allMenuItems) => {
  const isLastMenuItem = index === allMenuItems.length - 1;
  const isFirstMenuItem = index === 0;
  const nextMenuItem = allMenuItems.item(index + 1);
  const prevMenuItem = allMenuItems.item(index - 1);

  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    if (isLastMenuItem) {
      allMenuItems.item(0).focus();
      return;
    }
    nextMenuItem.focus();
  }
  if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    if (isFirstMenuItem) {
      allMenuItems.item(allMenuItems.length - 1).focus();
      return;
    }
    prevMenuItem.focus();
  }
};

alertButton.addEventListener("click", () =>
  toggleMenu({
    className: "alert-active",
    menu: notificationMenu,
    menuTrigger: alertButton,
    labelWhenOpen: "Hide Notification menu",
    labelWhenClosed: "Show Notification menu",
    menuItemsSelector: '[role="menuitem"]',
  })
);

profileButton.addEventListener("click", () =>
  toggleMenu({
    className: "profile-active",
    menu: profileNav,
    menuTrigger: profileButton,
    menuItemsSelector: '[role="menuitem"]',
    labelWhenOpen: "Hide Profile Menu",
    labelWhenClosed: "Show Profile Menu",
  })
);

closeBtn.addEventListener("click", () => {
  ctaSection.style.display = "none";
  ctaSection.setAttribute("aria-hidden", "true");
});

toggleOnboardingSteps.addEventListener("click", () => {
  toggleMenu({
    className: "plan-active",
    menu: setupGuidePlan,
    menuTrigger: toggleOnboardingSteps,
    menuItemsSelector: '[role="menuitem"]',
    labelWhenOpen: "Hide Setup guide Menu",
    labelWhenClosed: "Show Setup guide Menu",
  });
});
