import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/core';
import { Avatar, Divider, List, ListItem, ListItemElement, ThemedComponentProps } from '@ui-kitten/components';
import axios from 'axios';
import React from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { scale } from 'react-native-size-matters';

import { AddIcon, BackIcon, CancelIcon, MinusIcon, RightArrowIcon, RupeeIcon } from '../../../assets/icons';
import { Styles } from '../../../assets/styles';
import { CartProduct } from '../../../components/cartProduct';
import { SafeAreaLayout, SaveAreaInset } from '../../../components/safe-area-layout.component';
import { Toolbar } from '../../../components/toolbar.component';
import { Color } from '../../../constants';
import { AppConstants } from '../../../constants/AppConstants';
import { AppRoute } from '../../../navigation/app-routes';
import { CartScreenProps } from '../../../navigation/customer-navigator/cart-navigation/cart.navigator';
import { Brand } from '../../../redux/modules/brand.modules';

// import { CartScreenProps } from '../../../navigation/cart-navigation/cart.navigator';
// import { CartNavigatorProp } from '../../../navigation/customer-navigator/customer.navigator';
interface CartPageProps {
}

interface CartPageState {
    name: String,
    allBrand: Brand[],
    refreshing: Boolean
}

type Props = CartScreenProps & ThemedComponentProps & CartPageProps

var SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;


export class CartScreen extends React.Component<Props, CartPageState & any> {
    constructor(props: Props) {
        super(props)
        this.state = {
            cartData: [],
            productList: [],
            shopId: AppConstants.SHOP_ID,
            cartId: '',
            addressData: [],
            single: false,
            shopName: '',
            outOfStock: false,
            isModalVisible: false,
            selectedCartId: '',
            insideShop: false,
            content: {},
            allMeasurement: [],
            check: true
        }
        this._onRefresh = this._onRefresh.bind(this);
        this.navigationProductDetail = this.navigationProductDetail.bind(this);
    }



