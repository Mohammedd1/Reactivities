namespace Application.Core
{
    public class AppException
    {
        public AppException(int statusCode, string message, string details = null)
        {
            // So that we don't have to supply the details because the idea of what we're going to do if we're running
            // in production.
            // Then we're going to return to status codes, will have a standard message server error, for example.
            // And we won't return any details, but if we're running in development mode, then we'll have the status
            // code, we'll have the actual message of the era and the details will be the stack trace that we return.
            
            StatusCode = statusCode;
            Message = message;
            Details = details;
        }

        public int StatusCode { get; set; }
        public string Message { get; set; }
        public string Details { get; set; }
    }
}