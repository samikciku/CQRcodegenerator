import React, { useState } from 'react'
import { validateImageFile, compressImage, getImageDimensions } from '../utils/imageOptimization'

const LogoUploader = ({ logoFile, setLogoFile, logoOptions, setLogoOptions }) => {
  const [previewUrl, setPreviewUrl] = useState(null)

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      // Validate file
      validateImageFile(file)
      
      // Compress image for better performance
      const compressedFile = await compressImage(file, 800, 0.8)
      
      // Get image dimensions
      const dimensions = await getImageDimensions(file)
      
      setLogoFile(compressedFile)
      
      // Create preview URL
      const url = URL.createObjectURL(compressedFile)
      setPreviewUrl(url)
      
      console.log(`Image optimized: ${file.size} -> ${compressedFile.size} bytes`)
      console.log(`Dimensions: ${dimensions.width}x${dimensions.height}`)
    } catch (error) {
      alert(error.message)
    }
  }

  const handleRemoveLogo = () => {
    setLogoFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  const handleLogoOptionChange = (option, value) => {
    setLogoOptions(prev => ({
      ...prev,
      [option]: value
    }))
  }

  const positionOptions = [
    { value: 'center', label: 'Center' },
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-right', label: 'Bottom Right' }
  ]

  const shapeOptions = [
    { value: 'circle', label: 'Circle' },
    { value: 'square', label: 'Square' },
    { value: 'rounded', label: 'Rounded' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Logo Settings
      </h2>
      
      <div className="space-y-4">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Logo/Image
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="logo-upload"
            />
            <label
              htmlFor="logo-upload"
              className="btn-secondary cursor-pointer"
            >
              Choose Logo
            </label>
            {logoFile && (
              <button
                onClick={handleRemoveLogo}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            )}
          </div>
          {logoFile && (
            <p className="text-sm text-gray-600 mt-1">
              {logoFile.name} ({(logoFile.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>

        {/* Logo Preview */}
        {previewUrl && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div className="w-20 h-20 border border-gray-300 rounded-lg overflow-hidden">
              <img 
                src={previewUrl} 
                alt="Logo preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Logo Options */}
        {logoFile && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-medium text-gray-900">Logo Options</h3>
            
            {/* Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size: {Math.round(logoOptions.size * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="0.4"
                step="0.05"
                value={logoOptions.size}
                onChange={(e) => handleLogoOptionChange('size', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>10%</span>
                <span>40%</span>
              </div>
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <select
                value={logoOptions.position}
                onChange={(e) => handleLogoOptionChange('position', e.target.value)}
                className="input-field"
              >
                {positionOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Shape */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shape
              </label>
              <select
                value={logoOptions.shape}
                onChange={(e) => handleLogoOptionChange('shape', e.target.value)}
                className="input-field"
              >
                {shapeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Opacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opacity: {Math.round(logoOptions.opacity * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={logoOptions.opacity}
                onChange={(e) => handleLogoOptionChange('opacity', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Border */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Border Width: {logoOptions.borderWidth}px
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={logoOptions.borderWidth}
                onChange={(e) => handleLogoOptionChange('borderWidth', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {logoOptions.borderWidth > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Border Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={logoOptions.borderColor}
                    onChange={(e) => handleLogoOptionChange('borderColor', e.target.value)}
                    className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={logoOptions.borderColor}
                    onChange={(e) => handleLogoOptionChange('borderColor', e.target.value)}
                    className="input-field flex-1"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default LogoUploader