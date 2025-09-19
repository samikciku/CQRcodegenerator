import QRCode from 'qrcode'

export const generateQRCode = async (text, customization, logoFile = null, logoOptions = {}) => {
  try {
    // Generate base QR code
    const qrCodeDataURL = await QRCode.toDataURL(text, {
      width: customization.size,
      margin: 2,
      color: {
        dark: customization.foregroundColor,
        light: customization.backgroundColor
      },
      errorCorrectionLevel: customization.errorLevel
    })

    // If no logo, return the base QR code
    if (!logoFile) {
      return qrCodeDataURL
    }

    // Embed logo if provided
    return await embedLogo(qrCodeDataURL, logoFile, customization.size, logoOptions)
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw error
  }
}

const embedLogo = (qrCodeDataURL, logoFile, qrSize, logoOptions = {}) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    // Set canvas size
    canvas.width = qrSize
    canvas.height = qrSize

    // Default logo options
    const options = {
      size: logoOptions.size || 0.2, // 20% of QR size
      position: logoOptions.position || 'center', // center, top-left, top-right, bottom-left, bottom-right
      shape: logoOptions.shape || 'circle', // circle, square, rounded
      borderWidth: logoOptions.borderWidth || 0,
      borderColor: logoOptions.borderColor || '#FFFFFF',
      opacity: logoOptions.opacity || 1.0
    }

    // Load QR code image
    const qrImage = new Image()
    qrImage.onload = () => {
      // Draw QR code
      ctx.drawImage(qrImage, 0, 0, qrSize, qrSize)
      
      // Load and embed logo
      const logoImage = new Image()
      logoImage.onload = () => {
        // Calculate logo size
        const logoSize = qrSize * options.size
        const margin = qrSize * 0.1 // 10% margin from edges
        
        // Calculate position based on options
        let x, y
        switch (options.position) {
          case 'top-left':
            x = margin
            y = margin
            break
          case 'top-right':
            x = qrSize - logoSize - margin
            y = margin
            break
          case 'bottom-left':
            x = margin
            y = qrSize - logoSize - margin
            break
          case 'bottom-right':
            x = qrSize - logoSize - margin
            y = qrSize - logoSize - margin
            break
          default: // center
            x = (qrSize - logoSize) / 2
            y = (qrSize - logoSize) / 2
        }
        
        // Set opacity
        ctx.globalAlpha = options.opacity
        
        // Draw border if specified
        if (options.borderWidth > 0) {
          ctx.save()
          ctx.strokeStyle = options.borderColor
          ctx.lineWidth = options.borderWidth
          
          if (options.shape === 'circle') {
            ctx.beginPath()
            ctx.arc(x + logoSize/2, y + logoSize/2, logoSize/2 + options.borderWidth/2, 0, 2 * Math.PI)
            ctx.stroke()
          } else {
            ctx.strokeRect(x - options.borderWidth/2, y - options.borderWidth/2, 
                          logoSize + options.borderWidth, logoSize + options.borderWidth)
          }
          ctx.restore()
        }
        
        // Create clipping path based on shape
        ctx.save()
        if (options.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(x + logoSize/2, y + logoSize/2, logoSize/2, 0, 2 * Math.PI)
          ctx.clip()
        } else if (options.shape === 'rounded') {
          const radius = logoSize * 0.1
          ctx.beginPath()
          ctx.roundRect(x, y, logoSize, logoSize, radius)
          ctx.clip()
        }
        // For square shape, no clipping needed
        
        // Draw logo
        ctx.drawImage(logoImage, x, y, logoSize, logoSize)
        ctx.restore()
        
        // Reset opacity
        ctx.globalAlpha = 1.0
        
        // Convert to data URL
        const result = canvas.toDataURL('image/png')
        resolve(result)
      }
      
      logoImage.onerror = () => {
        reject(new Error('Failed to load logo image'))
      }
      
      logoImage.src = URL.createObjectURL(logoFile)
    }
    
    qrImage.onerror = () => {
      reject(new Error('Failed to load QR code image'))
    }
    
    qrImage.src = qrCodeDataURL
  })
}