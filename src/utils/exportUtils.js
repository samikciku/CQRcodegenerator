import jsPDF from 'jspdf'
import { saveAs } from 'file-saver'

export const exportQRCode = async (qrCodeDataURL, format, filename, options = {}) => {
  return exportCode(qrCodeDataURL, format, filename, options)
}

export const exportBarcode = async (barcodeDataURL, format, filename, options = {}) => {
  return exportCode(barcodeDataURL, format, filename, options)
}

const exportCode = async (codeDataURL, format, filename, options = {}) => {
  const exportOptions = {
    quality: options.quality || 0.9,
    dpi: options.dpi || 300,
    ...options
  }

  switch (format.toLowerCase()) {
    case 'png':
      await exportAsPNG(codeDataURL, filename, exportOptions)
      break
    case 'jpg':
    case 'jpeg':
      await exportAsJPG(codeDataURL, filename, exportOptions)
      break
    case 'pdf':
      await exportAsPDF(codeDataURL, filename, exportOptions)
      break
    case 'svg':
      await exportAsSVG(codeDataURL, filename, exportOptions)
      break
    default:
      throw new Error(`Unsupported format: ${format}`)
  }
}

const exportAsPNG = async (codeDataURL, filename, options) => {
  const link = document.createElement('a')
  link.download = `${filename}.png`
  link.href = codeDataURL
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const exportAsJPG = async (codeDataURL, filename, options) => {
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
      
      // Draw code
      ctx.drawImage(img, 0, 0)
      
      // Convert to JPG and download
      canvas.toBlob((blob) => {
        saveAs(blob, `${filename}.jpg`)
        resolve()
      }, 'image/jpeg', options.quality)
    }
    
    img.onerror = reject
    img.src = codeDataURL
  })
}

const exportAsPDF = async (codeDataURL, filename, options) => {
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
    img.src = codeDataURL
  })
}

