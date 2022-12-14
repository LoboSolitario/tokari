const User = require('../models/user');
const Basket = require('../models/basket');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler')
var hmacSHA256 = require("crypto-js/hmac-sha256");
const axios = require('axios');
const sendEmail = require('./emailController/email');
const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');


const binance_api_key = process.env.BINANCE_API_KEY;
const binance_api_secret = process.env.BINANCE_API_SECRET;

// @desc get list of all users
// @route GET /api/users
// @access Private
const getAllUsers = (req, res) => {
    User.find({}).select('-password')
        .then(users => res.json(users))
        .catch(err => res.status(500).json({ error: err }));
}

// @desc get details about the specific user
// @route POST /api/users/userDetails
// @access Private
const getUser = asyncHandler(async (req, res) => {
    res.status(200).json(req.user)
})

// @desc login a user.
// @route POST /api/users/login
// @access public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    // Check for user email
    const user = await User.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Authentication Failed')
    }
})

// @desc Register new user
// @route POST /api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)
    let newUser;
    try {
        newUser = await User.create({
            name: name,
            email: email,
            password: hashedPassword,
            role: role,
            totalRevenue: 0
        })
    } catch (error) {
        res.status(400);
        throw new Error(error)
    }

    if (newUser) {
        var source = fs.readFileSync(path.join(__dirname, '../emailTemplate/welcome.hbs'), 'utf8');
        var template = Handlebars.compile(source);
        const replacements = {
            userName: newUser.name
        };
        sendEmail(newUser.email, 'Welcome to Tokari', template(replacements));
        res.status(201).json({
            _id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            token: generateToken(newUser._id)
        })
    } else {
        res.status(400);
        throw new Error('Invalid User data');
    }
})

// @desc delete user account.
// @route DELETE /api/users/deleteUser/:id
// @access Private
const deleteUser = (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.json(500, err));
}

// @desc get user statistics for investment dashboard
// @route GET /api/users/userStats
// @access Private
const getInvestorStats = asyncHandler(async (req, res) => {
    let subscriptionCount, totalInvestmentAmount, currentBinanceBalance;
    const user = req.user;
    totalInvestmentAmount = 0;
    subscriptionCount = user.subscribedBaskets ? user.subscribedBaskets.length : 0;
    user.transactionLists.forEach(transaction => {
        let transaction_amt = 0;
        transaction.cryptoAlloc.forEach((crypto) => {
            transaction_amt += crypto.price*crypto.orderQty
        })
        totalInvestmentAmount += transaction_amt;
    });
    totalInvestmentAmount = totalInvestmentAmount.toFixed(2);
    const val = "timestamp=" + Date.now();
    const signature = hmacSHA256(val, binance_api_secret).toString();
    const post_url = "https://testnet.binance.vision/api/v3/account?" + val + "&signature=" + signature;
    const response = await axios({
        method: 'GET',
        url: post_url,
        headers: {
            'Content-Type': 'application/json',
            'X-MBX-APIKEY': binance_api_key
        }
    })

    response.data.balances.forEach((balance) => {
        if(balance["asset"] === "USDT"){
            currentBinanceBalance = balance["free"]
        }
    })
    res.status(200).json({
        'subscriptionCount': subscriptionCount,
        'totalInvestmentAmount': totalInvestmentAmount,
        'currentBinanceBalance' : currentBinanceBalance
    })
})

// @desc update user details
// @route PATCH /api/users/updateUser/:id
// @access Private
const updateUser = (req, res) => {
    User.findByIdAndUpdate(
        req.params.id,
        req.body).then(user => res.json(user))
        .catch(err => res.json(500, err));
}

// @desc send the 6 landing page basket
// @route PATCH /api/users/landingPageBaskets
// @access Public

const landingPageBaskets = asyncHandler(async (req, res) => {
    let baskets = await Basket.find({'homepage': true}).limit(6).populate({
        path: 'owner',
        select: { 'name': 1 },
    });
    res.status(200).json(baskets)
})



// @desc get all baskets of a specific portfolio manager
// @route GET /api/users/manager/:id
// @access Public
const getBasketsOfManager = asyncHandler(async (req, res) => {
    const managerId = req.params.id;
    
    //find the user to be viewed
    const manager = await User.findById(managerId).select('-password').populate({ path: 'createdBaskets', model: 'Basket' });
    if (manager) {
        res.status(201).json(manager)
    } else {
        res.status(400);
        throw new Error("Manager not found");
    }

})


// @desc get stats of a specific portfolio manager
// @route GET /api/users/stats/manager
// @access Public
const getManagerStats = asyncHandler(async (req, res) => {
    const managerId = req.user._id;
    var numberOfSubscriber = 0;
    var numberOfInvestor = 0;
    
    //find the user to be viewed
    const manager = await User.findById(managerId).select('-password').populate({ path: 'createdBaskets', model: 'Basket' });
    if (!manager) {
        res.status(400);
        throw new Error("Manager not found");
    }

    manager.createdBaskets.forEach(basket => {
        numberOfSubscriber += basket.subscribers.length;
        numberOfInvestor += basket.investors.length;
    });

    res.status(200).json({
        numberOfSubscriber: numberOfSubscriber,
        numberOfInvestor: numberOfInvestor,
        totalRevenue: manager.totalRevenue
    });
})


// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}


module.exports = {
    getAllUsers,
    registerUser,
    loginUser,
    getUser,
    deleteUser,
    updateUser,
    getInvestorStats,
    landingPageBaskets,
    getBasketsOfManager,
    getManagerStats
}