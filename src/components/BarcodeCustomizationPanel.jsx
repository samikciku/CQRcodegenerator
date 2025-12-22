import React from 'react'

const BarcodeCustomizationPanel = ({ customization, setCustomization }) => {
  const handleChange = (option, value) => {
    setCustomization(prev => ({
      ...prev,
      [option]: value
    }))
  }

  // Conversion: 1mm = 3.7795 pixels at 96 DPI (standard screen)
  // For printing: 1mm = 7.992 pixels at 203 DPI (common barcode printer)
  // Using 203 DPI for better print accuracy
  const MM_TO_PX = 7.992 // 203 DPI / 25.4mm per inch
  const PX_TO_MM = 1 / MM_TO_PX

  // Convert mm to px for width (bar width in mm)
  const widthInMm = customization.widthMm !== undefined ? customization.widthMm : (customization.width || 2) * PX_TO_MM
  const heightInMm = customization.heightMm !== undefined ? customization.heightMm : (customization.height || 100) * PX_TO_MM

  const handleWidthChange = (value, isMm) => {
    if (isMm) {
      handleChange('widthMm', parseFloat(value))
      handleChange('width', value * MM_TO_PX)
    } else {
      handleChange('width', parseFloat(value))
      handleChange('widthMm', value * PX_TO_MM)
    }
  }

  const handleHeightChange = (value, isMm) => {
    if (isMm) {
      handleChange('heightMm', parseFloat(value))
      handleChange('height', value * MM_TO_PX)
    } else {
      handleChange('height', parseInt(value))
      handleChange('heightMm', value * PX_TO_MM)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Barcode Customization
      </h2>
      
      <div className="space-y-4">
        {/* Width Control */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Bar Width
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0.1"
                max="5"
                step="0.1"
                value={widthInMm.toFixed(2)}
                onChange={(e) => handleWidthChange(e.target.value, true)}
                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="mm"
              />
              <span className="text-xs text-gray-500">mm</span>
            </div>
          </div>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={widthInMm}
            onChange={(e) => handleWidthChange(e.target.value, true)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.1mm</span>
            <span>5mm</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            ≈ {(widthInMm * MM_TO_PX).toFixed(1)}px at 203 DPI (print resolution)
          </p>
        </div>

        {/* Height Control */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Height
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="5"
                max="100"
                step="1"
                value={Math.round(heightInMm)}
                onChange={(e) => handleHeightChange(e.target.value, true)}
                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="mm"
              />
              <span className="text-xs text-gray-500">mm</span>
            </div>
          </div>
          <input
            type="range"
            min="5"
            max="100"
            step="1"
            value={Math.round(heightInMm)}
            onChange={(e) => handleHeightChange(e.target.value, true)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>5mm</span>
            <span>100mm</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            ≈ {Math.round(heightInMm * MM_TO_PX)}px at 203 DPI (print resolution)
          </p>
        </div>

        {/* Color Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bar Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={customization.foregroundColor || '#000000'}
                onChange={(e) => handleChange('foregroundColor', e.target.value)}
                className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={customization.foregroundColor || '#000000'}
                onChange={(e) => handleChange('foregroundColor', e.target.value)}
                className="input-field flex-1"
                placeholder="#000000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={customization.backgroundColor || '#FFFFFF'}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={customization.backgroundColor || '#FFFFFF'}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                className="input-field flex-1"
                placeholder="#FFFFFF"
              />
            </div>
          </div>
        </div>

        {/* Display Value Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="display-value"
            checked={customization.displayValue !== false}
            onChange={(e) => handleChange('displayValue', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="display-value" className="ml-2 block text-sm text-gray-700">
            Show text below barcode
          </label>
        </div>

        {/* Text Options (shown when displayValue is true) */}
        {customization.displayValue !== false && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Size: {customization.fontSize || 20}px
              </label>
              <input
                type="range"
                min="10"
                max="40"
                step="2"
                value={customization.fontSize || 20}
                onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>10px</span>
                <span>40px</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Position
              </label>
              <select
                value={customization.textPosition || 'bottom'}
                onChange={(e) => handleChange('textPosition', e.target.value)}
                className="input-field"
              >
                <option value="bottom">Below</option>
                <option value="top">Above</option>
              </select>
            </div>
          </>
        )}

        {/* Margin Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Margin: {customization.margin !== undefined ? customization.margin : 10}px
          </label>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={customization.margin !== undefined ? customization.margin : 10}
            onChange={(e) => handleChange('margin', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0px</span>
            <span>50px</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BarcodeCustomizationPanel

