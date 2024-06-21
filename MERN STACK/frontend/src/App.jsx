import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [month, setMonth] = useState('3');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/roxiler/transactions`, {
        params: { month, search, page }
      });
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [month, search, page]);

  const handleSearch = (e) => {
    setSearch(e.target.value)
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  const navigate = useNavigate();

  const handleMonthChange = (e) => {
    setMonth('3');
    navigate(`/stats/3`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-200">
      <div className='flex justify-center items-center w-40 h-40 rounded-full bg-white mb-8'>
        <div className=' text-center'>Transaction Dashboard</div>
      </div>
      <div className="flex justify-between items-center mb-4 w-full max-w-4xl">
        <button className='btn border-t-white' onClick={handleMonthChange}>Stats for a Month</button>
        <input
          type="text"
          placeholder="Search transactions..."
          className="input input-bordered"
          value={search}
          onChange={handleSearch}
        />
      </div>
      <table className="table w-full bg-yellow-300 max-w-4xl">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Date of Sale</th>
            <th>Sold</th>
            <th>Image URL</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(transactions) && transactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{transaction.category}</td>
              <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
              <td>{transaction.sold ? 'Yes' : 'No'}</td>
              <td>{transaction.image}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className=" mt-10 join grid grid-cols-4">
        <span>Page No. {page}</span>
        <button className="join-item btn btn-outline" onClick={handlePreviousPage}>Previous page</button>
        <button className="join-item btn btn-outline" onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
};
const StatsPage = () => {
  const { month: paramMonth } = useState('3');
  const [month, setMonth] = useState(paramMonth || '3');
  const [stats, setStats] = useState(null);
  const [barStats, setBarStats] = useState(null);
  const [pieStats, setPieStats] = useState(null);
  const navigate = useNavigate();

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    navigate(`/stats/${e.target.value}`);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/roxiler/data`, { params: { month } });
        setStats(response.data.statistics);
        setBarStats(response.data.barChart);
        setPieStats(response.data.pieChart);
        console.log(response);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [month]);

  const barData = {
    labels: Object.keys(barStats || {}),
    datasets: [
      {
        label: 'Sales by Price Range',
        data: Object.values(barStats || {}),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: Object.keys(pieStats || {}),
    datasets: [
      {
        label: 'Sales Distribution',
        data: Object.values(pieStats || {}),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-200">
      <div className='flex justify-center items-center w-40 h-40 rounded-full bg-white mb-8'>
        <div className=' text-center'>Statistics Dashboard</div>
      </div>
      <div className="flex justify-between items-center mb-4 w-full max-w-4xl">
        <select className="select select-bordered" value={month} onChange={handleMonthChange}>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </div>
      <div className="p-4">
        <h2 className="text-2xl mb-4">Statistics for Month: {month}</h2>
        <div>
          <div className="border border-base-300">
            <div className="flex justify-center px-14 py-16 border-t">
              <div className=' rounded-box size-max bg-yellow-500'>
                Total Sales Amount: {stats.totalSaleAmount}<br />
                Total Items Sold: {stats.totalSoldItems}<br />
                Total Items Not Sold: {stats.totalNotSoldItems}<br />
              </div>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <Bar data={barData} />
        </div>
        <div>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
};


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Transactions />} />
        <Route path="/stats/:month" element={<StatsPage />} />
      </Routes>
    </Router>
  );
};
export default App;
