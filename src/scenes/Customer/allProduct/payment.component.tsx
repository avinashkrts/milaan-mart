import React from 'react';
import {
    ListRenderItemInfo, View, StyleSheet, TouchableOpacity,
    ActivityIndicator, Image, Alert, FlatList, ScrollView, RefreshControl, TextInput, Dimensions
} from 'react-native';
import {
    // Input,
    Layout,
    List,
    ListElement,
    ListItem,
    ListItemElement,
    Text,
    ThemedComponentProps,
    withStyles, TabBar,
    styled, Divider, Avatar, Icon, Button
} from 'react-native-ui-kitten';
import { ScrollableTab, Tab, Item, Container, Content, Tabs, Header, TabHeading, Thumbnail, Input, Label, Footer, FooterTab, Col, Radio } from 'native-base';
import { PaymentScreenProps } from '../../../navigation/customer-navigator/customerAllProduct.navigator';
import { AppRoute } from '../../../navigation/app-routes';
import { ProgressBar } from '../../../components/progress-bar.component';
import { SearchIcon, MinusIcon, RupeeIcon, PlusCircle, BackIcon, CancelIcon, PlusIcon, AddIcon, RightArrowIcon } from '../../../assets/icons';
import { TimeLineData } from '../../../data/TimeLineData.model';
import { AppConstants } from '../../../constants/AppConstants';
import { Toolbar } from '../../../components/toolbar.component';
import {
    SafeAreaLayout,
    SafeAreaLayoutElement,
    SaveAreaInset,
} from '../../../components/safe-area-layout.component';
import { MenuIcon, ExperienceIcon, LocationIcon, PublicIcon, PencilIcon } from '../../../assets/icons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { any } from 'prop-types';
import { AsyncStorage } from 'react-native';
import axios from 'axios';
import { truncate, open } from 'fs';
// import VideoPlayer from 'react-native-video-player';
// import { FlatList } from 'react-native-gesture-handler';
import Share from 'react-native-share';
import { pathToFileURL, fileURLToPath } from 'url';
// import SwipeHiddenHeader from 'react-native-swipe-hidden-header';
import Animated from 'react-native-reanimated';
import { Styles } from '../../../assets/styles'
import { Color, Contents } from '../../../constants/LabelConstants';
import Axios from 'axios';
import DatePicker from 'react-native-datepicker'
import { CustomerCartScreenProps } from '../../../navigation/customer-navigator/customerHome.navigator';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { lookup } from 'dns';
// import axios from 'axios';  
// import Container from '@react-navigation/core/lib/typescript/NavigationContainer';
import RazorpayCheckout from 'react-native-razorpay';
import moment from 'moment';
import { scale } from 'react-native-size-matters';
import { StackActions } from '@react-navigation/routers';

const allTodos: TimeLineData[] = [
    TimeLineData.getAllTimelineData()
];

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


export class PaymentScreen extends React.Component<PaymentScreenProps & CustomerCartScreenProps & ThemedComponentProps, MyState & any> {
    constructor(props) {
        super(props)
        this.state = {
            addressData: [],
            totalAmt: '',
            cartId: '',
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
            orderPlacing: false
        }
        this.backFunction = this.backFunction.bind(this)
    }



