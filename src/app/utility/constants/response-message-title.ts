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
  EMPLOYEE_WIDGET_GET_FAILED:
    'Failed to load employee widget details. Please try again.',

  ROUTE_ADD_EDIT_SUCCESS: 'Route information has been saved successfully.',
  ROUTE_ADD_EDIT_FAILED: 'Failed to save route information. Please try again.',
  ROUTE_GET_FAILED: 'Failed to load route details. Please try again.',
  ROUTE_DELETE_FAILED: 'Failed to remove Route details. Please try again.',
  ROUTE_DELETE_SUCCESS: 'Route information has been removed successfully.',

  ROUTE_AND_CUSTOMER_WIDGET_GET_FAILED:
    'Failed to load route and customer widget details. Please try again.',

  VEHICLE_ADD_EDIT_SUCCESS: 'Vehicle information has been saved successfully.',
  VEHICLE_ADD_EDIT_FAILED:
    'Failed to save Vehicle information. Please try again.',
  VEHICLE_GET_FAILED: 'Failed to load Vehicle details. Please try again.',
  VEHICLE_DELETE_FAILED: 'Failed to remove Vehicle details. Please try again.',
  VEHICLE_DELETE_SUCCESS: 'Vehicle information has been removed successfully.',
  VEHICLE_WIDGET_GET_FAILED:
    'Failed to load vehicle widget details. Please try again.',

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
  PRODUCT_ADD_EDIT_FAILED:
    'Failed to save Product information. Please try again.',
  PRODUCT_GET_FAILED: 'Failed to load Product details. Please try again.',
  PRODUCT_DELETE_FAILED: 'Failed to remove Product details. Please try again.',
  PRODUCT_DELETE_SUCCESS: 'Product information has been removed successfully.',

  STOCK_ADD_EDIT_SUCCESS: 'Stock information has been saved successfully.',
  STOCK_ADD_EDIT_FAILED: 'Failed to save Stock information. Please try again.',
  STOCK_GET_FAILED: 'Failed to load Stock details. Please try again.',
  STOCK_DELETE_FAILED: 'Failed to remove Stock details. Please try again.',
  STOCK_DELETE_SUCCESS: 'Stock information has been removed successfully.',

  SALE_STOCK_ADD_EDIT_SUCCESS:
    'Sale Stock information has been saved successfully.',
  SALE_STOCK_ADD_EDIT_FAILED:
    'Failed to save Sale Stock information. Please try again.',
  SALE_STOCK_GET_FAILED: 'Failed to load Sale Stock details. Please try again.',
  SALE_STOCK_DELETE_FAILED:
    'Failed to remove Sale Stock details. Please try again.',
  SALE_STOCK_DELETE_SUCCESS:
    'Sale Stock information has been removed successfully.',

  RETURN_STOCK_ADD_EDIT_SUCCESS:
    'Return Stock information has been saved successfully.',
  RETURN_STOCK_ADD_EDIT_WARNING:
    'Some products still have remaining quantities. Please add all remaining product quantities to the return before proceeding.',
  RETURN_STOCK_ADD_EDIT_FAILED:
    'Failed to save Return Stock information. Please try again.',
  RETURN_STOCK_GET_FAILED:
    'Failed to load Return Stock details. Please try again.',
  RETURN_STOCK_DELETE_FAILED:
    'Failed to remove Return Stock details. Please try again.',
  RETURN_STOCK_DELETE_SUCCESS:
    'Return Stock information has been removed successfully.',

  RETURN_ALL_REMAINING_PRODUCT_CONFIRMATION:
    'Are you sure you want to return all remaining products ({number})?',

  RETURN_STOCK_RECONFIRM_SUCCESS:
    'Return stock has been confirmed successfully.',
  RETURN_STOCK_RECONFIRM_FAILED:
    'Failed to confirm return stock. Please try again.',

  ORDER_ADD_SUCCESS: 'Order placed successfully.',
  ORDER_ADD_QUESTION: 'Do you want pay the order now ?',
  ORDER_ADD_FAILED: 'Something went wrong while placing your order.',
  ORDER_BILL_GET_FAILED: 'Failed to load Bills. Please try again.',

  PAYMENT_OVERDUE_SETTLE_SUCCESS: 'Direct Overdue settlement Successful',
  PAYMENT_OVERDUE_SETTLE_CONFIRMATION:
    'Are you sure you want to settle overdue payment now?',
  PAYMENT_SETTLE_FAILED: 'Failed to settle the payment. Please try again.',
  PAYMENT_SUMMARY_GET_FAILED:
    'Failed to load the payment details. Please try again.',

  PAYMENT_ADD_EDIT_SUCCESS: 'Payment information has been saved successfully.',
  PAYMENT_ADD_EDIT_FAILED:
    'Failed to save Payment information. Please try again.',
  PAYMENT_GET_FAILED: 'Failed to load Payment details. Please try again.',
  PAYMENT_DELETE_FAILED: 'Failed to remove Payment details. Please try again.',
  PAYMENT_DELETE_SUCCESS: 'Payment information has been removed successfully.',
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
