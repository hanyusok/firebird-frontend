# Firebird Database Manager Frontend

A modern Next.js frontend application for managing Firebird database records. This application provides a beautiful, responsive interface for interacting with your Firebird REST API.

## 🚀 Features

- **Modern UI**: Built with Next.js 15, TypeScript, and Tailwind CSS
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **CRUD Operations**: Full Create, Read, Update, Delete functionality for person records
- **Real-time Updates**: Live data fetching and state management
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Smooth loading indicators and transitions
- **Search & Filter**: Search through person records by name, email, or phone
- **Form Validation**: Client-side validation for all form inputs
- **Type Safety**: Full TypeScript support for better development experience

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **UI Components**: Custom components with Headless UI

## 📋 Prerequisites

- Node.js 18+ (LTS recommended)
- Your Firebird REST API server running on `http://localhost:3000`
- Modern web browser

## 🚀 Quick Start

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd firebird-frontend
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NODE_ENV=development
   ```

3. **Start your Firebird REST API server:**
   Make sure your Firebird REST API is running on `http://localhost:3000`

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3001` (or the port shown in your terminal)

## 📁 Project Structure

```
firebird-frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Dashboard page
│   │   ├── persons/           # Persons management
│   │   ├── activity/          # Activity log
│   │   └── settings/          # Settings page
│   ├── components/            # Reusable UI components
│   │   ├── Navigation.tsx     # Main navigation
│   │   ├── PersonCard.tsx     # Person display card
│   │   ├── PersonModal.tsx    # Person create/edit modal
│   │   ├── Loading.tsx        # Loading component
│   │   └── Error.tsx          # Error display component
│   └── lib/                   # Utilities and services
│       ├── api.ts             # API client service
│       └── utils.ts           # Utility functions
├── public/                    # Static assets
└── package.json
```

## 🎨 UI Components

### Dashboard
- Overview statistics
- Quick action cards
- Real-time API status
- Recent activity summary

### Persons Management
- Grid view of all persons
- Search and filter functionality
- Create, edit, and delete operations
- Form validation
- Responsive card layout

### Activity Log
- Recent database activities
- Timestamp tracking
- Action categorization
- Real-time updates

### Settings
- Database configuration
- API settings
- Security preferences
- Network configuration

## 🔧 API Integration

The application integrates with your Firebird REST API through:

- **Base URL**: Configurable via `NEXT_PUBLIC_API_URL`
- **Endpoints**: 
  - `GET /api/persons` - Fetch all persons
  - `POST /api/persons` - Create new person
  - `PUT /api/persons/:id` - Update person
  - `DELETE /api/persons/:id` - Delete person
  - `GET /api/health` - Health check

## 🎯 Key Features

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interactions
- Optimized for all screen sizes

### Form Validation
- Real-time validation
- Email format checking
- Phone number validation
- Required field validation
- User-friendly error messages

### Error Handling
- Network error recovery
- Retry mechanisms
- Graceful degradation
- User feedback

### Performance
- Optimized bundle size
- Lazy loading
- Efficient re-renders
- Fast navigation

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables for Production
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NODE_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Check the documentation
- Open an issue on GitHub
- Contact the development team

## 🔄 Updates

This frontend is designed to work seamlessly with your existing Firebird REST API. When you update your API endpoints or data models, make sure to update the corresponding types and API client in this frontend.

---

**Happy coding!** 🎉