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

  DELETE_CONFIRMATION: 'This action cannot be undone. Do you want to proceed?',

  EMPLOYEE_ADD_EDIT_SUCCESS:
    'Employee information has been saved successfully.',
  EMPLOYEE_ADD_EDIT_FAILED:
    'Failed to save employee information. Please try again.',
  EMPLOYEE_GET_FAILED: 'Failed to load employee details. Please try again.',

  ROUTE_ADD_EDIT_SUCCESS: 'Route information has been saved successfully.',
  ROUTE_ADD_EDIT_FAILED: 'Failed to save route information. Please try again.',
  ROUTE_GET_FAILED: 'Failed to load route details. Please try again.',
  ROUTE_DELETE_FAILED: 'Failed to remove Route details. Please try again.',
  ROUTE_DELETE_SUCCESS: 'Route information has been removed successfully.',

  VEHICLE_ADD_EDIT_SUCCESS: 'Vehicle information has been saved successfully.',
  VEHICLE_ADD_EDIT_FAILED:
    'Failed to save Vehicle information. Please try again.',
  VEHICLE_GET_FAILED: 'Failed to load Vehicle details. Please try again.',
  VEHICLE_DELETE_FAILED: 'Failed to remove Vehicle details. Please try again.',
  VEHICLE_DELETE_SUCCESS: 'Vehicle information has been removed successfully.',

  CUSTOMER_ADD_EDIT_SUCCESS:
    'Customer information has been saved successfully.',
  CUSTOMER_ADD_EDIT_FAILED:
    'Failed to save Customer information. Please try again.',
  CUSTOMER_GET_FAILED: 'Failed to load Customer details. Please try again.',
  CUSTOMER_DELETE_FAILED:
    'Failed to remove Customer details. Please try again.',
  CUSTOMER_DELETE_SUCCESS:
    'Customer information has been removed successfully.',

  ITEM_ADD_EDIT_SUCCESS: 'Item information has been saved successfully.',
  ITEM_ADD_EDIT_FAILED: 'Failed to save Item information. Please try again.',
  ITEM_GET_FAILED: 'Failed to load Item details. Please try again.',
  ITEM_DELETE_FAILED: 'Failed to remove Item details. Please try again.',
  ITEM_DELETE_SUCCESS: 'Item information has been removed successfully.',

  BATCH_ADD_EDIT_SUCCESS: 'Batch information has been saved successfully.',
  BATCH_ADD_EDIT_FAILED: 'Failed to save Batch information. Please try again.',
  BATCH_GET_FAILED: 'Failed to load Batch details. Please try again.',
  BATCH_DELETE_FAILED: 'Failed to remove Batch details. Please try again.',
  BATCH_DELETE_SUCCESS: 'Batch information has been removed successfully.',
  BATCH_CODE_GENERATE_FAILED:
    'Unable to generate or retrieve the batch code. Please try again.',

  PRODUCT_ADD_EDIT_SUCCESS: 'Product information has been saved successfully.',
  PRODUCT_ADD_EDIT_FAILED: 'Failed to save Product information. Please try again.',
  PRODUCT_GET_FAILED: 'Failed to load Product details. Please try again.',
  PRODUCT_DELETE_FAILED: 'Failed to remove Product details. Please try again.',
  PRODUCT_DELETE_SUCCESS: 'Product information has been removed successfully.',
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
