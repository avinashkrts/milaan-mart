import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';

import { Styles } from '../../assets/styles';
import { SafeAreaLayout, SaveAreaInset } from '../../components/safe-area-layout.component';
import { AppConstants, LableText, Placeholder } from '../../constants';
import { AppRoute } from '../../navigation/app-routes';
import { OtpScreenProps } from '../../navigation/auth-navigation/auth.navigator';

interface State {
    email: string | undefined;
    password: string | undefined;
    token: string | undefined;
}

type Props = OtpScreenProps & any

export class OtpScreen extends Component<Props, State & any> {
    constructor(props: Props) {
        super(props);

        this.state = {
            mobileNo: '',
            otp: '',
        }

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onPasswordIconPress = this.onPasswordIconPress.bind(this);
        this.navigateHRHome = this.navigateHRHome.bind(this);
        this.navigateHome = this.navigateHome.bind(this);
        this.navigateINFORMATION = this.navigateINFORMATION.bind(this);
        this.navigateSignUp = this.navigateSignUp.bind(this);
        this.navigateSignIn = this.navigateSignIn.bind(this);
    }

    async onFormSubmit() {
        const { mobileNo, otp } = this.state

        const email = await AsyncStorage.getItem('emailForOtp')
        const email1 = JSON.parse(email)
        // console.log('Data', otp, email)
        if (otp === '' || otp == null) {
            Alert.alert("Please enter OTP.")
        } else {
            axios({
                method: 'get',
                url: AppConstants.API_BASE_URL + '/api/user/get/otp/varification/' + otp + '/' + email1,
            }).then((response) => {
                if (response.data == null) {
                    Alert.alert('Please enter valid OTP');
                } else {
                    Alert.alert("OTP Vefrified, Please login with your credentials.")
                    this.props.navigation.navigate(AppRoute.SIGN_IN);
                }
            }, (error) => {
                console.log(error);
            });
        }
    }

    navigateHome() {
        this.props.navigation.navigate(AppRoute.HOME);
    };

    navigateSignIn() {
        this.props.navigation.navigate(AppRoute.SIGN_IN);
    };

    navigateHRHome() {
        this.props.navigation.navigate(AppRoute.HRHOME);
    };

    navigateINFORMATION() {
        this.props.navigation.navigate(AppRoute.INFORMATION);
    };

    navigateSignUp() {
        this.props.navigation.navigate(AppRoute.SIGN_UP);
    };

    onPasswordIconPress() {
        this.setState({ passwordVisible: !this.state.passwordVisible })
    };

    render() {
        const { otp } = this.state;
        return (
            <SafeAreaLayout
                style={Styles.safeArea}
                insets={SaveAreaInset.TOP} >
                < ScrollView style={[Styles.content, { backgroundColor: '#ffffff' }]} >
                    <View>
                        <Image
                            source={require('../../assets/logo.png')}
                            resizeMode="contain"
                            style={[Styles.loginImage, { marginTop: scale(80) }]}
                        />
                        {/* <View style={Styles.center}>
                            <Text style={Styles.loginWelcome}>{LableText.WELCOME_TEXT}</Text>
                        </View> */}

                        <View style={Styles.inputTextView}>
                            <TextInput
                                style={Styles.inputText}
                                placeholder={Placeholder.OTP}
                                value={otp}
                                onChangeText={(value) => { this.setState({ otp: value }) }}
                            />
                        </View>

                        <View style={{ marginHorizontal: '10%' }}>
                            <TouchableOpacity style={[Styles.buttonBox, Styles.center]} onPress={() => { this.onFormSubmit() }}>
                                <Text style={Styles.buttonName}>{LableText.SUBMIT}</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity>
                            <Text style={Styles.forgotPassword}>{LableText.RESEND_OTP}</Text>
                        </TouchableOpacity>

                    </View>
                    <View style={Styles.bottomSpace}></View>
                </ScrollView>

            </SafeAreaLayout >
        );
    }
};

