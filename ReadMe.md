🎨 Fullstack Painting Store - Setup & User Guide
This is a complete e-commerce application for a painting store, built with Angular (frontend), Node.js/Express (backend), and PostgreSQL (database).

🚀 Quick Start Installation
Prerequisites
Ensure you have the following installed on your machine:

Node.js & npm

Docker & Docker Compose

Git

1. Clone the Repository
bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
cd YOUR-REPO-NAME
2. Backend Setup & Launch
bash
# 1. Install backend dependencies
npm install

# 2. Start Docker and the PostgreSQL container
docker ps
docker start painting-postgres

# 3. Run database migrations to set up tables
npm run migrate

# 4. Start the backend server (API runs on http://localhost:3000)
cd src
npm start
3. Frontend Setup & Launch
bash
# 1. Navigate to the Angular frontend directory
cd ../My-Store

# 2. Install frontend dependencies
npm install

# 3. Start the Angular development server (App runs on http://localhost:4200)
ng serve
Once the server is running, open your browser and navigate to http://localhost:4200/. The application will automatically reload whenever you modify any of the source files.

👥 Application Workflow & User Roles
Step 1: Login
Admin: Use the pre-configured admin credentials from the .env file.

Client: Register a new account from the login page and then log in with the new credentials.

Step 2: Admin Role Actions
The paintings page will open.

You can add paintings by clicking the "Add" button, entering details, and saving.

You can delete a painting by clicking the delete button next to it.

Uploaded painting images are stored in the uploads/ folder.

Step 3: Client Role Actions
Browse & Cart: Add paintings to your cart from the main gallery.

Manage Cart: Go to your cart to review items. You can:

Increase (+) or decrease (-) quantities.

Remove items entirely.

The total amount updates dynamically.

Checkout: Enter your name, phone, and location in the form.

Confirm Order: Click "Confirm" to review all data and finalize the purchase. An order confirmation email is sent to the admin.

Continue Shopping: Click "Continue Shopping" to return to the paintings page.

Note: Your shopping cart state is saved per session. If you log out and log back in later, your cart items will be preserved.

📁 Project Structure
Key directories and files in the repository:

My-Store/ - Angular frontend application

src/ - Node.js backend source code

migrations/ - Database migration scripts

uploads/ - Folder for uploaded painting assets (not tracked in Git)

.env.example - Template for environment variables (copy to .env and fill in your details)

🔧 Environment Configuration
Crucial Security Step: Before running the backend, you must create your environment file:

bash
cp .env.example .env
Then, open the new .env file and fill in your own values for:

Database credentials (POSTGRES_*)

JWT Secret Key (JWT_SecretKey)

Admin login (ADMIN_USER, ADMIN_PASS)

Email service configuration (for order notifications)

