# 🎯 Free CV Builder

A modern, professional CV Builder application built with React, featuring real-time preview, multiple templates, cloud sync, and shareable links. Create beautiful, ATS-friendly resumes for free!

![CV Builder Screenshot](./docs/screenshot.png)

## ✨ Features

### 🎨 **Professional Templates**

- **Modern Template**: Clean, contemporary design with color customization
- **Classic Template**: Traditional, professional layout with elegant typography
- **Minimal Template**: Two-column sidebar layout with compact information display
- All templates are **ATS-friendly** and optimized for applicant tracking systems

### 📝 **Comprehensive CV Sections**

- **Personal Information**: Contact details, social links, professional profiles
- **Professional Summary**: Compelling profile summary and career objectives
- **Work Experience**: Detailed employment history with descriptions and achievements
- **Education**: Academic background, degrees, certifications, and achievements
- **Skills**: Technical skills, soft skills, tools, and programming languages
- **Projects**: Portfolio projects with technologies, links, and descriptions
- **Certifications**: Professional certifications with credential IDs and verification
- **Languages**: Language proficiency levels and multilingual capabilities

### 🚀 **Advanced Features**

- **Real-time Live Preview**: See changes instantly as you type (300ms debounce)
- **Dark Mode Support**: Toggle between light and dark themes with system detection
- **Mobile Responsive**: Optimized for mobile devices with touch-friendly interface
- **Drag & Drop Reordering**: Customize section order with intuitive drag & drop
- **Cloud Sync**: Save and sync CVs across devices with MongoDB backend
- **Shareable Links**: Generate public URLs to share CVs with employers
- **Version Management**: Save multiple CV versions and switch between them
- **PDF Export**: Download pixel-perfect PDFs that match the preview exactly
- **Auto-Save**: Automatic data persistence with visual save indicators
- **Resume Import**: Upload existing resumes (text format) for auto-population
- **Keyboard Shortcuts**: Efficient workflow with common shortcuts
- **Color Customization**: Personalize with custom color schemes
- **Font Selection**: Choose from 5 professional font families
- **Typography Controls**: Adjust font size, spacing, and accent styles

## 🛠️ Tech Stack

### Frontend

- **React 19** with Vite for fast development and builds
- **Tailwind CSS** for responsive, utility-first styling with dark mode
- **Zustand** for lightweight, performant state management
- **@dnd-kit** for smooth drag-and-drop interactions
- **html2pdf.js** for client-side PDF generation

### Backend

- **Node.js** with Express.js for robust API server
- **MongoDB** with Mongoose for flexible data storage
- **Joi** for comprehensive request validation
- **Helmet** for security headers and protection
- **CORS** for cross-origin resource sharing

### Development Tools

- **ESLint** for code quality and consistency
- **PostCSS** with Autoprefixer for CSS optimization
- **Nodemon** for automatic server restarts during development

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local installation or cloud instance)
- Git for version control

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/cv-builder.git
cd cv-builder
```

2. **Install dependencies**

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. **Environment Setup**

```bash
# Copy environment variables
cd server
cp .env.example .env

# Edit .env with your configuration
# MONGODB_URI=mongodb://localhost:27017/cv-builder
# CLIENT_URL=http://localhost:5173
# PORT=5000
```

4. **Start MongoDB**

```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env
```

5. **Run the application**

```bash
# Terminal 1: Start the backend server
cd server
npm run dev

# Terminal 2: Start the frontend
cd client
npm run dev
```

6. **Open your browser**
   Navigate to `http://localhost:5173` to use the CV Builder!

## 📱 Usage

### Creating Your CV

1. **Start with Personal Info**: Add your name, email, phone, and professional links
2. **Write a Summary**: Craft a compelling professional summary
3. **Add Experience**: Detail your work history with descriptions and achievements
4. **Include Education**: Add your degrees, institutions, and academic achievements
5. **List Skills**: Categorize your technical and soft skills
6. **Showcase Projects**: Highlight notable projects and side work
7. **Add Certifications**: Include professional certifications and credentials
8. **Language Proficiency**: List languages and proficiency levels

### Customization

- **Templates**: Switch between Modern, Classic, and Minimal designs
- **Colors**: Choose custom primary and accent colors
- **Fonts**: Select from Inter, Open Sans, Roboto, Lato, or Georgia
- **Typography**: Adjust size (small/medium/large) and spacing (compact/comfortable/spacious)
- **Sections**: Reorder sections with drag & drop, show/hide as needed

### Sharing & Export

- **PDF Export**: Download high-quality PDF files (Ctrl+P)
- **Cloud Sync**: Save to cloud for access across devices
- **Share Links**: Generate public URLs for easy sharing
- **Version Management**: Save multiple CV versions for different roles

