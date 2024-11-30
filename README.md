# Price Monitor

A robust price monitoring tool designed to scrape product prices from web pages. This project leverages Puppeteer for browser automation and provides platform-specific configurations for Chrome execution.

## Features

- **Cross-Platform Compatibility**: Automatically handles Chrome paths for macOS, Windows, and Linux.
- **Bundled Chrome Support**: Ensures consistent behavior by using a specific Chrome version.
- **Error-Resilient Scraping**: Handles edge cases like missing elements or empty content gracefully.
- **Customizable Selectors**: Adaptable to different webpage structures for scraping prices or other data.
- **Lightweight**: Includes a custom Puppeteer cache to minimize repetitive downloads.

---

## File Structure

```
price-monitor/
├── src/
│   ├── price-scraper.js      # Main script for scraping prices
│   ├── utils.js              # Utility functions (e.g., number extraction)
├── chrome/                   # Bundled Chrome binaries for macOS
│   └── mac_arm-121.0.6167.85 # Example folder for Chrome version
├── .puppeteer_cache/         # Puppeteer cache for browser downloads
├── package.json              # Metadata and dependencies
├── README.md                 # Project documentation
└── LICENSE                   # License information
```

---

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

Ensure you have sufficient permissions for executing binaries (e.g., Chrome).

---

## Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/price-monitor.git
cd price-monitor
```

### 2. Install Dependencies
```bash
npm install
```

---

## Usage

### Running the Scraper

The script fetches the price of a product from the provided URL using Puppeteer:

1. **Direct Execution**:
   ```bash
   node src/price-scraper.js
   ```

2. **Programmatic Use**:
   Import the `scrapePrice` function into your code:
   ```javascript
   import { scrapePrice } from './src/price-scraper.js';

   const url = 'https://example.com/product-page';
   scrapePrice(url)
     .then(price => console.log(`Price: ${price}`))
     .catch(error => console.error(`Error: ${error}`));
   ```

### Chrome Installation
The script manages Chrome installation automatically. If needed, you can manually install the required version using:
```bash
npx @puppeteer/browsers install chrome@121.0.6167.85
```

---

## Key Configurations

- **Chrome Path Resolution**:
  - macOS: Uses bundled binaries from `chrome/mac_arm-121.0.6167.85`.
  - Windows and Linux: Resolves binaries dynamically.
- **Environment Variables**:
  - `PUPPETEER_CACHE_DIR`: Defines the Puppeteer cache directory for efficient browser downloads.

---

## Utilities

### `extractNumber` (from `utils.js`)
A helper function to sanitize and extract numeric values from strings:
```javascript
import { extractNumber } from './src/utils.js';

const rawText = '$1,234.56';
const price = extractNumber(rawText); // Output: 1234.56
```

---

## Error Handling

The project includes robust error handling:
- **Chrome Path Issues**: Logs missing or incorrect Chrome paths.
- **Scraping Failures**: Provides detailed logs for missing elements or selectors.

---

## Contributing

Contributions are welcome! Follow these steps to contribute:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m "Add feature-name"`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Future Enhancements

- **Dynamic Selector Configuration**: Support for customizable selectors via a configuration file.
- **Logging Improvements**: Integrate structured logging for better monitoring and debugging.
- **Multi-Page Scraping**: Add support for batch URL scraping.

---