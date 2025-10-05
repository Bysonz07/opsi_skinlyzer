from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime
import random

app = FastAPI(title="SkinAnalyzer API", version="1.0.0")

# Add this model at the top of your file
class TreatmentUpdate(BaseModel):
    completed: bool


# CORS middleware - allow all origins for testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Data Models
class AnalysisResult(BaseModel):
    id: str
    condition: str
    confidence: float
    severity: str
    description: str
    recommendations: List[str]
    timestamp: str

class AnalysisHistoryItem(BaseModel):
    id: str
    condition: str
    date: str
    confidence: int
    status: str
    severity: str
    description: str

class TreatmentItem(BaseModel):
    id: str
    name: str
    dosage: str
    frequency: str
    duration: str
    notes: str
    completed: bool

class User(BaseModel):
    id: str
    email: str
    name: str
    skin_type: str

# Mock Data
mock_user = User(
    id="user1",
    email="john.doe@email.com",
    name="John Doe",
    skin_type="Sensitive"
)

mock_history = [
    AnalysisHistoryItem(
        id="1",
        condition="Eczema (Atopic Dermatitis)",
        date="January 15, 2024",
        confidence=92,
        status="Active",
        severity="Medium",
        description="Started treatment with hydrocortisone cream"
    ),
    AnalysisHistoryItem(
        id="2",
        condition="Contact Dermatitis",
        date="January 10, 2024",
        confidence=85,
        status="Resolved",
        severity="Low",
        description="Resolved after removing allergen trigger"
    ),
    AnalysisHistoryItem(
        id="3",
        condition="Seborrheic Dermatitis",
        date="January 5, 2024",
        confidence=78,
        status="Monitoring",
        severity="Medium",
        description="Monitoring with medicated shampoo"
    ),
    AnalysisHistoryItem(
        id="4",
        condition="Dry Skin",
        date="December 28, 2023",
        confidence=95,
        status="Resolved",
        severity="Low",
        description="Improved with regular moisturizing routine"
    )
]

mock_treatments = [
    TreatmentItem(
        id="1",
        name="Hydrocortisone Cream 1%",
        dosage="Apply thin layer",
        frequency="Twice daily",
        duration="2 weeks",
        notes="Apply to affected areas after cleansing",
        completed=False
    ),
    TreatmentItem(
        id="2",
        name="Cetirizine (Antihistamine)",
        dosage="10mg",
        frequency="Once daily",
        duration="1 week",
        notes="Take with or without food",
        completed=True
    ),
    TreatmentItem(
        id="3",
        name="Moisturizing Routine",
        dosage="Use gentle moisturizer",
        frequency="Twice daily",
        duration="3 weeks",
        notes="Apply after washing face",
        completed=False
    )
]

# Available skin conditions for random selection
skin_conditions = [
    {
        "condition": "Eczema (Atopic Dermatitis)",
        "confidence": random.randint(85, 95),
        "severity": "Medium",
        "description": "Characterized by dry, itchy, and inflamed skin. Common in skin folds.",
        "recommendations": [
            "Use fragrance-free moisturizer daily",
            "Apply hydrocortisone cream twice daily",
            "Avoid hot showers and harsh soaps"
        ]
    },
    {
        "condition": "Contact Dermatitis",
        "confidence": random.randint(80, 90),
        "severity": "Low",
        "description": "Skin reaction caused by contact with irritants or allergens.",
        "recommendations": [
            "Identify and avoid triggering substances",
            "Use cool compresses to relieve itching",
            "Apply calamine lotion as needed"
        ]
    },
    {
        "condition": "Seborrheic Dermatitis",
        "confidence": random.randint(75, 85),
        "severity": "Medium",
        "description": "Common condition causing red skin and stubborn dandruff.",
        "recommendations": [
            "Use medicated shampoo containing ketoconazole",
            "Apply antifungal cream to affected areas",
            "Manage stress levels"
        ]
    },
    {
        "condition": "Acne Vulgaris",
        "confidence": random.randint(80, 95),
        "severity": "Medium",
        "description": "Common skin condition causing pimples and inflammation.",
        "recommendations": [
            "Use gentle, non-comedogenic cleanser",
            "Apply benzoyl peroxide or salicylic acid",
            "Avoid picking or squeezing pimples"
        ]
    },
    {
        "condition": "Rosacea",
        "confidence": random.randint(70, 85),
        "severity": "Low",
        "description": "Chronic skin condition causing facial redness and visible blood vessels.",
        "recommendations": [
            "Use gentle skincare products",
            "Avoid spicy foods and alcohol",
            "Protect skin from sun exposure"
        ]
    }
]

# API Routes
@app.get("/")
async def root():
    return {"message": "SkinAnalyzer API is running! 🚀"}

@app.get("/api/v1/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "message": "API is working correctly"
    }

@app.get("/api/v1/users/me")
async def get_current_user():
    return mock_user

@app.post("/api/v1/analysis/upload")
async def analyze_skin(image: UploadFile = File(...), metadata: str = Form("{}")):
    """
    Analyze a skin image and return results
    """
    try:
        # Simulate processing time
        import time
        time.sleep(2)

        # Generate unique ID
        analysis_id = str(uuid.uuid4())

        # Pick a random skin condition for demo
        result = random.choice(skin_conditions)

        return {
            "id": analysis_id,
            "condition": result["condition"],
            "confidence": result["confidence"],
            "severity": result["severity"],
            "description": result["description"],
            "recommendations": result["recommendations"],
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "error": str(e),
            "id": str(uuid.uuid4()),
            "condition": "Analysis Failed",
            "confidence": 0,
            "severity": "Unknown",
            "description": "Could not analyze the image",
            "recommendations": ["Please try again with a clearer image"],
            "timestamp": datetime.now().isoformat()
        }

@app.get("/api/v1/analysis/history")
async def get_analysis_history(status: Optional[str] = None, search: Optional[str] = None):
    """
    Get user's analysis history with optional filtering
    """
    filtered_data = mock_history.copy()

    # Apply status filter
    if status and status != "All":
        filtered_data = [item for item in filtered_data if item.status.lower() == status.lower()]

    # Apply search filter
    if search:
        search_lower = search.lower()
        filtered_data = [
            item for item in filtered_data
            if search_lower in item.condition.lower() or search_lower in item.description.lower()
        ]

    return filtered_data

@app.get("/api/v1/treatments")
async def get_treatments():
    """
    Get user's treatment plans
    """
    return mock_treatments

@app.put("/api/v1/treatments/{treatment_id}")
async def update_treatment(treatment_id: str, update_data: TreatmentUpdate):
    """
    Update treatment completion status
    """
    print(f"📝 Updating treatment {treatment_id} to completed={update_data.completed}")

    # Find and update the treatment
    for treatment in mock_treatments:
        if treatment.id == treatment_id:
            treatment.completed = update_data.completed
            print(f"✅ Successfully updated treatment {treatment_id}")
            return treatment

    # If treatment not found
    raise HTTPException(status_code=404, detail="Treatment not found")

@app.get("/api/v1/skin-conditions")
async def get_skin_conditions():
    """
    Get list of all possible skin conditions
    """
    return skin_conditions

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)