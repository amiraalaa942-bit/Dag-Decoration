# 🎨 Fullstack Painting Store - Setup & User Guide
This is a complete e-commerce application for a painting store, built with Angular (frontend), Node.js/Express (backend), and PostgreSQL (database).

# 🚀 Quick Start Installation
Prerequisites
Ensure you have the following installed on your machine:

Node.js & npm

Docker & Docker Compose

Git

# Clone the Repository
Open powershell

git clone https://github.com/amiraalaa942-bit/Dag-Decoration.git

cd Dag-Decoration

Now you are in the correct folder to run project commands
# Backend Setup & Launch
Open powershell
# 1. Install backend dependencies
npm install

# 2. Start Docker and the PostgreSQL container
open docker desktop
run commands :
    
   1- docker run --name painting-postgres \
      -e POSTGRES_USER=your-user \
      -e POSTGRES_PASSWORD=your-pass \
      -e POSTGRES_DB=your-db \
      -p 5432:5432 \
      -v postgres_data:/var/lib/postgresql/data \
      -d postgres:15
      
   2-  docker ps
    
   3-  docker start painting-postgres

# 3. Run database migrations to set up tables
npm run migrate

# 4. Start the backend server
cd src
npm start
Backend server runs on http://localhost:3000

# Frontend Setup & Launch
open new powershell 
# 1. Navigate to the Angular frontend directory
cd My-Store

# 2. Install frontend dependencies
npm install

# 3. Start the Angular development server 
ng serve
Frontend server runs on http://localhost:4200

# 📁 Project Structure
Key directories and files in the repository:

My-Store/ - Angular frontend application

src/ - Node.js backend source code

migrations/ - Database migration scripts

uploads/ - Folder for uploaded painting assets (not tracked in Git)

.env.example - Template for environment variables (copy to .env and fill in your details)

# 🔧 Environment Configuration
Crucial Security Step: Before running the backend, you must create your environment file:

bash
cp .env.example .env
Then, open the new .env file and fill in your own values for:

Database credentials (POSTGRES_*)

JWT Secret Key (JWT_SecretKey)

Admin login (ADMIN_USER, ADMIN_PASS)

Email service configuration (for order notifications)

# 👥 Application Workflow & User Roles
# Step 1: Login
<p align="center">
  <img width="700" height="700" alt="image" src="https://github.com/user-attachments/assets/ae2b67f5-1f1e-4b31-aaef-714d628574ea" />
</p>
<p align="center">
Admin: Use the pre-configured admin credentials from the .env file </br>
Client: Register by clicking Create New Account button in login page 
</p>
<p align="center">
  <img width="500" height="600" alt="image" src="https://github.com/user-attachments/assets/00b12fb1-9b68-4d1e-911d-cfc2d054663a" />
</p>
<p align="center">
Enter your credentials and then log in with it
</p>
  
# Step 2.1: Admin Role Actions
<p align="center">
  <img width="600" height="600" alt="image" src="https://github.com/user-attachments/assets/7cbf8ac8-a844-4176-9908-0850ce23c824" />
</p>
<p align="center">
The paintings page will open
</p>

<p align="center">
  <img width="600" height="600" alt="image" src="https://github.com/user-attachments/assets/33e1da8b-addb-4ed2-826f-3abfb5ebf1b7" />
</p>
<p align="center">
You can add paintings by clicking the Add Painting button, entering details, and saving </br>
You can click on continue shopping to see the uploaded painting 
</p>


<p align="center">
  <img width="600" height="600" alt="image" src="https://github.com/user-attachments/assets/4e1b749a-2faf-46f8-8186-7fb81591926d"  style="border: 1px solid #000;" />
</p>
<p align="center">
  Uploaded painting images are stored in the uploads/ folder </br>
  You can delete a painting by clicking the delete button below it
</p>

# Step 2.2: Client Role Actions

<p align="center">
  <img width="600" height="600" alt="image" src="https://github.com/user-attachments/assets/b4fbdc06-8308-4741-b74d-796ea6a30e90" />
</p>
<p align="center">
Shopping : Add paintings to your cart from the main gallery.
</p>


<p align="center">
  <img width="500" height="500" alt="image" src="https://github.com/user-attachments/assets/662e9f5a-af83-4b61-b772-691e5ca17d24" />
</p>
<p align="center">
Manage Cart: Go to your cart to review items </br>
</p>

<p align="center">

# You can:

</p>



<p align="center">
  <img width="500" height="500" alt="image" src="https://github.com/user-attachments/assets/8e26f56a-5a39-441f-a6d5-725b4d48f4b4" />
</p>
<p align="center">
Increase (+) or decrease (-) quantities
</p>

<p align="center">
  <img width="500" height="500" alt="image" src="https://github.com/user-attachments/assets/e784a06b-8851-49ca-a88c-88aa4314ece6" />
</p>
<p align="center">
  Remove items entirely
</p>
  
<p align="center"> 
The total amount updates dynamically
</p>


# Step 3: Checkout 

<p align="center">
  <img width="600" height="600" alt="image" src="https://github.com/user-attachments/assets/619fd6d0-5b38-4711-b42d-a9ad506b2de9" />
</p>
<p align="center">
Enter your name, phone, and location in the form then click on Continue button
</p>

# Step 4: Confirm Order
<p align="center">
  <img width="600" height="600" alt="image" src="https://github.com/user-attachments/assets/a552a4d8-15e7-4f1d-8634-ed01e91de053" />
</p>
<p align="center">
Review your purchasing Info then click on Confirm button
</p>

# Step 5: Final Confirmation

<p align="center">
  <img width="600" height="600" alt="image" src="https://github.com/user-attachments/assets/a37f8101-0340-4fd0-b765-e7d10ea40b41" />

</p>
<p align="center">
✅ Your order has been successfully submitted. A notification has been sent to the administrative team for processing
</p>

# Step 6: Continue Shopping
Click Continue Shopping to return to the paintings page.

Note: Your shopping cart state is saved per session. If you log out and log back in later, your cart items will be preserved.

<p align="center"> 
  Enjoy your painting shopping experience! 🎨
</p>
