import Axios from "axios";
import { Alert } from "react-native";
import { AppConstants } from "../constants";

export const Notification = (userId, userType, content, alert) => {
    Axios({
        method: 'POST',
        url: AppConstants.API_BASE_URL + '/api/sms/send/notification',
        data: {
            userId: userId,
            userType: userType,
            content: content
        }
    }).then((response) => {
        if (alert !== 'null') {
            Alert.alert("" + alert)
        }
    }, (error) => {
        Alert.alert("Wait for a moment.")
    })
}
