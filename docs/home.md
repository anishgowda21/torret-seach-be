# Torrent API Documentation

Welcome to the Torrent API! This service provides a collection of APIs to search for torrents from various sources.

## Available APIs

### 1337x API
- **Endpoint**: `/1337x`
- **Description**: Search for torrents on 1337x.to
- [View 1337x API Documentation](/1337x)

### Nyaa API
- **Endpoint**: `/nyaa`
- **Description**: Search for anime torrents on Nyaa.si
- [View Nyaa API Documentation](/nyaa)

### YTS API
- **Endpoint**: `/yts`
- **Description**: Search for movie torrents on YTS
- [View YTS API Documentation](/yts)

## Usage Notes

- All APIs return JSON responses
- Rate limiting may be applied to prevent abuse
- This API is for educational purposes only

## Status Code Reference

- **200**: Success
- **400**: Bad Request - Check your parameters
- **404**: Not Found
- **500**: Server Error