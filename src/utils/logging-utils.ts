interface LogApiRequestData {
    [key: string]: any;
  }
  
  interface LogApiRequestOptions {
    isRateLimited?: boolean;
    [key: string]: any;
  }
  
  export async function logApiRequest(
    endpoint: string,
    data?: LogApiRequestData,
    options?: LogApiRequestOptions
  ): Promise<void> {
    try {
      const logEntry = {
        timestamp: new Date().toISOString(),
        endpoint,
        data: data || {},
        options: options || {},
      };
  
      // In a real application, you might want to send this to a logging service
      // For now, we'll just log to console
      console.log('API Request Log:', logEntry);
      
      // You could extend this to send to external logging services like:
      // - Sentry
      // - DataDog
      // - LogRocket
      // - Custom analytics endpoint
      
    } catch (error) {
      console.error('Failed to log API request:', error);
    }
  }