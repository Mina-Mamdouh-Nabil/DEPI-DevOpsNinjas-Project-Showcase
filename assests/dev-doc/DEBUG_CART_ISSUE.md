# Debugging Cart Not Saving to Database

## The Problem
Frontend shows cart items but database `cart_items` table is empty.

## Root Cause
Frontend is falling back to localStorage instead of calling backend API.

## Step-by-Step Debugging

### Step 1: Check Browser Console Logs

Open browser console (F12) and look for these specific log messages when you add a product to cart:

#### What You Should See (if backend is being called):
```
[CartService] addToCart called for product: [Product Name]
[CartService] Is authenticated: true
[CartService] Product backend ID: 123
[CartService] Calling backend API to add product ID: 123
[CartService] Backend response: {...}
[CartService] Reloading cart from server...
```

#### What You Might Be Seeing (if falling back to localStorage):
```
[CartService] addToCart called for product: [Product Name]
[CartService] Is authenticated: false   <-- PROBLEM!
[CartService] Not authenticated - adding to localStorage
```

OR:
```
[CartService] Is authenticated: true
[CartService] Product backend ID: null   <-- PROBLEM!
[CartService] No backend ID found - falling back to localStorage
```

OR:
```
[CartService] Calling backend API to add product ID: 123
[CartService] Error adding to cart via API: [error details]   <-- PROBLEM!
[CartService] Falling back to localStorage
```

### Step 2: Check Authentication

In browser console, run:
```javascript
localStorage.getItem('auth_token')
```

**Expected Result:** Should return a JWT token string
**If null:** You're not logged in - that's why it's using localStorage!

### Step 3: Check Backend is Running

In browser console, run:
```javascript
fetch('http://localhost:8080/api/products')
  .then(r => r.json())
  .then(d => console.log('Backend is running, products:', d.length))
  .catch(e => console.error('Backend error:', e))
```

**Expected Result:** "Backend is running, products: X"
**If error:** Backend is not running or not accessible!

### Step 4: Check Network Tab

1. Open browser DevTools (F12)
2. Go to Network tab
3. Add a product to cart
4. Look for a request to: `POST http://localhost:8080/api/cart/items`

**If you DON'T see this request:** Backend is not being called
**If you DO see it:** Check the response:
- Status 200 = Success (but still check backend logs)
- Status 401 = Unauthorized (token invalid)
- Status 500 = Backend error
- Failed/Red = CORS or connection error

### Step 5: Verify Backend Logs

Check your backend terminal for logs when adding to cart.

**Expected logs:**
```
[OK] POST /api/cart/items - XXXms
```

**If you see error logs:**
- Copy the full error message
- It will tell us exactly what's wrong

### Step 6: Manual Backend Test

Test the backend API directly. First, get your token:

```javascript
// In browser console
console.log(localStorage.getItem('auth_token'))
```

Then in a new terminal, run:
```bash
# Replace YOUR_TOKEN_HERE with the actual token
curl -X POST "http://localhost:8080/api/cart/items?productId=1&quantity=1" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

**Expected Response:** JSON object with cart item details
**If error:** Backend has an issue

Then check database:
```sql
SELECT * FROM cart_items;
```

If you see a row, the backend works - issue is in frontend not calling it.

## Common Issues & Fixes

### Issue 1: Not Logged In
**Symptom:** `[CartService] Is authenticated: false`

**Solution:**
1. Go to http://localhost:4200/auth/login
2. Login with valid credentials
3. Check console for: `[CartService] Is authenticated: true`
4. Try adding to cart again

### Issue 2: Product Has No Backend ID
**Symptom:** `[CartService] Product backend ID: null`

**Solution:**
This means products are coming from hardcoded data, not backend API.

Check if homepage is loading products from backend:
1. Go to homepage
2. Console should show: Loading products from backend
3. If not, products are hardcoded

### Issue 3: Backend Not Running
**Symptom:** Network request fails, no backend logs

**Solution:**
```bash
cd backend
mvn spring-boot:run
```

Wait for: "Started ShopiNowApplication in X.XXX seconds"

### Issue 4: CORS Error
**Symptom:** 
```
Access to fetch at 'http://localhost:8080/api/cart/items' from origin 
'http://localhost:4200' has been blocked by CORS policy
```

**Solution:** Check backend CORS config allows http://localhost:4200

### Issue 5: 401 Unauthorized
**Symptom:** Backend returns 401 status

**Solution:**
- Token is invalid or expired
- Login again to get a fresh token
- Check backend JWT secret matches

## Next Steps

**Please do this:**

1. Open browser console (F12)
2. Clear console (trash icon)
3. Add a product to cart
4. Take a screenshot of ALL console logs
5. Also check Network tab for the POST request
6. Share what you see

This will tell us exactly where it's failing!

