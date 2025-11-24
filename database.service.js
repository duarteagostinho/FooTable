// Database service for Firebase operations
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase.config.js';

// Database service class
export class DatabaseService {
  // Collections
  static COLLECTIONS = {
    GAMES: 'games',
    PLAYERS: 'players',
    USERS: 'users'
  };

  // Games operations
  static async addGame(gameData) {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTIONS.GAMES), {
        ...gameData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding game:', error);
      throw error;
    }
  }

  static async getGames() {
    try {
      const q = query(collection(db, this.COLLECTIONS.GAMES), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting games:', error);
      throw error;
    }
  }

  static async updateGame(gameId, gameData) {
    try {
      const gameRef = doc(db, this.COLLECTIONS.GAMES, gameId);
      await updateDoc(gameRef, {
        ...gameData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating game:', error);
      throw error;
    }
  }

  static async deleteGame(gameId) {
    try {
      await deleteDoc(doc(db, this.COLLECTIONS.GAMES, gameId));
    } catch (error) {
      console.error('Error deleting game:', error);
      throw error;
    }
  }

  // Players operations
  static async addPlayer(playerData) {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTIONS.PLAYERS), {
        ...playerData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding player:', error);
      throw error;
    }
  }

  static async getPlayers() {
    try {
      const q = query(collection(db, this.COLLECTIONS.PLAYERS), orderBy('name'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting players:', error);
      throw error;
    }
  }

  static async updatePlayer(playerId, playerData) {
    try {
      const playerRef = doc(db, this.COLLECTIONS.PLAYERS, playerId);
      await updateDoc(playerRef, {
        ...playerData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating player:', error);
      throw error;
    }
  }

  static async deletePlayer(playerId) {
    try {
      await deleteDoc(doc(db, this.COLLECTIONS.PLAYERS, playerId));
    } catch (error) {
      console.error('Error deleting player:', error);
      throw error;
    }
  }

  // Users operations
  static async addUser(userData) {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTIONS.USERS), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }

  static async getUsers() {
    try {
      const querySnapshot = await getDocs(collection(db, this.COLLECTIONS.USERS));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  static async updateUser(userId, userData) {
    try {
      const userRef = doc(db, this.COLLECTIONS.USERS, userId);
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Real-time listeners
  static onGamesChange(callback) {
    const q = query(collection(db, this.COLLECTIONS.GAMES), orderBy('date', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
      const games = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(games);
    });
  }

  static onPlayersChange(callback) {
    const q = query(collection(db, this.COLLECTIONS.PLAYERS), orderBy('name'));
    return onSnapshot(q, (querySnapshot) => {
      const players = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(players);
    });
  }

  static onUsersChange(callback) {
    return onSnapshot(collection(db, this.COLLECTIONS.USERS), (querySnapshot) => {
      const users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(users);
    });
  }
}
