import { useState, useEffect, useCallback, useMemo } from 'react'

// Hook for debouncing expensive operations
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Hook for throttling function calls
export const useThrottle = (callback, delay) => {
  const [lastCall, setLastCall] = useState(0)

  return useCallback((...args) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      setLastCall(now)
      return callback(...args)
    }
  }, [callback, delay, lastCall])
}

// Hook for performance monitoring
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    isSlowConnection: false
  })

  useEffect(() => {
    // Monitor render performance
    const measureRenderTime = () => {
      const start = performance.now()
      requestAnimationFrame(() => {
        const end = performance.now()
        setMetrics(prev => ({
          ...prev,
          renderTime: end - start
        }))
      })
    }

    // Monitor memory usage (if available)
    const measureMemory = () => {
      if ('memory' in performance) {
        setMetrics(prev => ({
          ...prev,
          memoryUsage: performance.memory.usedJSHeapSize / 1024 / 1024 // MB
        }))
      }
    }

    // Check connection speed
    const checkConnection = () => {
      if ('connection' in navigator) {
        const connection = navigator.connection
        setMetrics(prev => ({
          ...prev,
          isSlowConnection: connection.effectiveType === 'slow-2g' || 
                          connection.effectiveType === '2g' ||
                          connection.effectiveType === '3g'
        }))
      }
    }

    measureRenderTime()
    measureMemory()
    checkConnection()

    // Set up periodic monitoring
    const interval = setInterval(() => {
      measureMemory()
      checkConnection()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return metrics
}

// Hook for lazy loading images
export const useLazyImage = (src, placeholder) => {
  const [imageSrc, setImageSrc] = useState(placeholder)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (!src) return

    const img = new Image()
    
    img.onload = () => {
      setImageSrc(src)
      setIsLoaded(true)
      setIsError(false)
    }
    
    img.onerror = () => {
      setIsError(true)
      setIsLoaded(false)
    }
    
    img.src = src
  }, [src])

  return { imageSrc, isLoaded, isError }
}

// Hook for optimizing QR code generation
export const useOptimizedQRGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationTime, setGenerationTime] = useState(0)

  const generateQR = useCallback(async (text, customization, logoFile, logoOptions) => {
    if (!text.trim()) return null

    setIsGenerating(true)
    const startTime = performance.now()

    try {
      // Import QR generator dynamically to reduce initial bundle size
      const { generateQRCode } = await import('../utils/qrGenerator')
      const result = await generateQRCode(text, customization, logoFile, logoOptions)
      
      const endTime = performance.now()
      setGenerationTime(endTime - startTime)
      
      return result
    } catch (error) {
      console.error('QR generation error:', error)
      throw error
    } finally {
      setIsGenerating(false)
    }
  }, [])

  return { generateQR, isGenerating, generationTime }
}

// Hook for caching QR codes
export const useQRCache = () => {
  const [cache, setCache] = useState(new Map())

  const getCachedQR = useCallback((key) => {
    return cache.get(key)
  }, [cache])

  const setCachedQR = useCallback((key, value) => {
    setCache(prev => {
      const newCache = new Map(prev)
      newCache.set(key, value)
      
      // Limit cache size to prevent memory issues
      if (newCache.size > 50) {
        const firstKey = newCache.keys().next().value
        newCache.delete(firstKey)
      }
      
      return newCache
    })
  }, [])

  const generateCacheKey = useCallback((text, customization, logoFile) => {
    const logoKey = logoFile ? `${logoFile.name}-${logoFile.size}-${logoFile.lastModified}` : 'no-logo'
    return `${text}-${JSON.stringify(customization)}-${logoKey}`
  }, [])

  return { getCachedQR, setCachedQR, generateCacheKey }
}