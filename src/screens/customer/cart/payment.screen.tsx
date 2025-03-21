import { Picker } from '@react-native-picker/picker';
import { CommonActions, StackActions } from '@react-navigation/core';
import { Avatar, Divider, ListItem, ListItemElement, Text, ThemedComponentProps } from '@ui-kitten/components';
import axios from 'axios';
import moment from 'moment';
import { Radio } from 'native-base';
import React from 'react';
import {
    ActivityIndicator,
    Alert,
    AsyncStorage,
    Dimensions,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import RazorpayCheckout from 'react-native-razorpay';
import SelectDropdown from 'react-native-select-dropdown';
import { scale } from 'react-native-size-matters';
import { date } from 'yup/lib/locale';

import { AddIcon, BackIcon, CancelIcon, MinusIcon, RightArrowIcon, RupeeIcon } from '../../../assets/icons';
import { Styles } from '../../../assets/styles';
import { DropDown } from '../../../components/drop-down';
import { Item } from '../../../components/drop-item';
import { SafeAreaLayout, SaveAreaInset } from '../../../components/safe-area-layout.component';
import { Toolbar } from '../../../components/toolbar.component';
import { AppConstants } from '../../../constants/AppConstants';
import { Color, Contents } from '../../../constants/LabelConstants';
import { AppRoute } from '../../../navigation/app-routes';
import { PaymentScreenProps } from '../../../navigation/customer-navigator/cart-navigation/cart.navigator';

type MyState = {
    displayName: String,
    dataSource: [],
    userId: String,
    likeCount: number,
    dislikeCount: number,
    liked: boolean[],
    disliked: boolean[],
    categories: [],
    textShown: -1,
    selectedIndex: number;
}

const HEADER_MAX_HEIGHT = 120;
const HEADER_MIN_HEIGHT = 70;
const PROFILE_IMAGE_MAX_HEIGHT = 80;
const PROFILE_IMAGE_MIN_HEIGHT = 40;

var SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

type Props = PaymentScreenProps & ThemedComponentProps

export class PaymentScreen extends React.Component<Props, MyState & any> {
    constructor(props: Props) {
        super(props)
        this.state = {
            addressData: [],
            totalAmt: '',
            selectedSlot: '',
            cartId: '',
            selectedPayment: '',
            selfPick: false,
            cashDelivery: true,
            payOnline: false,
            homeDelivery: true,
            slotDate: String(moment(new Date).format('YYYY-MM-DD')),
            minDate: String(moment(new Date).format('YYYY-MM-DD')),
            selfPickup: false,
            allLookUp: [],
            order_type: [],
            payment_type: [],
            orderType: '',
            paymentType: '',
            homeId: '',
            selfId: '',
            onlineId: '',
            cashId: '',
            userName: '',
            userMobileNo: '',
            userEmailId: '',
            addressId: '',
            shopId: AppConstants.SHOP_ID,
            cartData: [],
            adminData: [],
            insideShop: false,
            selectedDelivery: '',
            orderPlacing: false,
            shopLatLng: '',
            userLatLng: '',
            quickSlotId: '',
            allSlotList: []
        }
        this.backFunction = this.backFunction.bind(this)
        this.getAddress = this.getAddress.bind(this)
        this.getAllSlotList = this.getAllSlotList.bind(this)
        this.getTodaySlotList = this.getTodaySlotList.bind(this)
    }

    async componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            this.getAddress();
            this.getTodaySlotList();
        })

        this.getTodaySlotList();

        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/admin/get/3'
        }).then((res) => {
            // console.log("map", res.data.latitude + ',' + res.data.longitude)
            if (res.data) {
                this.setState({
                    shopLatLng: res.data.latitude + ',' + res.data.longitude
                })
            }
        }, (err) => {
            console.log({ err })
        })

        SCREEN_WIDTH = Dimensions.get('window').width;
        let userDetail = await AsyncStorage.getItem('userDetail');
        let logedIn = await AsyncStorage.getItem('logedIn');
        let shopId = await AsyncStorage.getItem('shopId');
        let userData = JSON.parse(userDetail);
        const cartId = this.props.route.params.cartId;
        const insideShop = this.props.route.params.insideShop;
        // console.log('data', cartId, insideShop, typeof(insideShop))
        // Alert.alert(userData.emailId)
        this.setState({
            shopId: shopId,
            cartId: cartId,
            userName: userData.firstName,
            userMobileNo: userData.mobileNo,
            userEmailId: userData.emailId,
            insideShop: insideShop,
            orderPlacing: false
        })
        if (null != logedIn && logedIn === 'true') {
            // Alert.alert("" + userData.userId, cartId) 


            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/cart/get/' + cartId
            }).then((response) => {
                if (response.data) {
                    // console.log('cartData in payment', response.data)
                    this.setState({
                        cartData: response.data,
                        totalAmt: response.data.payableAmount,
                    })

                    axios({
                        method: 'GET',
                        url: AppConstants.API_BASE_URL + '/api/admin/get/activeadminbyshopid/' + response.data.shopId
                    }).then((response) => {
                        if (response.data) {
                            // console.log('Admin Data in payment', response.data)
                            this.setState({
                                adminData: response.data[0],
                            })
                        }
                    }, (error) => {
                        Alert.alert("Wait for a moment.")
                    })
                }

            }, (error) => {
                // Alert.alert("Wait for a moment.")
            })

            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/lookup/getalllookup'
            }).then((response) => {
                if (response.data) {
                    response.data.ORDER_TYPE.map((order, orIndex) => {
                        if (order.lookUpName === "HOME_DELIVERY") {
                            if (insideShop) {
                                this.setState({
                                    homeId: order.lookUpId,
                                    selfPick: true,
                                    homeDelivery: false,
                                })
                            } else {
                                this.setState({
                                    homeId: order.lookUpId,
                                    orderType: order.lookUpId,
                                    selfPick: false,
                                    homeDelivery: true,
                                })
                            }
                        } else if (order.lookUpName === "SELF_PICKUP") {
                            if (insideShop) {
                                this.setState({
                                    selfId: order.lookUpId,
                                    orderType: order.lookUpId,
                                    selfPick: true,
                                    homeDelivery: false,
                                })
                            } else {
                                this.setState({
                                    selfId: order.lookUpId,
                                })
                            }
                        }
                    })

                    response.data.PAYMENT_MODE.map((order, orIndex) => {
                        if (order.lookUpName === "CASH") {
                            this.setState({
                                cashId: order.lookUpId,
                                paymentType: order.lookUpId,
                                cashDelivery: true,
                                payOnline: false,
                            })
                        } else if (order.lookUpName === "ONLINE_PAYMENT") {
                            this.setState({
                                onlineId: order.lookUpId,
                            })
                        }
                    })
                    this.setState({
                        allLookUp: response.data,
                        order_type: response.data.ORDER_TYPE,
                        payment_type: response.data.PAYMENT_MODE
                    })
                }
            }, (error) => {
                Alert.alert("Wait for a moment.")
            })
            this.getAddress();
        } else {
            this.props.navigation.navigate(AppRoute.AUTH)
        }
    }

    getTodaySlotList() {
        // console.log(this.state.slotDate)
        var duration = new Date().getHours();
        // var date = this.state.slotDate
        if (duration >= 18) {
            this.changeSlotDate(moment(new Date).add(1, 'day').format('YYYY-MM-DD'))
        } else {
            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/slottime/allslot/' + this.state.slotDate
            }).then((res) => {
                if (!!res.data) {
                    // console.log('active', !!res.data[1].active);
                    // console.log('active', res.data);
                    var data = []
                    data = res.data.find(slot => !!slot.active)
                    //    console.log("qwq", !!data)
                    if (!!data) {
                        // Alert.alert("data", "data")
                        this.setState({
                            selectedSlot: data.lookUpId,
                        })
                    } else {
                        this.setState({
                            selectedSlot: "",
                        })
                    }
                    this.setState({
                        allSlotList: res.data
                    })
                }
            }, (err) => {
                console.log({ err })
            })
        }
    }

    changeSlotDate(date) {
        this.setState({ slotDate: date })

        let today = moment(moment(new Date()).format('YYYY-MM-DD'), 'YYYY-MM-DD')
        var orderDate = moment(date, 'YYYY-MM-DD')
        var difference = today.diff(orderDate, 'day')
        if (difference == 0) {
            this.getTodaySlotList();
        } else {
            this.getAllSlotList(date);
        }
    }

    getAllSlotList(date) {
        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/slottime/allslot/' + date
        }).then((res) => {
            if (!!res.data) {
                var data = []
                data = res.data.find(slot => !!slot.active)
                //    console.log("qwq", data)
                if (!!data) {
                    // Alert.alert("data", "data")
                    this.setState({
                        selectedSlot: data.lookUpId,
                    })
                } else {
                    this.setState({
                        selectedSlot: "",
                    })
                }
                this.setState({
                    allSlotList: res.data
                })
            }
        }, (err) => {
            console.log({ err })
        })
    }

    async getAddress() {
        let userDetail = await AsyncStorage.getItem('userDetail');
        let logedIn = await AsyncStorage.getItem('logedIn');
        let userData = JSON.parse(userDetail);

        if (null != logedIn && logedIn === 'true') {
            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/address/getdefaultaddress/' + userData.userId
            }).then((response) => {
                if (response.data) {
                    this.setState({
                        addressData: response.data,
                        addressId: response.data.id,
                        userLatLng: response.data.latitude + ',' + response.data.longitude
                    })
                } else {
                    this.props.navigation.navigate(AppRoute.CART_ADDRESS)
                }
            }, (error) => {
                // Alert.alert("Please add your address.")
                this.props.navigation.navigate(AppRoute.CART_ADDRESS)
            })
        } else {
            this.props.navigation.navigate(AppRoute.AUTH)
        }
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        this.getAddress().then(() => {
            this.setState({ refreshing: false });
        });
    }

    handleOrderType(type) {
        const { homeId, selfId } = this.state;
        if (type === 'HOME') {
            this.setState({
                selectedDelivery: type,
                orderType: homeId
            })
        } else if (type === 'SELF') {
            this.setState({
                selectedDelivery: type,
                orderType: selfId
            })
        }
    }

    handlePaymentType(type) {
        const { cashId, onlineId } = this.state;
        if (type === 'CASH') {
            this.setState({
                selectedPayment: type,
                paymentType: cashId,
                payOnline: false,
                cashDelivery: true
            })
        } else if (type === 'PAYON') {
            this.setState({
                selectedPayment: type,
                paymentType: onlineId,
                payOnline: true,
                cashDelivery: false
            })
        }
    }


    handlePlaceOrder() {
        const { orderType, userLatLng, quickSlotId, shopLatLng, insideShop, selectedSlot, addressId, addressData, slotDate, homeDelivery, selfPick, cashDelivery, payOnline, homeId, cashId, onlineId, selfId, paymentType, cartId, } = this.state;
        // console.log('data', selectedSlot, orderType, paymentType, homeDelivery, selfPick, cashDelivery, payOnline, cashId, onlineId, homeId, selfId, cartId, addressId);

        axios({
            method: 'GET',
            url: 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=' + shopLatLng + '&destinations=' + userLatLng + '&key=' + AppConstants.GOOGLE_MAP_KEY
        }).then((res) => {
            // console.log("map", res.data.rows[0].elements[0].distance, selectedSlot)
            const { text, value } = res.data.rows[0].elements[0].distance;
            if (value > 2000 && value < 5000 && selectedSlot === quickSlotId) {
                Alert.alert("Message", "Sorry! You are not in our quick delivery range, Please select another delivery slot.")
            } else if (value > 5000) {
                Alert.alert("Message", "Sorry! You are not in our delivery range, It is available for only 5 KMs.")
            } else {
                if (addressData != null) {
                    if (payOnline) {
                        if (selectedSlot === '' || selectedSlot == null) {
                            Alert.alert('Message', "Please select slot")
                        } else {
                            this.setState({
                                orderPlacing: true
                            })
                            axios({
                                method: 'PUT',
                                url: AppConstants.API_BASE_URL + '/api/cart/placeorder',
                                data: {
                                    transactionType: paymentType,
                                    cartId: cartId,
                                    orderType: orderType,
                                    addressId: addressId,
                                    slotDate: slotDate,
                                    insideShop: insideShop,
                                    slotTime: selectedSlot
                                }
                            }).then((response) => {
                                if (response.data) {
                                    if (response.data.status) {
                                        this.startPayment(response.data.transactionId, response.data.orderId);
                                    } else {
                                        Alert.alert("Got error while placing Order.")
                                    }
                                }
                            }, (error) => {
                                console.log(error)
                                Alert.alert("Please select your address.")
                            })
                        }
                    } else if (cashDelivery) {
                        // Alert.alert('offline')
                        if (selectedSlot === '' || selectedSlot == null) {
                            Alert.alert('Message', "Please select slot")
                        } else {
                            this.setState({
                                orderPlacing: true
                            })
                            // console.log("" + selectedSlot)
                            axios({
                                method: 'PUT',
                                url: AppConstants.API_BASE_URL + '/api/cart/placeorder',
                                data: {
                                    transactionType: paymentType,
                                    cartId: cartId,
                                    orderType: orderType,
                                    addressId: addressId,
                                    slotDate: slotDate,
                                    insideShop: insideShop,
                                    slotTime: selectedSlot
                                }
                            }).then((response) => {
                                if (response.data) {
                                    if (response.data.status) {
                                        this.notification()
                                        console.log(response.data)
                                        this.props.navigation.navigate(AppRoute.CUSTOMER_ORDER_NAV)
                                    } else {
                                        Alert.alert("Got error while placing Order.")
                                    }
                                }
                            }, (error) => {
                                console.log(error)
                                Alert.alert("Please select your address.")
                            })
                        }
                    }
                } else {
                    Alert.alert("Please add your address.")
                }
            }
        }, (err) => {
            console.log({ err })
        })
    }

    backFunction() {

    }

    startPayment(transactionId, orderId) {
        const { cartId, totalAmt, userEmailId, userMobileNo, userName } = this.state;
        const options = {
            description: "MILAAN IT",
            image: 'http://ec2-65-0-32-190.ap-south-1.compute.amazonaws.com/shop/61_4_MILAAN661_shop.png',
            currency: "INR",
            key: AppConstants.RAZORPAY_KEY,
            amount: totalAmt * 100,
            name: 'MILAAN IT',
            order_id: orderId,
            prefill: {
                email: userEmailId,
                contact: userMobileNo,
                name: userName
            },
            theme: { color: '#501B1D' }
        }
        RazorpayCheckout.open(options).then((data) => {
            // console.log('razor pay response', data.razorpay_payment_id);
            // console.log(cartId, totalAmt, transactionId, data.razorpay_payment_id)

            axios({
                method: 'POST',
                url: AppConstants.API_BASE_URL + '/api/cart/completpayment',
                data: {
                    transactionId: transactionId,
                    cartId: cartId,
                    transactionAmount: totalAmt,
                    rzpayTransactionId: data.razorpay_payment_id
                }
            }).then((response) => {
                if (response.data) {
                    if (response.data.status) {
                        this.setState({
                            orderPlacing: false
                        })
                        Alert.alert("Order placed.")
                        this.notification();
                        const resetAction = CommonActions.reset({
                            index: 0,
                            routes: [
                                { name: AppRoute.CUSTOMER_ORDER }
                            ],
                        });
                        this.props.navigation.dispatch(resetAction)
                    } else {
                        Alert.alert("Got error while placing Order.")
                    }
                }
            }, (error) => {
                Alert.alert("Payment failed")
            })
        }, (error) => {
            Alert.alert("Payment failed")
        })
    }

    notification() {
        const { adminData, cartData } = this.state;
        console.log('notification Data', adminData.adminId, adminData.userType, cartData.totalAmount)
        axios({
            method: 'POST',
            url: AppConstants.API_BASE_URL + '/api/sms/send/notification',
            data: {
                userId: adminData.adminId,
                userType: adminData.userType,
                content: Contents.ORDER_PLACED + cartData.totalAmount
            }
        }).then((response) => {
            this.setState({
                orderPlacing: false
            })
            Alert.alert("Order placed.")
            const pushAction = StackActions.push(AppRoute.CUSTOMER_ORDER_PRODUCT, { id: this.backFunction.bind(this) })
            this.props.navigation.dispatch(pushAction);
            // this.props.navigation.navigate(AppRoute.CUSTOMER_ORDER_PRODUCT, { id: this.backFunction.bind(this) })
        }, (error) => {
            Alert.alert("Wait for a moment.")
        })
    }


    renderCart = ({ item }: any): ListItemElement => (
        <ListItem style={{ borderBottomColor: 'rgba(2,15,20,0.10)', borderBottomWidth: 1 }}>
            {item != null ?

                <View style={Styles.cart_main_view}>

                    <View style={Styles.cart_view_1}>
                        <View style={Styles.cart_view_1_1}>
                            <View style={[Styles.cart_avatar_view, Styles.center]}>
                                <Avatar source={{ uri: AppConstants.IMAGE_BASE_URL + '/product/' + item.productId + '_' + 1 + "_" + item.shopId + '_product.png' }} style={Styles.product_avatar} />
                            </View>
                        </View>

                        <View style={Styles.cart_view_1_2}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={Styles.cart_name_text}>{item.productName}</Text>
                                <TouchableOpacity onPress={() => { this.handleDelete(item.id) }}>
                                    <Text style={Styles.cart_name_text}><CancelIcon fontSize={25} /></Text>
                                </TouchableOpacity>
                            </View>
                            <View style={Styles.cart_price_view}>
                                <View style={{ flexDirection: 'row', width: '55%', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                    <Text style={Styles.price_text}><RupeeIcon /> {item.price}</Text>
                                    <Text style={Styles.offer_price_text}>{item.oldPrice}</Text>
                                </View>

                                <View style={Styles.cart_quantity_view}>
                                    <TouchableOpacity style={Styles.cart_button} onPress={() => { this.handleDecrease(item.productId, item.productQuantity) }}>
                                        <Text style={Styles.cart_button_text}><MinusIcon /></Text>
                                    </TouchableOpacity>

                                    <View style={Styles.cart_quantity_text_view}>
                                        <Text style={Styles.cart_quantity_text}>{item.productQuantity}</Text>
                                    </View>

                                    <TouchableOpacity style={Styles.cart_button} onPress={() => { this.handleIncrease(item.productId) }}>
                                        <Text style={Styles.cart_button_text}><AddIcon /></Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View>
                                <Text style={Styles.cart_offer_text}>{item.offer}% off</Text>
                            </View>
                        </View>
                    </View>

                    <View>
                        <Text style={[Styles.cart_offer_text, { marginLeft: 10 }]}>{item.offersAvailable} offers available</Text>
                    </View>
                </View>
                :
                <ActivityIndicator size='large' color='green' />}

        </ListItem>
    )

    render() {
        const { cartData, allSlotList, paymentType, selectedSlot, selectedDelivery, selectedPayment, orderPlacing, insideShop, minDate, addressData, homeDelivery, payOnline, cashDelivery, selfPick, totalAmt, productList, slotDate } = this.state
        // {
        //     !!allSlotList && allSlotList.map((slot, i) => {
        //         console.log("121212", slot.lookUpId)
        //     })
        // }
        return (
            <SafeAreaLayout
                style={Styles.safeArea}
                insets={SaveAreaInset.TOP}>

                <Toolbar
                    title='Payment'
                    backIcon={BackIcon}
                    onBackPress={this.props.navigation.goBack}
                    style={{ marginTop: -5, marginLeft: -5 }}
                />
                <Divider />
                <ScrollView style={[Styles.cart_content, { backgroundColor: '#fff' }]} showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                >
                    <View>

                    </View>

                    <View style={{ backgroundColor: '#fff', borderColor: Color.BORDER, borderWidth: 0.5, padding: 20, marginBottom: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Address</Text>
                        {null != addressData ?
                            <Text style={{ marginVertical: 5 }}>{addressData.name}, {addressData.mobileNo}, {addressData.city}, {addressData.pinCode}, {addressData.country}</Text>
                            : null}
                        <View style={{ width: '100%', alignItems: 'flex-end' }}>
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate(AppRoute.CART_ADDRESS) }} style={[Styles.center, { paddingVertical: 10, width: 100, borderRadius: 5, backgroundColor: Color.COLOR }]}>
                                <Text style={{ color: Color.BUTTON_NAME_COLOR }}>Change</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {!insideShop ?
                        <View style={[Styles.center]}>
                            <View style={[Styles.payment_box_view]}>
                                <Text style={Styles.payment_selection_header}>How do you want this order?</Text>

                                <View style={{ borderColor: Color.COLOR, borderWidth: 1, borderStyle: 'solid', }}>
                                    <Picker
                                        mode="dropdown"
                                        style={[Styles.center, { marginVertical: 0, color: Color.COLOR, width: '100%' }]}
                                        selectedValue={selectedDelivery}
                                        onValueChange={(value) => { this.handleOrderType(value) }}
                                    >
                                        <Picker.Item key="PICK1" label="Home Delivery" value="HOME" />
                                        <Picker.Item key="PICK2" label="Self Pickup" value="SELF" />
                                    </Picker>
                                </View>
                            </View>
                        </View> :
                        null}

                    <View style={[Styles.center]}>
                        <View style={[Styles.payment_box_view]}>
                            <Text style={Styles.payment_selection_header}>How do you want to pay?</Text>
                            <View style={{ borderColor: Color.COLOR, borderWidth: 1, borderStyle: 'solid', }}>
                                <Picker
                                    mode="dropdown"
                                    style={[Styles.center, { marginVertical: 0, color: Color.COLOR, width: '100%' }]}
                                    selectedValue={selectedPayment}
                                    onValueChange={(value) => { this.handlePaymentType(value) }}
                                >
                                    <Picker.Item key="PAY1" label="Cash" value="CASH" />
                                    <Picker.Item key="PAY2" label="Pay Online" value="PAYON" />
                                </Picker>
                            </View>
                        </View>
                    </View>
                    {!insideShop ?
                        <View style={[Styles.center]}>
                            <View style={[Styles.payment_box_view]}>
                                <Text style={Styles.payment_selection_header}>Delivery Slot</Text>

                                <View style={[Styles.payment_selection_view, {borderColor: Color.COLOR, borderWidth: 1}]}>
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        date={slotDate}
                                        mode="date"
                                        placeholder="select date"
                                        format="YYYY-MM-DD"
                                        minDate={minDate}
                                        // maxDate="2016-06-01"
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        customStyles={{
                                            dateIcon: {
                                                position: 'absolute',
                                                left: 0,
                                                top: 5,
                                                marginLeft: 0
                                            },
                                            dateInput: {
                                                borderColor: '#fff'
                                            }
                                        }}
                                        onDateChange={(date) => { this.changeSlotDate(date) }}
                                    />
                                </View>

                                <View style={{ marginTop: scale(20), borderColor: Color.COLOR, borderWidth: 1, borderStyle: 'solid', }}>

                                    <Picker
                                        mode="dropdown"
                                        style={[Styles.center, { marginVertical: 0, color: Color.COLOR, width: '100%' }]}
                                        selectedValue={selectedSlot}
                                        itemStyle={{}}
                                        onValueChange={(value) => { this.setState({ selectedSlot: value }) }}
                                    >
                                        <Picker.Item enabled={true} style={{ backgroundColor: 'red' }} key={"DELI1"} label={"Select slot"} value={""} />
                                        {!!allSlotList && allSlotList.map((slot, i) => (
                                            <Picker.Item enabled={Boolean(slot.active)} style={{ backgroundColor: 'red' }} key={"DELI1" + i} label={!slot.active ? slot.lookUpLabel + " (Slot full)": slot.lookUpLabel} value={slot.lookUpId} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                        </View> : null}
                </ScrollView>
                {orderPlacing ?
                    <View>
                        <View style={[Styles.cart_bottom_box_button, Styles.center]} >
                            <Text style={Styles.cart_bottom_box_button_text}>Your order is placing...</Text>
                        </View>
                    </View> :
                    <View>
                        <TouchableOpacity style={[Styles.cart_bottom_box_button, Styles.center]} onPress={() => { this.handlePlaceOrder() }}>
                            <Text style={Styles.cart_bottom_box_button_text}>Place Order {totalAmt}</Text>
                        </TouchableOpacity>
                    </View>}
                <Divider />
                <Divider />
            </SafeAreaLayout>
        )
    }
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F6F6F6',
    },
    headerTitle: { color: '#000', fontWeight: 'bold', fontSize: 16 },
    saveAreaViewContainer: { flex: 1, backgroundColor: '#FFF' },
    viewContainer: { flex: 1, backgroundColor: '#FFF' },
    scrollViewContainer: {
        flexGrow: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: '10%',
        paddingBottom: '20%',
    },

    dropdown1BtnStyle: {
        width: '100%',
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
    },

    icon: {
        transform: [{ rotate: '90deg' }],
        color: 'black',
        fontWeight: '400'
    },

    dropdown1BtnTxtStyle: { color: '#444', textAlign: 'left' },
    dropdown1DropdownStyle: { backgroundColor: '#EFEFEF' },
    dropdown1RowStyle: {
        backgroundColor: Color.DESCRIPTION_OPTION_BACKGROUND,
        borderBottomColor: '#000000'
    },
    dropdown1RowTxtStyle: { color: 'black', textAlign: 'left' },

    dropdown2BtnStyle: {
        width: '80%',
        height: 50,
        backgroundColor: '#444',
        borderRadius: 8,
    },
    dropdown2BtnTxtStyle: {
        color: '#FFF',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    dropdown2DropdownStyle: {
        backgroundColor: '#444',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    dropdown2RowStyle: { backgroundColor: '#444', borderBottomColor: '#C5C5C5' },
    dropdown2RowTxtStyle: {
        color: '#FFF',
        textAlign: 'center',
        fontWeight: 'bold',
    },

    dropdown3BtnStyle: {
        width: '80%',
        height: 50,
        backgroundColor: '#FFF',
        paddingHorizontal: 0,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#444',
    },
    dropdown3BtnChildStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 18,
    },
    dropdown3BtnImage: { width: 45, height: 45, resizeMode: 'cover' },
    dropdown3BtnTxt: {
        color: '#444',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 24,
        marginHorizontal: 12,
    },
    dropdown3DropdownStyle: { backgroundColor: 'slategray' },
    dropdown3RowStyle: {
        backgroundColor: 'slategray',
        borderBottomColor: '#444',
        height: 50,
    },
    dropdown3RowChildStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 18,
    },
    dropdownRowImage: { width: 45, height: 45, resizeMode: 'cover' },
    dropdown3RowTxt: {
        color: '#F1F1F1',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 24,
        marginHorizontal: 12,
    },

    dropdown4BtnStyle: {
        width: '50%',
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
    },
    dropdown4BtnTxtStyle: { color: '#444', textAlign: 'left' },
    dropdown4DropdownStyle: { backgroundColor: '#EFEFEF' },
    dropdown4RowStyle: { backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5' },
    dropdown4RowTxtStyle: { color: '#444', textAlign: 'left' },
});
