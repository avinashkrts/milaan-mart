import { Content, Radio } from "native-base";
import React, { Component } from "react";
import { RefreshControl, View, Text, Alert, AsyncStorage } from "react-native";
import { Divider, ThemedComponentProps } from "react-native-ui-kitten";
import { RechargeScreenProps } from "../../../navigation/home.navigator";
import { SafeAreaLayout, SaveAreaInset } from "../../../components/safe-area-layout.component";
import { Toolbar } from "../../../components/toolbar.component";
import { BackIcon, CancelIcon, EditIcon, PlusIcon, RupeeIcon } from "../../../assets/icons";
import { Styles } from "../../../assets/styles";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { AppConstants, LableText } from "../../../constants";
import Modal from "react-native-modal";
import { scale } from "react-native-size-matters";
import Axios from "axios";
import RazorpayCheckout from 'react-native-razorpay';

export class RechargeScreen extends Component<RechargeScreenProps, ThemedComponentProps & any> {
    constructor(props) {
        super(props);
        this.state = {
            invoiceVisible: false,
            walletPay: true,
            payOnline: false,
            planData: [],
            planCode: '',
            gst: '',
            discount: '',
            totalAmount: '',
            price: '',
            userData: [],
            planId: '',
            onlinePay: '',
            cashPay: '',
            walletPayment: ''
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
            // Alert.alert("Server error!.")
        });

        Axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/admin/get/' + userData.adminId
        }).then((response) => {
            if (null != response.data) {
                this.setState({
                    userData: response.data
                })
            }
        }, (error) => {
            // Alert.alert("Server error!.")
        });

        Axios(AppConstants.API_BASE_URL + "/api/lookup/getalllookup")
        //.then(res => this.setState({ transactionType: res.data.PAYMENT_MODE }))
        .then((res) => {
            res.data.PAYMENT_MODE.map((data) => data.lookUpName == "ONLINE_PAYMENT" ? this.setState({ onlinePay: data.lookUpId }) :
                data.lookUpName == "CASH" ? this.setState({ cashPay: data.lookUpId }) :
                    data.lookUpName == "WALLET_PAYMENT" ? this.setState({ walletPayment: data.lookUpId }) :
                        null)
        })
        .catch(error => console.log(error))
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

    payNow() {
        const { userData, walletPay, planId, walletPayment, payOnline, planCode, totalAmount } = this.state;
        console.log('All DATA', userData.wallet, userData.adminId, userData.shopId, planId, walletPayment, planCode);
        var percent = Math.ceil((totalAmount * 2) / 100);
       var deduct = percent + 500 + totalAmount;
        if (walletPay) {
            if (userData.wallet >= deduct) {
                if (planCode === 'MILAAN_20' || planCode === 'MILAAN_50' || planCode === 'MILAAN_10') {
                    Axios({
                        method: 'POST',
                        url: AppConstants.API_BASE_URL + '/api/purchase/create',
                        data: {
                            adminId: userData.adminId,
                            planId: planId,
                            shopId: userData.shopId,
                            transactionId: 'WALLET-MILAAN-123',
                            paymentMode: walletPayment,
                            discountType: planCode
                        }
                    }).then((response) => {
                        if (null != response.data) {
                            this.toggleModal();
                            Alert.alert("Recharse done.")
                        }
                    }, (error) => {
                        Alert.alert("Server error!.")
                    });
                } else {
                    // console.log('Recharge Data', userData.adminId, planId, userData.shopId, walletPayment);
                    
                    Axios({
                        method: 'POST',
                        url: AppConstants.API_BASE_URL + '/api/purchase/create',
                        data: {
                            adminId: userData.adminId,
                            planId: planId,
                            shopId: userData.shopId,
                            transactionId: 'WALLET-RECHARGE-FROM-MILAAN',
                            paymentMode: walletPayment
                        }
                    }).then((response) => {
                        if (null != response.data) {
                            this.toggleModal();
                            Alert.alert("Recharse done.")
                        }
                    }, (error) => {
                        Alert.alert("Server error!.")
                    });
                }
            } else {
                Alert.alert('Insuficient balance in your wallet.')
            }
        } else if (payOnline) {
           this.startPayment();
        }
    }

    startPayment() {
        const { userData, totalAmount, onlinePay, planId, planCode, userMobileNo, userName } = this.state;
        const options = {
            description: "MILAAN IT",
            image: 'http://ec2-65-0-32-190.ap-south-1.compute.amazonaws.com/shop/61_4_MILAAN661_shop.png',
            currency: "INR",
            key: AppConstants.RAZORPAY_KEY,
            amount: totalAmount * 100,
            name: 'MILAAN IT',
            prefill: {
                email: 'milaan@in.com',
                contact: '1234567891',
                name: 'Milaan'
            },
            theme: { color: '#501B1D' }
        }
        RazorpayCheckout.open(options).then((data) => {
            // console.log('razor pay response', data.razorpay_payment_id);
            // console.log(cartId, totalAmt, transactionId, data.razorpay_payment_id)

            Axios({
                method: 'POST',
                url: AppConstants.API_BASE_URL + '/api/purchase/create',
                data: {
                    adminId: userData.adminId,
                    planId: planId,
                    shopId: userData.shopId,
                    transactionId: data.razorpay_payment_id,
                    paymentMode: onlinePay,
                    discountType: planCode
                }
            }).then((response) => {
                if (null != response.data) {
                    this.toggleModal();
                    Alert.alert("Recharge done.")
                }
            }, (error) => {
                Alert.alert("Server error!.")
            });
        })
    }

    render() {
        const { discount, price, gst, totalAmount, invoiceVisible, planCode, planData, walletPay, payOnline } = this.state;
        return (
            <SafeAreaLayout style={Styles.safeArea}
                insets={SaveAreaInset.TOP}>
                <Toolbar
                    title='Recharge'
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
                    <View style={[Styles.reacharge_main]}>
                        {null != planData && planData.length > 0 ? planData.map((plan, index) => {
                            return (
                                <View style={[Styles.reacharge_box]}>
                                    <View style={[Styles.reacharge_head]}>
                                        <Text style={[Styles.recharge_price_icon]}><RupeeIcon fontSize={scale(20)}/>  </Text>
                                        <Text style={[Styles.recharge_price_text]}>{plan.amount}</Text>
                                    </View>
                                    <View style={[Styles.reacharge_text_main]}>
                                        <View style={[Styles.reacharge_text]}>
                                            <Text style={[Styles.recharge_text_head]}>Validity</Text>
                                            <Text style={[Styles.recharge_text_data]}>{plan.validity} Days</Text>
                                        </View>
                                        {plan.offerActiveEnd ?
                                            <View style={[Styles.reacharge_text]}>
                                                <Text style={[Styles.recharge_text_head]}>Offer</Text>
                                                <TextInput
                                                    style={[Styles.recharge_offer_input]}
                                                    placeholder={LableText.YOUR_PLAN_CODE}
                                                    value={planCode}
                                                    onChangeText={(value) => { this.setState({ planCode: value }) }}
                                                />
                                            </View> : <View style={[Styles.recharge_no_offer_input]} />
                                        }

                                        <View style={[Styles.recharge_button_view]}>
                                            <TouchableOpacity style={[Styles.recharge_button_box]} onPress={() => { this.calculatePrice(index) }}>
                                                <Text style={[Styles.recharge_button_text]}>Buy</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                </View>)
                        }) : null
                        }

                        {/* <View style={[Styles.reacharge_box]}>
                            <View style={[Styles.reacharge_head]}>
                                <Text style={[Styles.recharge_price_icon]}><EditIcon /></Text>
                                <Text style={[Styles.recharge_price_text]}>6,000</Text>
                            </View>
                            <View style={[Styles.reacharge_text_main]}>
                                <View style={[Styles.reacharge_text]}>
                                    <Text style={[Styles.recharge_text_head]}>Validity</Text>
                                    <Text style={[Styles.recharge_text_data]}>30 Days</Text>
                                </View>

                                <View style={[Styles.recharge_no_offer_input]} />

                                <View style={[Styles.recharge_button_view]}>
                                    <TouchableOpacity style={[Styles.recharge_button_box]}>
                                        <Text style={[Styles.recharge_button_text]}>Buy</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>

                        <View style={[Styles.reacharge_box]}>
                            <View style={[Styles.reacharge_head]}>
                                <Text style={[Styles.recharge_price_icon]}><EditIcon /></Text>
                                <Text style={[Styles.recharge_price_text]}>6,000</Text>
                            </View>
                            <View style={[Styles.reacharge_text_main]}>
                                <View style={[Styles.reacharge_text]}>
                                    <Text style={[Styles.recharge_text_head]}>Validity</Text>
                                    <Text style={[Styles.recharge_text_data]}>30 Days</Text>
                                </View>

                                <View style={[Styles.recharge_button_view]}>
                                    <TouchableOpacity style={[Styles.recharge_button_box]}>
                                        <Text style={[Styles.recharge_button_text]}>Buy</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View> */}
                    </View>
                </Content>

                <Modal style={Styles.modal} isVisible={invoiceVisible}>
                    <View style={Styles.modalHeader}>
                        <TouchableOpacity>
                            <Text onPress={() => { this.toggleModal() }}><CancelIcon fontSize={25} /></Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[Styles.invoice_main_view]}>
                        <View style={[Styles.invoice_data_main]}>
                            <Text style={[Styles.invoice_data_head]}>Price</Text>
                            <Text style={[Styles.invoice_data_text]}>{price}</Text>
                        </View>

                        <View style={[Styles.invoice_data_main]}>
                            <Text style={[Styles.invoice_data_head]}>Discount</Text>
                            <Text style={[Styles.invoice_data_text]}>{discount}</Text>
                        </View>

                        <View style={[Styles.invoice_data_main]}>
                            <Text style={[Styles.invoice_data_head]}>GST@18%</Text>
                            <Text style={[Styles.invoice_data_text]}>{gst}</Text>
                        </View>
                        <View style={Styles.divider} />
                        <View style={[Styles.invoice_data_main]}>
                            <Text style={[Styles.invoice_data_head]}>Total Amount</Text>
                            <Text style={[Styles.invoice_data_text]}>{totalAmount}</Text>
                        </View>
                        <View style={Styles.divider} />

                        <View style={[{ marginVertical: scale(10) }]}>
                            <Text style={Styles.payment_selection_header}>How do you want to pay?</Text>
                            <View style={[Styles.payment_selection_view, { justifyContent: 'space-around' }]}>
                                <View style={{ flexDirection: 'row', marginRight: 20 }}>
                                    <Radio selected={walletPay} selectedColor='#501B1D' onPress={() => { this.handlePaymentType('WALLET') }} />
                                    <Text style={Styles.payment_selection_text}>Wallet</Text>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <Radio selected={payOnline} selectedColor='#501B1D' onPress={() => { this.handlePaymentType('PAYON') }} />
                                    <Text style={Styles.payment_selection_text}>Pay Online</Text>
                                </View>
                            </View>
                        </View>

                        <View style={[Styles.recharge_button_view]}>
                            <TouchableOpacity style={[Styles.recharge_button_box]}>
                                <Text onPress={() => { this.payNow() }} style={[Styles.recharge_button_text]}>Pay Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </SafeAreaLayout>
        );
    }

}