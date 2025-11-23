# Test Suite Documentation

## Overview
Comprehensive unit tests for the dev-event-nextjs-app project.

## Running Tests

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
```

## Test Coverage

- **lib/utils.ts**: Pure utility functions (slug generation, date/time formatting)
- **lib/mongodb.ts**: Database connection with caching
- **database/event.model.ts**: Event schema and validators
- **database/booking.model.ts**: Booking schema with email validation

## Key Features

- Comprehensive edge case coverage
- Mocked external dependencies
- TypeScript support with ts-jest
- Real-world scenario testing