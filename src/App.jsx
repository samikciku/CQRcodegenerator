import React, { useState, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import QRGenerator from './components/QRGenerator'
import BarcodeGenerator from './components/BarcodeGenerator'
import Preview from './components/Preview'
import CustomizationPanel from './components/CustomizationPanel'
import BarcodeCustomizationPanel from './components/BarcodeCustomizationPanel'
import ExportOptions from './components/ExportOptions'
import LogoUploader from './components/LogoUploader'
import TextOptions from './components/TextOptions'
import BarcodeTextOptions from './components/BarcodeTextOptions'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import OfflineIndicator from './components/OfflineIndicator'
import { usePerformanceMonitor } from './hooks/usePerformance'

function App() {
  const [mode, setMode] = useState('qr') // 'qr' or 'barcode'
  
  // QR Code state
  const [qrData, setQrData] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [logoFile, setLogoFile] = useState(null)
  const [customization, setCustomization] = useState({
    size: 300,
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    errorLevel: 'M'
  })
  const [logoOptions, setLogoOptions] = useState({
    size: 0.2,
    position: 'center',
    shape: 'circle',
    borderWidth: 0,
    borderColor: '#FFFFFF',
    opacity: 1.0
  })
  const [textOptions, setTextOptions] = useState({
    showText: false,
    textAbove: '',
    textBelow: '',
    fontSize: 16,
    textColor: '#000000',
    textAlign: 'center',
    fontWeight: 'medium'
  })

  // Barcode state
  const [barcodeData, setBarcodeData] = useState('')
  const [barcodeFormat, setBarcodeFormat] = useState('CODE128')
  const [barcodeUrl, setBarcodeUrl] = useState('')
  const [barcodeCustomization, setBarcodeCustomization] = useState({
    width: 2, // pixels (will be converted from mm)
    widthMm: 0.25, // millimeters (default ~2px at 203 DPI)
    height: 100, // pixels (will be converted from mm)
    heightMm: 12.5, // millimeters (default ~100px at 203 DPI)
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    displayValue: true,
    fontSize: 20,
    textPosition: 'bottom',
    margin: 10
  })
  const [barcodeTextOptions, setBarcodeTextOptions] = useState({
    showText: false,
    textAbove: '',
    textBelow: '',
    fontSize: 16,
    textColor: '#000000',
    textAlign: 'center',
    fontWeight: 'medium'
  })

  // Performance monitoring
  const performanceMetrics = usePerformanceMonitor()

  // Debug analytics loading
  useEffect(() => {
    console.log('App loaded, checking analytics...')
    
    // Check if analytics scripts are loaded
    const checkAnalyticsScripts = () => {
      const analyticsScript = document.querySelector('script[src*="vercel-analytics"]')
      const speedInsightsScript = document.querySelector('script[src*="speed-insights"]')
      
      console.log('Analytics script found:', !!analyticsScript)
      console.log('Speed Insights script found:', !!speedInsightsScript)
      
      if (analyticsScript) {
        console.log('Analytics script src:', analyticsScript.src)
      }
      if (speedInsightsScript) {
        console.log('Speed Insights script src:', speedInsightsScript.src)
      }
    }
    
    // Check immediately and after a delay
    checkAnalyticsScripts()
    setTimeout(checkAnalyticsScripts, 2000)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            QR Code & Barcode Generator
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Generate QR codes and barcodes with custom options - Simple and free
          </p>
          
          {/* Mode Selector */}
          <div className="flex justify-center mt-4">
            <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
              <button
                onClick={() => setMode('qr')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  mode === 'qr'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                QR Code
              </button>
              <button
                onClick={() => setMode('barcode')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  mode === 'barcode'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Barcode
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {mode === 'qr' ? (
          <>
            {/* Mobile Layout - Custom Order */}
            <div className="block lg:hidden space-y-6">
              {/* FIRST: Generate QR Code */}
              <QRGenerator 
                qrData={qrData}
                setQrData={setQrData}
                customization={customization}
                setQrCodeUrl={setQrCodeUrl}
                logoFile={logoFile}
                logoOptions={logoOptions}
              />
              
              {/* SECOND: QR Code Preview */}
              <Preview 
                codeUrl={qrCodeUrl}
                codeData={qrData}
                textOptions={textOptions}
                mode="qr"
              />
              
              {/* THIRD: Text Options */}
              <TextOptions
                textOptions={textOptions}
                setTextOptions={setTextOptions}
              />
              
              {/* FOURTH: Customization */}
              <CustomizationPanel 
                customization={customization}
                setCustomization={setCustomization}
              />
              
              {/* FIFTH: Logo Settings */}
              <LogoUploader
                logoFile={logoFile}
                setLogoFile={setLogoFile}
                logoOptions={logoOptions}
                setLogoOptions={setLogoOptions}
              />
              
              {/* SIXTH: Export Options */}
              <ExportOptions 
                codeUrl={qrCodeUrl}
                codeData={qrData}
                mode="qr"
              />
            </div>

            {/* Desktop Layout - Original Two Column */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-8">
              {/* Left Column - Input and Controls */}
              <div className="space-y-6">
                <QRGenerator 
                  qrData={qrData}
                  setQrData={setQrData}
                  customization={customization}
                  setQrCodeUrl={setQrCodeUrl}
                  logoFile={logoFile}
                  logoOptions={logoOptions}
                />
                
                <LogoUploader
                  logoFile={logoFile}
                  setLogoFile={setLogoFile}
                  logoOptions={logoOptions}
                  setLogoOptions={setLogoOptions}
                />
                
                <TextOptions
                  textOptions={textOptions}
                  setTextOptions={setTextOptions}
                />
                
                <CustomizationPanel 
                  customization={customization}
                  setCustomization={setCustomization}
                />
              </div>

              {/* Right Column - Preview and Export */}
              <div className="space-y-6">
                <Preview 
                  codeUrl={qrCodeUrl}
                  codeData={qrData}
                  textOptions={textOptions}
                  mode="qr"
                />
                
                <ExportOptions 
                  codeUrl={qrCodeUrl}
                  codeData={qrData}
                  mode="qr"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Barcode Mode */}
            <div className="block lg:hidden space-y-6">
              <BarcodeGenerator 
                barcodeData={barcodeData}
                setBarcodeData={setBarcodeData}
                barcodeFormat={barcodeFormat}
                setBarcodeFormat={setBarcodeFormat}
                customization={barcodeCustomization}
                setBarcodeUrl={setBarcodeUrl}
              />
              
              <Preview 
                codeUrl={barcodeUrl}
                codeData={barcodeData}
                textOptions={barcodeTextOptions}
                mode="barcode"
              />
              
              <BarcodeTextOptions
                textOptions={barcodeTextOptions}
                setTextOptions={setBarcodeTextOptions}
              />
              
              <BarcodeCustomizationPanel 
                customization={barcodeCustomization}
                setCustomization={setBarcodeCustomization}
              />
              
              <ExportOptions 
                codeUrl={barcodeUrl}
                codeData={barcodeData}
                mode="barcode"
                barcodeFormat={barcodeFormat}
              />
            </div>

            <div className="hidden lg:grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <BarcodeGenerator 
                  barcodeData={barcodeData}
                  setBarcodeData={setBarcodeData}
                  barcodeFormat={barcodeFormat}
                  setBarcodeFormat={setBarcodeFormat}
                  customization={barcodeCustomization}
                  setBarcodeUrl={setBarcodeUrl}
                />
                
                <BarcodeTextOptions
                  textOptions={barcodeTextOptions}
                  setTextOptions={setBarcodeTextOptions}
                />
                
                <BarcodeCustomizationPanel 
                  customization={barcodeCustomization}
                  setCustomization={setBarcodeCustomization}
                />
              </div>

              <div className="space-y-6">
                <Preview 
                  codeUrl={barcodeUrl}
                  codeData={barcodeData}
                  textOptions={barcodeTextOptions}
                  mode="barcode"
                />
                
                <ExportOptions 
                  codeUrl={barcodeUrl}
                  codeData={barcodeData}
                  mode="barcode"
                  barcodeFormat={barcodeFormat}
                />
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-600">
            Made with ❤️ using React and open source technologies by CyberFuzz
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="text-center text-xs text-gray-400 mt-2">
              Performance: {performanceMetrics.renderTime.toFixed(2)}ms render, 
              {performanceMetrics.memoryUsage.toFixed(1)}MB memory
            </div>
          )}
        </div>
      </footer>

      {/* PWA Components */}
      <PWAInstallPrompt />
      <OfflineIndicator />
      
      {/* Vercel Analytics */}
      <Analytics />
      <SpeedInsights debug />
      
      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ position: 'fixed', bottom: '10px', right: '10px', background: 'black', color: 'white', padding: '5px', fontSize: '12px', zIndex: 9999 }}>
          Analytics & SpeedInsights Components Loaded
        </div>
      )}
    </div>
  )
}

export default App