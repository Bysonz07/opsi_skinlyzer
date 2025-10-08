from datetime import datetime
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    analyses = relationship("Analysis", back_populates="user")

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    condition = Column(String, nullable=False)
    condition_name = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    severity = Column(String, nullable=False)
    description = Column(String)
    recommendations = Column(JSON)
    image_url = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="analyses")

    def to_dict(self):
        return {
            "id": self.id,
            "condition": self.condition,
            "condition_name": self.condition_name,
            "confidence": self.confidence,
            "confidence_percentage": self.confidence * 100,
            "severity": self.severity,
            "description": self.description,
            "recommendations": self.recommendations,
            "image_url": self.image_url,
            "timestamp": self.created_at.isoformat(),
        }