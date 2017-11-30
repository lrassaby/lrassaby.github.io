document.addEventListener("DOMContentLoaded", function () {
    // to avoid bug with cached pages in certain browsers redoing animations
    document.body.classList.add("animate");
    document.body.classList.remove("d-none");
    setTimeout(function () {
        document.body.classList.remove("animate");
    }, 3000);
}, !1);