const commands = [
  "> sudo ./portfolio\n",
  "Initializing portfolio...\n",
  "Done.\n",
  "Welcome to Samrin's Portfolio!\n"
];

const terminal = document.getElementById('mac-terminal');
const terminalText = document.getElementById('terminal-text');
const portfolio = document.getElementById('portfolio-content');
const terminalLogo = document.getElementById('terminal-logo');

const validCommands = ['home','projects','skills','about','contact'];

// Terminal Intro Typing 
let i = 0;
let j = 0;

function typeCommand() {
  if (i < commands.length) {
    if (j < commands[i].length) {
      terminalText.innerHTML += commands[i][j];
      j++;
      setTimeout(typeCommand, 50);
    } else {
      terminalText.innerHTML += "\n";
      i++;
      j = 0;
      setTimeout(typeCommand, 300);
    }
  } else {
    // After intro, hide terminal and show portfolio
    setTimeout(() => {
      terminal.style.opacity = "0";
      setTimeout(() => {
        terminal.style.display = "none";
        portfolio.style.display = "block";
        requestAnimationFrame(() => {
          portfolio.style.opacity = "1";
        });
      }, 1000);
    }, 800);
  }
}

typeCommand();

//  Open terminal on logo click 
terminalLogo.addEventListener('click', openTerminal);

function openTerminal() {
    // Clear terminal and show fresh input
    terminalText.innerHTML = ""; 
    terminal.style.display = "flex";
    terminal.style.opacity = "1";
    portfolio.style.display = "none";

    // Start first input line
    promptCommand();
}

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

            // Stop blinking
            input.contentEditable = false;
            input.classList.remove('active');
            input.removeEventListener('keydown', handler);

            if (validCommands.includes(command)) {
                terminalText.innerHTML += `\nNavigating to ${command}...\n`;
                closeTerminal();

                // Scroll to section after terminal closes
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

// Close terminal 
function closeTerminal() {
    terminal.style.opacity = "0";
    setTimeout(() => {
        terminal.style.display = "none";
        portfolio.style.display = "block";
        requestAnimationFrame(() => {
            portfolio.style.opacity = "1";
        });
    }, 300);
}

// Click outside to close 
document.addEventListener('click', (e) => {
  if (terminal.style.display === 'flex' && !terminal.contains(e.target) && e.target !== terminalLogo) {
    closeTerminal();
  }
});
