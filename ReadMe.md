## installation and launch of the fullstack project 


# Setup of backend only 
1. `npm install`  => to install all dependencies 
2. `docker ps` => start docker 
3. `docker start painting-postgres` =>start container
4. `npm run migrate` => to run all migrations up  , or `npm run migrate:down ` => to run migrations down
5. `npm start`=> start server but first `cd src`

# Setup of frontend only 

1. `ng serve` => To start a local development server
Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## steps of project
1. you have to login first 
    ->  admin credentials 
    -> if client credentials you can register and create new client then log in with it's credentials 

2. for admin role 
    -> the paintings page will be open then you can add paintings by clicking button you can enter details of painting then go back to paintings to see the new paintings uploaded 
    -> you also can delete painintg if you want by clicking delete button after each painting

3. for client role 
    -> once you log in the paintings page will be open you can add to cart the paintings you want 
    -> you go to cart to check all info , if you want to add more of the same paintings or remove it you can do that by clicking + to add more or - to decrease or delete
    once you do that the total amount will change dynamically 
    -> you should enter client info in the form name, phone and location
    -> if you clicked confirm it'll navigate you to confirmation to review all data and confirm order then the order will be successfuly sent to admin email to prepare the order
    -> if you clicked continue shopping it will navigate you back to paintings page 
    -> you can also if you didn't want to buy now and put items in cart then  logged out , you can login again and your cart will be at the state you left it 


assets exist in uploads folder 

