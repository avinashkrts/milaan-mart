import React, { Component } from 'react';
import { Alert, BackHandler, Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, Divider, Layout, List, ListItem, ListItemElement, ThemedComponentProps } from '@ui-kitten/components';
import { Toolbar } from '../../../components/toolbar.component';
import {
    SafeAreaLayout,
    SaveAreaInset,
} from '../../../components/safe-area-layout.component';
import Modal from "react-native-modal";
import { AddIcon, CancelIcon, MenuIcon, MinusIcon, PeopleIcon, RupeeIcon, WishIcon } from '../../../assets/icons';
import { CategoryListScreenProps } from '../../../navigation/customer-navigator/shop-list.navigator';
import { AppState } from '../../../redux/store';
import { ThunkDispatch } from "redux-thunk";
import { bindActionCreators } from "redux";
import { connect, ConnectedProps } from "react-redux";
import { AppRoute } from '../../../navigation/app-routes';
import { LableText } from '../../../constants/LabelConstants';
import { AppActions } from '../../../redux/interfaces';
import { Brand } from '../../../redux/modules/brand.modules'
import { fetchBrandByShopId } from '../../../redux/action/brandAction';
import { AppConstants, Color } from '../../../constants';
import { fetchVarientByShopId } from '../../../redux/action/varientAction';
import { Varient } from '../../../redux/modules/varient.modules';
import { Styles } from '../../../assets/styles';
import { scale } from 'react-native-size-matters';
import { Measurement } from '../../../redux/modules/measurement.modules';
import { fetchMeasurementByShopId } from '../../../redux/action/measurementAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category } from '../../../redux/modules/category.modules';
import { fetchCategoryByShopId } from '../../../redux/action/categoryAction';
import { CommonActions, StackActions } from '@react-navigation/core';
import axios from 'axios';
import { OfferData } from './offerData';

interface ShopPageProps {
    CategoryListScreenProps: CategoryListScreenProps
}

interface ShopPageState {
    name: String,
    allBrand: Brand[],
    refreshing: Boolean
}

type Props = CategoryListScreenProps & ThemedComponentProps & ShopPageProps & CategoryListProps

class CategoryList extends Component<Props, ShopPageState & any> {
    backHandler: any;
    constructor(props: Props) {
        super(props);
        this.state = {
            name: 'Avi',
            allBrand: [],
            refreshing: false,
            productWithVariant: [],
            offers: OfferData,
            searchTerm: '',
            searchVisible1: '',
            allProduct: [],
            allCart: [],
            allCategory: [],
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
            location: '',
            isCart: false,
            user: [],
            allVarient: [],
            logedIn: false,
            variantVisible: false,
            temp_variant: [],
            productName: '',
            subCategory: [],
            allData: [
                {
                    url: '/api/lookup/getallmeasurementtype',
                    method: 'GET',
                    variable: 'allMeasurement',
                }
            ],
            single: false,
            shopName: '',
        }

        this.logOut = this.logOut.bind(this);
        this.backAction = this.backAction.bind(this);
        this.handleBackButton = this.handleBackButton.bind(this);
        this.handleRecall = this.handleRecall.bind(this);
    }

