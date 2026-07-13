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
	limit,
	increment,
	writeBatch,
} from 'firebase/firestore'
import { db } from './config'
import { Utils } from '@/utils/Utils'
import type { CommentInput } from '@/redux/types/Comment.type'

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

	toggleLike: async (
		guideId: string,
		userId: string
	): Promise<{ liked: boolean; likeCount: number }> => {
		const guideRef = doc(db, 'guides', guideId)
		const likeRef = doc(db, 'guides', guideId, 'likes', userId)

		return runTransaction(db, async tx => {
			const [guideSnap, likeSnap] = await Promise.all([tx.get(guideRef), tx.get(likeRef)])

			if (!guideSnap.exists()) throw new Error('Guide not found')

			const alreadyLiked = likeSnap.exists()

			if (alreadyLiked) {
				tx.delete(likeRef)
				tx.update(guideRef, { likeCount: increment(-1) })
			} else {
				tx.set(likeRef, { createdAt: serverTimestamp() })
				tx.update(guideRef, { likeCount: increment(1) })
			}

			const nextCount = (guideSnap.data().likeCount ?? 0) + (alreadyLiked ? -1 : 1)
			return { liked: !alreadyLiked, likeCount: Math.max(0, nextCount) }
		})
	},

	getLikeStatus: async (guideId: string, userId: string): Promise<boolean> => {
		const snap = await getDoc(doc(db, 'guides', guideId, 'likes', userId))
		return snap.exists()
	},

	addComment: async (guideId: string, data: Omit<CommentInput, 'guideId'>): Promise<string> => {
		const guideRef = doc(db, 'guides', guideId)
		const commentRef = doc(collection(db, 'guides', guideId, 'comments'))

		const batch = writeBatch(db)
		batch.set(commentRef, {
			...data,
			guideId,
			likeCount: 0,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
		})
		batch.update(guideRef, { commentCount: increment(1) })
		await batch.commit()

		return commentRef.id
	},

	removeComment: async (guideId: string, commentId: string): Promise<void> => {
		const guideRef = doc(db, 'guides', guideId)
		const commentRef = doc(db, 'guides', guideId, 'comments', commentId)

		const batch = writeBatch(db)
		batch.delete(commentRef)
		batch.update(guideRef, { commentCount: increment(-1) })
		await batch.commit()
	},

	toggleCommentLike: async (
		guideId: string,
		commentId: string,
		userId: string
	): Promise<{ liked: boolean; likeCount: number }> => {
		const commentRef = doc(db, 'guides', guideId, 'comments', commentId)
		const likeRef = doc(db, 'guides', guideId, 'comments', commentId, 'commentLikes', userId)

		return runTransaction(db, async tx => {
			const [commentSnap, likeSnap] = await Promise.all([tx.get(commentRef), tx.get(likeRef)])

			if (!commentSnap.exists()) throw new Error('Comment not found')

			const alreadyLiked = likeSnap.exists()

			if (alreadyLiked) {
				tx.delete(likeRef)
				tx.update(commentRef, { likeCount: increment(-1) })
			} else {
				tx.set(likeRef, { userId, createdAt: serverTimestamp() })
				tx.update(commentRef, { likeCount: increment(1) })
			}

			const nextCount = (commentSnap.data().likeCount ?? 0) + (alreadyLiked ? -1 : 1)
			return { liked: !alreadyLiked, likeCount: Math.max(0, nextCount) }
		})
	},

	getCommentLikeStatus: async (
		guideId: string,
		commentId: string,
		userId: string
	): Promise<boolean> => {
		const snap = await getDoc(
			doc(db, 'guides', guideId, 'comments', commentId, 'commentLikes', userId)
		)
		return snap.exists()
	},

	where,
	orderBy,
	limit,
	writeBatch,
}
