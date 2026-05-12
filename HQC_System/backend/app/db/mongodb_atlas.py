# Copyright (c) 2025 HQC System Contributors
# Licensed under the GNU General Public License v3.0 (GPL-3.0)

"""
MongoDB Atlas Connection for Mobile App
Handles connection to cloud MongoDB for mobile app authentication and reports
"""

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional
from app.core.config import settings

class MongoDBAtlas:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None
    
    def __init__(self):
        self.client = None
        self.db = None
    
    async def connect(self):
        """Connect to MongoDB Atlas (or fallback to local MongoDB)"""
        try:
            uri = settings.MONGODB_ATLAS_URI or settings.MONGODB_URL
            db_name = settings.MONGODB_ATLAS_DB
            
            if not uri:
                print("No MongoDB URI configured, skipping connection")
                return
            
            self.client = AsyncIOMotorClient(uri)
            self.db = self.client[db_name]
            
            # Test connection
            await self.client.admin.command('ping')
            source = "Atlas" if settings.MONGODB_ATLAS_URI else "Local Fallback"
            print(f"Connected to MongoDB ({source}): {db_name}")
        except Exception as e:
            print(f"FAILED to connect to MongoDB: {e}")
            print("Backend will continue running but app features may fail.")
    
    async def close(self):
        """Close MongoDB Atlas connection"""
        if self.client:
            self.client.close()
            print("Closed MongoDB Atlas connection")
    
    def get_database(self) -> AsyncIOMotorDatabase:
        """Get database instance"""
        if self.db is None:
            raise RuntimeError("MongoDB Atlas not connected")
        return self.db


# Singleton instance
mongodb_atlas = MongoDBAtlas()


async def get_mongodb_atlas() -> AsyncIOMotorDatabase:
    """Dependency to get MongoDB Atlas database"""
    return mongodb_atlas.get_database()
