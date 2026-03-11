# IIIntl One Platform

## Current State
- Store, ProductDetail, Vendor, Cart pages are fully built with mock data and UI
- CartContext manages in-memory cart (lost on refresh)
- Cart has a demo checkout dialog with no real payment flow
- Orders shown in CartPage are static mock data
- WalletContext + WalletPage are live and wired to the Wallet backend module (linkWallet, unlinkWallet, getLinkedWallets, addTransaction, getTransactionHistory)
- Multi-currency display (ICP, USD, EUR, GBP) is live in WalletPage via WalletContext

## Requested Changes (Diff)

### Add
- Cart persistence via localStorage (survives page refreshes)
- Order history persistence via localStorage (keyed by user, simulating per-user order records)
- Real checkout flow: shows ICP price equivalent, deducts from wallet balance (mock), records a transaction via `addTransaction` backend call so it appears in Wallet transaction history
- Multi-currency price display in cart summary and checkout using WalletContext's active currency
- Wallet balance check in checkout: warn if balance may be insufficient
- ICP payment option in checkout dialog alongside existing flow

### Modify
- CartContext: add localStorage persistence for cart items
- CartPage: replace static mock orders with localStorage-persisted orders; wire checkout to wallet payment flow; show prices in active currency
- Checkout dialog: add currency display, ICP price, wallet selector (dropdown of linked wallets), and record transaction on confirm

### Remove
- Static hardcoded mock orders in CartPage (replaced by localStorage orders)

## Implementation Plan
1. Update CartContext to persist items to localStorage and restore on mount
2. Add an OrdersContext (or extend CartContext) to persist placed orders in localStorage
3. Update CartPage checkout dialog to:
   a. Import and use WalletContext for currency display and linked wallets
   b. Show ICP equivalent of subtotal
   c. Provide wallet selector dropdown if wallets are linked
   d. On checkout confirm: call `addTransaction` backend, save order to localStorage, clear cart
4. Replace static mock orders in CartPage My Orders tab with localStorage orders
5. Show currency-converted prices in cart summary using WalletContext active currency
