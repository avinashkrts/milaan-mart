import axios from 'axios';
import React, { Component } from 'react';
import { Alert, AsyncStorage, Image, ScrollView, Text, View } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';

import { Styles } from '../../assets/styles';
import { SafeAreaLayout, SaveAreaInset } from '../../components/safe-area-layout.component';
import { AppConstants, LableText, Placeholder } from '../../constants';
import { AppRoute } from '../../navigation/app-routes';
import { ForgetPasswordScreenProps } from '../../navigation/auth.navigator';

interface State {
    email: string | undefined;
    password: string | undefined;
    token: string | undefined;
}

export class ForgetPasswordScreen extends Component<ForgetPasswordScreenProps, any & State & any> {
    constructor(props) {
        super(props);

        this.state = {
            mobileNo: 'admin214573@milaan.com',
        }

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onPasswordIconPress = this.onPasswordIconPress.bind(this);
        this.navigateHRHome = this.navigateHRHome.bind(this);
        this.navigateHome = this.navigateHome.bind(this);
        this.navigateINFORMATION = this.navigateINFORMATION.bind(this);
        this.navigateSignUp = this.navigateSignUp.bind(this);
        this.navigateOtp = this.navigateOtp.bind(this);
    }



    onFormSubmit() {
        const { mobileNo } = this.state
        console.log(mobileNo)
        if (mobileNo === '' || mobileNo == null) {
            Alert.alert('Please Enter Mobile Number');
        } else if (!mobileNo.includes("@") ? (mobileNo.length < 10 || mobileNo.length > 10) : !mobileNo.includes("@milaan.com")) {
            Alert.alert('Please Enter Correct Mobile Number');
        } else {
            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/user/sendotp/' + mobileNo,
            }).then((response) => {
                console.log(response.data)
                if (response.data.status === "false") {
                    Alert.alert(response.data.description);
                } else {
                    AsyncStorage.setItem('mobileForOtp', JSON.stringify(mobileNo), () => {
                        this.props.navigation.navigate(AppRoute.OTP);
                    })
                    this.props.navigation.navigate(AppRoute.OTP);
                }
            }, (error) => {
                console.log(error);
            });
        }
    };

    navigateHome() {
        this.props.navigation.navigate(AppRoute.HOME);
    };

    navigateOtp() {
        this.props.navigation.navigate(AppRoute.OTP);
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
        const { mobileNo } = this.state;
        return (
            <SafeAreaLayout
                style={Styles.safeArea}
                insets={SaveAreaInset.TOP} >
                < ScrollView style={[Styles.content, { backgroundColor: '#e6e6e6' }]} >
                    <View>
                        <Image
                            source={require('../../assets/logo.png')}
                            resizeMode="contain"
                            style={[Styles.loginImage, { marginTop: scale(80) }]}
                        />
                        <View style={Styles.center}>
                            <Text style={Styles.loginWelcome}>{LableText.RESET_PASSWORD}</Text>
                        </View>

                        <View style={Styles.inputTextView}>
                            <TextInput
                                style={Styles.inputText}
                                placeholder={Placeholder.PHONE}
                                value={mobileNo}
                                onChangeText={(value) => { this.setState({ mobileNo: value }) }}

                            />
                        </View>

                        <View style={{ marginHorizontal: '10%' }}>
                            <TouchableOpacity style={[Styles.buttonBox, Styles.center]} onPress={() => { this.onFormSubmit() }}>
                                <Text style={Styles.buttonName}>{LableText.RESET_PASSWORD}</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={() => { this.props.navigation.navigate(AppRoute.SIGN_IN) }}>
                            <Text style={[Styles.dontHaveAccount, { marginTop: 5 }]}>{LableText.BACK_TO_SIGN_IN}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={Styles.bottomSpace}></View>
                </ScrollView>

            </SafeAreaLayout >
        );
    }
};

