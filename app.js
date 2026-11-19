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

// Activity 7: Live Booking Summary

// Select form elements using DOM selectors
const matchSelect = document.getElementById("match");
const standSelect = document.getElementById("stand");
const ticketInput = document.getElementById("ticket");

// Ticket prices
const standPrices = {
    "General Stand": 500,
    "Premium Stand": 1000,
    "VIP Stand": 2000
};

// Update Booking Summary
function updateSummary() {

    const match = matchSelect.value;
    const stand = standSelect.value;
    const quantity = Number(ticketInput.value);

    const price = standPrices[stand] || 0;
    const total = price * quantity;

    // Update summary details
    document.getElementById("summaryMatch").textContent =
        match || "Not selected";

    document.getElementById("summaryStand").textContent =
        stand || "Not selected";

    document.getElementById("summaryQuantity").textContent =
        quantity || 0;

    document.getElementById("summaryPrice").textContent =
        price;

    document.getElementById("totalPrice").textContent =
        total;

    // Show notification
    if (match && stand && quantity >= 1 && quantity <= 10) {
        showToast("Booking Summary Updated!");
    }
}

// Add change event listeners
matchSelect.addEventListener("change", updateSummary);

standSelect.addEventListener("change", updateSummary);

ticketInput.addEventListener("input", updateSummary);

// Display initial summary
updateSummary();
