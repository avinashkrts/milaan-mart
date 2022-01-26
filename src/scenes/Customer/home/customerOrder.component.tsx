import React, { Component } from "react";
import { View, Text, RefreshControl, Alert, AsyncStorage, BackHandler } from "react-native";
import { Avatar, Divider, ThemedComponentProps, ListItem, ListItemElement, List } from "react-native-ui-kitten";
import { CustomerOrderScreenProps } from "../../../navigation/customer-navigator/customerOrder.navigator";
import { SafeAreaLayout, SaveAreaInset } from "../../../components/safe-area-layout.component";
import { Toolbar } from "../../../components/toolbar.component";
import { BackIcon, MenuIcon, CancelIcon } from "../../../assets/icons";
import { Styles } from "../../../assets/styles";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { AppConstants, Color, LableText } from "../../../constants";
import { Content, Image } from "native-base";
import Axios from "axios";
import { AppRoute } from "../../../navigation/app-routes";
import moment from "moment";
import Modal from "react-native-modal";
import { CustomerOrderProductScreenProps } from "../../../navigation/customer-navigator/customerAllProduct.navigator";
import { Notification } from "../../../components/notification";
import { Contents } from "../../../constants/LabelConstants";
import { StackActions } from "@react-navigation/core";
import { scale } from "react-native-size-matters";

export class CustomerOrderScreen extends Component<CustomerOrderScreenProps & CustomerOrderProductScreenProps, ThemedComponentProps & any> {
    backHandler: any;
    constructor(props) {
        super(props);
        this.state = {
            cartData: [],
            orderStatusData: [],
            deliveryTypeData: [],
            reviewModal: false,
            received: false,
            denied: false,
            review: '',
            receivedCartId: '',
            adminData: [],
            isDetail: false,
            paymentMode: []
        }

        this.onRefresh = this.onRefresh.bind(this);
    }

    backAction = () => {
        const pushAction = StackActions.push(AppRoute.CUSTOMER_HOME)
        this.props.navigation.dispatch(pushAction);
        return true;
    };

    componentWillUnmount() {
        this.backHandler.remove();
    }

