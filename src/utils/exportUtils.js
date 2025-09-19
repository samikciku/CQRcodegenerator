import jsPDF from 'jspdf'
import { saveAs } from 'file-saver'

export const exportQRCode = async (qrCodeDataURL, format, filename, options = {}) => {
  const exportOptions = {
    quality: options.quality || 0.9,
    dpi: options.dpi || 300,
    ...options
  }

  switch (format.toLowerCase()) {
    case 'png':
      await exportAsPNG(qrCodeDataURL, filename, exportOptions)
      break
    case 'jpg':
    case 'jpeg':
      await exportAsJPG(qrCodeDataURL, filename, exportOptions)
      break
    case 'pdf':
      await exportAsPDF(qrCodeDataURL, filename, exportOptions)
      break
    case 'svg':
      await exportAsSVG(qrCodeDataURL, filename, exportOptions)
      break
    default:
      throw new Error(`Unsupported format: ${format}`)
  }
}

const exportAsPNG = async (qrCodeDataURL, filename, options) => {
  const link = document.createElement('a')
  link.download = `${filename}.png`
  link.href = qrCodeDataURL
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const exportAsJPG = async (qrCodeDataURL, filename, options) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = new Image()
  
  return new Promise((resolve, reject) => {
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      
      // Fill with white background for JPG
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw QR code
      ctx.drawImage(img, 0, 0)
      
      // Convert to JPG and download
      canvas.toBlob((blob) => {
        saveAs(blob, `${filename}.jpg`)
        resolve()
      }, 'image/jpeg', options.quality)
    }
    
    img.onerror = reject
    img.src = qrCodeDataURL
  })
}

const exportAsPDF = async (qrCodeDataURL, filename, options) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })
  
  const img = new Image()
  
  return new Promise((resolve, reject) => {
    img.onload = () => {
      // Calculate dimensions to fit on A4 page
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 20
      const maxWidth = pageWidth - (margin * 2)
      const maxHeight = pageHeight - (margin * 2)
      
      let imgWidth = img.width
      let imgHeight = img.height
      
      // Scale image to fit page
      if (imgWidth > maxWidth || imgHeight > maxHeight) {
        const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight)
        imgWidth *= scale
        imgHeight *= scale
      }
      
      // Center image on page
      const x = (pageWidth - imgWidth) / 2
      const y = (pageHeight - imgHeight) / 2
      
      pdf.addImage(img, 'PNG', x, y, imgWidth, imgHeight)
      pdf.save(`${filename}.pdf`)
      resolve()
    }
    
    img.onerror = reject
    img.src = qrCodeDataURL
  })
}

const exportAsSVG = async (qrCodeDataURL, filename, options) => {
  const img = new Image()
  
  return new Promise((resolve, reject) => {
    img.onload = () => {
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${img.width}" height="${img.height}">
          <image href="${qrCodeDataURL}" width="${img.width}" height="${img.height}"/>
        </svg>
      `
      
      const blob = new Blob([svg], { type: 'image/svg+xml' })
      saveAs(blob, `${filename}.svg`)
      resolve()
    }
    
    img.onerror = reject
    img.src = qrCodeDataURL
  })
}