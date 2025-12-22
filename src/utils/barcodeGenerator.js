import JsBarcode from 'jsbarcode'

/**
 * Generate a barcode as a data URL
 * @param {string} text - The text to encode in the barcode
 * @param {string} format - The barcode format (CODE128, EAN13, UPC, etc.)
 * @param {object} customization - Barcode customization options
 * @returns {Promise<string>} - Data URL of the generated barcode
 */
export const generateBarcode = async (text, format, customization = {}) => {
  try {
    // Validate input
    if (!text || !text.trim()) {
      throw new Error('Barcode text cannot be empty')
    }

    // Create a canvas element
    const canvas = document.createElement('canvas')
    
    // Set canvas dimensions (JsBarcode will adjust, but we need initial size)
    canvas.width = 400
    canvas.height = customization.height || 100
    
    // Default customization options
    const options = {
      format: format,
      width: customization.width || 2,
      height: customization.height || 100,
      displayValue: customization.displayValue !== false, // Show text by default
      fontSize: customization.fontSize || 20,
      textAlign: customization.textAlign || 'center',
      textPosition: customization.textPosition || 'bottom',
      textMargin: customization.textMargin || 2,
      background: customization.backgroundColor || '#FFFFFF',
      lineColor: customization.foregroundColor || '#000000',
      margin: customization.margin !== undefined ? customization.margin : 10,
      marginTop: customization.marginTop,
      marginBottom: customization.marginBottom,
      marginLeft: customization.marginLeft,
      marginRight: customization.marginRight,
      valid: (valid) => {
        if (!valid) {
          throw new Error(`Invalid barcode data for format ${format}`)
        }
      }
    }

    // Format-specific options
    if (format === 'EAN13' || format === 'EAN8' || format === 'UPC') {
      // EAN/UPC codes require specific lengths
      options.flat = true // Flat barcode style
    }

    if (format === 'CODE128') {
      // CODE128 supports full ASCII
      options.flat = customization.flat || false
    }

    // Generate barcode
    JsBarcode(canvas, text, options)

    // Convert canvas to data URL
    return canvas.toDataURL('image/png')
  } catch (error) {
    console.error('Error generating barcode:', error)
    throw error
  }
}

/**
 * Validate barcode data for a specific format
 * @param {string} text - The text to validate
 * @param {string} format - The barcode format
 * @returns {object} - { valid: boolean, message: string }
 */
export const validateBarcodeData = (text, format) => {
  if (!text || !text.trim()) {
    return { valid: false, message: 'Barcode text cannot be empty' }
  }

  const trimmedText = text.trim()

  switch (format) {
    case 'EAN13':
      if (!/^\d{13}$/.test(trimmedText)) {
        return { valid: false, message: 'EAN-13 requires exactly 13 digits' }
      }
      break
    case 'EAN8':
      if (!/^\d{8}$/.test(trimmedText)) {
        return { valid: false, message: 'EAN-8 requires exactly 8 digits' }
      }
      break
    case 'UPC':
      if (!/^\d{12}$/.test(trimmedText)) {
        return { valid: false, message: 'UPC-A requires exactly 12 digits' }
      }
      break
    case 'CODE39':
      if (!/^[A-Z0-9\s\-\.\$\/\+\%]+$/.test(trimmedText)) {
        return { valid: false, message: 'CODE39 only supports uppercase letters, numbers, and specific symbols' }
      }
      break
    case 'ITF14':
      if (!/^\d{14}$/.test(trimmedText)) {
        return { valid: false, message: 'ITF-14 requires exactly 14 digits' }
      }
      break
    case 'MSI':
      if (!/^\d+$/.test(trimmedText)) {
        return { valid: false, message: 'MSI only supports digits' }
      }
      break
    case 'pharmacode':
      if (!/^\d+$/.test(trimmedText) || parseInt(trimmedText) < 1 || parseInt(trimmedText) > 131070) {
        return { valid: false, message: 'Pharmacode must be a number between 1 and 131070' }
      }
      break
    // CODE128, CODE93, CODE11, and others are more flexible
    default:
      if (trimmedText.length === 0) {
        return { valid: false, message: 'Barcode text cannot be empty' }
      }
  }

  return { valid: true, message: 'Valid' }
}

/**
 * Get available barcode formats with descriptions
 * @returns {Array} - Array of format objects
 */
export const getBarcodeFormats = () => {
  return [
    { value: 'CODE128', label: 'CODE128', description: 'Full ASCII support, most common' },
    { value: 'CODE128A', label: 'CODE128 A', description: 'Uppercase letters and control codes' },
    { value: 'CODE128B', label: 'CODE128 B', description: 'Upper and lowercase letters' },
    { value: 'CODE128C', label: 'CODE128 C', description: 'Numeric data only' },
    { value: 'EAN13', label: 'EAN-13', description: '13-digit product codes' },
    { value: 'EAN8', label: 'EAN-8', description: '8-digit product codes' },
    { value: 'UPC', label: 'UPC-A', description: '12-digit product codes' },
    { value: 'CODE39', label: 'CODE39', description: 'Alphanumeric, uppercase' },
    { value: 'ITF14', label: 'ITF-14', description: '14-digit shipping codes' },
    { value: 'MSI', label: 'MSI', description: 'Numeric, used in libraries' },
    { value: 'pharmacode', label: 'Pharmacode', description: 'Pharmaceutical packaging' },
    { value: 'codabar', label: 'Codabar', description: 'Used in libraries and blood banks' },
    { value: 'CODE11', label: 'CODE11', description: 'Numeric with dash' },
    { value: 'CODE93', label: 'CODE93', description: 'Extended CODE39' }
  ]
}

