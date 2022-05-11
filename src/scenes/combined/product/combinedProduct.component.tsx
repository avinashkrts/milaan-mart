import React, { Component } from "react";
import { View, Text, RefreshControl, AsyncStorage, Alert, StyleSheet, PermissionsAndroid, BackHandler, Keyboard, ActivityIndicator } from "react-native";
import { Avatar, Divider, Input, List, ListItem, ListItemElement, ThemedComponentProps } from "react-native-ui-kitten";
import { SafeAreaLayout, SaveAreaInset } from "../../../components/safe-area-layout.component";
import { Toolbar } from "../../../components/toolbar.component";
import { BackIcon, CartIcon, CancelIcon, SearchIcon, WishIcon, MenuIcon, RupeeIcon, MinusIcon, AddIcon } from "../../../assets/icons";
import { FlatList, ScrollView, TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { AppConstants, Color } from "../../../constants";
import { Styles } from "../../../assets/styles";
import axios from 'axios';
import { AppRoute } from "../../../navigation/app-routes";
import Axios from "axios";
import { CombinedProductScreenProps } from "../../../navigation/combined-navigator/combinedAllProduct.navigator";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geolocation from 'react-native-geolocation-service';
import Modal from "react-native-modal";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Header } from 'native-base';
import { StackActions } from "@react-navigation/native";
import { scale } from "react-native-size-matters";
import { LableText } from '../../../constants/LabelConstants';
import { ThunkDispatch } from "redux-thunk";
import { bindActionCreators } from "redux";
import { changeProductData } from "../../../redux/action/productActions";
import { Product } from "../../../redux/modules/product";
import { connect, ConnectedProps } from "react-redux";
import SearchInput, { createFilter } from 'react-native-search-filter';
import { fetchBrandByShopId } from "../../../redux/action/brandAction";
import { AppState } from "src/redux/store";
import { Brand } from "src/redux/modules/brand.modules";
import { AppActions } from "src/redux/interfaces";
import { User } from "../../../redux/modules/user.modules";
import { fetchUserById } from "../../../redux/action/userAction";
import { Varient } from "../../../redux/modules/varient.modules";
import { fetchVarientByShopId } from "../../../redux/action/varientAction";
import { Measurement } from "../../../redux/modules/measurement.modules";
import { fetchMeasurementByShopId } from "../../../redux/action/measurementAction";
import { Cart } from "../../../redux/modules/cart.modules";
import { fetchCartByShopIdUserId, fetchCartByUserId } from "../../../redux/action/cartAction";
const KEYS_TO_FILTERS = ['name'];

type Props = CombinedProductScreenProps & ThemedComponentProps & CombinedProductProps & LinkDispatchToProp & LinkStateToProp;

class CombinedProduct extends Component<Props, any> {
    backHandler: any;
    constructor(props: Props) {
        super(props);
        this.state = {
            searchTerm: '',
            searchVisible1: '',
            allProduct: [],
            allCategory: [],
            allBrand: [],
            selectedCategory: '',
            selectedBrand: '',
            userData: [],
            shopId: AppConstants.SHOP_ID,
            allMeasurement: [],
            wishList: '',
            search: '',
            lat: '',
            long: '',
            searchVisible: '',
            refreshing: false,
            location: '',
            isCart: false,
            user: [],
            allVarient: [],
            logedIn: false,
            variantVisible: false,
            temp_variant: [],
            productName: '',
            allData: [
                {
                    url: '/api/lookup/getallmeasurementtype',
                    method: 'GET',
                    variable: 'allMeasurement',
                }
            ],
            single: false,
            shopName: '',
        };

        this._onRefresh = this._onRefresh.bind(this);
        this.handleAddToCart = this.handleAddToCart.bind(this);
    }

    // changeProductData = (product: Product[]) => {
    //    // this.props.changeProductData(product)
    // }