    async componentDidMount() {
        SCREEN_WIDTH = Dimensions.get('window').width;
        let userDetail = await AsyncStorage.getItem('userDetail');
        let logedIn = await AsyncStorage.getItem('logedIn');
        let shopId = await AsyncStorage.getItem('shopId');
        let userData = JSON.parse(userDetail);
        const cartId = this.props.route.params.cartId;
        const insideShop = this.props.route.params.insideShop
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
            // Alert.alert("" + userData.userId)
            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/address/getdefaultaddress/' + userData.userId
            }).then((response) => {
                if (response.data) {
                    this.setState({
                        addressData: response.data,
                        addressId: response.data.id
                    })
                }

            }, (error) => {
                Alert.alert("Please add your address.")
            })

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
                        Alert.alert("Server problem")
                    })
                }

            }, (error) => {
                Alert.alert("Server problem")
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
                Alert.alert("Server problem")
            })
        } else {
            this.props.navigation.navigate(AppRoute.AUTH)
        }
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });
    }

    handleOrderType(type) {
        const { homeId, selfId } = this.state;
        if (type === 'HOME') {
            this.setState({
                homeDelivery: true,
                selfPick: false,
                orderType: homeId
            })
        } else if (type === 'SELF') {
            this.setState({
                homeDelivery: false,
                selfPick: true,
                orderType: selfId
            })
        }
    }

    handlePaymentType(type) {
        const { cashId, onlineId } = this.state;
        if (type === 'CASH') {
            this.setState({
                cashDelivery: true,
                payOnline: false,
                paymentType: cashId
            })
        } else if (type === 'PAYON') {
            this.setState({
                cashDelivery: false,
                payOnline: true,
                paymentType: onlineId
            })
        }
    }


    handlePlaceOrder() {
        const { orderType, insideShop, addressId, addressData, slotDate, homeDelivery, selfPick, cashDelivery, payOnline, homeId, cashId, onlineId, selfId, paymentType, cartId, } = this.state;
        console.log('data', orderType, paymentType, homeDelivery, selfPick, cashDelivery, payOnline, cashId, onlineId, homeId, selfId, cartId);
        this.setState({
            orderPlacing: true
        })
        if (addressData != null) {
            if (payOnline) {

                axios({
                    method: 'PUT',
                    url: AppConstants.API_BASE_URL + '/api/cart/placeorder',
                    data: {
                        transactionType: paymentType,
                        cartId: cartId,
                        orderType: orderType,
                        addressId: addressId,
                        slotDate: slotDate,
                        insideShop: insideShop
                    }
                }).then((response) => {
                    if (response.data) {
                        if (response.data.status) {
                            // Alert.alert(response.data.transactionId)
                            this.startPayment(response.data.transactionId, response.data.orderId);
                        } else {
                            Alert.alert("Got error while placing Order.")
                        }
                    }
                }, (error) => {
                    Alert.alert("Please select your address.")
                })
            } else if (cashDelivery) {
                axios({
                    method: 'PUT',
                    url: AppConstants.API_BASE_URL + '/api/cart/placeorder',
                    data: {
                        transactionType: paymentType,
                        cartId: cartId,
                        orderType: orderType,
                        addressId: addressId,
                        slotDate: slotDate,
                        insideShop: insideShop
                    }
                }).then((response) => {
                    if (response.data) {
                        if (response.data.status) {
                            this.notification()

                            // this.props.navigation.navigate(AppRoute.CUSTOMER_ORDER)
                        } else {
                            Alert.alert("Got error while placing Order.")
                        }
                    }
                }, (error) => {
                    Alert.alert("Please select your address.")
                })
            }
        } else {
            Alert.alert("Please add your address.")
        }
    }

    backFunction() {
        // Alert.alert('')
        this.props.navigation.navigate(AppRoute.CUSTOMER_ALL_SHOP)
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
                        this.props.navigation.navigate(AppRoute.CUSTOMER_ORDER)
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
            Alert.alert("Server problem")
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
        const { cartData, orderPlacing, insideShop, minDate, addressData, homeDelivery, payOnline, cashDelivery, selfPick, totalAmt, productList, slotDate } = this.state
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
                <Content style={[Styles.cart_content, { backgroundColor: '#fff' }]} showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                >
                    {/* <GooglePlacesAutocomplete
                        placeholder='Search'
                        // minLength={2}
                        autoFillOnNotFound
                        onPress={(data, details = null) => {
                            // 'details' is provided when fetchDetails = true
                            console.log('google data', data, details);
                        }}
                        query={{
                            key: AppConstants.GOOGLE_MAP_KEY,
                            language: 'en',
                        }}
                    /> */}

                    {/* <View style={{ width: '100%', height: 200 }}>
                        <MapView
                            provider={PROVIDER_GOOGLE}

                            initialRegion={{
                                latitude: 37.78825,
                                longitude: -122.4324,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                        />
                    </View> */}



                    <View>

                    </View>

                    <View style={{ backgroundColor: '#fff', borderColor: Color.BORDER, borderWidth: 0.5, padding: 20, marginBottom: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Address</Text>
                        {null != addressData ?
                            <Text style={{ marginVertical: 5 }}>{addressData.name}, {addressData.mobileNo}, {addressData.city}, {addressData.street}, {addressData.landmark}, {addressData.postOffice}, {addressData.policeStation}, {addressData.district}, {addressData.state}, {addressData.pinCode}, {addressData.country}</Text>
                            : null}
                        <View style={{ width: '100%', alignItems: 'flex-end' }}>
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate(AppRoute.CUSTOMER_ADDRESS) }} style={[Styles.center, { paddingVertical: 10, width: 100, borderRadius: 5, backgroundColor: Color.COLOR }]}>
                                <Text style={{ color: Color.BUTTON_NAME_COLOR }}>Change</Text>
                            </TouchableOpacity>
                        </View>
                    </View>


                    {/* <Header style={styles.header}> */}
                    {/* <View style={Styles.searchBox}>
                        <Text style={Styles.searchIcon}><SearchIcon /></Text>
                        <TextInput
                            placeholder="Search"
                            style={Styles.searchInput}
                        />
                    </View> */}
                    {!insideShop ?
                        <View style={[Styles.center]}>
                            <View style={[Styles.payment_box_view]}>
                                <Text style={Styles.payment_selection_header}>How do you want this order?</Text>
                                <View style={Styles.payment_selection_view}>
                                    <View style={{ flexDirection: 'row', marginRight: scale(20) }}>
                                        <Radio selected={homeDelivery} selectedColor='#501B1D' onPress={() => { this.handleOrderType('HOME') }} />
                                        <Text style={Styles.payment_selection_text}>Home Delivery</Text>
                                    </View>

                                    {/* <View style={{ flexDirection: 'row' }}>
                                        <Radio selected={selfPick} selectedColor='#501B1D' onPress={() => { this.handleOrderType('SELF') }} />
                                        <Text style={Styles.payment_selection_text}>Self Pickup</Text>
                                    </View> */}
                                </View>
                            </View>
                        </View> :
                        null}

                    <View style={[Styles.center]}>
                        <View style={[Styles.payment_box_view]}>
                            <Text style={Styles.payment_selection_header}>How do you want to pay?</Text>
                            <View style={Styles.payment_selection_view}>
                                <View style={{ flexDirection: 'row', marginRight: scale(20) }}>
                                    <Radio selected={cashDelivery} selectedColor='#501B1D' onPress={() => { this.handlePaymentType('CASH') }} />
                                    <Text style={Styles.payment_selection_text}>Cash</Text>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <Radio selected={payOnline} selectedColor='#501B1D' onPress={() => { this.handlePaymentType('PAYON') }} />
                                    <Text style={Styles.payment_selection_text}>Pay Online</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {!insideShop ?
                        <View style={[Styles.center]}>
                            <View style={[Styles.payment_box_view]}>
                                <Text style={Styles.payment_selection_header}>Delivery Slot</Text>
                                <View style={Styles.payment_selection_view}>
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
                                        onDateChange={(date) => { this.setState({ slotDate: date }) }}
                                    />
                                </View>
                            </View>
                        </View> : null}

                    {/* <List data={productList}
                        renderItem={this.renderCart}
                    /> */}
                </Content>
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
