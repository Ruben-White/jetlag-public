// General
document.addEventListener('DOMContentLoaded', () => {
    showSplashScreen(); // Show splash screen on load

    setTimeout(() => {
        hideSplashScreen(); // Hide splash screen after 2 seconds

        // Tabs
        initialiseTabs();
        selectTab('players');

        // Players
        initialiseTab('players');
        
        // Questions
        initialiseTab('questions');

        // Curses
        initialiseTab('curses');

        // Map
        initialiseTab('map');

        // Timer
        setInterval(updateTimes, 1000); // Update times every second
    }, 1000);
});

function showSplashScreen() {
    const splashScreen = document.createElement('div');
    splashScreen.id = 'splash-screen';
    const splashImage = document.createElement('img');
    splashImage.src = './icons/jetlag.png';
    splashImage.alt = 'Jetlag';
    splashScreen.appendChild(splashImage);

    const splashText = document.createElement('h1');
    splashText.innerHTML = 'Hide<span style="color: red;">+</span>Seek';
    splashScreen.appendChild(splashText);
    document.body.appendChild(splashScreen);
}

function hideSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
        splashScreen.style.transition = 'opacity 1s';
        splashScreen.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(splashScreen);
        }, 1000);
    }
}

function initialiseTab(tabId) {
    if (tabId === 'players') {
        const playersContent = document.getElementById('players-content');
        while (playersContent.firstChild) {
            playersContent.removeChild(playersContent.firstChild);
        }
        initialisePlayers();
        
    } else if (tabId === 'questions') {
        initialiseQuestions();
    } else if (tabId === 'curses') {
        initialiseCurses();
    } else if (tabId === 'map') {
        // Map
    }
}

// Tab functions
function initialiseTabs() {
    // Tabs
    const tabs = document.querySelectorAll('[data-tab-target]');
    const tabHeaders = document.querySelectorAll('[data-tab-header]');
    const tabContents = document.querySelectorAll('[data-tab-content]');

    // Add icons and event listeners to tabs
    tabs.forEach(tab => {
        // Add icon to tab
        const icon = document.createElement('img');
        icon.classList.add('tab-icon');
        icon.src = `./icons/tab-${tab.dataset.tabTarget}.svg`;
        tab.prepend(icon);

        // Add event listener to tab
        tab.addEventListener('click', () => {
            const targetContent = document.querySelector(`#${tab.dataset.tabTarget}-content[data-tab-content]`);
            const targetHeader = document.querySelector(`#${tab.dataset.tabTarget}-header[data-tab-header]`);
            tabs.forEach(tab => {
                tab.classList.remove('active');
                tab.querySelector('.tab-icon').src = `./icons/tab-${tab.dataset.tabTarget}.svg`;
            });
            tabContents.forEach(tabContent => {
                tabContent.classList.remove('active');
                tabContent.style.display = 'none'; // Hide content
            });
            tabHeaders.forEach(tabHeader => {
                tabHeader.classList.remove('active');
                tabHeader.style.display = 'none'; // Hide header
            });
            tab.classList.add('active');
            tab.querySelector('.tab-icon').src = `./icons/tab-${tab.dataset.tabTarget}-selected.svg`;
            targetContent.classList.add('active');
            targetContent.style.display = 'flex'; // Show content
            targetHeader.classList.add('active');
            targetHeader.style.display = 'flex'; // Show header
        });
    });

    // Add headers and icons to tab headers
    tabHeaders.forEach(header => {
        const h1 = document.createElement('h1');
        h1.textContent = header.id.replace('-header', '');
        header.appendChild(h1);        
        
        const icon = document.createElement('img');
        icon.classList.add('tab-icon');
        icon.src = `./icons/tab-${header.id.replace('-header', '')}-selected.svg`;

        const headerContent = document.createElement('div');
        headerContent.classList.add('header-content');
        headerContent.appendChild(icon);
        while (header.firstChild) {
            headerContent.appendChild(header.firstChild);
        }

        const resetButton = document.createElement('button');
        resetButton.classList.add('reset-button');
        const resetIcon = document.createElement('img');
        resetIcon.src = './icons/tab-reset.svg';
        resetIcon.alt = 'reset icon';
        resetButton.appendChild(resetIcon);
        resetButton.addEventListener('click', () => {
            showResetPopup();
        });

        headerContent.appendChild(resetButton);
        header.appendChild(headerContent);
    });
}