    async componentDidMount() {
        SCREEN_WIDTH = Dimensions.get('window').width;
        let userDetail = await AsyncStorage.getItem('userDetail');
        let logedIn = await AsyncStorage.getItem('logedIn');
        const shopId = await AsyncStorage.getItem('shopId');
        const shopName = await AsyncStorage.getItem('shopName')

        let userData = JSON.parse(userDetail);

        if (null != logedIn && logedIn === 'true') {
            // Alert.alert("" + userData.userId) 
            this.getMeasurement()
            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/cart/get/cartby/shopid/userid/' + AppConstants.SHOP_ID + '/' + userData.userId
            }).then((response) => {
                if (null != response.data) {
                    this.setState({
                        cartData: response.data[0],
                        cartId: response.data[0].cartId,
                        productList: response.data[0].productList,
                        check: true
                    })
                }
            }, (error) => {
                // Alert.alert("Wait for a moment.")
            });
        } else {
            this.props.navigation.navigate(AppRoute.AUTH)
        }
    }
    getMeasurement() {
        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/measurement/getbyshopid/' + AppConstants.SHOP_ID
        }).then((response: any) => {
            if (null != response.data) {
                this.setState({
                    allMeasurement: response.data
                })
            }
        }, (error: any) => {
            console.log(error)
        });
    }
    _onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });
    }

    handleIncrease(productId, cartId, quantity, stock) {
        const { user, check } = this.state
        if (check) {
            this.setState({ check: false })
            if (quantity >= stock) {
                this.setState({ check: true })
                Alert.alert(`Only ${stock} product left.`)
            } else {
                axios({
                    method: 'PUT',
                    url: AppConstants.API_BASE_URL + '/api/cart/cartincrease/' + cartId + '/' + productId
                }).then((response) => {
                    this._onRefresh();
                    // this.getCart(user.userId)
                }, (error) => {
                    this.setState({ check: true })
                    Alert.alert("Wait for a moment.")
                })
            }
        }
    }

    handleDecrease(productId, cartId, quantity) {
        const { check } = this.state;
        if (check) {
            this.setState({ check: false })
            if (quantity <= 1) {
                this.setState({ check: true })
                Alert.alert("You have already selected minimum quantity.")
            } else {
                axios({
                    method: 'PUT',
                    url: AppConstants.API_BASE_URL + '/api/cart/cartdecrease/' + cartId + '/' + productId
                }).then((response) => {
                    this._onRefresh();
                }, (error) => {
                    this.setState({ check: true })
                    Alert.alert("Wait for a moment.")
                })
            }
        }
    }

    handleDelete(id) {
        axios({
            method: 'DELETE',
            url: AppConstants.API_BASE_URL + '/api/productlist/delete/' + id
        }).then((response) => {
            this._onRefresh();
        }, (error) => {
            Alert.alert("Wait for a moment.")
        })
    }

    handlePlaceOrder(cartId) {
        const { insideShop, selectedCartId } = this.state;
        // console.log('hjhjhj', String(insideShop));

        // if (cartData) {
        //     cartData[index].productList.map((cart, index) => {
        //         if (cart) {
        //             if (cart.productQuantity > cart.currentStock) {

        // this.setState({
        //     outOfStock: true
        // })
        //     Alert.alert("It seems any product is out of stock"+cart.productQuantity + " " + cart.currentStock);
        // } else {
        //     Alert.alert(''+cart.productQuantity + " " + cart.currentStock)
        // this.toggleModal()
        const pushAction = StackActions.push(AppRoute.PAYMENT, { cartId: String(cartId), insideShop: false })
        this.props.navigation.dispatch(pushAction);
    }

    handleCartId(cartId) {
        this.setState({
            isModalVisible: true,
            selectedCartId: cartId
        })
    }

    renderCart = ({ item }: any): ListItemElement => (
        <ListItem style={{ borderBottomColor: Color.BORDER, borderBottomWidth: 1 }}>
            {item != null ?
                <View style={{ paddingBottom: scale(20) }}>
                    <CartProduct
                        handleDelete={(id) => { this.handleDelete(id) }}
                        measurement={this.state.allMeasurement.length > 0 ? this.state.allMeasurement.find((data, index) => data.id == item.measurement).name : null}
                        handleIncrease={(productId, cartId, productQuantity) => { this.handleIncrease(productId, cartId, productQuantity, item.currentStock) }}
                        handleDecrease={(productId, cartId, productQuantity) => { this.handleDecrease(productId, cartId, productQuantity) }}
                        item={item}
                    />
                </View>
                :
                <ActivityIndicator size='large' color='green' />}
        </ListItem>
    )

    renderCombinedCart = ({ item, index }: any): ListItemElement => (
        <>
            {item != null && item.productList ?
                <ListItem style={{ margin: 10, borderColor: '#501B1D', borderWidth: 1, flexDirection: 'column' }}>
                    {item != null && item.productList ?
                        <>
                            <View>
                                <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#501B1D' }}>{item.shopName}</Text>
                            </View>
                            <List data={item.productList ? item.productList.slice(0).reverse() : null}
                                renderItem={this.renderCart}
                            />

                            <View style={[Styles.price_detail_1, { width: '100%' }]}>
                                <Text style={Styles.cart_price_detail_1_text}>PRICE DETAILS</Text>

                                <View style={Styles.price_detail_2}>
                                    <View style={Styles.price_detail_2_1}>
                                        <Text style={Styles.cart_price_text_head}>Price ({null != item.productList ? item.productList.length : null} items)</Text>
                                        <Text style={Styles.cart_price_text_head}><RupeeIcon fontSize={18} />{item.totalAmount ? (item.price).toFixed(2) : null}</Text>
                                    </View>

                                    <View style={Styles.price_detail_2_1}>
                                        <Text style={Styles.cart_price_text_head}>Discount</Text>
                                        <Text style={Styles.cart_price_text_data}> - <RupeeIcon fontSize={18} />{null != item ? item.discount.toFixed(2) : null}</Text>
                                    </View>

                                    <View style={Styles.price_detail_2_1}>
                                        <Text style={Styles.cart_price_text_head}>GST Amount</Text>
                                        <Text style={Styles.cart_price_text_data}>{item.gstAmount ? item.gstAmount.toFixed(2) : null}</Text>
                                    </View>

                                    {/* <View style={Styles.price_detail_2_1}>
                                        <Text style={Styles.cart_price_text_head}>Delevery Charges</Text>
                                        <Text style={Styles.cart_price_text_head}><RupeeIcon fontSize={18} />{item.deliveryCharge ? item.deliveryCharge.toFixed(2) : null}</Text>
                                    </View> */}
                                </View>

                                <View style={Styles.cart_total_view}>
                                    <Text style={Styles.cart_total_text_head}>Total Amount</Text>
                                    <Text style={Styles.cart_total_text_head}><RupeeIcon fontSize={18} />{null != item ? item.payableAmount : null}</Text>
                                </View>
                                <View style={Styles.price_detail_2}>
                                    <Text style={Styles.cart_price_text_data}>You will save <RupeeIcon fontSize={18} />{null != item ? item.discount.toFixed(2) : null} on this order.</Text>
                                </View>
                            </View>

                            <View style={Styles.cart_bottom_box_view}>
                                <View style={{ justifyContent: 'center', margin: 10 }}>
                                    <Text style={Styles.cart_bottom_box_price_text}><RupeeIcon fontSize={25} />{null != item ? item.payableAmount : null}</Text>
                                    <TouchableOpacity onPress={() => { }}>
                                        {/* <Text style={Styles.cart_price_text_data}>View price details</Text> */}
                                    </TouchableOpacity>
                                </View>

                                <View style={{ justifyContent: 'center', margin: 10 }}>
                                    <TouchableOpacity style={[Styles.cart_bottom_box_button, Styles.center]} onPress={() => { this.handleCartId(item.cartId) }}>
                                        <Text style={Styles.cart_bottom_box_button_text}>Place Order</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </>
                        :
                        null}

                </ListItem> : null}
        </>
    )


    navigationItemList() {
        // this.props.navigation.navigate(AppRoute.ITEMLIST)
    }

    navigationProductDetail() {
        this.props.navigation.navigate(AppRoute.PRODUCT_DETAIL)
    }

    continiueShopping() {
        const { single } = this.state;
        this.props.navigation.navigate(AppRoute.PRODUCT_LIST)
    }

    addItem() { }

    toggleModal() {
        const { isModalVisible } = this.state;
        this.setState({ isModalVisible: !isModalVisible })
    }

    render() {
        const { cartData, insideShop, shopName, isModalVisible, single, addressData, productList } = this.state
        return (
            <SafeAreaLayout
                style={Styles.safeArea}
                insets={SaveAreaInset.TOP}>
                <Toolbar
                    title='Shop Cart'
                    backIcon={BackIcon}
                    onBackPress={this.props.navigation.goBack}
                    // onRightPress={() => { this.continiueShopping() }}
                    // menuIcon={PlusCircle}
                    style={{ marginTop: -5, marginLeft: -5 }}
                />
                <Divider />

                {/* <Modal style={Styles.modal} isVisible={isModalVisible}>
                    <View style={Styles.modalHeader}>
                        <TouchableOpacity>
                            <Text onPress={() => { this.toggleModal() }}><CancelIcon fontSize={25} /></Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[Styles.center]}>
                        <View style={[Styles.payment_box_view]}>
                            <Text style={Styles.payment_selection_header}>Are you inside the Mart/Shop?</Text>
                            <View style={[Styles.payment_selection_view, { justifyContent: 'space-between' }]}>
                                <View style={{ flexDirection: 'row', marginRight: scale(20) }}>
                                    <Radio selectedColor='#501B1D' selected={insideShop} onPress={() => { this.setState({ insideShop: true }) }} />
                                    <Text style={Styles.payment_selection_text}>Yes</Text>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <Radio selectedColor='#501B1D' selected={!insideShop} onPress={() => { this.setState({ insideShop: false }) }} />
                                    <Text style={Styles.payment_selection_text}>No</Text>
                                </View>
                            </View>
                            <View style={Styles.inside_shop_button_box}>
                                <Text onPress={() => { this.handlePlaceOrder() }} style={Styles.inside_shop_button_text}>{LableText.NEXT}</Text>
                            </View>
                        </View>
                    </View>
                </Modal> */}

                <ScrollView
                    nestedScrollEnabled={true}
                    style={Styles.cart_content}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                >
                    {/* <Header style={styles.header}> */}
                    {/* <View style={Styles.searchBox}>
                        <Text style={Styles.searchIcon}><SearchIcon /></Text>
                        <TextInput
                            placeholder="Search"
                            style={Styles.searchInput}
                        />
                    </View> */}

                    {/* <View style={{ backgroundColor: '#fff', borderColor: Color.BORDER, borderWidth: 0.5, padding: 20, marginBottom: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Address</Text>
                        {null != addressData ?
                            <Text style={{ marginVertical: 5 }}>{addressData.city}, {addressData.landmark}, {addressData.district}, {addressData.state}, {addressData.pinCode}</Text>
                            : null}
                        <View style={{ width: '100%', alignItems: 'flex-end' }}>
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate(AppRoute.CUSTOMER_ADDRESS) }} style={[Styles.center, { paddingVertical: 10, width: 100, borderRadius: 5, backgroundColor: Color.COLOR }]}>
                                <Text style={{ color: Color.BUTTON_NAME_COLOR }}>Change</Text>
                            </TouchableOpacity>
                        </View>
                    </View> */}
                    <>
                        <List
                            nestedScrollEnabled={true}
                            data={productList ? productList.slice(0).reverse() : null}
                            renderItem={this.renderCart}
                        />

                        <TouchableOpacity style={Styles.cart_shopping_view} onPress={() => { this.continiueShopping() }}>
                            <Text style={Styles.cart_shopping_text}>Continue Shopping</Text>
                            <Text style={Styles.cart_shopping_text}><RightArrowIcon fontSize={20} /></Text>
                        </TouchableOpacity>

                        <View style={Styles.price_detail_1}>
                            <Text style={Styles.cart_price_detail_1_text}>PRICE DETAILS</Text>

                            <View style={Styles.price_detail_2}>
                                <View style={Styles.price_detail_2_1}>
                                    <Text style={Styles.cart_price_text_head}>Total ({null != productList ? productList.length : null} items)</Text>
                                    <Text style={[Styles.cart_price_text_head, { textDecorationLine: 'line-through' }]}><RupeeIcon fontSize={18} />{null != cartData.mrp ? (cartData.mrp).toFixed(2) : null}</Text>
                                </View>

                                <View style={Styles.price_detail_2_1}>
                                    <Text style={Styles.cart_price_text_head}>Price</Text>
                                    <Text style={Styles.cart_price_text_head}><RupeeIcon fontSize={18} />{null != cartData.totalAmount ? (cartData.totalAmount).toFixed(2) : null}</Text>
                                </View>

                                <View style={Styles.price_detail_2_1}>
                                    <Text style={Styles.cart_price_text_head}>Discount</Text>
                                    <Text style={Styles.cart_price_text_data}>-<RupeeIcon fontSize={18} />{null != cartData.discount ? cartData.discount.toFixed(2) : null}</Text>
                                </View>

                                <View style={Styles.price_detail_2_1}>
                                    <Text style={Styles.cart_price_text_head}>GST Amount</Text>
                                    <Text style={Styles.cart_price_text_head}><RupeeIcon fontSize={18} />{null != cartData.gstAmount ? (cartData.gstAmount).toFixed(2) : null}</Text>
                                </View>

                                <View style={Styles.price_detail_2_1}>
                                    <Text style={Styles.cart_price_text_head}>Delevery Charge</Text>
                                    <Text style={Styles.cart_price_text_head}><RupeeIcon fontSize={18} />{cartData.deliveryCharge ? cartData.deliveryCharge.toFixed(2) : 0}</Text>
                                </View>
                            </View>

                            <View style={Styles.cart_total_view}>
                                <Text style={Styles.cart_total_text_head}>Total Amount</Text>
                                <Text style={Styles.cart_total_text_head}><RupeeIcon fontSize={18} />{null != cartData.payableAmount ? cartData.payableAmount : null}</Text>
                            </View>
                            <View style={Styles.price_detail_2}>
                                <Text style={Styles.cart_price_text_data}>You will save <RupeeIcon fontSize={18} />{null != cartData.discount ? cartData.discount.toFixed(2) : null} on this order.</Text>
                                <Text style={Styles.cart_price_text_data}>Purchase above <RupeeIcon fontSize={18} />499 and get free delivery on every order.</Text>
                            </View>
                        </View>
                    </>
                    <View style={{ height: 10, width: '100%' }} />
                </ScrollView>
                <>
                    <View style={Styles.cart_bottom_box_view}>
                        <View>
                            <Text style={Styles.cart_bottom_box_price_text}><RupeeIcon fontSize={25} />{null != cartData ? cartData.payableAmount : null}</Text>
                            <TouchableOpacity onPress={() => { }}>
                                {/* <Text style={Styles.cart_price_text_data}>View price details</Text> */}
                            </TouchableOpacity>
                        </View>

                        <View>
                            <Pressable disabled={productList != null && productList.length > 0 ? false : true} style={[Styles.cart_bottom_box_button, Styles.center]} onPress={() => { this.handlePlaceOrder(cartData.cartId) }}>
                                <Text style={Styles.cart_bottom_box_button_text}>Place Order</Text>
                            </Pressable>
                        </View>
                    </View>
                </>

                <Divider />
                <Divider />
            </SafeAreaLayout >
        )
    }
}