    getProduct() {
        this.props.fetchBrandByShopId(AppConstants.SHOP_ID)
        this.props.fetchMeasurementByShopId(AppConstants.SHOP_ID)
        // this.props.setProductVariant({ shopId: AppConstants.SHOP_ID, from: 0, to: 10 })
        // this.getAllSubCategory();
        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/item/getall/productonline/byshopid/' + AppConstants.SHOP_ID + '/true',
        }).then((response) => {
            if (null != response.data) {
                axios({
                    method: 'GET',
                    url: AppConstants.API_BASE_URL + '/api/itemlist/getall/variant/onlinebyshopid/' + AppConstants.SHOP_ID + '/true',
                }).then((response1) => {
                    if (null != response1.data) {
                        if (response.data && response.data != null && response1.data && response1.data != null) {
                            var data = []
                            for (var i = 0; i < response.data.length; i++) {
                                var data1 = []
                                var data2 = []
                                data1.push(response.data[i])
                                for (var j = 0; j < response1.data.length; j++) {
                                    if (response.data[i].id == response1.data[j].productId) {
                                        data2.push(response1.data[j])
                                    }
                                }
                                data1[0].itemList = data2
                                data.push(data1[0])
                            }
                            this.setState({
                                productWithVariant: data
                            })
                        }
                    }
                }, (error) => {
                    Alert.alert("Server error!.")
                });
            }
        }, (error) => {
            Alert.alert("Server error!.")
        });
    }

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
        if (this.backHandler) {
            this.backHandler.remove();
        }
    }

    UNSAFE_componentWillMount() {
        this.props.navigation.addListener('focus', () => {
            this.backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                this.backAction
            );
        })
    }

    handleBackButton() {
        this.props.navigation.addListener('focus', () => {
            this.backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                this.backAction
            );
        })
    }

    async componentDidMount() {
        this.handleBackButton()

        this.props.navigation.addListener('blur', () => {
            if (this.backHandler) {
                this.backHandler.remove();
            }
        })

        // this.props.fetchBrandByShopId(AppConstants.SHOP_ID)
        // this.props.fetchVarientByShopId(AppConstants.SHOP_ID)
        // this.props.fetchMeasurementByShopId(AppConstants.SHOP_ID)
        this.props.fetchCategoryByShopId(AppConstants.SHOP_ID)

        let userDetail = await AsyncStorage.getItem('userDetail');
        let categoryId = await AsyncStorage.getItem('categoryId');
        let offerId = await AsyncStorage.getItem('offerId');
        let userData = JSON.parse(userDetail);

        const logedIn = await AsyncStorage.getItem('logedIn');
        const shopIdAsync = await AsyncStorage.getItem('shopId')
        const shopName = await AsyncStorage.getItem('shopName')
        this.setState({
            userData: userData,
        })
        this.getAllCategory()
        this.getMeasurement();

        if (null != logedIn && logedIn === 'true') {
            this.getCart(userData.userId)
            this.getUser(userData.userId)
        }


        this.getAllSubCategory();
        this.getAllBrand();
        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/item/getall/productonline/byshopid/' + AppConstants.SHOP_ID + '/true',
        }).then((response) => {
            if (null != response.data) {
                axios({
                    method: 'GET',
                    url: AppConstants.API_BASE_URL + '/api/itemlist/getall/variant/onlinebyshopid/' + AppConstants.SHOP_ID + '/true',
                }).then((response1) => {
                    if (null != response1.data) {
                        if (response.data && response.data != null && response1.data && response1.data != null) {
                            var data = []
                            for (var i = 0; i < response.data.length; i++) {
                                var data1 = []
                                var data2 = []
                                data1.push(response.data[i])
                                for (var j = 0; j < response1.data.length; j++) {
                                    if (response.data[i].id == response1.data[j].productId) {
                                        data2.push(response1.data[j])
                                    }
                                }
                                data1[0].itemList = data2
                                data.push(data1[0])
                            }
                            this.setState({
                                productWithVariant: data
                            })
                        }
                    }
                }, (error) => {
                    Alert.alert("Server error!.")
                });
            }
        }, (error) => {
            Alert.alert("Server error!.")
        });
    }

    getAllCategory() {
        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/category/getcategoryforuserbyshopid/' + AppConstants.SHOP_ID,
        }).then((response) => {
            if (null != response.data) {
                this.setState({
                    allCategory: response.data
                })
            }
        }, (error) => {
            Alert.alert("Server error!.")
        });
    }

    logOut() {
        this.props.navigation.navigate(AppRoute.AUTH)
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });
    }

    getUser(userId: any) {
        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/user/get/' + userId
        }).then((response: any) => {
            if (null != response.data) {
                this.setState({
                    user: response.data,
                    logedIn: true
                })
            }
        }, (error: any) => {
            console.log(error)
            // Alert.alert("Server error.")
        });
    }

    addToCart(productId) {
        const { shopId, logedIn, userData } = this.state
        if (null != logedIn && logedIn) {
            // Alert.alert('' + userData.userId + productId + logedIn + shopId)
            axios({
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
                    console.log("Data", response.data)
                    if (response.data.status === 'true') {
                        Alert.alert("Product added to cart.")
                        this.getCart(userData.userId)
                    } else {
                        Alert.alert("Product allready exists in your cart.")
                    }
                }
            }, (error) => {
                // console.log(error)
                // Alert.alert("Server error.")
            });
        } else {
            const pushAction = StackActions.push(AppRoute.AUTH)
            this.props.navigation.dispatch(pushAction);
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
            // Alert.alert("Server error.")
        });
    }

    getAllSubCategory() {
        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/subcategory/getall'
        }).then((response: any) => {
            if (null != response.data) {
                this.setState({
                    subCategory: response.data
                })
            }
        }, (error: any) => {
            console.log(error)
            // Alert.alert("Server error.")
        });
    }

    getAllBrand() {
        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/itemlist/getall/variant/onlinebyshopid/' + AppConstants.SHOP_ID + '/true',
        }).then((response: any) => {
            if (null != response.data) {
                this.setState({
                    allBrand: response.data
                })
            }
        }, (error: any) => {
            console.log(error)
            // Alert.alert("Server error.")
        });
    }

    handleRecall() {
        Alert.alert("Recall")
    }

    // renderProduct = ({ item }: any): ListItemElement => { 
    //     const { allBrand, allVariant, allMeasurement } = this.props
    //     const { name, refreshing } = this.state
    //     return(
    //     <ListItem style={{ borderBottomColor: 'rgba(200, 200, 200, 1)', borderBottomWidth: scale(1) }}>
    //          <View>
    //                     {null != allMeasurement ?
    //                         <List data={allMeasurement}
    //                             horizontal={true}
    //                             showsHorizontalScrollIndicator={false}
    //                             // refreshControl={
    //                             //     <RefreshControl
    //                             //         refreshing={refreshing}
    //                             //         onRefresh={this._onRefresh.bind(this)}
    //                             //     />}
    //                             renderItem={this.renderProduct1}
    //                         // onEndReached={() => { this.handleRecall() }}
    //                         /> : null}
    //                 </View>
    //     </ListItem>
    // )}

    navigateProductDetail(id, shopId) {
        // console.log("Check", id, shopId)
        AsyncStorage.setItem("categoryId", String(id))
        const resetAction = CommonActions.reset({
            index: 0,
            routes: [
                { name: AppRoute.PRODUCT_LIST }
            ],
        });
        this.props.navigation.dispatch(resetAction)
    }

    navigateToCart() {
        // Alert.alert("")
        const pushAction = StackActions.push(AppRoute.CART);
        this.props.navigation.dispatch(pushAction);
        // this.props.navigation.navigate(AppRoute.CART);
    }

    navigateProductOffer(id) {
        // console.log("Check", id, shopId)
        AsyncStorage.setItem("offerId", String(id))
        const resetAction = CommonActions.reset({
            index: 0,
            routes: [
                { name: AppRoute.PRODUCT_LIST }
            ],
        });
        this.props.navigation.dispatch(resetAction)
    }

    getCart(userId) {
        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + "/api/cart/get/cartby/shopid/userid/" + AppConstants.SHOP_ID + '/' + userId,
        }).then((response) => {
            if (null != response.data) {
                if (response.data[0].productList.length > 0) {
                    this.setState({
                        isCart: true
                    })
                }

                this.setState({
                    allCart: response.data
                })
            }
        }, (error) => {
            Alert.alert("Server error!.")
        });
    }

    handleIncrease(productId, cartId) {
        const { user } = this.state
        axios({
            method: 'PUT',
            url: AppConstants.API_BASE_URL + '/api/cart/cartincrease/' + cartId + '/' + productId
        }).then((response) => {
            this.getCart(user.userId)
        }, (error) => {
            Alert.alert("Server problem")
        })
    }

    handleDecrease(productId, cartId, quantity) {
        const { user } = this.state
        if (quantity <= 1) {
            Alert.alert("You have already selected minimum quantity.")
        } else {
            axios({
                method: 'PUT',
                url: AppConstants.API_BASE_URL + '/api/cart/cartdecrease/' + cartId + '/' + productId
            }).then((response) => {
                this.getCart(user.userId)
            }, (error) => {
                Alert.alert("Server problem")
            })
        }
    }

    renderCategory = ({ item }: any): ListItemElement => (
        <ListItem style={{ borderBottomColor: 'rgba(200, 200, 200, 1)', borderBottomWidth: scale(1) }}>
            <View style={Styles.category_card}>
                <Pressable onPress={() => { this.navigateProductDetail(item.id, item.shopId) }}>
                    <View style={[Styles.cat_card_img, Styles.center]}>
                        <Image
                            resizeMethod='auto'
                            resizeMode='stretch'
                            source={{ uri: AppConstants.IMAGE_BASE_URL + '/category/' + item.id + "_" + item.shopId + '_category.png' }}
                            style={Styles.cat_card_avatar}
                        />
                    </View>
                </Pressable>
                <View style={{ position: 'absolute', width: '100%', alignItems: 'center' }}>
                    {/* <Text style={{ fontSize: scale(15), fontWeight: '600', color: '#000' }}>{item.name}</Text> */}
                </View>
            </View>
        </ListItem>
    )

    renderCategory1 = ({ item }: any): ListItemElement => (
        <ListItem style={{ borderBottomColor: 'rgba(200, 200, 200, 1)', borderBottomWidth: scale(1) }}>
            <Pressable onPress={() => { this.navigateProductDetail(item.id, item.shopId) }}>
                <Text style={{ fontSize: scale(13), fontWeight: '400', borderWidth: 1, borderColor: Color.SILVER, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, color: '#000' }}>{item.name}</Text>
            </Pressable>
        </ListItem>
    )

    renderOffer = ({ item }: any): ListItemElement => (
        <ListItem style={{ borderBottomColor: 'rgba(200, 200, 200, 1)', borderBottomWidth: scale(1) }}>
            <View style={Styles.category_card}>
                <Pressable onPress={() => { this.navigateProductOffer(item.id) }}>
                    <View style={[Styles.cat_card_img, Styles.center]}>
                        <Image
                            resizeMethod='auto'
                            resizeMode='stretch'
                            source={{ uri: AppConstants.IMAGE_BASE_URL + '/offer/' + item.image }}
                            style={Styles.cat_card_avatar}
                        />
                    </View>
                </Pressable>
                <View style={{ position: 'absolute', width: '100%', alignItems: 'center' }}>
                    {/* <Text style={{ fontSize: scale(15), fontWeight: '600', color: '#000' }}>{item.name}</Text> */}
                </View>
            </View>
        </ListItem>
    )

    async handleAddToCart(productId, productName, itemList) {
        const { userData } = this.state;
        const logedIn = await AsyncStorage.getItem('logedIn');

        if (itemList.length > 0) {
            this.setState({
                temp_variant: itemList,
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
                this.getUser(userData.userId)
                this.setState({
                    isSelectedWish: !isSelectedWish
                })
            }, (error) => {
                Alert.alert("Server error.")
            });
        } else {
            this.props.navigation.navigate(AppRoute.AUTH);
        }
    }


    renderProduct = ({ item }: any): ListItemElement => (
        item.itemList != null && item.itemList.length > 0 ?
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
                                                    style={this.state.logedIn && this.state.user.wishList != null && this.state.user.wishList.includes(item.id) ?
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
                                    {this.state.allMeasurement.length > 0 ? this.state.allMeasurement.map((brand, index) => {
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

                                <TouchableOpacity onPress={() => { this.handleAddToCart(item.id, item.name, item.itemList) }}>
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

    renderVariant = ({ item }: any): ListItemElement => {
        var count = 0;
        return (
            <ListItem style={{ borderBottomColor: 'rgba(2,15,20,0.10)', borderBottomWidth: 1 }}>
                {item != null ?
                    <View style={Styles.variant_main_view}>
                        <View style={Styles.variant_view_1}>
                            <View style={Styles.variant_price_view}>
                                <View style={{ width: '55%', flexDirection: "column" }}>
                                    {this.state.allMeasurement.length > 0 ? this.state.allMeasurement.map((brand, index) => {
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

                                    {item.stock ? item.stock > 0 ?
                                        this.state.logedIn ?
                                            this.state.allCart != '' && this.state.allCart.length > 0 ?
                                                this.state.allCart[0].productList != null && this.state.allCart[0].productList.length > 0 ?
                                                    this.state.allCart[0].productList.map((data, index) => {
                                                        if (data.productId == item.id) {
                                                            if (count == 0) {
                                                                count++
                                                                return (
                                                                    <>
                                                                        <View style={Styles.cart_quantity_view}>
                                                                            <Pressable onPress={() => { this.handleDecrease(item.id, data.cartId, data.productQuantity) }} style={Styles.cart_button}>
                                                                                <Text style={Styles.cart_button_text}><MinusIcon /></Text>
                                                                            </Pressable>

                                                                            <View style={Styles.cart_quantity_text_view}>
                                                                                <Text style={Styles.cart_quantity_text}>{data.productQuantity}</Text>
                                                                            </View>

                                                                            <Pressable style={Styles.cart_button} onPress={() => { this.handleIncrease(item.id, data.cartId) }}>
                                                                                <Text style={Styles.cart_button_text} ><AddIcon /></Text>
                                                                            </Pressable>
                                                                        </View>
                                                                    </>
                                                                )
                                                            }
                                                        } else if (count < 1 && index == this.state.allCart[0].productList.length - 1) {
                                                            return (
                                                                <View style={Styles.cart_quantity_view}>
                                                                    <Pressable onPress={() => { this.addToCart(item.id) }}>
                                                                        <View style={{ paddingHorizontal: scale(2), alignItems: 'center', justifyContent: 'center' }}>
                                                                            <Text style={{ color: 'white', padding: scale(5) }} >Add To Cart</Text>
                                                                        </View>
                                                                    </Pressable>
                                                                </View>
                                                            )
                                                        }
                                                    }) :
                                                    <View style={Styles.cart_quantity_view}>
                                                        <Pressable onPress={() => { this.addToCart(item.id) }}>
                                                            <View style={{ paddingHorizontal: scale(2), alignItems: 'center', justifyContent: 'center' }}>
                                                                <Text style={{ color: 'white', padding: scale(5) }} >Add To Cart</Text>
                                                            </View>
                                                        </Pressable>
                                                    </View> :
                                                <View style={Styles.cart_quantity_view}>
                                                    <Pressable onPress={() => { this.addToCart(item.id) }}>
                                                        <View style={{ paddingHorizontal: scale(2), alignItems: 'center', justifyContent: 'center' }}>
                                                            <Text style={{ color: 'white', padding: scale(5) }} >Add To Cart</Text>
                                                        </View>
                                                    </Pressable>
                                                </View> :
                                            <View style={Styles.cart_quantity_view}>
                                                <Pressable onPress={() => { this.addToCart(item.id) }}>
                                                    <View style={{ paddingHorizontal: scale(2), alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={{ color: 'white', padding: scale(5) }} >Add To Cart</Text>
                                                    </View>
                                                </Pressable>
                                            </View> :
                                        <View style={Styles.cart_quantity_view}>
                                            <Pressable onPress={() => { this.addToCart(item.id) }}>
                                                <View style={{ paddingHorizontal: scale(2), alignItems: 'center', justifyContent: 'center' }}>
                                                    <Text style={{ color: 'white', padding: scale(5) }} >Add To Cart</Text>
                                                </View>
                                            </Pressable>
                                        </View> :
                                        <View style={{ paddingHorizontal: scale(2), alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ color: 'white' }}>Out of Stock</Text>
                                        </View>
                                    }
                                </View>
                            </View>
                            {item.offersAvailable ?
                                <View>
                                    <Text style={Styles.cart_offer_text}>{item.offer}% off</Text>
                                </View> : null
                            }
                        </View>
                        {
                            item.offersAvailable ?
                                <View>
                                    <Text style={[Styles.cart_offer_text, { marginLeft: 10 }]}>{item.offersAvailable} offers available</Text>
                                </View> : null
                        }
                    </View >
                    :
                    <ActivityIndicator size='large' color='green' />
                }

            </ListItem>
        )
    }

    render() {
        // const { allBrand, allVariant, allMeasurement, allCategory } = this.props        
        const { allProduct, allBrand, offers, temp_variant, productName, searchVisible1, variantVisible,
            searchTerm, isCart, shopName, single, searchVisible, location, lat, long, refreshing,
            shopId, search, allCategory, wishList, selectedBrand, selectedCategory, allCart,
            subCategory, productWithVariant } = this.state;
        return (
            <SafeAreaLayout
                style={styles.safeArea}
                insets={SaveAreaInset.TOP}>
                <Modal isVisible={variantVisible}>
                    <View style={Styles.variant_modal}>
                        <View style={Styles.varient_modalHeader}>
                            <Text style={{ fontSize: scale(20), fontWeight: '400' }}>{productName}</Text>
                            <TouchableOpacity>
                                <Text onPress={() => { this.setState({ variantVisible: false }); }}><CancelIcon fontSize={25} /></Text>
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
                <Toolbar
                    title='All Category'
                    backIcon={MenuIcon}
                    onBackPress={this.props.navigation.toggleDrawer}
                />
                <Divider />
                <ScrollView>
                    <View style={{ borderTopWidth: scale(1), borderTopColor: Color.SILVER, paddingTop: scale(10) }}>
                        <Text style={{ fontSize: scale(15), color: '#000', fontWeight: '600' }}>Category</Text>
                        {null != allCategory ?
                            <>
                                <List data={allCategory}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={this.renderCategory1}
                                />
                                <List data={allCategory}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={this.renderCategory}
                                />
                            </> : null}
                    </View>

                    <View style={{ marginTop: scale(10) }}>
                        <Text style={{ fontSize: scale(15), color: '#000', fontWeight: 'bold' }}>All Offers</Text>
                        {null != offers ?
                            <List data={offers}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                renderItem={this.renderOffer}
                            /> : null}
                    </View>
                    {null != productWithVariant ?
                        <List data={productWithVariant}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                                />}
                            renderItem={this.renderProduct}
                        // onEndReached={() => this.props.setProductVariant({ shopId: AppConstants.SHOP_ID, from: productVariant.length, to: productVariant.length + 10 })}
                        />
                        : null}
                </ScrollView>
                {isCart ?
                    <Pressable style={[Styles.bottom_tab_bar, { flexDirection: 'row', paddingTop: scale(10) }]} onPress={() => { this.navigateToCart() }}>
                        <View style={[Styles.center, { flexDirection: 'row', width: '50%', paddingTop: 10 }]}>
                            <Text style={Styles.bottom_view_cart_text}>View Cart </Text>
                            <View style={[Styles.center, { backgroundColor: Color.BUTTON_NAME_COLOR, width: scale(30), height: scale(30), borderRadius: 20, marginTop: -30 }]}>
                                <Text style={{ fontSize: scale(13), color: Color.COLOR }}>{allCart != null && allCart != '' ? allCart[0].productList.length : 0}</Text>
                            </View>
                        </View>
                        <View style={{ height: '100%', width: scale(1), backgroundColor: Color.BUTTON_NAME_COLOR }} />
                        <View style={[Styles.center, { width: '50%' }]}>
                            <Text style={{ fontSize: scale(15), color: Color.BUTTON_NAME_COLOR }}>Rs. {allCart != null && allCart != '' ? allCart[0].payableAmount : 0}</Text>
                        </View>
                    </Pressable>
                    : null
                }
            </SafeAreaLayout>
        );
    }
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 30,
        color: '#000',
        fontWeight: '500'
    }
});

interface LinkStateProps {
    allBrand: Brand[];
    allVariant: Varient[];
    allMeasurement: Measurement[];
    allCategory: Category[];
}

interface LinkDispatchProps {
    fetchBrandByShopId: (shopId: String) => void;
    fetchVarientByShopId: (shopId: String) => void;
    fetchCategoryByShopId: (shopId: String) => void;
    fetchMeasurementByShopId: (shopId: String) => void;
}

const mapStateToProps = (
    state: AppState,
    ownProps: ShopPageProps
): LinkStateProps => ({
    allBrand: state.brandReducers.allBrand,
    allVariant: state.varientReducers.allVarient,
    allMeasurement: state.measurementReducers.measurementData,
    allCategory: state.categoryReducers.allCategory
});

const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AppActions>,
    ownProps: ShopPageProps
): LinkDispatchProps => ({
    fetchBrandByShopId: bindActionCreators(fetchBrandByShopId, dispatch),
    fetchVarientByShopId: bindActionCreators(fetchVarientByShopId, dispatch),
    fetchMeasurementByShopId: bindActionCreators(fetchMeasurementByShopId, dispatch),
    fetchCategoryByShopId: bindActionCreators(fetchCategoryByShopId, dispatch)
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type CategoryListProps = ConnectedProps<typeof connector>;
export const CategoryListScreen = connector(CategoryList)