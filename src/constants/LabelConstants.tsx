import { AsyncStorage } from "react-native";

/*------------------------------------------------------------COLOR CODE------------------------------------------------------------*/
export class Color {
    // public static readonly COLOR = '#0074d3';
    public static readonly COLOR = '#db3246';
    public static readonly BUTTON_NAME_COLOR = '#fff';
    public static readonly COLOR_CUSTOMER = '#501B1D';
    public static readonly COLOR_ITEM_NAME = '#777777';
    public static readonly BORDER = '#d1d1d1';
    public static readonly CART_LIST_EVEN = '#501B1D';
    public static readonly CART_LIST_ODD = '#4dd2ff';
    public static readonly CART_BACKGROUND = '#f2f2f2';
    public static readonly SILVER = '#8f8f8f';
    public static readonly STATUS_BAR = '#dfdfdf';
    public static readonly BLACK = '#000000';
    public static readonly CARD_BORDER = '#d2f7ef';
    public static readonly CARD_BACKGROUND = '#ebf7f5';
    public static readonly DROP_DOWN_BACKGROUND = '#9dc4f2';
    public static readonly DESCRIPTION_BACKGROUND = '#94fffa';
    public static readonly DESCRIPTION_OPTION_BACKGROUND = '#9dc4f2';

    public static readonly OFFER = '#285c36';
}

/*------------------------------------------------------------PADDING CODE------------------------------------------------------------*/
export class Padding {
    public static readonly HORIZONTAL_PADDING = 20;
}

/*------------------------------------------------------------TEXT------------------------------------------------------------*/
var logIn;

const logedIn = async () => {
    const value = await AsyncStorage.getItem('logedIn')
    logIn = value
    console.log('data login', logIn)
}

