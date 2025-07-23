# Mobigas - Gas Cylinder Delivery Management System

A modern React-based frontend for the Mobigas gas cylinder delivery management system, built with React Router, Tailwind CSS, and comprehensive authentication.

## 🚀 Features

- **Authentication System**: Complete login/register functionality with JWT tokens
- **Route Protection**: Public, protected, and admin-only routes
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Product Management**: Browse, search, and filter gas cylinders
- **Admin Dashboard**: User and order management for administrators
- **Modern UI**: Clean, professional interface with smooth animations
- **Real-time Notifications**: Toast notifications for user feedback

## 🛠️ Tech Stack

- **React 19** - Modern React with hooks
- **React Router v7** - Client-side routing
- **Tailwind CSS v4** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **React Hot Toast** - Toast notifications
- **Lucide React** - Beautiful icons
- **Vite** - Fast build tool

## 📁 Project Structure

```
src/
├── components/
│   ├── Layout/
│   │   ├── Header.jsx          # Navigation header
│   │   ├── Footer.jsx          # Site footer
│   │   ├── AppLayout.jsx       # Layout for protected routes
│   │   └── PublicLayout.jsx    # Layout for public routes
│   ├── ProtectedRoute.jsx      # Route guard for authenticated users
│   ├── PublicRoute.jsx         # Route guard for public routes
│   ├── AdminRoute.jsx          # Route guard for admin users
│   └── LoadingSpinner.jsx      # Loading component
├── context/
│   └── AuthContext.jsx         # Authentication context
├── pages/
│   ├── Home.jsx                # Landing page
│   ├── Login.jsx               # Login page
│   ├── Register.jsx            # Registration page
│   ├── Products.jsx            # Product listing
│   ├── AdminUsers.jsx          # User management (admin)
│   └── AdminOrders.jsx         # Order management (admin)
├── services/
│   └── api.js                  # API service functions
├── App.jsx                     # Main app component
├── main.jsx                    # App entry point
└── index.css                   # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm
- Backend API running on `http://localhost:5000`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd client
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔐 Authentication Flow

### Public Routes
- `/` - Home page (accessible to everyone)
- `/auth` - Login page (redirects if already authenticated)
- `/auth/register` - Registration page (redirects if already authenticated)

### Protected Routes (Require Authentication)
- `/products` - Product listing and shopping

### Admin Routes (Require Admin Role)
- `/admin/users` - User management
- `/admin/orders` - Order management

## 🎨 Customization

### Styling
The application uses Tailwind CSS with custom components defined in `src/index.css`:

- `.btn-primary` - Primary button styles
- `.btn-secondary` - Secondary button styles
- `.card` - Card component styles
- `.input-field` - Form input styles
- `.text-gradient` - Gradient text effect

### API Configuration
Update the API base URL in `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## 🌟 Key Features

### Authentication
- JWT token-based authentication
- Automatic token refresh
- Protected route guards
- Role-based access control

### Product Management
- Product listing with search and filters
- Category-based filtering
- Add to cart functionality
- Stock management

### Admin Features
- User management (view, edit, delete)
- Order management with status updates
- Real-time order tracking
- Customer information display

### User Experience
- Loading states for all async operations
- Toast notifications for user feedback
- Smooth animations and transitions
- Mobile-responsive design

## 🔒 Security

- JWT tokens stored in localStorage
- Automatic token validation
- Route protection based on authentication status
- Role-based access control for admin features

## 🚀 Deployment

### Build for Production
```bash
pnpm build
```

### Deploy to Vercel
1. Connect your repository to Vercel
2. Set environment variables if needed
3. Deploy automatically on push to main branch

### Environment Variables
Create a `.env` file for environment-specific configuration:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: support@mobigas.co.ke
- Phone: +254115479310

---

**Mobigas** - Your trusted gas delivery partner across Kenya. 