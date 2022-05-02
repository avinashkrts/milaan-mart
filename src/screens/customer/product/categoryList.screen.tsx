import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, StackActions } from '@react-navigation/core';
import { Avatar, Divider, List, ListItem, ListItemElement, ThemedComponentProps } from '@ui-kitten/components';
import axios from 'axios';
import React, { Component } from 'react';
import { SliderBox } from "react-native-image-slider-box";
import {
    ActivityIndicator,
    Alert,
    BackHandler,
    Image,
    Keyboard,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Modal from 'react-native-modal';
import { scale } from 'react-native-size-matters';

import { AddIcon, CancelIcon, MenuIcon, MinusIcon, RightArrowIcon, RupeeIcon, SearchIcon, WishIcon } from '../../../assets/icons';
import { Styles } from '../../../assets/styles';
import { CategoryCard } from '../../../components/categoryCard';
import { SafeAreaLayout, SaveAreaInset } from '../../../components/safe-area-layout.component';
import { Toolbar } from '../../../components/toolbar.component';
import { AppConstants, Color } from '../../../constants';
import { LableText } from '../../../constants/LabelConstants';
import { AppRoute } from '../../../navigation/app-routes';
import { OfferData, FilterType } from './offerData';
import { createFilter } from 'react-native-search-filter';
import { TopButton, TopButtonSelected } from '../../../components/topButton';
import { CategoryProductDetailScreenProps, CategoryListScreenProps } from '../../../navigation/customer-navigator/category-list.navigator';

type Props = CategoryListScreenProps & ThemedComponentProps & CategoryProductDetailScreenProps
const KEYS_TO_FILTERS = ['name'];
export class CategoryListScreen extends Component<Props & any, any> {
    backHandler: any;
    constructor(props: Props) {
        super(props);
        this.state = {
            name: '',
            allBrand: [],
            refreshing: false,
            productWithVariant: [],
            allProductWithVariant: [],
            tempProductWithVariant: [],
            offers: OfferData,
            searchTerm: '',
            isEnd: false,
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
            isProduct: false,
            user: [],
            allVarient: [],
            logedIn: false,
            variantVisible: false,
            temp_variant: [],
            productName: '',
            subCategory: [],
            allImages: [],
            searched: false,
            slectedFilter: 1,
            searchData: [],
            allSearchData: [],
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
        this.initialData = this.initialData.bind(this);
        this.renderProduct = this.renderProduct.bind(this);
        this.renderVariant = this.renderVariant.bind(this);
        this.navigateProductDetail1 = this.navigateProductDetail1.bind(this);
    }

    getProduct() {
        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/item/get/onlinecategory/' + 1 + '/true',
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
                                productWithVariant: data,
                                allProductWithVariant: data
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
        this.handleBackButton();
        this.initialData();
        this.props.navigation.addListener('blur', () => {
            if (this.backHandler) {
                this.backHandler.remove();
            }
        })

        this.props.navigation.addListener('focus', () => {
            this.setState({
                isCart: false
            })
            this.initialData()
        })
    }

    async initialData() {
        let userDetail = await AsyncStorage.getItem('userDetail');
        let categoryId = await AsyncStorage.getItem('categoryId');
        let offerId = await AsyncStorage.getItem('offerId');
        let userData = JSON.parse(userDetail);
        var image: any = [];
        const logedIn = await AsyncStorage.getItem('logedIn');
        const shopIdAsync = await AsyncStorage.getItem('shopId');
        const shopName = await AsyncStorage.getItem('shopName');
        this.state.offers.map((data, i) => {
            image.push(AppConstants.IMAGE_BASE_URL + '/offer/' + data.image)
        })
        this.setState({
            userData: userData,
            allImages: image,
            searched: false,
            searchTerm: ''
        })

        this.getProduct();
        this.getAllCategory();
        this.getMeasurement();

        if (null != logedIn && logedIn === 'true') {
            this.getCart(userData.userId)
            this.getUser(userData.userId)
        }

        this.getAllSubCategory();
        this.getAllBrand();
    }

    loadData() {
        console.log("qqq")
        this.setState({
            isEnd: true
        })
        const { productWithVariant, tempProductWithVariant } = this.state
        var last = tempProductWithVariant.length + 10
        var data = []
        for (var i = 0; i <= last; i++) {
            data.push(productWithVariant[i])
        }
        this.setState({
            tempProductWithVariant: data,
            isEnd: false
        })
    }

    getAllCategory() {
        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/category/getallonline/1',
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
        this.initialData().then(() => {
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
            url: AppConstants.API_BASE_URL + '/api/subcategory/getallonline/byshopid/MILAAN63/1'
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
            url: AppConstants.API_BASE_URL + '/api/brand/getallonline/brand/1',
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

    navigateProductDetail1(id, shopId) {
        // this.props.navigation.navigate(AppRoute.CUSTOMER_CATEGORY_PRODUCT_DETAIL, { productId: String(id), shopId: String(shopId) });
        const pushAction = StackActions.push(AppRoute.CUSTOMER_CATEGORY_PRODUCT_DETAIL, { productId: String(id), shopId: String(shopId) });
        this.props.navigation.dispatch(pushAction)
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

    handleIncrease(productId, cartId, quantity, stock) {
        const { user } = this.state

        if (quantity >= stock) {
            Alert.alert(`Only ${stock} product left.`)
        } else {
            axios({
                method: 'PUT',
                url: AppConstants.API_BASE_URL + '/api/cart/cartincrease/' + cartId + '/' + productId
            }).then((response) => {
                this.getCart(user.userId)
            }, (error) => {
                Alert.alert("Server problem")
            })
        }
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
        <ListItem key={item} style={{ borderBottomColor: 'rgba(200, 200, 200, 1)', borderBottomWidth: scale(1) }}>
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
                <View style={{ width: '100%', alignItems: 'center' }}>
                    <Text style={{ fontSize: scale(15), fontWeight: '600', color: '#000' }}>{item.name}</Text>
                </View>
            </View>
        </ListItem>
    )

    renderCategory1 = ({ item }: any): ListItemElement => (
        <ListItem key={item} style={{ borderBottomColor: 'rgba(200, 200, 200, 1)', borderBottomWidth: scale(1) }}>
            <Pressable onPress={() => { this.navigateProductDetail(item.id, item.shopId) }}>
                <Text style={{ fontSize: scale(13), fontWeight: '400', borderWidth: 1, borderColor: Color.SILVER, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, color: '#000' }}>{item.name}</Text>
            </Pressable>
        </ListItem>
    )

    renderOffer = ({ item }: any): ListItemElement => (
        <ListItem key={item} style={{ borderBottomColor: 'rgba(200, 200, 200, 1)', borderBottomWidth: scale(1) }}>
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
            <ListItem style={{ borderBottomColor: 'rgba(200, 200, 200, 1)', borderBottomWidth: scale(1), paddingVertical: -5 }}>
                <View style={Styles.product_list_main}>
                    <View style={Styles.product_list_img}>
                        <Pressable onPress={() => { this.navigateProductDetail1(item.id, item.shopId) }}>
                            <View style={[Styles.all_Item_Image_2, Styles.center]}>
                                <Avatar source={{ uri: AppConstants.IMAGE_BASE_URL + '/product/' + item.productImage }} style={Styles.product_avatar} />
                            </View>
                        </Pressable>
                    </View>
                    <View style={Styles.product_list_detail}>
                        <View style={Styles.all_Item_List1}>
                            <View style={Styles.all_Item_Detail}>
                                <View style={{ backgroundColor: '#fff', paddingHorizontal: 0 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        {/* {null != this.state.allBrand ? this.state.allBrand.map((brand, index) => {
                          if (brand.id == item.brand) {
                            return ( */}
                                        <View style={{ width: '80%', flexWrap: 'wrap', flexDirection: 'row' }}>
                                            <Text style={{ color: '#000', fontFamily: 'notoserif', fontWeight: '600', marginTop: scale(5), fontSize: scale(12) }}>{item.name}</Text>
                                        </View>
                                        {/* );
                          }
                        }) : null} */}
                                        {/* {this.props.userData != null && this.props.userData.length > 0 ? */}
                                        <View style={[Styles.product_2nd_wish_view]}>
                                            <TouchableOpacity onPress={() => { this.handleWishList(item.id) }}>
                                                <Text
                                                    style={this.state.logedIn && this.state.user.wishList != null && this.state.user.wishList.split(',').some((wishData) => (wishData == item.id)) ? Styles.selected_wish_icon : Styles.wish_icon
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
                                                    <Text style={{ fontFamily: 'notoserif', color: Color.COLOR_ITEM_NAME, marginTop: 5 }}>{item.itemList[0].unitQuantity} {brand.name}</Text>
                                                </>
                                            );
                                        }
                                    }) : null}
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                        <Text style={Styles.old_price_text}>MRP {item.itemList[0].mrp.toFixed(2)}</Text>
                                        <Text style={{ color: '#000', fontWeight: '600', fontSize: scale(14) }}><RupeeIcon fontSize={scale(14)} />{item.itemList[0].unitSellingPrice}/pc</Text>
                                        <Text style={[{ fontFamily: 'notoserif' }, Styles.offer_price_text]}>
                                            {Math.round(item.itemList[0].customerSingleOffer)}% off
                                        </Text>
                                        {/* {item.offerActiveInd ?
                          <Text style={{ color: Color.COLOR, fontSize: 20, textDecorationLine: 'line-through' }}>{item.oldPrice}</Text>
                          : null
                        } */}
                                    </View>
                                    {item.itemList[0].bundleQuantity > 1 ?
                                        <Text style={{ fontSize: scale(12), color: Color.OFFER }} >
                                            <RupeeIcon fontSize={scale(14)} />{(item.itemList[0].bundlePrice / item.itemList[0].bundleQuantity).toFixed(2)}/pc (Buy {item.itemList[0].bundleQuantity} or more)</Text> : null}
                                    {/* {null != item.offerActiveInd ? item.offerActiveInd ?
    
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                          <Text style={{ fontFamily: 'notoserif', color: Color.COLOR }}>{item.offerPercent} % off</Text>
                          <Text style={{ fontFamily: 'notoserif', color: Color.COLOR }}>{item.offerActiveInd && item.offerTo ? item.offerTo.substr(8, 2) + "/" + item.offerTo.substr(5, 2) + "/" + item.offerTo.substr(0, 4) : null}</Text>
                        </View> :
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                          <Text style={{ fontFamily: 'notoserif', color: Color.COLOR, marginTop: 2.5 }}></Text>
                          <Text style={{ fontFamily: 'notoserif', color: Color.COLOR }}></Text>
                        </View> : null
                      } */}
                                </View>
                                <View style={{ justifyContent: 'flex-end', width: '100%', flex: 1, flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() => { this.handleAddToCart(item.id, item.name, item.itemList) }}>
                                        <View style={[{ backgroundColor: Color.COLOR, marginVertical: 5, alignSelf: 'center', paddingVertical: scale(5), borderRadius: 5, paddingHorizontal: scale(10) }, Styles.center]}>
                                            <Text style={{ fontFamily: 'notoserif', color: Color.BUTTON_NAME_COLOR }}>Add to cart</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
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
        const { allCart } = this.state
        return (
            <ListItem style={{ borderBottomColor: 'rgba(0,0,0,1)', borderBottomWidth: 1 }}>
                {item != null ?
                    <View style={Styles.variant_main_view}>
                        <View style={Styles.variant_view_1}>
                            <View style={Styles.variant_price_view}>
                                <View style={{ width: '55%', flexDirection: "column" }}>
                                    {/* <Text>{allCart != null && allCart.length > 0 ? allCart[0].productList != null ? allCart[0].productList.length : null : null} Data</Text> */}

                                    {this.state.allMeasurement.length > 0 ? this.state.allMeasurement.map((brand, index) => {
                                        if (brand.id == item.measurement) {
                                            return (
                                                <View>
                                                    <Text style={{ fontSize: scale(14), fontFamily: 'notoserif' }}>{item.unitQuantity} {brand.name}</Text>
                                                </View>
                                            );
                                        }
                                    }) : null}
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={Styles.old_price_text}>MRP {item.mrp.toFixed(2)}</Text>
                                        <Text style={Styles.price_text}><RupeeIcon fontSize={scale(14)} />{item.unitSellingPrice.toFixed(2)}</Text>
                                    </View>
                                    <View>
                                        <Text style={Styles.offer_price_text}>
                                            {Math.round(item.customerSingleOffer)}% off
                                        </Text>
                                        {item.bundleQuantity > 1 ? <Text style={{ fontSize: scale(12), color: Color.OFFER }} ><RupeeIcon fontSize={scale(14)} />{(item.bundlePrice / item.bundleQuantity).toFixed(2)}/pc (Buy {item.bundleQuantity} or more)</Text> : null}
                                    </View>
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

                                                                            <Pressable style={Styles.cart_button} onPress={() => { this.handleIncrease(item.id, data.cartId, data.productQuantity, item.stock) }}>
                                                                                <Text style={Styles.cart_button_text} ><AddIcon /></Text>
                                                                            </Pressable>
                                                                        </View>
                                                                    </>
                                                                )
                                                            }
                                                        } else if (count < 1 && index == this.state.allCart[0].productList.length - 1) {
                                                            return (
                                                                <View style={Styles.cart_quantity_view}>
                                                                    <Pressable onPress={() => { this.addToCart(item.id, item.productId) }}>
                                                                        <View style={{ paddingHorizontal: scale(2), alignItems: 'center', justifyContent: 'center' }}>
                                                                            <Text style={{ color: 'white', padding: scale(5) }} >Add To Cart</Text>
                                                                        </View>
                                                                    </Pressable>
                                                                </View>
                                                            )
                                                        }
                                                    }) :
                                                    <View style={Styles.cart_quantity_view}>
                                                        <Pressable onPress={() => { this.addToCart(item.id, item.productId) }}>
                                                            <View style={{ paddingHorizontal: scale(2), alignItems: 'center', justifyContent: 'center' }}>
                                                                <Text style={{ color: 'white', padding: scale(5) }} >Add To Cart</Text>
                                                            </View>
                                                        </Pressable>
                                                    </View> :
                                                <View style={Styles.cart_quantity_view}>
                                                    <Pressable onPress={() => { this.addToCart(item.id, item.productId) }}>
                                                        <View style={{ paddingHorizontal: scale(2), alignItems: 'center', justifyContent: 'center' }}>
                                                            <Text style={{ color: 'white', padding: scale(5) }} >Add To Cart</Text>
                                                        </View>
                                                    </Pressable>
                                                </View> :
                                            <View style={Styles.cart_quantity_view}>
                                                <Pressable onPress={() => { this.addToCart(item.id, item.productId) }}>
                                                    <View style={{ paddingHorizontal: scale(2), alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={{ color: 'white', padding: scale(5) }} >Add To Cart</Text>
                                                    </View>
                                                </Pressable>
                                            </View> :
                                        <View style={Styles.cart_quantity_view}>
                                            <Pressable onPress={() => { this.addToCart(item.id, item.productId) }}>
                                                <View style={{ paddingHorizontal: scale(2), alignItems: 'center', justifyContent: 'center' }}>
                                                    <Text style={{ color: 'white', padding: scale(5) }} >Add To Cart</Text>
                                                </View>
                                            </Pressable>
                                        </View> :
                                        <View style={[Styles.cart_quantity_view, { paddingHorizontal: scale(2), alignItems: 'center', justifyContent: 'center' }]}>
                                            <Text style={{ color: 'white' }}>Out of Stock</Text>
                                        </View>
                                    }
                                </View>
                            </View>
                        </View>
                    </View >
                    :
                    <ActivityIndicator size='large' color='green' />
                }

            </ListItem>
        )
    }

    searchUpdated(term) {
        this.setState({
            searchTerm: term,
            searchVisible1: false,
            searched: false,
            isProduct: false
        })
    }

    productSearch(filteredProduct) {
        const { allProductWithVariant, searchTerm } = this.state
        var filteredProduct1 = []
        filteredProduct1 = allProductWithVariant ? allProductWithVariant.length > 0 ? allProductWithVariant.filter(createFilter(filteredProduct, KEYS_TO_FILTERS)) : null : null
        if (filteredProduct1 != null) {
            if (filteredProduct1.length > 0) {
                if (searchTerm != '' && searchTerm != null) {
                    this.setState({
                        productWithVariant: []
                    })
                    this.getAllFilteredProduct(filteredProduct1)
                    Keyboard.dismiss();
                } else {
                    Alert.alert("Please type product name to search")
                }
            } else {
                Alert.alert("No product found.")
                this.setState({
                    searchTerm: ''
                })
                this._onRefresh()
            }
        }
    }

    async getAllFilteredProduct(product) {
        var tempProd: any = []
        await product.map((data) => {
            tempProd.push(data)
        });
        this.setState({
            productWithVariant: tempProd
        })
        // tempProd.push(product[0])
        if (tempProd.length > 0) {
            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/item/getitem/online/' + product[0].subCategoryId + '/true',
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
                                    tempProd.push(data1[0])
                                }
                                this.setState({
                                    productWithVariant: tempProd,
                                })
                                // console.log('222', data)

                                // tempProd.concat(data)
                            }
                        }
                    }, (error) => {
                        Alert.alert("Server error!.")
                    });
                }
            }, (error) => {
                Alert.alert("Server error!.")
            });

            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/item/get/onlinecategory/' + product[0].category + '/true'
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
                                    tempProd.push(data1[0])
                                    // console.log('wwww', data)
                                }

                                // console.log('wwww', data)
                                // tempProd.concat(data)
                                this.setState({
                                    productWithVariant: tempProd,
                                    searchVisible1: false,
                                    isProduct: true,
                                    searched: true,
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
        // console.log("data", tempProd)
        // this.setState({
        //     productWithVariant: tempProd,
        // })
    }

    search(search) {
        const { allProductWithVariant } = this.state
        var product: Object = []
        if (search.type === "PRODUCT") {
            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/item/getitem/online/' + search.subCategoryId + '/true',
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
                                    productWithVariant: data,
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

        } else if (search.type === "BRAND") {
            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/item/getitem/online/' + search.subCategoryId + '/true',
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
                                    productWithVariant: data,
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
        } else if (search.type === "CATEGORY") {
            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/item/get/onlinecategory/' + search.typeId + '/true'
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
                                    productWithVariant: data,
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
        } else if (search.type === "SUBCAT") {
            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/item/getitem/online/' + search.typeId + '/true',
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
                                    productWithVariant: data,
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

        this.setState({
            searchVisible1: false,
            searchTerm: search.searchKey,
            searched: true
        })
    }

    handleFilterType(type) {
        switch (type) {
            case "PROD":
                this.setState({ slectedFilter: 1 })
                break;
            case "CAT":
                this.setState({ slectedFilter: 2 })
                break;
            case "SCAT":
                this.setState({ slectedFilter: 3 })
                break;
            case "BRND":
                this.setState({ slectedFilter: 4 })
                break;
        }
    }

    render() {
        const { isEnd, searched, searchData, slectedFilter, productWithVariant, isProduct, offers, allImages, temp_variant, productName, variantVisible,
            isCart, refreshing, searchVisible1, searchTerm, allCategory, allCart } = this.state;
        var filteredProduct = searchData ? searchData.length > 0 ? searchData.filter(createFilter(searchTerm, KEYS_TO_FILTERS)) : null : null
        return (
            <SafeAreaLayout
                style={styles.safeArea}
                insets={SaveAreaInset.TOP}>

                <Modal isVisible={variantVisible}>
                    <View style={Styles.variant_modal}>
                        <View style={Styles.varient_modalHeader}>
                            <View style={{ width: '90%' }}>
                                <Text style={{ fontFamily: 'notoserif', fontSize: scale(14), fontWeight: '600' }}>{productName}</Text>
                            </View>
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
                                    <>
                                        {/* <Text>{allCart != null && allCart.length > 0 ? allCart[0].productList != null ? allCart[0].productList.length : null : null} Data</Text> */}
                                        <List
                                            data={temp_variant}
                                            renderItem={this.renderVariant}
                                            keyExtractor={(item) => item.id}
                                        />
                                    </>
                                    : null}
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

                {/* <MyDropdown
                    categoryClick={() => { }}
                    name="asd"
                >
                    <Text>Avinash</Text>
                </MyDropdown> */}
                <View style={[Styles.searchBox, { marginBottom: 0 }]}>
                    <TextInput
                        key={'search'}
                        placeholder="Search"
                        style={[Styles.searchInput_new]}
                        value={searchTerm}
                        onChangeText={(term) => { this.searchUpdated(term) }}
                        onFocus={() => { this.setState({ searchVisible1: false }) }}
                    />

                    <View style={[{ width: '10%' }, Styles.center]}>
                    </View>
                    <View style={[{ width: '10%' }, Styles.center]}>
                        <TouchableOpacity onPress={() => { this.productSearch(searchTerm) }}>
                            <Text style={Styles.searchIcon}><SearchIcon /></Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {searchVisible1 && searchTerm != '' && searchTerm != null ?
                    <>
                        {/* <View style={{ width: '100%', paddingHorizontal: scale(5), justifyContent: 'space-between', flexDirection: 'row' }}>
                            {FilterType.map((type, index) => {
                                if (slectedFilter == type.id) {
                                    return (
                                        <TopButtonSelected onPress={() => {this.handleFilterType(type.title)}} title={type.name} />
                                    )
                                } else {
                                    return (
                                        <TopButton onPress={() => {this.handleFilterType(type.title)}} title={type.name} />
                                    )
                                }
                            })}
                        </View> */}
                        {/* <ScrollView>
                            {searchTerm != '' && searchTerm != null && filteredProduct ? filteredProduct.map((product, i) => {
                                return (
                                    <Pressable onPress={() => { this.search(product) }} key={product.id} style={styles.emailItem}>
                                        <View>
                                            <Text>{product.searchKey}</Text>
                                            <Text style={{ color: 'black', fontSize: scale(11) }}>Search by {product.type === "SUBCAT" ? "SUB CATEGORY" : product.type}</Text>
                                        </View>
                                    </Pressable>
                                )
                            }) : null}
                        </ScrollView> */}
                    </> :

                    <ScrollView
                        style={Styles.content}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={this._onRefresh.bind(this)}
                            />
                        }
                    >
                        {!searched ?
                            <View style={{ marginTop: scale(10) }}>
                                <Text style={{ fontSize: scale(15), color: '#000', fontWeight: 'bold' }}>All Offers</Text>
                                <View style={{ height: scale(130) }}>
                                    <View style={[Styles.product_image]}>
                                        <SliderBox
                                            ImageComponentStyle={{ height: '100%', width: '97%', borderRadius: 10, borderWidth: 1, borderColor: 'silver' }}
                                            autoplay
                                            circleLoop
                                            images={allImages}
                                            onCurrentImagePressed={index =>
                                                this.navigateProductOffer(index + 1)
                                            } />
                                    </View>
                                </View>
                                {/* {null != offers ?
                            <List data={offers}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                renderItem={this.renderOffer}
                            /> : null} */}
                            </View> : null}

                        <View >
                            {!searched ?
                                <>
                                    <Text style={{ fontSize: scale(15), color: '#000', fontWeight: '600' }}>Shop By Category</Text>
                                    <View style={Styles.category_card_main}>
                                        {null != allCategory ?
                                            allCategory.map((item, index) => {
                                                return (
                                                    <CategoryCard
                                                        categoryClick={(id, shopId) => this.navigateProductDetail(id, shopId)}
                                                        index={index}
                                                        data={item}
                                                    />
                                                )
                                            })
                                            : null}
                                    </View>
                                    <Pressable onPress={() => { this.setState({ isProduct: !isProduct }) }}>
                                        <View style={{ backgroundColor: Color.DESCRIPTION_BACKGROUND, paddingHorizontal: scale(10), flexDirection: 'row', justifyContent: 'space-between', paddingVertical: scale(10) }}>
                                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>View More</Text>
                                            <Text style={{ marginTop: scale(5), }} ><RightArrowIcon fontSize={scale(15)} /></Text>
                                        </View>
                                    </Pressable>
                                </> : null}
                            {isProduct && null != productWithVariant ?
                                <List data={productWithVariant}
                                    renderItem={this.renderProduct}
                                    scrollEnabled={false}
                                    // onEndReached={() => { this.loadData() }}
                                    keyExtractor={item => item.id}
                                />
                                : null}
                            {!searched ?
                                <>
                                    <View style={{ marginTop: scale(10), paddingHorizontal: scale(5) }}>
                                        <View style={Styles.category_card}>
                                            {/* <Pressable onPress={() => { this.navigateProductOffer(item.id) }}> */}
                                            <View style={[Styles.cat_card_img, Styles.center]}>
                                                <Image
                                                    resizeMethod='auto'
                                                    resizeMode='stretch'
                                                    source={{ uri: AppConstants.IMAGE_BASE_URL + '/offer/' + offers[0].image }}
                                                    style={Styles.cat_card_avatar}
                                                />
                                            </View>
                                            {/* </Pressable> */}
                                            <View style={{ position: 'absolute', width: '100%', alignItems: 'center' }}>
                                                {/* <Text style={{ fontSize: scale(15), fontWeight: '600', color: '#000' }}>{item.name}</Text> */}
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ marginTop: scale(10), paddingHorizontal: scale(5) }}>
                                        <View style={Styles.category_card}>
                                            {/* <Pressable onPress={() => { this.navigateProductOffer(item.id) }}> */}
                                            <View style={[Styles.cat_card_img, Styles.center]}>
                                                <Image
                                                    resizeMethod='auto'
                                                    resizeMode='stretch'
                                                    source={{ uri: AppConstants.IMAGE_BASE_URL + '/offer/' + offers[1].image }}
                                                    style={Styles.cat_card_avatar}
                                                />
                                            </View>
                                            {/* </Pressable> */}
                                            <View style={{ position: 'absolute', width: '100%', alignItems: 'center' }}>
                                                {/* <Text style={{ fontSize: scale(15), fontWeight: '600', color: '#000' }}>{item.name}</Text> */}
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ marginVertical: scale(5), paddingHorizontal: scale(5) }}>
                                        <View style={Styles.category_card}>
                                            <View style={[Styles.cat_card_img, Styles.center]}>
                                                <Image
                                                    resizeMethod='auto'
                                                    resizeMode='stretch'
                                                    source={{ uri: AppConstants.IMAGE_BASE_URL + '/offer/' + offers[2].image }}
                                                    style={Styles.cat_card_avatar}
                                                />
                                            </View>
                                            <View style={{ position: 'absolute', width: '100%', alignItems: 'center' }}>
                                                {/* <Text style={{ fontSize: scale(15), fontWeight: '600', color: '#000' }}>{item.name}</Text> */}
                                            </View>
                                        </View>
                                    </View>
                                </> : null}
                        </View>
                    </ScrollView>}
                {isCart ?
                    <Pressable style={[Styles.bottom_tab_bar, { flexDirection: 'row', paddingTop: scale(0) }]} onPress={() => { this.navigateToCart() }}>
                        <View style={[Styles.center, { flexDirection: 'row', width: '50%', paddingTop: 0 }]}>
                            <Text style={Styles.bottom_view_cart_text}>View Cart </Text>
                            <View style={[Styles.center, { backgroundColor: Color.BUTTON_NAME_COLOR, width: scale(30), height: scale(30), borderRadius: 20, marginTop: 0 }]}>
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