
/* =========================================
   1. PLAYER DATA FROM PHP
========================================= */

let currentPlayer = {};
window.profileCsrfToken = "";

/* =========================================
   2. SAFE TEXT HELPER
========================================= */

function safeText(value, fallback = "—") {
  if (
    value === null ||
    value === undefined ||
    String(value).trim() === ""
  ) {
    return fallback;
  }

  return String(value);
}


/* =========================================
   3. DISPLAY PLAYER INFORMATION
========================================= */

function renderProfile(player) {
  if (!player) return;

  currentPlayer = {
    ...currentPlayer,
    ...player
  };

  const p = currentPlayer;

  // Browser tab title
  document.title =
    `${safeText(p.username, "Player")} | U18 Football Community`;

  // Profile header
  document.getElementById("profile-username").textContent =
    safeText(p.username, "Player");

  document.getElementById("nav-username").textContent =
    safeText(p.username, "Daniel").trim().split(/\s+/)[0];

  document.getElementById("profile-bio").textContent =
    safeText(p.bio, "U18 Football Team");

  document.getElementById("profile-position").textContent =
    `Position: ${safeText(p.position, "Not set")}`;

  document.getElementById("profile-joined").textContent =
    `Joined ${safeText(p.joined)}`;

  const avatar = document.getElementById("avatar");

  if (avatar) {
    if (p.avatar) {
      avatar.src = p.avatar;
    } else {
      avatar.removeAttribute("src");
      avatar.alt = "Player profile image";
    }
  }

  // Player information card
  document.getElementById("info-fullname").textContent =
    safeText(p.username, "Player");

  document.getElementById("info-position").textContent =
    safeText(p.position, "Not set");

  document.getElementById("info-joined").textContent =
    safeText(p.joined);

  document.getElementById("info-agegroup").textContent =
    safeText(p.ageGroup, "U18");

  document.getElementById("info-email").textContent =
    safeText(p.email);


  /* =====================================
     DISPLAY GOALS
  ===================================== */

  const goals = document.getElementById("goals-list");

  goals.replaceChildren();

  const goalEntries = Array.isArray(p.goals) ? p.goals : [];
  if (goalEntries.length === 0) {
    const empty = document.createElement("div");
    empty.className = "goals-empty";
    const emptyTitle = document.createElement("strong");
    emptyTitle.textContent = "No goals set yet";
    const emptyMessage = document.createElement("span");
    emptyMessage.textContent =
      "Choose a weekly, monthly, or yearly target and add someone to keep you accountable.";
    empty.append(emptyTitle, emptyMessage);
    goals.append(empty);
  }

  goalEntries.forEach(goal => {
    const item = document.createElement("article");
    item.className = "goal-item";

    const icon = document.createElement("span");
    icon.className = "round-icon";
    icon.textContent =
      goal.period === "year" ? "★" : goal.period === "month" ? "◷" : "◎";

    const content = document.createElement("div");
    content.className = "goal-copy";

    const period = document.createElement("span");
    period.className = "goal-period";
    period.textContent = {
      week: "This week",
      month: "This month",
      year: "This year"
    }[goal.period] || "Goal";

    const title = document.createElement("strong");
    title.className = "goal-title";
    title.textContent = safeText(goal.title, "Player goal");

    const accountability = document.createElement("p");
    accountability.className = "goal-accountability";
    accountability.textContent =
      `Accountability partner: ${safeText(goal.accountability)}`;

    content.append(period, title, accountability);

    const actions = document.createElement("div");
    actions.className = "goal-actions";

    const editButton = document.createElement("button");
    editButton.className = "goal-action";
    editButton.type = "button";
    editButton.dataset.goalAction = "edit";
    editButton.dataset.goalId = String(goal.id);
    editButton.setAttribute("aria-label", `Customize goal: ${safeText(goal.title)}`);
    editButton.textContent = "Customize";

    const deleteButton = document.createElement("button");
    deleteButton.className = "goal-action goal-action-delete";
    deleteButton.type = "button";
    deleteButton.dataset.goalAction = "delete";
    deleteButton.dataset.goalId = String(goal.id);
    deleteButton.setAttribute("aria-label", `Delete goal: ${safeText(goal.title)}`);
    deleteButton.textContent = "Delete";
    actions.append(editButton, deleteButton);

    item.append(icon, content, actions);
    goals.append(item);
  });


  /* =====================================
     DISPLAY ACHIEVEMENTS
  ===================================== */

  const achievements =
    document.getElementById("achievements-list");

  achievements.replaceChildren();

  (p.achievements || []).forEach(achievement => {

    const item = document.createElement("article");
    item.className = "simple-card";

    const icon = document.createElement("span");
    icon.className = "round-icon";
    icon.textContent = achievement.icon || "✦";

    const textWrap = document.createElement("div");

    const title = document.createElement("strong");
    title.textContent =
      safeText(achievement.title, "Achievement");

    const desc = document.createElement("p");

    desc.textContent =
      `${safeText(achievement.desc, "")}` +
      `${achievement.unlocked ? "" : " · Not unlocked yet"}`;

    textWrap.append(title, desc);

    item.append(icon, textWrap);

    achievements.append(item);

  });

}