function createPopup(headerText, bodyContent, buttons) {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);

    const popup = document.createElement('div');
    popup.classList.add('popup', 'popup-common');

    const popupContent = document.createElement('div');
    popupContent.classList.add('popup-content');

    const popupHeader = document.createElement('h2');
    popupHeader.textContent = headerText;
    popupContent.appendChild(popupHeader);

    const popupText = document.createElement('p');
    popupText.innerHTML = bodyContent;
    popupContent.appendChild(popupText);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    buttons.forEach(button => {
        const btn = document.createElement('button');
        btn.textContent = button.text;
        btn.addEventListener('click', button.onClick);
        buttonContainer.appendChild(btn);
    });

    popupContent.appendChild(buttonContainer);
    popup.appendChild(popupContent);
    document.body.appendChild(popup);

    return { popup, overlay };
}

function showResetPopup() {
    const activeTab = document.querySelector('.active[data-tab-content]');
    const tabName = activeTab ? activeTab.id.replace('-content', '') : 'current';
    const capitalisedTabName = tabName.charAt(0).toUpperCase() + tabName.slice(1);
    const bodyContent = 'Are you sure you want to reset the <strong>' + capitalisedTabName + '</strong> tab?';

    const { popup, overlay } = createPopup('Reset Tab', bodyContent, [
        {
            text: 'Reset',
            onClick: () => {
                showSplashScreen(); // Show splash screen briefly
                setTimeout(() => {
                    const activeTab = document.querySelector('.tab.active');
                    if (activeTab) {
                        const tabId = activeTab.dataset.tabTarget;
                        initialiseTab(tabId);
                    }
                    hideSplashScreen(); // Hide splash screen after resetting
                    document.body.removeChild(popup);
                    document.body.removeChild(overlay);
                }, 500); // Adjust the timeout duration as needed
            }
        },
        {
            text: 'Close',
            onClick: () => {
                document.body.removeChild(popup);
                document.body.removeChild(overlay);
            }
        }
    ]);
}

function showAddTimePopup(playerElement) {
    const playerName = playerElement.querySelector('.player-name').textContent;
    let capitalisedName = playerName.charAt(0).toUpperCase() + playerName.slice(1);
    capitalisedName = capitalisedName + (capitalisedName.endsWith('s') ? "'" : "'s");
    const bodyContent = "Adjust <strong>" + capitalisedName + "</strong> time by adding or subtracting seconds.";

    const { popup, overlay } = createPopup('Add Time', bodyContent, [
        {
            text: 'Apply',
            onClick: () => {
                const timeInput = popup.querySelector('input[type="number"]');
                const seconds = parseInt(timeInput.value);
                if (!isNaN(seconds)) {
                    addTime(playerElement, seconds);
                    document.body.removeChild(popup);
                    document.body.removeChild(overlay);
                }
            }
        },
        {
            text: 'Close',
            onClick: () => {
                document.body.removeChild(popup);
                document.body.removeChild(overlay);
            }
        }
    ]);

    const timeInput = document.createElement('input');
    timeInput.type = 'number';
    timeInput.min = '0';
    timeInput.placeholder = 'Number of seconds';
    popup.querySelector('.popup-content').insertBefore(timeInput, popup.querySelector('.button-container'));
}

function selectTab(tabId) {
    const tab = document.querySelector(`[data-tab-target="${tabId}"]`);
    tab.click();
}

