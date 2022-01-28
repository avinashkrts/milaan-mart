import React from 'react';
import {
    View,
    TouchableOpacity,
    ActivityIndicator,
    Alert, RefreshControl,
    Dimensions,
    ScrollView,
    Text
} from 'react-native';
import { AppRoute } from '../../../navigation/app-routes';
import {
    MinusIcon,
    RupeeIcon,
    PlusCircle,
    BackIcon,
    CancelIcon,
    AddIcon,
    RightArrowIcon
} from '../../../assets/icons';
import { AppConstants } from '../../../constants/AppConstants';
import { Toolbar } from '../../../components/toolbar.component';
import {
    SafeAreaLayout,
    SaveAreaInset,
} from '../../../components/safe-area-layout.component';
import { MenuIcon, ExperienceIcon, LocationIcon, PublicIcon, PencilIcon } from '../../../assets/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Share from 'react-native-share';
import { pathToFileURL, fileURLToPath } from 'url';
import Animated from 'react-native-reanimated';
import { Styles } from '../../../assets/styles'
import { Color, Padding } from '../../../constants/LabelConstants';
import { StackActions } from '@react-navigation/core';
import { scale } from 'react-native-size-matters';
import { Brand } from '../../../redux/modules/brand.modules';
// import { CartScreenProps } from '../../../navigation/cart-navigation/cart.navigator';
import { Product } from '../../../redux/modules/product';
import { User } from '../../../redux/modules/user.modules';
import { Measurement } from '../../../redux/modules/measurement.modules';
import { Varient } from '../../../redux/modules/varient.modules';
import { Cart } from '../../../redux/modules/cart.modules';
import { AppState } from '../../../redux/store';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../../../redux/interfaces';
import { changeProductData, setProductVariant } from '../../../redux/action/productActions';
import { bindActionCreators } from 'redux';
import { fetchUserById } from '../../../redux/action/userAction';
import { fetchVarientByShopId } from '../../../redux/action/varientAction';
import { fetchMeasurementByShopId } from '../../../redux/action/measurementAction';
import { fetchCartByShopIdUserId } from '../../../redux/action/cartAction';
import { fetchBrandByShopId } from '../../../redux/action/brandAction';
import { connect, ConnectedProps } from 'react-redux';
import { Avatar, Divider, List, ListItem, ListItemElement, ThemedComponentProps } from '@ui-kitten/components';
// import { CartNavigatorProp } from '../../../navigation/customer-navigator/customer.navigator';
import { CartScreenProps } from '../../../navigation/customer-navigator/cart-navigation/cart.navigator';

interface CartPageProps {
}

interface CartPageState {
    name: String,
    allBrand: Brand[],
    refreshing: Boolean
}

type Props = CartScreenProps & ThemedComponentProps & CartPageProps & RenderCartProps

var SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;