/* =========================================
   4. EDITABLE PROFILE COVER
========================================= */

const COVER_BACKGROUND_KEY = "u18-profile-cover-background-v1";
const profileCover = document.getElementById("profile-cover");
const coverImageInput = document.getElementById("cover-image-input");
const coverStatus = document.getElementById("cover-status");
const resetCoverButton = document.getElementById("reset-cover-btn");

function applyCoverBackground(imageData) {
  if (imageData) {
    profileCover.style.backgroundImage =
      `linear-gradient(90deg, #061d13b8, #061d1366 62%, #061d1320), url("${imageData}")`;
    profileCover.classList.add("has-custom-background");
    resetCoverButton.hidden = false;
    return;
  }

  profileCover.style.removeProperty("background-image");
  profileCover.classList.remove("has-custom-background");
  resetCoverButton.hidden = true;
}

function compressCoverImage(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Choose an image file."));
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      reject(new Error("Choose an image smaller than 12 MB."));
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => reject(new Error("The selected image could not be read."));
    reader.onload = () => {
      const image = new Image();

      image.onerror = () => reject(new Error("The selected file is not a usable image."));
      image.onload = () => {
        const maxDimension = 1600;
        const scale = Math.min(
          1,
          maxDimension / Math.max(image.naturalWidth, image.naturalHeight)
        );
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.naturalWidth * scale);
        canvas.height = Math.round(image.naturalHeight * scale);

        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Your browser could not prepare this image."));
          return;
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };

      image.src = String(reader.result);
    };

    reader.readAsDataURL(file);
  });
}

document.getElementById("change-cover-btn").addEventListener("click", () => {
  coverImageInput.click();
});

coverImageInput.addEventListener("change", async () => {
  const [file] = coverImageInput.files || [];
  if (!file) return;

  coverStatus.textContent = "Preparing your background…";

  try {
    const imageData = await compressCoverImage(file);
    localStorage.setItem(COVER_BACKGROUND_KEY, imageData);
    applyCoverBackground(imageData);
    coverStatus.textContent = "Background updated and saved on this device.";
  } catch (error) {
    coverStatus.textContent =
      error instanceof Error
        ? `Could not update the background: ${error.message}`
        : "Could not update the background.";
  } finally {
    coverImageInput.value = "";
  }
});

resetCoverButton.addEventListener("click", () => {
  try {
    localStorage.removeItem(COVER_BACKGROUND_KEY);
    applyCoverBackground("");
    coverStatus.textContent = "Default background restored.";
  } catch (error) {
    coverStatus.textContent = "The saved background could not be removed from this device.";
    console.error("Could not remove the saved profile cover.", error);
  }
});

try {
  const savedCover = localStorage.getItem(COVER_BACKGROUND_KEY);
  if (savedCover) applyCoverBackground(savedCover);
} catch (error) {
  coverStatus.textContent = "Saved background could not be loaded from this device.";
  console.error("Could not load the saved profile cover.", error);
}


/* =========================================
   5. EDIT PROFILE POPUP
========================================= */

const modal = document.getElementById("edit-modal");
const goalModal = document.getElementById("goal-modal");
const goalForm = document.getElementById("goal-form");
const goalsStatus = document.getElementById("goals-status");
const goalFormStatus = document.getElementById("goal-form-status");


