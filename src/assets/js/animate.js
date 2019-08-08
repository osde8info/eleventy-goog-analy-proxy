function ready(e) {
    (document.attachEvent ? "complete" === document.readyState : "loading" !== document.readyState) ? e(): document.addEventListener("DOMContentLoaded", e)
}

window.onload = function () {
    document.body.classList.add("loaded")
}

var navMainA = document.querySelectorAll("a");
document.addEventListener("click", function(e) {
    if ((e.target.matches("a") || e.target.parentNode.matches("a")) && "_blank" !== e.target.getAttribute("target")) {
        e.preventDefault();
        var t = null !== e.target.getAttribute("href") ? e.target.getAttribute("href") : e.target.parentNode.getAttribute("href");
        document.body.classList.remove("loaded"), setTimeout(function() {
            window.location = t
        }, 500)
    }
}, !1);