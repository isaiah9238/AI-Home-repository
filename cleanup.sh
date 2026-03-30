#!/bin/bash

echo "🚀 Starting Deep Clean to free up disk space..."

# 1. Clear Next.js cache (The biggest offender)
if [ -d ".next" ]; then
    rm -rf .next
    echo "✅ Deleted .next build cache"
fi

# 2. Clear npm/yarn cache
npm cache clean --force
echo "✅ Cleared npm cache"

# 3. Remove Firebase cache/logs
if [ -d ".firebase" ]; then
    rm -rf .firebase
    echo "✅ Cleared .firebase internal cache"
fi

# 4. Remove system-level temp files (Linux/Mac)
rm -rf /tmp/* 2>/dev/null
echo "✅ Cleared system temp files"

# 5. Docker Cleanup (If applicable)
if command -v docker &> /dev/null; then
    docker system prune -f
    echo "✅ Cleared unused Docker data"
fi

echo "✨ Cleanup complete. Check your disk space now!"
df -h .
