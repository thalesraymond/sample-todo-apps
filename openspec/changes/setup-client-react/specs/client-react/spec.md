# Specification: Client React

## Overview
A React client application that interacts with the backend Todo APIs.

## Requirements

### R1. Base Application
The application MUST be a standard React application bootstrapped with Vite using TypeScript.
- R1.1. It MUST use Vitest for testing and achieve ≥ 90% test coverage.
- R1.2. It MUST be contained within the `client/` directory at the repository root.

### R2. API Connectivity
The application MUST be able to connect to the backend APIs.
- R2.1. It MUST initially fetch data from the `/health` endpoint of the backend running at `http://localhost:3000`.
- R2.2. It MUST handle and display the `{"status": "ok"}` response or display an error message if the connection fails.

## Edge Cases

- **Backend unavailable**: The application MUST display a clear error if it cannot connect to the backend API.
