# Nyaa API

Welcome to the Nyaa API! This API allows you to search for anime torrents on Nyaa.si.

## Search Endpoint

- **Method**: GET
- **Path**: `/nyaa`
- **Description**: Search for anime torrents on Nyaa.si

### Parameters

- **query** (required): Search term (e.g., "naruto")
- **ord_by** (optional, default: "seeders"): Order by "seeders" or "date"
- **page** (optional, default: 1): Page number

### Example

`/nyaa/search?query=naruto&ord_by=date&page=1`

### Response Example

```json
{
  "status": "success",
  "orderedBy": "date",
  "query": "naruto",
  "length": 75,
  "page": 1,
  "data": [
    {
      "type": "Anime",
      "name": "Naruto Shippuden - Episode 500 [1080p]",
      "torrent": "https://nyaa.si/download/12345.torrent",
      "magnet": "magnet:?xt=urn:btih:...",
      "size": "1.3 GB",
      "upload_date": "2023-04-05 15:30",
      "seeders": "450",
      "leechers": "25",
      "complete_downloads": "3240"
    }
  ]
}
```

## Error Handling

If an error occurs, the API will return an error response with details:

```json
{
  "status": "error",
  "error_code": "ETIMEDOUT",
  "error_message": "Connection timed out",
  "error_stack": "..."
}
```
