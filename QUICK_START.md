# Quick Start Guide for New Features

## How to Use the New Cart System

### For Users

1. **Browse Products**: Visit `/items` page to see all products
2. **View Product Details**: Click on any product to see full details
3. **Add to Cart**: Click the "Add to Cart" button with quantity selector
4. **View Cart**: Click the cart icon in navbar to view shopping cart
5. **Manage Cart**: 
   - Increase/decrease quantities using +/- buttons
   - Remove items using trash icon
6. **Checkout**: Click "Proceed to Checkout" button

### For Developers

## Using the Cart Hook

```typescript
import { useCart } from '@/lib/cart-context';

export default function MyComponent() {
  const { 
    items,              // Array of CartItem objects
    addItem,            // Function to add item
    removeItem,         // Function to remove item
    updateQuantity,     // Function to update quantity
    clearCart,          // Function to clear entire cart
    getTotal,           // Function to get total price
    getItemCount        // Function to get total item count
  } = useCart();

  // Add item
  addItem(bakeryItem, 2);  // Add 2 of this item

  // Remove item
  removeItem(itemId);

  // Update quantity
  updateQuantity(itemId, 5);  // Set to 5 items

  // Get stats
  const total = getTotal();
  const count = getItemCount();
}
```

## Using Translations

```typescript
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations();

  return (
    <div>
      <h1>{t('cart.title')}</h1>
      <p>{t('cart.empty')}</p>
    </div>
  );
}
```

## Using the Loader Component

```typescript
import Loader from '@/components/loader';

export default function MyPage() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <Loader />;
  }

  return <div>Page content</div>;
}
```

## Translation Keys Reference

### Navigation (`nav.*`)
- `nav.brand` - Brand name
- `nav.home` - Home link
- `nav.items` - Items/Products link
- `nav.about` - About link
- `nav.terms` - Terms link
- `nav.cart` - Cart link
- `nav.contact` - Contact link
- `nav.profile` - Profile link

### Cart (`cart.*`)
- `cart.title` - Cart page title
- `cart.empty` - Empty cart message
- `cart.continue` - Continue shopping button
- `cart.total` - Total label
- `cart.subtotal` - Subtotal label
- `cart.shipping` - Shipping label
- `cart.checkout` - Checkout button
- `cart.remove` - Remove button
- `cart.quantity` - Quantity label
- `cart.removeItem` - Remove item button

### Profile (`profile.*`)
- `profile.title` - Profile title
- `profile.subtitle` - Profile subtitle
- `profile.stored` - Storage info text
- `profile.fullName` - Full name label
- `profile.mobileNo` - Mobile number label
- `profile.deliveryAddress` - Address label
- `profile.pinCodeLabel` - Pincode label
- `profile.saveChanges` - Save button
- `profile.saving` - Saving state
- `profile.saved` - Saved message
- `profile.clearData` - Clear button
- `profile.clearConfirm` - Confirmation text
- `profile.noDetails` - Alert text

### Item Details (`itemDetails.*`)
- `itemDetails.price` - Price label
- `itemDetails.caloriesPerServing` - Calories label
- `itemDetails.ingredients` - Ingredients label
- `itemDetails.tags` - Tags label
- `itemDetails.orderWhatsApp` - WhatsApp button
- `itemDetails.addToCart` - Add to cart button
- `itemDetails.cartAdded` - Added confirmation

### Modal (`modal.*`)
- `modal.deliveryDetails` - Modal title
- `modal.provideDetails` - Instructions text
- `modal.name` - Name label
- `modal.yourName` - Name placeholder
- `modal.mobileNumber` - Phone label
- `modal.mobile10Digit` - Phone placeholder
- `modal.address` - Address label
- `modal.fullAddress` - Address placeholder
- `modal.pincode` - Pincode label
- `modal.pincode6Digit` - Pincode placeholder
- `modal.proceedWhatsApp` - Submit button
- `modal.processing` - Processing state
- `modal.orderPlaced` - Success message

### Items Page (`items.*`)
- `items.title` - Page title
- `items.description` - Page description

### Loader (`loader.*`)
- `loader.loading` - Loading text

## Data Persistence

### Cart Data
- **Location**: `localStorage` key: `bakery_cart`
- **Format**: JSON array of CartItems
- **Persists**: Across page refreshes and browser sessions
- **Cleared**: Only when user explicitly clears cart

### Profile Data
- **Location**: `localStorage` key: `bakery_user_info`
- **Format**: JSON object with name, mobile, address, pincode
- **Persists**: Across page refreshes
- **Cleared**: When user clicks "Clear saved data" button

## Common Tasks

### Add Translation Key

1. Open `/messages/en.json`
2. Add key: `"myKey": "English text"`
3. Open `/messages/bn.json`
4. Add key: `"myKey": "Bengali text"`
5. In component: `const t = useTranslations(); t('myKey')`

### Add New Page with Cart Support

1. Create page component
2. Wrap with locale prefix: `/app/[locale]/newpage/page.tsx`
3. Use `useCart()` hook if needed
4. Use `useTranslations()` for text
5. Add translations to en.json and bn.json

### Modify Cart Calculation

1. Edit `/lib/cart-context.ts`
2. Update `getTotal()` function
3. Or update shipping calculation in cart page

## Testing the Features

### Test Cart Functionality
```bash
1. Go to http://localhost:3000/en/items
2. Click on a product
3. Click "Add to Cart"
4. Verify cart count in navbar increases
5. Click cart icon or go to /en/cart
6. Verify product appears in cart
7. Test +/- quantity buttons
8. Test remove button
9. Refresh page - cart should persist
```

### Test Profile Alert
```bash
1. Go to http://localhost:3000/en/profile
2. Don't fill form - yellow alert should show
3. Fill form and click Save
4. Alert should disappear
5. Go to another page and back
6. Alert should not show (data saved)
```

### Test Translations
```bash
1. Go to http://localhost:3000/en/items
2. Click language dropdown (EN)
3. Select Bengali (বাংলা)
4. Verify URL changes to /bn/items
5. Verify all text is in Bengali
6. Click English again
7. Verify text is in English
```

### Test Loader
```bash
1. Go to /en/cart page
2. Should briefly show spinner with icon
3. Disappears after 600ms
4. Icon should be rotating
5. Dots below should be animated
```

## Performance Tips

- Cart context is memoized to prevent unnecessary renders
- Translation keys are cached by next-intl
- Loader component uses CSS animations (not JavaScript)
- localStorage calls are minimal (on mount and on change)

## Troubleshooting

### Cart Not Persisting
- Check if localStorage is enabled
- Check browser console for errors
- Clear localStorage: `localStorage.clear()`
- Try incognito/private mode

### Translations Not Showing
- Verify key exists in en.json and bn.json
- Check spelling matches exactly
- Restart dev server
- Clear `.next` folder

### Cart Count Not Updating
- Ensure CartProvider wraps your component
- Check if useCart() is called after CartProvider
- Verify getItemCount() is working in component

### Loader Not Showing
- Verify isLoading state is true
- Check if Loader component is imported
- Ensure /icon.png exists
- Check browser console for errors

## Dependencies

- `next-intl` - Internationalization
- `lucide-react` - Icons
- React Context API - State management
- localStorage - Data persistence

No external libraries needed for cart functionality - uses native React features!
