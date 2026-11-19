// Reusable Toast Notification Function
function showToast(message) {
    let toast = document.getElementById("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;

    toast.style.position = "fixed";
    toast.style.bottom = "25px";
    toast.style.right = "25px";
    toast.style.background = "#101d3a";
    toast.style.color = "#ffffff";
    toast.style.padding = "15px 25px";
    toast.style.borderRadius = "8px";
    toast.style.borderLeft = "5px solid #f5b51b";
    toast.style.zIndex = "9999";
    toast.style.display = "block";

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(function () {
        toast.style.display = "none";
    }, 3000);
}


// Smooth Scrolling to Booking Section
document.addEventListener("click", function(event) {

    const link = event.target.closest('a[href="#booking"]');

    if (link) {
        event.preventDefault();

        document.getElementById("booking").scrollIntoView({
            behavior: "smooth"
        });

        showToast("Welcome to IPL Ticket Booking!");
    }

});


// Show Toast When Booking Page Opens
window.addEventListener("load", function () {

    if (window.location.hash === "#bookingForm") {
        showToast("Welcome to IPL Ticket Booking!");
    }

});
