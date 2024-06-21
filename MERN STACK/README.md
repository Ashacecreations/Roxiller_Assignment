# Transaction and Statistics Dashboard

This project is a web application that provides a transaction dashboard and a statistics dashboard for a given month. The transaction dashboard allows users to search and filter transactions, while the statistics dashboard displays charts and statistics for the selected month.

## Features

- Transaction Dashboard
  - Search transactions by title, description, or price.
  - Paginate through transactions.
  - Filter transactions by month.
  
- Statistics Dashboard
  - View total sales amount, total items sold, and total items not sold.
  - View a bar chart of sales by price range.
  - View a pie chart of sales distribution by category.

## Technologies Used

- Frontend:
  - React
  - Axios
  - React Router
  - Chart.js
  - Tailwind CSS

- Backend:
  - Node.js
  - Express
  - MongoDB

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/transaction-dashboard.git
    cd transaction-dashboard
    ```

2. Install backend dependencies:

    ```bash
    cd backend
    npm install
    ```

3. Start the backend server:

    ```bash
    npm start
    ```

4. Install frontend dependencies:

    ```bash
    cd ../frontend
    npm install
    ```

5. Start the frontend development server:

    ```bash
    npm start
    ```

## Usage

1. Navigate to `http://localhost:3000` in your web browser.
2. Use the transaction dashboard to search and filter transactions.
3. Navigate to the statistics dashboard by selecting a month to view detailed statistics, bar chart, and pie chart for that month.

## Project Structure

- `backend/`: Contains the backend code including routes and database models.
- `frontend/`: Contains the frontend code including React components and styles.

## API Endpoints

- `/transactions`: Fetch transactions with optional search and pagination parameters.
- `/data`: Fetch statistics, bar chart data, and pie chart data for a specified month.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## Acknowledgements

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Chart.js](https://www.chartjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
