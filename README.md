# CampusNest 
### Student Accommodation Discovery & Management System

## Problem
**Challenges Encountered by University Students 
in Securing Off-Campus Accommodation**

University students struggle to find safe, affordable 
accommodation after their first year when university 
hostel is no longer provided. They are new to the area, 
have limited time, don't know locals, and can't verify 
safety or nearby facilities.

---

## Proposed Solution
CampusNest is a RESTful API system that allows landlords 
to list their accommodations and students to find safe, 
affordable housing near their university.

---

## Features
- Add, view, update and delete accommodation listings
- Filter listings by type, gender, price and distance
- Add and view reviews for each listing
- Safety and facility verification per listing
- Meal, furnishing and transport info included

---

## Technologies Used
- Node.js
- Express.js v5
- MongoDB
- Mongoose
- dotenv
- Postman (API Testing)
- GitHub (Version Control)

---

## Folder Structure
```
CampusNest/
│
├── config/
│   └── db.js
├── models/
│   ├── Listing.js
│   └── Review.js
├── controllers/
│   ├── listingController.js
│   └── reviewController.js
├── routes/
│   ├── listingRoutes.js
│   └── reviewRoutes.js
├── middleware/
│   └── errorHandler.js
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md

```


---

## API Endpoints

### Listing Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/listings | Add new listing |
| GET | /api/listings | Get all listings |
| GET | /api/listings/:id | Get single listing |
| PUT | /api/listings/:id | Update listing |
| DELETE | /api/listings/:id | Delete listing |

### Filter Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/listings/filter/available | Available listings |
| GET | /api/listings/filter/type/:type | Filter by type |
| GET | /api/listings/filter/gender/:gender | Filter by gender |
| GET | /api/listings/filter/price/:max | Filter by max price |
| GET | /api/listings/filter/distance/:km | Filter by distance |

### Review Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/reviews/:listingId | Add review |
| GET | /api/reviews/:listingId | Get reviews |
| PUT | /api/reviews/:id | Update review |
| DELETE | /api/reviews/:id | Delete review |

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/CampusNest.git
cd CampusNest
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create .env file
```bash
# Copy from .env.example
cp .env.example .env

# Add your own values
PORT=5000
MONGO_URI=mongodb://localhost:27017/campusnest
NODE_ENV=development
```

### 4. Run the project
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 5. Open in Postman
http://localhost:5000

---

## Scripts
| Command | Description |
|---------|-------------|
| `npm start` | Run in production |
| `npm run dev` | Run with nodemon |

---

## Author
- Name: A.Nivetha
- University: University of Vavuniya
- Module: Web Services and Technology (IT2234)
- Year: 2nd Year IT

