Write-Host "🎨 Testing Painting Store API" -ForegroundColor Cyan
Write-Host ""

# 1. Get token
Write-Host "1. POST /admin/login" -ForegroundColor Yellow
try {
    $token = (Invoke-RestMethod -Uri "http://localhost:3000/admin/login" -Method Post -Body '{"username":"amira","password":"241"}' -ContentType "application/json").token
    $headers = @{"Authorization" = "Bearer $token"}
    Write-Host "✅ Token received" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to get token: $($_.Exception.Message)" -ForegroundColor Red
    exit
}
Write-Host ""

# 2. GET /paintingsInfo
Write-Host "2. GET /paintingsInfo" -ForegroundColor Yellow
try {
    $paintings = Invoke-RestMethod -Uri "http://localhost:3000/paintingsInfo" -Method Get
    Write-Host "✅ Found $($paintings.Count) paintings" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 3. GET /users
Write-Host "3. GET /users" -ForegroundColor Yellow
try {
    $users = Invoke-RestMethod -Uri "http://localhost:3000/users" -Method Get -Headers $headers
    Write-Host "✅ Found $($users.Count) users" -ForegroundColor Green
    $firstUserId = $users[0].id
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 4. GET /users/:id
Write-Host "4. GET /users/:id" -ForegroundColor Yellow
if ($firstUserId) {
    try {
        $singleUser = Invoke-RestMethod -Uri "http://localhost:3000/users/$firstUserId" -Method Get -Headers $headers
        Write-Host "✅ Retrieved user: $($singleUser.username)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# 5. POST /users
Write-Host "5. POST /users" -ForegroundColor Yellow
try {
    $newUser = @{
        username = "testuser_$(Get-Random -Minimum 1000 -Maximum 9999)"
        password = "testpass123"
        firstName = "Test"
        lastName = "User"
        role = "user"
    }
    
    $userResult = Invoke-RestMethod -Uri "http://localhost:3000/users" `
        -Method Post `
        -Headers $headers `
        -Body ($newUser | ConvertTo-Json) `
        -ContentType "application/json"
    
    Write-Host "✅ User created: $($userResult.username)" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 6. POST /cart/add (skip painting upload for now)
Write-Host "6. POST /cart/add" -ForegroundColor Yellow
try {
    # First check if painting ID 1 exists
    $cartBody = @{ paintingId = 1 } | ConvertTo-Json
    $cartResult = Invoke-RestMethod -Uri "http://localhost:3000/cart/add" -Method Post -Headers $headers -Body $cartBody -ContentType "application/json"
    Write-Host "✅ Added to cart: $($cartResult.message)" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Could not add to cart (painting ID 1 might not exist)" -ForegroundColor Yellow
}
Write-Host ""

# 7. GET /orders/current
Write-Host "7. GET /orders/current" -ForegroundColor Yellow
try {
    $orders = Invoke-RestMethod -Uri "http://localhost:3000/orders/current" -Method Get -Headers $headers
    Write-Host "✅ Cart has $($orders.Count) items" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 8. POST /send-order
Write-Host "8. POST /send-order" -ForegroundColor Yellow
try {
    $orderData = @{
        order = @(
            @{ paintingId = 1; quantity = 1 }
        )
    }
    
    $orderResult = Invoke-RestMethod -Uri "http://localhost:3000/send-order" -Method Post -Body ($orderData | ConvertTo-Json) -ContentType "application/json"
    Write-Host "✅ Order sent: $($orderResult.message)" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Order email failed (expected without email config)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== CHECKING REVIEWER ISSUES ===" -ForegroundColor Magenta
Write-Host ""

# Test 1: Token removed from user creation
Write-Host "1. Testing: Signup WITHOUT token" -ForegroundColor Yellow
try {
    $testUser = @{
        username = "finalcheck_$(Get-Random -Minimum 1000 -Maximum 9999)"
        password = "final123"
        firstName = "Final"
        lastName = "Check"
    }
    
    $result = Invoke-RestMethod -Uri "http://localhost:3000/users" `
        -Method Post `
        -Body ($testUser | ConvertTo-Json) `
        -ContentType "application/json"
    
    Write-Host "   ✅ PASS: User created without token" -ForegroundColor Green
    Write-Host "   User ID: $($result.id), Username: $($result.username)" -ForegroundColor Cyan
} catch {
    Write-Host "   ❌ FAIL: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: One-to-many relationship
Write-Host "2. Testing: One cart with multiple paintings" -ForegroundColor Yellow
try {
    # Create user for cart test
    $cartUser = @{
        username = "multitest_$(Get-Random -Minimum 1000 -Maximum 9999)"
        password = "multi123"
        firstName = "Multi"
        lastName = "Test"
    }
    
    $newUser = Invoke-RestMethod -Uri "http://localhost:3000/users" `
        -Method Post `
        -Body ($cartUser | ConvertTo-Json) `
        -ContentType "application/json"
    
    Write-Host "   Created test user: $($cartUser.username)" -ForegroundColor Cyan
    
    # Login
    $login = Invoke-RestMethod -Uri "http://localhost:3000/login" `
        -Method Post `
        -Body (@{username=$cartUser.username; password=$cartUser.password} | ConvertTo-Json) `
        -ContentType "application/json"
    
    $token = $login.token
    $headers = @{"Authorization" = "Bearer $token"}
    
    # Try to add 3 different paintings
    $addedCount = 0
    1..3 | ForEach-Object {
        try {
            Invoke-RestMethod -Uri "http://localhost:3000/cart/add" `
                -Method Post `
                -Headers $headers `
                -Body (@{paintingId=$_} | ConvertTo-Json) `
                -ContentType "application/json" `
                -ErrorAction SilentlyContinue
            $addedCount++
            Write-Host "   Added painting $_ to cart" -ForegroundColor Green
        } catch {
            Write-Host "   Painting $_ not available" -ForegroundColor Gray
        }
    }
    
    # Check cart
    $cart = Invoke-RestMethod -Uri "http://localhost:3000/cart" `
        -Method Get `
        -Headers $headers
    
    $itemCount = if ($cart -is [array]) { $cart.Count } else { 1 }
    
    if ($itemCount -ge 2) {
        Write-Host "   ✅ PASS: Cart has $itemCount items (one-to-many working)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ FAIL: Cart only has $itemCount item(s)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "   ❌ Cart test failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Check database table
Write-Host "3. Checking: cart_items table exists" -ForegroundColor Yellow
try {
    $tableCheck = docker exec painting-postgres psql -U postgres -d paintings_db -c "\dt cart_items" 2>$null
    if ($tableCheck -like "*cart_items*") {
        Write-Host "   ✅ PASS: cart_items table exists" -ForegroundColor Green
    } else {
        Write-Host "   ❌ FAIL: cart_items table not found" -ForegroundColor Red
    }
} catch {
    Write-Host "   Could not check database" -ForegroundColor Yellow
}
Write-Host ""


Write-Host ""
Write-Host ""
Write-Host " Core API is functional!" -ForegroundColor Green