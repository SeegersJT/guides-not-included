// src/firebase/firestoreService.ts
// Generic Firestore CRUD helpers

import {
	collection,
	doc,
	getDoc,
	getDocs,
	addDoc,
	updateDoc,
	deleteDoc,
	query,
	where,
	orderBy,
	QueryConstraint,
	type DocumentData,
	type WithFieldValue,
	serverTimestamp,
} from 'firebase/firestore'
import { db } from './config'
import { Utils } from '@/utils/Utils'

export const firestoreService = {
	/** Fetch a single document by ID */
	getById: async <T>(collectionName: string, id: string): Promise<T | null> => {
		const snap = await getDoc(doc(db, collectionName, id))
		return snap.exists()
			? ({ id: snap.id, ...Utils.convertTimestamps(snap.data()) } as T)
			: null
	},

	/** Fetch all documents in a collection with optional constraints */
	getAll: async <T>(
		collectionName: string,
		constraints: QueryConstraint[] = []
	): Promise<T[]> => {
		const q = query(collection(db, collectionName), ...constraints)
		const snap = await getDocs(q)
		return snap.docs.map(d => ({ id: d.id, ...Utils.convertTimestamps(d.data()) }) as T)
	},

	add: async <T extends DocumentData>(
		collectionName: string,
		data: WithFieldValue<T>
	): Promise<string> => {
		const ref = await addDoc(collection(db, collectionName), {
			...data,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
		})
		return ref.id
	},

	update: async (
		collectionName: string,
		id: string,
		data: Partial<DocumentData>
	): Promise<void> => {
		await updateDoc(doc(db, collectionName, id), {
			...data,
			updatedAt: serverTimestamp(),
		})
	},

	remove: async (collectionName: string, id: string): Promise<void> => {
		await deleteDoc(doc(db, collectionName, id))
	},

	where,
	orderBy,
}