// Players functions
function initialisePlayers() {
    // Initialise hiders
    const hiders = document.createElement('div');
    hiders.id = 'hiders';
    const hidersHeader = document.createElement('h2');
    
    // Add icon to hiders header
    const hidersIcon = document.createElement('img');
    hidersIcon.src = './icons/players-hiders.svg';
    hidersIcon.alt = 'Hiders icon';
    hidersIcon.classList.add('header-icon');
    hidersHeader.appendChild(hidersIcon);
    
    hidersHeader.appendChild(document.createTextNode('Hiders'));
    hiders.appendChild(hidersHeader);
    const hidersList = document.createElement('ul');
    hidersList.id = 'hiders-list'; // Add ID
    hiders.appendChild(hidersList);

    // Initialise seekers
    const seekers = document.createElement('div');
    seekers.id = 'seekers';
    const seekersHeader = document.createElement('h2');
    
    // Add icon to seekers header
    const seekersIcon = document.createElement('img');
    seekersIcon.src = './icons/players-seekers.svg';
    seekersIcon.alt = 'Seekers icon';
    seekersIcon.classList.add('header-icon');
    seekersHeader.appendChild(seekersIcon);
    
    seekersHeader.appendChild(document.createTextNode('Seekers'));
    seekers.appendChild(seekersHeader);
    const seekersList = document.createElement('ul');
    seekersList.id = 'seekers-list'; // Add ID
    seekers.appendChild(seekersList);

    // Append hiders and seekers to players-content tab
    const playersContent = document.getElementById('players-content');
    playersContent.appendChild(hiders);
    playersContent.appendChild(seekers);

    fetch('./assets/players.json')
        .then(response => response.json())
        .then(players => {
            players.forEach(player => {
                const playerElement = document.createElement('li');
                playerElement.classList.add('player');
                playerElement.style.backgroundColor = player.color;
                playerElement.dataset.time = '0';

                const playerLeft = document.createElement('div');
                playerLeft.classList.add('player-left');

                const playerRight = document.createElement('div');
                playerRight.classList.add('player-right');

                const playerIcon = document.createElement('img');
                playerIcon.src = `./icons/${player.icon}`;
                playerIcon.alt = 'player icon';
                playerIcon.classList.add('player-icon');

                const playerName = document.createElement('span');
                playerName.classList.add('player-name');
                playerName.textContent = player.name;

                const playerTime = document.createElement('span');
                playerTime.classList.add('time');
                playerTime.textContent = '0:00:00';

                const addTimeButton = document.createElement('button');
                addTimeButton.classList.add('add-time-button');
                
                const addTimeIcon = document.createElement('img');
                addTimeIcon.src = './icons/players-add-time.svg';
                addTimeIcon.alt = 'add time icon';
                addTimeButton.appendChild(addTimeIcon);
                
                addTimeButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    showAddTimePopup(playerElement);
                });

                playerLeft.appendChild(playerIcon);
                playerLeft.appendChild(playerName);

                playerRight.appendChild(playerTime);
                playerRight.appendChild(addTimeButton);

                playerElement.appendChild(playerLeft);
                playerElement.appendChild(playerRight);

                seekersList.appendChild(playerElement);
            });

            document.querySelectorAll('.player').forEach(player => {
                player.addEventListener('click', () => {
                    if (player.parentElement.parentElement.id === 'hiders') {
                        seekersList.appendChild(player);
                    } else {
                        hidersList.appendChild(player);
                    }
                    sortPlayers();
                });
            });
            sortPlayers();
        });
}

function sortPlayers() {
    const hiders = document.getElementById('hiders').querySelector('ul');
    const seekers = document.getElementById('seekers').querySelector('ul');
    const hidersArray = Array.from(hiders.children);
    const seekersArray = Array.from(seekers.children);

    hidersArray.sort((a, b) => {
        const timeDiff = parseInt(b.dataset.time) - parseInt(a.dataset.time);
        if (timeDiff !== 0) return timeDiff;
        return a.querySelector('.player-name').textContent.localeCompare(b.querySelector('.player-name').textContent);
    });

    seekersArray.sort((a, b) => {
        const timeDiff = parseInt(b.dataset.time) - parseInt(a.dataset.time);
        if (timeDiff !== 0) return timeDiff;
        return a.querySelector('.player-name').textContent.localeCompare(b.querySelector('.player-name').textContent);
    });

    const hidersFragment = document.createDocumentFragment();
    const seekersFragment = document.createDocumentFragment();

    hidersArray.forEach(player => {
        hidersFragment.appendChild(player);
    });

    seekersArray.forEach(player => {
        seekersFragment.appendChild(player);
    });

    hiders.appendChild(hidersFragment);
    seekers.appendChild(seekersFragment);
}

function updateTimes() {
    document.querySelectorAll('#hiders .player').forEach(player => {
        let time = parseInt(player.dataset.time);
        time++;
        player.dataset.time = time;
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        player.querySelector('.time').textContent = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    });
}

