# Shortner project, BE part

3rd Party API [spoo.me](https://spoo.me)

[Alternative 3rd Parties](https://publicapis.dev/category/url-shorteners)

## Logic diagram

### Create a short link

```mermaid
sequenceDiagram
    participant FE as Client
    participant BE as Backend
    participant MongoDB
    participant API as 3rd party API

    FE->>BE: create a short link from URL
    BE->>API: create a short link from URL

    API-->>BE: here is a short link
    BE->>MongoDB: Store URL and it short link by THIS user
    MongoDB-->>BE: stored with _ID
    BE->>FE: here is a short link
```

### Get user's link

```mermaid
sequenceDiagram
    participant FE as Client
    participant BE as Backend
    participant MongoDB
    participant API as 3rd party API

    FE->>BE: gimmi all my links
    BE->>MongoDB: gimmi links for THIS user
    MongoDB-->>BE: here are links
    BE-->>FE: here are links
```

### Remove user's short link

```mermaid
sequenceDiagram
    participant FE as Client
    participant BE as Backend
    participant MongoDB
    participant API as 3rd party API

    FE->>BE: Remove THIS link
    BE-->>BE: Is user allowed to remove link
    BE->>MongoDB: Remove link
    MongoDB-->>BE: Removed
    BE-->>FE: Removed
```

## MongoDB setup

Start Mongo via Docker

```bash
docker run --name my-mongo -dit -p 27017:27017 --rm mongo:4.4.1
```

To run MongoDB commands in the terminal

```bash
docker exec -it my-mongo mongo
```

For MongoDB GUI use [Compass](<[https://mongodb.prakticum-team.ru/download-center/compass](https://mongodb.prakticum-team.ru/download-center/compass)>)

To stop MongoDB container

```bash
docker stop my-mongo
```
