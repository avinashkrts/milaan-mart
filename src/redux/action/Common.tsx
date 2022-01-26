import { APPCONFIG } from "../config/appConfig";

export const prepareSuccessMessage = (actionType,message) => ({
  type:actionType,
  payload:{
          type:APPCONFIG.ERROR_MESSAGE_TYPE.SUCCESS,
          message:message
  }
})


export const prepareErrorMessage = (actionType,errorObj) => {
 let type=actionType;
 switch(errorObj.type){
        case APPCONFIG.ERROR_MESSAGE_TYPE.INFO:
        case APPCONFIG.ERROR_MESSAGE_TYPE.WARN:
          type=actionType;
         break;
        case APPCONFIG.ERROR_MESSAGE_TYPE.ERROR:
          type=actionType;
        break;
        default:
        break;
 }
  return{
       type:type,
       payload:errorObj
  } 
}