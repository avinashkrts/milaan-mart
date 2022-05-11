import React, { Component } from 'react';
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
import { ScrollableTab, Tab, Item, Container, Content, Tabs, Radio, Header, TabHeading, Thumbnail, Input, Label, Footer, FooterTab, Col } from 'native-base';
import { CartScreenProps } from '../../../navigation/shopKeeperNavigator/allItem.Navigator';
import { AppRoute } from '../../../navigation/app-routes';
import { ProgressBar } from '../../../components/progress-bar.component';
import { SearchIcon, MinusIcon, RupeeIcon, PlusCircle, BackIcon, CancelIcon, PlusIcon, AddIcon, RightArrowIcon, BagIcon } from '../../../assets/icons';
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
import { Styles } from '../../../assets/styles'
import { Color, Contents, LableText } from '../../../constants/LabelConstants';
import Axios from 'axios';
import Modal from "react-native-modal";
import DatePicker from 'react-native-datepicker'
import { MyOrderDetailScreenProps } from '../../../navigation/shopKeeperNavigator/order.navigator';
import moment from 'moment';
import { Notification } from '../../../components/notification';
import { scale } from 'react-native-size-matters';
import { CheckBox } from 'native-base'
export class MyOrderDetailScreen extends Component<MyOrderDetailScreenProps, ThemedComponentProps & any> {
    constructor(props) {
        super(props)
        this.state = {
            cartData: [],
            productList: [],
            shopId: AppConstants.SHOP_ID,
            cartId: '',
            deliveryDate: '',
            addressData: [],
            orderstatusData: [],
            modalVisible: false,
            description: '',
            userData: [],
            rejectionModal: false,
            shippedModal: false,
            deliveryModal: false,
            byDeliveryBoy: false,
            byCourier: false,
            selfPickUp: true,
            deliverModal: false,
            courierName: '',
            courierId: '',
            dBoyName: '',
            dBoyNumber: '',
            byDBoyDType: '',
            bySelfDType: '',
            byCourierDType: '',
            deliveryCharge: '',
            userId: '',
            homeDelivery: '',
            selfPick: '',
            cashPay: '',
            walletPay: '',
            onlinePay: '',
            otp: '',
            isOtp: true,
            isCancel: true,
            review: '',
            totalItem: '',
            isChecked: []
        }
        this._onRefresh = this._onRefresh.bind(this);
        this.navigationProductDetail = this.navigationProductDetail.bind(this);
    }



    async componentDidMount() {
        let userDetail = await AsyncStorage.getItem('userDetail');
        let logedIn = await AsyncStorage.getItem('logedIn');
        let shopId = await AsyncStorage.getItem('shopId');
        let userData = JSON.parse(userDetail);
        const cartId = this.props.route.params.cartId;
        // Alert.alert("" + userData.adminId, cartId)

        this.setState({
            shopId: shopId,
            cartId: cartId,
            userData: userData,
            deliverModal: false
        })

        if (null != logedIn && logedIn === 'true') {
            // Alert.alert("" + userData.adminId, cartId)
            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/cart/get/' + cartId
            }).then((response) => {
                // console.log('delivery date ' + cartId + ' ', moment(response.data.slotDate).format('DD-MM-YYYY hh:mm a'))
                var totalItem = 0;
                var isChecked = [];
                response.data.productList.map((data, i) => {
                    totalItem = totalItem + data.productQuantity;
                    var objChecked = { "id": i, "isChecked": false }
                    isChecked.push(objChecked)
                })
                this.setState({
                    userId: response.data.userId,
                    totalItem: totalItem,
                    isChecked: isChecked,
                    deliveryDate: String(moment(response.data.slotDate).format('YYYY-MM-DD hh:mm:a'))
                })
                axios({
                    method: 'GET',
                    url: AppConstants.API_BASE_URL + '/api/address/get/' + response.data.addressId
                }).then((response) => {
                    if (response.data) {
                        this.setState({
                            addressData: response.data
                        })
                    }

                }, (error) => {
                    Alert.alert("Wait for a moment.")
                })
                this.setState({
                    cartData: response.data,
                    productList: response.data.productList
                })
                this.setState({
                    cartData: response.data,
                    productList: response.data.productList
                })
            }, (error) => {
                Alert.alert("Wait for a moment.")
            })

            Axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/lookup/getalllookup',
            }).then((response) => {
                if (null != response.data) {
                    console.log(response.data);
                    this.setState({
                        orderstatusData: response.data.ORDER_STATUS
                    })
                    response.data.PAYMENT_MODE.map((data, index) => {
                        data.lookUpName === "CASH" ?
                            this.setState({ cashPay: data.lookUpId }) :
                            data.lookUpName === "ONLINE_PAYMENT" ?
                                this.setState({ onlinePay: data.lookUpId }) :
                                data.lookUpName === "WALLET_PAYMENT" ?
                                    this.setState({ walletPay: data.lookUpId }) :
                                    null
                    })

                }
            }, (error) => {
                Alert.alert("Wait for a moment.")
            });

            Axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/lookup/getalldeliverytype',
            }).then((response) => {
                if (null != response.data) {
                    console.log(response.data);
                    response.data.map((delivery, dIndex) => {
                        if (delivery.lookUpName === 'BY_DELIVERY_BOY') {
                            this.setState({
                                byDBoyDType: delivery.lookUpId
                            })
                        } else if (delivery.lookUpName === 'SELF_DELIVERY') {
                            this.setState({
                                bySelfDType: delivery.lookUpId
                            })
                        } else if (delivery.lookUpName === 'COURIER') {
                            this.setState({
                                byCourierDType: delivery.lookUpId
                            })
                        }
                    })
                }
            }, (error) => {
                Alert.alert("Wait for a moment.")
            });

            Axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/lookup/getallordertype',
            }).then((response) => {
                if (null != response.data) {
                    console.log(response.data);
                    response.data.map((delivery, dIndex) => {
                        if (delivery.lookUpName === 'HOME_DELIVERY') {
                            this.setState({
                                homeDelivery: delivery.lookUpId
                            })
                        } else if (delivery.lookUpName === 'SELF_PICKUP') {
                            this.setState({
                                selfPick: delivery.lookUpId
                            })
                        }
                    })
                }
            }, (error) => {
                Alert.alert("Wait for a moment.")
            });
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

    handleOrderStatus(orderStatus, cartId) {
        const { userData, description, cartData, otp, selfPick, homeDelivery, userId, byDBoyDType, deliveryCharge, bySelfDType, byCourierDType, deliveryDate, deliveryType, byDeliveryBoy, byCourier, selfPickUp, dBoyName, dBoyNumber, courierName, courierId } = this.state;
        // Alert.alert(userData.shopId + cartId + orderStatus)
        switch (orderStatus) {
            case 'ACCEPT':
                // Alert.alert( orderStatus)
                Axios({
                    method: 'GET',
                    url: AppConstants.API_BASE_URL + '/api/cart/order/accept/' + cartId + '/' + userData.shopId,
                }).then((response) => {
                    if (null != response.data) {
                        Notification(userId, 2, Contents.ACCEPT_ORDER, 'You accpted this order.');
                        this._onRefresh();
                    }
                }, (error) => {
                    Alert.alert("Wait for a moment.")
                });
                break;
            case 'REJECT':
                // Alert.alert(cartId, "")
                Axios({
                    method: 'POST',
                    url: AppConstants.API_BASE_URL + '/api/cart/order/reject',
                    data: {
                        cartId: cartId,
                        shopId: userData.shopId,
                        description: description
                    }
                }).then((response) => {
                    if (null != response.data) {
                        Notification(userId, 2, Contents.REJECT_ORDER, 'You rejected this order.');
                        this.toggleModal('CLOSE');
                        this._onRefresh();
                    }
                }, (error) => {
                    Alert.alert("Wait for a moment.")
                });
                break;
            case 'PACK':
                // Alert.alert( orderStatus)
                Axios({
                    method: 'GET',
                    url: AppConstants.API_BASE_URL + '/api/cart/packedorder/' + cartId,
                }).then((response) => {
                    if (null != response.data) {
                        Notification(userId, 2, Contents.PACK_ORDER, 'You packed this order.');
                        this._onRefresh();
                    }
                }, (error) => {
                    Alert.alert("Wait for a moment.")
                });
                break;
            case 'SHIPPED':
                // Alert.alert("" + orderStatus)
                if (byDeliveryBoy) {
                    // Alert.alert(deliveryDate)
                    if (dBoyName == null || dBoyName === '') {
                        Alert.alert("Please enter delivery boy name.");
                    } else if (dBoyNumber == null || dBoyNumber === '') {
                        Alert.alert("Please enter delivery boy mobile number.");
                    } else {
                        Axios({
                            method: 'POST',
                            url: AppConstants.API_BASE_URL + '/api/cart/order/shipped',
                            data: {
                                cartId: cartId,
                                deliveryDate: deliveryDate,
                                deliveryType: byDBoyDType,
                                dBoyName: dBoyName,
                                dBoyNumber: dBoyNumber,
                                deliveryCharge: deliveryCharge ? deliveryCharge : 0
                            }
                        }).then((response) => {
                            if (null != response.data) {
                                Notification(userId, 2, Contents.SHIP_DELIVERY_BOY, 'null');
                                this.toggleModal('CLOSE');
                                this._onRefresh();
                            }
                        }, (error) => {
                            Alert.alert("Wait for a moment.")
                        });
                    }
                } else if (byCourier) {
                    if (courierName == null || courierName === '') {
                        Alert.alert("Please enter courier company name.");
                    } else if (courierId == null || courierId === '') {
                        Alert.alert("Please enter courier/tracking ID.");
                    } else {
                        Axios({
                            method: 'POST',
                            url: AppConstants.API_BASE_URL + '/api/cart/order/shipped',
                            data: {
                                cartId: cartId,
                                deliveryDate: deliveryDate,
                                deliveryType: byCourierDType,
                                courierName: courierName,
                                shippingId: courierId,
                                deliveryCharge: deliveryCharge ? deliveryCharge : 0
                            }
                        }).then((response) => {
                            if (null != response.data) {
                                Notification(userId, 2, Contents.SHIPPED_ORDER_COURIER, 'null');
                                this.toggleModal('CLOSE');
                                this._onRefresh();
                            }
                        }, (error) => {
                            Alert.alert("Wait for a moment.")
                        });
                    }
                } else if (cartData.orderType == selfPick) {
                    Axios({
                        method: 'POST',
                        url: AppConstants.API_BASE_URL + '/api/cart/order/shipped',
                        data: {
                            cartId: cartId,
                            deliveryDate: deliveryDate,
                            deliveryType: bySelfDType,
                        }
                    }).then((response) => {
                        if (null != response.data) {
                            Notification(userId, 2, Contents.SHIP_SELF_PICKUP, 'null');
                            this.toggleModal('CLOSE');
                            this._onRefresh();
                        }
                    }, (error) => {
                        Alert.alert("Wait for a moment.")
                    });
                } else {
                    Alert.alert('Please select mode of delivery.')
                }
                break;
            case 'DELIVERED':
                // Alert.alert( '' +cartId)
                if (otp === '' || otp.length < 0) {
                    Alert.alert('Please enter OTP.')
                } else {
                    Axios({
                        method: 'GET',
                        url: AppConstants.API_BASE_URL + '/api/cart/order/delivered/' + cartId + '/' + otp,
                    }).then((response) => {
                        if (null != response.data && response.data.status === 'true') {
                            Notification(userId, 2, Contents.DELIVERY, 'null');
                            this._onRefresh();
                        } else {
                            Alert.alert("Enter a valid OTP.")
                        }
                    }, (error) => {
                        Alert.alert("Enter a valid OTP.")
                    });
                }
                break;
            default:
                Alert.alert("Cart ID not found.");
                break;
        }
    }

    toggleModal(orderType) {
        switch (orderType) {
            case 'CLOSE':
                this.setState({
                    modalVisible: false
                })
                break;
            case 'REJECT':
                this.setState({
                    modalVisible: true,
                    rejectionModal: true,
                    shippedModal: false,
                    deliveryModal: false
                })
                break;
            case 'SHIPPED':
                this.setState({
                    modalVisible: true,
                    rejectionModal: false,
                    shippedModal: true,
                    deliveryModal: false
                })
                break;
            case 'DELIVERED':
                this.setState({
                    modalVisible: true,
                    rejectionModal: false,
                    shippedModal: false,
                    deliveryModal: true
                })
                break;
            default:
                Alert.alert("Cart ID not found.");
                break;
        }
    }

    handleChecked(value, index) {
        const { isChecked } = this.state;
        var tempChecked = isChecked
        tempChecked[index].isChecked= !tempChecked[index].isChecked       
        this.setState({
            isChecked: tempChecked
        })
    }

    renderCart = ({ item, index }: any): ListItemElement => (
        <ListItem style={{ borderBottomColor: 'rgba(2,15,20,0.10)', borderBottomWidth: 1 }}>
            {item != null ?
                <View style={Styles.cart_main_view}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '95%' }}>
                        {this.state.isChecked.map((data, i) => {
                            if(data.id == index) {
                                return(
                                <CheckBox checked={data.isChecked} onPress={(value) => { this.handleChecked(value, index) }} />
                                )
                            }
                        })}
                    </View>
                    <View style={Styles.cart_view_1}>
                        <View style={Styles.cart_view_1_1}>
                            <View style={[Styles.cart_avatar_view, Styles.center]}>
                                <Avatar source={{ uri: AppConstants.IMAGE_BASE_URL + '/product/' + item.productId + '_' + 1 + "_" + item.shopId + '_product.png' }} style={Styles.product_avatar} />
                            </View>
                        </View>

                        <View style={Styles.cart_view_1_2}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={Styles.cart_name_text}>{item.productName}</Text>
                                {/* <TouchableOpacity  onPress={() => { this.handleDelete(item.id) }}>
                                    <Text style={Styles.cart_name_text}><CancelIcon fontSize={25} /></Text>
                                </TouchableOpacity> */}
                            </View>
                            <View style={Styles.cart_price_view}>
                                <View style={{ flexDirection: 'row', width: '55%', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                    <Text style={Styles.price_text}><RupeeIcon /> {item.price.toFixed(2)}</Text>
                                    <Text style={Styles.offer_price_text}>{item.oldPrice.toFixed(2)}</Text>
                                </View>

                                <View style={[Styles.cart_quantity_view, Styles.center]}>
                                    {/* <TouchableOpacity style={Styles.cart_button} onPress={() => { this.handleDecrease(item.productId, item.productQuantity) }}>
                                        <Text style={Styles.cart_button_text}><MinusIcon /></Text>
                                    </TouchableOpacity> */}

                                    <View style={[Styles.cart_quantity_text_view]}>
                                        <Text style={[{ color: Color.BUTTON_NAME_COLOR }, Styles.cart_quantity_text]}>{item.productQuantity}</Text>
                                    </View>

                                    {/* <TouchableOpacity style={Styles.cart_button} onPress={() => { this.handleIncrease(item.productId) }}>
                                        <Text style={Styles.cart_button_text}><AddIcon /></Text>
                                    </TouchableOpacity> */}
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

    navigationItemList() {
        // this.props.navigation.navigate(AppRoute.ITEMLIST)
    }

    navigationProductDetail() {
        this.props.navigation.navigate(AppRoute.PRODUCT_DETAIL)
    }

    continiueShopping() {
        this.props.navigation.navigate(AppRoute.CUSTOMER_ALL_PRODUCT)
    }

    handleDeliveryType(deliveryType) {
        switch (deliveryType) {
            case 'DBOY':
                this.setState({
                    byDeliveryBoy: true,
                    byCourier: false,
                    selfPickUp: false
                })
                break;

            case 'COURIER':
                this.setState({
                    byDeliveryBoy: false,
                    byCourier: true,
                    selfPickUp: false
                })
                break;

            case 'SELFPICK':
                this.setState({
                    byDeliveryBoy: false,
                    byCourier: false,
                    selfPickUp: true
                })
                break;
            default:
                Alert.alert('Delivery type not found.')
        }
    }

    handleDenied() {
        const { review, cartData, adminData, received, denied, receivedCartId } = this.state;
        // Alert.alert(cartId + receivedCartId +'')
        if (review === '' || review.length < 50) {
            Alert.alert('Please write correct reason.')
        } else {
            // Alert.alert('Done' + review.length)
            Axios({
                method: 'POST',
                url: AppConstants.API_BASE_URL + '/api/cart/order/denied',
                data: {
                    cartId: cartData.cartId,
                    comment: review,
                    denied: true
                }
            }).then((response) => {
                if (null != response.data) {
                    Notification(cartData.userId, 2, Contents.ORDER_NOT_DELIVERED, 'null');

                    this.setState({ deliverModal: false })
                    // Axios({
                    //     method: 'GET',
                    //     url: AppConstants.API_BASE_URL + '/api/admin/get/activeadminbyshopid/' + shopId
                    // }).then((response) => {
                    //     if (response.data) {
                    //         Notification(response.data[0].adminId, response.data[0].userType, denied ? Contents.ORDER_NOT_DELIVERED : Contents.ORDER_DELIVERED, 'null');
                    //         this.toggleModal('CLOSE', '');
                    //         this.onRefresh();
                    //     }

                    // }, (error) => {
                    //     Alert.alert("Wait for a moment.")
                    // })

                }
            }, (error) => {
                Alert.alert("Wait for a moment.")
            });
        }

    }

    render() {
        const { cartData, totalItem, cartId, isOtp, review, isCancel, deliverModal, otp, deliveryCharge, cashPay, onlinePay, walletPay, homeDelivery, selfPick, byDBoyDType, bySelfDType, byCourierDType, shippedDate, deliveryDate, rejectionModal, shippedModal, deliveryModal, addressData, orderstatusData, productList } = this.state
        return (
            <SafeAreaLayout
                style={Styles.safeArea}
                insets={SaveAreaInset.TOP}>
                <Toolbar
                    title='Order Detail'
                    backIcon={BackIcon}
                    onBackPress={this.props.navigation.goBack}
                    style={{ marginTop: -5, marginLeft: -5 }}
                />
                <Divider />
                <Modal style={Styles.modal} isVisible={deliverModal}>
                    <View style={Styles.modalHeader}>
                        <TouchableOpacity>
                            <Text onPress={() => { this.setState({ deliverModal: false }) }}><CancelIcon fontSize={25} /></Text>
                        </TouchableOpacity>
                    </View>

                    <View style={Styles.user_detail}>
                        <View style={[Styles.user_detail_header, Styles.user_detail_data, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                            <Text onPress={() => { this.setState({ isCancel: !isCancel }) }} style={[{ width: '90%' }, Styles.user_detail_header_text]}>Enter OTP</Text>
                            <Text onPress={() => { this.setState({ isCancel: !isCancel }) }} style={[isCancel ? Styles.show_otp : Styles.hide_otp, Styles.user_detail_header_text]}><RightArrowIcon fontSize={scale(15)} /></Text>
                        </View>
                        {isCancel ?
                            <>
                                <View style={Styles.user_detail_header}>
                                    {/* <Text style={Styles.user_detail_header_text}>{LableText.ENTER_OTP}</Text> */}
                                </View>
                                <View style={Styles.user_detail_data}>
                                    <TextInput
                                        style={Styles.cash_pay_input}
                                        placeholder={LableText.ENTER_OTP}
                                        value={otp}
                                        onChangeText={(value) => { this.setState({ otp: value }) }}
                                    />
                                </View>
                                <View style={[Styles.center, { marginTop: 30 }]}>
                                    <Text onPress={() => { this.handleOrderStatus('DELIVERED', cartData.cartId) }} style={[{ backgroundColor: Color.COLOR, fontSize: 18, color: '#fff', padding: 10, borderRadius: 5, marginTop: 3 }]}>{LableText.SUBMIT}</Text>
                                </View>
                            </> : null}
                    </View>


                    <View style={Styles.user_detail}>
                        <View style={[Styles.user_detail_header, Styles.user_detail_data, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                            <Text onPress={() => { this.setState({ isCancel: !isCancel }) }} style={[{ width: '90%' }, Styles.user_detail_header_text]}>Cancel Order</Text>
                            <Text onPress={() => { this.setState({ isCancel: !isCancel }) }} style={[!isCancel ? Styles.show_otp : Styles.hide_otp, Styles.user_detail_header_text]}><RightArrowIcon fontSize={scale(15)} /></Text>
                        </View>

                        {!isCancel ?
                            <>
                                <View style={Styles.user_detail_header}>
                                    <Text style={Styles.user_detail_header_text}>{LableText.CANCEL_REASION} {review.length < 50 ? 50 - review.length : null}</Text>
                                </View>
                                <View style={Styles.user_detail_data}>
                                    <TextInput
                                        style={[Styles.cash_pay_input, { height: scale(100), textAlignVertical: 'top' }]}
                                        placeholder={LableText.ENTER_CANCEL_REASION}
                                        multiline={true}
                                        value={review}
                                        onChangeText={(value) => { this.setState({ review: value }) }}
                                    />
                                </View>
                                <View style={[Styles.center, { marginTop: 30 }]}>
                                    <Text onPress={() => { this.handleDenied() }} style={[{ backgroundColor: Color.COLOR, fontSize: 18, color: '#fff', padding: 10, borderRadius: 5, marginTop: 3 }]}>{LableText.SUBMIT}</Text>
                                </View>
                            </>
                            : null}
                    </View>
                </Modal>

                <Content style={Styles.cart_content} showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                >

                    <View style={{ backgroundColor: '#fff', borderColor: Color.BORDER, borderWidth: 0.5, padding: 20, marginBottom: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Payment Mode:</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}> {cartData.transactionType ? cartData.transactionType == cashPay ? 'COD' : cartData.transactionType == onlinePay ? 'Online Payment' : cartData.transactionType == walletPay ? 'Wallet Payment' : null : null}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Address</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Order Id: {cartData.cartId ? cartData.cartId : null} </Text>
                        </View>
                        {null != addressData ?
                            <Text style={{ marginVertical: 5 }}>{addressData.name}, {addressData.mobileNo}, {addressData.city}, {addressData.street}, {addressData.landmark}, {addressData.postOffice}, {addressData.policeStation}, {addressData.district}, {addressData.state}, {addressData.pinCode}, {addressData.country}</Text>
                            : null}
                        <View style={{ width: '100%', alignItems: 'flex-end' }}>
                            {/* <TouchableOpacity onPress={() => { this.props.navigation.navigate(AppRoute.CUSTOMER_ADDRESS) }} style={[Styles.center, { paddingVertical: 10, width: 100, borderRadius: 5, backgroundColor: Color.COLOR }]}>
                                <Text style={{ color: Color.BUTTON_NAME_COLOR }}>Change</Text>
                            </TouchableOpacity> */}
                        </View>
                    </View>

                    <List data={productList.slice(0).reverse()}
                        renderItem={this.renderCart}
                    />

                    <Modal style={Styles.modal} isVisible={this.state.modalVisible}>
                        <View style={Styles.modalHeader}>
                            <TouchableOpacity>
                                <Text onPress={() => { this.toggleModal('CLOSE') }}><CancelIcon fontSize={25} /></Text>
                            </TouchableOpacity>
                        </View>
                        {rejectionModal ?
                            <View style={Styles.user_detail}>
                                <View style={Styles.user_detail_header}>
                                    <Text style={Styles.user_detail_header_text}>{LableText.REJECTION_CAUSE}</Text>
                                </View>
                                <View style={Styles.user_detail_data}>
                                    <TextInput
                                        style={Styles.cash_pay_input}
                                        placeholder={LableText.REJECTION_CAUSE}
                                        multiline={true}
                                        value={this.state.description}
                                        onChangeText={(value) => { this.setState({ description: value }) }}
                                    />
                                </View>
                                <View style={[Styles.center, { marginTop: 30 }]}>
                                    <Text onPress={() => { this.handleOrderStatus('REJECT', cartId) }} style={[{ backgroundColor: Color.COLOR, fontSize: 18, color: '#fff', padding: 10, borderRadius: 5, marginTop: 3 }]}>{LableText.SUBMIT}</Text>
                                </View>
                            </View> : shippedModal ?
                                <View style={Styles.user_detail}>
                                    <View style={Styles.user_detail_data}>
                                        {cartData.orderType ? String(cartData.orderType) === String(selfPick) ?
                                            <View style={{ flexDirection: 'row', marginRight: 20 }}>
                                                <Radio selected={this.state.selfPickUp} selectedColor='#501B1D' onPress={() => { this.handleDeliveryType('SELFPICK') }} />
                                                <Text style={[{ color: Color.COLOR }, Styles.payment_selection_text]}>Self pick up</Text>
                                            </View> :
                                            cartData.orderType == homeDelivery || cartData.orderType == homeDelivery ?
                                                <>
                                                    <View style={{ flexDirection: 'row', marginRight: 20 }}>
                                                        <Radio selected={this.state.byDeliveryBoy} selectedColor='#501B1D' onPress={() => { this.handleDeliveryType('DBOY') }} />
                                                        <Text style={[{ color: Color.COLOR }, Styles.payment_selection_text]}>By delivery boy</Text>
                                                    </View>

                                                    <View style={{ flexDirection: 'row', marginRight: 20 }}>
                                                        <Radio selected={this.state.byCourier} selectedColor='#501B1D' onPress={() => { this.handleDeliveryType('COURIER') }} />
                                                        <Text style={[{ color: Color.COLOR }, Styles.payment_selection_text]}>By courier</Text>
                                                    </View>
                                                </> : null : null
                                        }
                                    </View>
                                    <View style={[Styles.user_detail_data, { marginTop: 10 }]}>

                                        <View style={Styles.user_detail_header}>
                                            <Text style={Styles.user_detail_header_text}>{LableText.EXPECTED_D_DATE}</Text>
                                        </View>
                                        <View style={Styles.user_detail_data}>

                                            <DatePicker
                                                style={{ width: '100%' }}
                                                date={deliveryDate}
                                                mode="datetime"
                                                placeholder="Select date"
                                                format="YYYY-MM-DD hh:mm:a"
                                                minDate={deliveryDate}
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
                                                onDateChange={(date) => { this.setState({ deliveryDate: date }) }}
                                            />
                                        </View>
                                        {this.state.byDeliveryBoy ?
                                            <>
                                                <View style={Styles.user_detail_header}>
                                                    <Text style={Styles.user_detail_header_text}>{LableText.D_BOY_NAME}</Text>
                                                </View>
                                                <View style={Styles.user_detail_data}>
                                                    <TextInput
                                                        style={Styles.cash_pay_input}
                                                        placeholder={LableText.D_BOY_NAME}
                                                        multiline={true}
                                                        value={this.state.dBoyName}
                                                        onChangeText={(value) => { this.setState({ dBoyName: value }) }}
                                                    />
                                                </View>
                                                <View style={Styles.user_detail_header}>
                                                    <Text style={Styles.user_detail_header_text}>{LableText.D_BOY_NUMBER}</Text>
                                                </View>
                                                <View style={Styles.user_detail_data}>
                                                    <TextInput
                                                        style={Styles.cash_pay_input}
                                                        placeholder={LableText.D_BOY_NUMBER}
                                                        multiline={true}
                                                        value={this.state.dBoyNumber}
                                                        onChangeText={(value) => { this.setState({ dBoyNumber: value }) }}
                                                    />
                                                </View>
                                                <View style={Styles.user_detail_header}>
                                                    <Text style={Styles.user_detail_header_text}>{LableText.DELIVERY_CHARGE}</Text>
                                                </View>
                                                <View style={Styles.user_detail_data}>
                                                    <TextInput
                                                        style={Styles.cash_pay_input}
                                                        placeholder={LableText.DELIVERY_CHARGE}
                                                        multiline={true}
                                                        value={this.state.deliveryCharge}
                                                        onChangeText={(value) => { this.setState({ deliveryCharge: value }) }}
                                                    />
                                                </View>
                                            </>
                                            : this.state.byCourier ?
                                                <>
                                                    <View style={Styles.user_detail_header}>
                                                        <Text style={Styles.user_detail_header_text}>{LableText.COURIER_NAME}</Text>
                                                    </View>
                                                    <View style={Styles.user_detail_data}>
                                                        <TextInput
                                                            style={Styles.cash_pay_input}
                                                            placeholder={LableText.COURIER_NAME}
                                                            multiline={true}
                                                            value={this.state.courierName}
                                                            onChangeText={(value) => { this.setState({ courierName: value }) }}
                                                        />
                                                    </View>
                                                    <View style={Styles.user_detail_header}>
                                                        <Text style={Styles.user_detail_header_text}>{LableText.COURIER_ID}</Text>
                                                    </View>
                                                    <View style={Styles.user_detail_data}>
                                                        <TextInput
                                                            style={Styles.cash_pay_input}
                                                            placeholder={LableText.COURIER_ID}
                                                            multiline={true}
                                                            value={this.state.courierId}
                                                            onChangeText={(value) => { this.setState({ courierId: value }) }}
                                                        />
                                                    </View>
                                                    <View style={Styles.user_detail_header}>
                                                        <Text style={Styles.user_detail_header_text}>{LableText.DELIVERY_CHARGE}</Text>
                                                    </View>
                                                    <View style={Styles.user_detail_data}>
                                                        <TextInput
                                                            style={Styles.cash_pay_input}
                                                            placeholder={LableText.DELIVERY_CHARGE}
                                                            multiline={true}
                                                            value={this.state.deliveryCharge}
                                                            onChangeText={(value) => { this.setState({ deliveryCharge: value }) }}
                                                        />
                                                    </View>
                                                </> : null}
                                        <View style={[Styles.center, { marginTop: 30 }]}>
                                            <Text onPress={() => { this.handleOrderStatus('SHIPPED', cartId) }} style={[{ backgroundColor: Color.COLOR, fontSize: 18, color: '#fff', padding: 10, borderRadius: 5, marginTop: 3 }]}>{LableText.SUBMIT}</Text>
                                        </View>
                                    </View>
                                </View> : null
                        }
                    </Modal>

                    <View style={Styles.price_detail_1}>
                        <Text style={Styles.cart_price_detail_1_text}>PRICE DETAILS</Text>

                        <View style={Styles.price_detail_2}>
                            <View style={Styles.price_detail_2_1}>
                                <View style={{ flexWrap: 'wrap', flexDirection: 'row', width: '60%' }}>
                                    <Text style={Styles.cart_price_text_head}>Item Count</Text>
                                </View>
                                <View style={{ flexWrap: 'wrap', flexDirection: 'row', width: '38%', justifyContent: 'flex-end' }}>
                                    <Text style={Styles.cart_price_text_head}>{null != totalItem ? (totalItem) : null} Nos.</Text>
                                </View>
                            </View>

                            <View style={Styles.price_detail_2_1}>
                                <View style={{ flexWrap: 'wrap', flexDirection: 'row', width: '60%' }}>
                                    <Text style={Styles.cart_price_text_head}>Price ({null != productList ? productList.length : null} Product)</Text>
                                </View>
                                <View style={{ flexWrap: 'wrap', flexDirection: 'row', width: '38%', justifyContent: 'flex-end' }}>
                                    <Text style={Styles.cart_price_text_head}><RupeeIcon fontSize={18} />{null != cartData.price ? (cartData.price).toFixed(2) : null}</Text>
                                </View>
                            </View>

                            <View style={Styles.price_detail_2_1}>
                                <Text style={Styles.cart_price_text_head}>Discount</Text>
                                <Text style={Styles.cart_price_text_data}>-<RupeeIcon fontSize={18} />{null != cartData.discount ? cartData.discount.toFixed(2) : null}</Text>
                            </View>

                            <View style={Styles.price_detail_2_1}>
                                <Text style={Styles.cart_price_text_head}>GST Amount</Text>
                                <Text style={Styles.cart_price_text_data}><RupeeIcon fontSize={18} />{null != cartData.gstAmount ? cartData.gstAmount.toFixed(2) : null}</Text>
                            </View>

                            {/* <View style={Styles.price_detail_2_1}>
                                <Text style={Styles.cart_price_text_head}>Delevery Charges</Text>
                                <Text style={Styles.cart_price_text_data}>FREE</Text>
                            </View> */}
                        </View>

                        <View style={Styles.cart_total_view}>
                            <Text style={Styles.cart_total_text_head}>Total Amount</Text>
                            <Text style={Styles.cart_total_text_head}><RupeeIcon fontSize={18} />{null != cartData.payableAmount ? cartData.payableAmount : null}</Text>
                        </View>
                    </View>
                    {null != cartData.review ?
                        <View style={Styles.price_detail_1}>
                            <Text style={Styles.cart_price_detail_1_text}>Remarks</Text>
                            <View style={Styles.price_detail_2}>
                                <View style={Styles.price_detail_2_1}>
                                    <Text style={Styles.cart_price_text_head}>{cartData.review}</Text>
                                </View>
                            </View>
                        </View> : null}

                    <View style={{ height: 10, width: '100%' }} />
                </Content>


                {null != orderstatusData ? orderstatusData.map((orderStatus, oIndex) => {
                    if (orderStatus.lookUpName === "PLACED") {
                        if (orderStatus.lookUpId == cartData.orderStatus) {
                            return (
                                <View style={Styles.cart_bottom_box_view}>
                                    <View>
                                        <TouchableOpacity style={[Styles.cart_bottom_box_button, Styles.center]} onPress={() => { this.handleOrderStatus('ACCEPT', cartData.cartId) }}>
                                            <Text style={Styles.cart_bottom_box_button_text}>Accept</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View>
                                        <TouchableOpacity style={[Styles.cart_bottom_box_button, Styles.center]} onPress={() => { this.toggleModal('REJECT') }}>
                                            <Text style={Styles.cart_bottom_box_button_text}>Reject</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        }
                    } else if (orderStatus.lookUpName === "REJECTED") {
                        if (orderStatus.lookUpId == cartData.orderStatus) {
                            return (
                                <Text style={[{ alignSelf: 'center', backgroundColor: Color.COLOR, fontSize: 18, color: '#fff', padding: 10, borderRadius: 5, marginTop: 3 }]}>Rejected</Text>
                            )
                        }
                    } else if (orderStatus.lookUpName === "ACCEPTED") {
                        if (orderStatus.lookUpId == cartData.orderStatus) {
                            return (
                                <View style={Styles.cart_bottom_box_view}>
                                    <View style={[Styles.cart_bottom_box_button, Styles.center]}>
                                        {/* <TouchableOpacity style={[Styles.cart_bottom_box_button, Styles.center]} onPress={() => { this.handlePlaceOrder(cartData.cartId, cartData.totalAmount) }}> */}
                                        <Text style={Styles.cart_bottom_box_button_text}>Accepted</Text>
                                        {/* </TouchableOpacity> */}
                                    </View>

                                    <View>
                                        <TouchableOpacity style={[Styles.cart_bottom_box_button, Styles.center]} onPress={() => { this.handleOrderStatus('PACK', cartData.cartId) }}>
                                            <Text style={Styles.cart_bottom_box_button_text}>Packed</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        }
                    } else if (orderStatus.lookUpName === "PACKED") {
                        if (orderStatus.lookUpId == cartData.orderStatus) {
                            return (
                                <View style={Styles.cart_bottom_box_view}>
                                    <View style={[Styles.cart_bottom_box_button, Styles.center]}>
                                        {/* <TouchableOpacity style={[Styles.cart_bottom_box_button, Styles.center]} onPress={() => { this.handlePlaceOrder(cartData.cartId, cartData.totalAmount) }}> */}
                                        <Text style={Styles.cart_bottom_box_button_text}>Packed</Text>
                                        {/* </TouchableOpacity> */}
                                    </View>

                                    <View>
                                        <TouchableOpacity style={[Styles.cart_bottom_box_button, Styles.center]} onPress={() => { this.toggleModal('SHIPPED') }}>
                                            <Text style={Styles.cart_bottom_box_button_text}>Shipped</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        }
                    } else if (orderStatus.lookUpName === "SHIPPED") {
                        if (orderStatus.lookUpId == cartData.orderStatus) {
                            return (
                                <View style={Styles.cart_bottom_box_view}>
                                    <View style={[Styles.cart_bottom_box_button, Styles.center]}>
                                        {/* <TouchableOpacity style={[Styles.cart_bottom_box_button, Styles.center]} onPress={() => { this.handlePlaceOrder(cartData.cartId, cartData.totalAmount) }}> */}
                                        <Text style={Styles.cart_bottom_box_button_text}>Shipped</Text>
                                        {/* </TouchableOpacity> */}
                                    </View>

                                    <View>
                                        <TouchableOpacity style={[Styles.cart_bottom_box_button, Styles.center]} onPress={() => { this.setState({ deliverModal: true }) }}>
                                            <Text style={Styles.cart_bottom_box_button_text}>Delivered</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        }
                    } else if (orderStatus.lookUpName === "DELIVERED") {
                        if (orderStatus.lookUpId == cartData.orderStatus) {
                            return (
                                <View style={[Styles.cart_bottom_box_view, Styles.center]}>
                                    {/* <View style={[Styles.cart_bottom_box_button, Styles.center]}>
                                        <TouchableOpacity style={[Styles.cart_bottom_box_button, Styles.center]} onPress={() => { this.handlePlaceOrder(cartData.cartId, cartData.totalAmount) }}>
                                        <Text style={Styles.cart_bottom_box_button_text}>Shipped</Text>
                                        </TouchableOpacity>
                                    </View> */}

                                    <View style={[Styles.cart_bottom_box_button, Styles.center]}>
                                        {/* <TouchableOpacity style={[Styles.cart_bottom_box_button, Styles.center]} onPress={() => { this.handleOrderStatus('DELIVERED', cartData.cartId) }}> */}
                                        <Text style={Styles.cart_bottom_box_button_text}>Delivered</Text>
                                        {/* </TouchableOpacity> */}
                                    </View>
                                </View>
                            )
                        }
                    } else if (orderStatus.lookUpName === "RECEIVED") {
                        if (orderStatus.lookUpId == cartData.orderStatus) {
                            return (
                                <View style={[Styles.cart_bottom_box_view, Styles.center]}>
                                    {/* <View style={[Styles.cart_bottom_box_button, Styles.center]}>
                                        <TouchableOpacity style={[Styles.cart_bottom_box_button, Styles.center]} onPress={() => { this.handlePlaceOrder(cartData.cartId, cartData.totalAmount) }}>
                                        <Text style={Styles.cart_bottom_box_button_text}>Shipped</Text>
                                        </TouchableOpacity>
                                    </View> */}

                                    <View style={[Styles.cart_bottom_box_button, Styles.center]}>
                                        {/* <TouchableOpacity style={[Styles.cart_bottom_box_button, Styles.center]} onPress={() => { this.handleOrderStatus('DELIVERED', cartData.cartId) }}> */}
                                        <Text style={Styles.cart_bottom_box_button_text}>Received</Text>
                                        {/* </TouchableOpacity> */}
                                    </View>
                                </View>
                            )
                        }
                    } else if (orderStatus.lookUpName === "DENIED") {
                        if (orderStatus.lookUpId == cartData.orderStatus) {
                            return (
                                <View style={[Styles.cart_bottom_box_view, Styles.center]}>
                                    {/* <View style={[Styles.cart_bottom_box_button, Styles.center]}>
                                        <TouchableOpacity style={[Styles.cart_bottom_box_button, Styles.center]} onPress={() => { this.handlePlaceOrder(cartData.cartId, cartData.totalAmount) }}>
                                        <Text style={Styles.cart_bottom_box_button_text}>Shipped</Text>
                                        </TouchableOpacity>
                                    </View> */}

                                    <View style={[Styles.cart_bottom_box_button, Styles.center]}>
                                        {/* <TouchableOpacity style={[Styles.cart_bottom_box_button, Styles.center]} onPress={() => { this.handleOrderStatus('DELIVERED', cartData.cartId) }}> */}
                                        <Text style={Styles.cart_bottom_box_button_text}>Denied</Text>
                                        {/* </TouchableOpacity> */}
                                    </View>
                                </View>
                            )
                        }
                    }
                }) : null}

                <Divider />
                <Divider />
            </SafeAreaLayout>
        )
    }
}