export class LableText {
    public static readonly LOGOUT = logedIn() && Boolean(logIn) ? 'Logout' : 'Login';
    public static readonly USER = 'user';
    public static readonly WARNING = 'Warning';
    public static readonly CURRENT_STOCK = 'Current Stock';
    public static readonly ACCEPT = 'Accept';
    public static readonly YOUR_PLAN_CODE = 'Plan Code';
    public static readonly SELECT_CUSTOM_LOCATION = 'Set Location';
    public static readonly REJECT = 'Reject';
    public static readonly CHOOSE_IMAGE = 'Choose Image';
    public static readonly UPLOAD = 'Upload';
    public static readonly NEXT = 'Next';
    public static readonly FINISH = 'Finish';
    public static readonly WELCOME_TEXT = 'Welcome';
    public static readonly SIGN_IN = 'Sign In';
    public static readonly SKIP_LOGIN = 'Skip Login';
    public static readonly ADD = 'Add';
    public static readonly CANCLE = 'Cancle';
    public static readonly SIGN_UP = 'Sign Up';
    public static readonly FORGOT_PASSWORD = 'Forgot Password';
    public static readonly RESEND_OTP = 'Resend OTP';
    public static readonly DONT_HAVE_ACCOUNT = "You Don't Have an Account";
    public static readonly ALREADY_HAVE_ACCOUNT = "Already Have an Account";
    public static readonly SUBMIT = "Submit";
    public static readonly RESET_PASSWORD = "Reset Password";
    public static readonly ANOTHER_NUMBER = "Use another number";
    public static readonly NAME = 'Name';
    public static readonly FIRST_NAME = 'First Name';
    public static readonly LAST_NAME = 'Last Name';
    public static readonly FATHER_NAME = "Father's Name";
    public static readonly VILLAGE = 'Village / City';
    public static readonly ADDRESS = 'Address';
    public static readonly POST_OFFICE = 'Post Office';
    public static readonly POLICE_STATION = 'Police Station';
    public static readonly DISTRICT = 'District';
    public static readonly PIN_CODE = 'Pin Code';
    public static readonly STATE = 'State';
    public static readonly ADHAR_NUMBER = 'Adhar Number';
    public static readonly PAN_NUMBER = 'Pan Number';
    public static readonly SALARY = 'Salary';
    public static readonly SALARY_TYPE = 'Salary Type';
    public static readonly JOINING_DATE = 'Joining Date';
    public static readonly ADVANCE_SALARY = 'Advance Salary';
    public static readonly ATTENDANCE = 'Attendance';
    public static readonly INCENTIVE = 'Incentive';
    public static readonly WORKING_DAYS = 'Working Days';
    public static readonly PRESENT = 'Present';
    public static readonly DESIGNATION = 'Designation';
    public static readonly EMPLOYEE_ID = 'Employee Id';
    public static readonly ABSENT = 'Absent';
    public static readonly BONUS = 'Bonus';
    public static readonly LEAVE_FROM = 'Leave From';
    public static readonly LEAVE_TO = 'Leave To';
    public static readonly LEAVE_TYPE = 'Leave Type';
    public static readonly EMAIL_ID = 'Email ID';
    public static readonly STREET = 'Street';
    public static readonly LAND_MARK = 'Land Mark';
    public static readonly COUNTRY = 'Country';
    public static readonly REJECTION_CAUSE = 'Why are you going to reject?';
    public static readonly WRIET_REVIEW = 'Write your review';
    public static readonly DENIE_REVIEW = 'Please write correct reason?';
    public static readonly EXPECTED_D_DATE = 'Expected delivery date and time.';
    public static readonly D_BOY_NAME = 'Name of delivery boy.';
    public static readonly COURIER_NAME = 'Name of courier company.';
    public static readonly COURIER_ID = 'Courier/Tracking ID.';
    public static readonly D_BOY_NUMBER = 'Mobile number of delivery boy';
    public static readonly DELIVERY_CHARGE = 'Delivery charge.';
    public static readonly PHONE = 'Phone';
    public static readonly TOTAL_AMT = 'Total Amount';
    public static readonly DUES = 'Dues';
    public static readonly LAST_PAID = 'Last Paid';
    public static readonly CASH_PAY = 'Cash Payment';
    public static readonly TRANSACTION_HISTORY = 'Transaction History';
    public static readonly CHECK_HISTORY = 'Check History';
    public static readonly PAYMENT = 'Payment';
    public static readonly CART = 'Add To Cart';
    public static readonly BUY = 'Buy';
    public static readonly SKIP = 'Skip';
    public static readonly MOBILE = 'Mobile Number.';
    public static readonly SAVE = 'Save';
    public static readonly EDIT = 'Edit';
    public static readonly ADDNEWADDRESS = 'Add New Address';
    public static readonly SHOPNAME = 'Business Name';
    public static readonly GST = 'GST No.';
    public static readonly BANK_ACCOUNT = 'Bank Account Details';
    public static readonly BANK_NAME = 'Bank Name';
    public static readonly BANK_ACCOUNT_NUMBER = '34514786284';
    public static readonly BANK_ACCOUNT_NAME= 'Vishal General Store';
    public static readonly BANK_IFSC_CODE = 'SBIN0001342';
    public static readonly BACK_TO_SIGN_IN = 'Back to sign In'
    public static readonly SELLING_PRICE= 'Selling Price';
    public static readonly COST_PRICE = 'Product Cost Price';
    public static readonly OLD_PRICE = 'Old Price';
    public static readonly QUANTITY = 'Selling Product Quantity';
    public static readonly DESCRIPTION = 'Description';
    public static readonly BARCODE = 'HSN Code';
    public static readonly PRODUCT_NAME = 'Product Name';
    public static readonly STOCK = 'Stock Quantity';
    public static readonly OUT_OF_STOCK = 'Stock Limit(Alert)';
    public static readonly OUT_OF_STOCK_LIST = 'Out Of Stock';
    public static readonly CATEGORY = 'Category';
    public static readonly BRAND = 'Brand';
    public static readonly OFFER = 'Offer';
    public static readonly EXPIRE = 'Expire';
    public static readonly OFFER_FROM = 'Offer From';
    public static readonly OFFER_TO = 'Offer To';
    public static readonly MANUFACTURE_DATE = 'Date of Manufacture';
    public static readonly EXPIRE_DATE = 'Date of Expire';
    public static readonly EXPIRE_MANUFAFACTURE = 'Expiry/Manufacturing';
    public static readonly OFFER_PERCENT = 'Offer Percent';
    public static readonly DISCOUNT = 'Discount Percentage';
    public static readonly FROM_DATE = 'From Which Date';
    public static readonly TO_DATE = 'Till Last Date';
    public static readonly GST_PERCENT = 'GST Percent';
    public static readonly GST_AMOUNT = 'GST Amount';
    public static readonly MEASUREMENT = 'Selling Product Measurement';
    public static readonly SHOP_ID= 'Shop Id';
    public static readonly PAYMENT_STATUS= 'Payment Status';
    public static readonly SHOP_TYPE= 'Shop Type';
    public static readonly VALIDITY= 'Validity';
    public static readonly WALLET= 'Wallet';
    public static readonly GST_NUMBER= 'GST Number';
    public static readonly AMOUNT= 'Amount';
    public static readonly ACCOUNT_NO= 'Account Number';
    public static readonly CONF_ACCOUNT_NO= 'Confirm Account Number';
    public static readonly ACCOUNT_HOLDER_NAME= 'Account Holder Name';
    public static readonly IFSC_CODE= 'IFSC Code';
    public static readonly BRANCH_NAME= 'Branch Name';
    public static readonly SHOP_NAME= 'Business Name';
    public static readonly GENDER= 'Gender';
    public static readonly BUSINESS_TYPE= 'Business Type';
    public static readonly ADHAR_NO= 'Adhar Number';
    public static readonly PAN_NO= 'Pan Number';
    public static readonly GST_NO= 'GST Number';
    public static readonly BUSINESS_DESCRIPTION= 'Business Description';
    public static readonly USE_CURRENT_LOCATION= 'Use Current Location';
    public static readonly CANCEL_REASION= 'Cancellation Reason';
    public static readonly ENTER_CANCEL_REASION= 'Enter Cancellation Reason (minimum 50 letters)';
    public static readonly ENTER_OTP = 'Enter OTP';    
    public static readonly SIGN_UP_ALERT = 'If you are facing network or any other issue while registring your bussiness, You may Log In with your Admin ID and Password to complete the registration.';    
    public static readonly SIGN_UP_ALERT1 = 'If your registration have been failed in address registration or image uploading page due to network or any other issue while registring your bussiness, You may Log In with your Admin ID and Password to complete the registration.';  
    public static readonly ALERT_REGISTER_SHOP = 'Are you really want to cancel the process of Business registration?';    
    public static readonly ALERT_REGISTER_IMAGE = 'Are you really want to cancel the process of Business registration? kindly use Admin Id and Password to complete the business registration in future.';    
    public static readonly CUS_HOME_PAGE = 'Are you really want to Exit?';    

}

