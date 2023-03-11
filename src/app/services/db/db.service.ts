import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { WhereFilterOp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  constructor(private readonly firestore: AngularFirestore) {}

  addDocument(collection: string, document: Record<string, any>) {
    return this.firestore.collection(collection).add(document);
  }

  async getAllDocuments(collection: string, orderBy: string) {
    let res = await this.firestore
      .collection(collection)
      .ref.orderBy(orderBy)
      .get();
    return res.docs.map((d: any) => {
      return { id: d.id, ...d.data() };
    });
  }

  async getDocumentWhereFieldEquals(collection: string, where: [string, any]) {
    let res = await this.firestore
      .collection(collection)
      .ref.where(where[0], '==', where[1])
      .get();
    return res.docs.map((d: any) => {
      return { id: d.id, ...d.data() };
    })[0];
  }

  async updateDocumentWhereFieldEquals(
    collection: string,
    where: [string, any],
    data: Record<string, any>
  ) {
    let res = await this.firestore
      .collection(collection)
      .ref.where(where[0], '==', where[1])
      .get();
    return res.docs[0].ref.update(data);
  }

  updateById(collection: string, id: string, data: Record<string, any>) {
    return this.firestore.collection(collection).doc(id).update(data);
  }

  getDocumentById(collection: string, id: string) {
    return this.firestore.collection(collection).doc(id).get();
  }

  async getDocumentsOrderedByWhere(
    collection: string,
    orderBy: string,
    asc: boolean,
    where: [string, WhereFilterOp, any][],
    limit: number = 10,
    after: AngularFirestoreDocument | null = null
  ) {
    let collectionRef: any = this.firestore.collection(collection).ref;
    collectionRef = collectionRef.orderBy(orderBy, asc ? 'asc' : 'desc');
    for (let i = 0; i < where.length; i++) {
      collectionRef = collectionRef.where(
        where[i][0],
        where[i][1],
        where[i][2]
      );
    }
    if (after) {
      collectionRef = collectionRef.startAfter(after);
    }
    collectionRef = collectionRef.limit(limit);
    let docs = await collectionRef.get();
    docs = docs.docs;
    return docs.map((d: any) => ({ ...d.data(), id: d.id }));
  }

  deleteDocument(collection: string, id: string) {
    return this.firestore.collection(collection).doc(id).delete();
  }
}
