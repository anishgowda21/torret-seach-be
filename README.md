# Torret Seach Backend

This is the backend service for the Torret Seach mobile application. It provides API endpoints to search for torrents from popular sites like 1337x, YTS, and Nyaa.

## Features

- **Multiple Sources**: Search for torrents from 1337x, YTS, and Nyaa
- **Caching**: Optional Redis caching for improved performance
- **Documentation**: Built-in API documentation
- **TypeScript**: Type-safe codebase for reliability
- **Easy Deployment**: One-click deployment to Vercel

## Deployment

The easiest way to deploy the backend is using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fanishgowda21%2Ftorret-seach-be&env=UPSTASH_REDIS_REST_URL,UPSTASH_REDIS_REST_TOKEN,CACHE_CLEAR_PASSWORD&envDescription=Upstash%20URL%20and%20Token%20needed%20for%20caching&project-name=t-seach-be&repository-name=t-seach-be)

## API Endpoints

### 1337x

```
- GET /1337x/search?query=<search_term>&page=<page>&category=<category>&sort=<sort>&order=<order>
- GET /1337x/details?link=<torrent_link>
```

### YTS

```
- GET /yts/search?query=<search_term>&img=<include_images>
```

### Nyaa

```
- GET /nyaa/search?query=<search_term>&ord_by=<order_by>&page=<page>
```

## Self-hosting

If you prefer to host the backend yourself:

1. Clone this repository

```
git clone https://github.com/anishgowda21/torret-seach-be.git
cd torret-seach-be
```

2. Install dependencies

```
npm install
```

3. Create a .env file based on .env.example

```
PORT=5000
NODE_ENV=development

# Optional Redis caching
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Security
CACHE_CLEAR_PASSWORD=your_cache_clear_password
```

4. Build the project

```
npm run build
```

5. Start the server

```
npm start
```

## Redis Caching (Optional)

The API includes optional Redis caching to improve performance and reduce the load on torrent sites:

- If Redis credentials are provided in the .env file, caching will be enabled automatically
- Without Redis credentials, the API will work but without caching
- Use Upstash Redis for easy setup with Vercel deployment

## Development

To run the server in development mode:

```
npm run dev
```

## Using with Torret Seach App

1. Deploy this backend to Vercel or your preferred hosting
2. Copy the deployment URL (e.g., https://your-app.vercel.app)
3. Open the Torret Seach mobile app
4. Go to Settings and paste your backend URL
5. Save and restart the app

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Security Notice

This API is designed to be used with the Torret Seach mobile app. While there are no authentication mechanisms in place, it's recommended to keep your deployment URL private or implement your own authentication if making the API public.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/anishgowda21">Anish Gowda</a>
</p>
