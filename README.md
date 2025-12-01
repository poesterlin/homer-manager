# Homer Config Manager

A web-based configuration manager for Homer dashboards. This tool provides a user-friendly interface to manage your Homer dashboard configuration without manually editing YAML files.

## Features

- **Visual Dashboard Management**: Edit all aspects of your Homer dashboard through a clean web interface
- **Icon Integration**: Browse and download icons from [selfh.st/icons](https://github.com/selfhst/icons) repository
- **Real-time Updates**: Changes are immediately reflected in your config.yaml file
- **Modern Stack**: Built with SvelteKit 5, Svelte 5, and Bun for optimal performance
- **Docker Support**: Easy deployment with Docker and Docker Compose

## Quick Start

### Using Docker (Recommended)

1. Clone this repository:
   ```bash
   git clone git@github.com:poesterlin/homer-manager.git
   cd homer-manager
   ```

2. Link your Homer assets:
   ```yaml
    services:
        homer:
            # ... your existing Homer service configuration ...
            volumes:
            - ./assets:/www/assets

        homer-manager:
            build:
            context: ./homer-manager
            dockerfile: Dockerfile
            container_name: homer-manager
            ports:
            - "3000:3000"
            volumes:
            - ./assets:/app/assets
            environment:
            - NODE_ENV=production
            restart: unless-stopped
   ```

3. Run with Docker Compose:
   ```bash
   docker-compose up -d
   ```

4. Access the application at `http://localhost:3000`

### Local Development

1. Install dependencies:
   ```bash
   bun install
   ```

2. Start the development server:
   ```bash
   bun run dev
   ```

3. Open `http://localhost:5173` in your browser

## Configuration

The application requires a `config.yaml` file in the assets directory. This file should follow the Homer dashboard configuration format. See the [example config.yaml](example-config.yaml) for reference.

## Usage Guide

### Managing Global Settings

1. From the main dashboard, edit the global settings form
2. Modify title, subtitle, columns, and theme
3. Click "Save Settings" to update your config

### Managing Service Categories

1. View all service categories on the main dashboard
2. Use the arrow buttons to reorder categories
3. Click "Edit" to modify a category's name and icon
4. Click "Delete" to remove a category (with confirmation)
5. Use the "Add New Category" form to create new categories

### Managing Service Items

1. Click "Edit" on any service category to view its items
2. Reorder items using the arrow buttons
3. Click "Edit" on any item to modify its properties
4. Use the "Add New Item" form to add new services

### Icon Management

1. Access the Icon Browser from the main dashboard or navigation
2. Browse local icons already downloaded to your assets
3. Search and download new icons from the selfh.st/icons repository
4. Select PNG, SVG, or WebP formats for icons
5. Icons are automatically saved to your `assets/tools` directory

### Using the Icon Picker

When adding or editing service items, click the logo field to open the icon picker:
- Switch between "Local" and "selfh.st/icons" tabs
- Search for specific icons by name
- Click any icon to select it for your service
- Remote icons are automatically downloaded when selected

## Architecture

This application uses SvelteKit's new remote functions feature for type-safe communication between client and server:

- **`query`**: For reading data from the server
- **`form`**: For writing data with form validation
- **`command`**: For server-side actions without forms
- **`prerender`**: For static data at build time

The application structure includes:

- Remote functions in `*.remote.ts` files
- Server-side configuration handling in `src/lib/server/config.ts`
- Icon management in `src/lib/server/icons.ts`
- Reusable components in `src/lib/components/`

## Docker Deployment

### Building the Image

```bash
docker build -t homer-config-manager .
```

### Running with Docker Compose

```bash
docker-compose up -d
```

### Running Standalone

```bash
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/config.yaml:/app/config.yaml \
  -v $(pwd)/assets:/app/assets \
  homer-config-manager
```

## Development

### Project Structure

```
src/
├── lib/
│   ├── components/    # Reusable UI components
│   └── server/        # Server-side utilities
├── routes/            # Pages and remote functions
│   ├── +page.svelte   # Main dashboard
│   ├── services/      # Service category management
│   ├── items/         # Service item management
│   └── icons/         # Icon browser
└── app.html
```

### Adding New Features

1. Create remote functions in `*.remote.ts` files
2. Use `query`, `form`, `command`, or `prerender` as needed
3. Implement server-side logic in `src/lib/server/`
4. Create UI components in `src/lib/components/`
5. Build pages in `src/routes/`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Credits

- Built with [SvelteKit](https://kit.svelte.dev/)
- Icons from [selfh.st/icons](https://github.com/selfhst/icons)
- Powered by [Bun](https://bun.sh/)

## Support

For issues and questions, please open an issue on the GitHub repository.