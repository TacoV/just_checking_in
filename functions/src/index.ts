import * as express from "express";
import {onRequest, Request} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";


// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

initializeApp();

const test = async (req:Request, res:express.Response) => {
    
    const writeResult = await getFirestore()
        .collection("messages")
        .add({query: req.query });

    res.json({result: `Message with ID: ${writeResult.id} added.`});

  };

exports.addmessage = onRequest(test)