# Go Todo API

This is the Go implementation of the Sample Todo API.

## Requirements

- Go 1.24 or higher

## Getting Started

1. Navigate to the `go` directory:
   ```bash
   cd go
   ```

2. Download dependencies:
   ```bash
   go mod tidy
   ```

3. Run the server:
   ```bash
   go run cmd/api/main.go
   ```

The server will start on port `3000` by default.

## Configuration

You can configure the application using the following environment variables:

- `PORT`: The port the server listens on (default: `3000`).
- `JWT_SECRET`: The secret key used to sign JWTs (default: `super-secret-key`).

## Running Tests

To run the unit tests and calculate coverage:

```bash
go test -v ./... -cover
```
