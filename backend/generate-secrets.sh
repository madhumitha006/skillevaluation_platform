#!/bin/bash
# Generate secure secrets for production

echo "Generating secure JWT secrets..."

JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

cat > .env << EOF
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-skill-evaluation

# JWT Secrets (Generated: $(date))
JWT_SECRET=${JWT_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# CORS
CLIENT_URL=https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
EOF

echo "✅ Secure .env file created"
echo "⚠️  NEVER commit this file to Git"
