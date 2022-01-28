import React, { Component } from 'react';
import { StyleSheet, Alert } from 'react-native';
import {
  Divider,
  Layout,
  Text,
  Avatar,
  Button,
  Input
} from 'react-native-ui-kitten';
// import { ProfileScreenProps } from '../../navigation/home.navigator';
import { Toolbar } from '../../components/toolbar.component';
import {
  SafeAreaLayout,
  SafeAreaLayoutElement,
  SaveAreaInset,
} from '../../components/safe-area-layout.component';
import { AppConstants } from '../../constants/AppConstants';
import { Separator, Container, Content, View, Footer, FooterTab, Form, Picker, Icon } from 'native-base';
import Axios from 'axios';
import { LabelConstants } from '../../constants/LabelConstants';
import { AsyncStorage } from 'react-native';
import { AppRoute } from '../../navigation/app-routes';
import { SignInScreen } from '.'
import { LogOutScreenProp } from '../../navigation/customer-navigator/customer.navigator';
import { StackActions } from '@react-navigation/core';
import DeviceInfo from 'react-native-device-info';

type Mystate = {

}

type Props = LogOutScreenProp & SafeAreaLayoutElement 

export class LogoutScreen extends Component<Props, Mystate & any> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  async componentDidMount() {
    let deviceId = DeviceInfo.getUniqueId();
    const data = {};
    var emailId;
    const pushAction = StackActions.push(AppRoute.AUTH);
    const logedIn = await AsyncStorage.getItem('logedIn');   

    if (logedIn === 'true') {
      let userDetail = await AsyncStorage.getItem('userDetail');
      let userData = JSON.parse(userDetail);
      var admin = await AsyncStorage.getItem('adminType')
      var customer = await AsyncStorage.getItem('customerType')  
      if (userData.userType == admin) {
        emailId = userData.emailId;
      } else if (userData.userType == customer) {
        emailId = userData.mobileNo;
      }
      Axios({
        method: 'POST',
        url: AppConstants.API_BASE_URL + '/api/user/logout',
        data: {
          emailId: emailId,
          deviceId: deviceId,
        }
      }).then((response) => {
        AsyncStorage.setItem('logedIn', JSON.stringify(''))
        AsyncStorage.setItem('userId', JSON.stringify(''))
        AsyncStorage.setItem('userDetail', JSON.stringify(data), () => {
          this.props.navigation.dispatch(pushAction)
        });
      }, (error) => {
        Alert.alert("Server error!.")
      });
    } else {
      AsyncStorage.setItem('logedIn', JSON.stringify(''))
      AsyncStorage.setItem('userId', JSON.stringify(''))
      AsyncStorage.setItem('userDetail', JSON.stringify(data), () => {
        this.props.navigation.dispatch(pushAction)
      });
    }

  }

  render() {
    return (
      <View>

      </View>
    )
  }
}