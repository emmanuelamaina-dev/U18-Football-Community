console.log("TEXT.JS IS RUNNING"); 

const navbar =
    document.getElementById("navbar");

const notice =
    document.getElementById("notice");

const heroSection =
    document.querySelector(".hero-section");

const heroImage =
    document.querySelector(".hero-image");


if (heroSection && heroImage) {

    function markHeroImageLoaded() {

        heroSection.classList.remove("hero-image-loading");

        heroSection.classList.add("hero-image-loaded");

    }


    function markHeroImageFailed() {

        heroSection.classList.remove("hero-image-loading");

        heroSection.classList.add("hero-image-error");

        console.error(
            `Unable to load progress hero image: ${heroImage.src}`
        );

    }


    if (heroImage.complete) {

        if (heroImage.naturalWidth > 0) {

            markHeroImageLoaded();

        } else {

            markHeroImageFailed();

        }

    } else {

        heroImage.addEventListener(
            "load",
            markHeroImageLoaded,
            { once: true }
        );

        heroImage.addEventListener(
            "error",
            markHeroImageFailed,
            { once: true }
        );

    }

}


/* ================= SCROLL EFFECT ================= */

window.addEventListener("scroll", () => {

    navbar.classList.toggle(
        "scrolled",
        window.scrollY > 25
    );

});


/* ================= MOBILE NAVIGATION ================= */

const mobileMenu =
    document.getElementById("mobileMenu");

const navLinks =
    document.querySelector(".nav-links");


mobileMenu.addEventListener("click", () => {

    const isExpanded =
        mobileMenu.getAttribute("aria-expanded") === "true";

    mobileMenu.setAttribute(
        "aria-expanded",
        String(!isExpanded)
    );

    navLinks.classList.toggle("show", !isExpanded);

});


navLinks.addEventListener("click", (event) => {

    const clickedLink =
        event.target.closest("a");

    if (clickedLink) {

        navLinks
            .querySelectorAll("a")
            .forEach((link) => {

                link.classList.toggle("active", link === clickedLink);

                if (link === clickedLink) {

                    link.setAttribute("aria-current", "page");

                } else {

                    link.removeAttribute("aria-current");

                }

            });

        navLinks.classList.remove("show");

        mobileMenu.setAttribute("aria-expanded", "false");

    }

});


/* ================= SMALL NOTIFICATION ================= */

function showNotice(message) {

    notice.textContent = message;

    notice.style.display = "block";

    clearTimeout(window.noticeTimer);

    window.noticeTimer = setTimeout(() => {

        notice.style.display = "none";

    }, 1800);

}


/* ================= SEARCH ================= */

const searchInput =
    document.getElementById("searchInput");

const searchResults =
    document.getElementById("searchResults");


const searchableSections = [
    {
        title: "Progress overview",
        description: "View your improvement, persistence, teamwork, and overall progress.",
        target: "progress-cards",
        keywords: ["progress", "overview", "improvement", "persistence", "teamwork", "overall"]
    },
    {
        title: "Development areas",
        description: "Review the areas you're working to develop.",
        target: "developmentPreview",
        keywords: ["development", "areas", "skills", "challenges", "improve"]
    },
    {
        title: "Recent activity",
        description: "See your latest training and community activity.",
        target: "activityPreview",
        keywords: ["recent", "activity", "training", "history"]
    },
    {
        title: "Progress chat",
        description: "Ask a question about your goals, training, or development.",
        target: "progress-chat",
        keywords: ["chat", "help", "goals", "training", "question", "support"]
    }
];


function closeSearchResults() {

    searchResults.hidden = true;

    searchInput.setAttribute("aria-expanded", "false");

}


