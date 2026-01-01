import React, { useState } from 'react'

const LabelPrintOptions = ({ labelOptions, setLabelOptions }) => {
  const handleOptionChange = (option, value) => {
    setLabelOptions(prev => ({
      ...prev,
      [option]: value
    }))
  }

  // Common label size presets (in mm)
  const labelPresets = [
    { name: 'Custom', width: 0, height: 0 },
    { name: '1" x 2" (25.4 x 50.8mm)', width: 25.4, height: 50.8 },
    { name: '1.5" x 1" (38.1 x 25.4mm)', width: 38.1, height: 25.4 },
    { name: '2" x 1" (50.8 x 25.4mm)', width: 50.8, height: 25.4 },
    { name: '2" x 2" (50.8 x 50.8mm)', width: 50.8, height: 50.8 },
    { name: '2" x 3" (50.8 x 76.2mm)', width: 50.8, height: 76.2 },
    { name: '2" x 4" (50.8 x 101.6mm)', width: 50.8, height: 101.6 },
    { name: '3" x 1" (76.2 x 25.4mm)', width: 76.2, height: 25.4 },
    { name: '3" x 2" (76.2 x 50.8mm)', width: 76.2, height: 50.8 },
    { name: '4" x 2" (101.6 x 50.8mm)', width: 101.6, height: 50.8 },
    { name: '4" x 3" (101.6 x 76.2mm)', width: 101.6, height: 76.2 },
    { name: '4" x 6" (101.6 x 152.4mm)', width: 101.6, height: 152.4 },
    { name: 'A4 Sheet (210 x 297mm)', width: 210, height: 297 }
  ]

  const handlePresetChange = (e) => {
    const preset = labelPresets.find(p => p.name === e.target.value)
    if (preset && preset.width > 0) {
      handleOptionChange('width', preset.width)
      handleOptionChange('height', preset.height)
    }
  }

  const selectedPreset = labelPresets.find(p => 
    Math.abs(p.width - labelOptions.width) < 0.1 && 
    Math.abs(p.height - labelOptions.height) < 0.1
  )?.name || 'Custom'

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Label Printing Options
      </h2>
      
      <div className="space-y-4">
        {/* Label Size Preset */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Label Size Preset
          </label>
          <select
            value={selectedPreset}
            onChange={handlePresetChange}
            className="input-field"
          >
            {labelPresets.map(preset => (
              <option key={preset.name} value={preset.name}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>

        {/* Label Dimensions */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Label Width (mm)
            </label>
            <input
              type="number"
              min="10"
              max="300"
              step="0.1"
              value={labelOptions.width}
              onChange={(e) => handleOptionChange('width', parseFloat(e.target.value) || 0)}
              className="input-field"
              placeholder="50.8"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Label Height (mm)
            </label>
            <input
              type="number"
              min="10"
              max="300"
              step="0.1"
              value={labelOptions.height}
              onChange={(e) => handleOptionChange('height', parseFloat(e.target.value) || 0)}
              className="input-field"
              placeholder="25.4"
            />
          </div>
        </div>

        {/* Orientation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Orientation
          </label>
          <select
            value={labelOptions.orientation}
            onChange={(e) => handleOptionChange('orientation', e.target.value)}
            className="input-field"
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>

        {/* Margins */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Top Margin (mm)
            </label>
            <input
              type="number"
              min="0"
              max="50"
              step="0.5"
              value={labelOptions.marginTop}
              onChange={(e) => handleOptionChange('marginTop', parseFloat(e.target.value) || 0)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Left Margin (mm)
            </label>
            <input
              type="number"
              min="0"
              max="50"
              step="0.5"
              value={labelOptions.marginLeft}
              onChange={(e) => handleOptionChange('marginLeft', parseFloat(e.target.value) || 0)}
              className="input-field"
            />
          </div>
        </div>

        {/* Barcode Position */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Barcode X Position (mm)
            </label>
            <input
              type="number"
              min="0"
              max="200"
              step="0.5"
              value={labelOptions.barcodeX}
              onChange={(e) => handleOptionChange('barcodeX', parseFloat(e.target.value) || 0)}
              className="input-field"
            />
            <p className="text-xs text-gray-500 mt-1">Horizontal position from left</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Barcode Y Position (mm)
            </label>
            <input
              type="number"
              min="0"
              max="200"
              step="0.5"
              value={labelOptions.barcodeY}
              onChange={(e) => handleOptionChange('barcodeY', parseFloat(e.target.value) || 0)}
              className="input-field"
            />
            <p className="text-xs text-gray-500 mt-1">Vertical position from top</p>
          </div>
        </div>

        {/* Barcode Size on Label */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Barcode Width (mm)
            </label>
            <input
              type="number"
              min="5"
              max="100"
              step="0.5"
              value={labelOptions.barcodeWidth}
              onChange={(e) => handleOptionChange('barcodeWidth', parseFloat(e.target.value) || 0)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Barcode Height (mm)
            </label>
            <input
              type="number"
              min="5"
              max="100"
              step="0.5"
              value={labelOptions.barcodeHeight}
              onChange={(e) => handleOptionChange('barcodeHeight', parseFloat(e.target.value) || 0)}
              className="input-field"
            />
          </div>
        </div>

        {/* Number of Labels */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Labels
          </label>
          <input
            type="number"
            min="1"
            max="100"
            step="1"
            value={labelOptions.quantity}
            onChange={(e) => handleOptionChange('quantity', parseInt(e.target.value) || 1)}
            className="input-field"
          />
          <p className="text-xs text-gray-500 mt-1">How many labels to print</p>
        </div>

        {/* DPI Setting */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Printer DPI
          </label>
          <select
            value={labelOptions.dpi}
            onChange={(e) => handleOptionChange('dpi', parseInt(e.target.value))}
            className="input-field"
          >
            <option value="203">203 DPI (Standard thermal)</option>
            <option value="300">300 DPI (High resolution)</option>
            <option value="600">600 DPI (Very high resolution)</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default LabelPrintOptions



