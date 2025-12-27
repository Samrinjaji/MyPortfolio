/* Terminal Intro Typing Effect */

const terminal = document.getElementById('mac-terminal');
const terminalText = document.getElementById('terminal-text');
const portfolio = document.getElementById('portfolio-content');
const terminalLogo = document.getElementById('terminal-logo');

const validCommands = ['home','projects','skills','about','contact'];

let introFinished = false;
let i = 0;
let j = 0;

const commands = [
  "> sudo ./portfolio\n",
  "Initializing portfolio...\n",
  "Done.\n",
  "Welcome to Samrin's Portfolio!\n"
];

function typeCommand() {
  if (i < commands.length) {
    if (j < commands[i].length) {
      terminalText.innerHTML += commands[i][j];
      j++;
      setTimeout(typeCommand, 40);
    } else {
      terminalText.innerHTML += "\n";
      i++;
      j = 0;
      setTimeout(typeCommand, 200);
    }
  } else {
    introFinished = true; // mark intro finished
    setTimeout(() => {
      terminal.style.transition = "opacity 0.6s ease";
      terminal.style.opacity = "0";

      setTimeout(() => {
      terminal.style.display = "none";

      // Show portfolio content
      portfolio.style.display = "block";
      portfolio.offsetHeight; // force reflow
      portfolio.classList.add("show");

      // Show navbar
      const navbar = document.querySelector('.navbar');
      navbar.classList.add("show");
      }, 600);

    }, 700);
  }
}

typeCommand();

// Terminal interaction
function openTerminal() {
  // Disable page scrolling
  document.body.classList.add('terminal-open');

  terminalText.innerHTML = "";
  terminal.style.display = "flex";
  terminal.style.opacity = "1";

  promptCommand();
}

// Open terminal via logo
terminalLogo.addEventListener('click', () => {
  openTerminal(); // no hiding of portfolio
});

function closeTerminal() {
  // Re-enable page scrolling
  document.body.classList.remove('terminal-open');

  terminal.style.opacity = "0";
  setTimeout(() => {
    terminal.style.display = "none";
    portfolio.classList.add("show");
  }, 300);
}

// Listen globally for Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && terminal.style.display === 'flex') {
    closeTerminal();
  }
});

// Click outside to close 
document.addEventListener('click', (e) => {
  if (terminal.style.display === 'flex' && !terminal.contains(e.target) && e.target !== terminalLogo) {
    closeTerminal();
  }
});

//  Keyboard shortcut
document.addEventListener('keydown', (e) => {
  if (!introFinished) return; 

  if (e.ctrlKey && e.key === '`') {
    e.preventDefault();
    openTerminal(false); 
  }
});

//  Prompt for user input 
function promptCommand() {
    // Stop any previous blinking cursor
    const prevInput = document.querySelector('.terminal-input.active');
    if (prevInput) prevInput.classList.remove('active');

    // Create new line container
    const line = document.createElement('div');

    // Add single prompt symbol
    const prompt = document.createElement('span');
    prompt.textContent = '> ';
    line.appendChild(prompt);

    // Add editable span for user input
    const input = document.createElement('span');
    input.classList.add('terminal-input', 'active'); // blinking underscore
    input.contentEditable = true;
    input.spellcheck = false;
    line.appendChild(input);

    // Append line to terminal and focus
    terminalText.appendChild(line);
    input.focus();

    // Handle Enter key
    input.addEventListener('keydown', function handler(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const command = input.innerText.trim().toLowerCase();

        if(command === "") {
            // If empty, do nothing and keep blinking cursor
            return;
        }

        // Stop blinking
        input.contentEditable = false;
        input.classList.remove('active');
        input.removeEventListener('keydown', handler);

        if (validCommands.includes(command)) {
            terminalText.innerHTML += `\nNavigating to ${command}...\n`;
            closeTerminal();

            setTimeout(() => {
                const section = document.getElementById(command);
                if (section) section.scrollIntoView({ behavior: 'smooth' });
            }, 350);
        } else {
            terminalText.innerHTML += `\nCommand not found: ${command}\n`;
            promptCommand(); // new line with blinking cursor
        }
    }
});

}
const navLinks = document.querySelectorAll('.nav-links a');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    // Remove active from all links
    navLinks.forEach(l => l.classList.remove('active'));

    // Add active to clicked link
    link.classList.add('active');
  });
});


const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
  let scrollPos = window.scrollY + window.innerHeight / 2;

  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollPos >= top && scrollPos < bottom) {
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
});
