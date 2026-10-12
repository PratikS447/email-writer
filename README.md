# Email Writer

A Spring Boot API and React interface for drafting email replies with Google Gemini. Paste the email, choose a tone, and edit the generated reply before sending it.

## Stack

- Java 21 and Spring Boot 3
- React and Vite
- Google Gemini API

The browser calls the existing `POST /api/email/generate` endpoint. The frontend and API are served from the same Spring Boot process in production; the backend Java API contract is unchanged.

## Configure Gemini

Set these environment variables before starting the backend:

```sh
GEMINI_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
GEMINI_KEY=your_gemini_api_key
```

Keep `GEMINI_KEY` in your deployment platform's secret/environment-variable manager. Do not commit it to the repository. Email text is sent to Gemini to generate a reply; this application does not persist it.

## Run locally

Requirements: Java 21 and Node.js 22.12+.

Start the backend in one terminal:

```sh
export GEMINI_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
export GEMINI_KEY="your_gemini_api_key"
./mvnw spring-boot:run
```

Start the React development server in another terminal:

```sh
npm install
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` requests to `http://localhost:8080`; set `API_PROXY_TARGET` if the backend is running elsewhere.

## Build and run as one Spring Boot app

```sh
npm install
npm run build
./mvnw clean package
GEMINI_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent" \
GEMINI_KEY="your_gemini_api_key" \
java -jar target/email-writer-0.0.1-SNAPSHOT.jar
```

The Vite build writes the frontend into Spring Boot's static resources. Open `http://localhost:8080`.

## Deploy with Docker

The included multi-stage `Dockerfile` builds React, packages the static assets with Spring Boot, and runs the app on the port supplied by `PORT` (default `8080`).

```sh
docker build -t email-writer .
docker run --rm -p 8080:8080 \
  -e GEMINI_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent" \
  -e GEMINI_KEY="your_gemini_api_key" \
  -e PORT=8080 \
  email-writer
```

For a container host, deploy from this repository using the `Dockerfile`, map the service to its assigned `PORT`, and add `GEMINI_URL` and `GEMINI_KEY` as runtime environment variables/secrets.

## API

```http
POST /api/email/generate
Content-Type: application/json

{
  "emailContent": "Hi, could you send the updated proposal by Friday?",
  "tone": "professional"
}
```

The endpoint returns the generated reply as plain text.
