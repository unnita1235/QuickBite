# Testing Guide for QuickBite

This guide explains how to write and run tests for the QuickBite application.

## 🧪 Test Framework

We use **Vitest** for testing, which is fast and works great with React and TypeScript.

## Running Tests

### Basic Commands

**Run all tests:**
```bash
npm test
```

**Run tests once (exit after running):**
```bash
npm test -- --run
```

**Run tests in watch mode (auto-rerun on changes):**
```bash
npm test -- --watch
```

**Run specific test file:**
```bash
npm test useCart
```

## 📁 Test File Organization

Tests are placed next to the code they test:

```
src/
└── hooks/
    ├── useCart.tsx          # Source code
    └── __tests__/
        └── useCart.test.tsx # Test file
```

## ✍️ Writing Tests

### Test Structure

```typescript
import { describe, it, expect } from 'vitest';

describe('Component or Function Name', () => {
  it('should do something specific', () => {
    // Arrange: Set up test data
    const input = 'test';
    
    // Act: Execute the code being tested
    const result = functionToTest(input);
    
    // Assert: Verify the result
    expect(result).toBe('expected output');
  });
});
```

### Example: Testing Cart Functionality

Here's how we test the cart hook:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../useCart';

describe('useCart', () => {
  // Setup code runs before each test
  beforeEach(() => {
    // Clear localStorage before each test
  });

  it('should add item to cart', () => {
    // Create a wrapper with CartProvider
    const wrapper = ({ children }) => (
      <CartProvider>{children}</CartProvider>
    );

    // Render the hook
    const { result } = renderHook(() => useCart(), { wrapper });

    // Perform action
    act(() => {
      result.current.addToCart(mockItem);
    });

    // Check result
    expect(result.current.cartItems).toHaveLength(1);
  });
});
```

## 🎯 Common Test Patterns

### Testing React Hooks

```typescript
import { renderHook, act } from '@testing-library/react';

it('tests a custom hook', () => {
  const { result } = renderHook(() => useYourHook());
  
  act(() => {
    result.current.someMethod();
  });
  
  expect(result.current.value).toBe(expected);
});
```

### Testing Components

```typescript
import { render, screen } from '@testing-library/react';
import YourComponent from './YourComponent';

it('renders component', () => {
  render(<YourComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

### Testing Async Code

```typescript
it('handles async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});
```

### Mocking

```typescript
import { vi } from 'vitest';

// Mock a function
const mockFn = vi.fn();

// Mock a module
vi.mock('./module', () => ({
  exportedFunction: vi.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
```

## ✅ Current Test Coverage

### Cart Tests (`useCart.test.tsx`)

We currently test:

1. ✅ **Cart Initialization** - Cart starts empty
2. ✅ **Add Item** - Adding item works correctly
3. ✅ **Increment Quantity** - Adding same item increases quantity
4. ✅ **Remove Item** - Removing items works
5. ✅ **Update Quantity** - Manually setting quantity works
6. ✅ **Clear Cart** - Clearing all items works
7. ✅ **Total Price** - Price calculations are correct

## 📝 Writing New Tests

### Step-by-Step Guide

1. **Identify what to test**
   - What function or component needs testing?
   - What are the important behaviors?

2. **Create test file**
   - Create `__tests__` folder if needed
   - Create `YourComponent.test.tsx` file

3. **Write test cases**
   - Test happy path (normal use)
   - Test edge cases (empty, null, invalid input)
   - Test error cases

4. **Run tests**
   ```bash
   npm test YourComponent
   ```

5. **Fix issues**
   - Read error messages
   - Fix code or tests as needed
   - Re-run tests

### Example: Testing a New Component

Let's say you create a `Button` component:

```typescript
// src/components/Button.tsx
export default function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}
```

Create test file:

```typescript
// src/components/__tests__/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click Me</Button>);
    await user.click(screen.getByText('Click Me'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 🔍 Test Assertions

Common assertions you can use:

```typescript
// Equality
expect(value).toBe(5);
expect(value).toEqual({ name: 'test' });

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();

// Numbers
expect(value).toBeGreaterThan(5);
expect(value).toBeLessThan(10);

// Arrays
expect(array).toHaveLength(3);
expect(array).toContain('item');

// Objects
expect(obj).toHaveProperty('name');
expect(obj).toMatchObject({ name: 'test' });

// Strings
expect(string).toContain('substring');
expect(string).toMatch(/pattern/);

// Errors
expect(() => func()).toThrow();
expect(() => func()).toThrow('error message');
```

## 🚨 Debugging Tests

### Test Output

When a test fails, Vitest shows:
- Which test failed
- Expected vs actual value
- Stack trace showing where it failed

### Using console.log

```typescript
it('debugs values', () => {
  const value = calculateSomething();
  console.log('Debug value:', value);
  expect(value).toBe(expected);
});
```

### Using Debugger

```typescript
it('debugs with breakpoint', () => {
  debugger; // Browser will pause here
  const value = calculateSomething();
  expect(value).toBe(expected);
});
```

## 📊 Test Coverage

Run tests with coverage report:

```bash
npm test -- --coverage
```

This shows which parts of your code are tested.

## 💡 Best Practices

1. **Test behavior, not implementation**
   - Test what the code does, not how it does it

2. **One assertion per test**
   - Each test should verify one thing

3. **Use descriptive test names**
   - "should add item to cart" not "test1"

4. **Arrange-Act-Assert pattern**
   - Set up, execute, verify

5. **Keep tests simple**
   - Complex tests are hard to understand and maintain

6. **Test edge cases**
   - Empty arrays, null values, boundary conditions

7. **Mock external dependencies**
   - Don't test API calls or localStorage directly

8. **Keep tests fast**
   - Tests should run quickly

## 🔗 Resources

- [Vitest Documentation](https://vitest.dev)
- [React Testing Library](https://testing-library.com/react)
- [Jest Matchers](https://vitest.dev/api/expect.html)

