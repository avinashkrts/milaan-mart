import React, { Component } from "react";
import { View, Text, AsyncStorage, RefreshControl, Alert } from "react-native";
import { Divider, styled, ThemedComponentProps } from "react-native-ui-kitten";
import { BillBookScreenProps } from "../../../navigation/customer-navigator/billBook.navigator";
import { SafeAreaLayout } from "../../../components/safe-area-layout.component";
import { Toolbar } from "../../../components/toolbar.component";
import { MenuIcon } from "../../../assets/icons";
import { Styles } from "../../../assets/styles";
import { AppConstants, LabelConstants, LableText } from "../../../constants";
import axios from "axios";
import moment from "moment";
import { Content } from "native-base";
import { ScrollView } from "react-native-gesture-handler";
import { AppRoute } from "../../../navigation/app-routes";

export class BillBookScreen extends Component<BillBookScreenProps, ThemedComponentProps & any> {
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
            userDenied: '',
            shoping: '',
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

        const logedIn = await AsyncStorage.getItem('logedIn');
        if (null != logedIn && logedIn === 'true') {
            const shopIdAsync = await AsyncStorage.getItem('shopId')
            const shopName = await AsyncStorage.getItem('shopName')

            axios(AppConstants.API_BASE_URL + "/api/transaction/get/transactionby/userId/shopId/" + userData.userId + '/' + AppConstants.SHOP_ID)
                .then(res => this.setState({ transactionData: res.data.reverse() }))

            axios(AppConstants.API_BASE_URL + "/api/lookup/getalllookup")
                //.then(res => this.setState({ transactionType: res.data.PAYMENT_MODE }))
                .then((res) => {
                    if (res) {
                        res.data.PAYMENT_MODE.map((data) => {
                            if (data.lookUpName == "ONLINE_PAYMENT") {
                                this.setState({ onlinePay: data.lookUpId })
                            } else if (data.lookUpName == "WALLET_PAYMENT") {
                                this.setState({ refund: data.lookUpId })
                            } else if (data.lookUpName == "CASH") {
                                this.setState({ cashPay: data.lookUpId })
                            }
                        })

                        res.data.TRANSACTION_TYPE.map((transType) => {
                            if (transType.lookUpName == "USER_DENIED") {
                                this.setState({ userDenied: transType.lookUpId })
                            } else if (transType.lookUpName == "SHOPING") {
                                this.setState({ shoping: transType.lookUpId })
                            } else if (transType.lookUpName == "PLAN_PURCHASE") {
                                this.setState({ planPurchase: transType.lookUpId })
                            } else if (transType.lookUpName == "WITHDRAW_REQUEST") {
                                this.setState({ withdrawRequest: transType.lookUpId })
                            } else if (transType.lookUpName == "WITHDRAW_DONE") {
                                this.setState({ withdrawDone: transType.lookUpId })
                            } else if (transType.lookUpName == "ADMIN_REJECTED") {
                                this.setState({ adminRejected: transType.lookUpId })
                            }
                        })
                    }

                })
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
        const { single, userDenied, shoping, planPurchase,
            withdrawRequest, withdrawDone, adminRejected, shopName, transactionData, onlinePay, cashPay, refund } = this.state;
        let total = 0
        return (
            <SafeAreaLayout style={Styles.safeArea}>
                <Toolbar
                    title='Bill Book'
                    backIcon={MenuIcon}
                    onBackPress={this.props.navigation.openDrawer}
                    style={{ marginTop: -5, marginLeft: -5 }}
                />
                <Divider />

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
                            data.paymentMode ? data.paymentMode == refund ? total = total + data.totalAmount : null : null
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
                                                    {data.transactionType ? data.transactionType == shoping || data.transactionType == adminRejected || data.transactionType == userDenied ? data.cartId : data.transactionType == planPurchase ? data.purchaseId : data.transactionType == withdrawRequest || data.transactionType == withdrawDone ? data.withdrawId : null : null}
                                                </Text>
                                                {/* </View> */}
                                            </View>
                                            <View style={Styles.bill_column_4}>
                                                {/* <View style={Styles.bill_box}> */}
                                                {data.paymentMode == onlinePay || data.paymentMode == cashPay ? <Text style={Styles.text_design_red}>{data.totalAmount}</Text> : <Text style={Styles.text_design}> -- </Text>}
                                                {/* </View> */}
                                            </View>
                                            <View style={Styles.bill_column_5}>
                                                {/* <View style={Styles.bill_box}> */}
                                                {data.paymentMode == refund ?
                                                    <Text style={Styles.text_design_green}>{data.totalAmount}</Text> : <Text style={Styles.text_design}> -- </Text>}
                                                {/* </View> */}
                                            </View>
                                            <View style={Styles.bill_column_6}>
                                                {/* <View style={Styles.bill_box}> */}
                                                {/* {data.paymentMode == refund ? */}
                                                <Text style={Styles.text_design_green}>{data.paymentMode ? data.paymentMode == onlinePay ? 'Online' : data.paymentMode == cashPay ? 'Cash' : data.paymentMode == refund ? 'Refund' : null : null}</Text>
                                                {/* : <Text style={Styles.text_design}> -- </Text>} */}
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
            </SafeAreaLayout>
        );
    }

}