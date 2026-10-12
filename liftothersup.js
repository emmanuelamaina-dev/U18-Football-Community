/* =========================================
   RISE UP - LIFT OTHERS UP
========================================= */

/* =========================================
   HERO IMAGE
========================================= */

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
            `Unable to load hero image: ${heroImage.src}`
        );

    }


    if (heroImage.complete) {

        if (heroImage.naturalWidth > 0) {

            markHeroImageLoaded();

        } else {

            markHeroImageFailed();

        }

    } else {

        heroSection.classList.add("hero-image-loading");

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


/* =========================================
   NAVBAR SCROLL EFFECT
========================================= */

const navbar = document.getElementById("navbar");

window.addEventListener("scroll", function () {

    if (window.scrollY > 40) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

});


/* =========================================
   MOBILE MENU
========================================= */

const mobileMenu =
    document.getElementById("mobileMenu");

const navLinks =
    document.querySelector(".nav-links");


mobileMenu.addEventListener("click", function () {

    navLinks.classList.toggle("show");

});


/* =========================================
   SEARCH BAR
========================================= */

const searchInput =
    document.getElementById("searchInput");

const searchBtn =
    document.getElementById("searchBtn");

const searchResults =
    document.getElementById("searchResults");


const searchableFeatures = [
    {
        title: "Lift Others Up",
        description: "Go to the top of this page and learn how to build a stronger team.",
        target: "home",
        keywords: ["home", "page", "hero", "rise up", "team spirit", "lifting others up"]
    },
    {
        title: "Teamwork and encouragement",
        description: "Read how small acts of support help teammates stay motivated.",
        target: "teamwork",
        keywords: ["about", "teamwork", "encourage", "encouragement", "stronger team", "support"]
    },
    {
        title: "Recognition awards",
        description: "Browse recognition categories such as Most Improved and Best Teammate.",
        target: "awards",
        keywords: ["awards", "recognition", "categories", "most improved", "most persistent", "most supportive", "best teammate", "progress", "celebrate"]
    },
    {
        title: "Give a recognition",
        description: "Choose a teammate and category, write an encouraging message, and submit it.",
        target: "recognition-form",
        keywords: ["give recognition", "recognition form", "submit recognition", "write message", "send encouragement", "nominate", "teammate", "player"]
    },
    {
        title: "Recognition feed",
        description: "View team recognitions and filter the feed by category.",
        target: "recognition-feed",
        keywords: ["feed", "recognition feed", "view recognitions", "recent recognitions", "filter"]
    },
    {
        title: "Community chat",
        description: "Open the team chat in a compact panel at the side of the page.",
        target: "community",
        keywords: ["chat", "community", "team chat", "talk", "messages"]
    }
];


const searchStopWords = new Set([
    "a", "about", "an", "and", "at", "can", "do", "feature", "features",
    "find", "for", "go", "help", "how", "i", "in", "is", "me", "my", "of",
    "on", "open", "page", "please", "show", "take", "the", "this", "to",
    "use", "want", "what", "where", "with", "you"
]);


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
            "No matching page features found. Try “recognition”, “chat”, or “training”.";

        searchResults.appendChild(message);

    } else {

        matches.forEach(function (feature) {

            const result = document.createElement("button");

            result.type = "button";

            result.className = "search-result";

            const title = document.createElement("strong");

            title.textContent = feature.title;

            const description = document.createElement("span");

            description.textContent = feature.description;

            result.append(title, description);

            result.addEventListener("click", function () {

                const target =
                    document.getElementById(feature.target);

                if (!target) {

                    showNotification(
                        "This page feature could not be opened."
                    );

                    return;

                }

                const chatPanel =
                    document.getElementById("communityChat");

                if (
                    chatPanel &&
                    (chatPanel.contains(target) || target.id === "community")
                ) {

                    chatPanel.removeAttribute("hidden");

                    document
                        .getElementById("chatLauncher")
                        .setAttribute("aria-expanded", "true");

                }

                closeSearchResults();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            });

            searchResults.appendChild(result);

        });

    }

    searchResults.hidden = false;

    searchInput.setAttribute("aria-expanded", "true");

}