function openEditModal() {

  document.getElementById("edit-username").value =
    currentPlayer.username || "";

  document.getElementById("edit-bio").value =
    currentPlayer.bio || "";

  document.getElementById("edit-position").value =
    currentPlayer.position || "Midfielder";

  modal.classList.remove("hidden");

  document.getElementById("edit-username").focus();

}


function closeEditModal() {
  modal.classList.add("hidden");
}


// Open popup
document
  .getElementById("edit-profile-btn")
  .addEventListener("click", openEditModal);


// Cancel editing
document
  .getElementById("cancel-edit")
  .addEventListener("click", closeEditModal);


// Close popup using X
document
  .getElementById("close-modal")
  .addEventListener("click", closeEditModal);


// Close popup by clicking outside it
modal.addEventListener("click", event => {

  if (event.target === modal) {
    closeEditModal();
  }

});


// Close popup with Escape
document.addEventListener("keydown", event => {

  if (event.key === "Escape") {
    closeEditModal();
    closeGoalModal();
  }

});


/* =========================================
   6. SAVE EDITED PROFILE TO MYSQL
========================================= */

document
  .getElementById("edit-form")
  .addEventListener("submit", async event => {

    event.preventDefault();

    const updated = {
      username: document
        .getElementById("edit-username")
        .value
        .trim(),

      bio: document
        .getElementById("edit-bio")
        .value
        .trim(),

      position: document
        .getElementById("edit-position")
        .value
    };

    if (!updated.username) {
      alert("Please enter your name.");
      return;
    }

    const saveButton = document.querySelector(
      "#edit-form button[type='submit']"
    );
    saveButton.disabled = true;

    try {
      const response = await fetch("update_profile.php", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": window.profileCsrfToken || ""
        },
        body: JSON.stringify(updated)
      });

      if (response.status === 401) {
        window.location.href = "login.html";
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not save your profile.");
      }

      const loaded = await loadProfile();
      if (!loaded) return;

      closeEditModal();
      alert("Your profile has been updated!");
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Could not save your profile."
      );
    } finally {
      saveButton.disabled = false;
    }

  });


/* =========================================
   7. CREATE, EDIT, AND DELETE PLAYER GOALS
========================================= */

function openGoalModal(goal = null) {
  goalForm.reset();
  goalFormStatus.textContent = "";
  goalForm.querySelectorAll("[aria-invalid='true']").forEach(field => {
    field.removeAttribute("aria-invalid");
  });
  goalForm.dataset.goalId = goal ? String(goal.id) : "";

  document.getElementById("goal-modal-title").textContent =
    goal ? "Customize your goal" : "Create your goal";
  document.getElementById("save-goal").textContent =
    goal ? "Save changes" : "Save goal";

  if (goal) {
    document.getElementById("goal-period").value = goal.period;
    document.getElementById("goal-title").value = goal.title;
    document.getElementById("goal-accountability").value =
      goal.accountability;
  }

  goalModal.classList.remove("hidden");
  document.getElementById("goal-period").focus();
}

function closeGoalModal() {
  goalModal.classList.add("hidden");
}

document
  .getElementById("add-goal-btn")
  .addEventListener("click", () => openGoalModal());

document
  .getElementById("cancel-goal")
  .addEventListener("click", closeGoalModal);

document
  .getElementById("close-goal-modal")
  .addEventListener("click", closeGoalModal);

goalModal.addEventListener("click", event => {
  if (event.target === goalModal) closeGoalModal();
});

document
  .getElementById("goals-list")
  .addEventListener("click", async event => {
    const button = event.target.closest("button[data-goal-action]");
    if (!button) return;

    const goal = (currentPlayer.goals || []).find(
      item => String(item.id) === button.dataset.goalId
    );
    if (!goal) return;

    if (button.dataset.goalAction === "edit") {
      openGoalModal(goal);
      return;
    }

    if (!window.confirm("Delete this goal? This cannot be undone.")) return;

    button.disabled = true;
    goalsStatus.textContent = "";

    try {
      const response = await fetch("manage_goals.php", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": window.profileCsrfToken || ""
        },
        body: JSON.stringify({ action: "delete", goalId: goal.id })
      });

      if (response.status === 401) {
        window.location.href = "login.html";
        return;
      }

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Could not delete this goal.");
      }

      currentPlayer.goals = currentPlayer.goals.filter(
        item => String(item.id) !== String(goal.id)
      );
      renderProfile(currentPlayer);
      goalsStatus.textContent = "Goal deleted.";
    } catch (error) {
      console.error(error);
      goalsStatus.textContent =
        error instanceof Error ? error.message : "Could not delete this goal.";
    } finally {
      button.disabled = false;
    }
  });