    async componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            this.backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                this.backAction
            );
        })

        this.props.navigation.addListener('blur', () => {
            this.backHandler.remove();
        })

        let userDetail = await AsyncStorage.getItem('userDetail');
        let userData = JSON.parse(userDetail);
        this.setState({ userData: userData })
        console.log("asasass" + this.props)

        if (null != userData) {
            Axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/cart/get/user/order/' + userData.userId,
            }).then((response) => {
                if (null != response.data) {
                    this.setState({
                        cartData: response.data
                    })
                }
            }, (error) => {
                Alert.alert("Server error!.")
            });

            Axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/lookup/getalllookup',
            }).then((response) => {
                if (null != response.data) {
                    console.log(response.data);
                    this.setState({
                        deliveryTypeData: response.data.DELIVERY_TYPE,
                        paymentMode: response.data.PAYMENT_MODE,
                        orderstatusData: response.data.ORDER_STATUS
                    })
                }
            }, (error) => {
                Alert.alert("Server error!.")
            });
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

    handleCartSubmit(cartId) {
        const pushAction = StackActions.push(AppRoute.CUSTOMER_ORDER_DETAIL, { cartId: String(cartId) })
        this.props.navigation.dispatch(pushAction);
    }

    toggleModal(orderStatus, receivedCartId) {
        switch (orderStatus) {
            case 'CLOSE':
                this.setState({
                    reviewModal: false,
                    receivedCartId: ''
                })
                break;
            case 'RECEIVED':
                this.setState({
                    reviewModal: true,
                    received: true,
                    denied: false,
                    receivedCartId: receivedCartId
                })
                break;
            case 'DENIED':
                this.setState({
                    reviewModal: true,
                    received: false,
                    denied: true,
                    receivedCartId: receivedCartId
                })
                break;
            default:
                Alert.alert("Cart ID not found.");
                break;
        }
    }

    handleOrderStatus(cartId, shopId) {
        const { review, adminData, received, denied, receivedCartId } = this.state;
        // Alert.alert(cartId + receivedCartId +'')
        if (denied && review.length < 100) {
            Alert.alert('Please write correct reason.')
        } else {
            // Alert.alert('Done' + review.length)
            Axios({
                method: 'POST',
                url: AppConstants.API_BASE_URL + '/api/cart/order/denied',
                data: {
                    cartId: receivedCartId,
                    comment: review.length < 1 ? ' ' : review,
                    denied: denied
                }
            }).then((response) => {
                if (null != response.data) {

                    Axios({
                        method: 'GET',
                        url: AppConstants.API_BASE_URL + '/api/admin/get/activeadminbyshopid/' + shopId
                    }).then((response) => {
                        if (response.data) {
                            Notification(response.data[0].adminId, response.data[0].userType, denied ? Contents.ORDER_NOT_DELIVERED : Contents.ORDER_DELIVERED, 'null');
                            this.toggleModal('CLOSE', '');
                            this.onRefresh();
                        }

                    }, (error) => {
                        Alert.alert("Server problem")
                    })

                }
            }, (error) => {
                Alert.alert("Server error!.")
            });
        }

    }

    renderCart = ({ item, index }: any): ListItemElement => (
        <ListItem style={{ borderBottomColor: 'rgba(2,15,20,0.10)', borderBottomWidth: 1 }}>
            {item != null ?
                <View style={{ paddingHorizontal: scale(10) }}>
                    <Modal style={Styles.modal} isVisible={this.state.reviewModal}>
                        <View style={Styles.modalHeader}>
                            <TouchableOpacity>
                                <Text onPress={() => { this.toggleModal('CLOSE', '') }}><CancelIcon fontSize={25} /></Text>
                            </TouchableOpacity>
                        </View>
                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{this.state.received ? LableText.WRIET_REVIEW : this.state.denied ? LableText.DENIE_REVIEW + ' ' + this.state.review.length + '/100' : null}</Text>
                            </View>
                            <View style={Styles.user_detail_data}>
                                <TextInput
                                    style={Styles.cash_pay_input}
                                    placeholder={LableText.WRIET_REVIEW}
                                    multiline={true}
                                    value={this.state.review}
                                    onChangeText={(value) => { this.setState({ review: value }) }}
                                />
                            </View>
                            <View style={[Styles.center, { marginTop: 30 }]}>
                                <Text onPress={() => { this.handleOrderStatus(item.cartId, item.shopId) }} style={[{ backgroundColor: Color.COLOR, fontSize: 18, color: '#fff', padding: 10, borderRadius: 5, marginTop: 3 }]}>{LableText.SUBMIT}</Text>
                            </View>
                        </View>
                    </Modal>

                    <View style={Styles.order_row}>
                        <TouchableOpacity style={{ width: '100%' }} onPress={() => { this.handleCartSubmit(item.cartId) }}>
                            <Avatar source={{ uri: AppConstants.IMAGE_BASE_URL + '/shop/' + item.adminId + '_1_' + item.shopId + '_shop.png' }} style={Styles.order_cart} />
                        </TouchableOpacity>
                        <View style={[Styles.order_column, { width: '65%' }]}>
                            <View style={{ flexWrap: 'wrap', flexDirection: 'row', width: '100%' }}>
                                <Text style={Styles.order_text}>{item.shopName}</Text>
                            </View>
                            {/* <Text style={Styles.order_text}>{item.mobileNo}</Text> */}
                            <Text style={[Styles.order_column]}>Total Amount: {item.payableAmount}</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                <Text style={[Styles.order_column]}>Order ID: {item.cartId}</Text>
                                {this.state.paymentMode ? this.state.paymentMode.map((data, index) => (
                                    data.lookUpId == item.transactionType ?
                                        <Text style={[Styles.order_column]}>{data.lookUpLabel}</Text> : null
                                )) : null}
                            </View>

                            <View style={[Styles.get_detail_button_box]}>
                                <Text style={Styles.get_detail_button_text} onPress={() => { this.handleCartSubmit(item.cartId) }} >Get Detail</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', paddingBottom: 10 }}>

                        {null != this.state.orderstatusData ? this.state.orderstatusData.map((orderStatus, oIndex) => {
                            if (orderStatus.lookUpName === "PLACED") {
                                if (orderStatus.lookUpId == item.orderStatus) {
                                    return (
                                        <>
                                            <View style={[Styles.center, Styles.order_bar_main_1]}>
                                                <View style={Styles.order_bar_ordered1} />
                                                <View style={Styles.order_bar_ordered2} />
                                                <View style={[Styles.order_bar_ordered3]} />

                                                <View style={[Styles.order_bar_accepted1]} />
                                                <View style={[Styles.order_bar_accepted2]} />
                                                <View style={Styles.order_bar_accepted3} />

                                                <View style={Styles.order_bar_packed1} />
                                                <View style={Styles.order_bar_packed2} />
                                                <View style={Styles.order_bar_packed3} />

                                                <View style={Styles.order_bar_shipped1} />
                                                <View style={Styles.order_bar_shipped2} />
                                                <View style={Styles.order_bar_shipped3} />

                                                <View style={Styles.order_bar_delevered1} />
                                            </View>
                                            <View style={Styles.order_bar_main_2}>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Ordered</Text>
                                                </View>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Accepted</Text>
                                                </View>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Packed</Text>
                                                </View>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Shipped</Text>
                                                </View>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Delivered</Text>
                                                </View>
                                            </View>
                                        </>
                                    )
                                }
                            } else if (orderStatus.lookUpName === "REJECTED") {
                                if (orderStatus.lookUpId == item.orderStatus) {
                                    return (
                                        <>
                                            <View style={[Styles.center, Styles.order_bar_main_1]}>
                                                <View style={Styles.order_bar_ordered1} />
                                                <View style={Styles.order_bar_ordered2} />
                                                <View style={[Styles.order_bar_ordered3, { backgroundColor: 'green' }]} />

                                                <View style={[Styles.order_bar_accepted1, { backgroundColor: 'green' }]} />
                                                {/* <View style={[Styles.order_bar_accepted2]} />
                                                <View style={Styles.order_bar_accepted3} />

                                                <View style={Styles.order_bar_packed1} />
                                                <View style={Styles.order_bar_packed2} />
                                                <View style={Styles.order_bar_packed3} />

                                                <View style={Styles.order_bar_shipped1} />
                                                <View style={Styles.order_bar_shipped2} />
                                                <View style={Styles.order_bar_shipped3} />

                                                <View style={Styles.order_bar_delevered1} /> */}
                                            </View>
                                            <View style={Styles.order_bar_main_2}>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Ordered</Text>
                                                </View>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Rejected</Text>
                                                </View>
                                                {/* <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Packed</Text>
                                                </View>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Shipped</Text>
                                                </View>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Delivered</Text>
                                                </View> */}
                                            </View>
                                        </>
                                    )
                                }
                            } else if (orderStatus.lookUpName === "DENIED") {
                                if (orderStatus.lookUpId == item.orderStatus) {
                                    return (
                                        <>
                                            <View style={[Styles.center, Styles.order_bar_main_1]}>
                                                <View style={Styles.order_bar_ordered1} />
                                                <View style={Styles.order_bar_ordered2} />
                                                <View style={[Styles.order_bar_ordered3, { backgroundColor: 'green' }]} />

                                                <View style={[Styles.order_bar_accepted1, { backgroundColor: 'green' }]} />
                                                {/* <View style={[Styles.order_bar_accepted2]} />
                                                <View style={Styles.order_bar_accepted3} />

                                                <View style={Styles.order_bar_packed1} />
                                                <View style={Styles.order_bar_packed2} />
                                                <View style={Styles.order_bar_packed3} />

                                                <View style={Styles.order_bar_shipped1} />
                                                <View style={Styles.order_bar_shipped2} />
                                                <View style={Styles.order_bar_shipped3} />

                                                <View style={Styles.order_bar_delevered1} /> */}
                                            </View>
                                            <View style={Styles.order_bar_main_2}>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Ordered</Text>
                                                </View>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Denied</Text>
                                                </View>
                                                {/* <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Packed</Text>
                                                </View>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Shipped</Text>
                                                </View>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Delivered</Text>
                                                </View> */}
                                            </View>
                                        </>
                                    )
                                }
                            } else if (orderStatus.lookUpName === "ACCEPTED") {
                                if (orderStatus.lookUpId == item.orderStatus) {
                                    return (
                                        <>
                                            <View style={[Styles.center, Styles.order_bar_main_1]}>
                                                <View style={Styles.order_bar_ordered1} />
                                                <View style={Styles.order_bar_ordered2} />
                                                <View style={[Styles.order_bar_ordered3, { backgroundColor: 'green' }]} />

                                                <View style={[Styles.order_bar_accepted1, { backgroundColor: 'green' }]} />
                                                <View style={[Styles.order_bar_accepted2, { backgroundColor: 'green' }]} />
                                                <View style={Styles.order_bar_accepted3} />

                                                <View style={Styles.order_bar_packed1} />
                                                <View style={Styles.order_bar_packed2} />
                                                <View style={Styles.order_bar_packed3} />

                                                <View style={Styles.order_bar_shipped1} />
                                                <View style={Styles.order_bar_shipped2} />
                                                <View style={Styles.order_bar_shipped3} />

                                                <View style={Styles.order_bar_delevered1} />
                                            </View>
                                            <View style={Styles.order_bar_main_2}>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Ordered</Text>
                                                </View>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Accepted</Text>
                                                </View>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Packed</Text>
                                                </View>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Shipped</Text>
                                                </View>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Delivered</Text>
                                                </View>
                                            </View>
                                        </>
                                    )
                                }
                            } else if (orderStatus.lookUpName === "PACKED") {
                                if (orderStatus.lookUpId == item.orderStatus) {
                                    return (
                                        <>
                                            <View style={[Styles.center, Styles.order_bar_main_1]}>
                                                <View style={Styles.order_bar_ordered1} />
                                                <View style={Styles.order_bar_ordered2} />
                                                <View style={[Styles.order_bar_ordered3, { backgroundColor: 'green' }]} />

                                                <View style={[Styles.order_bar_accepted1, { backgroundColor: 'green' }]} />
                                                <View style={[Styles.order_bar_accepted2, { backgroundColor: 'green' }]} />
                                                <View style={[Styles.order_bar_accepted3, { backgroundColor: 'green' }]} />

                                                <View style={[Styles.order_bar_packed1, { backgroundColor: 'green' }]} />
                                                <View style={[Styles.order_bar_packed2, { backgroundColor: 'green' }]} />
                                                <View style={Styles.order_bar_packed3} />

                                                <View style={Styles.order_bar_shipped1} />
                                                <View style={Styles.order_bar_shipped2} />
                                                <View style={Styles.order_bar_shipped3} />

                                                <View style={Styles.order_bar_delevered1} />
                                            </View>
                                            <View style={Styles.order_bar_main_2}>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Ordered</Text>
                                                </View>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Accepted</Text>
                                                </View>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Packed</Text>
                                                </View>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Shipped</Text>
                                                </View>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Delivered</Text>
                                                </View>
                                            </View>
                                        </>
                                    )
                                }
                            } else if (orderStatus.lookUpName === "SHIPPED") {
                                if (orderStatus.lookUpId == item.orderStatus) {
                                    return (
                                        <>
                                            <View style={[Styles.center, Styles.order_bar_main_1]}>
                                                <View style={Styles.order_bar_ordered1} />
                                                <View style={Styles.order_bar_ordered2} />
                                                <View style={[Styles.order_bar_ordered3, { backgroundColor: 'green' }]} />

                                                <View style={[Styles.order_bar_accepted1, { backgroundColor: 'green' }]} />
                                                <View style={[Styles.order_bar_accepted2, { backgroundColor: 'green' }]} />
                                                <View style={[Styles.order_bar_accepted3, { backgroundColor: 'green' }]} />

                                                <View style={[Styles.order_bar_packed1, { backgroundColor: 'green' }]} />
                                                <View style={[Styles.order_bar_packed2, { backgroundColor: 'green' }]} />
                                                <View style={[Styles.order_bar_packed3, { backgroundColor: 'green' }]} />

                                                <View style={[Styles.order_bar_shipped1, { backgroundColor: 'green' }]} />
                                                <View style={[Styles.order_bar_shipped2, { backgroundColor: 'green' }]} />
                                                <View style={Styles.order_bar_shipped3} />

                                                <View style={Styles.order_bar_delevered1} />
                                            </View>
                                            <View style={Styles.order_bar_main_2}>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Ordered</Text>
                                                </View>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Accepted</Text>
                                                </View>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Packed</Text>
                                                </View>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Shipped</Text>
                                                </View>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Delivered</Text>
                                                </View>
                                            </View>
                                        </>
                                    )
                                }
                            } else if (orderStatus.lookUpName === "DELIVERED" || orderStatus.lookUpName === "RECEIVED") {
                                if (orderStatus.lookUpId == item.orderStatus) {
                                    return (
                                        <>
                                            <View style={[Styles.center, Styles.order_bar_main_1]}>
                                                <View style={Styles.order_bar_ordered1} />
                                                <View style={Styles.order_bar_ordered2} />
                                                <View style={[Styles.order_bar_ordered3, { backgroundColor: 'green' }]} />

                                                <View style={[Styles.order_bar_accepted1, { backgroundColor: 'green' }]} />
                                                <View style={[Styles.order_bar_accepted2, { backgroundColor: 'green' }]} />
                                                <View style={[Styles.order_bar_accepted3, { backgroundColor: 'green' }]} />

                                                <View style={[Styles.order_bar_packed1, { backgroundColor: 'green' }]} />
                                                <View style={[Styles.order_bar_packed2, { backgroundColor: 'green' }]} />
                                                <View style={[Styles.order_bar_packed3, { backgroundColor: 'green' }]} />

                                                <View style={[Styles.order_bar_shipped1, { backgroundColor: 'green' }]} />
                                                <View style={[Styles.order_bar_shipped2, { backgroundColor: 'green' }]} />
                                                <View style={[Styles.order_bar_shipped3, { backgroundColor: 'green' }]} />

                                                <View style={[Styles.order_bar_delevered1, { backgroundColor: 'green' }]} />
                                            </View>
                                            <View style={Styles.order_bar_main_2}>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Ordered</Text>
                                                </View>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Accepted</Text>
                                                </View>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Packed</Text>
                                                </View>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Shipped</Text>
                                                </View>
                                                <View style={[Styles.order_bar_ordered_text_box]}>
                                                    <Text style={[Styles.order_bar_ordered_text]}>Delivered</Text>
                                                </View>
                                            </View>
                                        </>
                                    )
                                }
                            }
                        }) : null}
                    </View>
                    {null != this.state.orderstatusData ? this.state.orderstatusData.map((orderStatus, oIndex) => {
                        if (orderStatus.lookUpName === "SHIPPED" || orderStatus.lookUpName === "DELIVERED") {
                            if (orderStatus.lookUpId == item.orderStatus) {
                                return (
                                    <>
                                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>OTP</Text>
                                        <Text style={{ marginVertical: 5, fontWeight: 'bold', fontSize: 16 }}> {item.otp}</Text>

                                        {null != this.state.deliveryTypeData ? this.state.deliveryTypeData.map((deliveryType, dIndex) => {
                                            if (deliveryType.lookUpName === "BY_DELIVERY_BOY") {
                                                if (deliveryType.lookUpId == item.deliveryType) {
                                                    // Alert.alert('Hi' )
                                                    return (
                                                        <>
                                                            <View style={{ backgroundColor: '#fff', borderColor: Color.BORDER, borderWidth: 0.5, padding: 20, marginBottom: 10 }}>
                                                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Delivery charge</Text>
                                                                <Text style={{ marginVertical: 5, fontWeight: 'bold', fontSize: 16 }}>Rs. {item.deliveryCharge}</Text>
                                                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Delivery boy detail</Text>
                                                                <Text style={{ marginVertical: 5 }}>{item.dBoyName}, {item.dBoyNumber}</Text>
                                                                <Text style={{ marginVertical: 5 }}>Expected Time for delivery: <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{moment(item.deliveryDate).format('DD-MM-YYYY')}</Text> up to <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{moment(item.deliveryDate).format('hh:mm a')}</Text></Text>
                                                            </View>
                                                        </>
                                                    )
                                                }
                                            } else if (deliveryType.lookUpName === "SELF_DELIVERY") {
                                                if (deliveryType.lookUpId == item.deliveryType) {
                                                    // Alert.alert('Hi' )
                                                    return (
                                                        <>
                                                            <View style={{ backgroundColor: '#fff', borderColor: Color.BORDER, borderWidth: 0.5, padding: 20, marginBottom: 10 }}>
                                                                <Text style={{ marginVertical: 5, fontSize: 18, fontWeight: 'bold' }}>Scheduled Time to pick up: </Text>
                                                                <Text style={{ marginVertical: 5 }}> <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{moment(item.deliveryDate).format('DD-MM-YYYY')} </Text>after <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{moment(item.deliveryDate).format('hh:mm a')}</Text></Text>
                                                            </View>
                                                        </>
                                                    )
                                                }
                                            } else if (deliveryType.lookUpName === "COURIER") {
                                                if (deliveryType.lookUpId == item.deliveryType) {
                                                    // Alert.alert('Hi' )
                                                    return (
                                                        <>
                                                            <View style={{ backgroundColor: '#fff', borderColor: Color.BORDER, borderWidth: 0.5, padding: 20, marginBottom: 10 }}>
                                                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Shipping charge</Text>
                                                                <Text style={{ marginVertical: 5, fontWeight: 'bold', fontSize: 16 }}>Rs. {item.deliveryCharge}</Text>
                                                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Shipping company detail</Text>
                                                                <Text style={{ marginVertical: 5 }}>{item.courierName}, Tracking ID: {item.shippingId}</Text>
                                                                <Text style={{ marginVertical: 5 }}>Shipping date and time: <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{moment(item.shippingDate).format('DD-MM-YYYY hh:mm a')}</Text></Text>
                                                            </View>
                                                        </>
                                                    )
                                                }
                                            }
                                        }
                                        ) : null}
                                    </>
                                )
                            }
                        }
                    }
                    )
                        : null}
                    {null != this.state.orderstatusData ? this.state.orderstatusData.map((orderStatus, oIndex) => {
                        if (orderStatus.lookUpName === "DELIVERED") {
                            if (orderStatus.lookUpId == item.orderStatus) {
                                return (
                                    <>
                                        <View style={{ backgroundColor: '#fff', borderColor: Color.BORDER, borderWidth: 0.5, padding: 20, marginBottom: 10 }}>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Do you want to write your review?</Text>
                                            <View style={Styles.cart_bottom_box_view}>
                                                <View>
                                                    <TouchableOpacity style={[Styles.cart_bottom_box_button, Styles.center]} onPress={() => { this.toggleModal('RECEIVED', item.cartId) }}>
                                                        <Text style={{ paddingVertical: 10, paddingHorizontal: 20, color: Color.BUTTON_NAME_COLOR }}>Yes</Text>
                                                    </TouchableOpacity>
                                                </View>

                                                {/* <View>
                                                    <TouchableOpacity style={[Styles.cart_bottom_box_button, Styles.center]} onPress={() => { this.toggleModal('DENIED', item.cartId) }}>
                                                        <Text style={{ paddingVertical: 10, paddingHorizontal: 20, color: Color.BUTTON_NAME_COLOR }}>No</Text>
                                                    </TouchableOpacity>
                                                </View> */}
                                            </View>
                                            {/* <Text style={{ marginVertical: 5, fontWeight: 'bold', fontSize: 16 }}>Rs. {item.deliveryCharge}</Text>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Delivery boy detail</Text>
                                            <Text style={{ marginVertical: 5 }}>{item.dBoyName}, {item.dBoyNumber}</Text>
                                            <Text style={{ marginVertical: 5 }}>Expected Time for delivery: <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{moment(item.deliveryDate).format('DD-MM-YYYY')}</Text> up to <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{moment(item.deliveryDate).format('hh:mm a')}</Text></Text> */}
                                        </View>
                                    </>
                                )
                            }
                        } else if (orderStatus.lookUpName === "DENIED" || orderStatus.lookUpName === "RECEIVED") {
                            if (orderStatus.lookUpId == item.orderStatus) {
                                return (
                                    <>
                                        <View style={{ backgroundColor: '#fff', borderColor: Color.BORDER, borderWidth: 0.5, padding: 20, marginBottom: 10 }}>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{orderStatus.lookUpName === "DENIED" ? 'Remarks' : orderStatus.lookUpName === "RECEIVED" ? 'Review' : null}</Text>

                                            {/* <Text style={{ marginVertical: 5, fontWeight: 'bold', fontSize: 16 }}>Rs. {item.deliveryCharge}</Text>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Delivery boy detail</Text> */}
                                            <Text style={{ marginVertical: 5 }}>{item.review}</Text>
                                            {/* <Text style={{ marginVertical: 5 }}>Expected Time for delivery: <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{moment(item.deliveryDate).format('DD-MM-YYYY')}</Text> up to <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{moment(item.deliveryDate).format('hh:mm a')}</Text></Text> */}
                                        </View>
                                    </>
                                )
                            }
                        }
                    }
                    )
                        : null}
                </View> : null}
        </ListItem>
    )

    NavigateToHome() {
        this.props.navigation.navigate(AppRoute.CUSTOMER_HOME)
    }

    render() {
        const { cartData, isDetail } = this.state
        return (
            <SafeAreaLayout
                style={Styles.safeArea}
                insets={SaveAreaInset.TOP}>
                <Toolbar
                    title='My Order'
                    backIcon={BackIcon}
                    onBackPress={() => this.NavigateToHome()}
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

                    <Divider />
                    <View style={Styles.order_main}>
                        <Text style={Styles.order_text}>Orders</Text>
                        <List data={cartData.slice(0).reverse()}
                            renderItem={this.renderCart}
                        />
                    </View>

                    {/* <View>
                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.FIRST_NAME}</Text>
                            </View>
                            <View style={Styles.user_detail_data}>
                                <TextInput editable={isEditable} style={Styles.cash_pay_input} placeholder={LableText.FIRST_NAME} />
                            </View>
                        </View>

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.LAST_NAME}</Text>
                            </View>
                            <View style={Styles.user_detail_data}>
                                <TextInput editable={isEditable} style={Styles.cash_pay_input} placeholder={LableText.LAST_NAME} />
                            </View>
                        </View>

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.FATHER_NAME}</Text>
                            </View>
                            <View style={Styles.user_detail_data}>
                                <TextInput editable={isEditable} style={Styles.cash_pay_input} placeholder={LableText.FATHER_NAME} />
                            </View>
                        </View>

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.PHONE}</Text>
                            </View>
                            <View style={Styles.user_detail_data}>
                                <TextInput editable={isEditable} style={Styles.cash_pay_input} placeholder={LableText.PHONE} />
                            </View>
                        </View>

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.EMAIL_ID}</Text>
                            </View>
                            <View style={Styles.user_detail_data}>
                                <TextInput editable={isEditable} style={Styles.cash_pay_input} placeholder={LableText.EMAIL_ID} />
                            </View>
                        </View>

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.STREET}</Text>
                            </View>
                            <View style={Styles.user_detail_data}>
                                <TextInput editable={isEditable} style={Styles.cash_pay_input} placeholder={LableText.STREET} />
                            </View>
                        </View>

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.LAND_MARK}</Text>
                            </View>
                            <View style={Styles.user_detail_data}>
                                <TextInput editable={isEditable} style={Styles.cash_pay_input} placeholder={LableText.LAND_MARK} />
                            </View>
                        </View>

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.VILLAGE}</Text>
                            </View>
                            <View style={Styles.user_detail_data}>
                                <TextInput editable={isEditable} style={Styles.cash_pay_input} placeholder={LableText.VILLAGE} />
                            </View>
                        </View>

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.POST_OFFICE}</Text>
                            </View>
                            <View style={Styles.user_detail_data}>
                                <TextInput editable={isEditable} style={Styles.cash_pay_input} placeholder={LableText.POST_OFFICE} />
                            </View>
                        </View>

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.POLICE_STATION}</Text>
                            </View>
                            <View style={Styles.user_detail_data}>
                                <TextInput editable={isEditable} style={Styles.cash_pay_input} placeholder={LableText.POLICE_STATION} />
                            </View>
                        </View>

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.DISTRICT}</Text>
                            </View>
                            <View style={Styles.user_detail_data}>
                                <TextInput editable={isEditable} style={Styles.cash_pay_input} placeholder={LableText.DISTRICT} />
                            </View>
                        </View>

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.PIN_CODE}</Text>
                            </View>
                            <View style={Styles.user_detail_data}>
                                <TextInput editable={isEditable} style={Styles.cash_pay_input} placeholder={LableText.PIN_CODE} />
                            </View>
                        </View>

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.STATE}</Text>
                            </View>
                            <View style={Styles.user_detail_data}>
                                <TextInput editable={isEditable} style={Styles.cash_pay_input} placeholder={LableText.STATE} />
                            </View>
                        </View> */}








                    {/* 
                    <View style={{ marginHorizontal: '10%' }}>
                        <TouchableOpacity style={[Styles.buttonBox, Styles.center]} onPress={() => { }}>
                            <Text style={Styles.buttonName}>{LableText.EDIT}</Text>
                        </TouchableOpacity>
                        </View> */}

                    {/* 
                    <View style={{ marginHorizontal: '10%' }}>
                        <TouchableOpacity style={[Styles.buttonBox, Styles.center]} onPress={() => { }}>
                            <Text style={Styles.buttonName}>{LableText.SAVE}</Text>
                        </TouchableOpacity>
                    </View>
                     */}

                    <View style={Styles.bottomSpace}></View>
                </Content>

            </SafeAreaLayout>
        );
    }

}