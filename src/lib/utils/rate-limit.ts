// Simple in-memory rate limiting
// In production, use redis
interface RateLimitEntry {
    requests: number;
    windowStart: number;
  }
  
  // Rate limit configuration
  const RATE_LIMIT_CONFIG = {
    '/api/speech-to-text': {
      maxRequests: 10, // 10 requests
      windowMs: 60 * 1000, // per minute
    },
    // Add other endpoints as needed
  } as const;
  
  // In-memory store for rate limiting
  const rateLimitStore = new Map<string, RateLimitEntry>();
  
  export function isRateLimited(userId: string, endpoint: string): boolean {
    const config = RATE_LIMIT_CONFIG[endpoint as keyof typeof RATE_LIMIT_CONFIG];
    
    if (!config) {
      // If no rate limit config, allow the request
      return false;
    }
    
    const key = `${userId}:${endpoint}`;
    const now = Date.now();
    const entry = rateLimitStore.get(key);
    
    if (!entry || now - entry.windowStart > config.windowMs) {
      // First request or window has expired
      rateLimitStore.set(key, {
        requests: 1,
        windowStart: now,
      });
      return false;
    }
    
    if (entry.requests >= config.maxRequests) {
      // Rate limit exceeded
      return true;
    }
    
    // Increment request count
    entry.requests++;
    rateLimitStore.set(key, entry);
    
    return false;
  }
  
  export function getRateLimitHeaders(userId: string, endpoint: string): Record<string, string> {
    const config = RATE_LIMIT_CONFIG[endpoint as keyof typeof RATE_LIMIT_CONFIG];
    
    if (!config) {
      return {};
    }
    
    const key = `${userId}:${endpoint}`;
    const entry = rateLimitStore.get(key);
    const now = Date.now();
    
    if (!entry) {
      return {
        'X-RateLimit-Limit': config.maxRequests.toString(),
        'X-RateLimit-Remaining': (config.maxRequests - 1).toString(),
        'X-RateLimit-Reset': new Date(now + config.windowMs).toISOString(),
      };
    }
    
    const remaining = Math.max(0, config.maxRequests - entry.requests);
    const resetTime = entry.windowStart + config.windowMs;
    
    return {
      'X-RateLimit-Limit': config.maxRequests.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': new Date(resetTime).toISOString(),
    };
  }
  
  // Clean up expired entries (should be called periodically)
  export function cleanupExpiredEntries(): void {
    const now = Date.now();
    
    for (const [key, entry] of rateLimitStore.entries()) {
      const endpoint = key.split(':')[1];
      const config = RATE_LIMIT_CONFIG[endpoint as keyof typeof RATE_LIMIT_CONFIG];
      
      if (config && now - entry.windowStart > config.windowMs) {
        rateLimitStore.delete(key);
      }
    }
  }