import React from 'react'

const CustomizationPanel = ({ customization, setCustomization }) => {
  const handleSizeChange = (e) => {
    setCustomization(prev => ({
      ...prev,
      size: parseInt(e.target.value)
    }))
  }

  const handleColorChange = (colorType, value) => {
    setCustomization(prev => ({
      ...prev,
      [colorType]: value
    }))
  }

  const handleErrorLevelChange = (e) => {
    setCustomization(prev => ({
      ...prev,
      errorLevel: e.target.value
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Customization
      </h2>
      
      <div className="space-y-4">
        {/* Size Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Size: {customization.size}px
          </label>
          <input
            type="range"
            min="100"
            max="1000"
            value={customization.size}
            onChange={handleSizeChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>100px</span>
            <span>1000px</span>
          </div>
        </div>

        {/* Color Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foreground Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={customization.foregroundColor}
                onChange={(e) => handleColorChange('foregroundColor', e.target.value)}
                className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={customization.foregroundColor}
                onChange={(e) => handleColorChange('foregroundColor', e.target.value)}
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
                value={customization.backgroundColor}
                onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={customization.backgroundColor}
                onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                className="input-field flex-1"
                placeholder="#FFFFFF"
              />
            </div>
          </div>
        </div>

        {/* Error Correction Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Error Correction Level
          </label>
          <select
            value={customization.errorLevel}
            onChange={handleErrorLevelChange}
            className="input-field"
          >
            <option value="L">Low (7%)</option>
            <option value="M">Medium (15%)</option>
            <option value="Q">Quartile (25%)</option>
            <option value="H">High (30%)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Higher levels allow more damage before the QR code becomes unreadable
          </p>
        </div>
      </div>
    </div>
  )
}

export default CustomizationPanel