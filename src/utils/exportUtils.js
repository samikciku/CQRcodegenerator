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
 * @param {object} labelOptions - Label printing options (dimensions, margins, etc.)
 */
export const printBarcode = async (barcodeDataURL, barcodeData, barcodeFormat, printFormat = 'browser', labelOptions = {}) => {
  // Default label options
  const defaultLabelOptions = {
    width: 50.8,
    height: 25.4,
    orientation: 'portrait',
    marginTop: 2,
    marginLeft: 2,
    barcodeX: 5,
    barcodeY: 5,
    barcodeWidth: 40,
    barcodeHeight: 15,
    quantity: 1,
    dpi: 203
  }
  
  const options = { ...defaultLabelOptions, ...labelOptions }
  
  switch (printFormat) {
    case 'browser':
      await printViaBrowser(barcodeDataURL, options)
      break
    case 'zpl':
      await printViaZPL(barcodeData, barcodeFormat, options)
      break
    case 'epl':
      await printViaEPL(barcodeData, barcodeFormat, options)
      break
    case 'escpos':
      await printViaESCPOS(barcodeData, barcodeFormat, options)
      break
    default:
      throw new Error(`Unsupported print format: ${printFormat}`)
  }
}

/**
 * Print via browser print dialog
 */
const printViaBrowser = async (barcodeDataURL, labelOptions) => {
  const printWindow = window.open('', '_blank')
  const img = new Image()
  
  // Convert mm to pixels (1mm = 3.7795px at 96 DPI, or use label DPI)
  const mmToPx = (mm, dpi = 96) => (mm * dpi) / 25.4
  const labelWidthPx = mmToPx(labelOptions.width, labelOptions.dpi || 96)
  const labelHeightPx = mmToPx(labelOptions.height, labelOptions.dpi || 96)
  const marginTopPx = mmToPx(labelOptions.marginTop || 0, labelOptions.dpi || 96)
  const marginLeftPx = mmToPx(labelOptions.marginLeft || 0, labelOptions.dpi || 96)
  const barcodeXPx = mmToPx(labelOptions.barcodeX || 0, labelOptions.dpi || 96)
  const barcodeYPx = mmToPx(labelOptions.barcodeY || 0, labelOptions.dpi || 96)
  const barcodeWidthPx = mmToPx(labelOptions.barcodeWidth || 40, labelOptions.dpi || 96)
  const barcodeHeightPx = mmToPx(labelOptions.barcodeHeight || 15, labelOptions.dpi || 96)
  
  return new Promise((resolve, reject) => {
    img.onload = () => {
      const labels = Array(labelOptions.quantity || 1).fill(0).map((_, i) => {
        const top = i * labelHeightPx
        return `
          <div style="
            position: relative;
            width: ${labelWidthPx}px;
            height: ${labelHeightPx}px;
            border: 1px dashed #ccc;
            margin-bottom: ${i < (labelOptions.quantity - 1) ? '10px' : '0'};
            page-break-after: ${i < (labelOptions.quantity - 1) ? 'always' : 'auto'};
          ">
            <img src="${barcodeDataURL}" alt="Barcode" style="
              position: absolute;
              left: ${barcodeXPx}px;
              top: ${barcodeYPx}px;
              width: ${barcodeWidthPx}px;
              height: ${barcodeHeightPx}px;
              object-fit: contain;
            " />
          </div>
        `
      }).join('')
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Barcode Labels</title>
            <style>
              @page {
                size: ${labelOptions.width}mm ${labelOptions.height}mm;
                margin: 0;
              }
              body {
                margin: 0;
                padding: ${marginTopPx}px ${marginLeftPx}px;
                font-family: Arial, sans-serif;
              }
              @media print {
                body {
                  padding: ${marginTopPx}px ${marginLeftPx}px;
                }
              }
            </style>
          </head>
          <body>
            ${labels}
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
const printViaZPL = async (barcodeData, barcodeFormat, labelOptions) => {
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
  
  // Convert mm to dots (203 DPI: 1mm = 8 dots, 300 DPI: 1mm = 11.81 dots)
  const dpi = labelOptions.dpi || 203
  const mmToDots = (mm) => Math.round((mm * dpi) / 25.4)
  
  const labelWidth = mmToDots(labelOptions.width || 50.8)
  const labelHeight = mmToDots(labelOptions.height || 25.4)
  const barcodeX = mmToDots(labelOptions.barcodeX || 5)
  const barcodeY = mmToDots(labelOptions.barcodeY || 5)
  const barcodeHeight = mmToDots(labelOptions.barcodeHeight || 15)
  const barcodeWidth = Math.round((labelOptions.barcodeWidth || 40) / 10) // Module width (1-10)
  
  // Generate ZPL commands for multiple labels
  let zpl = ''
  for (let i = 0; i < (labelOptions.quantity || 1); i++) {
    zpl += `^XA
^PW${labelWidth}
^LL${labelHeight}
^FO${barcodeX},${barcodeY}
^BY${barcodeWidth},3,${barcodeHeight}
^${zplFormat}N,${barcodeHeight},Y,N,N
^FD${barcodeData}^FS
^XZ`
    if (i < (labelOptions.quantity - 1)) {
      zpl += '\n'
    }
  }
  
  // Download as .zpl file
  const blob = new Blob([zpl], { type: 'text/plain' })
  saveAs(blob, `barcode-labels-${barcodeData.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '-')}.zpl`)
  
  alert(`ZPL file with ${labelOptions.quantity || 1} label(s) downloaded. Send this file to your Zebra printer or use Zebra Setup Utilities to print.`)
}

/**
 * Generate EPL (Eltron Programming Language) commands
 */
const printViaEPL = async (barcodeData, barcodeFormat, labelOptions) => {
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
  
  // Convert mm to dots (203 DPI: 1mm = 8 dots)
  const dpi = labelOptions.dpi || 203
  const mmToDots = (mm) => Math.round((mm * dpi) / 25.4)
  
  const labelWidth = mmToDots(labelOptions.width || 50.8)
  const labelHeight = mmToDots(labelOptions.height || 25.4)
  const barcodeX = mmToDots(labelOptions.barcodeX || 5)
  const barcodeY = mmToDots(labelOptions.barcodeY || 5)
  const barcodeHeight = mmToDots(labelOptions.barcodeHeight || 15)
  const barcodeWidth = Math.round((labelOptions.barcodeWidth || 40) / 10) // Module width
  
  // Generate EPL commands for multiple labels
  let epl = ''
  for (let i = 0; i < (labelOptions.quantity || 1); i++) {
    epl += `N
${labelOptions.orientation === 'landscape' ? 'R' : 'O'}
q${labelWidth}
D${labelHeight}
${eplFormat}${barcodeX},${barcodeY},0,1,${barcodeWidth},${barcodeWidth},${barcodeHeight},B,"${barcodeData}"
P1`
    if (i < (labelOptions.quantity - 1)) {
      epl += '\n'
    }
  }
  
  // Download as .epl file
  const blob = new Blob([epl], { type: 'text/plain' })
  saveAs(blob, `barcode-labels-${barcodeData.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '-')}.epl`)
  
  alert(`EPL file with ${labelOptions.quantity || 1} label(s) downloaded. Send this file to your Eltron printer or use printer utilities to print.`)
}

/**
 * Generate ESC/POS commands for thermal printers
 */
const printViaESCPOS = async (barcodeData, barcodeFormat, labelOptions) => {
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
  
  // Convert mm to dots for ESC/POS (typically 203 DPI)
  const dpi = labelOptions.dpi || 203
  const mmToDots = (mm) => Math.round((mm * dpi) / 25.4)
  const barcodeHeight = Math.min(255, Math.max(1, mmToDots(labelOptions.barcodeHeight || 15)))
  const barcodeWidth = Math.min(6, Math.max(1, Math.round((labelOptions.barcodeWidth || 40) / 10)))
  
  // Build ESC/POS commands for multiple labels
  let commands = []
  
  for (let i = 0; i < (labelOptions.quantity || 1); i++) {
    // Initialize printer
    commands.push(0x1B, 0x40) // ESC @
    
    // Set label size (if supported)
    // Note: ESC/POS has limited label size support, using paper width
    const paperWidth = mmToDots(labelOptions.width || 50.8)
    if (paperWidth <= 576) { // Max width for 58mm printer
      commands.push(0x1D, 0x57, (paperWidth & 0xFF), ((paperWidth >> 8) & 0xFF)) // GS W
    }
    
    // Add margin (feed paper)
    const marginTop = mmToDots(labelOptions.marginTop || 2)
    if (marginTop > 0) {
      commands.push(0x1B, 0x64, Math.min(255, marginTop)) // ESC d - Feed
    }
    
    // Set barcode height
    commands.push(0x1D, 0x68, barcodeHeight) // GS h
    
    // Set barcode width
    commands.push(0x1D, 0x77, barcodeWidth) // GS w
    
    // Set HRI position (Human Readable Interpretation)
    commands.push(0x1D, 0x48, 0x02) // GS H 2 - Below barcode
    
    // Create barcode
    commands.push(0x1D, 0x6B, escposFormat, barcodeData.length) // GS k
    commands.push(...Array.from(barcodeData).map(c => c.charCodeAt(0)))
    
    // Feed paper for label height
    const labelHeight = mmToDots(labelOptions.height || 25.4)
    commands.push(0x1B, 0x64, Math.min(255, labelHeight - barcodeHeight - marginTop)) // ESC d
    
    // Cut paper (if supported)
    commands.push(0x1D, 0x56, 0x00) // GS V 0 - Partial cut
    
    // Add separator between labels
    if (i < (labelOptions.quantity - 1)) {
      commands.push(0x0A) // LF
    }
  }
  
  // Download as .bin file
  const escpos = new Uint8Array(commands)
  const blob = new Blob([escpos], { type: 'application/octet-stream' })
  saveAs(blob, `barcode-labels-${barcodeData.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '-')}.bin`)
  
  alert(`ESC/POS file with ${labelOptions.quantity || 1} label(s) downloaded. Use a serial port tool or printer utility to send this file to your thermal printer.`)
}