function showSearchResults(matches, emptyMessage) {

    searchResults.replaceChildren();

    if (matches.length === 0) {

        const message = document.createElement("p");

        message.className = "search-no-results";

        message.textContent =
            emptyMessage ||
            "No matching sections found. Try “progress”, “activity”, or “chat”.";

        searchResults.appendChild(message);

    } else {

        matches.forEach((section) => {

            const result = document.createElement("button");

            result.type = "button";

            result.className = "search-result";

            const title = document.createElement("strong");

            title.textContent = section.title;

            const description = document.createElement("span");

            description.textContent = section.description;

            result.append(title, description);

            result.addEventListener("click", () => {

                const target =
                    document.getElementById(section.target);

                if (!target) {

                    showNotice("That section isn't available right now.");

                    return;

                }

                closeSearchResults();

                if (section.target === "progress-chat") {

                    document
                        .getElementById("communityChat")
                        .removeAttribute("hidden");

                    document
                        .getElementById("chatLauncher")
                        .setAttribute("aria-expanded", "true");

                }

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                if (section.target === "progress-chat") {

                    document.getElementById("chatInput").focus({
                        preventScroll: true
                    });

                }

            });

            searchResults.appendChild(result);

        });

    }

    searchResults.hidden = false;

    searchInput.setAttribute("aria-expanded", "true");

}


document
    .getElementById("searchBtn")
    .addEventListener("click", search);


searchInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        search();

    } else if (event.key === "Escape") {

        closeSearchResults();

    }

});

searchInput.addEventListener("input", () => {
    if (searchInput.value.trim()) {
        search();
    } else {
        closeSearchResults();
    }
});


document.addEventListener("click", (event) => {

    if (
        event.target instanceof Element &&
        !event.target.closest(".search-area")
    ) {

        closeSearchResults();

    }

});


function search() {

    const value =
        document
            .getElementById("searchInput")
            .value
            .trim()
            .toLowerCase();


    if (!value) {

        showSearchResults(
            [],
            "Enter a topic such as “progress”, “training”, or “chat”."
        );

        return;
    }

    const terms = value
        .split(/\s+/)
        .filter((term) => term.length > 1);

    const matches = searchableSections.filter((section) => {

        const content =
            `${section.title} ${section.keywords.join(" ")}`.toLowerCase();

        return content.includes(value) ||
            terms.every((term) => content.includes(term));

    });

    showSearchResults(matches);

}


/* ================= AWARD CARDS ================= */

/*
    Clicking one of the four recognition cards
    automatically selects its category in the form.
*/

document
    .querySelectorAll(".award")
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                document
                    .getElementById("category")
                    .value =
                    card.dataset.category;


                document
                    .querySelector(".recognition-form")
                    .scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });


                showNotice(
                    card.dataset.category +
                    " selected."
                );

            }
        );

    });


/* ================= CHARACTER COUNTER ================= */

const message =
    document.getElementById("message");

const counter =
    document.getElementById("counter");


if (message && counter) {

    message.addEventListener(
        "input",
        () => {

            counter.textContent =
                message.value.length;

        }
    );

}


/* ================= RECOGNITION FORM ================= */

const recognitionForm =
    document.getElementById("recognitionForm");


if (recognitionForm) {

    recognitionForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const player =
                document
                    .getElementById("player")
                    .value;


            const category =
                document
                    .getElementById("category")
                    .value;


            const text =
                message.value.trim();


            /* Check form */

            if (
                !player ||
                !category ||
                !text
            ) {

                showNotice(
                    "Please complete the form."
                );

                return;

            }


            /* Require a useful message */

            if (text.length < 10) {

                showNotice(
                    "Add a little more to the message."
                );

                return;

            }


            /* Create initials */

            const initials =
                player
                    .split(" ")
                    .map(word => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();


            /* Create new feed item */

            const item =
                document.createElement(
                    "article"
                );


            item.className =
                "feed-item";


            item.dataset.category =
                category;


            item.innerHTML = `

                <div class="avatar blue">
                    ${initials}
                </div>

                <div>

                    <div class="feed-meta">

                        <b>
                            ${category}
                        </b>

                        <small>
                            Just now
                        </small>

                    </div>


                    <h3>
                        ${escapeHTML(player)}
                    </h3>


                    <p>
                        ${escapeHTML(text)}
                    </p>


                    <small>
                        — You
                    </small>

                </div>

            `;


            /* Add to beginning of feed */

            document
                .getElementById("feedList")
                .prepend(item);


            /* Clear form */

            event.target.reset();

            counter.textContent =
                "0";


            showNotice(
                "Recognition added."
            );

        }
    );

}

