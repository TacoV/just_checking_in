import * as express from "express";
import {onRequest, Request} from "firebase-functions/v2/https";

const { defineInt, defineString } = require('firebase-functions/params');

const TELEGRAM_API_TOKEN = defineString('TELEGRAM_API_TOKEN');

const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

initializeApp();

exports.saveMessageToDB = onRequest(
    { TELEGRAM_API_TOKEN: TELEGRAM_API_TOKEN },
    async (req:Request, res:express.Response) => {
    
        const writeResult = await getFirestore()
            .collection("messages")
            .add({query: req.query });
    
        res.json({result: `Message with ID: ${writeResult.id} added.`});
    
      }   
)