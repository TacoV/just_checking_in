// https://medium.com/swlh/using-firestore-with-typescript-65bd2a602945

import {question} from "../types/question";
import {schedule} from "../types/schedule";
import {FirestoreDataConverter, getFirestore} from "firebase-admin/firestore";

const converter = <T>(): FirestoreDataConverter<T> => ({
  toFirestore:
    (data:T) =>
      data as FirebaseFirestore.DocumentData,
  fromFirestore:
    (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
      snap.data() as T,
});

const dataPoint = <T>(collectionPath: string) =>
  getFirestore()
    .collection(collectionPath)
    .withConverter(converter<T>());

const db = {
  questions: dataPoint<question>("questions"),
  schedules: dataPoint<schedule>("schedules"),
};

export default db;
