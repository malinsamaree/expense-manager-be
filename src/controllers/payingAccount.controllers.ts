import {RequestHandler} from "express";
import createError from "http-errors";
import {PayingAccount} from "../models/model.payingAccount";
import mongoose from "mongoose";

const createPayingAccount: RequestHandler = async (req, res, next) => {
    try {
        // error messages has to come from a centralized place.
        if (!req.body.userId) throw new createError.Unauthorized('invalid access token');
        const userId = req.body.userId;
        const name = req.body.name;
        const existingPayingAccount = await PayingAccount.findOne({userId, name});

        // error messages has to come from a centralized place.
        if (existingPayingAccount) throw new createError.Conflict('paying account already exists');
        const existingDefaultPayingAccount = await PayingAccount.findOne({userId, default: true});
        const isDefault = !existingDefaultPayingAccount;
        const payingAccount = new PayingAccount({
            userId,
            name,
            default: isDefault
        })
        const savedPayingAccount = await payingAccount.save();

        res.send(savedPayingAccount);
    } catch (e) {
        next(e);
    }
}

const getAllPayingAccounts: RequestHandler = async (req, res, next) => {
    try {
        // error messages has to come from a centralized place.
        if (!req.body.userId) throw new createError.Unauthorized('invalid access token');
        const userId = req.body.userId;
        const payingAccounts = await PayingAccount.find({userId});
        const filteredPayingAccounts = payingAccounts.map(item => {
            return {name: item.name, default: item.default}
        })
        req.body = {...req.body, "payingAccounts": filteredPayingAccounts};
        next();
    } catch (e) {
        next(e);
    }
}

const setPayingAccountDefault: RequestHandler = async (req, res, next) => {
    try {
        // error messages has to come from a centralized place.
        if (!req.body.userId) throw new createError.Unauthorized('invalid access token');
        const userId = req.body.userId;
        const name = req.body.name;
        const existingPayingAccount = await PayingAccount.findOne({userId, name});
        if (!existingPayingAccount) throw new createError.NotFound('this paying account is not available');
        await PayingAccount.updateMany({userId }, {default: false});
        const newDefaultPayingAccount = await PayingAccount.updateOne({userId, name}, {default: true});
        res.send(newDefaultPayingAccount);
    } catch (e) {
        next(e);
    }
}

const renamePayingAccount: RequestHandler = async (req, res, next) => {
    try {
        if (!req.body.userId) throw new createError.Unauthorized('invalid access token');
        const userId = req.body.userId;
        const currentName = req.body.currentName;
        const newName = req.body.newName;
        const existingPayingAccount = PayingAccount.findOne({userId, name: currentName});
        console.log(existingPayingAccount);
        if (!existingPayingAccount) throw new createError.NotFound('this paying account is not available');
        const existingNewNamePayingAccount = await PayingAccount.findOne({userId, name: newName});
        if (existingNewNamePayingAccount) throw new createError.Conflict('this paying account already exist');
        const updatedPayingAccount = await PayingAccount.updateOne({userId, name: currentName}, {name: newName});
        res.send(updatedPayingAccount);
    } catch (e) {
        next(e);
    }
}

export {createPayingAccount, getAllPayingAccounts, setPayingAccountDefault, renamePayingAccount};