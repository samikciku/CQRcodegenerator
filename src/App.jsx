import React, { useState } from 'react'
import QRGenerator from './components/QRGenerator'
import Preview from './components/Preview'
import CustomizationPanel from './components/CustomizationPanel'
import ExportOptions from './components/ExportOptions'
import LogoUploader from './components/LogoUploader'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import OfflineIndicator from './components/OfflineIndicator'
import { usePerformanceMonitor } from './hooks/usePerformance'

function App() {
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

  // Performance monitoring
  const performanceMetrics = usePerformanceMonitor()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            QR Code Generator
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Generate QR codes with custom logos - Simple and free
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            
            <CustomizationPanel 
              customization={customization}
              setCustomization={setCustomization}
            />
          </div>

          {/* Right Column - Preview and Export */}
          <div className="space-y-6">
            <Preview 
              qrCodeUrl={qrCodeUrl}
              qrData={qrData}
            />
            
            <ExportOptions 
              qrCodeUrl={qrCodeUrl}
              qrData={qrData}
            />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-600">
            Made with ❤️ using React and open source technologies
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
    </div>
  )
}

export default App