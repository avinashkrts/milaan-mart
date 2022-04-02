import { Divider, ThemedComponentProps } from '@ui-kitten/components';
import axios from 'axios';
import React, { Component } from 'react';
import { Alert, AsyncStorage, RefreshControl, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';

import { BackIcon, RupeeIcon } from '../../../assets/icons';
import { Styles } from '../../../assets/styles';
import { SafeAreaLayout } from '../../../components/safe-area-layout.component';
import { Toolbar } from '../../../components/toolbar.component';
import { AppConstants } from '../../../constants';
import { AppRoute } from '../../../navigation/app-routes';
import { CustomerWalletScreenProps } from '../../../navigation/customer-navigator/customer.navigator';

export class CustomerWalletScreen extends Component<CustomerWalletScreenProps, ThemedComponentProps & any> {
    constructor(props) {
        super(props);
        this.state = {
            transactionData: [],
            transactionType: [],
            onlinePay: "",
            refund: "",
            cashPay: "",
            userData: [],
            single: false,
            shopName: '',
            shopId: AppConstants.SHOP_ID,
            user: []
        }

        this.onRefresh = this.onRefresh.bind(this);
    }

    async componentDidMount() {
        let userDetail = await AsyncStorage.getItem('userDetail');
        let userData = JSON.parse(userDetail);
        // Alert.alert(""+userData.userId);
        // console.log("User Data",userData.userId)


        const logedIn = await AsyncStorage.getItem('logedIn');
        if (null != logedIn && logedIn === 'true') {
            const shopIdAsync = await AsyncStorage.getItem('shopId')
            const shopName = await AsyncStorage.getItem('shopName')

            if (null != shopIdAsync && shopIdAsync !== '') {
                // Alert.alert('')
                this.setState({ single: true, shopName: shopName, shopId: shopIdAsync })
                axios(AppConstants.API_BASE_URL + "/api/transaction/get/transactionby/userId/shopId/" + userData.userId + '/' + shopIdAsync)
                    .then(res => this.setState({ transactionData: res.data }))
            } else {
                axios({
                    method: 'GET',
                    url: AppConstants.API_BASE_URL + '/api/transaction/gettransactionbyuserid/' + userData.userId,
                }).then((response) => {
                    if (null != response.data) {
                        this.setState({
                            transactionData: response.data,
                        })
                    }
                }, (error) => {
                    Alert.alert("Server error!.")
                });

                axios({
                    method: 'GET',
                    url: AppConstants.API_BASE_URL + '/api/user/get/' + userData.userId,
                }).then((response) => {
                    if (null != response.data) {
                        this.setState({
                            user: response.data,
                        })
                    }
                }, (error) => {
                    Alert.alert("Server error!.")
                });
            }
            axios(AppConstants.API_BASE_URL + "/api/lookup/getalllookup")
                //.then(res => this.setState({ transactionType: res.data.PAYMENT_MODE }))
                .then((res) =>
                    res.data.PAYMENT_MODE.map((data) => data.lookUpName == "ONLINE_PAYMENT" ?
                        this.setState({ onlinePay: data.lookUpId }) : data.lookUpName == "REFUND" ? this.setState({ refund: data.lookUpId }) : data.lookUpName == "CASH" ? this.setState({ cashPay: data.lookUpId }) : null)
                )
                .catch(error => console.log(error))
        } else {
            this.props.navigation.navigate(AppRoute.AUTH)
        }
    }



    onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });
    }

    render() {
        const { transactionData, user, onlinePay, cashPay, refund } = this.state;
        let total = 0
        let slNo = 0
        return (
            <SafeAreaLayout style={Styles.safeArea}>
                <Toolbar
                    title='Wallet'
                    backIcon={BackIcon}
                    onBackPress={this.props.navigation.goBack}
                    style={{ marginTop: -5, marginLeft: -5 }}
                />
                <Divider />
                <ScrollView style={Styles.content}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                    }
                >
                    <View style={Styles.wallet_main}>
                        <View style={Styles.validity}>
                            <Text style={Styles.validity_text}>Your available wallet balance is <RupeeIcon fontSize={scale(14)} /> {user.walletBalance != null ? user.walletBalance : null} </Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaLayout>
        );
    }
}




















