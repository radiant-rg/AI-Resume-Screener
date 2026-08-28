# 🤖 AI Resume Screener

An AI-powered resume screening and candidate ranking system that automatically analyzes a **job description** and multiple **candidate resumes**, extracts relevant information, evaluates candidate-job compatibility, and ranks candidates based on their overall match.

The system is designed to reduce the manual effort involved in screening large numbers of resumes and provide recruiters with a structured overview of the most suitable candidates.

---

## 🚀 Features

* 📄 Upload multiple resumes in **PDF or DOCX** format
* 📝 Enter or upload a **job description**
* 🤖 AI-powered job description analysis
* 🔍 Automatic resume parsing
* 🧠 Extracts skills, education, experience, projects, and certifications
* 🎯 Compares candidate profiles with job requirements
* 📊 Generates an overall **match score**
* 🏆 Ranks candidates from highest to lowest match
* 👤 Displays candidate details
* ⚠️ Identifies missing or important skills
* 💬 Generates a short recruitment verdict
* 🖱️ Drag-and-drop resume uploading
* 🌐 Web-based interface using Flask
* ⚡ Uses Groq for fast LLM inference

---

## 🏗️ How It Works

The application follows a simple AI-powered pipeline:

```text
                 ┌──────────────────┐
                 │  Job Description │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │  Job Analysis    │
                 │   Using LLM      │
                 └────────┬─────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │       Multiple Resumes           │
        │     PDF / DOCX Documents         │
        └────────────────┬────────────────┘
                         │
                         ▼
                 ┌──────────────────┐
                 │ Resume Extraction│
                 │     & Parsing    │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ Candidate vs Job │
                 │    Comparison    │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │   Match Score    │
                 │     0 - 100      │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ Candidate Ranking│
                 └──────────────────┘
```

---

## 🧠 AI Pipeline

The system uses an LLM at multiple stages.

### 1. Job Description Analysis

The job description is sent to the AI model to extract structured information such as:

* Job role
* Required skills
* Preferred skills
* Minimum experience
* Education requirements
* Key responsibilities

Example:

```json
{
  "role": "Software Development Engineer I",
  "required_skills": [
    "Python",
    "Java",
    "Data Structures",
    "Algorithms"
  ],
  "preferred_skills": [
    "AWS",
    "SQL",
    "NoSQL",
    "Git"
  ],
  "minimum_experience": null
}
```

---

### 2. Resume Parsing

Each uploaded resume is converted into text and analyzed by the AI.

The system extracts:

* Candidate name
* Email
* Phone
* Total experience
* Skills
* Work experience
* Education
* Projects
* Certifications

---

### 3. Candidate Matching

The structured job requirements and candidate information are then compared.

The AI evaluates:

* Matching skills
* Missing skills
* Experience requirements
* Education
* Relevant projects
* Overall suitability

Finally, the candidate receives a score between:

```text
0 → 100%
```

---

### 4. Candidate Ranking

After all resumes are processed, candidates are sorted according to their match score.

Example:

```text
🏆 TOP CANDIDATES

1. Candidate A    92%
2. Candidate B    87%

LOWEST MATCH

9. Candidate I    51%
10. Candidate J   43%
```

---

# 🛠️ Tech Stack

### Backend

* Python
* Flask
* Pydantic
* python-dotenv

### AI / LLM

* Groq API
* GPT-OSS model

### Document Processing

* PyPDF
* python-docx

### Frontend

* HTML5
* CSS3
* JavaScript

### Development Tools

* VS Code
* Git
* GitHub

### Deployment

* Vercel

---

# 📁 Project Structure

```text
AI-Resume-Screener/
│
├── app.py
├── main.py
├── requirements.txt
├── vercel.json
├── .gitignore
├── README.md
│
├── templates/
│   └── index.html
│
└── static/
    ├── style.css
    └── script.js
```

> `.env` is intentionally excluded from the repository because it contains the Groq API key.

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/AI-Resume-Screener.git
```

Move into the project directory:

```bash
cd AI-Resume-Screener
```

---

## 2. Create a virtual environment

### Windows

```powershell
python -m venv venv
```

Activate it:

```powershell
venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## 3. Install dependencies

```bash
pip install -r requirements.txt
```

---

# 🔑 Environment Variables

Create a `.env` file in the root directory:

```text
GROQ_API_KEY=your_groq_api_key
```

Never commit your `.env` file to GitHub.

The project includes `.env` in `.gitignore` to prevent accidentally exposing the API key.

---

# ▶️ Run Locally

Start the Flask application:

```bash
python app.py
```

You should see something similar to:

```text
* Running on http://127.0.0.1:5000
```

Open your browser and visit:

```text
http://127.0.0.1:5000
```

---

# 📄 Supported Resume Formats

Currently supported:

```text
PDF
DOCX
```

The application extracts text from uploaded documents before sending the relevant content to the AI model.

---

# 🌐 Deployment

The application can be deployed using **Vercel**.

The repository includes:

```text
vercel.json
```

which configures the Flask application for deployment.

Before deploying, add your API key to the Vercel environment variables:

```text
GROQ_API_KEY
```

Do **not** upload your `.env` file.

---

# 🔐 Security

API credentials should never be hard-coded into the source code.

Instead of:

```python
api_key = "gsk_xxxxxxxxx"
```

the application uses an environment variable:

```python
os.getenv("GROQ_API_KEY")
```

This keeps the API key separate from the source code.

---

# ⚠️ Important Considerations

This project is intended as an **AI-assisted resume screening tool**.

The generated score should not be treated as an absolute measure of a candidate's ability or suitability.

AI-generated evaluations can contain errors or inconsistencies, so recruiters should review candidates manually before making hiring decisions.

The system should be used as a screening and decision-support tool rather than an automated replacement for human judgment.

---

# 🔮 Future Improvements

Some planned improvements include:

* 📈 Advanced candidate analytics dashboard
* 📊 Skill-match visualization
* 🔎 Resume keyword highlighting
* 📑 Downloadable candidate reports
* 🗄️ Database integration
* 👥 Recruiter authentication
* 📚 Resume history and screening history
* ⚡ Parallel resume processing
* 🔄 Background task processing for large batches
* 🎯 Customizable scoring weights
* 📧 Candidate communication features
* ☁️ Cloud storage for uploaded resumes
* 🧠 Improved semantic skill matching
* 📱 Improved mobile responsiveness

---

# 🎯 Use Cases

This system can be useful for:

* Recruitment teams
* HR departments
* Startups
* Campus recruitment
* Internship screening
* Technical hiring
* High-volume resume screening

---

# 📌 Example Workflow

```text
1. Open the application
        ↓
2. Enter the Job Description
        ↓
3. Upload multiple resumes
        ↓
4. Click "Screen Resumes"
        ↓
5. AI parses the resumes
        ↓
6. AI compares candidates with the job
        ↓
7. Match scores are generated
        ↓
8. Candidates are ranked
        ↓
9. Recruiter reviews the results
```

---

# 👨‍💻 Author

**Roni**

B.Tech — Electronics and Computer Science

Interested in:

* Artificial Intelligence
* Machine Learning
* Computer Vision
* Python Development
* Web Development

---

# ⭐ Contributing

Contributions, suggestions, and improvements are welcome.

To contribute:

```bash
git fork
```

Create a new branch:

```bash
git checkout -b feature/your-feature
```

Make your changes and commit:

```bash
git commit -m "Add your feature"
```

Push your branch:

```bash
git push origin feature/your-feature
```

Then open a Pull Request.

---

# 📜 License

This project is intended for educational and development purposes.

Add an appropriate open-source license if you plan to distribute or reuse the project publicly.
