import React from 'react'

const BarcodeCustomizationPanel = ({ customization, setCustomization }) => {
  const handleChange = (option, value) => {
    setCustomization(prev => ({
      ...prev,
      [option]: value
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Barcode Customization
      </h2>
      
      <div className="space-y-4">
        {/* Width Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bar Width: {customization.width || 2}
          </label>
          <input
            type="range"
            min="1"
            max="5"
            step="0.5"
            value={customization.width || 2}
            onChange={(e) => handleChange('width', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1px</span>
            <span>5px</span>
          </div>
        </div>

        {/* Height Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Height: {customization.height || 100}px
          </label>
          <input
            type="range"
            min="50"
            max="300"
            step="10"
            value={customization.height || 100}
            onChange={(e) => handleChange('height', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>50px</span>
            <span>300px</span>
          </div>
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

