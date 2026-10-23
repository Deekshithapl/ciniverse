const loginForm = document.getElementById("loginForm");

const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const loginMessage = document.getElementById("loginMessage");

// Display the dashboard
function showDashboard() {
loginSection.hidden = true;
dashboardSection.hidden = false;
}

// Display the login page
function showLogin() {
dashboardSection.hidden = true;
loginSection.hidden = false;
}

async function loadPopularMovies(searchTerm = "friends") {
    const movieGrid = document.getElementById("movieGrid");
    const statusMessage = document.getElementById("statusMessage");
    const movieTableBody = document.getElementById("movieTableBody");
    const recordCount = document.getElementById("recordCount");

    movieGrid.innerHTML = "";
    movieTableBody.innerHTML = "";
    statusMessage.textContent = "Loading shows...";

    try {
            const response = await fetch(
    `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(searchTerm)}`
);

        if (!response.ok) {
            throw new Error("Unable to fetch shows.");
        }

        const results = await response.json();

        if (results.length === 0) {
            statusMessage.textContent = "No shows found. Try another search.";
            recordCount.textContent = "0";
            return;
        }

        results.forEach((item) => {
            const show = item.show;

            const card = document.createElement("article");
            card.className = "movie-card";

            const image = show.image?.medium
                ? `<img src="${show.image.medium}" alt="${show.name}" class="movie-poster">`
                : "";

            const rating = show.rating?.average ?? "Not rated";

            card.innerHTML = `
                ${image}
                <div class="movie-card-content">
                    <h3>${show.name}</h3>
                    <p>⭐ Rating: ${rating}</p>
                    <p>📺 Language: ${show.language ?? "Unknown"}</p>
                    <p>🎭 Genre: ${show.genres?.join(", ") || "Not listed"}</p>
                    <button class="details-button" type="button">
                        Show Details
                    </button>
                </div>
            `;

// Show more information about a show
card.querySelector(".details-button").addEventListener("click", () => {
    alert(
        `Title: ${show.name}\n` +
        `Status: ${show.status ?? "Unknown"}\n` +
        `Premiered: ${show.premiered ?? "Unknown"}\n` +
        `Rating: ${rating}`
    );
});

// Create a Favourite button
const favouriteButton = document.createElement("button");
favouriteButton.type = "button";
favouriteButton.className = "favourite-button";

let favourites = JSON.parse(
    localStorage.getItem("cineverseFavourites") || "[]"
);

function updateFavouriteButton() {
    const isFavourite = favourites.some(
        favourite => favourite.id === show.id
    );

    favouriteButton.textContent = isFavourite
        ? "❤️ Favourited"
        : "🤍 Add to Favourites";
}

updateFavouriteButton();

favouriteButton.addEventListener("click", function () {
    const index = favourites.findIndex(
        favourite => favourite.id === show.id
    );

    if (index === -1) {
        favourites.push({
            id: show.id,
            name: show.name,
            image: show.image?.medium || "",
            rating: show.rating?.average ?? "Not rated",
            language: show.language ?? "Unknown",
            genres: show.genres ?? [],
            status: show.status ?? "Unknown",
            premiered: show.premiered ?? "Unknown"
        });
    } else {
        favourites.splice(index, 1);
    }

    localStorage.setItem(
        "cineverseFavourites",
        JSON.stringify(favourites)
    );

    updateFavouriteButton();
});

card.querySelector(".movie-card-content").appendChild(favouriteButton);

            movieGrid.appendChild(card);

            const row = document.createElement("tr");
            const titleCell = document.createElement("td");
            const ratingCell = document.createElement("td");
            const languageCell = document.createElement("td");

            titleCell.textContent = show.name;
            ratingCell.textContent = String(rating);
            languageCell.textContent = show.language ?? "Unknown";

            row.append(titleCell, ratingCell, languageCell);
            movieTableBody.appendChild(row);
        });

        recordCount.textContent = String(results.length);
        statusMessage.textContent = "Shows loaded successfully!";
    } catch (error) {
        console.error("TVmaze API error:", error);
        statusMessage.textContent =
            "Unable to load shows. Please try again later.";
    }
}



// Login form validation
loginForm.addEventListener("submit", function (event) {


// Prevent the page from refreshing
event.preventDefault();

// Clear previous messages
emailError.textContent = "";
passwordError.textContent = "";
loginMessage.textContent = "";

const email = emailInput.value.trim();
const password = passwordInput.value;

let isValid = true;

// Validate email
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailPattern.test(email)) {
    emailError.textContent = "Please enter a valid email address.";
    isValid = false;
}

// Validate password
if (password.length < 6) {
    passwordError.textContent =
        "Password must contain at least 6 characters.";

    isValid = false;
}

// Stop if validation fails
if (!isValid) {
    return;
}

// Demonstration login only
try {
    localStorage.setItem("cineverseLoggedIn", "true");
    localStorage.setItem("cineverseEmail", email);

    loginMessage.textContent = "Login successful! Welcome to CineVerse.";

    showDashboard();

    // Load the movie dashboard
    loadPopularMovies();

} catch (error) {
    loginMessage.textContent =
        "Browser storage is unavailable. Please check your settings.";
}

});

