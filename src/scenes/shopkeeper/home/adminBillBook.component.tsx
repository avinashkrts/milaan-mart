import React, { Component } from "react";
import { View, Text, RefreshControl, Alert, AsyncStorage } from "react-native";
import { Divider, styled, ThemedComponentProps } from "react-native-ui-kitten";
import { AdminBillBookScreenProps } from "../../../navigation/home.navigator";
import { SafeAreaLayout } from "../../../components/safe-area-layout.component";
import { Toolbar } from "../../../components/toolbar.component";
import { BackIcon, MenuIcon } from "../../../assets/icons";
import { Styles } from "../../../assets/styles";
import { AppConstants, LabelConstants, LableText } from "../../../constants";
import axios from "axios";
import moment from "moment";
import { ScrollView } from "react-native-gesture-handler";

export class AdminBillBookScreen extends Component<AdminBillBookScreenProps, ThemedComponentProps & any> {
    constructor(props) {
        super(props);
        this.state = {
            transactionData: [],
            transactionType: [],
            onlinePay: "",
            refund: "",
            cashPay: "",
            userData: [],
            walletPay: '',
            userDenied: '',
            shopping: '',
            planPurchase: '',
            withdrawRequest: '',
            withdrawDone: '',
            adminRejected: ''
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

            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/transaction/gettransactionbyshopid/' + userData.shopId,
            }).then((response) => {
                if (null != response.data) {
                    this.setState({
                        transactionData: response.data.reverse(),
                    })
                }
            }, (error) => {
                Alert.alert("Wait for a moment.")
            });

