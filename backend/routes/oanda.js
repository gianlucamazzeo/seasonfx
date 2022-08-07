const express = require('express')
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { authCheck, adminCheck } = require("../middlewares/auth");
const { getDataByOanda } = require('../oanda');



router.get('/oanda/accounts',  authCheck, adminCheck,  asyncHandler(async (req, res) => { 
    try {   
        const response = await getDataByOanda({endpoint: 'accounts'});
        console.log(response)
        res.status(200).send(response);

    } catch (error) {
        console.log(error.message)
    } 
}));


router.get('/oanda/instruments/:pair/:fromData/:toData/:granularity',  authCheck, adminCheck,  asyncHandler(async (req, res) => { 
    try { 
        // EUR_USD/candles?price=A&from=2022-06-01&to=2022-06-30&granularity=D  
        const response = await getDataByOanda({endpoint: 'instruments', pair: req.params.pair, fromData: req.params.fromData, toData: req.params.toData, granularity: req.params.granularity, price: 'A' });
        console.log(response)
        res.status(200).send(response);

    } catch (error) {
        console.log(error.message)
    } 
}));

module.exports = router


module.exports = router




//