    backAction = () => {
        Alert.alert("Alert!", LableText.CUS_HOME_PAGE, [
            {
                text: "Cancel",
                onPress: () => null,
                style: "cancel"
            },
            {
                text: "YES", onPress: () => {
                    BackHandler.exitApp()
                }

            }
        ]);
        return true;
    };

    componentWillUnmount() {
        this.backHandler.remove();
    }

    componentWillMount() {
        this.props.navigation.addListener('focus', () => {
            this.backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                this.backAction
            );
        })
    }

    async componentDidMount() {
        // console.log('Product data', this.props)
        this.props.navigation.addListener('focus', () => {
            this.backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                this.backAction
            );
        })

        this.props.navigation.addListener('blur', () => {
            this.backHandler.remove();
        })

        const { allData } = this.state;
        let userDetail = await AsyncStorage.getItem('userDetail');
        let userData = JSON.parse(userDetail);

        const logedIn = await AsyncStorage.getItem('logedIn');
        const shopIdAsync = await AsyncStorage.getItem('shopId')
        const shopName = await AsyncStorage.getItem('shopName')
        this.setState({
            userData: userData,
        })




        if (null != logedIn && logedIn === 'true') {
            this.props.fetchUserById(Number(userData.userId))
            const data = { shopId: AppConstants.SHOP_ID, userId: userData.userId }
            this.props.fetchCartByShopIdUserId(data)

            this.setState({
                user: this.props.userData,
                logedIn: Boolean(logedIn)
            })
        }

        this.props.changeProductData(AppConstants.SHOP_ID)
        this.props.fetchBrandByShopId(AppConstants.SHOP_ID)
        this.props.fetchVarientByShopId(AppConstants.SHOP_ID)
        this.props.fetchMeasurementByShopId(AppConstants.SHOP_ID)

        this.setState({
            allBrand: this.props.allBrand,
            allProduct: this.props.productData,
            allVarient: this.props.allVarient
        })
        // axios({
        //     method: 'GET',
        //     url: AppConstants.API_BASE_URL + '/api/product/getproductbyshopid/' + AppConstants.SHOP_ID,
        // }).then((response) => {
        //     if (null != response.data) {
        //         //// this.props.changeProductData(response.data)
        //         this.setState({
        //             allProduct: response.data.reverse(),
        //         })
        //     }
        // }, (error) => {
        //     Alert.alert("Wait for a moment.")
        // });
        // axios({
        //     method: 'GET',
        //     url: AppConstants.API_BASE_URL + '/api/category/getcategorybyshopid/' + AppConstants.SHOP_ID,
        // }).then((response) => {
        //     if (null != response.data) {
        //         this.setState({
        //             allCategory: response.data,
        //             selectedCategory: response.data[0].id
        //         })
        //     }
        // }, (error) => {
        //     Alert.alert("Wait for a moment.")
        // });
        // axios({
        //     method: 'GET',
        //     url: AppConstants.API_BASE_URL + '/api/brand/getbrandbyshopid/' + AppConstants.SHOP_ID,
        // }).then((response) => {
        //     if (null != response.data) {
        //         this.setState({
        //             allBrand: response.data,
        //             selectedBrand: response.data[0].id
        //         })
        //     }
        // }, (error) => {
        //     Alert.alert("Wait for a moment.")
        // });

        // axios({
        //     method: 'GET',
        //     url: AppConstants.API_BASE_URL + '/api/lookup/getallmeasurementtype',
        // }).then((response) => {
        //     // console.log(data.variable, response.data)
        //     this.setState({
        //         allMeasurement: response.data,
        //     })
        // }, (error) => {
        //     Alert.alert("Wait for a moment..")
        // });
    }

    addToCart(productId) {
        const { shopId, logedIn, userData } = this.state
        if (null != logedIn && logedIn) {
            // Alert.alert(''+ userData.userId + productId + logedIn + shopId)
            Axios({
                method: 'POST',
                url: AppConstants.API_BASE_URL + '/api/cart/create',
                data: {
                    shopId: shopId,
                    userId: userData.userId,
                    productId: productId,
                    productQuantity: 1
                }
            }).then((response) => {
                if (null != response.data) {
                    if (response.data.status === 'true') {
                        Alert.alert("Product added to cart.")
                        const data = { shopId: AppConstants.SHOP_ID, userId: userData.userId }
                        this.props.fetchCartByShopIdUserId(data)
                    } else {
                        Alert.alert("Product allready exists in your cart.")
                    }
                }
            }, (error) => {
                // Alert.alert("Wait for a moment..")
            });
        } else {
            this.props.navigation.navigate(AppRoute.AUTH);
        }
    }

    navigateToCart() {
        const pushAction = StackActions.push(AppRoute.CUSTOMER_CART)
        this.props.navigation.dispatch(pushAction);
    }

    selectCategory(id) {
        const { shopId } = this.state;
        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/brand/getallDeactivebrandbyshopid/' + id,
        }).then((response) => {
            if (null != response.data) {
                this.setState({
                    allBrand: response.data,
                    selectedCategory: id
                })
            }
        }, (error) => {
            Alert.alert("Wait for a moment.")
        });

        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/product/getproductbyshopidandcategory/' + shopId + '/' + id,
        }).then((response) => {
            if (null != response.data) {
                // this.props.changeProductData(response.data)
                this.setState({
                    allProduct: response.data,
                })
            }
        }, (error) => {
            Alert.alert("Wait for a moment.")
        });
        // this.setState({ selectedCategory: id })
    }

    selectBrand(id, brandName) {
        const { shopId } = this.state
        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/product/getproduct/shopid/brand/' + shopId + '/' + id,
        }).then((response) => {
            if (null != response.data) {
                // this.props.changeProductData(response.data)
                this.setState({
                    allProduct: response.data,
                    selectedBrand: id
                })
            }
        }, (error) => {
            Alert.alert("Wait for a moment.")
        });
        // this.setState({ selectedBrand: id })
    }

    navigateProductDetail(id, shopId) {
        const pushAction = StackActions.push(AppRoute.CUSTOMER_PRODUCT_DETAIL, { productId: String(id), shopId: String(shopId) });
        this.props.navigation.dispatch(pushAction)
    }

    async handleAddToCart(productId, productName) {
        const { userData } = this.state;
        console.log('data in add to cart', productId);
        const logedIn = await AsyncStorage.getItem('logedIn');
        var variant = []
        if (this.props.allVarient.length > 0) {
            this.props.allVarient.map((item, index) => {
                if (item.productId == productId) {
                    variant.push(item)
                }
            })

            this.setState({
                temp_variant: variant,
                variantVisible: true,
                productName: productName
            })
        }
    }

    async handleWishList(productId) {
        const { isSelectedWish, userData } = this.state
        const logedIn = await AsyncStorage.getItem('logedIn');
        if (null != logedIn && logedIn === 'true') {
            axios({
                method: "GET",
                url: AppConstants.API_BASE_URL + '/api/user/wishlist/add/' + userData.userId + "/" + productId,
            }).then((response) => {
                this.props.fetchUserById(Number(userData.userId))
                this.setState({
                    isSelectedWish: !isSelectedWish
                })
            }, (error) => {
                Alert.alert("Wait for a moment..")
            });
        } else {
            this.props.navigation.navigate(AppRoute.AUTH);
        }
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });
    }

    productSearch(filteredProduct) {
        this.setState({
            allProduct: filteredProduct,
            searchVisible1: false
        })
        Keyboard.dismiss();
    }

    clearSearch() {
        this.setState({
            searchTerm: '',
            allProduct: this.props.productData
        })
    }

    toggleModal(modal) {
        switch (modal) {
            case 'VARIANT':
                this.setState({
                    variantVisible: false
                })
                break;
            case 'SEARCH':
                this.setState({
                    searchVisible: false
                })
                break;
        }

    }

    toggleModal2() {
        this.setState({
            searchVisible1: false
        })
    }

    handleSearchLatLong(data, details) {
        this.toggleModal("SEARCH");

        Axios({
            url: 'https://maps.googleapis.com/maps/api/place/details/json?key=' + AppConstants.GOOGLE_MAP_KEY + '&place_id=' + data.place_id
        }).then((response) => {
            const { data: { result: { geometry: { location } } } } = response
            const { lat, lng } = location
            AsyncStorage.setItem('latitude', String(lat))
            AsyncStorage.setItem('longitude', String(lng))
            AsyncStorage.setItem('location', String(data.structured_formatting.main_text))

            console.log('Location', data.structured_formatting.main_text)
            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/product/getbylocation/' + lat + '/' + lng,
            }).then((response) => {
                // this.props.changeProductData(response.data)
                this.setState({
                    allProduct: response.data,
                    lat: lat,
                    long: lng,
                    searchVisible: false,
                    location: data.structured_formatting.main_text
                })
            }, (error) => {
                Alert.alert("Wait for a moment..")
            });
        }, (error) => {
            console.log(error);
        })
    }

    async onCurrentLocation() {
        console.log('Map Clicked')
        this.toggleModal("SEARCH");
        // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition((position) => {
            var lat = position.coords.latitude
            var long = position.coords.longitude
            console.log('location', lat, position.coords.accuracy)
            AsyncStorage.setItem('latitude', String(lat))
            AsyncStorage.setItem('longitude', String(long))
            AsyncStorage.setItem('location', 'Current Location')

            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/product/getbylocation/' + lat + '/' + long,
            }).then((response) => {
                // this.props.changeProductData(response.data)
                this.setState({
                    allProduct: response.data,
                    lat: position.coords.latitude,
                    long: position.coords.longitude,
                    searchVisible: false,
                    location: 'Current Location'
                })
            }, (error) => {
                Alert.alert("Wait for a moment..")
            });
        }, (erroe) => {

        }, { enableHighAccuracy: true })
        // } else {
        //     console.log("Camera permission denied");
        // }
    }

    renderProduct = ({ item }: any): ListItemElement => (
        item.itemList.length > 0 ?
            <ListItem style={{ borderBottomColor: 'rgba(200, 200, 200, 1)', borderBottomWidth: scale(1) }}>
                <View style={Styles.product_list_main}>
                    <View style={Styles.product_list_img}>
                        <TouchableOpacity onPress={() => { this.navigateProductDetail(item.id, item.shopId) }}>
                            <View style={[Styles.all_Item_Image_2, Styles.center]}>
                                <Avatar source={{ uri: AppConstants.IMAGE_BASE_URL + '/product/' + item.id + '_' + 1 + "_" + item.shopId + '_product.png' }} style={Styles.product_avatar} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={Styles.product_list_detail}>
                        <View style={Styles.all_Item_List1}>
                            <View style={Styles.all_Item_Detail}>
                                <View style={{ backgroundColor: '#fff', paddingHorizontal: 0 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        {null != this.state.allBrand ? this.state.allBrand.map((brand, index) => {
                                            if (brand.id == item.brand) {
                                                return (
                                                    <View style={{ width: '80%', flexWrap: 'wrap', flexDirection: 'row' }}>
                                                        <Text style={{ color: '#000', marginTop: scale(5), fontSize: scale(14) }}>{item.name} {`\n`}{brand.name}</Text>
                                                    </View>
                                                );
                                            }
                                        }) : null}
                                        {/* {this.props.userData != null && this.props.userData.length > 0 ? */}
                                        <View style={[Styles.product_2nd_wish_view]}>
                                            <TouchableOpacity onPress={() => { this.handleWishList(item.id) }}>
                                                <Text
                                                    style={this.state.logedIn && this.props.userData.wishList.includes(item.id) ?
                                                        Styles.selected_wish_icon :
                                                        Styles.wish_icon
                                                    }
                                                >
                                                    <WishIcon />
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        {/* : null
                                    } */}
                                    </View>
                                    {this.props.allMeasurement.length > 0 ? this.props.allMeasurement.map((brand, index) => {
                                        if (brand.id == item.itemList[0].measurement) {
                                            return (
                                                <>
                                                    <Text style={{ color: Color.COLOR_ITEM_NAME, marginTop: 5 }}>{item.itemList[0].quantity} {brand.name}</Text>
                                                </>
                                            );
                                        }
                                    }) : null}
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginVertical: 5 }}>
                                        <Text style={{ color: '#000', fontSize: scale(14) }}>Rs. {item.itemList[0].sellingPrice}</Text>
                                        {item.offerActiveInd ?
                                            <Text style={{ color: Color.COLOR, fontSize: 20, textDecorationLine: 'line-through' }}>{item.oldPrice}</Text>
                                            : null
                                        }
                                    </View>
                                    {null != item.offerActiveInd ? item.offerActiveInd ?

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                            <Text style={{ color: Color.COLOR }}>{item.offerPercent} % off</Text>
                                            <Text style={{ color: Color.COLOR }}>{item.offerActiveInd && item.offerTo ? item.offerTo.substr(8, 2) + "/" + item.offerTo.substr(5, 2) + "/" + item.offerTo.substr(0, 4) : null}</Text>
                                        </View> :
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                            <Text style={{ color: Color.COLOR, marginTop: 2.5 }}></Text>
                                            <Text style={{ color: Color.COLOR }}></Text>
                                        </View> : null
                                    }
                                </View>

                                <TouchableOpacity onPress={() => { this.handleAddToCart(item.id, item.name) }}>
                                    <View style={[{ backgroundColor: Color.COLOR, marginVertical: 10, alignSelf: 'center', paddingVertical: 5, borderRadius: 5, width: '90%' }, Styles.center]}>
                                        <Text style={{ color: Color.BUTTON_NAME_COLOR }}>Add to cart</Text>
                                    </View>
                                </TouchableOpacity>
                                {/* {item.stock ? item.stock > 0 ?
                                    <TouchableOpacity onPress={() => { this.handleAddToCart(item.id, item.shopId) }}>
                                        <View style={[{ backgroundColor: Color.COLOR, marginVertical: 10, alignSelf: 'center', paddingVertical: 5, borderRadius: 5, width: '90%' }, Styles.center]}>
                                            <Text style={{ color: Color.BUTTON_NAME_COLOR }}>Add to cart</Text>
                                        </View>
                                    </TouchableOpacity> :

                                    <TouchableOpacity >
                                        <View style={[{ backgroundColor: Color.COLOR, marginVertical: 10, alignSelf: 'center', paddingVertical: 5, borderRadius: 5, width: '90%' }, Styles.center]}>
                                            <Text style={{ color: Color.BUTTON_NAME_COLOR }}>Out of Stock</Text>
                                        </View>
                                    </TouchableOpacity> :
                                    <TouchableOpacity >
                                        <View style={[{ backgroundColor: Color.COLOR, marginVertical: 10, alignSelf: 'center', paddingVertical: 5, borderRadius: 5, width: '90%' }, Styles.center]}>
                                            <Text style={{ color: Color.BUTTON_NAME_COLOR }}>Out of Stock</Text>
                                        </View>
                                    </TouchableOpacity>
                                } */}
                            </View>
                        </View>
                    </View>

                </View>
            </ListItem> : <></>
    )

    search(index) {
        var product = [index]
        this.setState({
            allProduct: product,
            searchVisible1: false,
            searchTerm: index.name
        })
    }

    searchUpdated(term) {
        this.setState({ searchTerm: term })
    }

    handleIncrease(productId, cartId) {
        const { userData } = this.props
        axios({
            method: 'PUT',
            url: AppConstants.API_BASE_URL + '/api/cart/cartincrease/' + cartId + '/' + productId
        }).then((response) => {
            const data = { shopId: AppConstants.SHOP_ID, userId: userData.userId }
            this.props.fetchCartByShopIdUserId(data)
        }, (error) => {
            Alert.alert("Wait for a moment.")
        })
    }

    handleDecrease(productId, cartId, quantity) {
        const { userData } = this.props
        if (quantity <= 1) {
            Alert.alert("You have already selected minimum quantity.")
        } else {
            axios({
                method: 'PUT',
                url: AppConstants.API_BASE_URL + '/api/cart/cartdecrease/' + cartId + '/' + productId
            }).then((response) => {
                const data = { shopId: AppConstants.SHOP_ID, userId: userData.userId }
                this.props.fetchCartByShopIdUserId(data)
            }, (error) => {
                Alert.alert("Wait for a moment.")
            })
        }
    }

    renderVariant = ({ item }: any): ListItemElement => (
        <ListItem style={{ borderBottomColor: 'rgba(2,15,20,0.10)', borderBottomWidth: 1 }}>
            {item != null ?
                <View style={Styles.variant_main_view}>
                    <View style={Styles.variant_view_1}>
                        <View style={Styles.variant_price_view}>
                            <View style={{ width: '55%', flexDirection: "column" }}>
                                {this.props.allMeasurement.length > 0 ? this.props.allMeasurement.map((brand, index) => {
                                    if (brand.id == item.measurement) {
                                        return (
                                            <View>
                                                <Text style={{ fontSize: scale(15), fontWeight: 'bold', marginTop: 5 }}>{item.quantity} {brand.name}</Text>
                                            </View>
                                        );
                                    }
                                }) : null}
                                <View>
                                    <Text style={Styles.price_text}><RupeeIcon fontSize={scale(18)} /> {item.sellingPrice.toFixed(2)}</Text>
                                </View>

                                {item.sellingPrice != item.mrp ?
                                    <View>
                                        <Text style={Styles.offer_price_text}>
                                            {item.mrp.toFixed(2)}
                                        </Text>
                                    </View>
                                    : null
                                }
                            </View>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <View style={Styles.cart_quantity_view}>
                                    {item.stock ? item.stock > 0 ?
                                        this.state.logedIn ?
                                            this.props.allCart[0].productList.length ?
                                                this.props.allCart[0].productList.map((data, index) => {
                                                    if (data.productId == item.id) {
                                                        return (
                                                            <>
                                                                <TouchableOpacity style={Styles.cart_button}>
                                                                    <Text onPress={() => { this.handleDecrease(item.id, data.cartId, data.productQuantity) }} style={Styles.cart_button_text}><MinusIcon /></Text>
                                                                </TouchableOpacity>

                                                                <View style={Styles.cart_quantity_text_view}>
                                                                    <Text style={Styles.cart_quantity_text}>{data.productQuantity}</Text>
                                                                </View>

                                                                <TouchableOpacity style={Styles.cart_button}>
                                                                    <Text style={Styles.cart_button_text} onPress={() => { this.handleIncrease(item.id, data.cartId) }}><AddIcon /></Text>
                                                                </TouchableOpacity>
                                                            </>
                                                        )
                                                    } else {
                                                        return (
                                                            <View style={{ paddingHorizontal: scale(2), alignItems: 'center', justifyContent: 'center' }}>
                                                                <Text style={{ color: 'white', padding: scale(5) }} onPress={() => {this.addToCart(item.id)}} >Add To Cart</Text>
                                                            </View>
                                                        )
                                                    }
                                                }) :
                                                <View style={{ paddingHorizontal: scale(2), alignItems: 'center', justifyContent: 'center' }}>
                                                    <Text style={{ color: 'white' }}>Out of Stock</Text>
                                                </View> :
                                            <View style={{ paddingHorizontal: scale(2), alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={{ color: 'white' }}>Out of Stock</Text>
                                            </View> :
                                        <View style={{ paddingHorizontal: scale(2), alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ color: 'white' }}>Out of Stock</Text>
                                        </View> :
                                        <View style={{ paddingHorizontal: scale(2), alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ color: 'white' }}>Out of Stock</Text>
                                        </View>
                                    }
                                </View>
                            </View>
                        </View>
                        {item.offersAvailable ?
                            <View>
                                <Text style={Styles.cart_offer_text}>{item.offer}% off</Text>
                            </View> : null
                        }
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

    render() {
        // const productList = this.props.productData
        const productList = null
        const { allVarient, allBrand, allMeasurement, productData, allCart } = this.props
        const { allProduct, user, temp_variant, productName, searchVisible1, variantVisible, searchTerm, isCart, shopName, single, searchVisible, location, lat, long, refreshing, shopId, search, allCategory, wishList, selectedBrand, selectedCategory } = this.state;
        const filteredProduct = productList ? productList.length > 0 ? productList.filter(createFilter(searchTerm, KEYS_TO_FILTERS)) : null : null
        // console.log('User Data', allCart)
        return (
            <SafeAreaLayout
                style={Styles.safeArea}
                insets={SaveAreaInset.TOP}>

                <Modal isVisible={variantVisible}>
                    <View style={Styles.variant_modal}>
                        <View style={Styles.varient_modalHeader}>
                            <Text style={{ fontSize: scale(20), fontWeight: '400' }}>{productName}</Text>
                            <TouchableOpacity>
                                <Text onPress={() => { this.toggleModal("VARIANT"); }}><CancelIcon fontSize={25} /></Text>
                            </TouchableOpacity>
                        </View>
                        <Divider />
                        <Divider />
                        <Divider />
                        <ScrollView>

                            <View>
                                {null != temp_variant ?
                                    <List
                                        data={temp_variant}
                                        renderItem={this.renderVariant}
                                    /> : null}
                            </View>
                        </ScrollView>
                    </View>
                </Modal>

                <Modal style={Styles.modal} isVisible={searchVisible}>
                    <View style={Styles.modalHeader}>
                        <TouchableOpacity>
                            <Text onPress={() => { this.toggleModal("SEARCH"); }}><CancelIcon fontSize={25} /></Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View>
                            <Text onPress={() => { this.onCurrentLocation() }} style={{ color: Color.BUTTON_NAME_COLOR, padding: 10, backgroundColor: Color.COLOR, opacity: 0.8, borderRadius: 10, marginTop: 10 }}>{LableText.USE_CURRENT_LOCATION}</Text>
                        </View>
                        <GooglePlacesAutocomplete
                            placeholder='Search'
                            styles={{}}
                            onPress={(data, details = null) => {
                                this.handleSearchLatLong(data, details)
                                console.log('New Location', data);
                            }}
                            query={{
                                key: AppConstants.GOOGLE_MAP_KEY,
                                language: 'en',
                            }}
                        />
                        {lat !== '' && long !== '' ?
                            <>
                                <MapView
                                    style={{ flex: 1 }}
                                    provider={PROVIDER_GOOGLE}
                                    showsUserLocation={true}
                                    initialRegion={{
                                        latitude: Number(lat),
                                        longitude: Number(long),
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }}

                                    region={{
                                        latitude: Number(lat),
                                        longitude: Number(long),
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }}
                                >

                                    <Marker
                                        coordinate={{
                                            latitude: Number(lat),
                                            longitude: Number(long),
                                        }
                                        }
                                    >
                                    </Marker>

                                </MapView>
                            </> : null}
                    </View>
                </Modal>


                <Toolbar
                    title='Sone Biryani'
                    backIcon={MenuIcon}
                    onBackPress={this.props.navigation.openDrawer}
                    onRightPress={() => { this.navigateToCart() }}
                    menuIcon={CartIcon}
                    style={{ marginTop: -5, marginLeft: -5 }}
                />

                <Divider />
                <Divider />
                <Divider />
                {/* {!single ?
                    <View style={{ padding: 5 }}>
                        <Text onPress={() => { this.setState({ searchVisible: true }) }} style={{ fontWeight: 'bold', fontSize: 18, color: Color.COLOR }}>Location: <Text style={{ fontSize: 16, fontWeight: '100' }}>{location}</Text></Text>
                    </View> : null} */}
                {/* <Header style={styles.header}> */}
                <View style={[Styles.searchBox, { marginBottom: 0 }]}>
                    <TextInput
                        placeholder="Search"
                        style={[Styles.searchInput_new]}
                        value={searchTerm}
                        onChangeText={(term) => { this.searchUpdated(term) }}
                        onFocus={() => { this.setState({ searchVisible1: true }) }}
                        onBlur={() => { this.setState({ searchVisible1: false }) }}
                    />

                    <View style={[{ width: '10%', }, Styles.center]}>
                        {/* {productList.length != allProduct.length || searchTerm != '' ?
                            <TouchableOpacity onPress={() => { this.clearSearch() }}>
                                <Text style={[Styles.searchIcon, { width: scale(30), height: scale(30) }]}><CancelIcon fontSize={scale(25)} /></Text>
                            </TouchableOpacity> : null} */}
                    </View>
                    <View style={[{ width: '10%', }, Styles.center]}>
                        <TouchableOpacity onPress={() => { this.productSearch(filteredProduct) }}>
                            <Text style={Styles.searchIcon}><SearchIcon /></Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Divider />
                {/* </Header> */}
                <>
                    <Header style={{ backgroundColor: '#ffffff', height: 50, marginTop: 0 }}>

                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <View style={{ marginTop: 10 }}>
                                <FlatList
                                    style={{}}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    data={allCategory}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity key={index} onPress={() => { this.selectCategory(item.id) }}>
                                                <View style={selectedCategory == item.id ? Styles.product_nav_button_selected : Styles.product_nav_button}>
                                                    <Text style={selectedCategory == item.id ? Styles.product_nav_button_selected_text : Styles.product_nav_button_text}>{item.name}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }}
                                >
                                </FlatList>
                            </View>
                        </View>
                    </Header>
                    <Divider />
                    <Header style={{ backgroundColor: '#ffffff', height: 50, marginTop: 0 }}>

                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <View style={{ marginTop: 10 }}>
                                <FlatList
                                    style={{}}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    data={allBrand}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity onPress={() => { this.selectBrand(item.id, item.name) }}>
                                                <View style={selectedBrand == item.id ? Styles.product_nav_button_selected : Styles.product_nav_button}>
                                                    <Text style={selectedBrand == item.id ? Styles.product_nav_button_selected_text : Styles.product_nav_button_text}>{item.name}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }}
                                >
                                </FlatList>
                            </View>
                        </View>
                    </Header>
                </>
                {searchVisible1 ?
                    <>
                        <ScrollView>
                            {filteredProduct.map((product, i) => {
                                return (
                                    <TouchableOpacity onPress={() => { this.search(product) }} key={product.id} style={styles.emailItem}>
                                        <View>
                                            <Text>{product.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </> :
                    <>

                        {null != productData ?
                            <List data={productData}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={this._onRefresh.bind(this)}
                                    />}
                                renderItem={this.renderProduct}
                            /> : null}
                    </>}
                <View style={{ height: 10, width: '100%' }} />

                {!isCart ?
                    <TouchableOpacity style={Styles.bottom_tab_bar} onPress={() => { Alert.alert("Asdf") }}>
                        <Text style={Styles.bottom_view_cart_text}>View Cart</Text>
                    </TouchableOpacity>
                    : null
                }
            </SafeAreaLayout>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-start'
    },
    emailItem: {
        borderBottomWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.3)',
        padding: 10
    },
    emailSubject: {
        color: 'rgba(0,0,0,0.5)'
    },
    searchInput: {
        padding: 10,
        borderColor: '#CCC',
        borderWidth: 1
    }
});

interface LinkStateToProp {
    productData: Product[],
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
    fetchBrandByShopId: bindActionCreators(fetchBrandByShopId, dispatch)
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type CombinedProductProps = ConnectedProps<typeof connector>;

export const CombinedProductScreen = connector(CombinedProduct);