function addTime(playerElement, seconds) {
    let time = parseInt(playerElement.dataset.time);
    time = Math.max(0, time + seconds); // Ensure time is always >= 0
    playerElement.dataset.time = time;
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const secondsLeft = time % 60;
    playerElement.querySelector('.time').textContent = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
    sortPlayers();
}

// Questions functions
function initialiseQuestions() {
    const questionsContent = document.getElementById('questions-content');
    while (questionsContent.firstChild) {
        questionsContent.removeChild(questionsContent.firstChild);
    }

    fetch('./assets/questions.json')
        .then(response => response.json())
        .then(categories => {
            categories.forEach(category => {
                const categoryElement = document.createElement('div');
                categoryElement.classList.add('question-category');

                const categoryIcon = document.createElement('img');
                categoryIcon.src = `./icons/${category.icon}`;
                categoryIcon.alt = `${category.name} icon`;

                const categoryHeader = document.createElement('h2');
                categoryHeader.textContent = category.name;

                const categoryCost = document.createElement('span');
                categoryCost.classList.add('question-cost');
                categoryCost.textContent = category.cost;

                categoryElement.appendChild(categoryIcon);
                categoryElement.appendChild(categoryHeader);
                categoryElement.appendChild(categoryCost);
                questionsContent.appendChild(categoryElement);

                const questionsGrid = document.createElement('div');
                questionsGrid.classList.add('questions-grid');

                category.questions.forEach(question => {
                    const questionBlock = document.createElement('div');
                    questionBlock.classList.add('question-block');
                    questionBlock.style.backgroundColor = category.color;
                    questionBlock.dataset.asked = 'false'; // Add asked attribute
                    questionBlock.dataset.doubleCost = category.double_cost; // Add double cost
                    questionBlock.dataset.cost = category.cost; // Add initial cost

                    const questionIcon = document.createElement('img');
                    questionIcon.src = `./icons/${question.icon}`;
                    questionIcon.alt = `${question.name} icon`;

                    questionBlock.appendChild(questionIcon);
                    questionsGrid.appendChild(questionBlock);

                    questionBlock.addEventListener('click', () => {
                        const currentCost = questionBlock.dataset.asked === 'false' 
                            ? questionBlock.dataset.cost 
                            : questionBlock.dataset.doubleCost;
                        showQuestionPopup(question.name, question.description, questionBlock, currentCost);
                    });
                });

                questionsContent.appendChild(questionsGrid);
            });
        });
}

function showQuestionPopup(name, description, questionBlock, cost) {
    const bodyContent = `<p>${description}</p><p><strong>Asking Cost: ${cost}.</strong></p>`;
    const { popup, overlay } = createPopup(name, bodyContent, [
        {
            text: 'Ask',
            onClick: () => {
                // Copy question name, description, and cost to clipboard
                const clipboardContent = `*${name}*\n${description}\n\n Asking Cost: ${cost}`;

                navigator.clipboard.writeText(clipboardContent).then(() => {
                    if (questionBlock.dataset.asked === 'false') {
                        questionBlock.dataset.asked = 'true'; // Mark question as asked
                        questionBlock.style.opacity = '0.5'; // Dim the question block
                        questionBlock.dataset.cost = cost; // Store the current cost
                    } else {
                        const doubleCost = questionBlock.dataset.doubleCost; // Use double cost
                        questionBlock.dataset.cost = doubleCost; // Update the cost
                    }
                    document.body.removeChild(popup);
                    document.body.removeChild(overlay);
                });
            }
        },
        {
            text: 'Close',
            onClick: () => {
                document.body.removeChild(popup);
                document.body.removeChild(overlay);
            }
        }
    ]);
}

