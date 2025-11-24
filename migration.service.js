// Migration utility to transfer localStorage data to Firebase
import { DatabaseService } from './database.service.js';

export class DataMigration {
  static async migrateLocalStorageToFirebase() {
    try {
      console.log('Starting data migration from localStorage to Firebase...');

      // Get data from localStorage
      const games = JSON.parse(localStorage.getItem('footable-games') || '[]');
      const players = JSON.parse(localStorage.getItem('footable-players') || '[]');
      const users = JSON.parse(localStorage.getItem('footable-users') || '[]');

      console.log(`Found ${games.length} games, ${players.length} players, ${users.length} users`);

      // Migrate users first
      for (const user of users) {
        try {
          const userData = {
            username: user.username,
            password: user.password, // In production, this should be hashed
            isAdmin: user.isAdmin || false,
            originalId: user.id,
            migratedAt: new Date().toISOString()
          };
          await DatabaseService.addUser(userData);
          console.log(`Migrated user: ${user.username}`);
        } catch (error) {
          console.error(`Failed to migrate user ${user.username}:`, error);
        }
      }

      // Migrate players
      for (const player of players) {
        try {
          const playerData = {
            name: player.name,
            position: player.position || 'Unknown',
            age: player.age || null,
            gamesPlayed: player.gamesPlayed || 0,
            wins: player.wins || 0,
            draws: player.draws || 0,
            losses: player.losses || 0,
            goals: player.goals || 0,
            assists: player.assists || 0,
            createdBy: player.createdBy || 'migration',
            originalId: player.id,
            migratedAt: new Date().toISOString()
          };
          await DatabaseService.addPlayer(playerData);
          console.log(`Migrated player: ${player.name}`);
        } catch (error) {
          console.error(`Failed to migrate player ${player.name}:`, error);
        }
      }

      // Migrate games
      for (const game of games) {
        try {
          const gameData = {
            date: game.date,
            team1: game.team1 || [],
            team2: game.team2 || [],
            score1: game.score1 || 0,
            score2: game.score2 || 0,
            location: game.location || 'Unknown',
            team1Goals: game.team1Goals || [],
            team1Assists: game.team1Assists || [],
            team2Goals: game.team2Goals || [],
            team2Assists: game.team2Assists || [],
            addedBy: game.addedBy || 'migration',
            originalId: game.id,
            migratedAt: new Date().toISOString()
          };
          await DatabaseService.addGame(gameData);
          console.log(`Migrated game from ${game.date}`);
        } catch (error) {
          console.error(`Failed to migrate game from ${game.date}:`, error);
        }
      }

      console.log('Migration completed successfully!');
      
      // Optionally backup localStorage data before clearing
      const backupData = {
        games,
        players,
        users,
        migratedAt: new Date().toISOString()
      };
      localStorage.setItem('footable-backup', JSON.stringify(backupData));
      
      return {
        success: true,
        migrated: {
          users: users.length,
          players: players.length,
          games: games.length
        }
      };

    } catch (error) {
      console.error('Migration failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async clearLocalStorage() {
    const keys = ['footable-games', 'footable-players', 'footable-users', 'footable-currentUser', 'footable-theme'];
    keys.forEach(key => localStorage.removeItem(key));
    console.log('localStorage cleared');
  }

  static async restoreFromBackup() {
    const backup = localStorage.getItem('footable-backup');
    if (backup) {
      const data = JSON.parse(backup);
      localStorage.setItem('footable-games', JSON.stringify(data.games));
      localStorage.setItem('footable-players', JSON.stringify(data.players));
      localStorage.setItem('footable-users', JSON.stringify(data.users));
      console.log('Data restored from backup');
      return true;
    }
    return false;
  }
}
