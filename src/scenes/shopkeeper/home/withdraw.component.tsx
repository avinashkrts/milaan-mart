import { Content, Radio } from "native-base";
import React, { Component } from "react";
import { RefreshControl, View, Text, Alert, AsyncStorage } from "react-native";
import { Divider, ThemedComponentProps } from "react-native-ui-kitten";
import { WithdrawScreenProps } from "../../../navigation/home.navigator";
import { SafeAreaLayout, SaveAreaInset } from "../../../components/safe-area-layout.component";
import { Toolbar } from "../../../components/toolbar.component";
import { BackIcon, CancelIcon, EditIcon, PlusIcon, RupeeIcon } from "../../../assets/icons";
import { Styles } from "../../../assets/styles";
import { ScrollView, TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { AppConstants, LableText } from "../../../constants";
import Modal from "react-native-modal";
import { scale } from "react-native-size-matters";
import Axios from "axios";
import RazorpayCheckout from 'react-native-razorpay';

export class WithdrawScreen extends Component<WithdrawScreenProps, ThemedComponentProps & any> {
    constructor(props) {
        super(props);
        this.state = {
            invoiceVisible: false,
            walletPay: true,
            payOnline: false,
            planData: [],
            withdrawAmount: '',
            gst: '',
            discount: '',
            totalAmount: '',
            price: '',
            userData: [],
            planId: '',
            accountData: [],
            isAccount: false,
            leftBalance: '',
            accountNo: '',
            confAccountNo: '',
            acHolderName: '',
            ifscCode: '',
            bankName: '',
            branchName: '',
            panNo: '',
            adharNo: '',
            mobileNo: '',
            accountId: ''
        }
        this.onRefresh = this.onRefresh.bind(this);
    }

    async componentDidMount() {
        let userDetail = await AsyncStorage.getItem('userDetail');
        let userData = JSON.parse(userDetail);

        Axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/plan/getallplan/'
        }).then((response) => {
            if (null != response.data) {
                this.setState({
                    planData: response.data
                })
            }
        }, (error) => {
            Alert.alert("Wait for a moment.")
        });

        Axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/admin/get/' + userData.adminId
        }).then((response1) => {
            if (null != response1.data) {
                this.setState({
                    userData: response1.data,
                    leftBalance: String(response1.data.availableAmount)
                })
                Axios({
                    method: 'GET',
                    url: AppConstants.API_BASE_URL + '/api/account/getaccountbyuserid/' + userData.adminId
                }).then((response) => {
                    if (null != response.data && response.data.length > 0) {
                        console.log('account Data', response.data[0].accountNum)
                        this.setState({
                            accountData: response.data,
                            accountId: String(response.data[0].id),
                            accountNo: String(response.data[0].accountNum),
                            confAccountNo: String(response.data[0].accountNum),
                            acHolderName: response.data[0].accountHolderName,
                            ifscCode: response.data[0].ifsc,
                            bankName: response.data[0].bankName,
                            branchName: response.data[0].branchName,
                            panNo: response.data[0].panNumber,
                            adharNo: response.data[0].adharNumber,
                            mobileNo: response.data[0].mobileNo,
                            isAccount: true
                        })
                    } else {
                        this.setState({
                            isAccount: false
                        })
                    }
                }, (error) => {
                    Alert.alert("Wait for a moment.")
                });
            }
        }, (error) => {
            Alert.alert("Wait for a moment.")
        });


    }

    onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });
    }

    toggleModal() {
        const { invoiceVisible } = this.state;
        this.setState({
            invoiceVisible: !invoiceVisible
        })
    }

    handlePaymentType(type) {
        switch (type) {
            case 'WALLET':
                this.setState({
                    payOnline: false,
                    walletPay: true
                })
                break;

            case 'PAYON':
                this.setState({
                    payOnline: true,
                    walletPay: false
                })
                break;

            default:
                Alert.alert("NUMBER NOT FOUND");
        }
    }

    calculatePrice(planIndex) {
        const { invoiceVisible, planCode, planData, walletPay, payOnline } = this.state;
        planData.map((plan, index) => {
            if (index == planIndex) {
                var amount = Number(plan.amount);
                var discount = 0;
                var GST = 0, totalAmount = 0;
                if (planCode === 'MILAAN_20') {
                    discount = Math.ceil((amount * 20) / 100);
                    amount = amount - discount;
                    GST = Math.ceil((amount * 18) / 100);
                    totalAmount = amount + GST;
                } else if (planCode === 'MILAAN_50') {
                    discount = Math.ceil((amount * 50) / 100);
                    amount = amount - discount;
                    GST = Math.ceil((amount * 18) / 100);
                    totalAmount = amount + GST;
                } else if (planCode === 'MILAAN_10') {
                    discount = Math.ceil((amount * 10) / 100);
                    amount = amount - discount;
                    GST = Math.ceil((amount * 18) / 100);
                    totalAmount = amount + GST;
                } else {
                    discount = 0;
                    GST = Math.ceil((amount * 18) / 100);
                    totalAmount = amount + GST;
                }

                this.setState({
                    price: Number(plan.amount),
                    discount: discount,
                    gst: GST,
                    totalAmount: totalAmount,
                    planId: plan.id
                })

                this.toggleModal();
            }
        })
    }

    handleRequest() {
        const { accountNo, isAccount, userData, confAccountNo, mobileNo, acHolderName, ifscCode, bankName, branchName, panNo, adharNo, walletPay, planId, payOnline, planCode, totalAmount } = this.state;
        console.log('Acc Post data', userData.shopId, accountNo, userData.adminId, userData.adminId, confAccountNo, mobileNo, acHolderName, ifscCode, bankName, branchName, panNo, adharNo);
        if (accountNo === '' || accountNo.length == 0) {
            Alert.alert('Please enter account number.')
        } else if (confAccountNo === '' || confAccountNo.length == 0) {
            Alert.alert('Please enter confirm account number.')
        } else if (confAccountNo !== accountNo) {
            Alert.alert('Please  enter same account number.')
        } else if (acHolderName === '' || acHolderName.length == 0) {
            Alert.alert('Please enter account holder name.')
        } else if (ifscCode === '' || ifscCode.length == 0) {
            Alert.alert('Please enter IFSC Code.')
        } else if (bankName === '' || bankName.length == 0) {
            Alert.alert('Please enter bank name.')
        } else if (branchName === '' || branchName.length == 0) {
            Alert.alert('Please enter branch name.')
        } else if (panNo === '' || panNo.length == 0) {
            Alert.alert('Please enter pan card number.')
        } else if (adharNo === '' || adharNo.length == 0) {
            Alert.alert('Please enter adhar card number.')
        } else if (mobileNo === '' || mobileNo.length == 0) {
            Alert.alert('Please enter mobile number.')
        } else if (isAccount) {
            this.sendRequest();
        } else {
            Axios({
                method: 'POST',
                url: AppConstants.API_BASE_URL + '/api/account/create',
                data: {
                    adminId: userData.adminId,
                    accountHolderName: acHolderName,
                    userType: userData.userType,
                    accountNum: accountNo,
                    ifsc: ifscCode,
                    bankName: bankName,
                    shopId: userData.shopId,
                    branchName: branchName,
                    adharNumber: adharNo,
                    panNumber: panNo,
                    mobileNo: mobileNo
                }
            }).then((response) => {
                if (null != response.data) {
                    this.toggleModal();
                    this.componentDidMount();
                    Alert.alert('Account details added successfully please request again to withdraw.')
                }
            }, (error) => {
                Alert.alert("Wait for a moment.")
            });
        }
    }

    sendRequest() {
        const { userData, accountId, withdrawAmount } = this.state;
        Axios({
            method: 'POST',
            url: AppConstants.API_BASE_URL + '/api/withdraw/create',
            data: {
                adminId: userData.adminId,
                accountId: accountId,
                shopId: userData.shopId,
                withdrawBalance: withdrawAmount
            }
        }).then((response) => {
            if (null != response.data) {
                this.setState({
                    withdrawAmount: ''
                })
                this.toggleModal();
                this.componentDidMount();
                Alert.alert('Withdraw request sent successfully.')
            }
        }, (error) => {
            Alert.alert("Wait for a moment.")
        });
    }

    amountCalc(withdrawAmount) {
        const { userData } = this.state;
        var withdrawableAmt = Number(userData.availableAmount) - 500
        if (Number(withdrawAmount) > withdrawableAmt) {
            Alert.alert('Your withdraw limit is:' + withdrawableAmt)
        } else {
            var balance = Number(userData.wallet) - Number(withdrawAmount);
            this.setState({
                withdrawAmount: withdrawAmount,
                leftBalance: balance
            })
        }
    }

    handleWithdraw() {
        const { accountData, isAccount, withdrawAmount, userData } = this.state;
        if (withdrawAmount === '' || withdrawAmount.length == 0) {
            Alert.alert('Please enter withdraw amount.')
        } else if (withdrawAmount < 100) {
            Alert.alert('Minimum withdraw balance is Rs. 100.')
        } else {
            this.setState({
                invoiceVisible: true
            })
        }
    }

    render() {
        const { userData, accountNo, isAccount, mobileNo, confAccountNo, acHolderName, bankName, branchName, ifscCode, panNo, adharNo, discount, leftBalance, withdrawAmount, price, gst, totalAmount, invoiceVisible, planCode, planData, walletPay, payOnline } = this.state;
        return (
            <SafeAreaLayout style={Styles.safeArea}
                insets={SaveAreaInset.TOP}>
                <Toolbar
                    title='Withdraw'
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
                    <View style={[Styles.withdraw_main]}>
                        <View style={{ flexDirection: 'row', padding: scale(10), justifyContent: 'space-between' }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                <Text style={[Styles.invoice_data_head]}>Current balance</Text>
                                <Text style={[Styles.invoice_data_text]}><RupeeIcon fontSize={scale(15)} />  {null != userData.wallet ? userData.wallet : '0'}</Text>
                            </View>

                            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                <Text style={[Styles.invoice_data_head]}>Available balance</Text>
                                <Text style={[Styles.invoice_data_text]}><RupeeIcon fontSize={scale(15)} />  {leftBalance}</Text>
                            </View>
                        </View>
                        <View style={[Styles.divider, { marginBottom: scale(20) }]} />

                        <View style={[Styles.withdraw_balance_box]}>
                            <Text style={[Styles.withdraw_text_head]}>Withdraw Amount</Text>
                            <TextInput
                                keyboardType='numeric'
                                style={[Styles.withdraw_balance_input]}
                                placeholder={LableText.AMOUNT}
                                value={withdrawAmount}
                                onChangeText={(value) => { this.amountCalc(value) }}
                            />
                        </View>
                        <View style={[Styles.recharge_button_view]}>
                            <TouchableOpacity style={[Styles.recharge_button_box]} onPress={() => { this.handleWithdraw() }}>
                                <Text style={[Styles.recharge_button_text]}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Content>

                <Modal style={Styles.modal} isVisible={invoiceVisible}>
                    <View style={Styles.modalHeader}>
                        <TouchableOpacity>
                            <Text onPress={() => { this.toggleModal() }}><CancelIcon fontSize={25} /></Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={[Styles.invoice_main_view]}>
                        <View style={[Styles.withdraw_balance_box]}>
                            <Text style={[Styles.withdraw_text_head]}>{LableText.ACCOUNT_NO}</Text>
                            <TextInput
                                editable={!isAccount}
                                keyboardType='numeric'
                                style={[Styles.withdraw_balance_input]}
                                placeholder={LableText.ACCOUNT_NO}
                                value={accountNo}
                                onChangeText={(value) => { this.setState({ accountNo: value }) }}
                            />
                        </View>

                        <View style={[Styles.withdraw_balance_box]}>
                            <Text style={[Styles.withdraw_text_head]}>{LableText.CONF_ACCOUNT_NO}</Text>
                            <TextInput
                                editable={!isAccount}
                                keyboardType='numeric'
                                style={[Styles.withdraw_balance_input]}
                                placeholder={LableText.CONF_ACCOUNT_NO}
                                value={confAccountNo}
                                onChangeText={(value) => { this.setState({ confAccountNo: value }) }}
                            />
                        </View>

                        <View style={[Styles.withdraw_balance_box]}>
                            <Text style={[Styles.withdraw_text_head]}>{LableText.ACCOUNT_HOLDER_NAME}</Text>
                            <TextInput
                                editable={!isAccount}
                                style={[Styles.withdraw_balance_input]}
                                placeholder={LableText.ACCOUNT_HOLDER_NAME}
                                value={acHolderName}
                                onChangeText={(value) => { this.setState({ acHolderName: value }) }}
                            />
                        </View>

                        <View style={[Styles.withdraw_balance_box]}>
                            <Text style={[Styles.withdraw_text_head]}>{LableText.IFSC_CODE}</Text>
                            <TextInput
                                editable={!isAccount}
                                style={[Styles.withdraw_balance_input]}
                                placeholder={LableText.IFSC_CODE}
                                value={ifscCode}
                                onChangeText={(value) => { this.setState({ ifscCode: value }) }}
                            />
                        </View>



                        <View style={[Styles.withdraw_balance_box]}>
                            <Text style={[Styles.withdraw_text_head]}>{LableText.BANK_NAME}</Text>
                            <TextInput
                                editable={!isAccount}
                                style={[Styles.withdraw_balance_input]}
                                placeholder={LableText.BANK_NAME}
                                value={bankName}
                                onChangeText={(value) => { this.setState({ bankName: value }) }}
                            />
                        </View>

                        <View style={[Styles.withdraw_balance_box]}>
                            <Text style={[Styles.withdraw_text_head]}>{LableText.BRANCH_NAME}</Text>
                            <TextInput
                                editable={!isAccount}
                                style={[Styles.withdraw_balance_input]}
                                placeholder={LableText.BRANCH_NAME}
                                value={branchName}
                                onChangeText={(value) => { this.setState({ branchName: value }) }}
                            />
                        </View>

                        <View style={[Styles.withdraw_balance_box]}>
                            <Text style={[Styles.withdraw_text_head]}>{LableText.PAN_NUMBER}</Text>
                            <TextInput
                                editable={!isAccount}
                                style={[Styles.withdraw_balance_input]}
                                placeholder={LableText.PAN_NUMBER}
                                value={panNo}
                                onChangeText={(value) => { this.setState({ panNo: value }) }}
                            />
                        </View>

                        <View style={[Styles.withdraw_balance_box]}>
                            <Text style={[Styles.withdraw_text_head]}>{LableText.ADHAR_NUMBER}</Text>
                            <TextInput
                                editable={!isAccount}
                                keyboardType='numeric'
                                style={[Styles.withdraw_balance_input]}
                                placeholder={LableText.ADHAR_NUMBER}
                                value={adharNo}
                                onChangeText={(value) => { this.setState({ adharNo: value }) }}
                            />
                        </View>

                        <View style={[Styles.withdraw_balance_box]}>
                            <Text style={[Styles.withdraw_text_head]}>{LableText.MOBILE}</Text>
                            <TextInput
                                editable={!isAccount}
                                style={[Styles.withdraw_balance_input]}
                                placeholder={LableText.MOBILE}
                                value={mobileNo}
                                onChangeText={(value) => { this.setState({ mobileNo: value }) }}
                            />
                        </View>


                        <View style={[Styles.recharge_button_view]}>
                            <TouchableOpacity style={[Styles.recharge_button_box]}>
                                <Text onPress={() => { this.handleRequest() }} style={[Styles.recharge_button_text]}>Send Request</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={Styles.bottomSpace} />
                    </ScrollView>
                </Modal>

            </SafeAreaLayout>
        );
    }

}