const exportAsSVG = async (codeDataURL, filename, options) => {
  const img = new Image()
  
  return new Promise((resolve, reject) => {
    img.onload = () => {
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${img.width}" height="${img.height}">
          <image href="${codeDataURL}" width="${img.width}" height="${img.height}"/>
        </svg>
      `
      
      const blob = new Blob([svg], { type: 'image/svg+xml' })
      saveAs(blob, `${filename}.svg`)
      resolve()
    }
    
    img.onerror = reject
    img.src = codeDataURL
  })
}

/**
 * Print barcode to barcode printer
 * @param {string} barcodeDataURL - Data URL of the barcode image
 * @param {string} barcodeData - The barcode data/text
 * @param {string} barcodeFormat - The barcode format (CODE128, EAN13, etc.)
 * @param {string} printFormat - Print format: 'browser', 'zpl', 'epl', 'escpos'
 */
export const printBarcode = async (barcodeDataURL, barcodeData, barcodeFormat, printFormat = 'browser') => {
  switch (printFormat) {
    case 'browser':
      await printViaBrowser(barcodeDataURL)
      break
    case 'zpl':
      await printViaZPL(barcodeData, barcodeFormat)
      break
    case 'epl':
      await printViaEPL(barcodeData, barcodeFormat)
      break
    case 'escpos':
      await printViaESCPOS(barcodeData, barcodeFormat)
      break
    default:
      throw new Error(`Unsupported print format: ${printFormat}`)
  }
}

/**
 * Print via browser print dialog
 */
const printViaBrowser = async (barcodeDataURL) => {
  const printWindow = window.open('', '_blank')
  const img = new Image()
  
  return new Promise((resolve, reject) => {
    img.onload = () => {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Barcode</title>
            <style>
              body {
                margin: 0;
                padding: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
              }
              img {
                max-width: 100%;
                height: auto;
              }
              @media print {
                body {
                  padding: 0;
                }
              }
            </style>
          </head>
          <body>
            <img src="${barcodeDataURL}" alt="Barcode" />
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              };
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
      resolve()
    }
    
    img.onerror = reject
    img.src = barcodeDataURL
  })
}

/**
 * Generate ZPL (Zebra Programming Language) commands
 */
const printViaZPL = async (barcodeData, barcodeFormat) => {
  // Map barcode formats to ZPL format codes
  const zplFormatMap = {
    'CODE128': 'BC',
    'CODE128A': 'BC',
    'CODE128B': 'BC',
    'CODE128C': 'BC',
    'EAN13': 'BE',
    'EAN8': 'BE',
    'UPC': 'BU',
    'CODE39': 'B3',
    'ITF14': 'BI'
  }
  
  const zplFormat = zplFormatMap[barcodeFormat] || 'BC'
  
  // Generate ZPL commands
  // ^XA starts label, ^XZ ends label
  // ^FO sets field origin (x, y)
  // ^BY sets bar code field defaults (module width, wide bar width, height)
  // ^BC creates Code 128 barcode
  const zpl = `^XA
^FO50,50
^BY3,3,100
^${zplFormat}N,100,Y,N,N
^FD${barcodeData}^FS
^XZ`
  
  // Download as .zpl file
  const blob = new Blob([zpl], { type: 'text/plain' })
  saveAs(blob, `barcode-${barcodeData.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '-')}.zpl`)
  
  alert('ZPL file downloaded. Send this file to your Zebra printer or use Zebra Setup Utilities to print.')
}

/**
 * Generate EPL (Eltron Programming Language) commands
 */
const printViaEPL = async (barcodeData, barcodeFormat) => {
  // Map barcode formats to EPL format codes
  const eplFormatMap = {
    'CODE128': 'b',
    'CODE128A': 'b',
    'CODE128B': 'b',
    'CODE128C': 'b',
    'EAN13': 'B',
    'EAN8': 'B',
    'UPC': 'B',
    'CODE39': '3',
    'ITF14': 'I'
  }
  
  const eplFormat = eplFormatMap[barcodeFormat] || 'b'
  
  // Generate EPL commands
  // N clears image buffer
  // O sets label orientation
  // q sets label width
  // D sets label length
  // B creates barcode
  // P prints label
  const epl = `N
O
q609
D10
${eplFormat}50,50,0,1,2,2,100,B,"${barcodeData}"
P1`
  
  // Download as .epl file
  const blob = new Blob([epl], { type: 'text/plain' })
  saveAs(blob, `barcode-${barcodeData.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '-')}.epl`)
  
  alert('EPL file downloaded. Send this file to your Eltron printer or use printer utilities to print.')
}

/**
 * Generate ESC/POS commands for thermal printers
 */
const printViaESCPOS = async (barcodeData, barcodeFormat) => {
  // Map barcode formats to ESC/POS format codes
  const escposFormatMap = {
    'CODE128': 73, // CODE128
    'CODE128A': 73,
    'CODE128B': 73,
    'CODE128C': 73,
    'EAN13': 67, // EAN13
    'EAN8': 68, // EAN8
    'UPC': 65, // UPC-A
    'CODE39': 69, // CODE39
    'ITF14': 70 // ITF
  }
  
  const escposFormat = escposFormatMap[barcodeFormat] || 73
  
  // ESC/POS commands
  // ESC @ initializes printer
  // GS h sets barcode height
  // GS w sets barcode width
  // GS H sets HRI (Human Readable Interpretation) position
  // GS k creates barcode
  // LF line feed
  const escpos = new Uint8Array([
    0x1B, 0x40, // ESC @ - Initialize
    0x1D, 0x68, 0x64, // GS h 100 - Set height to 100
    0x1D, 0x77, 0x02, // GS w 2 - Set width to 2
    0x1D, 0x48, 0x02, // GS H 2 - HRI below barcode
    0x1D, 0x6B, escposFormat, barcodeData.length, // GS k - Create barcode
    ...Array.from(barcodeData).map(c => c.charCodeAt(0)),
    0x0A // LF - Line feed
  ])
  
  // Download as .bin file
  const blob = new Blob([escpos], { type: 'application/octet-stream' })
  saveAs(blob, `barcode-${barcodeData.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '-')}.bin`)
  
  alert('ESC/POS file downloaded. Use a serial port tool or printer utility to send this file to your thermal printer.')
}