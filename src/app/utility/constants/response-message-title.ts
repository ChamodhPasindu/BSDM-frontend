export const RESPONSE_MESSAGES = {
  INVALID_ROLE_ERROR_DES: 'You do not have permission to access this module.',
  UNABLE_TO_SERVE_REQUEST_DES:
    'Unable to serve your request. Please try again.',
  COMMON_ERROR_DES: 'Something went wrong. Please try again.',
  SESSION_EXPIRED_DES: 'Your session has expired. Please log in again.',

  // HTTP error messages
  HTTP_ERROR: {
    0: 'Cannot connect to the server.',
    400: 'Bad request.',
    401: 'Unauthorized. Please log in again.',
    403: 'Access denied.',
    404: 'Requested resource not found.',
    500: 'Server error. Please try later.',
  } as { [key: number]: string },

  EMPLOYEE_ADD_EDIT_SUCCESS:
    'Employee information has been saved successfully.',
  EMPLOYEE_ADD_EDIT_FAILED:
    'Failed to save employee information. Please try again.',

  ROUTE_ADD_EDIT_SUCCESS: 'Route information has been saved successfully.',
  ROUTE_ADD_EDIT_FAILED:
    'Failed to save route information. Please try again.',
};

export const RESPONSE_TITLES = {
  COMPLETED: 'Completed',
  DONE: 'Done',
  SAVED: 'Saved',
  CONFIRMATION: 'Confirmation',
  SUCCESS: 'Success',
  FAILED: 'Failed',
  OOPS: 'Oops!',
  WARNING: 'Warning',
  ATTENTION: 'Attention',
};
