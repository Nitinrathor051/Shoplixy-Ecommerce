Shoplixy-ecommerce

Shoplixy is a full-stack e-commerce app built using the MERN stack.

Tech Stack

React.js (Vite)

Node.js and Express.js

MongoDB

Axios and JWT

Installation

Backend:
cd Backend
npm install
npm start

Frontend:
cd Frontend
npm install
npm run dev

.env (in Backend folder)
PORT=5000
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_secret_key

Folder Structure
Shoplixy-ecommerce
├── .gitignore
├── README.md
├── Backend
│ ├── package.json
│ ├── package-lock.json
│ └── src
│ ├── server.js
│ ├── controllers
│ │ ├── cartController.js
│ │ ├── orderController.js
│ │ ├── productController.js
│ │ ├── userController.js
│ │ └── validator.js
│ ├── middleware
│ │ └── authMiddleware.js
│ ├── models
│ │ ├── cartModel.js
│ │ ├── orderModel.js
│ │ ├── productModel.js
│ │ └── userModel.js
│ └── routes
│ └── route.js
├── Frontend
│ ├── package.json
│ ├── package-lock.json
│ ├── index.html
│ ├── eslint.config.js
│ ├── vite.config.js
│ ├── public
│ └── src
│ ├── App.css
│ ├── App.jsx
│ ├── main.jsx
│ ├── assets
│ │ ├── icon.png
│ │ └── react.svg
│ ├── Components
│ │ ├── LoginModal.jsx
│ │ ├── Modal.css
│ │ ├── Navbar.css
│ │ ├── Navbar.jsx
│ │ └── SignupModal.jsx
│ ├── Pages
│ │ ├── About.css
│ │ ├── About.jsx
│ │ ├── AddProduct.css
│ │ ├── AddProduct.jsx
│ │ ├── Cart.css
│ │ ├── Cart.jsx
│ │ ├── Contact.css
│ │ ├── Contact.jsx
│ │ ├── Home.css
│ │ ├── Home.jsx
│ │ ├── Order.jsx
│ │ └── Profile.jsx
│ └── services
│ ├── axiosConfig.js
│ ├── cartService.js
│ ├── orderService.js
│ ├── productService.js
│ └── userService.js

Author
Nitin Rathor
Email: nitinrathor0505feaid@gmail.com
GitHub: https://github.com/Nitinrathor051