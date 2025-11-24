'use client'

import React, { useState, useEffect } from 'react'

type Player = {
  id: string
  name: string
  gamesPlayed: number
  wins: number
  draws: number
  losses: number
}

type Game = {
  id: string
  date: string
  team1: string[]
  team2: string[]
  score1: number
  score2: number
  location: string
}

export default function Home() {
  const [games, setGames] = useState<Game[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [showAddGame, setShowAddGame] = useState(false)
  const [newGame, setNewGame] = useState({
    date: '',
    team1Players: '',
    team2Players: '',
    score1: '',
    score2: '',
    location: ''
  })

  useEffect(() => {
    // Load data from localStorage
    const savedGames = localStorage.getItem('footable-games')
    const savedPlayers = localStorage.getItem('footable-players')
    
    if (savedGames) {
      setGames(JSON.parse(savedGames))
    }
    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers))
    }
  }, [])

  const saveToLocalStorage = (games: Game[], players: Player[]) => {
    localStorage.setItem('footable-games', JSON.stringify(games))
    localStorage.setItem('footable-players', JSON.stringify(players))
  }

  const addGame = () => {
    if (!newGame.date || !newGame.team1Players || !newGame.team2Players || 
        newGame.score1 === '' || newGame.score2 === '') {
      alert('Please fill all fields')
      return
    }

    const team1 = newGame.team1Players.split(',').map(name => name.trim())
    const team2 = newGame.team2Players.split(',').map(name => name.trim())
    
    const game: Game = {
      id: Date.now().toString(),
      date: newGame.date,
      team1,
      team2,
      score1: parseInt(newGame.score1),
      score2: parseInt(newGame.score2),
      location: newGame.location || 'Unknown'
    }

    const updatedGames = [...games, game]
    
    // Update players
    const allPlayersInGame = [...team1, ...team2]
    const updatedPlayers = [...players]
    
    allPlayersInGame.forEach(playerName => {
      const existingPlayer = updatedPlayers.find(p => p.name === playerName)
      if (existingPlayer) {
        existingPlayer.gamesPlayed += 1
        if (game.score1 === game.score2) {
          existingPlayer.draws += 1
        } else if (
          (team1.includes(playerName) && game.score1 > game.score2) ||
          (team2.includes(playerName) && game.score2 > game.score1)
        ) {
          existingPlayer.wins += 1
        } else {
          existingPlayer.losses += 1
        }
      } else {
        const newPlayer: Player = {
          id: Date.now().toString() + Math.random(),
          name: playerName,
          gamesPlayed: 1,
          wins: 0,
          draws: 0,
          losses: 0
        }
        
        if (game.score1 === game.score2) {
          newPlayer.draws = 1
        } else if (
          (team1.includes(playerName) && game.score1 > game.score2) ||
          (team2.includes(playerName) && game.score2 > game.score1)
        ) {
          newPlayer.wins = 1
        } else {
          newPlayer.losses = 1
        }
        
        updatedPlayers.push(newPlayer)
      }
    })

    setGames(updatedGames)
    setPlayers(updatedPlayers)
    saveToLocalStorage(updatedGames, updatedPlayers)
    
    setNewGame({
      date: '',
      team1Players: '',
      team2Players: '',
      score1: '',
      score2: '',
      location: ''
    })
    setShowAddGame(false)
  }

  const getWinPercentage = (player: Player) => {
    if (player.gamesPlayed === 0) return 0
    return Math.round((player.wins / player.gamesPlayed) * 100)
  }

  const topPlayers = [...players]
    .sort((a, b) => getWinPercentage(b) - getWinPercentage(a))
    .slice(0, 5)

  const recentGames = [...games].reverse().slice(0, 5)

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Navigation */}
      <nav style={{ backgroundColor: '#3b82f6', color: 'white', padding: '1rem 0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>⚽ FooTable</h1>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
            Football Game Tracker
          </h2>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
            Keep track of your weekend games with friends
          </p>
        </div>

        {/* Add Game Button */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button
            onClick={() => setShowAddGame(true)}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
          >
            ➕ Add New Game
          </button>
        </div>

        {/* Add Game Modal */}
        {showAddGame && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              padding: '2rem',
              width: '90%',
              maxWidth: '500px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Add New Game</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Date:</label>
                <input
                  type="date"
                  value={newGame.date}
                  onChange={(e) => setNewGame({...newGame, date: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.25rem',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Team 1 Players (comma separated):</label>
                <input
                  type="text"
                  value={newGame.team1Players}
                  onChange={(e) => setNewGame({...newGame, team1Players: e.target.value})}
                  placeholder="John, Mike, Alex"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.25rem',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Team 2 Players (comma separated):</label>
                <input
                  type="text"
                  value={newGame.team2Players}
                  onChange={(e) => setNewGame({...newGame, team2Players: e.target.value})}
                  placeholder="Sarah, Tom, Lisa"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.25rem',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Team 1 Score:</label>
                  <input
                    type="number"
                    value={newGame.score1}
                    onChange={(e) => setNewGame({...newGame, score1: e.target.value})}
                    min="0"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.25rem',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Team 2 Score:</label>
                  <input
                    type="number"
                    value={newGame.score2}
                    onChange={(e) => setNewGame({...newGame, score2: e.target.value})}
                    min="0"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.25rem',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Location (optional):</label>
                <input
                  type="text"
                  value={newGame.location}
                  onChange={(e) => setNewGame({...newGame, location: e.target.value})}
                  placeholder="Local park"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.25rem',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowAddGame(false)}
                  style={{
                    backgroundColor: '#e5e7eb',
                    color: '#374151',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.25rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={addGame}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.25rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Add Game
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          {/* Recent Games */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            padding: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
              Recent Games
            </h3>
            {recentGames.length === 0 ? (
              <p style={{ color: '#6b7280', textAlign: 'center' }}>No games yet! Add your first game above.</p>
            ) : (
              <div style={{ space: '1rem' }}>
                {recentGames.map((game, index) => (
                  <div key={game.id} style={{
                    padding: '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.25rem',
                    marginBottom: index < recentGames.length - 1 ? '0.5rem' : 0
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{game.date}</span>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{game.location}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '500' }}>{game.team1.join(', ')}</span>
                      <span style={{ 
                        fontWeight: 'bold', 
                        fontSize: '1.25rem',
                        color: game.score1 > game.score2 ? '#10b981' : game.score1 < game.score2 ? '#ef4444' : '#6b7280'
                      }}>
                        {game.score1} - {game.score2}
                      </span>
                      <span style={{ fontWeight: '500' }}>{game.team2.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Players */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            padding: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
              Top Players
            </h3>
            {topPlayers.length === 0 ? (
              <p style={{ color: '#6b7280', textAlign: 'center' }}>No player stats yet!</p>
            ) : (
              <div>
                {topPlayers.map((player, index) => (
                  <div key={player.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 0',
                    borderBottom: index < topPlayers.length - 1 ? '1px solid #e5e7eb' : 'none'
                  }}>
                    <div>
                      <div style={{ fontWeight: '500' }}>{player.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {player.gamesPlayed} games
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold', color: '#10b981' }}>
                        {getWinPercentage(player)}%
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {player.wins}W {player.draws}D {player.losses}L
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            padding: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
              Quick Stats
            </h3>
            <div style={{ space: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span>Total Games:</span>
                <span style={{ fontWeight: 'bold' }}>{games.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span>Total Players:</span>
                <span style={{ fontWeight: 'bold' }}>{players.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Average Goals:</span>
                <span style={{ fontWeight: 'bold' }}>
                  {games.length > 0 
                    ? ((games.reduce((sum, game) => sum + game.score1 + game.score2, 0) / games.length).toFixed(1))
                    : '0'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