/*------------------------------------------------------------PLACE HOLDER------------------------------------------------------------*/
export class Placeholder {

    public static readonly PHONE = 'Phone';
    public static readonly PHONE_EMAIL = 'Phone/Admin ID';
    public static readonly EMAIL = 'Email ID';
    public static readonly PASSWORD = 'Password';
    public static readonly FIRSTNAME = 'First Name';
    public static readonly LASTNAME = 'Last Name';
    public static readonly OTP = 'OTP';
    public static readonly AMOUNT = 'Amount';
    public static readonly CATEGORY = 'Category';
    public static readonly NAME = 'Name';
    public static readonly SELLING_PRICE= 'Selling Price';
    public static readonly COST_PRICE = 'Cost Price';
    public static readonly OLD_PRICE = 'Old Price';
    public static readonly QUANTITY = 'Quantity';
    public static readonly DESCRIPTION = 'Description';
    public static readonly BARCODE = 'Barcode';
    public static readonly STOCK = 'Stock';
}

export class Contents {
    public static readonly ACCEPT_ORDER = 'Your order has been accepted.';
    public static readonly REJECT_ORDER = 'Your order has been rejected.';
    public static readonly PACK_ORDER = 'Your order has been packed.';
    public static readonly SHIPPED_ORDER_COURIER = 'Your order has been shipped by courier.';
    public static readonly SHIP_SELF_PICKUP = 'Your courier has been ready to self pickup.';
    public static readonly SHIP_DELIVERY_BOY = 'Your order has been shipped by delivery boy.';
    public static readonly DELIVERY_PARTNER = 'Your order has been delivered by delivery partner.';
    public static readonly DELIVERY = 'Your courier has been delivered by delivery person.';
    public static readonly ORDER_DELIVERED = 'Order has been delivered successfully.';
    public static readonly ORDER_NOT_DELIVERED = 'Order has not been received by customer.';

    public static readonly ORDER_PLACED = 'You have got an order of Rs. ';
 }

export class LabelConstants {