goalForm.addEventListener("submit", async event => {
  event.preventDefault();
  goalFormStatus.textContent = "";

  const period = document.getElementById("goal-period");
  const title = document.getElementById("goal-title");
  const accountability = document.getElementById("goal-accountability");
  const fields = [period, title, accountability];
  fields.forEach(field => field.removeAttribute("aria-invalid"));

  if (!title.value.trim() || !accountability.value.trim()) {
    const invalidField = !title.value.trim() ? title : accountability;
    invalidField.setAttribute("aria-invalid", "true");
    invalidField.focus();
    goalFormStatus.textContent =
      "Add your goal and the person who will keep you accountable.";
    return;
  }

  const saveButton = document.getElementById("save-goal");
  saveButton.disabled = true;

  try {
    const goalId = goalForm.dataset.goalId;
    const response = await fetch("manage_goals.php", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": window.profileCsrfToken || ""
      },
      body: JSON.stringify({
        action: "save",
        goalId,
        period: period.value,
        goal: title.value.trim(),
        accountability: accountability.value.trim()
      })
    });

    if (response.status === 401) {
      window.location.href = "login.html";
      return;
    }

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Could not save your goal.");
    }

    const loaded = await loadProfile();
    if (!loaded) return;

    closeGoalModal();
    goalsStatus.textContent = goalId ? "Goal updated." : "Goal added.";
  } catch (error) {
    console.error(error);
    goalFormStatus.textContent =
      error instanceof Error ? error.message : "Could not save your goal.";
  } finally {
    saveButton.disabled = false;
  }
});


/* =========================================
   8. SWITCH BETWEEN PROFILE SECTIONS
========================================= */

document.querySelectorAll(".section-tab").forEach(button => {

  button.addEventListener("click", () => {

    // Remove active state from all tabs
    document.querySelectorAll(".section-tab")
      .forEach(tab => {
        tab.classList.remove("active");
      });

    // Hide all content panels
    document.querySelectorAll(".tab-panel")
      .forEach(panel => {
        panel.classList.remove("active");
      });

    // Activate clicked tab
    button.classList.add("active");

    const panel = document.getElementById(
      `tab-${button.dataset.tab}`
    );

    if (panel) {
      panel.classList.add("active");
    }

  });

});


/* =========================================
   8. FEEDBACK BUTTON
========================================= */

document
  .getElementById("send-feedback")
  .addEventListener("click", () => {

    const message = document
      .getElementById("feedback-message")
      .value
      .trim();

    const status =
      document.getElementById("feedback-status");

    if (!message) {

      status.textContent =
        "Please write a short message first.";

      return;
    }

    status.textContent =
      "Thanks! Feedback is preview-only until a PHP endpoint is connected.";

    document.getElementById("feedback-message").value = "";

  });


/* =========================================
   9. LOGOUT BUTTON
========================================= */

document
  .getElementById("logout-btn")
  .addEventListener("click", () => {
    window.location.href = "logout.php";
  });


/* =========================================
   10. LOAD PLAYER PROFILE FROM PHP
========================================= */

async function loadProfile() {
  try {
    const response = await fetch("profile.php", {
      credentials: "same-origin"
    });

    if (response.status === 401) {
      window.location.href = "login.html";
      return;
    }

    if (!response.ok) {
      throw new Error("Could not retrieve player profile.");
    }

    const player = await response.json();

    renderProfile(player);
    window.profileCsrfToken = player.csrfToken;

    return true;
  } catch (error) {
    console.error(error);
    alert("Could not load your profile. Please try again.");
    return false;
  }
}

loadProfile();


/* =========================================
   COMMUNITY NAVIGATION SEARCH
========================================= */

const profileSearchForm =
  document.getElementById("profile-search-form");
const profileSearchInput =
  document.getElementById("profile-search");
const profileSearchResults =
  document.getElementById("profile-search-results");

