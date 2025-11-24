import React from 'react'
import './globals.css'

export const metadata = {
  title: 'FooTable - Football Game Tracker',
  description: 'Track your weekend football games with friends',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-primary-500 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold">⚽ FooTable</h1>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/" className="hover:text-primary-200">Home</a>
                <a href="/games" className="hover:text-primary-200">Games</a>
                <a href="/stats" className="hover:text-primary-200">Stats</a>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  )
}
