# Development Guide for QuickBite

This guide will help you understand how to develop and test the QuickBite application.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- A code editor (VS Code recommended)

### Initial Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your GOOGLE_GENAI_API_KEY
   ```

## 🧪 Testing

### Running Tests

**Run all tests:**
```bash
npm test
```

**Run tests once (no watch mode):**
```bash
npm test -- --run
```

**Run tests with coverage:**
```bash
npm test -- --coverage
```

**Run tests in watch mode (automatically re-runs on file changes):**
```bash
npm test -- --watch
```

### Understanding Test Results

When you run tests, you'll see output like:
```
✓ useCart (8)
  ✓ should initialize with empty cart
  ✓ should add item to cart
  ✓ should increment quantity when adding same item twice
  ✓ should remove item from cart
  ✓ should update item quantity
  ✓ should remove item when quantity is set to 0
  ✓ should clear cart
  ✓ should calculate total price correctly with multiple items
```

Each ✓ means a test passed. If a test fails, you'll see a ✗ and error details.

### Writing New Tests

Tests are located in `src/**/__tests__/` directories. Example test file structure:

```typescript
import { describe, it, expect } from 'vitest';

describe('YourComponent', () => {
  it('should do something', () => {
    // Your test code here
    expect(true).toBe(true);
  });
});
```

## 💻 Development

### Starting the Development Server

**Run development server:**
```bash
npm run dev
```

The app will be available at: **http://localhost:9002**

- The server automatically reloads when you make changes
- Hot module replacement updates the page without full refresh
- Error messages appear in the browser console

### Making Changes

1. **Edit files** in the `src/` directory
2. **Save the file** - the dev server automatically rebuilds
3. **View changes** in your browser (refresh if needed)

### Development Workflow

1. **Start dev server**: `npm run dev`
2. **Make your changes** to code files
3. **View in browser** at http://localhost:9002
4. **Test your changes** manually in the browser
5. **Write/run tests** to verify functionality
6. **Fix any errors** that appear

## 🏗️ Building for Production

### Build the Application

```bash
npm run build
```

This creates an optimized production build in the `.next/` folder.

### Type Checking

Check for TypeScript errors without building:

```bash
npm run typecheck
```

This will show you any type errors in your code.

### Running Production Build

After building, test the production version:

```bash
npm start
```

The production server runs on: **http://localhost:3000**

## 📝 Common Tasks

### Adding a New Component

1. Create file in `src/components/YourComponent.tsx`
2. Write your component code
3. Import and use it where needed
4. Test it in the browser

Example:
```typescript
// src/components/YourComponent.tsx
export default function YourComponent() {
  return <div>Hello World</div>;
}
```

### Adding a New Page

1. Create file in `src/app/your-page/page.tsx`
2. Export a default function component
3. Access at `http://localhost:9002/your-page`

### Modifying Cart Functionality

Cart logic is in `src/hooks/useCart.tsx`. When you change it:

1. Update the hook code
2. Run tests: `npm test -- --run`
3. Test manually in the browser
4. Verify cart works correctly

### Debugging

**Browser Console:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API issues

**VS Code Debugging:**
- Press F5 to start debugging
- Set breakpoints by clicking left of line numbers
- Step through code to find issues

## 🔍 Testing Your Changes

### Manual Testing Checklist

Before committing changes, test:

- [ ] Page loads without errors
- [ ] Navigation works
- [ ] Cart add/remove functions
- [ ] Quantity updates work
- [ ] Checkout flow works
- [ ] Search functionality works
- [ ] No console errors
- [ ] Responsive design (mobile/tablet/desktop)

### Automated Testing

After making changes:

1. **Run tests**: `npm test -- --run`
2. **Check types**: `npm run typecheck`
3. **Build**: `npm run build`
4. **Fix any errors**

## 📚 File Structure

```
src/
├── app/              # Pages and routes
│   ├── page.tsx      # Home page
│   ├── checkout/     # Checkout page
│   └── restaurants/  # Restaurant pages
├── components/       # React components
│   ├── CartSheet.tsx
│   ├── Header.tsx
│   └── ui/          # UI component library
├── hooks/           # Custom React hooks
│   ├── useCart.tsx
│   └── __tests__/   # Test files
├── lib/             # Utilities and data
│   └── data.ts      # Restaurant data
└── actions/         # Server actions
    └── recommend.ts
```

## 🐛 Common Issues

### Port Already in Use

If port 9002 is busy:
```bash
# Find process using port
netstat -ano | findstr :9002
# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Tests Not Running

- Make sure dependencies are installed: `npm install`
- Check test file is named `*.test.tsx` or `*.test.ts`
- Verify vitest.config.ts exists

### Build Errors

- Run `npm run typecheck` to see TypeScript errors
- Fix type errors first
- Then try building again

### Module Not Found

- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

## 💡 Tips

1. **Keep tests passing**: Don't commit code with failing tests
2. **Test before committing**: Run tests and typecheck
3. **Use TypeScript**: Let TypeScript catch errors early
4. **Check browser console**: Look for runtime errors
5. **Use React DevTools**: Install browser extension for debugging

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Vitest Documentation](https://vitest.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

