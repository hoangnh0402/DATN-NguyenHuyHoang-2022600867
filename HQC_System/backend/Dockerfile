# Python 3.11 Slim - Lightweight and fast
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for PostGIS/GeoAlchemy and OSM processing
RUN apt-get update && apt-get install -y \
    libpq-dev gcc g++ \
    wget \
    osmium-tool \
    cmake \
    libboost-dev \
    libbz2-dev \
    zlib1g-dev \
    libexpat1-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run command with gunicorn for production
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "app.main:app", "--bind", "0.0.0.0:8000"]

