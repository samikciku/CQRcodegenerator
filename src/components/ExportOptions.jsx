import React, { useState } from 'react'
import { exportQRCode } from '../utils/exportUtils'

const ExportOptions = ({ qrCodeUrl, qrData }) => {
  const [exportOptions, setExportOptions] = useState({
    quality: 0.9,
    dpi: 300,
    filename: ''
  })
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format) => {
    if (!qrCodeUrl) {
      alert('Please generate a QR code first')
      return
    }

    setIsExporting(true)
    try {
      const filename = exportOptions.filename || 
        (qrData ? 
          `qr-code-${qrData.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '-')}` : 
          'qr-code')
      
      await exportQRCode(qrCodeUrl, format, filename, exportOptions)
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export QR code. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleOptionChange = (option, value) => {
    setExportOptions(prev => ({
      ...prev,
      [option]: value
    }))
  }

  const exportFormats = [
    { format: 'png', label: 'PNG', description: 'High quality image' },
    { format: 'jpg', label: 'JPG', description: 'Compressed image' },
    { format: 'pdf', label: 'PDF', description: 'Vector format' },
    { format: 'svg', label: 'SVG', description: 'Scalable vector' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Export Options
      </h2>
      
      {/* Export Settings */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Filename (Optional)
          </label>
          <input
            type="text"
            value={exportOptions.filename}
            onChange={(e) => handleOptionChange('filename', e.target.value)}
            placeholder="Enter custom filename..."
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quality: {Math.round(exportOptions.quality * 100)}%
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={exportOptions.quality}
            onChange={(e) => handleOptionChange('quality', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>10%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        {exportFormats.map(({ format, label, description }) => (
          <button
            key={format}
            onClick={() => handleExport(format)}
            disabled={!qrCodeUrl || isExporting}
            className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <div className="text-left">
              <div className="font-medium text-gray-900">{label}</div>
              <div className="text-sm text-gray-500">{description}</div>
            </div>
            {isExporting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
          </button>
        ))}
      </div>

      {!qrCodeUrl && (
        <p className="text-sm text-gray-500 text-center mt-4">
          Generate a QR code to enable export options
        </p>
      )}

      {isExporting && (
        <p className="text-sm text-primary-600 text-center mt-4">
          Exporting... Please wait
        </p>
      )}
    </div>
  )
}

export default ExportOptions