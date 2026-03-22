# 🎯 Free CV Builder

A modern, professional CV Builder application built with React, featuring real-time preview, multiple templates, cloud sync, shareable links, and **GitHub integration with direct repository starring**. Create beautiful, ATS-friendly resumes for free!

<!-- ![CV Builder Screenshot](./docs/screenshot.png) -->

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

### ⭐ **GitHub Integration** _(NEW)_

- **Direct Repository Starring**: One-click GitHub repository starring without popups
- **GitHub OAuth Authentication**: Secure authentication with GitHub login
- **Real-time Star Count**: Live repository star count display in footer
- **Seamless Integration**: Stars repositories directly from the CV Builder interface
- **User-friendly Authentication**: Popup-based OAuth flow with automatic closure

## 🛠️ Tech Stack

### Frontend

- **React 19** with Vite for fast development and builds
- **Tailwind CSS** for responsive, utility-first styling with dark mode
- **Zustand** for lightweight, performant state management
- **@dnd-kit** for smooth drag-and-drop interactions
- **html2pdf.js** for client-side PDF generation

### Backend

- **Node.js** with Express.js for robust API server
- **MongoDB Atlas** with Mongoose for flexible cloud data storage
- **GitHub OAuth 2.0** for secure authentication and API access
- **Express Session** with secure session management
- **Axios** for reliable HTTP client and GitHub API integration
- **Joi** for comprehensive request validation
- **Helmet** for security headers and protection
- **CORS** for cross-origin resource sharing

### Deployment & Infrastructure

- **Render.com** - Free backend hosting with auto-scaling
- **Netlify** - Frontend hosting with continuous deployment
- **MongoDB Atlas** - Cloud database with free tier
- **GitHub OAuth** - Authentication service integration

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
git clone https://github.com/sandunMadhushan/free-cv-builder.git
cd free-cv-builder
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
# MONGODB_URI=mongodb://localhost:27017/cv-builder (local)
# OR use MongoDB Atlas for cloud database
# CLIENT_URL=http://localhost:5173
# PORT=5000

# For GitHub integration (optional):
# GITHUB_CLIENT_ID=your-github-oauth-client-id
# GITHUB_CLIENT_SECRET=your-github-oauth-client-secret
# GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback
# SESSION_SECRET=generate-strong-random-secret-key
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
free-cv-builder/
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

### GitHub Integration _(NEW)_

- `GET /api/auth/github` - Initiate GitHub OAuth authentication
- `GET /api/auth/github/callback` - Handle GitHub OAuth callback
- `GET /api/auth/status` - Get current authentication status
- `POST /api/auth/logout` - Logout and clear session
- `GET /api/auth/repo/stars` - Get repository star count
- `POST /api/auth/repo/star` - Star the repository
- `DELETE /api/auth/repo/star` - Unstar the repository
- `GET /api/auth/repo/star/status` - Check if user has starred repository

### Health & Status

- `GET /health` - Server health check
- `GET /` - API information and endpoints

## 🚀 Deployment

### Live Application

- **🌐 Live Demo**: [https://free-cv-builder.netlify.app](https://free-cv-builder.netlify.app)
- **🔧 API Server**: [https://cv-builder-api-fexd.onrender.com](https://cv-builder-api-fexd.onrender.com)
- **📖 Documentation**: [Backend API Guide](./server/README.md)

### Quick Deploy (FREE)

Both frontend and backend can be deployed for **$0/month** using free tiers:

#### Frontend (Netlify) - **FREE**

```bash
cd client
npm run build
# Connect GitHub repo to Netlify for auto-deploy
```

#### Backend (Render) - **FREE**

```bash
# 1. Connect GitHub repo to Render
# 2. Set Root Directory: server
# 3. Build Command: npm install
# 4. Start Command: npm start
# 5. Add environment variables (see below)
```

#### Database (MongoDB Atlas) - **FREE**

```bash
# 1. Create free cluster (512MB)
# 2. Create database user
# 3. Whitelist all IPs (0.0.0.0/0)
# 4. Get connection string
```

### Environment Variables

#### Production Backend (Render)

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/cv-builder
CLIENT_URL=https://your-cv-builder.netlify.app
SESSION_SECRET=generate-strong-random-secret-64-chars

# GitHub OAuth (optional)
GITHUB_CLIENT_ID=your-github-oauth-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-client-secret
GITHUB_CALLBACK_URL=https://your-backend.onrender.com/api/auth/github/callback
```

#### Production Frontend (Netlify)

```env
VITE_API_URL=https://your-backend.onrender.com
```

📋 **[Complete Deployment Guide](./server/README.md)** - Step-by-step instructions with screenshots

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
- **GitHub OAuth**: Secure GitHub authentication with industry-standard OAuth 2.0
- **Session Management**: Secure session handling with HTTP-only cookies
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
- **MongoDB Atlas** for flexible cloud document database
- **GitHub** for OAuth authentication and repository hosting
- **Render** for free tier backend hosting
- **Netlify** for seamless frontend deployment

## 💡 Future Enhancements

- **AI-Powered Suggestions**: Smart content recommendations
- **Advanced Analytics**: Detailed view and engagement metrics
- **Team Collaboration**: Multi-user CV review and editing
- **Integration APIs**: Connect with LinkedIn, GitHub, and job boards
- **Custom Templates**: User-created template marketplace
- **Multi-language Support**: Localization for global users
- **Advanced Export Options**: Word, LaTeX, and HTML formats

---

**Built with ❤️ by [Sandun Madhushan](https://github.com/sandunMadhushan)**

⭐ **[Star this repository](https://github.com/sandunMadhushan/free-cv-builder)** if you find it helpful!

For support, feature requests, or bug reports, please [open an issue](https://github.com/sandunMadhushan/free-cv-builder/issues).

**[🌐 Live Demo](https://free-cv-builder.netlify.app)** • **[📊 API Status](https://cv-builder-api-fexd.onrender.com)** • **[📖 Deployment Guide](./server/README.md)**
