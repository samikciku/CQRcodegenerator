import React, { useState, useEffect, useCallback } from 'react'
import { generateBarcode, validateBarcodeData, getBarcodeFormats } from '../utils/barcodeGenerator'

const BarcodeGenerator = ({ 
  barcodeData, 
  setBarcodeData, 
  barcodeFormat,
  setBarcodeFormat,
  customization, 
  setBarcodeUrl
}) => {
  const [validation, setValidation] = useState({ valid: true, message: '' })
  const [isGenerating, setIsGenerating] = useState(false)
  
  const formats = getBarcodeFormats()

  // Validate barcode data when it changes
  useEffect(() => {
    if (barcodeData && barcodeFormat) {
      const validationResult = validateBarcodeData(barcodeData, barcodeFormat)
      setValidation(validationResult)
    } else {
      setValidation({ valid: true, message: '' })
    }
  }, [barcodeData, barcodeFormat])

  // Generate barcode when data or format changes
  useEffect(() => {
    if (!barcodeData || !barcodeData.trim() || !validation.valid) {
      setBarcodeUrl('')
      return
    }

    setIsGenerating(true)
    generateBarcode(barcodeData.trim(), barcodeFormat, customization)
      .then(url => {
        setBarcodeUrl(url)
        setIsGenerating(false)
      })
      .catch(error => {
        console.error('Error generating barcode:', error)
        setValidation({ valid: false, message: error.message || 'Failed to generate barcode' })
        setIsGenerating(false)
        setBarcodeUrl('')
      })
  }, [barcodeData, barcodeFormat, customization, validation.valid, setBarcodeUrl])

  const handleFormatChange = (e) => {
    setBarcodeFormat(e.target.value)
  }

  const handleDataChange = (e) => {
    setBarcodeData(e.target.value)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Generate Barcode
      </h2>
      
      <div className="space-y-4">
        {/* Barcode Format Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Barcode Format
          </label>
          <select 
            value={barcodeFormat}
            onChange={handleFormatChange}
            className="input-field"
          >
            {formats.map(format => (
              <option key={format.value} value={format.value}>
                {format.label} - {format.description}
              </option>
            ))}
          </select>
          {barcodeFormat && (
            <p className="text-xs text-gray-500 mt-1">
              {formats.find(f => f.value === barcodeFormat)?.description}
            </p>
          )}
        </div>

        {/* Data Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Barcode Data
          </label>
          <textarea
            value={barcodeData}
            onChange={handleDataChange}
            placeholder="Enter barcode data..."
            className={`input-field h-24 resize-none ${!validation.valid ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            rows={3}
          />
          {!validation.valid && (
            <p className="text-sm text-red-600 mt-1">
              {validation.message}
            </p>
          )}
          {validation.valid && barcodeData && (
            <p className="text-sm text-green-600 mt-1">
              ✓ Valid barcode data
            </p>
          )}
        </div>

        {/* Format-specific hints */}
        {(barcodeFormat === 'EAN13' || barcodeFormat === 'EAN8' || barcodeFormat === 'UPC') && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> {barcodeFormat === 'EAN13' && 'EAN-13 requires exactly 13 digits'}
              {barcodeFormat === 'EAN8' && 'EAN-8 requires exactly 8 digits'}
              {barcodeFormat === 'UPC' && 'UPC-A requires exactly 12 digits'}
            </p>
          </div>
        )}

        {/* Generation Status */}
        {isGenerating && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-blue-700">Generating barcode...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BarcodeGenerator