            axios(AppConstants.API_BASE_URL + "/api/lookup/getalllookup")
                //.then(res => this.setState({ transactionType: res.data.PAYMENT_MODE }))
                .then((res) => {
                    res.data.TRANSACTION_TYPE.map((data) => data.lookUpName == "USER_DENIED" ? this.setState({ userDenied: data.lookUpId }) :
                        data.lookUpName == "SHOPING" ? this.setState({ shopping: data.lookUpId }) :
                            data.lookUpName == "PLAN_PURCHASE" ? this.setState({ planPurchase: data.lookUpId }) :
                                data.lookUpName == "WITHDRAW_REQUEST" ? this.setState({ withdrawRequest: data.lookUpId }) :
                                    data.lookUpName == "WITHDRAW_DONE" ? this.setState({ withdrawDone: data.lookUpId }) :
                                        data.lookUpName == "ADMIN_REJECTED" ? this.setState({ adminRejected: data.lookUpId }) :
                                            null)

                    res.data.PAYMENT_MODE.map((data) => data.lookUpName == "ONLINE_PAYMENT" ? this.setState({ onlinePay: data.lookUpId }) :
                        data.lookUpName == "CASH" ? this.setState({ cashPay: data.lookUpId }) :
                            data.lookUpName == "WALLET_PAYMENT" ? this.setState({ walletPay: data.lookUpId }) :
                                null)
                })
                .catch(error => console.log(error))
        }
    }

    onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });
    }

    render() {
        const { userData, single, userDenied, shopping, planPurchase, withdrawRequest, withdrawDone, adminRejected, walletPay, shopName, transactionData, onlinePay, cashPay, refund } = this.state;
        let total = 0
        return (
            <SafeAreaLayout style={Styles.safeArea}>
                <Toolbar
                    title='Bill Book'
                    backIcon={BackIcon}
                    onBackPress={this.props.navigation.goBack}
                    style={{ marginTop: -5, marginLeft: -5 }}
                />
                <Divider />
                {/* <Content style={styles.content}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                    }
                > */}


                <View style={[Styles.bill_main]}>
                    <View style={Styles.bill_row}>
                        <View style={Styles.bill_column_1}>
                            {/* <View style={Styles.bill_box}> */}
                            <Text style={Styles.head_design}>{LabelConstants.customer_bill_serial_number}</Text>
                            {/* </View> */}
                        </View>
                        <View style={Styles.bill_column_2}>
                            {/* <View style={Styles.bill_box}> */}
                            <Text style={Styles.head_design}>{LabelConstants.customer_bill_date}</Text>
                            {/* </View> */}
                        </View>
                        <View style={Styles.bill_column_3}>
                            {/* <View style={Styles.bill_box}> */}
                            <Text style={Styles.head_design}>{LabelConstants.customer_bill_transactinId}</Text>
                            {/* </View> */}
                        </View>
                        <View style={Styles.bill_column_4}>
                            {/* <View style={Styles.bill_box}> */}
                            <Text style={Styles.head_design}>{LabelConstants.customer_bill_debit}</Text>
                            {/* </View> */}
                        </View>
                        <View style={Styles.bill_column_5}>
                            {/* <View style={Styles.bill_box}> */}
                            <Text style={Styles.head_design}>{LabelConstants.customer_bill_credit}</Text>
                            {/* </View> */}
                        </View>
                        <View style={Styles.bill_column_6}>
                            {/* <View style={Styles.bill_box}> */}
                            <Text style={Styles.head_design}>{LabelConstants.REMARKS}</Text>
                            {/* </View> */}
                        </View>

                    </View>
                    {/* <View style={Styles.bill_main}> */}
                    <ScrollView style={Styles.content}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh.bind(this)}
                            />
                        }
                    >
                        {null != transactionData ? transactionData.map((data, index) => {
                            data.paymentMode == onlinePay && (data.transactionType == shopping) ? total = total + data.totalAmount : data.paymentMode == walletPay && (data.transactionType == adminRejected || data.transactionType == userDenied || data.transactionType == withdrawRequest || data.transactionType == planPurchase) ? total = total - data.totalAmount : null
                            return (
                                <View>
                                    <Divider />
                                    <View style={Styles.wallet_row}>
                                        <View style={index % 2 == 1 ? Styles.bill_row_1 : Styles.bill_row_2}>
                                            <View style={Styles.bill_column_1}>
                                                {/* <View style={Styles.bill_box}> */}
                                                <Text style={Styles.text_design}>{index + 1}</Text>
                                                {/* </View> */}
                                            </View>
                                            <View style={Styles.bill_column_2}>
                                                {/* <View style={Styles.bill_box}> */}
                                                <Text style={Styles.text_design}> {moment(data.createdOn).format('DD-MM-YY')}  </Text>
                                                {/* </View> */}
                                            </View>
                                            <View style={Styles.bill_column_3}>
                                                {/* <View style={Styles.bill_box}> */}
                                                <Text style={Styles.text_design}>
                                                    {data.transactionType ? data.transactionType == shopping || data.transactionType == adminRejected || data.transactionType == userDenied ? data.cartId : data.transactionType == planPurchase ? data.purchaseId : data.transactionType == withdrawRequest || data.transactionType == withdrawDone ? data.withdrawId : null : null}
                                                </Text>
                                                {/* </View> */}
                                            </View>
                                            <View style={Styles.bill_column_4}>
                                                {/* <View style={Styles.bill_box}> */}
                                                {data.paymentMode == refund || data.paymentMode == walletPay ?
                                                    <Text style={Styles.text_design_red}>{data.totalAmount}</Text> : <Text style={Styles.text_design}> -- </Text>}
                                                {/* </View> */}
                                            </View>
                                            <View style={Styles.bill_column_5}>
                                                {/* <View style={Styles.bill_box}> */}
                                                {data.paymentMode == onlinePay || data.paymentMode == cashPay ? <Text style={Styles.text_design_green}>{data.totalAmount}</Text> : <Text style={Styles.text_design}> -- </Text>}
                                                {/* </View> */}
                                            </View>
                                            <View style={Styles.bill_column_6}>
                                                {/* <View style={Styles.bill_box}> */}
                                                <Text style={Styles.text_design_green}>{data.paymentMode ? data.paymentMode == onlinePay ? 'Online' : data.paymentMode == cashPay ? 'Cash' : data.paymentMode == walletPay && data.transactionType == adminRejected ? 'Rejected' : data.paymentMode == walletPay && data.transactionType == userDenied ? 'Not Delivered' : data.paymentMode == walletPay && data.transactionType == withdrawRequest ? 'Withdraw' : data.paymentMode == walletPay && data.transactionType == planPurchase ? 'Recharge' : null : null}</Text>
                                                {/* </View> */}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
                        }
                        ) : null}
                    </ScrollView>
                    <View style={[Styles.bill_box]}>
                        <View style={[Styles.bill_row, { justifyContent: 'space-between' }]}>
                            <Text style={[Styles.bill_bottom_text]}>Total :- </Text>
                            <Text style={Styles.bill_amount}>{total}</Text>
                            {/* <Text style={Styles.bill_paid}>85000</Text> */}
                            {/* <Text style={Styles.bill_due}>15000</Text> */}
                        </View>
                    </View>

                </View>

                {/* 
                <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>This page will be added soon.</Text>
                </View> */}
                {/* </Content> */}
            </SafeAreaLayout>
        );
    }

}