import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import { WhereFilterOp } from '@angular/fire/firestore';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  constructor(private readonly firestore: AngularFirestore) {}

  addDocument(collection: string, document: Record<string, any>) {
    return this.firestore
      .collection(collection)
      .add(document)
      .then(this.getNewDocFromReference);
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
    })?.[0];
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
    return res.docs[0].ref.update(data).then(this.getNewDocFromReference);
  }

  updateById(collection: string, id: string, data: Record<string, any>) {
    delete data['id'];
    return this.firestore.collection(collection).doc(id).update(data);
  }

  getDocumentById(collection: string, id: string): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      this.firestore
        .collection(collection)
        .doc(id)
        .get()
        .pipe(
          catchError((err: any) => {
            reject(err);
            return throwError(() => new Error(err));
          })
        )
        .subscribe((doc: any) => {
          if (doc.exists) {
            resolve({ doc, value: { id: doc.id, ...doc.data() } });
          } else {
            resolve(null);
          }
        });
    });
    return promise;
  }

  async getDocumentsOrderedByWhere(
    collection: string,
    orderBy: string,
    asc: boolean,
    where: [string, WhereFilterOp, any][],
    limit: number | null = 10,
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
    if (limit) {
      collectionRef = collectionRef.limit(limit);
    }
    let docs = await collectionRef.get();
    docs = docs.docs;
    return docs.map((d: any) => ({ ...d.data(), id: d.id }));
  }

  deleteDocument(collection: string, id: string) {
    return this.firestore.collection(collection).doc(id).delete();
  }

  async deleteDocumentWhereFieldEquals(collection: string, where: [string, any]) {
    const doc = await this.getDocumentWhereFieldEquals(collection, where);
    if (doc) {
      return this.deleteDocument(collection, doc.id)
    }
    return null;
  }

  async getNewDocFromReference(doc: any) {
    let newDoc = await doc.get();
    return { id: newDoc.id, ...newDoc.data() };
  }
}
