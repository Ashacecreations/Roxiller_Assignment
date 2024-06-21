import express from 'express';
import axios from 'axios';
const router = express.Router();

import ProductTransaction from '../models/product.model.js';

// Route for initialize database(fetching from third party API)
router.get('/initialize', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data = response.data;
        await ProductTransaction.insertMany(data);
        res.send('Database initialized');
    } catch (error) {
        res.status(500).send('Error initializing database');
    }
});


// ROute for transaction fetching with pagination
router.get('/transactions', async (req, res) => {
    const { month, search = '', page = 1, perPage = 10 } = req.query;
    const pageNumber = parseInt(page, 10);
    const perPageNumber = parseInt(perPage, 10);
    
    const selectedMonth = parseInt(month, 10);

        if (isNaN(selectedMonth) || selectedMonth < 1 || selectedMonth > 12) {
            return res.status(400).json({ message: "Invalid month" });
        }
    
    const query = {
        $or: [
            { title: new RegExp(search, 'i') },
            { month: "$dateOfSale" , selectedMonth},
            { description: new RegExp(search, 'i') },
            Number(search) ? {price: Number(search)}: {}
        ]
    };
    
    try {
        const transactions = await ProductTransaction.find(query)
            .skip((pageNumber - 1) * perPageNumber)
            .limit(perPageNumber);
        
        const total = await ProductTransaction.countDocuments(query);
        
        res.json({
            transactions,
            total,
            page: pageNumber,
            perPage: perPageNumber,
            totalPages: Math.ceil(total / perPageNumber)
        });
    } catch (error) {
        res.status(501).json({ message: error.message });
    }
});


//Api for combined data 
router.get('/data', async (req, res) => {
    const { month } = req.query;

    if (!month) {
        return res.status(400).json({ message: "Month is required" });
    }

    try {
        const selectedMonth = parseInt(month, 10);

        if (isNaN(selectedMonth) || selectedMonth < 1 || selectedMonth > 12) {
            return res.status(400).json({ message: "Invalid month" });
        }

        const [statistics, barChart, pieChart] = await Promise.all([
            getStatistics(selectedMonth),
            getBarChart(selectedMonth),
            getPieChart(selectedMonth)
        ]);
        
        res.json({
            statistics,
            barChart,
            pieChart
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

// Statistics API
async function getStatistics (selectedMonth) {

    try {

        const transactions = await ProductTransaction.find({
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, selectedMonth]
            }
        });

        const totalSaleAmount = transactions.reduce((acc, transaction) => {
            return transaction.sold ? acc + transaction.price : acc;
        }, 0);

        const totalSoldItems = transactions.filter(transaction => transaction.sold).length;
        const totalNotSoldItems = transactions.length - totalSoldItems;

        return ({
            totalSaleAmount,
            totalSoldItems,
            totalNotSoldItems
        });
    } catch (error) {
        return ({ message: error.message });
    }
};


// function to get bar chart data for a selected month
async function getBarChart (selectedMonth) {
    try {
        
        const transactions = await ProductTransaction.find({
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, selectedMonth]
            }
        });

        const priceRanges = {
            "0-100": 0,
            "101-200": 0,
            "201-300": 0,
            "301-400": 0,
            "401-500": 0,
            "501-600": 0,
            "601-700": 0,
            "701-800": 0,
            "801-900": 0,
            "901-above": 0
        };

        transactions.forEach(transaction => {
            const price = transaction.price;
            if (price <= 100) priceRanges["0-100"]++;
            else if (price <= 200) priceRanges["101-200"]++;
            else if (price <= 300) priceRanges["201-300"]++;
            else if (price <= 400) priceRanges["301-400"]++;
            else if (price <= 500) priceRanges["401-500"]++;
            else if (price <= 600) priceRanges["501-600"]++;
            else if (price <= 700) priceRanges["601-700"]++;
            else if (price <= 800) priceRanges["701-800"]++;
            else if (price <= 900) priceRanges["801-900"]++;
            else priceRanges["901-above"]++;
        });

        return (priceRanges);
    } catch (error) {
        return ({ message: error.message });
    }
};

// function to get pie chart data for a selected month
async function getPieChart (selectedMonth) {

    try {
       
        const transactions = await ProductTransaction.find({
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, selectedMonth]
            }
        });

        const categoryCounts = {};

        transactions.forEach(transaction => {
            const category = transaction.category;
            if (!categoryCounts[category]) {
                categoryCounts[category] = 0;
            }
            categoryCounts[category]++;
        });

        return (categoryCounts);
    } catch (error) {
        return ({ message: error.message });
    }
}

});


export default router;