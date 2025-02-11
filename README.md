# AGRICONNECT - FARMER-CONSUMER MARKETPLACE

A web platform connecting farmers directly with bulk consumers (restaurants, supermarkets, food processors) for efficient agricultural trade.

## OVERVIEW

AgriConnect streamlines the agricultural supply chain by providing a direct marketplace where farmers can list their produce and bulk consumers can place orders. The platform features real-time order tracking, inventory management, and analytics.

## KEY FEATURES

### FARMER PORTAL:
- Product listing and management
- Order tracking and fulfillment
- Inventory monitoring
- Sales analytics dashboard
- Profile management

### CONSUMER PORTAL:
- Browse available produce
- Place and track orders
- Order history
- Real-time status updates
- Business profile management

## TECH STACK

### Frontend:
- React.js
- Material-UI components
- Chart.js for analytics
- React Router v7
- Axios for API calls

### Backend:
- Node.js
- Express.js
- MongoDB
- JWT authentication

## GETTING STARTED

1. **Clone repository:**
   ```sh
   git clone https://github.com/VirajBP/Nexathon.git
   ```

## INSTALLATION

### 2. Install dependencies:
#### Client:
```sh
cd client
npm install
```

#### Server:
```sh
cd server
npm install
```

### 3. Configure environment:
Create `.env` files in both client and server directories:

#### client/.env:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### server/.env:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### 4. Start development servers:
#### Client:
```sh
cd client
npm start
```

#### Server:
```sh
cd server
npm start
```

## DEVELOPMENT WORKFLOW

### 1. Frontend (Port 3000):
- React development server  
- Hot module replacement  
- Development proxy to backend  

### 2. Backend (Port 5000):
- Express API server  
- MongoDB connection  
- JWT authentication  

## DEPLOYMENT

### 1. Build frontend:
```sh
cd client
npm run build
```

### 2. Start production server:
```sh
cd server
npm start
```

## CONTRIBUTING

1. Fork repository  
2. Create feature branch  
3. Commit changes  
4. Push to branch  
5. Submit pull request  

## DIRECTORY STRUCTURE

```
client/
  ├── src/
  │   ├── components/
  │   │   ├── Auth/
  │   │   ├── Consumer/
  │   │   ├── Farmer/
  │   │   └── Shared/
  │   ├── mockData/
  │   └── App.jsx

server/
  ├── Controllers/
  ├── Model/
  ├── routes/
  └── server.js
```

## LICENSE

ISC License  

## CONTACT

Project Link: [GitHub Repository](https://github.com/VirajBP/Nexathon)

