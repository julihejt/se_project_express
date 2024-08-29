// Define HTTP status codes
const BAD_REQUEST = 400; // Bad Request: The server cannot process the request due to client error (e.g., malformed request syntax).
const NOT_FOUND = 404;   // Not Found: The requested resource could not be found on the server.
const INTERNAL_SERVER_ERROR = 500; // Internal Server Error: The server encountered an unexpected condition that prevented it from fulfilling the request.

// Export the status codes so they can be used in other parts of the application
module.exports = {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
};
