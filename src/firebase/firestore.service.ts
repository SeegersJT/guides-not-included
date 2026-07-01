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
	arrayUnion,
	arrayRemove,
	runTransaction,
} from 'firebase/firestore'
import { db } from './config'
import { Utils } from '@/utils/Utils'

export const firestoreService = {
	getById: async <T>(collectionName: string, id: string): Promise<T | null> => {
		const snap = await getDoc(doc(db, collectionName, id))
		return snap.exists()
			? ({ id: snap.id, ...Utils.convertTimestamps(snap.data()) } as T)
			: null
	},

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

	addToArray: async (
		collectionName: string,
		id: string,
		field: string,
		value: unknown
	): Promise<void> => {
		await updateDoc(doc(db, collectionName, id), {
			[field]: arrayUnion(value),
			updatedAt: serverTimestamp(),
		})
	},

	removeFromArray: async (
		collectionName: string,
		id: string,
		field: string,
		value: unknown
	): Promise<void> => {
		await updateDoc(doc(db, collectionName, id), {
			[field]: arrayRemove(value),
			updatedAt: serverTimestamp(),
		})
	},

	updateArrayItem: async <T extends { id: string }>(
		collectionName: string,
		id: string,
		field: string,
		itemId: string,
		changes: Partial<T>
	): Promise<void> => {
		const ref = doc(db, collectionName, id)
		await runTransaction(db, async transaction => {
			const snap = await transaction.get(ref)
			if (!snap.exists()) throw new Error(`Document ${id} not found`)
			const array = (snap.data()[field] ?? []) as T[]
			const updatedArray = array.map(item =>
				item.id === itemId ? { ...item, ...changes } : item
			)
			transaction.update(ref, { [field]: updatedArray, updatedAt: serverTimestamp() })
		})
	},

	removeArrayItem: async (
		collectionName: string,
		id: string,
		field: string,
		itemId: string
	): Promise<void> => {
		const ref = doc(db, collectionName, id)
		await runTransaction(db, async transaction => {
			const snap = await transaction.get(ref)
			if (!snap.exists()) throw new Error(`Document ${id} not found`)
			const array = (snap.data()[field] ?? []) as { id: string }[]
			const updatedArray = array.filter(item => item.id !== itemId)
			transaction.update(ref, { [field]: updatedArray, updatedAt: serverTimestamp() })
		})
	},
}
