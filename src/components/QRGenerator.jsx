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
  const [qrType, setQrType] = useState('text')
  
  // Specific input fields for different QR types
  const [textInput, setTextInput] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [phoneInput, setPhoneInput] = useState('')
  const [wifiSSID, setWifiSSID] = useState('')
  const [wifiPassword, setWifiPassword] = useState('')
  const [wifiSecurity, setWifiSecurity] = useState('WPA')
  const [wifiHidden, setWifiHidden] = useState(false)
  
  // Performance optimizations
  const { generateQR, isGenerating, generationTime } = useOptimizedQRGeneration()
  const { getCachedQR, setCachedQR, generateCacheKey } = useQRCache()
  const debouncedQrData = useDebounce(qrData, 300)

  // Memoize cache key to prevent unnecessary recalculations
  const cacheKey = useMemo(() => {
    return generateCacheKey(debouncedQrData, customization, logoFile)
  }, [debouncedQrData, customization, logoFile, generateCacheKey])

  // Generate QR data based on type and inputs
  const generateQRData = useCallback(() => {
    switch (qrType) {
      case 'text':
        return textInput
      case 'url':
        return urlInput.startsWith('http') ? urlInput : `https://${urlInput}`
      case 'email':
        let emailData = `mailto:${emailInput}`
        const params = []
        if (emailSubject) params.push(`subject=${encodeURIComponent(emailSubject)}`)
        if (emailBody) params.push(`body=${encodeURIComponent(emailBody)}`)
        if (params.length > 0) emailData += `?${params.join('&')}`
        return emailData
      case 'phone':
        return `tel:${phoneInput}`
      case 'wifi':
        const wifiData = {
          ssid: wifiSSID,
          password: wifiPassword,
          security: wifiSecurity,
          hidden: wifiHidden
        }
        return `WIFI:T:${wifiData.security};S:${wifiData.ssid};P:${wifiData.password};H:${wifiData.hidden};;`
      default:
        return ''
    }
  }, [qrType, textInput, urlInput, emailInput, emailSubject, emailBody, phoneInput, wifiSSID, wifiPassword, wifiSecurity, wifiHidden])

  // Update QR data when inputs change
  useEffect(() => {
    const newQrData = generateQRData()
    setQrData(newQrData)
  }, [generateQRData, setQrData])

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

  const wifiSecurityOptions = [
    { value: 'WPA', label: 'WPA' },
    { value: 'WPA2', label: 'WPA2' },
    { value: 'WEP', label: 'WEP' },
    { value: 'nopass', label: 'No Password' }
  ]

  const renderInputFields = () => {
    switch (qrType) {
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Content
              </label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter your text here..."
                className="input-field h-24 resize-none"
                rows={3}
              />
            </div>
          </div>
        )

      case 'url':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com or example.com"
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">
                Include https:// or we'll add it automatically
              </p>
            </div>
          </div>
        )

      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="user@example.com"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject (Optional)
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email subject line"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Email message body"
                className="input-field h-20 resize-none"
                rows={2}
              />
            </div>
          </div>
        )

      case 'phone':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="+1234567890 or (123) 456-7890"
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">
                Include country code for international numbers
              </p>
            </div>
          </div>
        )

      case 'wifi':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Network Name (SSID)
              </label>
              <input
                type="text"
                value={wifiSSID}
                onChange={(e) => setWifiSSID(e.target.value)}
                placeholder="MyWiFiNetwork"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                placeholder="WiFi password"
                className="input-field"
                disabled={wifiSecurity === 'nopass'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Security Type
              </label>
              <select
                value={wifiSecurity}
                onChange={(e) => setWifiSecurity(e.target.value)}
                className="input-field"
              >
                {wifiSecurityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="wifi-hidden"
                checked={wifiHidden}
                onChange={(e) => setWifiHidden(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="wifi-hidden" className="ml-2 block text-sm text-gray-700">
                Hidden Network
              </label>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> When someone scans this QR code, their device will automatically connect to your WiFi network.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

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

        {/* Dynamic Input Fields */}
        {renderInputFields()}

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