// Logout button
document.getElementById("logoutBtn").addEventListener("click", function () {

localStorage.removeItem("cineverseLoggedIn");
localStorage.removeItem("cineverseEmail");

showLogin();

loginForm.reset();

emailError.textContent = "";
passwordError.textContent = "";
loginMessage.textContent = "";

});

// Restore the demonstration login after a refresh
try {

if (localStorage.getItem("cineverseLoggedIn") === "true") {
    showDashboard();
    loadPopularMovies();
} else {
    showLogin();
}

} catch (error) {
showLogin();
}

// Search for shows when the search form is submitted
document.getElementById("searchForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const searchTerm = document.getElementById("movieSearch").value.trim();

    if (searchTerm) {
        loadPopularMovies(searchTerm);
    } else {
        document.getElementById("statusMessage").textContent =
            "Please enter a show name to search.";
    }
});

// Popular Movies button
document.getElementById("popularBtn").addEventListener("click", function () {
    loadPopularMovies("breaking bad");
});

// Surprise Me button
document.getElementById("surpriseBtn").addEventListener("click", function () {
    const suggestions = [
        "friends",
        "stranger things",
        "Wednesday",
        "Sherlock",
        "The Office",
        "Dark",
        "The Witcher",
        "Avatar"
    ];

    const randomIndex = Math.floor(Math.random() * suggestions.length);
    const randomShow = suggestions[randomIndex];

    document.getElementById("movieSearch").value = randomShow;
    loadPopularMovies(randomShow);
});

// Display saved favourites when Watchlist is clicked
document.getElementById("watchlistBtn").addEventListener("click", function () {
    const movieGrid = document.getElementById("movieGrid");
    const movieTableBody = document.getElementById("movieTableBody");
    const statusMessage = document.getElementById("statusMessage");
    const recordCount = document.getElementById("recordCount");

    movieGrid.innerHTML = "";
    movieTableBody.innerHTML = "";

    const favourites = JSON.parse(
        localStorage.getItem("cineverseFavourites") || "[]"
    );

    if (favourites.length === 0) {
        statusMessage.textContent =
            "Your watchlist is empty. Add some favourites first!";
        recordCount.textContent = "0";
        return;
    }

    favourites.forEach(function (show) {
        const card = document.createElement("article");
        card.className = "movie-card";

        const image = show.image
            ? `<img src="${show.image}" alt="" class="movie-poster">`
            : "";

        card.innerHTML = `
            ${image}
            <div class="movie-card-content">
                <h3></h3>
                <p>⭐ Rating: </p>
                <p>📺 Language: </p>
                <button class="details-button" type="button">Show Details</button>
                <button class="remove-favourite-button" type="button">
                    💔 Remove from Watchlist
                </button>
            </div>
        `;

        card.querySelector("h3").textContent = show.name;
        card.querySelectorAll("p")[0].textContent =
            `⭐ Rating: ${show.rating}`;
        card.querySelectorAll("p")[1].textContent =
            `📺 Language: ${show.language}`;

        card.querySelector(".details-button").addEventListener("click", function () {
            alert(
                `Title: ${show.name}\n` +
                `Status: ${show.status}\n` +
                `Premiered: ${show.premiered}\n` +
                `Rating: ${show.rating}`
            );
        });

        card.querySelector(".remove-favourite-button").addEventListener("click", function () {
            const updatedFavourites = JSON.parse(
                localStorage.getItem("cineverseFavourites") || "[]"
            ).filter(function (favourite) {
                return favourite.id !== show.id;
            });

            localStorage.setItem(
                "cineverseFavourites",
                JSON.stringify(updatedFavourites)
            );

            card.remove();

            const remainingRows = movieTableBody.querySelectorAll("tr");
            remainingRows.forEach(function (row) {
                if (row.dataset.showId === String(show.id)) {
                    row.remove();
                }
            });

            const remainingCount = movieGrid.querySelectorAll(".movie-card").length;
            recordCount.textContent = String(remainingCount);

            statusMessage.textContent = remainingCount === 0
                ? "Your watchlist is empty. Add some favourites first!"
                : "Favourite removed from your watchlist.";
        });

        movieGrid.appendChild(card);

        const row = document.createElement("tr");
        row.dataset.showId = String(show.id);

        const titleCell = document.createElement("td");
        const ratingCell = document.createElement("td");
        const languageCell = document.createElement("td");

        titleCell.textContent = show.name;
        ratingCell.textContent = String(show.rating);
        languageCell.textContent = show.language;

        row.append(titleCell, ratingCell, languageCell);
        movieTableBody.appendChild(row);
    });

    recordCount.textContent = String(favourites.length);
    statusMessage.textContent = "Your saved favourites are here! ❤️";
});