function searchPage() {

    const search =
        searchInput.value.trim().toLowerCase();


    if (search === "") {

        showSearchResults(
            [],
            "Enter a feature or topic, such as “recognition”, “chat”, or “training”."
        );

        return;
    }

    const terms = search
        .split(/\s+/)
        .filter(function (term) {
            return term.length > 1 && !searchStopWords.has(term);
        });

    const matches = searchableFeatures.filter(function (feature) {

        const searchableText =
            `${feature.title} ${feature.keywords.join(" ")}`.toLowerCase();

        return terms.length === 0 ||
            searchableText.includes(search) ||
            (terms.length > 0 && terms.every(function (term) {
                return searchableText.includes(term);
            }));

    });

    showSearchResults(matches);

}


searchBtn.addEventListener(
    "click",
    searchPage
);


searchInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            searchPage();

        } else if (event.key === "Escape") {

            closeSearchResults();

        }

    }
);

searchInput.addEventListener(
    "input",
    function () {
        if (searchInput.value.trim()) {
            searchPage();
        } else {
            closeSearchResults();
        }
    }
);


document.addEventListener(
    "click",
    function (event) {

        if (
            event.target instanceof Element &&
            !event.target.closest(".search-area")
        ) {

            closeSearchResults();

        }

    }
);


/* =========================================
   MESSAGE CHARACTER COUNTER
========================================= */

const message =
    document.getElementById("message");

const counter =
    document.getElementById("counter");


message.addEventListener("input", function () {

    counter.textContent =
        message.value.length;

});


/* =========================================
   NOTIFICATION
========================================= */

const notification =
    document.getElementById("notification");


function showNotification(text) {

    notification.textContent = text;

    notification.classList.add("show");


    setTimeout(function () {

        notification.classList.remove("show");

    }, 2500);

}


/* =========================================
   RECOGNITION FORM
========================================= */

const recognitionForm =
    document.getElementById("recognitionForm");

const player =
    document.getElementById("player");

const category =
    document.getElementById("category");

const feed =
    document.getElementById("feed");


recognitionForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const selectedPlayer =
            player.value;

        const selectedCategory =
            category.value;

        const selectedMessage =
            message.value.trim();


        if (
            selectedPlayer === "" ||
            selectedCategory === "" ||
            selectedMessage === ""
        ) {

            showNotification(
                "Please complete all the fields."
            );

            return;

        }


        if (selectedMessage.length < 20) {

            showNotification(
                "Your message should be at least 20 characters."
            );

            return;

        }


        /* Get initials */

        const initials =
            selectedPlayer
                .split(" ")
                .map(word => word[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();


        let avatarClass = "blue";


        if (
            selectedCategory ===
            "Most Improved"
        ) {

            avatarClass = "gold";

        }


        if (
            selectedCategory ===
            "Best Teammate"
        ) {

            avatarClass = "purple";

        }


        let categoryClass = "coral";


        if (
            selectedCategory ===
            "Most Improved"
        ) {

            categoryClass = "gold";

        }


        if (
            selectedCategory ===
            "Best Teammate"
        ) {

            categoryClass = "purple-text";

        }


        /* Create new recognition */

        const newRecognition =
            document.createElement("article");


        newRecognition.className =
            "recognition-card";


        newRecognition.dataset.category =
            selectedCategory;


        newRecognition.innerHTML = `

            <div class="avatar ${avatarClass}">
                ${initials}
            </div>

            <div class="recognition-info">

                <div class="recognition-top">

                    <span class="category ${categoryClass}">
                        ${selectedCategory}
                    </span>

                    <small>
                        Just now
                    </small>

                </div>

                <h3>
                    ${selectedPlayer}
                </h3>

                <p>
                    ${escapeHTML(selectedMessage)}
                </p>

                <small>
                    — You
                </small>

            </div>

        `;


        /* Put new card at top */

        feed.prepend(newRecognition);


        /* Reset form */

        recognitionForm.reset();

        counter.textContent = "0";


        showNotification(
            "Recognition successfully added!"
        );

    }
);


/* =========================================
   PROTECT USER MESSAGE
========================================= */

function escapeHTML(text) {

    const element =
        document.createElement("div");

    element.textContent = text;

    return element.innerHTML;

}


/* =========================================
   RECOGNITION FILTER
========================================= */

const filter =
    document.getElementById("filter");