/* ================= FILTER ================= */

const filter =
    document.getElementById("filter");


if (filter) {

    filter.addEventListener(
        "change",
        function () {

            const selected =
                this.value;


            document
                .querySelectorAll(".feed-item")
                .forEach(item => {

                    if (
                        selected === "All" ||
                        item.dataset.category === selected
                    ) {

                        item.style.display =
                            "flex";

                    } else {

                        item.style.display =
                            "none";

                    }

                });

        }
    );

}


/* ================= COMMUNITY CHAT ================= */

const chatLauncher =
    document.getElementById("chatLauncher");

const communityChat =
    document.getElementById("communityChat");

const chatClose =
    document.getElementById("chatClose");

const chatForm =
    document.getElementById("chatForm");

const chatInput =
    document.getElementById("chatInput");

const messages =
    document.getElementById("messages");

let awaitingTrainingConfirmation = false;


function toggleCommunityChat() {

    const isHidden =
        communityChat.hasAttribute("hidden");

    if (isHidden) {

        communityChat.removeAttribute("hidden");

        chatLauncher.setAttribute("aria-expanded", "true");

    } else {

        communityChat.setAttribute("hidden", "hidden");

        chatLauncher.setAttribute("aria-expanded", "false");

    }

}


chatLauncher.addEventListener("click", toggleCommunityChat);

chatClose.addEventListener("click", toggleCommunityChat);


function addCommunityMessage(author, text, type) {

    const item = document.createElement("div");

    item.className = `chat-message ${type}`;

    const name = document.createElement("div");

    name.className = "chat-name";

    name.textContent = author;

    const body = document.createElement("p");

    body.textContent = text;

    const time = document.createElement("small");

    time.textContent = "Now";

    item.append(name, body, time);

    messages.appendChild(item);

    messages.scrollTop = messages.scrollHeight;

}