// Curses functions
function initialiseCurses() {
    const cursesContent = document.getElementById('curses-content');
    while (cursesContent.firstChild) {
        cursesContent.removeChild(cursesContent.firstChild);
    }

    const handSection = document.createElement('div');
    handSection.classList.add('hand-section');

    const handHeader = document.createElement('h2');
    
    // Add icon to hand header
    const handIcon = document.createElement('img');
    handIcon.src = './icons/curse-castable-curses.svg';
    handIcon.alt = 'Curses icon';
    handIcon.classList.add('header-icon');
    handHeader.appendChild(handIcon);
    
    handHeader.appendChild(document.createTextNode('Castable Curses'));

    const drawButton = document.createElement('button');
    drawButton.classList.add('draw-curses-button');
    const drawIcon = document.createElement('img');
    drawIcon.src = './icons/curse-draw-curses.svg';
    drawIcon.alt = 'draw curses icon';
    drawButton.appendChild(drawIcon);
    drawButton.addEventListener('click', showDrawCursesPopup);

    handSection.appendChild(handHeader);
    handSection.appendChild(drawButton);

    const cursesGrid = document.createElement('div');
    cursesGrid.classList.add('curses-grid');

    cursesContent.appendChild(handSection);
    cursesContent.appendChild(cursesGrid);
}

function showDrawCursesPopup() {
    const cursesGrid = document.querySelector('.curses-grid');
    const MAX_CURSES = 6;
    if (cursesGrid.children.length > MAX_CURSES) {
        const bodyContent = `You have more than ${MAX_CURSES} curses. Please discard down to ${MAX_CURSES} cards before drawing more.`;
        const { popup, overlay } = createPopup('Too Many Curses', bodyContent, [
            {
                text: 'Close',
                onClick: () => {
                    document.body.removeChild(popup);
                    document.body.removeChild(overlay);
                }
            }
        ]);
        return;
    }

    const bodyContent = 'Enter the number of curses to draw:';
    const { popup, overlay } = createPopup('Draw Curses', bodyContent, [
        {
            text: 'Draw',
            onClick: () => {
                const cursesInput = popup.querySelector('input[type="number"]');
                const count = parseInt(cursesInput.value);
                if (!isNaN(count) && count > 0) {
                    drawCurses(count, popup, overlay);
                }
            }
        },
        {
            text: 'Close',
            onClick: () => {
                document.body.removeChild(popup);
                document.body.removeChild(overlay);
            }
        }
    ]);

    const cursesInput = document.createElement('input');
    cursesInput.type = 'number';
    cursesInput.min = '1';
    cursesInput.placeholder = 'Number of curses';
    popup.querySelector('.popup-content').insertBefore(cursesInput, popup.querySelector('.button-container'));
}

function drawCurses(count, popup, overlay) {
    const cursesGrid = document.querySelector('.curses-grid');
    fetch('./assets/cursers.json')
        .then(response => response.json())
        .then(categories => {
            for (let i = 0; i < count; i++) {
                const randomCategoryIndex = Math.floor(Math.random() * categories.length);
                const category = categories[randomCategoryIndex];
                const randomCardIndex = Math.floor(Math.random() * category.cards.length);
                const curse = category.cards.splice(randomCardIndex, 1)[0];

                const curseElement = document.createElement('div');
                curseElement.classList.add('curse');
                curseElement.dataset.name = curse.name;
                curseElement.dataset.description = curse.description;
                curseElement.dataset.cost = curse.cost;
                curseElement.style.backgroundColor = category.color; // Apply category color

                const curseName = document.createElement('span');
                curseName.classList.add('curse-name');
                curseName.textContent = curse.name;

                curseElement.appendChild(curseName);
                cursesGrid.appendChild(curseElement);

                curseElement.addEventListener('click', () => {
                    showCursePopup(curseElement);
                });
            }
            document.body.removeChild(popup);
            document.body.removeChild(overlay);
        });
}

function showCursePopup(curseElement) {
    const name = curseElement.dataset.name;
    const description = curseElement.dataset.description;
    const cost = curseElement.dataset.cost;
    const costContent = cost ? `<p><strong>Casting Cost: ${cost}.</strong></p>` : '';
    const clipboardCost = cost ? `\n\n Casting Cost: ${cost}.` : '';
    const bodyContent = `<p>${description}</p>${costContent}`;
    const { popup, overlay } = createPopup(name, bodyContent, [
        {
            text: 'Cast',
            onClick: () => {
                const clipboardContent = `*${name}*\n${description}${clipboardCost}`;
                navigator.clipboard.writeText(clipboardContent).then(() => {
                    curseElement.remove();
                    document.body.removeChild(popup);
                    document.body.removeChild(overlay);
                });
            }
        },
        {
            text: 'Close',
            onClick: () => {
                document.body.removeChild(popup);
                document.body.removeChild(overlay);
            }
        }
    ]);
}