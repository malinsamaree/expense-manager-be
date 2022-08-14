import {RequestHandler} from "express";
import fetch from "node-fetch";
import createError from "http-errors";
import {
    getAllPayingAccounts
} from "./payingAccount.controllers";

const verify: RequestHandler = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];
        const verifiedToken = await fetch('http://localhost:8000/user/verify', {headers: {
                'Authorization': `Bearer ${accessToken}`
            }});
        const decodedVerifiedToken = await verifiedToken.json();
        if (decodedVerifiedToken.error) {
            throw new createError.Unauthorized(decodedVerifiedToken.message);
        }
        req.body = {...req.body, "userId": decodedVerifiedToken.userId};
        next();
    } catch (e) {
        next(e);
    }
}

const getAll: RequestHandler = async (req, res, next) => {
    try {
        // error messages has to come from a centralized place.
        if (!req.body.userId) throw new createError.Unauthorized('invalid access token');

        res.send({"initData": {
                "locale": "de-DE",
                "categories" : [
                    {"category": "Shopping", "type": "expense", "subCategories": ["HIT", "ALDI", "EDEKA", "Rossmann"], "icon": "shopping", "color": "#832B18", "budgeted": 250, "actual": 10},
                    {"category": "Food", "type": "expense", "subCategories": ["Malin", "Melanie"], "icon": "food", "color": "#836118", "actual": 27.34},
                    {"category": "Entertainment", "type": "expense", "icon": "entertainment", "color": "#708318", "budgeted": 100, "actual": 127},
                    {"category": "Travel", "type": "expense", "subCategories": ["domestic", "international"], "icon": "travel", "color": "#3B8318", "budgeted": 200, "actual": 150},
                    {"category": "Salary", "type": "income", "icon": "smile2", "color": "#3B8318", "budgeted": 3000, "actual": 3000}
                ],
                "payingAccounts": req.body.payingAccounts
            }})
    } catch (e) {
        next(e);
    }
}

export {verify, getAll};