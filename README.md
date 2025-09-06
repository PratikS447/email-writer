# 📧 Email Writer (Spring Boot + Gemini API)

This project is a Spring Boot application that generates **professional email replies** using the **Google Gemini API**.  
It provides a simple REST API endpoint where you can pass an email's content and an optional tone, and it will return a generated reply.

---

## 🚀 Features
- Generate professional email replies automatically.
- Customize tone (e.g., formal, friendly, persuasive, etc.).
- RESTful API with JSON request/response.
- CORS enabled (`@CrossOrigin(origins = "*")`) for frontend integration.
- Uses **Spring WebFlux WebClient** for non-blocking API calls.

---

## 🛠️ Tech Stack
- **Java 21**  
- **Spring Boot 3+**  
- **Spring WebFlux (WebClient)**  
- **Google Gemini API**  
- **Lombok**  

---

## 📂 Project Structure
src/main/java/com/email/email_writer
├── EmailGeneratorController.java # REST Controller
├── EmailGeneratorService.java # Service layer to call Gemini API
├── EmailRequest.java # Request model (email content + tone)


---

## ⚙️ Setup & Configuration

### 1. Clone the Repository
git clone https://github.com/your-username/email-writer.git
cd email-writer
2. Configure API Keys
Add your Gemini API details in application.properties:
gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
gemini.api.key=YOUR_GEMINI_API_KEY
3. Run the Application
./mvnw spring-boot:run

Generate Email Reply
POST /api/email/generate
{
  "emailContent": "Hi team, please send me the report by tomorrow.",
  "tone": "formal"
}
"Dear Team, I hope this message finds you well. Could you kindly provide the requested report by tomorrow? Thank you for your support."