### Keyboard Shortcuts

- `Ctrl + P` or `Ctrl + E`: Export PDF
- `Ctrl + S`: Manual save (auto-save enabled)
- `Ctrl + Shift + R`: Reset all data
- `Ctrl + ?`: Show keyboard shortcuts help

## 🏗️ Project Structure

```
cv-builder/
├── client/                     # React frontend application
│   ├── public/                 # Static assets and index.html
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── common/         # UI components (Button, Input, etc.)
│   │   │   ├── customization/  # Template and style customization
│   │   │   ├── features/       # Feature components (Import, Share, etc.)
│   │   │   ├── form/           # CV form sections and management
│   │   │   ├── layout/         # Layout components (Header, Split Screen)
│   │   │   └── preview/        # CV preview and templates
│   │   ├── hooks/              # Custom React hooks
│   │   ├── store/              # Zustand state management stores
│   │   ├── utils/              # Utility functions and API services
│   │   ├── config/             # Configuration files and constants
│   │   └── App.jsx             # Main application component
│   ├── index.html              # HTML entry point
│   ├── package.json            # Frontend dependencies
│   └── tailwind.config.js      # Tailwind CSS configuration
├── server/                     # Node.js backend server
│   ├── src/
│   │   ├── controllers/        # Request handlers and business logic
│   │   ├── middleware/         # Express middleware functions
│   │   ├── models/             # MongoDB data models
│   │   ├── routes/             # API route definitions
│   │   ├── utils/              # Server utility functions
│   │   └── server.js           # Express server entry point
│   ├── .env.example            # Environment variables template
│   └── package.json            # Backend dependencies
└── README.md                   # This file
```

## 🌐 API Documentation

### CV Management

- `POST /api/cv` - Create new CV
- `GET /api/cv/:id` - Retrieve CV by ID
- `PUT /api/cv/:id` - Update existing CV
- `DELETE /api/cv/:id` - Delete CV

### Sharing

- `POST /api/cv/:id/public` - Make CV publicly shareable
- `POST /api/cv/:id/private` - Make CV private
- `GET /api/share/:shareId` - Get public CV by share ID
- `GET /api/cv/:id/analytics` - Get CV view analytics

### Health & Status

- `GET /health` - Server health check
- `GET /` - API information and endpoints

## 🚀 Deployment

### Frontend (Netlify)

```bash
cd client
npm run build
# Deploy dist/ folder to Netlify
```

### Backend (Railway/Heroku)

```bash
cd server
# Set environment variables in hosting dashboard
# Deploy server directory
```

### Environment Variables

```env
# Production Backend
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/cv-builder
CLIENT_URL=https://your-cv-builder.netlify.app

# Production Frontend
VITE_API_BASE_URL=https://your-api-server.railway.app/api
```

## 🎨 Design Principles

- **User-Centric**: Intuitive interface prioritizing user experience
- **Performance First**: Optimized rendering and minimal re-renders
- **Accessibility**: Screen reader support and keyboard navigation
- **Mobile-First**: Responsive design for all device sizes
- **Professional**: Clean, modern aesthetics suitable for business use
- **ATS-Friendly**: Templates optimized for applicant tracking systems

## 🔒 Privacy & Security

- **Local Data Storage**: Primary data stored locally in browser
- **Optional Cloud Sync**: User controls cloud storage and sharing
- **Secure Backend**: Helmet.js security headers and input validation
- **Rate Limiting**: API protection against abuse
- **Data Transparency**: Clear indication of what data is shared publicly

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- **Tailwind CSS** for the utility-first CSS framework
- **React Team** for the excellent JavaScript library
- **Zustand** for simple and scalable state management
- **MongoDB** for flexible document database
- **Vercel** and **Netlify** for hosting solutions

## 💡 Future Enhancements

- **AI-Powered Suggestions**: Smart content recommendations
- **Advanced Analytics**: Detailed view and engagement metrics
- **Team Collaboration**: Multi-user CV review and editing
- **Integration APIs**: Connect with LinkedIn, GitHub, and job boards
- **Custom Templates**: User-created template marketplace
- **Multi-language Support**: Localization for global users
- **Advanced Export Options**: Word, LaTeX, and HTML formats

---

**Built with ❤️ by the CV Builder Team**

For support, feature requests, or bug reports, please [open an issue](https://github.com/yourusername/cv-builder/issues).

**[Live Demo](https://your-cv-builder.netlify.app)** • **[Documentation](./docs/)** • **[API Reference](./docs/api.md)**
