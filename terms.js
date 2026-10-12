/* =====================================================
   TERMS PAGE JAVASCRIPT
===================================================== */


/* =====================================================
   ACTIVE NAVIGATION
===================================================== */

const navigationLinks =
    document.querySelectorAll(
        ".document-navigation a"
    );


const sections =
    document.querySelectorAll(
        ".document-section"
    );


window.addEventListener("scroll", function () {

    let currentSection = "";


    sections.forEach(function (section) {

        const sectionTop =
            section.offsetTop - 180;


        if (window.scrollY >= sectionTop) {

            currentSection =
                section.getAttribute("id");

        }

    });


    navigationLinks.forEach(function (link) {

        link.classList.remove("active");


        if (
            link.getAttribute("href") ===
            "#" + currentSection
        ) {

            link.classList.add("active");

        }

    });

});