filter.addEventListener(
    "change",
    function () {

        const selected =
            filter.value;


        const cards =
            document.querySelectorAll(
                ".recognition-card"
            );


        cards.forEach(function (card) {

            if (
                selected === "all" ||
                card.dataset.category === selected
            ) {

                card.style.display =
                    "flex";

            } else {

                card.style.display =
                    "none";

            }

        });

    }
);


/* =========================================
   AWARD CARD FILTER
========================================= */

const awardCards =
    document.querySelectorAll(
        ".award-card"
    );


awardCards.forEach(function (card) {

    card.addEventListener(
        "click",
        function () {

            const title =
                card.querySelector("h3")
                    .textContent;


            filter.value =
                title;


            filter.dispatchEvent(
                new Event("change")
            );


            document
                .querySelector(".feed")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );

});


/* =========================================
   TEAM CHAT
========================================= */

const chatLauncher =
    document.getElementById("chatLauncher");

const chatClose =
    document.getElementById("chatClose");

const communityChat =
    document.getElementById("communityChat");

const chatForm =
    document.getElementById("chatForm");

const chatInput =
    document.getElementById("chatInput");

const messages =
    document.getElementById("messages");

let awaitingTrainingConfirmation = false;


function toggleChatPanel() {

    const isHidden =
        communityChat.hasAttribute("hidden");

    if (isHidden) {

        communityChat.removeAttribute("hidden");

        chatLauncher.setAttribute(
            "aria-expanded",
            "true"
        );

    } else {

        communityChat.setAttribute(
            "hidden",
            "hidden"
        );

        chatLauncher.setAttribute(
            "aria-expanded",
            "false"
        );

    }

}


chatLauncher.addEventListener(
    "click",
    toggleChatPanel
);


chatClose.addEventListener(
    "click",
    toggleChatPanel
);


function createMessage(author, text, type) {

    const item =
        document.createElement("div");

    item.className =
        `chat-message ${type}`;

    item.innerHTML = `

        <div class="chat-name">
            ${author}
        </div>

        <p>
            ${escapeHTML(text)}
        </p>

        <small>
            Now
        </small>

    `;

    messages.appendChild(item);

    messages.scrollTop =
        messages.scrollHeight;

}


function getCommunityReply(text) {

    const lower =
        text.toLowerCase().replace(/[’']/g, "'");


    if (
        /\b(hi|hello|hey)\b/.test(lower)
    ) {

        return "Hey! Good to see you. How's your day going?";

    }


    if (
        /\b(football|soccer)\b/.test(lower)
    ) {

        return "Oh, football! Nice 😊 Do you play, or do you mostly enjoy watching? What do you like most about it?";

    }


    if (
        /\b(left out|left behind|excluded|lonely|don't fit in|do not fit in|not included|no one talks to me|nobody talks to me)\b/.test(lower)
    ) {

        return "I'm sorry you're feeling left out. You deserve to feel welcome on the team. If it feels okay, try talking one-on-one with a teammate you trust or tell your coach what you've noticed and ask for help joining in. You could also suggest a simple team activity where everyone gets involved. You don't have to handle it alone.";

    }


    if (
        /\b(burn(?:ed|t)? out|burnout|exhausted|worn out|overtraining|too tired|constantly tired|always tired|can't recover|cannot recover)\b/.test(lower) ||
        (/\b(tired|fatigue|fatigued)\b/.test(lower) && /\b(train|training|practice|workout|week)\b/.test(lower))
    ) {

        return "That sounds exhausting, especially when you're training several times a week. More training isn't always better—recovery is part of getting stronger. Consider taking a rest or lighter day, and tell your coach and a parent or trusted adult how you've been feeling so you can adjust your schedule together. If the exhaustion continues, or you have pain, dizziness, or feel unwell, let an adult know and get advice from a health professional.";

    }


    if (
        /\b(track|tracking|measure|measuring|monitor|record|log|keep track|progress journal)\b/.test(lower) &&
        /\b(progress|improv|goal|training|practice|skill)\b/.test(lower)
    ) {

        return "Pick one or two things you want to improve, then keep a simple weekly log. Record what you practised, how it felt, and one small result you noticed—for example, completed passes in a drill or how consistently you trained. Review it every couple of weeks with your coach, celebrate effort as well as results, and adjust the goal if it stops being realistic.";

    }


    if (
        /\b(goal|goals|aim|target|targets)\b/.test(lower) &&
        /\b(approach|start|work on|reach|achieve|plan|set|how do i|how can i|where do i begin)\b/.test(lower)
    ) {

        return "Start by choosing one goal that matters to you, then make it specific and within your control. Break it into a small action for this week—for example, practise one skill for 15 minutes after two sessions. Write down when you'll do it, check in at the end of the week, and adjust the plan with your coach if it feels too easy or too demanding. What goal are you working toward?";

    }


    if (
        /\b(how long|training|train|practice|workout)\b/.test(lower)
    ) {

        return "A good training routine depends on your age, experience, team schedule, and how well you're recovering, so there isn't one ideal duration for everyone. Focus on quality rather than adding more sessions, and make room for rest, sleep, and school. Your coach can help shape a plan around your goals and schedule.";

    }


    if (
        /\b(goal|goals|aim|target|targets)\b/.test(lower)
    ) {

        return "A useful goal is specific, realistic, and focused on something you can practise. Break it into one small step for this week, decide how you'll notice progress, and check in regularly. Keep it flexible—your plan can change as you learn. If you tell me your goal, we can break it into steps together.";

    }


    if (
        /\b(progress|improving|improvement|getting better)\b/.test(lower)
    ) {

        return "Progress can be easy to miss day to day. Choose one skill to focus on, note what you practise each week, and write down one thing that felt better or one challenge you want to work on next. Ask your coach for feedback every few weeks, and remember that effort and consistency count too.";

    }


    if (
        lower.includes("healthy") ||
        lower.includes("health") ||
        lower.includes("lifestyle")
    ) {

        return "A healthier football life means good sleep, enough hydration, balanced meals, and recovery days. When you feel strong physically and mentally, your training becomes more productive and sustainable.";

    }


    if (
        /\b(support|community|teammate|team)\b/.test(lower)
    ) {

        return "A supportive team starts with small actions: invite someone into a drill or conversation, notice and encourage their effort, and listen without judging. If you're hoping for more support yourself, try telling a teammate or coach what would help you feel included.";

    }


    if (
        /\b(thanks|thank you)\b/.test(lower)
    ) {

        return "Of course 😊 I'm glad you told me.";

    }


    return "Oh, I hear you. Want to tell me a little more? I'm listening.";

}


function getCommunityReplies(text) {

    const lower =
        text.toLowerCase().replace(/[’']/g, "'");

    const isConfirmation =
        /\b(yes really|yeah really|yep really|for real|seriously|yes|yeah|yep)\b/.test(lower);

    if (awaitingTrainingConfirmation && isConfirmation) {

        awaitingTrainingConfirmation = false;

        return [
            {
                author: "Daniel",
                text: "Oh, nice! Thanks for confirming 😄 Do you know what time we're meeting?"
            }
        ];

    }

    awaitingTrainingConfirmation = false;

    if (
        /\b(training|practice|session)\b/.test(lower) &&
        /\btomorrow\b/.test(lower) &&
        /\b(we have|there is|there's|got|have|is)\b/.test(lower)
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
        /\b(dribbl|take.?ons?|ball control)\b/.test(lower) ||
        (
            /\b(improve|better|work on|get better)\b/.test(lower) &&
            /\b(skill|football|soccer|myself|game|technique)\b/.test(lower)
        )
    ) {

        return [
            {
                author: "Jayce",
                text: "Dribbling's all about close touches and changing direction. Try a 10-minute set after warming up: 1) weave slowly through 4–6 cones, using both feet; 2) do inside-outside touches with each foot; 3) practise sole rolls and a quick push into space; then 4) finish with short 1v1s or imagine a defender and change pace after your move. Keep your head up when you can, start slow, and get quicker as it feels comfortable."
            },
            {
                author: "Ethan",
                text: "Water bottles work as cones too. Keep the touches small, then try it at a jog when it feels comfortable. Ten minutes is plenty—no need to turn it into another hard session."
            }
        ];

    }

    if (
        /\b(don't deserve|dont deserve|not deserve|deserve you|deserve the team|deserve you guys|better off without me|don't belong|dont belong|not belong|burden)\b/.test(lower)
    ) {

        return [
            {
                author: "Aisha",
                text: "Hey, I'm really glad you told us. You don't have to earn your place with us—you matter, even when you're having a hard time. Did something happen that made you feel this way?"
            },
            {
                author: "Daniel",
                text: "You don't have to carry that feeling on your own. If it's been sticking around, could you talk with a trusted adult, like a parent, coach, or school counsellor? We can listen too."
            }
        ];

    }

    if (
        /\b(stressed|stress|overwhelmed|anxious|anxiety|worried|nervous|panic(?:king)?)\b/.test(lower)
    ) {

        return [
            {
                author: "Aisha",
                text: "Ah, I'm sorry. That sounds like a lot. It's okay to feel stressed. Want to pause with me for a sec? Take a slow breath in... and let it out gently. You don't have to figure everything out all at once."
            },
            {
                author: "Daniel",
                text: "Yeah, take a minute. Is there one thing that's weighing on you most right now? We can talk it through."
            }
        ];

    }

    if (
        /\b(good enough|not good at|bad player|terrible player|can't do anything right|cannot do anything right|everyone is better|everyone's better|no talent|useless|worthless|i suck)\b/.test(lower)
    ) {

        return [
            {
                author: "Jayce",
                text: "Hey, don't count yourself out. A rough game or a bad day doesn't decide what kind of player you are. You still belong here, and you can keep learning one step at a time. Want to tell us what happened?"
            },
            {
                author: "Ethan",
                text: "Yeah, what Jayce said. You don't have to prove yourself to us. We're glad you're here."
            }
        ];

    }

    if (
        /\b(left out|left behind|excluded|lonely|don't fit in|do not fit in|not included|no one talks to me|nobody talks to me)\b/.test(lower)
    ) {

        return [
            {
                author: "Aisha",
                text: "I'm really sorry. Feeling left out hurts, and you shouldn't have to pretend it doesn't. Do you want to tell us what happened?"
            },
            {
                author: "Jayce",
                text: "I'm glad you said something. If you'd like, we can help you think of someone on the team or a coach you feel okay talking to. You deserve to feel welcome here."
            }
        ];

    }

    if (
        /\b(burn(?:ed|t)? out|burnout|exhausted|worn out|overtraining|too tired|constantly tired|always tired|can't recover|cannot recover)\b/.test(lower) ||
        (/\b(tired|fatigue|fatigued)\b/.test(lower) && /\b(train|training|practice|workout|week)\b/.test(lower))
    ) {

        return [
            {
                author: "Ethan",
                text: "Man, four or five sessions and you're still wiped? That's a lot. You don't have to push through it—taking a break is okay."
            },
            {
                author: "Aisha",
                text: "Could you let your coach and a parent or trusted adult know how tired you've been? They can help you figure out whether to ease up for a bit. If it keeps happening or you feel unwell, please tell an adult."
            }
        ];

    }

    if (
        /\b(thanks|thank you)\b/.test(lower)
    ) {

        return [
            {
                author: "Aisha",
                text: "Anytime. That's what teammates are for 😊"
            }
        ];

    }

    const isGreeting =
        /\b(hi|hello|hey)\b/.test(lower) &&
        !/\b(burn(?:ed|t)? out|burnout|exhausted|goal|goals|progress|left out|excluded|lonely|training|train|practice|workout|support)\b/.test(lower) &&
        (
            /\b(how have you been|how are you|how's it going|how is it going|what's up|whats up)\b/.test(lower) ||
            lower.split(/\s+/).length <= 4
        );

    if (isGreeting) {

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

    const speaker =
        ["Aisha", "Daniel", "Jayce", "Ethan"][
            Math.floor(Math.random() * 4)
        ];

    return [
        {
            author: speaker,
            text: getCommunityReply(text)
        }
    ];

}


chatForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const text =
            chatInput.value.trim();

        if (text === "") {

            return;

        }

        createMessage("You", text, "sent");

        chatInput.value = "";

        const replies =
            getCommunityReplies(text);

        replies.forEach(function (reply, index) {

            setTimeout(function () {

                createMessage(
                    reply.author,
                    reply.text,
                    "received"
                );

            }, 600 + index * 900);

        });

    }
);


/* =========================================
   SCROLL REVEAL EFFECT
========================================= */

const elements =
    document.querySelectorAll(
        ".award-card, .card, .chat-section, .intro-section"
    );


elements.forEach(function (element) {

    element.classList.add("reveal");

});


const observer =
    new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "show"
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


elements.forEach(function (element) {

    observer.observe(element);

});