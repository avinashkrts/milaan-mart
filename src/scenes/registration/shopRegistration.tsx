import React, { Component } from 'react';
import { Alert, View, Image, TextInput, TouchableOpacity, AsyncStorage, PermissionsAndroid } from 'react-native';
import { Text } from 'react-native-ui-kitten';
import { SafeAreaLayout, SaveAreaInset, } from '../../components/safe-area-layout.component';
import { Content, Picker } from 'native-base';
import { AppRoute } from '../../navigation/app-routes';
import { EyeIcon, EyeOffIcon, } from '../../assets/icons';
import axios from 'axios';
import { Styles } from '../../assets/styles'
import { AppConstants, Color, LableText, Placeholder } from '../../constants';
import DeviceInfo from 'react-native-device-info';
import { scale } from 'react-native-size-matters';
import { ShopRegistrationScreenProps } from '../../navigation/registration.navigator';
import Geolocation from 'react-native-geolocation-service';
import { StyleSheet, BackHandler } from "react-native";
const data = [
    { text: 'Candidate' },
    { text: 'HR' },
];

type State = {}
export class ShopRegistrationScreen extends Component<ShopRegistrationScreenProps, any & State, any> {
    backHandler: any;
    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            mobileNo: '',
            pwd: '',
            userType: '1',
            userTypeData: [],
            passwordVisible: true,
            gender: '',
            genderData: [],
            shopName: '',
            shopType: '',
            shopTypeData: [],
            panNo: '',
            adharNo: '',
            gstNo: '',
            description: ''
        }

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onPasswordIconPress = this.onPasswordIconPress.bind(this);

    }

    backAction = () => {
        Alert.alert("Alert!", LableText.ALERT_REGISTER_SHOP, [
            {
                text: "Cancel",
                onPress: () => null,
                style: "cancel"
            },
            {
                text: "YES", onPress: () => {
                    this.props.navigation.navigate(AppRoute.CUSTOMER_HOME);
                }
            }
        ]);
        return true;
    };

    componentWillUnmount() {
        this.backHandler.remove();
    }

    async componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            this.backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                this.backAction
            );
        })

        this.props.navigation.addListener('blur', () => {
            this.backHandler.remove();
        })

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
            url: AppConstants.API_BASE_URL + '/api/lookup/getalllookup',
        }).then((response) => {
            this.setState({
                genderData: response.data.GENDER,
                shopTypeData: response.data.SHOP_TYPE,
                userTypeData: response.data.USER_TYPE
            })
        }, (error) => {
            Alert.alert("Didn't got data from server")
        });


    }

    onFormSubmit() {
        const { firstName, userType, passwordVisible, lastName, mobileNo, pwd, gender, genderData, shopName, shopType, shopTypeData, panNo, adharNo, gstNo, description } = this.state;
        console.log(firstName, userType, lastName, mobileNo, pwd, gender, shopName, shopType, panNo, adharNo, gstNo, description)
        if (firstName === " " || firstName.length == 0) {
            Alert.alert("Enter First Name");
        } else if (lastName === "" || lastName.length == 0) {
            Alert.alert("Enter Last Name");
        } else if (gender === "" || gender.length == 0) {
            Alert.alert("Select Gender.");
        } else if (mobileNo === "" || mobileNo.length == 0 || mobileNo.length < 10 || mobileNo.length > 10) {
            Alert.alert("Enter a valid Mobile Number");
        } else if (pwd === "" || pwd.length == 0 || pwd.length < 8) {
            Alert.alert("Password length must be more than 8 digits");
        } else if (shopName === "" || shopName.length == 0) {
            Alert.alert("Enter Business Name");
        } else if (shopType === "" || shopType.length == 0) {
            Alert.alert("Select Business Type.");
        } else if (description === "" || description.length == 0) {
            Alert.alert("Enter Business Description");
        } else {
            axios({
                method: 'post',
                url: AppConstants.API_BASE_URL + '/api/admin/create',
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    mobileNo: mobileNo,
                    pwd: pwd,
                    userType: userType,
                    gender: gender,
                    shopName: shopName,
                    shopType: shopType,
                    panNumber: panNo.length > 0 ? panNo : "",
                    adharNumber: adharNo.length > 0 ? adharNo : "",
                    gstNumber: gstNo.length > 0 ? gstNo : "",
                    description: description,
                    // playerId: 'sdsdsdsdsdsdsdsdsd'
                }
            }).then((response) => {
                if (response.data.status === "false") {
                    Alert.alert(response.data.description);
                } else {
                    AsyncStorage.setItem('phoneForOtp', JSON.stringify(mobileNo), () => {
                        Alert.alert('User account created successfully, login with your credential.');
                        this.props.navigation.navigate(AppRoute.SHOP_ADDRESS, { adminId: response.data.adminId, shopId: response.data.shopId, mobileNo: response.data.mobileNo, emailId: response.data.emailId, from: 'shopReg' });
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
        const { firstName, passwordVisible, lastName, mobileNo, pwd, gender, genderData, shopName, shopType, shopTypeData, panNo, adharNo, gstNo, description } = this.state;
        return (
            <SafeAreaLayout
                style={Styles.safeArea}
                insets={SaveAreaInset.TOP} >
                < Content style={Styles.content} >
                    <View>
                        <Image
                            source={require('../../assets/logo.png')}
                            resizeMode="contain"
                            style={[Styles.loginImage, { marginBottom: scale(50), marginTop: scale(70) }]}
                        />
                        {/* <View style={Styles.center}>
              <Text style={[Styles.loginWelcome, { paddingTop: 10 }]}>{LableText.WELCOME_TEXT}</Text>
            </View> */}
                        <View style={Styles.center}>
                            <Text style={[{ fontSize: scale(18), textAlign: 'justify', paddingHorizontal: scale(10), marginVertical: scale(10) }]}>{LableText.SIGN_UP_ALERT1}</Text>
                        </View>

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
                            <Picker
                                note
                                mode="dropdown"
                                style={[Styles.center, { color: Color.COLOR, width: '100%' }]}
                                selectedValue={gender}
                                onValueChange={(value) => { this.setState({ gender: value }) }}
                            >
                                <Picker.Item label="Select Gender" value="" />
                                {null != genderData ? genderData.map((data, index) => {
                                    return (
                                        <Picker.Item label={data.lookUpName} value={data.lookUpId} />
                                    )
                                }) : null}
                            </Picker>
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

                        <View style={Styles.inputTextView}>
                            <TextInput
                                style={Styles.inputText}
                                placeholder={LableText.SHOPNAME}
                                value={shopName}
                                onChangeText={(value) => { this.setState({ shopName: value }) }}
                            />
                        </View>

                        <View style={Styles.inputTextView}>
                            <Picker
                                note
                                mode="dropdown"
                                style={[Styles.center, { color: Color.COLOR, width: '100%' }]}
                                selectedValue={shopType}
                                onValueChange={(value) => { this.setState({ shopType: value }) }}
                            >
                                <Picker.Item label="Select Business Type" value="" />
                                {null != shopTypeData ? shopTypeData.map((data, index) => {
                                    return (
                                        <Picker.Item label={data.lookUpName} value={data.lookUpId} />
                                    )
                                }) : null}
                            </Picker>
                        </View>

                        <View style={Styles.inputTextView}>
                            <TextInput
                                style={Styles.inputText}
                                placeholder={LableText.PAN_NO}
                                value={panNo}
                                onChangeText={(value) => { this.setState({ panNo: value }) }}
                            />
                        </View>

                        <View style={Styles.inputTextView}>
                            <TextInput
                                style={Styles.inputText}
                                placeholder={LableText.ADHAR_NO}
                                keyboardType='numeric'
                                value={adharNo}
                                onChangeText={(value) => { this.setState({ adharNo: value }) }}
                            />
                        </View>

                        <View style={Styles.inputTextView}>
                            <TextInput
                                style={Styles.inputText}
                                placeholder={LableText.GST_NO}
                                value={gstNo}
                                onChangeText={(value) => { this.setState({ gstNo: value }) }}
                            />
                        </View>

                        <View style={Styles.inputTextView}>
                            <TextInput
                                multiline={true}
                                style={Styles.inputText}
                                placeholder={LableText.BUSINESS_DESCRIPTION}
                                value={description}
                                onChangeText={(value) => { this.setState({ description: value }) }}
                            />
                        </View>

                        <View style={{ marginHorizontal: '10%' }}>
                            <TouchableOpacity style={[Styles.buttonBox, Styles.center]} onPress={() => { this.onFormSubmit() }}>
                                <Text style={Styles.buttonName}>{LableText.NEXT}</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={() => { this.props.navigation.navigate(AppRoute.AUTH) }}>
                            <Text style={[Styles.dontHaveAccount, { marginTop: 5 }]}>{LableText.ALREADY_HAVE_ACCOUNT}</Text>
                        </TouchableOpacity>

                    </View>
                    <View style={Styles.bottomSpace}></View>
                </Content>
            </SafeAreaLayout >
        );
    }
};