import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useDebounce, useQRCache, useOptimizedQRGeneration } from '../hooks/usePerformance'

const QRGenerator = ({ 
  qrData, 
  setQrData, 
  customization, 
  setQrCodeUrl,
  logoFile,
  logoOptions
}) => {
  const [qrType, setQrType] = useState('url')
  const [wifiData, setWifiData] = useState({
    ssid: '',
    password: '',
    security: 'WPA'
  })
  
  // Performance optimizations
  const { generateQR, isGenerating, generationTime } = useOptimizedQRGeneration()
  const { getCachedQR, setCachedQR, generateCacheKey } = useQRCache()
  const debouncedQrData = useDebounce(qrData, 300)

  // Generate WiFi QR code string
  const generateWifiQRString = (ssid, password, security) => {
    if (!ssid.trim()) return ''
    
    // Escape special characters in SSID and password for WiFi QR format
    const escapeWifiString = (str) => {
      return str.replace(/[\\;,":]/g, '\\$&')
    }
    
    const escapedSSID = escapeWifiString(ssid)
    const escapedPassword = escapeWifiString(password)
    
    // WiFi QR code format: WIFI:T:WPA;S:NetworkName;P:Password;H:false;;
    // For open networks (nopass), don't include password
    if (security === 'nopass') {
      return `WIFI:T:${security};S:${escapedSSID};H:false;;`
    }
    
    return `WIFI:T:${security};S:${escapedSSID};P:${escapedPassword};H:false;;`
  }

  // Reset QR data when switching QR types
  useEffect(() => {
    if (qrType !== 'wifi') {
      setQrData('')
    }
  }, [qrType])

  // Update QR data when WiFi fields change
  useEffect(() => {
    if (qrType === 'wifi') {
      const wifiQRString = generateWifiQRString(wifiData.ssid, wifiData.password, wifiData.security)
      setQrData(wifiQRString)
    }
  }, [wifiData, qrType])

  // Memoize cache key to prevent unnecessary recalculations
  const cacheKey = useMemo(() => {
    return generateCacheKey(debouncedQrData, customization, logoFile)
  }, [debouncedQrData, customization, logoFile, generateCacheKey])

  // Optimized QR generation with caching
  useEffect(() => {
    if (!debouncedQrData.trim()) {
      setQrCodeUrl('')
      return
    }

    // Check cache first
    const cachedResult = getCachedQR(cacheKey)
    if (cachedResult) {
      setQrCodeUrl(cachedResult)
      return
    }

    // Generate new QR code
    generateQR(debouncedQrData, customization, logoFile, logoOptions)
      .then(url => {
        if (url) {
          setQrCodeUrl(url)
          setCachedQR(cacheKey, url)
        }
      })
      .catch(error => console.error('Error generating QR code:', error))
  }, [debouncedQrData, customization, logoFile, logoOptions, cacheKey, generateQR, getCachedQR, setCachedQR])


  const qrTypeOptions = [
    { value: 'text', label: 'Text' },
    { value: 'url', label: 'URL' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'wifi', label: 'WiFi' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Generate QR Code
      </h2>
      
      <div className="space-y-4">
        {/* QR Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            QR Code Type
          </label>
          <select 
            value={qrType}
            onChange={(e) => setQrType(e.target.value)}
            className="input-field"
          >
            {qrTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Data Input */}
        {qrType === 'wifi' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Network Name (SSID)
              </label>
              <input
                type="text"
                value={wifiData.ssid}
                onChange={(e) => setWifiData(prev => ({ ...prev, ssid: e.target.value }))}
                placeholder="Enter WiFi network name"
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={wifiData.password}
                onChange={(e) => setWifiData(prev => ({ ...prev, password: e.target.value }))}
                placeholder={wifiData.security === 'nopass' ? 'Not needed for open networks' : 'Enter WiFi password'}
                disabled={wifiData.security === 'nopass'}
                className={`input-field ${wifiData.security === 'nopass' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              {wifiData.security === 'nopass' && (
                <p className="text-xs text-gray-500 mt-1">
                  Open networks don't require a password
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Security Type
              </label>
              <select
                value={wifiData.security}
                onChange={(e) => setWifiData(prev => ({ 
                  ...prev, 
                  security: e.target.value,
                  password: e.target.value === 'nopass' ? '' : prev.password
                }))}
                className="input-field"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No Password (Open)</option>
              </select>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {qrType === 'text' && 'Text Content'}
              {qrType === 'url' && 'URL'}
              {qrType === 'email' && 'Email Address'}
              {qrType === 'phone' && 'Phone Number'}
            </label>
            <textarea
              value={qrData}
              onChange={(e) => setQrData(e.target.value)}
              placeholder={
                qrType === 'text' ? 'Enter your text here...' :
                qrType === 'url' ? 'https://example.com' :
                qrType === 'email' ? 'user@example.com' :
                qrType === 'phone' ? '+1234567890' :
                ''
              }
              className="input-field h-24 resize-none"
              rows={3}
            />
          </div>
        )}

        {/* Generation Status */}
        {isGenerating && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-blue-700">Generating QR code...</span>
            </div>
          </div>
        )}

        {generationTime > 0 && !isGenerating && (
          <div className="mt-2 text-xs text-gray-500">
            Generated in {generationTime.toFixed(0)}ms
          </div>
        )}
      </div>
    </div>
  )
}

export default QRGenerator