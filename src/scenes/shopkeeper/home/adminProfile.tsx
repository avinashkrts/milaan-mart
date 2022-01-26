import React, { Component } from "react";
import { View, Text, RefreshControl, AsyncStorage } from "react-native";
import { Avatar, Divider, ThemedComponentProps } from "react-native-ui-kitten";
import { AdminProfileScreenProps } from "../../../navigation/home.navigator";
import { SafeAreaLayout, SaveAreaInset } from "../../../components/safe-area-layout.component";
import { Toolbar } from "../../../components/toolbar.component";
import { BackIcon, MenuIcon } from "../../../assets/icons";
import { Styles } from "../../../assets/styles";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { AppConstants, LableText } from "../../../constants";
import { Content } from "native-base";
import Axios from "axios";
import { Value } from "react-native-reanimated";
import { AppRoute } from "../../../navigation/app-routes";

export class AdminProfileScreen extends Component<AdminProfileScreenProps, ThemedComponentProps & any> {
    constructor(props) {
        super(props);
        this.state = {
            isEditable: false,
            userId: '',
            emailId: '',
            firstName: '',
            lastName: '',
            lastLoginDate: '',
            dob: '',
            mobileNo: '',
            city: '',
            pinCode: '',
            state: '',
            country: '',
            longitude: '',
            latitude: '',
            userType: '',
            shopId: AppConstants.SHOP_ID,
            district: '',
            postOffice: '',
            policeStation: '',
            landmark: '',
            adminId: '',
            adharNumber: '',
            panNumber: '',
            paymentStatus: '',
            shopName: '',
            shopType: '',
            validity: '',
            wallet: '',
            gstNumber: '',
            street: ''
        }

        this.onRefresh = this.onRefresh.bind(this);
    }