function getCommunityReplies(text) {

    const lower =
        text.toLowerCase().replace(/[’']/g, "'");

    const isYes =
        /\b(yes really|yeah really|yep really|for real|seriously|yes|yeah|yep)\b/.test(lower);

    if (awaitingTrainingConfirmation && isYes) {

        awaitingTrainingConfirmation = false;

        return [
            {
                author: "Daniel",
                text: "Oh, nice! Thanks for letting us know 😄"
            }
        ];

    }

    awaitingTrainingConfirmation = false;

    if (
        /\b(stressed|stress|overwhelmed|anxious|anxiety|worried|nervous)\b/.test(lower)
    ) {

        return [
            {
                author: "Aisha",
                text: "I'm sorry, that sounds like a lot. It's okay to feel stressed. Want to take a slow breath with me? In... and out. You don't have to sort everything out right now."
            },
            {
                author: "Daniel",
                text: "Yeah, take your time. Want to tell us what's been weighing on you?"
            }
        ];

    }

    if (
        /\b(burn(?:ed|t)? out|burnout|exhausted|worn out|too tired|constantly tired|always tired)\b/.test(lower)
    ) {

        return [
            {
                author: "Ethan",
                text: "Training a lot and still feeling wiped out sounds rough. You don't have to push through it—taking a break is okay."
            },
            {
                author: "Aisha",
                text: "Could you let your coach and a parent or trusted adult know how tired you've been? They can help you work out whether to ease up. If it keeps happening or you feel unwell, please tell an adult."
            }
        ];

    }

    if (
        /\b(good enough|don't deserve|dont deserve|not deserve|deserve you|don't belong|dont belong|not belong|left out|excluded|lonely)\b/.test(lower)
    ) {

        return [
            {
                author: "Aisha",
                text: "I'm really glad you told us. You matter here, even when you're having a hard time. Want to tell us what happened?"
            },
            {
                author: "Jayce",
                text: "Yeah, you don't have to prove yourself to us. You deserve support, and you shouldn't have to carry this on your own. Is there a trusted adult you feel okay talking to?"
            }
        ];

    }

    if (
        /\b(dribbl|take.?ons?|ball control)\b/.test(lower) ||
        (
            /\b(improve|better|work on|get better)\b/.test(lower) &&
            /\b(skill|football|soccer|myself|technique)\b/.test(lower)
        )
    ) {

        return [
            {
                author: "Jayce",
                text: "Dribbling's mostly about close touches and changing direction. After warming up, try a few minutes weaving around cones or water bottles with both feet, then practise inside-outside touches and sole rolls. Finish by changing pace after each turn, like you're getting past a defender. Start slowly and speed up when it feels comfortable."
            },
            {
                author: "Ethan",
                text: "Water bottles work fine if you haven't got cones. Keep it short and fun—your coach can also give you a move to practise."
            }
        ];

    }

    if (
        /\b(training|practice|session)\b/.test(lower) &&
        /\btomorrow\b/.test(lower)
    ) {

        awaitingTrainingConfirmation = true;

        return [
            {
                author: "Ethan",
                text: "Oh really? What time?"
            }
        ];

    }

    if (
        /\b(track|tracking|measure|record|log)\b/.test(lower) &&
        /\b(progress|improv|goal|training|skill)\b/.test(lower)
    ) {

        return [
            {
                author: "Daniel",
                text: "Maybe pick one thing you're working on and jot down what you practised each week and how it felt. Little changes can be hard to notice day to day. You could check in with your coach after a couple of weeks too."
            }
        ];

    }

    if (
        /\b(goal|goals|aim|target)\b/.test(lower)
    ) {

        return [
            {
                author: "Aisha",
                text: "Maybe start with one goal that matters to you and choose a small step you can try this week. It doesn't have to be perfect. What are you hoping to work on?"
            }
        ];

    }

    if (
        /\b(football|soccer)\b/.test(lower)
    ) {

        return [
            {
                author: "Ethan",
                text: "Oh, football! Nice 😊 Do you play, or mostly enjoy watching?"
            }
        ];

    }

    if (
        /\b(hi|hello|hey)\b/.test(lower) &&
        (
            /\b(how have you been|how are you|how's it going|how is it going|what's up|whats up)\b/.test(lower) ||
            lower.split(/\s+/).length <= 4
        )
    ) {

        return [
            {
                author: "Aisha",
                text: "Hey! I'm good, thanks 😊 How've you been?"
            },
            {
                author: "Daniel",
                text: "Hey! Not bad. How's your week going?"
            },
            {
                author: "Jayce",
                text: "Hey everyone! Anyone get a good kickabout in this week?"
            },
            {
                author: "Ethan",
                text: "Hey, good to hear from you all. What's been happening?"
            }
        ];

    }

    if (
        /\b(thanks|thank you)\b/.test(lower)
    ) {

        return [
            {
                author: "Aisha",
                text: "Of course 😊 I'm glad you told me."
            }
        ];

    }

    return [
        {
            author: "Ethan",
            text: "Oh, I hear you. Want to tell me a little more? I'm listening."
        }
    ];

}


chatForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const text = chatInput.value.trim();

    if (!text) {

        return;

    }

    addCommunityMessage("You", text, "sent");

    chatInput.value = "";

    getCommunityReplies(text).forEach((reply, index) => {

        window.setTimeout(() => {

            addCommunityMessage(
                reply.author,
                reply.text,
                "received"
            );

        }, 600 + index * 900);

    });

});


