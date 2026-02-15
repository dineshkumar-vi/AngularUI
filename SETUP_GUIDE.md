# Angular UI Setup Guide

## Quick Start

### Prerequisites
Ensure you have the following installed:
- Node.js 20.x or higher
- npm 10.x or higher

### Installation Steps

1. **Clone the repository** (if not already done)
   ```bash
   git clone <repository-url>
   cd AngularUI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

## Development Commands

### Start Development Server
```bash
npm start
# or
ng serve
```
Runs the app in development mode at `http://localhost:4200`

### Build for Production
```bash
npm run build
```
Creates an optimized production build in the `dist/` directory

### Run Tests
```bash
# Run all tests
npm test

# Run tests in CI mode (headless)
npm run test:ci

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run e2e
```

### Linting
```bash
npm run lint
```

## Project Structure

```
AngularUI/
├── e2e/                        # End-to-end tests
│   └── src/
│       └── login.e2e-spec.ts   # Login E2E tests
├── src/
│   ├── app/                    # Application source code
│   │   ├── app.component.ts    # Main component
│   │   ├── app.component.spec.ts           # Component unit tests
│   │   ├── app.service.spec.ts             # Service tests
│   │   ├── form-validation.spec.ts         # Form validation tests
│   │   ├── login.integration.spec.ts       # Integration tests
│   │   ├── captcha.service.spec.ts         # Captcha tests
│   │   ├── performance.spec.ts             # Performance tests
│   │   ├── app.module.ts                   # Root module
│   │   └── app-routing.module.ts           # Routing configuration
│   ├── assets/                 # Static assets
│   ├── environments/           # Environment configurations
│   ├── index.html             # Main HTML file
│   ├── main.ts                # Application entry point
│   ├── polyfills.ts           # Browser polyfills
│   ├── styles.css             # Global styles
│   ├── test.ts                # Test configuration
│   └── karma.conf.js          # Karma test runner config
├── angular.json               # Angular CLI configuration
├── package.json               # npm dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── TEST_DOCUMENTATION.md      # Comprehensive test documentation
├── MIGRATION_GUIDE.md         # Angular 19 migration guide
└── SETUP_GUIDE.md            # This file
```

## Configuration Files

### angular.json
Angular CLI configuration for build, serve, and test commands.

### tsconfig.json
TypeScript compiler configuration with strict mode enabled.

### karma.conf.js
Karma test runner configuration for unit tests.

### package.json
Project dependencies and npm scripts.

## Testing

### Test Structure
The project includes comprehensive testing:
- **190+ test cases** covering all functionality
- **Unit tests** for individual components
- **Integration tests** for workflows
- **E2E tests** for user interactions
- **Performance tests** for benchmarking

### Running Specific Tests

#### Run a specific test file
```bash
ng test --include='**/app.component.spec.ts'
```

#### Run tests matching a pattern
```bash
ng test --include='**/*integration*.spec.ts'
```

#### Run tests with debugging
```bash
ng test --browsers=Chrome --watch
```

### Code Coverage

View coverage after running:
```bash
npm run test:coverage
```

Open `coverage/AngularUI/index.html` in your browser to see the detailed coverage report.

**Coverage Goals:**
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

## Development Workflow

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes
Edit files in the `src/` directory.

### 3. Run Tests
```bash
npm test
```

### 4. Build the Application
```bash
npm run build
```

### 5. Commit Changes
```bash
git add .
git commit -m "Description of changes"
```

### 6. Push to Remote
```bash
git push origin feature/your-feature-name
```

## Environment Configuration

### Development Environment
File: `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

### Production Environment
File: `src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.production.com'
};
```

### Using Environment Variables
```typescript
import { environment } from '../environments/environment';

// Use in your code
const apiUrl = environment.apiUrl;
```

## Backend API Configuration

The application connects to a backend API. Update the API endpoints in:
- `src/app/app.component.ts`

### API Endpoints
- **GET** `http://api.ipify.org/?format=jsonp` - Get user IP address
- **POST** `http://localhost:8080/captcha` - Generate captcha
- **POST** `http://localhost:8080/login` - Authenticate user