    async componentDidMount() {
        let userDetail = await AsyncStorage.getItem('userDetail');
        let logedIn = await AsyncStorage.getItem('logedIn');
        let userData = JSON.parse(userDetail);

        if (userData) {
            Axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/admin/getadminbyshopid/' + userData.shopId
            }).then((response) => {
                this.setState({
                    mobileNo: response.data.mobileNo,
                    city: response.data.adminAddress[0].city,
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    pinCode: String(response.data.adminAddress[0].pinCode),
                    state: response.data.adminAddress[0].state,
                    country: response.data.adminAddress[0].country,
                    longitude: response.data.adminAddress[0].longitude,
                    latitude: response.data.adminAddress[0].latitude,
                    userType: response.data.userType,
                    shopId: response.data.shopId,
                    district: response.data.adminAddress[0].district,
                    postOffice: response.data.adminAddress[0].postOffice,
                    policeStation: response.data.adminAddress[0].policeStation,
                    landmark: response.data.adminAddress[0].landmark,
                    userId: response.data.adminId,
                    adminId: response.data.adminId,
                    adharNumber: String(response.data.adharNumber),
                    panNumber: response.data.panNumber,
                    paymentStatus: String(response.data.paymentStatus),
                    shopName: response.data.shopName,
                    shopType: String(response.data.shopType),
                    validity: String(response.data.validity),
                    wallet: String(response.data.wallet),
                    gstNumber: response.data.gstNumber,
                    emailId: response.data.emailId,
                    street: response.data.street,
                })
            }, (error) => {

            });
        }
    }

    onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });
    }

    render() {
        const { street, firstName, isEditable, lastName, city, mobileNo, pinCode, state, country, userType, shopId, district, postOffice, policeStation, landmark, userId, emailId, adminId, adharNumber, panNumber, paymentStatus, shopName, shopType, validity, wallet, gstNumber } = this.state
        return (
            <SafeAreaLayout
                style={Styles.safeArea}
                insets={SaveAreaInset.TOP}>
                <Toolbar
                    title='Profile'
                    backIcon={BackIcon}
                    onBackPress={this.props.navigation.goBack}
                    style={{ marginTop: -5, marginLeft: -5 }}
                />
                <Divider />
                <Content style={Styles.content}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                    }
                >
                    <View style={[Styles.profile, Styles.center]}>
                        <View style={Styles.profile_image}>
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate(AppRoute.ADD_IMAGE) }}>
                                <Avatar source={{ uri: AppConstants.IMAGE_BASE_URL + '/avatar/' + userId + '_' + userType + '_avatar.png'}} style={Styles.profile_avatar} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Divider />

                    <View>
                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.FIRST_NAME}</Text>
                            </View>
                            <View style={Styles.user_detail_data}>
                                <TextInput
                                    editable={isEditable}
                                    value={firstName}
                                    onChangeText={(value) => { this.setState({ firstName: value }) }}
                                    style={Styles.cash_pay_input}
                                    placeholder={LableText.FIRST_NAME}
                                />
                            </View>
                        </View>

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.LAST_NAME}</Text>
                            </View>
                            <View style={Styles.user_detail_data}>
                                <TextInput editable={isEditable}
                                    value={lastName}
                                    style={Styles.cash_pay_input}
                                    placeholder={LableText.LAST_NAME}
                                    onChangeText={(value) => { this.setState({ lastName: value }) }}
                                />
                            </View>
                        </View>


                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.PHONE}</Text>
                            </View>
                            <View
                                style={Styles.user_detail_data}>
                                <TextInput editable={isEditable}
                                    value={mobileNo}
                                    style={Styles.cash_pay_input}
                                    placeholder={LableText.PHONE}
                                    onChangeText={(value) => { this.setState({ mobileNo: value }) }}
                                />
                            </View>
                        </View>

                        <View
                            style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.EMAIL_ID}</Text>
                            </View>
                            <View style={Styles.user_detail_data}>
                                <TextInput editable={isEditable}
                                    value={emailId}
                                    style={Styles.cash_pay_input}
                                    placeholder={LableText.EMAIL_ID}
                                    onChangeText={(value) => { this.setState({ emailId: value }) }}

                                />
                            </View>
                        </View>

                        {/* <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.STREET}</Text>
                            </View>
                            <View
                                style={Styles.user_detail_data}>
                                <TextInput editable={isEditable}
                                    style={Styles.cash_pay_input}
                                    placeholder={LableText.STREET}
                                    value={street}
                                    onChangeText={(value) => {this.setState({street: value }) }}
                                />
                            </View>
                        </View> */}

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.LAND_MARK}</Text>
                            </View>
                            <View
                                style={Styles.user_detail_data}>
                                <TextInput editable={isEditable}
                                    style={Styles.cash_pay_input}
                                    placeholder={LableText.LAND_MARK}
                                    value={landmark}
                                    onChangeText={(value) => { this.setState({ landmark: value }) }}
                                />
                            </View>
                        </View>

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.VILLAGE}</Text>
                            </View>
                            <View style={Styles.user_detail_data}>
                                <TextInput
                                    editable={isEditable}
                                    style={Styles.cash_pay_input}
                                    placeholder={LableText.VILLAGE}
                                    value={city}
                                    onChangeText={(value) => { this.setState({ city: value }) }}

                                />
                            </View>
                        </View>
                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.POST_OFFICE}</Text>
                            </View>
                            <View
                                style={Styles.user_detail_data}>
                                <TextInput editable={isEditable}
                                    style={Styles.cash_pay_input}
                                    placeholder={LableText.POST_OFFICE}
                                    value={postOffice}
                                    onChangeText={(value) => { this.setState({ postOffice: value }) }}
                                />
                            </View>
                        </View>

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.POLICE_STATION}</Text>
                            </View>
                            <View
                                style={Styles.user_detail_data}>
                                <TextInput editable={isEditable}
                                    style={Styles.cash_pay_input}
                                    placeholder={LableText.POLICE_STATION}
                                    value={policeStation}
                                    onChangeText={(value) => { this.setState({ policeStation: value }) }}
                                />
                            </View>
                        </View>

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.DISTRICT}</Text>
                            </View>
                            <View
                                style={Styles.user_detail_data}>
                                <TextInput editable={isEditable}
                                    style={Styles.cash_pay_input}
                                    placeholder={LableText.DISTRICT}
                                    value={district}
                                    onChangeText={(value) => { this.setState({ district: value }) }}
                                />
                            </View>
                        </View>

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.PIN_CODE}</Text>
                            </View>
                            <View style={Styles.user_detail_data}>
                                <TextInput editable={isEditable}
                                    style={Styles.cash_pay_input}
                                    placeholder={LableText.PIN_CODE}
                                    value={pinCode}
                                    onChangeText={(value) => { this.setState({ pinCode: value }) }}
                                />
                            </View>
                        </View>

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.STATE}</Text>
                            </View>
                            <View
                                style={Styles.user_detail_data}>
                                <TextInput
                                    editable={isEditable}
                                    style={Styles.cash_pay_input}
                                    placeholder={LableText.STATE}
                                    value={state}
                                    onChangeText={(value) => { this.setState({ state: value }) }}
                                />
                            </View>
                        </View>

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.SHOP_ID}</Text>
                            </View>
                            <View
                                style={Styles.user_detail_data}>
                                <TextInput
                                    editable={isEditable}
                                    style={Styles.cash_pay_input}
                                    placeholder={LableText.SHOP_ID}
                                    value={shopId}
                                    onChangeText={(value) => { this.setState({ shopId: value }) }}
                                />
                            </View>
                        </View>

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.ADHAR_NUMBER}</Text>
                            </View>
                            <View
                                style={Styles.user_detail_data}>
                                <TextInput
                                    editable={isEditable}
                                    style={Styles.cash_pay_input}
                                    placeholder={LableText.ADHAR_NUMBER}
                                    value={adharNumber}
                                    onChangeText={(value) => { this.setState({ adharNumber: value }) }}
                                />
                            </View>
                        </View>

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.PAN_NUMBER}</Text>
                            </View>
                            <View
                                style={Styles.user_detail_data}>
                                <TextInput
                                    editable={isEditable}
                                    style={Styles.cash_pay_input}
                                    placeholder={LableText.PAN_NUMBER}
                                    value={panNumber}
                                    onChangeText={(value) => { this.setState({ panNumber: value }) }}
                                />
                            </View>
                        </View>

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.PAYMENT_STATUS}</Text>
                            </View>
                            <View
                                style={Styles.user_detail_data}>
                                <TextInput
                                    editable={isEditable}
                                    style={Styles.cash_pay_input}
                                    placeholder={LableText.PAYMENT_STATUS}
                                    value={paymentStatus}
                                    onChangeText={(value) => { this.setState({ paymentStatus: value }) }}
                                />
                            </View>
                        </View>

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.SHOPNAME}</Text>
                            </View>
                            <View
                                style={Styles.user_detail_data}>
                                <TextInput
                                    editable={isEditable}
                                    style={Styles.cash_pay_input}
                                    placeholder={LableText.SHOPNAME}
                                    value={shopName}
                                    onChangeText={(value) => { this.setState({ shopName: value }) }}
                                />
                            </View>
                        </View>

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.SHOP_TYPE}</Text>
                            </View>
                            <View
                                style={Styles.user_detail_data}>
                                <TextInput
                                    editable={isEditable}
                                    style={Styles.cash_pay_input}
                                    placeholder={LableText.SHOP_TYPE}
                                    value={shopType}
                                    onChangeText={(value) => { this.setState({ shopType: value }) }}
                                />
                            </View>
                        </View>

                        {/* <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.EMAIL_ID}</Text>
                            </View>
                            <View                               
                             style={Styles.user_detail_data}>
                                <TextInput
                                 editable={isEditable}
                                    style={Styles.cash_pay_input}
                                    placeholder={LableText.EMAIL_ID}
                                    value={emailId}
                                    onChangeText={(value) => { this.setState({ emailId: value }) }}
                                 />
                            </View>
                        </View> */}

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.VALIDITY}</Text>
                            </View>
                            <View
                                style={Styles.user_detail_data}>
                                <TextInput
                                    editable={isEditable}
                                    style={Styles.cash_pay_input}
                                    placeholder={LableText.VALIDITY}
                                    value={validity}
                                    onChangeText={(value) => { this.setState({ validity: value }) }}
                                />
                            </View>
                        </View>

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.WALLET}</Text>
                            </View>
                            <View
                                style={Styles.user_detail_data}>
                                <TextInput
                                    editable={isEditable}
                                    style={Styles.cash_pay_input}
                                    placeholder={LableText.WALLET}
                                    value={wallet}
                                    onChangeText={(value) => { this.setState({ wallet: value }) }}
                                />
                            </View>
                        </View>

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.GST_NUMBER}</Text>
                            </View>
                            <View
                                style={Styles.user_detail_data}>
                                <TextInput
                                    editable={isEditable}
                                    style={Styles.cash_pay_input}
                                    placeholder={LableText.GST_NUMBER}
                                    value={gstNumber}
                                    onChangeText={(value) => { this.setState({ gstNumber: value }) }}
                                />
                            </View>
                        </View>


                    </View>


                    {/* <View style={{ marginHorizontal: '10%' }}>
                        <TouchableOpacity style={[Styles.buttonBox, Styles.center]} onPress={() => { }}>
                            <Text style={Styles.buttonName}>{LableText.EDIT}</Text>
                        </TouchableOpacity>
                    </View>


                    <View style={{ marginHorizontal: '10%' }}>
                        <TouchableOpacity style={[Styles.buttonBox, Styles.center]} onPress={() => { }}>
                            <Text style={Styles.buttonName}>{LableText.SAVE}</Text>
                        </TouchableOpacity>
                    </View> */}


                    <View style={Styles.bottomSpace}></View>
                </Content>

            </SafeAreaLayout>
        );
    }

}