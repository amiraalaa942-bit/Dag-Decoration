## Database Schema (Current Implementation)

### paintings table (Products)
| Column | Type | Description |
|--------|------|-------------|
| picId | SERIAL PRIMARY KEY | Unique painting identifier |
| name | VARCHAR(255) | Painting name |
| price | DECIMAL | Price in USD |
| height | DECIMAL | Painting height |
| width | DECIMAL | Painting width |
| picUrl | VARCHAR | Image URL path |

### cart table (Orders)
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PRIMARY KEY | Cart item ID |
| userId | INTEGER REFERENCES users(id) | User who owns the cart |
| paintingId | INTEGER REFERENCES paintings(picId) | Painting in cart |
| quantity | INTEGER | Quantity of painting |
| status | VARCHAR(20) DEFAULT 'active' | Order status (active/complete) |

### users table
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PRIMARY KEY | User ID |
| username | VARCHAR(255) UNIQUE | Username for login |
| password | VARCHAR(255) | Hashed password |
| first_name | VARCHAR(100) | First name |
| last_name | VARCHAR(100) | Last name |
| role | VARCHAR(50) DEFAULT 'user' | User role (user/admin) |

## Actual API Routes

### Paintings
- `GET /paintingsInfo` - Get all paintings
- `GET /paintingImage/:id` - Get painting image (optional Height, Width query params)
- `POST /paintings` - Upload new painting (requires JWT)

### Users  
- `GET /users` - Get all users (requires JWT)
- `GET /users/:id` - Get specific user (requires JWT)
- `POST /users` - Create user (requires JWT)

### Cart/Orders
- `GET /orders/current` - Get current active cart (requires JWT)
- `POST /cart/add` - Add item to cart (requires JWT)
- `POST /send-order` - Process order (no auth required)

### Authentication
- `POST /admin/login` - Admin login

handler folder is src folder
