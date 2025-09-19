import React from 'react'

const TextOptions = ({ textOptions, setTextOptions }) => {
  const handleTextOptionChange = (option, value) => {
    setTextOptions(prev => ({
      ...prev,
      [option]: value
    }))
  }

  const textAlignOptions = [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' }
  ]

  const fontWeightOptions = [
    { value: 'normal', label: 'Normal' },
    { value: 'medium', label: 'Medium' },
    { value: 'semibold', label: 'Semi Bold' },
    { value: 'bold', label: 'Bold' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Text Options
      </h2>
      
      <div className="space-y-4">
        {/* Enable/Disable Text */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="show-text"
            checked={textOptions.showText}
            onChange={(e) => handleTextOptionChange('showText', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="show-text" className="ml-2 block text-sm text-gray-700">
            Add text above/below QR code
          </label>
        </div>

        {textOptions.showText && (
          <>
            {/* Text Above */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Above QR Code (Optional)
              </label>
              <input
                type="text"
                value={textOptions.textAbove}
                onChange={(e) => handleTextOptionChange('textAbove', e.target.value)}
                placeholder="e.g., Scan to visit our website"
                className="input-field"
              />
            </div>

            {/* Text Below */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Below QR Code (Optional)
              </label>
              <input
                type="text"
                value={textOptions.textBelow}
                onChange={(e) => handleTextOptionChange('textBelow', e.target.value)}
                placeholder="e.g., Powered by CyberFuzz"
                className="input-field"
              />
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Size: {textOptions.fontSize}px
              </label>
              <input
                type="range"
                min="10"
                max="24"
                step="1"
                value={textOptions.fontSize}
                onChange={(e) => handleTextOptionChange('fontSize', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>10px</span>
                <span>24px</span>
              </div>
            </div>

            {/* Text Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={textOptions.textColor}
                  onChange={(e) => handleTextOptionChange('textColor', e.target.value)}
                  className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={textOptions.textColor}
                  onChange={(e) => handleTextOptionChange('textColor', e.target.value)}
                  className="input-field flex-1"
                  placeholder="#000000"
                />
              </div>
            </div>

            {/* Text Alignment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Alignment
              </label>
              <select
                value={textOptions.textAlign}
                onChange={(e) => handleTextOptionChange('textAlign', e.target.value)}
                className="input-field"
              >
                {textAlignOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Weight
              </label>
              <select
                value={textOptions.fontWeight}
                onChange={(e) => handleTextOptionChange('fontWeight', e.target.value)}
                className="input-field"
              >
                {fontWeightOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Preview Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Text will appear above and/or below the QR code without interfering with its scanning capability.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default TextOptions