// Dynamic greeting setter based on time of day
function setDynamicGreeting() {
    const hours = new Date().getHours();
    const heading = document.getElementById('welcomeHeading');
    if (!heading) return;

    let greetingMessage;
    if (hours < 12) {
        greetingMessage = 'Good Morning, Uniconnect!';
    } else if (hours < 18) {
        greetingMessage = 'Good Afternoon, Uniconnect!';
    } else {
        greetingMessage = 'Good Evening, Uniconnect!';
    }

    heading.textContent = greetingMessage;
}

// Initialize interactions when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Set the initial greeting
    setDynamicGreeting();

    // Wire up the button interaction
    const changeMessageBtn = document.getElementById('changeMessageBtn');
    const heading = document.getElementById('welcomeHeading');

    if (changeMessageBtn && heading) {
        changeMessageBtn.addEventListener('click', () => {
            heading.textContent = 'Uniconnect is growing every day!';
            console.log('Welcome message changed to: Uniconnect is growing every day!');
        });
    } else {
        if (!changeMessageBtn) {
            console.error("Button with ID 'changeMessageBtn' not found.");
        }
        if (!heading) {
            console.error("Heading with ID 'welcomeHeading' not found.");
        }
    }
});
