import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/routers';
import axios from 'axios';
import React, { Component } from 'react';
import { Alert, Image, PermissionsAndroid, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Geolocation from 'react-native-geolocation-service';
import { scale } from 'react-native-size-matters';

import { EyeIcon, EyeOffIcon } from '../../assets/icons';
import { Styles } from '../../assets/styles';
import { SafeAreaLayout, SaveAreaInset } from '../../components/safe-area-layout.component';
import { AppConstants, Color, LableText, Placeholder } from '../../constants';
import { AppRoute } from '../../navigation/app-routes';
import { SignUpScreenProps } from '../../navigation/auth-navigation/auth.navigator';

const data = [
  { text: 'Candidate' },
  { text: 'HR' },
];

type State = {}

type Props = SignUpScreenProps & any
export class SignUpScreen extends Component<Props, State, any> {
  constructor(props: Props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      mobileNo: '',
      pwd: '',
      userType: '2',
      passwordVisible: true,
    }

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onPasswordIconPress = this.onPasswordIconPress.bind(this);
  }

 async componentDidMount() {
    let deviceId = DeviceInfo.getUniqueId();

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Sone Biryani Location Permission",
          message:
            "Sone Biryani needs access to your Location " +
            "so you can get your nearest shop.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition((position) => {
          var lat = position.coords.latitude
          var long = position.coords.longitude
          AsyncStorage.setItem('latitude', String(lat))
          AsyncStorage.setItem('longitude', String(long))
          AsyncStorage.setItem('location', 'Current Location')
          // console.log('location', lat, position.coords.accuracy)
        }, (err) => {

        }, { enableHighAccuracy: true })
      } else {
        console.log("Location permission denied");
        Alert.alert("Please give location permition to use this application.")
      }
    } catch (err) {
      console.warn(err);
    }

    axios({
      method: 'GET',
      url: AppConstants.API_BASE_URL + '/api/lookup/getallusertype',
    }).then((response) => {

    }, (error) => {
      Alert.alert("Didn't got data from server")
    });
  }

  onFormSubmit() {
    const { firstName, lastName, userType, pwd, mobileNo } = this.state
    if (firstName === " " || firstName.length == 0) {
      Alert.alert("Enter First Name");
    } else if (lastName === "" || lastName.length == 0) {
      Alert.alert("Enter Last Name");
    } else if (mobileNo === "" || mobileNo.length == 0 || mobileNo.length < 10 || mobileNo.length > 10) {
      Alert.alert("Enter a valid Mobile Number");
    } else if (pwd === "" || pwd.length == 0 || pwd.length < 8) {
      Alert.alert("Password length must be more than 8 digits");
    } else {
      axios({
        method: 'post',
        url: AppConstants.API_BASE_URL + '/api/user/create/signup',
        data: {
          firstName: firstName,
          lastName: lastName,
          mobileNo: mobileNo,
          pwd: pwd,
          userType: userType,
          shopId: AppConstants.SHOP_ID
        }
      }).then((response) => {
        if (response.data.status === "false") {
          Alert.alert(response.data.description);
        } else {
          AsyncStorage.setItem('phoneForOtp', JSON.stringify(mobileNo), () => {
            Alert.alert('User account created successfully, login with your credential.');
            const pushAction = StackActions.push(AppRoute.SIGN_IN);
            this.props.navigation.dispatch(pushAction);
          })
        }
      }, (error) => {
        console.log(error);
      });
    }
  };

  onPasswordIconPress() {
    this.setState({ passwordVisible: !this.state.passwordVisible })
  };

  navigateSignIn() {
    this.props.navigation.navigate(AppRoute.SIGN_IN);
  };

  render() {
    const { firstName,passwordVisible, lastName, mobileNo, pwd } = this.state;
    return (
      <SafeAreaLayout
        style={Styles.safeArea}
        insets={SaveAreaInset.TOP} >
        < ScrollView style={[Styles.content,{backgroundColor: '#ffffff'}]} >
          <View>
            <Image
              source={require('../../assets/logo.png')}
              resizeMode="contain"
              style={[Styles.loginImage, { marginTop: scale(70)}]}
            />
            {/* <View style={Styles.center}>
              <Text style={[Styles.loginWelcome, { paddingTop: 10 }]}>{LableText.WELCOME_TEXT}</Text>
            </View> */}

            <View style={Styles.inputTextView}>
              <TextInput
                style={Styles.inputText}
                placeholder={Placeholder.FIRSTNAME}
                value={firstName}
                onChangeText={(value) => { this.setState({ firstName: value }) }}
              />
            </View>

            <View style={Styles.inputTextView}>
              <TextInput
                style={Styles.inputText}
                placeholder={Placeholder.LASTNAME}
                value={lastName}
                onChangeText={(value) => { this.setState({ lastName: value }) }}
              />
            </View>

            <View style={Styles.inputTextView}>
              <TextInput
                style={Styles.inputText}
                keyboardType='numeric'
                placeholder={Placeholder.PHONE}
                value={mobileNo}
                onChangeText={(value) => { this.setState({ mobileNo: value }) }}
              />
            </View>

            <View style={Styles.inputTextView}>
              <TextInput
              secureTextEntry={passwordVisible}
                style={Styles.inputTextWithIcon}
                placeholder={Placeholder.PASSWORD}
                value={pwd}
                onChangeText={(value) => { this.setState({ pwd: value }) }}
              />
              <View style={[Styles.inputTextIcon, Styles.center]}>
                {this.state.passwordVisible ?
                  <TouchableOpacity onPress={this.onPasswordIconPress}>
                    <Text style={{ color: Color.COLOR }}> <EyeOffIcon /></Text>
                  </TouchableOpacity> :
                  <TouchableOpacity onPress={this.onPasswordIconPress}>
                    <Text style={{ color: Color.COLOR }}> <EyeIcon /> </Text>
                  </TouchableOpacity>
                }
              </View>
            </View>     
            <View style={{ marginHorizontal: '10%' }}>
              <TouchableOpacity style={[Styles.buttonBox, Styles.center]} onPress={() => { this.onFormSubmit() }}>
                <Text style={Styles.buttonName}>{LableText.SIGN_UP}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => { this.props.navigation.navigate(AppRoute.SIGN_IN) }}>
              <Text style={[Styles.dontHaveAccount, { marginTop: 5 }]}>{LableText.ALREADY_HAVE_ACCOUNT}</Text>
            </TouchableOpacity>

          </View>
          <View style={Styles.bottomSpace}></View>
        </ScrollView>
      </SafeAreaLayout >
    );
  }
};