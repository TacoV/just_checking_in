import * as express from "express";
import {onRequest, Request} from "firebase-functions/v2/https";
import {defineString} from "firebase-functions/params";
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";

const TELEGRAM_API_TOKEN = defineString("TELEGRAM_API_TOKEN");

initializeApp();

exports.saveMessageToDB = onRequest(
  async (req:Request, res:express.Response) => {
    const writeResult = await getFirestore()
      .collection("messages")
      .add({query: req.query});

    res.json({result: `Message with ID: ${writeResult.id} added. API TOKEN ${TELEGRAM_API_TOKEN.value()}`});
  }
);