/* ================= SECURITY ================= */

/*
    Prevents text entered by the user from
    being interpreted as HTML.
*/

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        value;


    return div.innerHTML;

}


/* ================= PLAYER PROGRESS ================= */


async function loadPlayerProgress() {
    try {
        const response = await fetch("progress.php", {
            credentials: "same-origin"
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || "Unable to load progress.");
        }

        console.log("Player progress:", data);

        // OVERALL PROGRESS
        const overallValue = document.getElementById("overallValue");
        if (overallValue) {
            overallValue.textContent = data.overallProgress + "%";
        }

        // INDIVIDUAL DEVELOPMENT AREAS
        const progressRecords = data.progress || [];

        const developmentAreas = {
            improvement: {
                value: document.getElementById("improvementValue"),
                bar: document.getElementById("improvementBar")
            },
            persistence: {
                value: document.getElementById("persistenceValue"),
                bar: document.getElementById("persistenceBar")
            },
            teamwork: {
                value: document.getElementById("teamworkValue"),
                bar: document.getElementById("teamworkBar")
            }
        };

        // Match each development area to its database records.
        const areaKeywords = {
            improvement: ["technical skills", "improvement"],
            persistence: ["persistence", "consistency", "discipline"],
            teamwork: ["teamwork", "communication", "collaboration"]
        };

        for (const [area, elements] of Object.entries(developmentAreas)) {
            const matchingRecords = progressRecords.filter(record => {
                const areaName = (
                    record.Development_Area || ""
                ).toLowerCase();

                return areaKeywords[area].some(keyword =>
                    areaName.includes(keyword)
                );
            });

            if (matchingRecords.length > 0) {
                const percentage = Math.round(
                    matchingRecords.reduce(
                        (total, record) =>
                            total + Number(record.Progress_Percentage || 0),
                        0
                    ) / matchingRecords.length
                );

                if (elements.value) {
                    elements.value.textContent = percentage + "%";
                }

                if (elements.bar) {
                    elements.bar.style.width = percentage + "%";
                }
            } else {
                console.warn(
                    "No database records matched the area:",
                    area
                );
            }
        }

        // DEVELOPMENT AREAS: compact dashboard preview
        const developmentPreview = document.getElementById("developmentPreview");

        if (developmentPreview) {
            developmentPreview.innerHTML = progressRecords.length
                ? progressRecords.slice(0, 2).map(record => `
                    <div class="development-area-item">
                        <strong>${escapeHTML(record.Goal || "Development goal")}</strong>
                        <p>${Number(record.Progress_Percentage || 0)}% complete</p>
                    </div>
                `).join("")
                : "No development goals yet.";
        }

        // Sort records newest first
        const recentRecords = [...progressRecords].sort((a, b) =>
            new Date(b.Progress_Date || 0) - new Date(a.Progress_Date || 0)
        );

        // RECENT ACTIVITY: compact preview
        const activityPreview = document.getElementById("activityPreview");

        if (activityPreview) {
            activityPreview.innerHTML = recentRecords.length
                ? recentRecords.slice(0, 2).map(record => `
                    <div class="recent-activity-item">
                        <strong>${escapeHTML(record.Goal || "Progress update")}</strong>
                        <p>${escapeHTML(record.Progress_Status || "In progress")}</p>
                    </div>
                `).join("")
                : "No recent activity yet.";
        }

    } catch (error) {
        console.error("Progress loading failed:", error);
    }
}

// Safely display database text inside HTML.
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

document.addEventListener("DOMContentLoaded", loadPlayerProgress);
window.loadPlayerProgress = loadPlayerProgress;

console.log("Progress loader registered");

// Make the function accessible from the browser console.
window.loadPlayerProgress = loadPlayerProgress;
console.log("Progress loader registered");