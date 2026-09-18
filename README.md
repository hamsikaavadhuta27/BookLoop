# BookLoop

**Give every book another loop.**

BookLoop is a student marketplace for buying and selling used books. Phase 1 is a working website for Hyderabad: browse listings, search, filter, view details, and sell a book.

This project is meant to be learned slowly. You do not need to understand every file on day one.

## Main features (Phase 1)

- Home page with search, categories, recent books, and Hyderabad areas
- Book cards with image, price, condition, location, and seller
- Book details loaded from the selected listing
- Live search by title or author (no page refresh)
- Combined filters: category, branch, year, price, location, condition
- Sell a Book form with validation; new listings appear in Browse Books
- Login / signup / profile **screens only** (not real authentication)
- Express API for books
- MongoDB model ready; the site also runs without MongoDB using sample data in memory

## Technologies

| Layer | Tools |
| --- | --- |
| Frontend | HTML5, CSS3, vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose (optional in Phase 1) |

No React, Next.js, TypeScript, or Tailwind.

## Folder structure

```
bookloop/
├── public/                 Frontend files the browser loads
│   ├── index.html          Home
│   ├── books.html          Listings + search + filters
│   ├── book-details.html   One book
│   ├── sell.html           New listing form
│   ├── login.html          Login UI only
│   ├── signup.html         Signup UI only
│   ├── profile.html        Profile placeholder
│   ├── css/style.css       All page styles
│   ├── js/                 Page scripts
│   └── images/             Logo and sample covers
├── server/
│   ├── config/db.js        MongoDB connection
│   ├── models/             Book (and a User stub for later)
│   ├── routes/             URL paths for the API
│   ├── controllers/        Logic for those URLs
│   ├── middleware/         Error helpers
│   └── data/               Sample books + in-memory store
├── server.js               Starts Express
├── package.json            Project name and npm scripts
├── .env.example            Example environment variables
└── README.md               This file
```

## How to run locally

### 1. Install Node.js

Install the LTS version from [https://nodejs.org](https://nodejs.org). Then open a terminal in this folder.

### 2. Install packages

```bash
npm install
```

### 3. Environment file (optional at first)

```bash
copy .env.example .env
```

On macOS/Linux use `cp .env.example .env`.

You can start **without** MongoDB. The app will say it is using in-memory book data and still show the 12 sample listings.

### 4. Start the server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000)

To auto-restart when you edit server files:

```bash
npm run dev
```

Do not open the HTML files by double-clicking them. Search and listings need the server.

## How to configure MongoDB

1. Install [MongoDB Community Server](https://www.mongodb.com/try/download/community) **or** create a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster.
2. Put the connection string in `.env`:

```
MONGODB_URI=mongodb://127.0.0.1:27017/bookloop
```

3. Restart `npm start`.
4. If the database is empty, BookLoop inserts the sample books automatically.

To wipe and re-insert sample books:

```bash
npm run seed
```

Never put real passwords inside code files. Only `.env` (which is gitignored).

## API endpoints

| Method | Path | What it does |
| --- | --- | --- |
| GET | `/api/health` | Server status |
| GET | `/api/books` | All books (supports query filters) |
| GET | `/api/books/:id` | One book |
| POST | `/api/books` | Create a listing |
| PUT | `/api/books/:id` | Update a listing |
| DELETE | `/api/books/:id` | Delete a listing |
| GET | `/api/categories` | Category list |
| GET | `/api/locations` | Hyderabad areas |
| GET | `/api/filters` | Categories, years, conditions, locations |

Example search:

`/api/books?search=Java&category=B.Tech&branch=CSE&location=Koti`

Query parameters: `search` (or `q`), `category`, `branch`, `year`, `location`, `condition`, `minPrice`, `maxPrice`.

Status codes: `200` OK, `201` created, `400` validation error, `404` not found, `500` server error.

## Suggested learning order

1. Open `public/index.html` and `public/css/style.css` — layout and design.
2. Open `public/js/main.js` — how the menu and home page load data.
3. Open `public/js/books.js` — search and filters.
4. Open `public/js/details.js` — `?id=` in the URL.
5. Open `public/js/sell.js` and `public/js/api.js` — forms and `fetch`.
6. Open `server.js` — Express serves files and API routes.
7. Open `server/routes/books.js` then `server/controllers/booksController.js`.
8. Open `server/models/Book.js` and `server/config/db.js` when you start MongoDB.
9. Leave `server/models/User.js` and login pages until you learn authentication.

## TODO / Future features

Do not build these in Phase 1. They are listed so the folders stay ready.

**User accounts**

- [ ] Signup, login, logout with hashed passwords
- [ ] Profile page with real user data
- [ ] Seller’s own listings
- [ ] Saved books stored on the user (not only in the browser)

**Chat**

- [ ] Buyer–seller messaging
- [ ] Talk about availability, price, pickup or delivery
- [ ] Real-time chat later (for example Socket.io)

**Other**

- [ ] Wishlist
- [ ] Ratings and reviews
- [ ] Notifications
- [ ] Online payments
- [ ] Delivery options

A `User` model file and a `server/routes/chat.js` stub exist only as placeholders. They are not wired into `server.js` yet on purpose.

## Notes for beginners

- **HTML** is the page structure.
- **CSS** is the look (colours, layout, mobile menu).
- **JavaScript in `public/js`** updates the page without reloading, using `fetch` to call the API.
- **Express** is the Node program that sends your HTML/CSS/JS and answers `/api/...` requests.
- **MongoDB** stores books permanently. If it is off, books live in memory until you stop the server.

Login is **not** fake-secure: it simply does not authenticate. That is intentional.