// interface LinkStateToProp {
//     productData: Product[],
//     productVariant: Product[],
//     userData: User,
//     allBrand: Brand[],
//     allMeasurement: Measurement[],
//     allVarient: Varient[];
//     allCart: Cart[];
// }

// interface LinkDispatchToProp {
//     changeProductData: (shopId: String) => void;
//     fetchBrandByShopId: (shopId: String) => void;
//     fetchVarientByShopId: (shopId: String) => void;
//     fetchMeasurementByShopId: (shopId: String) => void;
//     fetchUserById: (id: Number) => void;
//     fetchCartByShopIdUserId: (data: any) => void;
//     setProductVariant: (data: any) => void;
// }

// const mapStateToProps = (
//     state: AppState,
//     ownProps: Brand
// ): LinkStateToProp => ({
//     productData: state.productReducers.productData,
//     userData: state.userReducers.userData,
//     allVarient: state.varientReducers.allVarient,
//     allMeasurement: state.measurementReducers.measurementData,
//     allBrand: state.brandReducers.allBrand,
//     productVariant: state.productReducers.productVarient,
//     allCart: state.cartReducers.cartByUserId
// })

// const mapDispatchToProps = (
//     dispatch: ThunkDispatch<any, any, AppActions>,
//     ownProps: Brand
// ): LinkDispatchToProp => ({
//     changeProductData: bindActionCreators(changeProductData, dispatch),
//     fetchUserById: bindActionCreators(fetchUserById, dispatch),
//     fetchVarientByShopId: bindActionCreators(fetchVarientByShopId, dispatch),
//     fetchMeasurementByShopId: bindActionCreators(fetchMeasurementByShopId, dispatch),
//     fetchCartByShopIdUserId: bindActionCreators(fetchCartByShopIdUserId, dispatch),
//     setProductVariant: bindActionCreators(setProductVariant, dispatch),
//     fetchBrandByShopId: bindActionCreators(fetchBrandByShopId, dispatch)
// });

// const connector = connect(mapStateToProps, mapDispatchToProps);

// type RenderCartProps = ConnectedProps<typeof connector>;
// export const CartScreen = connector(RenderCart)