import React, { useState, useEffect } from 'react'

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showIndicator, setShowIndicator] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowIndicator(true)
      // Hide indicator after 3 seconds when coming back online
      setTimeout(() => setShowIndicator(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowIndicator(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!showIndicator) {
    return null
  }

  return (
    <div className={`fixed top-4 left-4 right-4 z-50 rounded-lg shadow-lg p-3 transition-all duration-300 ${
      isOnline 
        ? 'bg-green-100 border border-green-200 text-green-800' 
        : 'bg-red-100 border border-red-200 text-red-800'
    }`}>
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${
          isOnline ? 'bg-green-500' : 'bg-red-500'
        }`}></div>
        <span className="text-sm font-medium">
          {isOnline ? 'Back online' : 'You are offline'}
        </span>
        {!isOnline && (
          <span className="text-xs text-red-600">
            - Some features may be limited
          </span>
        )}
      </div>
    </div>
  )
}

export default OfflineIndicator