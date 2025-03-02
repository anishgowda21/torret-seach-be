# YTS API

Welcome to the YTS API! This API allows you to search for movie torrents on YTS.

## Search Endpoint

- **Method**: GET
- **Path**: `/yts`
- **Description**: Search for movie torrents on YTS

### Parameters

- **query** (required): Search term (e.g., "hulk")
- **img** (optional, default: false): Whether to include base64-encoded cover images (pass any value to enable)

### Example

`/yts/search?query=hulk`

### Response Example

```json
{
  "status": "ok",
  "movie_count": 5,
  "query": "hulk",
  "data": [
    {
      "name": "The Incredible Hulk (2008)",
      "cover_image": "",
      "description": "Bruce Banner, a scientist on the run from the U.S. Government, must find a cure for the monster he turns into whenever he loses his temper.",
      "imdb": "tt0800080",
      "year": 2008,
      "language": "English",
      "torrents": [
        {
          "torrent_file": "https://yts.mx/torrent/download/...",
          "magnet": "magnet:?xt=urn:btih:...",
          "quality": "1080p",
          "type": "BluRay",
          "seeds": 285,
          "peers": 16,
          "size": "2.10 GB",
          "upload_date": "2019-03-16 20:03:26",
          "hash": "5F8..."
        },
        {
          "torrent_file": "https://yts.mx/torrent/download/...",
          "magnet": "magnet:?xt=urn:btih:...",
          "quality": "720p",
          "type": "BluRay",
          "seeds": 178,
          "peers": 21,
          "size": "1.05 GB",
          "upload_date": "2019-03-16 19:02:13",
          "hash": "B4D..."
        }
      ]
    }
  ]
}
```

## Image Encoding

When the `img` parameter is provided, cover images will be returned as base64-encoded data URLs, like this:

```
data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgF...
```

This allows you to display the images directly in a web browser without making additional requests.

## Error Handling

If an error occurs, the API will return an error response:

```json
{
  "status": "error",
  "movie_count": 0,
  "query": "hulk",
  "data": [],
  "error": "Failed to fetch data from YTS API"
}
```
