# QR Code Generator

A modern, responsive Progressive Web App (PWA) for generating QR codes with custom logos. Built with React, Vite, and Tailwind CSS, this application works seamlessly on both web and mobile devices with offline functionality.

![QR Code Generator](https://img.shields.io/badge/QR%20Generator-v1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![PWA](https://img.shields.io/badge/PWA-Enabled-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### Core Functionality
- **Multiple QR Code Types**: Text, URL, Email, Phone, WiFi credentials
- **Custom Logo Embedding**: Upload and embed logos with advanced positioning options
- **Real-time Preview**: Instant QR code generation with live preview
- **Multiple Export Formats**: PNG, JPG, PDF, SVG with quality control

### Advanced Features
- **Logo Customization**: Size, position, shape (circle/square/rounded), opacity, borders
- **QR Code Customization**: Size, colors, error correction levels
- **Performance Optimized**: Debounced generation, caching, lazy loading
- **Image Optimization**: Automatic compression and validation

### PWA Capabilities
- **Offline Functionality**: Works without internet connection
- **Installable**: Add to home screen on mobile devices
- **Responsive Design**: Optimized for all screen sizes
- **Fast Loading**: Service worker caching for instant access

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/samikciku/CQRcodegenerator.git
   cd CQRcodegenerator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Usage

### Basic QR Code Generation

1. **Select QR Type**: Choose from Text, URL, Email, Phone, or WiFi
2. **Enter Content**: Type your content in the input field
3. **Customize**: Adjust size, colors, and error correction level
4. **Export**: Download in your preferred format (PNG, JPG, PDF, SVG)

### Adding Logos

1. **Upload Logo**: Click "Choose Logo" and select an image file
2. **Position**: Choose from center, corners, or custom positions
3. **Customize**: Adjust size (10%-40%), shape, opacity, and borders
4. **Preview**: See real-time changes in the preview panel

### PWA Installation

**Desktop (Chrome/Edge)**:
- Click the install button in the address bar
- Or use the install prompt that appears

**Mobile (iOS/Android)**:
- Open in Safari/Chrome
- Tap "Add to Home Screen"
- The app will install like a native app

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - Modern React with hooks
- **Vite 4.4.5** - Fast build tool and dev server
- **Tailwind CSS 3.3.3** - Utility-first CSS framework
- **JavaScript ES6+** - Modern JavaScript features

### Libraries
- **qrcode 1.5.3** - QR code generation
- **jsPDF 2.5.1** - PDF export functionality
- **file-saver 2.0.5** - File download handling

### PWA Features
- **Service Worker** - Offline functionality and caching
- **Web App Manifest** - PWA installation and metadata
- **Responsive Design** - Mobile-first approach

## 📁 Project Structure

```
qr-generator/
├── public/
│   ├── icons/                 # PWA icons
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   └── browserconfig.xml      # Windows tiles
├── src/
│   ├── components/            # React components
│   │   ├── QRGenerator.jsx    # Main QR generation
│   │   ├── LogoUploader.jsx   # Logo upload & options
│   │   ├── Preview.jsx        # QR code preview
│   │   ├── CustomizationPanel.jsx # QR customization
│   │   ├── ExportOptions.jsx  # Export functionality
│   │   ├── PWAInstallPrompt.jsx # PWA install prompt
│   │   └── OfflineIndicator.jsx # Offline status
│   ├── hooks/                 # Custom React hooks
│   │   └── usePerformance.js  # Performance optimization
│   ├── utils/                 # Utility functions
│   │   ├── qrGenerator.js     # QR code generation
│   │   ├── exportUtils.js     # Export functionality
│   │   └── imageOptimization.js # Image processing
│   ├── styles/                # CSS styles
│   │   └── index.css          # Main styles
│   ├── App.jsx                # Main app component
│   └── main.jsx               # App entry point
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind configuration
└── README.md                  # This file
```

## 🚀 Deployment

### Netlify (Recommended)

1. **Connect repository** to Netlify
2. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Deploy** automatically on git push

### Vercel

1. **Install Vercel CLI**: `npm i -g vercel`
2. **Deploy**: `vercel --prod`
3. **Configure** build settings in dashboard

### GitHub Pages

1. **Install gh-pages**: `npm install --save-dev gh-pages`
2. **Add script** to package.json:
   ```json
   "deploy": "gh-pages -d dist"
   ```
3. **Deploy**: `npm run deploy`

## 📊 Performance

### Optimizations Implemented

- **Code Splitting**: Dynamic imports for better loading
- **Image Compression**: Automatic optimization of uploaded images
- **Caching**: QR code results cached to avoid regeneration
- **Debouncing**: Prevents excessive API calls
- **Lazy Loading**: Components loaded on demand
- **Service Worker**: Aggressive caching for offline use

### Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.0s
- **Bundle Size**: < 500KB gzipped

## 🔒 Security

### Implemented Security Measures

- **Input Validation**: All user inputs validated
- **File Type Validation**: Only allowed image types accepted
- **File Size Limits**: Maximum 5MB file size
- **XSS Protection**: React's built-in XSS protection
- **HTTPS Required**: PWA features require secure context

## 🐛 Troubleshooting

### Common Issues

**QR Code not generating**:
- Check if text input is not empty
- Verify logo file is valid image format
- Try refreshing the page
- Check browser console for errors

**Logo not appearing**:
- Ensure image file is supported format
- Check file size (under 5MB)
- Try different image file
- Verify image is not corrupted

**Export not working**:
- Check browser download permissions
- Ensure sufficient disk space
- Try different export format
- Clear browser cache

**App not installing**:
- Use HTTPS connection
- Try different browser
- Check device storage space
- Update browser to latest version

## 🤝 Contributing

1. **Fork** the repository
2. **Create** feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [QRCode.js](https://github.com/davidshimjs/qrcodejs) - QR code generation
- [jsPDF](https://github.com/parallax/jsPDF) - PDF generation
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool

---

Made with ❤️ using React and open source technologies