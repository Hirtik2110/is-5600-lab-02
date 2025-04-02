// Wait for DOM and assets to load
document.addEventListener('DOMContentLoaded', () => {
    // Parse JSON data from included scripts
    const stocksData = JSON.parse(stockContent);
    const userData = JSON.parse(userContent);

    // Initial render of user list
    generateUserList(userData, stocksData);

    // Event listeners for save and delete buttons
    const saveButton = document.querySelector('#btnSave');
    const deleteButton = document.querySelector('#btnDelete');

    saveButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent form submission
        const id = document.querySelector('#userID').value;
        const userIndex = userData.findIndex(user => user.id == id);
        if (userIndex !== -1) {
            userData[userIndex].user.firstname = document.querySelector('#firstname').value;
            userData[userIndex].user.lastname = document.querySelector('#lastname').value;
            userData[userIndex].user.address = document.querySelector('#address').value;
            userData[userIndex].user.city = document.querySelector('#city').value;
            userData[userIndex].user.email = document.querySelector('#email').value;
            generateUserList(userData, stocksData); // Re-render user list
        }
    });

    deleteButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent form submission
        const userId = document.querySelector('#userID').value;
        const userIndex = userData.findIndex(user => user.id == userId);
        if (userIndex !== -1) {
            userData.splice(userIndex, 1); // Remove user
            generateUserList(userData, stocksData); // Re-render user list
            document.querySelector('.portfolio-list').innerHTML = `
                <h3>Symbol</h3>
                <h3># Shares</h3>
                <h3>Actions</h3>
            `; // Reset portfolio to headers
            clearStockDetails(); // Clear stock info
            document.querySelector('.userEntry').reset(); // Reset form
        }
    });
});

/**
 * Renders the user list
 * @param {Array} users - Array of user objects
 * @param {Array} stocks - Array of stock objects
 */
function generateUserList(users, stocks) {
    const userList = document.querySelector('.user-list');
    userList.innerHTML = ''; // Clear previous list
    users.forEach(({ user, id }) => {
        const li = document.createElement('li');
        li.textContent = `${user.lastname}, ${user.firstname}`;
        li.dataset.userId = id; // Store ID in data attribute
        userList.appendChild(li);
    });

    // Remove any existing listener to avoid duplicates
    userList.removeEventListener('click', handleUserListClick);
    // Add event delegation for user clicks
    userList.addEventListener('click', (e) => handleUserListClick(e, users, stocks));
}

/**
 * Handles user selection
 * @param {Event} event - Click event
 * @param {Array} users - Array of user objects
 * @param {Array} stocks - Array of stock objects
 */
function handleUserListClick(event, users, stocks) {
    if (event.target.tagName === 'LI') {
        const userId = event.target.dataset.userId;
        const user = users.find(u => u.id == userId);
        if (user) {
            populateForm(user);
            renderPortfolio(user, stocks);
        }
    }
}

/**
 * Populates the form with user data
 * @param {Object} user - Selected user object
 */
function populateForm(user) {
    const { user: userInfo, id } = user;
    document.querySelector('#userID').value = id;
    document.querySelector('#firstname').value = userInfo.firstname;
    document.querySelector('#lastname').value = userInfo.lastname;
    document.querySelector('#address').value = userInfo.address;
    document.querySelector('#city').value = userInfo.city;
    document.querySelector('#email').value = userInfo.email;
}

/**
 * Renders the user's portfolio
 * @param {Object} user - Selected user object
 * @param {Array} stocks - Array of stock objects
 */
function renderPortfolio(user, stocks) {
    const portfolioList = document.querySelector('.portfolio-list');
    portfolioList.innerHTML = `
        <h3>Symbol</h3>
        <h3># Shares</h3>
        <h3>Actions</h3>
        <div class="portfolio-items"></div>
    `; // Reset to headers and add container
    const itemsContainer = portfolioList.querySelector('.portfolio-items');

    user.portfolio.forEach(({ symbol, owned }) => {
        const symbolSpan = document.createElement('span');
        const sharesSpan = document.createElement('span');
        const actionSpan = document.createElement('span');
        const viewButton = document.createElement('button');

        symbolSpan.textContent = symbol;
        sharesSpan.textContent = owned;
        viewButton.textContent = 'View';
        viewButton.dataset.symbol = symbol;

        actionSpan.appendChild(viewButton);
        itemsContainer.appendChild(symbolSpan);
        itemsContainer.appendChild(sharesSpan);
        itemsContainer.appendChild(actionSpan);
    });

    // Remove any existing listener to avoid duplicates
    portfolioList.removeEventListener('click', handlePortfolioClick);
    // Add event delegation for stock clicks
    portfolioList.addEventListener('click', (e) => handlePortfolioClick(e, stocks));
}

/**
 * Handles portfolio stock selection
 * @param {Event} event - Click event
 * @param {Array} stocks - Array of stock objects
 */
function handlePortfolioClick(event, stocks) {
    if (event.target.tagName === 'BUTTON') {
        const symbol = event.target.dataset.symbol;
        viewStock(symbol, stocks);
    }
}

/**
 * Displays stock details
 * @param {string} symbol - Stock symbol
 * @param {Array} stocks - Array of stock objects
 */
function viewStock(symbol, stocks) {
    const stock = stocks.find(s => s.symbol === symbol);
    if (stock) {
        document.querySelector('#stockName').textContent = stock.name;
        document.querySelector('#stockSector').textContent = stock.sector;
        document.querySelector('#stockIndustry').textContent = stock.subIndustry;
        document.querySelector('#stockAddress').textContent = stock.address;
        document.querySelector('#logo').src = `logos/${symbol}.svg`;
    }
}

/**
 * Clears stock detail
 */
function clearStockDetails() {
    document.querySelector('#stockName').textContent = '';
    document.querySelector('#stockSector').textContent = '';
    document.querySelector('#stockIndustry').textContent = '';
    document.querySelector('#stockAddress').textContent = '';
    document.querySelector('#logo').src = '';
}