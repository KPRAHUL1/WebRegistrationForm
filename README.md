# QR Form - Workshop & Course Management System

A comprehensive web application for managing workshops, courses, internships, and financial tracking with QR code-based registration forms.

## Features

### 🎯 Core Functionality
- **Workshop Management**: Create, edit, and manage workshops with online/offline/hybrid delivery modes
- **Course Management**: Manage courses with detailed information and registration tracking
- **Internship Management**: Handle internship programs and applications
- **QR Code Registration**: Generate QR codes for easy workshop/course registration
- **Admin Dashboard**: Comprehensive admin panel with statistics and management tools

### 💰 Financial Management
- **Income Tracking**: Automatic income recording from registrations and payments
- **Expense Management**: Admin can add and track expenses by category
- **Financial Reports**: Real-time income vs expense calculations and net profit tracking
- **Payment Integration**: Support for UPI, cards, net banking, and wallet payments

### 👥 User Management
- **Registration System**: Student registration with form data collection
- **Status Tracking**: Track registration status (pending, confirmed, completed)
- **Email Notifications**: Automated email system for registrations and updates

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first responsive interface
- **Real-time Updates**: Live data updates without page refresh
- **Search & Filter**: Advanced search and filtering capabilities
- **Multiple View Modes**: Table and card view options for better data visualization

## Tech Stack

### Backend
- **Node.js** with **Express.js** framework
- **TypeScript** for type safety
- **PostgreSQL** database with **Prisma ORM**
- **Multer** for file uploads
- **JWT** for authentication

### Frontend
- **React.js** with **Vite** build tool
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Icons** for UI icons

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd QrForm
```

### 2. Backend Setup
```bash
cd Backend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env file with your database credentials
# DATABASE_URL="postgresql://username:password@localhost:5432/qrform_db"

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run dev
```

### 3. Frontend Setup
```bash
cd qrfrontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Database Schema

The application uses the following main models:

- **Admin**: System administrators and moderators
- **Workshop**: Workshop details with delivery modes and team information
- **Course**: Course information and management
- **Internship**: Internship program details
- **WorkshopRegistration**: Student workshop registrations
- **CourseRegistration**: Student course registrations
- **Payment**: Payment tracking and verification
- **Income**: Income from registrations and payments
- **Expense**: Admin-managed expenses

## API Endpoints

### Workshop Management
- `POST /api/workshop` - Create new workshop
- `GET /api/workshop` - Get all workshops
- `GET /api/workshop/:id` - Get workshop by ID
- `PUT /api/workshop/:id` - Update workshop
- `DELETE /api/workshop/:id` - Delete workshop

### Financial Management
- `GET /api/incomes` - Get all income records
- `GET /api/incomes/total` - Get total income
- `POST /api/expenses` - Create new expense
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/total` - Get total expenses

### Registration Management
- `GET /api/register/registrations` - Get all registrations
- `POST /api/incomes/workshop-registration` - Create income from workshop registration
- `POST /api/incomes/course-registration` - Create income from course registration

## Usage Guide

### Admin Dashboard
1. **Login**: Access admin dashboard at `/admin/login`
2. **Workshop Management**: Create, edit, and manage workshops
3. **Financial Tracking**: Monitor income, expenses, and net profit
4. **Registration View**: Track all student registrations

### Workshop Creation
1. Navigate to "Create Workshop" tab
2. Fill in all required fields (title, dates, price, delivery mode)
3. Add optional details (teacher, incharge, venue, meeting link)
4. Upload poster image (optional)
5. Set workshop as active/inactive

### Expense Management
1. Go to "Income" tab in admin dashboard
2. Click "Add Expense" button
3. Fill in amount, category, description, and date
4. Submit to record the expense
5. View all expenses in the table below

### Financial Overview
- **Actual Income**: Real income from completed registrations
- **Total Expenses**: Admin-entered expenses
- **Net Income**: Income minus expenses
- **Potential Income**: Maximum possible income if all seats are filled

## File Structure

```
QrForm/
├── Backend/                 # Backend server
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   ├── shared/         # Shared utilities
│   │   └── app.ts          # Main server file
│   ├── prisma/             # Database schema and migrations
│   └── uploads/            # File uploads
├── qrfrontend/             # Frontend application
│   ├── src/
│   │   ├── admin/          # Admin dashboard components
│   │   ├── Forms/          # Registration forms
│   │   └── pages/          # Public pages
│   └── public/             # Static assets
└── README.md               # This file
```

## Configuration

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `APP_HOST`: Server host (default: localhost)
- `APP_PORT`: Server port (default: 7700)
- `JWT_SECRET`: Secret key for JWT tokens
- `NODE_ENV`: Environment (development/production)

### Database Configuration
- Ensure PostgreSQL is running
- Create a database named `qrform_db`
- Update the `DATABASE_URL` in `.env` file
- Run migrations to create tables

## Development

### Running in Development Mode
```bash
# Backend
cd Backend
npm run dev

# Frontend (in new terminal)
cd qrfrontend
npm run dev
```

### Building for Production
```bash
# Backend
cd Backend
npm run build
npm start

# Frontend
cd qrfrontend
npm run build
```

## Troubleshooting

### Common Issues
1. **Database Connection**: Ensure PostgreSQL is running and credentials are correct
2. **Port Conflicts**: Check if port 7700 is available for backend
3. **File Uploads**: Ensure uploads directory has write permissions
4. **CORS Issues**: Backend is configured to allow all origins in development

### Debug Mode
- Check browser console for frontend errors
- Monitor backend console for server errors
- Use browser dev tools to inspect network requests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
