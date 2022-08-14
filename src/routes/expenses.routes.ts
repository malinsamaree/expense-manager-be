import express from "express";
import {
    verify,
    getAll
} from "../controllers/expenses.controllers";

import {
    createPayingAccount,
    getAllPayingAccounts,
    setPayingAccountDefault,
    renamePayingAccount
} from "../controllers/payingAccount.controllers";

const router = express.Router();

router.get('/', (req, res, next) => {
    res.send('from home page');
});

router.post('/create-paying-account', verify, createPayingAccount);

router.put('/set-paying-account-default', verify, setPayingAccountDefault);

router.put('/rename-paying-account', verify, renamePayingAccount);

router.get('/get-all', verify, getAllPayingAccounts, getAll);

export default router;