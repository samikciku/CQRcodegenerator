import React from 'react'

const Preview = ({ codeUrl, codeData, textOptions, mode = 'qr' }) => {
  const isQR = mode === 'qr'
  const isBarcode = mode === 'barcode'
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Preview
      </h2>
      
      <div className={`${isQR ? 'qr-preview' : 'barcode-preview'} flex flex-col items-center justify-center min-h-[300px]`}>
        {codeUrl ? (
          <div className="text-center w-full">
            {/* Text Above (QR Code only) */}
            {isQR && textOptions?.showText && textOptions?.textAbove && (
              <div className="mb-4">
                <p 
                  className="text-gray-800 font-medium break-words"
                  style={{
                    fontSize: `${textOptions.fontSize}px`,
                    color: textOptions.textColor,
                    textAlign: textOptions.textAlign,
                    fontWeight: textOptions.fontWeight,
                    maxWidth: '300px',
                    margin: '0 auto'
                  }}
                >
                  {textOptions.textAbove}
                </p>
              </div>
            )}

            {/* QR Code or Barcode */}
            <div className="flex justify-center">
              <img 
                src={codeUrl} 
                alt={isQR ? "Generated QR Code" : "Generated Barcode"}
                className={`max-w-full h-auto rounded-lg shadow-sm ${isBarcode ? 'max-w-md' : ''}`}
              />
            </div>

            {/* Text Below (QR Code only) */}
            {isQR && textOptions?.showText && textOptions?.textBelow && (
              <div className="mt-4">
                <p 
                  className="text-gray-800 font-medium break-words"
                  style={{
                    fontSize: `${textOptions.fontSize}px`,
                    color: textOptions.textColor,
                    textAlign: textOptions.textAlign,
                    fontWeight: textOptions.fontWeight,
                    maxWidth: '300px',
                    margin: '0 auto'
                  }}
                >
                  {textOptions.textBelow}
                </p>
              </div>
            )}

            {/* Default scan instruction */}
            {isQR && !textOptions?.showText && (
              <p className="text-sm text-gray-600 mt-4">
                Scan this QR code with your device
              </p>
            )}
            {isBarcode && (
              <p className="text-sm text-gray-600 mt-4">
                Scan this barcode with a barcode scanner
              </p>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-lg font-medium">
              {isQR ? 'No QR Code Generated' : 'No Barcode Generated'}
            </p>
            <p className="text-sm">
              {isQR ? 'Enter some text above to generate a QR code' : 'Enter barcode data above to generate a barcode'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Preview