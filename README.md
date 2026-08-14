# User Enquiry Management System

A full-stack web application for managing user enquiries through a simple and responsive interface.

## Features

* Create and submit enquiries
* View enquiry records
* Update enquiry details
* Delete enquiries
* RESTful API integration
* MongoDB database support
* Responsive React-based interface
* Environment-based configuration for sensitive settings

## Tech Stack

**Frontend**

* React
* Vite
* Axios
* Flowbite React

**Backend**

* Node.js
* Express.js
* MongoDB
* Mongoose

## Project Structure

```text
userEnquiry/
├── client/     # React frontend
├── server/     # Express backend and API
├── .gitignore
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Mysterious-Magici/User-Enquiry-Form.git
cd User-Enquiry-Form
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file based on `.env.example`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Start the backend:

```bash
npm start
```

### 3. Setup Frontend

Open a new terminal:

```bash
cd client/vite-project
npm install
npm run dev
```

## Security

Sensitive configuration such as database credentials and environment variables is kept outside version control. A `.env.example` file is provided to document the required configuration.

## Development

The project follows a client-server architecture where the React frontend communicates with the Express backend through REST APIs.

## License

This project is intended for educational and portfolio purposes.
## Author

**Akash Karmakar**
Computer Science & Engineering Student | West Bengal, India

* GitHub: [Mysterious-Magici](https://github.com/Mysterious-Magici)
* Repository: [User-Enquiry-Form](https://github.com/Mysterious-Magici/User-Enquiry-Form)