class RenderCart extends React.Component<Props, CartPageState & any> {
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
            content: {}
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
            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/cart/get/cartby/shopid/userid/' + AppConstants.SHOP_ID + '/' + userData.userId
            }).then((response) => {
                if (null != response.data) {
                    this.setState({
                        cartData: response.data[0],
                        cartId: response.data[0].cartId,
                        productList: response.data[0].productList
                    })
                }
            }, (error) => {
                // Alert.alert("Server error!.")
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

    handleIncrease(productId, cartId) {
        // const { cartId } = this.state;
        // Alert.alert(productId + cartId)
        axios({
            method: 'PUT',
            url: AppConstants.API_BASE_URL + '/api/cart/cartincrease/' + cartId + '/' + productId
        }).then((response) => {
            this._onRefresh();
        }, (error) => {
            Alert.alert("Server problem")
        })
    }

    handleDecrease(productId, cartId, quantity) {
        // const { cartId } = this.state;
        if (quantity <= 1) {
            Alert.alert("You have already selected minimum quantity.")
        } else {
            axios({
                method: 'PUT',
                url: AppConstants.API_BASE_URL + '/api/cart/cartdecrease/' + cartId + '/' + productId
            }).then((response) => {
                this._onRefresh();
            }, (error) => {
                Alert.alert("Server problem")
            })
        }
    }

    handleDelete(id) {
        axios({
            method: 'DELETE',
            url: AppConstants.API_BASE_URL + '/api/productlist/delete/' + id
        }).then((response) => {
            this._onRefresh();
        }, (error) => {
            Alert.alert("Server problem")
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
        //             }
        //         }
        //     })
        // }

    }

    handleCartId(cartId) {
        this.setState({
            isModalVisible: true,
            selectedCartId: cartId
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
                                <View style={Styles.cart_name_text_view}>
                                    <Text style={Styles.cart_name_text}>{item.productName}</Text>
                                </View>
                                <TouchableOpacity onPress={() => { this.handleDelete(item.id) }}>
                                    <Text style={Styles.cart_name_text}><CancelIcon fontSize={scale(25)} /></Text>
                                </TouchableOpacity>
                            </View>
                            <View style={Styles.cart_price_view}>

                                <View style={{ flexDirection: 'row', width: '55%', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                    <Text style={Styles.price_text}><RupeeIcon /> {item.price.toFixed(2)}</Text>
                                    {item.offersAvailable ?
                                        <Text style={Styles.offer_price_text}>{item.oldPrice.toFixed(2)}</Text> : null
                                    }
                                </View>

                                <View style={Styles.cart_quantity_view}>
                                    {item.currentStock ? item.currentStock >= item.productQuantity ?
                                        <>
                                            <TouchableOpacity style={Styles.cart_button} onPress={() => { this.handleDecrease(item.productId, item.cartId, item.productQuantity) }}>
                                                <Text style={Styles.cart_button_text}><MinusIcon /></Text>
                                            </TouchableOpacity>

                                            <View style={Styles.cart_quantity_text_view}>
                                                <Text style={Styles.cart_quantity_text}>{item.productQuantity}</Text>
                                            </View>

                                            <TouchableOpacity style={Styles.cart_button} onPress={() => { this.handleIncrease(item.productId, item.cartId) }}>
                                                <Text style={Styles.cart_button_text}><AddIcon /></Text>
                                            </TouchableOpacity>
                                        </> :
                                        <View style={{ paddingHorizontal: scale(2), alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ color: 'white' }}>Out of Stock</Text>
                                        </View> :
                                        <View style={{ paddingHorizontal: scale(2), alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ color: 'white' }}>Out of Stock</Text>
                                        </View>}
                                </View>
                            </View>
                            {item.offersAvailable ?
                                <View>
                                    <Text style={Styles.cart_offer_text}>{item.offer}% off</Text>
                                </View> : null
                            }
                        </View>
                    </View>
                    {item.offersAvailable ?
                        <View>
                            <Text style={[Styles.cart_offer_text, { marginLeft: 10 }]}>{item.offersAvailable} offers available</Text>
                        </View> : null
                    }
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
                                        <Text style={Styles.cart_price_text_data}>FREE</Text>
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
        single ?
            this.props.navigation.navigate(AppRoute.COMBINED_PRODUCT) :
            this.props.navigation.navigate(AppRoute.CUSTOMER_ALL_SHOP)
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
                                    <Text style={Styles.cart_price_text_head}>Price ({null != productList ? productList.length : null} items)</Text>
                                    <Text style={Styles.cart_price_text_head}><RupeeIcon fontSize={18} />{null != cartData.totalAmount ? (cartData.price).toFixed(2) : null}</Text>
                                </View>

                                <View style={Styles.price_detail_2_1}>
                                    <Text style={Styles.cart_price_text_head}>Discount</Text>
                                    <Text style={Styles.cart_price_text_data}>-<RupeeIcon fontSize={18} />{null != cartData.discount ? cartData.discount.toFixed(2) : null}</Text>
                                </View>

                                <View style={Styles.price_detail_2_1}>
                                    <Text style={Styles.cart_price_text_head}>GST Amount</Text>
                                    <Text style={Styles.cart_price_text_data}><RupeeIcon fontSize={18} />{null != cartData.gstAmount ? (cartData.gstAmount).toFixed(2) : null}</Text>
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
                            <View style={Styles.price_detail_2}>
                                <Text style={Styles.cart_price_text_data}>You will save <RupeeIcon fontSize={18} />{null != cartData.discount ? cartData.discount.toFixed(2) : null} on this order.</Text>
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
                            <TouchableOpacity style={[Styles.cart_bottom_box_button, Styles.center]} onPress={() => { this.handlePlaceOrder(cartData.cartId) }}>
                                <Text style={Styles.cart_bottom_box_button_text}>Place Order</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </>

                <Divider />
                <Divider />
            </SafeAreaLayout >
        )
    }
}

interface LinkStateToProp {
    productData: Product[],
    productVariant: Product[],
    userData: User,
    allBrand: Brand[],
    allMeasurement: Measurement[],
    allVarient: Varient[];
    allCart: Cart[];
}

interface LinkDispatchToProp {
    changeProductData: (shopId: String) => void;
    fetchBrandByShopId: (shopId: String) => void;
    fetchVarientByShopId: (shopId: String) => void;
    fetchMeasurementByShopId: (shopId: String) => void;
    fetchUserById: (id: Number) => void;
    fetchCartByShopIdUserId: (data: any) => void;
    setProductVariant: (data: any) => void;
}

const mapStateToProps = (
    state: AppState,
    ownProps: Brand
): LinkStateToProp => ({
    productData: state.productReducers.productData,
    userData: state.userReducers.userData,
    allVarient: state.varientReducers.allVarient,
    allMeasurement: state.measurementReducers.measurementData,
    allBrand: state.brandReducers.allBrand,
    productVariant: state.productReducers.productVarient,
    allCart: state.cartReducers.cartByUserId
})

const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AppActions>,
    ownProps: Brand
): LinkDispatchToProp => ({
    changeProductData: bindActionCreators(changeProductData, dispatch),
    fetchUserById: bindActionCreators(fetchUserById, dispatch),
    fetchVarientByShopId: bindActionCreators(fetchVarientByShopId, dispatch),
    fetchMeasurementByShopId: bindActionCreators(fetchMeasurementByShopId, dispatch),
    fetchCartByShopIdUserId: bindActionCreators(fetchCartByShopIdUserId, dispatch),
    setProductVariant: bindActionCreators(setProductVariant, dispatch),
    fetchBrandByShopId: bindActionCreators(fetchBrandByShopId, dispatch)
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type RenderCartProps = ConnectedProps<typeof connector>;
export const CartScreen = connector(RenderCart)