### Setting Up Backend (Optional)
If you need to run the backend locally, ensure it's running on `http://localhost:8080`.

## Troubleshooting

### Port Already in Use
If port 4200 is already in use:
```bash
ng serve --port 4201
```

### Node Modules Issues
If you encounter dependency issues:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
Clear cache and rebuild:
```bash
npm run clean
npm install
npm run build
```

### Test Failures
Run tests with more verbose output:
```bash
ng test --browsers=Chrome --watch
```

### Memory Issues
Increase Node.js memory limit:
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

## IDE Setup

### Visual Studio Code
Recommended extensions:
- Angular Language Service
- ESLint
- Prettier
- Angular Snippets

### Settings (.vscode/settings.json)
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

### WebStorm / IntelliJ IDEA
1. Enable Angular plugin
2. Set TypeScript version to project version
3. Enable ESLint

## Browser Support

The application supports the following browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Checking Browser Compatibility
See `src/browserslist` for detailed browser support configuration.

## Performance Optimization

### Development Mode
- Source maps enabled
- Optimizations disabled
- Fast rebuilds

### Production Mode
```bash
npm run build --configuration=production
```

**Optimizations:**
- Ahead-of-Time (AOT) compilation
- Tree-shaking
- Minification
- Code splitting
- Bundle size optimization

### Performance Monitoring
Performance tests are included in `src/app/performance.spec.ts`.

Run performance benchmarks:
```bash
ng test --include='**/performance.spec.ts'
```

## Deployment

### Build for Production
```bash
npm run build --configuration=production
```

### Deploy to Static Hosting
The `dist/AngularUI` folder contains the production build. Deploy this folder to:
- AWS S3 + CloudFront
- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting

### Example: Deploy to Netlify
```bash
npm install -g netlify-cli
npm run build
netlify deploy --dir=dist/AngularUI --prod
```

### Example: Deploy to Firebase
```bash
npm install -g firebase-tools
firebase init
npm run build
firebase deploy
```

## Security Considerations

### Best Practices
1. Never commit sensitive data (API keys, passwords)
2. Use environment variables for configuration
3. Enable Content Security Policy (CSP)
4. Keep dependencies updated
5. Use HTTPS in production

### Dependency Auditing
Check for vulnerabilities:
```bash
npm audit
npm audit fix
```

## Continuous Integration

### GitHub Actions Example
Create `.github/workflows/ci.yml`:

```yaml
name: CI

on: [push, pull_request]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm run test:ci

      - name: Run coverage
        run: npm run test:coverage

      - name: Build
        run: npm run build --configuration=production
```

## Documentation

### Key Documentation Files
- **TEST_DOCUMENTATION.md** - Comprehensive testing guide
- **MIGRATION_GUIDE.md** - Angular 19 migration instructions
- **SETUP_GUIDE.md** - This file

### API Documentation
Document your components using JSDoc:

```typescript
/**
 * Submits the login form after validation
 * @returns void
 */
submit(): void {
  // Implementation
}
```

## Getting Help

### Resources
- [Angular Documentation](https://angular.io/docs)
- [Angular CLI](https://angular.io/cli)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

### Community
- [Angular Discord](https://discord.gg/angular)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/angular)
- [Angular GitHub](https://github.com/angular/angular)

### Project Issues
For project-specific issues, check the repository's issue tracker.

## License

See LICENSE file in the repository.

## Contributors

See CONTRIBUTORS.md for the list of contributors.

## Changelog

### Version 19.0.0
- Updated to Angular 19.0.0
- Added comprehensive test suite (190+ tests)
- Updated all dependencies to latest stable versions
- Improved TypeScript strict mode compliance
- Enhanced build configuration
- Added performance testing suite
- Updated documentation

### Version 7.2.0 (Previous)
- Initial Angular 7 implementation
- Basic login functionality
- Captcha integration
