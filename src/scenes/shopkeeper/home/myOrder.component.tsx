import { Content } from "native-base";
import React, { Component } from "react";
import { RefreshControl, View, Text, TouchableOpacity, TextInput, AsyncStorage, Alert } from "react-native";
import { Divider, ThemedComponentProps, Avatar, ListItem, ListItemElement, List } from "react-native-ui-kitten";
import { MyOrderScreenProps } from "../../../navigation/shopKeeperNavigator/order.navigator";
import { SafeAreaLayout } from "../../../components/safe-area-layout.component";
import { Toolbar } from "../../../components/toolbar.component";
import { Styles } from "../../../assets/styles";
import { Color, Contents, LableText } from '../../../constants/LabelConstants';
import { SearchIcon, MinusIcon, RupeeIcon, PlusCircle, BackIcon, CancelIcon, PlusIcon, AddIcon, RightArrowIcon } from '../../../assets/icons';
import { AppConstants } from "../../../constants";
import Axios from "axios";
import Modal from "react-native-modal";
import { AppRoute } from "../../../navigation/app-routes";
import { Notification } from "../../../components/notification";
import { scale } from "react-native-size-matters";

export class MyOrderScreen extends Component<MyOrderScreenProps, ThemedComponentProps & any> {
    constructor(props) {
        super(props);
        this.state = {
            cartData: [],
            userData: [],
            modalVisible: false,
            description: '',
            orderstatusData: [],
            customerType: '',
            rejectcartId: ''
        }
    }
    async componentDidMount() {
        let userDetail = await AsyncStorage.getItem('userDetail');
        let userData = JSON.parse(userDetail);
        let customerType = await AsyncStorage.getItem('customerType');
        console.log('userType', customerType)
        this.setState({
            userData: userData,
            customerType: customerType
        })

        if (null != userData) {
            Axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/cart/get/byshopId/' + userData.shopId,
            }).then((response) => {
                if (null != response.data) {
                    this.setState({
                        cartData: response.data
                    })
                }
            }, (error) => {
                Alert.alert("Wait for a moment.")
            });

            Axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/lookup/getallorderstatus',
            }).then((response) => {
                if (null != response.data) {
                    console.log(response.data);
                    this.setState({
                        orderstatusData: response.data
                    })
                }
            }, (error) => {
                Alert.alert("Wait for a moment.")
            });
        }
    }

    handleOrderStatus(orderStatus, cartId, userId) {
        const { userData, rejectcartId, description } = this.state;
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
                // Alert.alert("" + rejectcartId)
                Axios({
                    method: 'POST',
                    url: AppConstants.API_BASE_URL + '/api/cart/order/reject',
                    data: {
                        cartId: rejectcartId,
                        shopId: userData.shopId,
                        description: description
                    }
                }).then((response) => {
                    if (null != response.data) {
                        Notification(userId, 2, Contents.REJECT_ORDER, 'You rejected this order');
                        this._onRefresh();
                        this.toggleModal();
                    }
                }, (error) => {
                    Alert.alert("Wait for a moment.")
                });
                break;
            default:
                Alert.alert("Cart ID not found.");
                break;
        }
    }

    handleCartSubmit(cartId) {
        // Alert.alert(''+cartId)
        this.props.navigation.navigate(AppRoute.MY_ORDER_DETAIL, { cartId: String(cartId) })
    }

    toggleModal() {
        const { modalVisible } = this.state;
        this.setState({ modalVisible: !modalVisible })
    }

    toggleReject(cartId) {
        const { modalVisible } = this.state;
        this.setState({ modalVisible: !modalVisible, rejectcartId: cartId })
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });
    }

    renderCart = ({ item, index }: any): ListItemElement => (
        <ListItem style={{ borderBottomColor: 'rgba(2,15,20,0.10)', borderBottomWidth: 1 }}>
            {item != null ?
                <View>
                    <View style={Styles.customer_list}>

                        <View style={[Styles.order_list_image, Styles.center]}>
                            <TouchableOpacity onPress={() => { this.handleCartSubmit(item.cartId) }}>
                                <Avatar source={{ uri: AppConstants.IMAGE_BASE_URL + '/avatar/' + item.userId + '_' + this.state.customerType + '_avatar.png' }} style={Styles.order_image} />
                            </TouchableOpacity>
                        </View>

                        <View style={Styles.list_name}>
                            <View style={[Styles.list_price, { width: '96%' }]}>
                                <View style={{ width: '55%', flexDirection: 'row', flexWrap: 'wrap' }}>
                                    <Text style={Styles.customer_list_name_text}>{item.userName}</Text>
                                </View>
                                {null != this.state.orderstatusData ? this.state.orderstatusData.map((orderStatus, oIndex) => {
                                    if (orderStatus.lookUpName === "PLACED") {
                                        // Alert.alert(''+ item.orderStatus)
                                        if (orderStatus.lookUpId == item.orderStatus) {
                                            return (
                                                // <View style={{ width: '45%', flexWrap: 'wrap' }}>
                                                    <Text onPress={() => { this.handleOrderStatus('ACCEPT', item.cartId, item.userId) }} style={Styles.order_button_text}>{LableText.ACCEPT}</Text>
                                                // </View>
                                            )
                                        }
                                    }
                                }) : null}
                            </View>

                            <View style={[Styles.list_price, { width: '96%', }]}>
                                <View style={{ width: '55%', flexDirection: 'column', flexWrap: 'wrap' }}>
                                    <Text style={Styles.customer_list_price_text}>{item.mobileNo}</Text>
                                    <Text style={Styles.customer_list_price_text}>Rs: {item.payableAmount}</Text>
                                </View>
                                {/* <View style={{ width: '45%', flexWrap: 'wrap', alignItems: 'flex-end' }}> */}
                                {null != this.state.orderstatusData ? this.state.orderstatusData.map((orderStatus, oIndex) => {
                                    if (orderStatus.lookUpName === "PLACED") {
                                        if (orderStatus.lookUpId == item.orderStatus) {
                                            return (
                                                <Text onPress={() => { this.toggleReject(item.cartId) }} style={Styles.order_button_text}>{LableText.REJECT}</Text>
                                            )
                                        }
                                    } else if (orderStatus.lookUpName === "REJECTED") {
                                        if (orderStatus.lookUpId == item.orderStatus) {
                                            return (
                                                <Text style={Styles.order_button_text}>Rejected</Text>
                                            )
                                        }
                                    } else if (orderStatus.lookUpName === "ACCEPTED") {
                                        if (orderStatus.lookUpId == item.orderStatus) {
                                            return (
                                                <Text style={Styles.order_button_text}>Accepted</Text>
                                            )
                                        }
                                    } else if (orderStatus.lookUpName === "PACKED") {
                                        if (orderStatus.lookUpId == item.orderStatus) {
                                            return (
                                                <Text style={Styles.order_button_text}>Packed</Text>
                                            )
                                        }
                                    } else if (orderStatus.lookUpName === "SHIPPED") {
                                        if (orderStatus.lookUpId == item.orderStatus) {
                                            return (
                                                <Text style={Styles.order_button_text}>Shipped</Text>
                                            )
                                        }
                                    } else if (orderStatus.lookUpName === "DELIVERED") {
                                        if (orderStatus.lookUpId == item.orderStatus) {
                                            return (
                                                <Text style={Styles.order_button_text}>Delivered</Text>
                                            )
                                        }
                                    } else if (orderStatus.lookUpName === "RECEIVED") {
                                        if (orderStatus.lookUpId == item.orderStatus) {
                                            return (
                                                <Text style={Styles.order_button_text}>Received</Text>
                                            )
                                        }
                                    } else if (orderStatus.lookUpName === "DENIED") {
                                        if (orderStatus.lookUpId == item.orderStatus) {
                                            return (
                                                <Text style={Styles.order_button_text}>Denied</Text>
                                            )
                                        }
                                    }
                                }) : null}
                                {/* </View> */}

                            </View>
                            <View style={[{ justifyContent: 'flex-start' }]}>
                                <Text style={[{ backgroundColor: '#501B1D', alignSelf: 'flex-start', color: '#fff', borderRadius: scale(5), paddingVertical: scale(3), paddingHorizontal: scale(5) }]} onPress={() => { this.handleCartSubmit(item.cartId) }} >Get Detail</Text>
                            </View>
                        </View>
                    </View>
                    <Modal style={Styles.modal} isVisible={this.state.modalVisible}>
                        <View style={Styles.modalHeader}>
                            <TouchableOpacity>
                                <Text onPress={() => { this.toggleModal() }}><CancelIcon fontSize={25} /></Text>
                            </TouchableOpacity>
                        </View>
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
                                <Text onPress={() => { this.handleOrderStatus('REJECT', item.cartId, item.userId) }} style={Styles.order_button_text}>{LableText.SUBMIT}</Text>
                            </View>
                        </View>
                    </Modal>
                </View> : null}
        </ListItem>
    )

    render() {
        const { cartData } = this.state
        return (
            <SafeAreaLayout
                style={Styles.safeArea} >

                <Toolbar
                    title='My Order'
                    backIcon={BackIcon}
                    onBackPress={this.props.navigation.goBack}
                    style={{ marginTop: -5, marginLeft: -5 }}
                />
                <Divider />
                <Content style={Styles.customer_content}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                >

                    <List data={cartData.slice(0).reverse()}
                        renderItem={this.renderCart}
                    />
                    <View style={{ height: 10, width: '100%' }}></View>

                </Content>
            </SafeAreaLayout>
        )
    }

}