const typewriter = document.querySelector('.typewriter');
const cursor = document.querySelector('.cursor');
const navLinksItems = document.querySelectorAll('.nav-links a'); // links for typing

const menuBtn = document.querySelector('.mobile-menu');
const navLinksMenu = document.querySelector('.nav-links'); // full ul for toggle

const typingSpeed = 120;
const delayBeforeTyping = 500;
let typingInterval = null;

// Highlight command: paths/files/hosts in cyan, strings yellow, flags purple
function highlightCommand(text) {
    return text
        .replace(/"([^"]*)"/g, `<span class="cmd-string">"$1"</span>`)   // strings
        .replace(/\B(-{1,2}\w+)/g, `<span class="cmd-flag">$1</span>`) // flags
        .replace(/(\.\/[^\s]+|projects|skills\.txt|samrin\.dev)/g, `<span class="cmd-path">$1</span>`); // paths
}

// Type a single command and return a Promise
function typeSingleCommand(command) {
    return new Promise(resolve => {
        let i = 0;
        typewriter.innerHTML = '';

        if (typingInterval) clearInterval(typingInterval);

        typingInterval = setInterval(() => {
            const partial = command.slice(0, i + 1);
            typewriter.innerHTML = highlightCommand(partial);
            i++;
            if (i === command.length) {
                clearInterval(typingInterval);
                resolve();
            }
        }, typingSpeed);
    });
}



// Type multiple commands in sequence
async function typeCommands(commands, repeat = false) {
    for (let cmd of commands) {
        await new Promise(r => setTimeout(r, delayBeforeTyping));
        await typeSingleCommand(cmd);
        await new Promise(r => setTimeout(r, 1000)); // pause before next
    }

    if (repeat) {
        typeCommands(commands, true); // repeat only if repeat=true
    }
}

// Default Home commands
const homeCommands = ['sudo ./portfolio', 'echo "Welcome to my portfolio!"'];
typeCommands(homeCommands, true); // repeat only for Home

// Navbar click behavior
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinksItems.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        const command = link.dataset.command;

        // Stop any current typing
        if (typingInterval) clearInterval(typingInterval);

        if (command === 'sudo ./portfolio') {
            // Home: repeat both commands
            typeCommands(homeCommands, true);
        } else {
            // Other navs: type once
            typeCommands([command], false);
        }
    });
});

// Hamburger toggle
menuBtn.addEventListener('click', () => {
    navLinksMenu.classList.toggle('show');
});

// Close menu when a link is clicked (mobile)
navLinksMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinksMenu.classList.contains('show')) {
            navLinksMenu.classList.remove('show');
        }
    });
});

// Sticky navbar scroll shadow
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
});