const profileSearchItems = [
  {
    title: "Home",
    description: "Go to the community home page.",
    keywords: "home welcome start",
    href: "practice.html"
  },
  {
    title: "Lift Others Up",
    description: "Recognise and encourage teammates.",
    keywords: "recognition encouragement teammates support",
    href: "liftothersup.html"
  },
  {
    title: "Progress",
    description: "Review development and progress activity.",
    keywords: "development improvement progress tracking",
    href: "text.html"
  },
  {
    title: "Challenges",
    description: "Browse team challenges and plans.",
    keywords: "team challenges activities plans",
    href: "challenges.html"
  },
  {
    title: "My Goals",
    description: "Add, review, and customize your goals.",
    keywords: "goals targets timeframe accountability",
    tab: "goals"
  },
  {
    title: "Achievements",
    description: "Review your achievements.",
    keywords: "achievements awards",
    tab: "achievements"
  },
  {
    title: "My Challenges",
    description: "Review your current player challenges.",
    keywords: "challenges tasks",
    tab: "challenges"
  },
  {
    title: "My Team",
    description: "View your team information.",
    keywords: "team squad",
    tab: "team"
  },
  {
    title: "My Progress",
    description: "Review your season progress.",
    keywords: "progress season training teamwork",
    tab: "progress"
  },
  {
    title: "Feedback",
    description: "Share feedback about the community.",
    keywords: "feedback message suggestion",
    tab: "feedback"
  },
  {
    title: "Player Information",
    description: "Review your name, position, and account details.",
    keywords: "player information profile position email",
    target: ".player-information"
  }
];

function closeProfileSearch() {
  profileSearchResults.hidden = true;
  profileSearchInput.setAttribute("aria-expanded", "false");
}

function selectProfileSearchItem(item) {
  closeProfileSearch();

  if (item.href) {
    window.location.href = item.href;
    return;
  }

  if (item.goalId) {
    const goal = (currentPlayer.goals || []).find(
      entry => String(entry.id) === String(item.goalId)
    );

    if (goal) {
      openGoalModal(goal);
      return;
    }
  }

  if (item.tab) {
    document
      .querySelector(`.section-tab[data-tab="${item.tab}"]`)
      ?.click();

    document
      .getElementById(`tab-${item.tab}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  if (item.target) {
    document
      .querySelector(item.target)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function searchProfile() {
  const query = profileSearchInput.value.trim().toLocaleLowerCase();
  profileSearchResults.replaceChildren();

  if (!query) {
    const message = document.createElement("p");
    message.className = "nav-search-empty";
    message.textContent =
      "Search for pages, profile sections, or one of your goals.";
    profileSearchResults.append(message);
    profileSearchResults.hidden = false;
    profileSearchInput.setAttribute("aria-expanded", "true");
    return;
  }

  const items = [
    ...profileSearchItems,
    ...(Array.isArray(currentPlayer.goals) ? currentPlayer.goals : []).map(goal => ({
      title: safeText(goal.title, "Player goal"),
      description: `${safeText(goal.period, "Goal")} goal · Select to customize this goal.`,
      keywords: `${safeText(goal.accountability, "")} goal customize edit`,
      goalId: goal.id
    }))
  ];
  const terms = query.split(/\s+/);
  const matches = items.filter(item => {
    const content =
      `${item.title} ${item.description} ${item.keywords || ""}`
        .toLocaleLowerCase();
    return terms.every(term => content.includes(term));
  });

  if (matches.length === 0) {
    const message = document.createElement("p");
    message.className = "nav-search-empty";
    message.textContent = "No matching pages, sections, or goals found.";
    profileSearchResults.append(message);
  } else {
    matches.forEach(item => {
      const result = document.createElement("button");
      result.type = "button";
      result.className = "nav-search-result";

      const title = document.createElement("strong");
      title.textContent = item.title;

      const description = document.createElement("span");
      description.textContent = item.description;

      result.append(title, description);
      result.addEventListener("click", () => selectProfileSearchItem(item));
      profileSearchResults.append(result);
    });
  }

  profileSearchResults.hidden = false;
  profileSearchInput.setAttribute("aria-expanded", "true");
}

profileSearchForm.addEventListener("submit", event => {
  event.preventDefault();
  searchProfile();
});

profileSearchInput.addEventListener("input", searchProfile);
profileSearchInput.addEventListener("keydown", event => {
  if (event.key === "Escape") closeProfileSearch();
});

document.addEventListener("click", event => {
  if (
    event.target instanceof Element &&
    !event.target.closest(".nav-search")
  ) {
    closeProfileSearch();
  }
});