    public static readonly ALERT_USER_ID = 'Please Enter User Id';
    public static readonly ALERT_DESIGNATION = 'Please Enter Your Designation';
    public static readonly ALERT_COMPANY_INDUSTRY = 'Please Enter Company Industry';
    public static readonly ALERT_COMPANY_NAME = 'Please Enter Company Name';
    public static readonly ALERT_COMPANY_LOCATION = 'Please Enter Company Location';
    public static readonly ALERT_COMPANY_STRENGTH = 'Please Enter Company Strength';

    public static readonly ALERT_LATEST_COMPANY_NAME = 'Please Enter Your Latest Company Name';
    public static readonly ALERT_LATEST_JOB_ROLE = 'Please Enter Your Latest Job Role';
    public static readonly ALERT_LATEST_JOB_DESIGNATION = 'Please Enter Your Latest Job Designation';
    public static readonly ALERT_LATEST_JOB_FROM = 'Please Select Latest Job Date From';
    public static readonly ALERT_LATEST_JOB_TO = 'Please Select Latest Job Date To';
    public static readonly ALERT_LATEST_JOB_SALARY_TYPE = 'Please Select Latest Job Salary Type';
    public static readonly ALERT_LATEST_JOB_SALARY = 'Please Enter Latest Job Salary';
    public static readonly ALERT_WILL_JOIN = 'Please Select When You Will Join';

    public static readonly ALERT_PREFERRED_CITY = 'Please Enter Your Preferred Job City';
    public static readonly ALERT_EXPECTED_SALARY_FROM = 'Please Enter Your Expected Salary From';
    public static readonly ALERT_EXPECTED_SALARY_TO = 'Please Enter Your Expected Salary To';

    public static readonly ALERT_JOB_OPENINGS = 'Please Enter Number of Job Openings';
    public static readonly ALERT_JOB_LOCATION = 'Please Enter Your Job Location';
    public static readonly ALERT_JOB_MINQUALFICATION = 'Please Select Minimum Qualification';
    public static readonly ALERT_JOB_EXPERIENCE_REQUIRED = 'Please Select Required Experience';
    public static readonly ALERT_JOB_SALARY_FROM = 'Please Enter Salary Offered From';
    public static readonly ALERT_JOB_SALARY_TO = 'Please Enter Salary Offered To';
    public static readonly ALERT_JOB_SALARY_TYPE = 'Please Select Salary Type';

    public static readonly ALERT_JOB_SKILL = 'Please Select Job Skill';
    public static readonly ALERT_JOB_DESCRIPTION = 'Please Enter Job Description';

    public static readonly com_alert_invalid_email_or_password = 'Invalid Email Or Password';
    public static readonly com_alert_changepassword = 'Password Changed Successfully';
    public static readonly com_alert_enter_password = 'Enter Password';
    public static readonly com_alert_enter_confirm_password = 'Enter Confirm Password';
    public static readonly com_alert_enter_email_id = 'Enter Email-ID';
    public static readonly com_alert_enter_first_name = 'Enter First Name';
    public static readonly com_alert_enter_last_name = 'Enter Last Name';
    public static readonly com_alert_enter_email_address = 'Enter Email Address';
    public static readonly com_alert_enter_date_of_birth = 'Enter Date Of Birth';
    public static readonly com_alert_enter_city = 'Enter City';
    public static readonly com_alert_enter_phone_number = 'Enter Phone Number';
    public static readonly com_alert_error_alert = 'البريد الإلكتروني أو كلمة السر خاطئة';
    public static readonly com_alert_password_mismatch_please_try_again = 'Password Mismatch Please Try Again';
    public static readonly com_alert_password_updated_successfully = 'Password Updated Successfully';
    public static readonly com_alert_choose_availability = 'Choose Availability';
    public static readonly com_alert_choose_category = 'Choose Category';
    public static readonly com_alert_choose_language = 'Choose Language';
   
   
    public static readonly customer_bill_serial_number = 'Sl. No.';
    public static readonly customer_bill_date = 'Date';
    public static readonly customer_bill_transactinId = 'Order Id';
    public static readonly customer_bill_debit = 'Dr.';
    public static readonly customer_bill_credit = 'Cr.';
    public static readonly REMARKS = 'Remark';
    public static readonly REFUND = 'REFUND';



    public static readonly wallet_serial_number = 'Sl. No.';
    public static readonly wallet_date = 'Date';
    public static readonly wallet_transactionid = 'Transaction Id';
    public static readonly wallet_amount = 'Amount';
    public static readonly wallet_credit = 'Credit';
    public static readonly wallet_debit = 'Debit';
};