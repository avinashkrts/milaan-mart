import React, { Component } from 'react';
import { View, Alert, Image, Text, } from 'react-native';
import { OtpScreenProps } from '../../navigation/auth.navigator';
import { AppRoute } from '../../navigation/app-routes';
import { Placeholder, LableText } from '../../constants';
import axios from 'axios';
import { SafeAreaLayout, SaveAreaInset, } from '../../components/safe-area-layout.component';
import { Content } from 'native-base';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Styles } from '../../assets/styles'
import { scale } from 'react-native-size-matters';

interface State {
    email: string | undefined;
    password: string | undefined;
    token: string | undefined;
}

export class OtpScreen extends Component<OtpScreenProps, any & State & any> {
    constructor(props) {
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

    onFormSubmit() {
        const { mobileNo, otp } = this.state
        this.navigateSignIn();
        axios({
            method: 'get',
            url: 'http://192.168.0.106:8091/api/user/validatebyotp/' + mobileNo + '/' + otp,
        }).then((response) => {
            if (response.data.status === "false") {
                Alert.alert(response.data.description);
            } else {
                this.props.navigation.navigate(AppRoute.OTP);
            }
        }, (error) => {
            console.log(error);
        });
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
                < Content style={[Styles.content, { backgroundColor: '#e6e6e6' }]} >
                    <View>
                        <Image
                            source={require('../../assets/logo.png')}
                            resizeMode="contain"
                            style={[Styles.loginImage, { marginBottom: scale(50), marginTop: scale(80) }]}
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
                </Content>

            </SafeAreaLayout >
        );
    }
};

