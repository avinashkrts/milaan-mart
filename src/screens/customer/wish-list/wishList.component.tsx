import { StackActions } from '@react-navigation/core';
import { Avatar, Divider, List, ListItem, ListItemElement, Text, ThemedComponentProps } from '@ui-kitten/components';
import axios from 'axios';
import Axios from 'axios';
import React from 'react';
import {
    ActivityIndicator,
    Alert,
    AsyncStorage,
    Dimensions,
    Pressable,
    RefreshControl,
    ScrollView,
    TouchableOpacity,
    View,
} from 'react-native';
import Modal from 'react-native-modal';
import { scale } from 'react-native-size-matters';

import { AddIcon, CancelIcon, MenuIcon, MinusIcon, RupeeIcon } from '../../../assets/icons';
import { Styles } from '../../../assets/styles';
import { SafeAreaLayout, SaveAreaInset } from '../../../components/safe-area-layout.component';
import { Toolbar } from '../../../components/toolbar.component';
import { AppConstants } from '../../../constants/AppConstants';
import { Color } from '../../../constants/LabelConstants';
import { AppRoute } from '../../../navigation/app-routes';
import {
    WishListScreenProps,
    WishProductDetailScreenProps,
} from '../../../navigation/customer-navigator/wish-list.navigator';

// import VideoPlayer from 'react-native-video-player';
// import { FlatList } from 'react-native-gesture-handler';
// import SwipeHiddenHeader from 'react-native-swipe-hidden-header';
// import axios from 'axios';  
// import Container from '@react-navigation/core/lib/typescript/NavigationContainer';

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

type Props = WishProductDetailScreenProps & WishListScreenProps & ThemedComponentProps

export class WishListScreen extends React.Component<Props, MyState & any> {
    constructor(props: Props) {
        super(props)
        this.state = {
            productId: '',
            allProduct: [],
            allCategory: [],
            allBrand: [],
            selectedCategory: '',
            selectedBrand: '',
            shopId: AppConstants.SHOP_ID,
            allMeasurement: [],
            userData: [],
            single: false,
            allCart: [],
            shopName: '',
            temp_variant: [],
            logedIn: false,
            variantVisible: false,
            productName: ''
        }
        this._onRefresh = this._onRefresh.bind(this);
        this.navigateProductDetail = this.navigateProductDetail.bind(this);
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });
    }

    async componentDidMount() {
        SCREEN_WIDTH = Dimensions.get('window').width;
        const { allData } = this.state;

        let userDetail = await AsyncStorage.getItem('userDetail');
        const shopIdAsync = await AsyncStorage.getItem('shopId')
        const shopName = await AsyncStorage.getItem('shopName')
        let userData = JSON.parse(userDetail);
        // Alert.alert(""+shopId);
        // console.log("User Data",userData.userId)

        this.setState({
            userData: userData
        })

        const logedIn = await AsyncStorage.getItem('logedIn');
        if (null != logedIn && logedIn === 'true') {
            this.getCart(userData.userId)
            this.getUser(userData.userId)

            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/item/getproduct/wishlist/' + AppConstants.SHOP_ID + '/' + userData.userId,
            }).then((response) => {
                // console.log( response.data, 'ooo')
                this.setState({ allProduct: response.data })
            }, (error) => {
                this.setState({ allProduct: null })
                // Alert.alert("Server error.")
            });

            this.getAllBrand()
            this.getMeasurement()
        } else {
            this.props.navigation.navigate(AppRoute.AUTH)
        }

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

    getCart(userId: any) {
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

    async handleAddTocart(productId, shopId) {
        const { userData } = this.state;
        const logedIn = await AsyncStorage.getItem('logedIn');
        if (null != logedIn && logedIn === 'true') {
            // Alert.alert(''+ userData.userId + productId + logedIn)
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
                        axios({
                            method: "GET",
                            url: AppConstants.API_BASE_URL + '/api/user/wishlist/add/' + userData.userId + "/" + productId,
                        }).then((response) => {
                            this._onRefresh();
                            Alert.alert("Product added to cart.")
                        }, (error) => {
                            Alert.alert("Server error.")
                        });
                    } else {
                        Alert.alert("Product allready exists in your cart.")
                    }
                }
            }, (error) => {
                Alert.alert("Server error.")
            });
        } else {
            this.props.navigation.navigate(AppRoute.AUTH);
        }
    }

    navigationItemList() {
        // this.props.navigation.navigate(AppRoute.ITEMLIST)
    }

    navigateProductDetail(id, shopId) {
        const pushAction = StackActions.push(AppRoute.WISH_PRODUCT_DETAIL, { productId: String(id), shopId: String(shopId) });
        this.props.navigation.dispatch(pushAction)
      }

    continiueShopping() {
        this.props.navigation.navigate(AppRoute.ALLITEM)
    }

    addItem() { }

    async handleDelete(id) {
        const { isSelectedWish, userData } = this.state
        const logedIn = await AsyncStorage.getItem('logedIn');
        if (null != logedIn && logedIn === 'true') {
            axios({
                method: "GET",
                url: AppConstants.API_BASE_URL + '/api/user/wishlist/add/' + userData.userId + "/" + id,
            }).then((response) => {
                this._onRefresh();
            }, (error) => {
                Alert.alert("Server error.")
            });
        } else {
            this.props.navigation.navigate(AppRoute.AUTH);
        }
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


    renderProduct = ({ item }: any): ListItemElement => (
        item.itemList != null && item.itemList.length > 0 ?
            <ListItem style={{ paddingVertical: -5, borderBottomColor: 'rgba(200, 200, 200, 1)', borderBottomWidth: scale(1) }}>
                <View style={Styles.product_list_main}>
                    <View style={Styles.product_list_img}>
                        <TouchableOpacity onPress={() => { this.navigateProductDetail(item.id, item.shopId) }}>
                            <View style={[Styles.all_Item_Image_2, Styles.center]}>
                                <Avatar source={{ uri: AppConstants.IMAGE_BASE_URL + '/product/' + item.productImage }} style={Styles.product_avatar} />
                            </View>
                        </TouchableOpacity>
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
                                            <TouchableOpacity onPress={() => { this.handleDelete(item.id) }}>
                                                <Text style={Styles.cart_name_text}><CancelIcon fontSize={25} /></Text>
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
                                            {Math.round(item.itemList[0].customerSingleOffer)} % Off
                                        </Text>
                                    </View>
                                    {item.itemList[0].bundleQuantity > 1 ? <Text style={{ fontSize: scale(12), color: Color.OFFER }} ><RupeeIcon fontSize={scale(14)} />{(item.itemList[0].bundlePrice / item.itemList[0].bundleQuantity).toFixed(2)} / pc (Buy {item.itemList[0].bundleQuantity} or more)</Text>: null}
                                    {/* {null != item.offerActiveInd ? item.offerActiveInd ?

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                            <Text style={{ color: Color.COLOR }}>{item.offerPercent} % off</Text>
                                            <Text style={{ color: Color.COLOR }}>{item.offerActiveInd && item.offerTo ? item.offerTo.substr(8, 2) + "/" + item.offerTo.substr(5, 2) + "/" + item.offerTo.substr(0, 4) : null}</Text>
                                        </View> :
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                            <Text style={{ color: Color.COLOR, marginTop: 2.5 }}></Text>
                                            <Text style={{ color: Color.COLOR }}></Text>
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
                              <Text style={{ fontSize: scale(14), fontFamily: 'notoserif', marginTop: 5 }}>{item.unitQuantity} {brand.name}</Text>
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
                          {Math.round(item.customerSingleOffer)} % Off
                        </Text>
                        {item.bundleQuantity > 1 ? <Text style={{ fontSize: scale(12), color: Color.OFFER }} ><RupeeIcon fontSize={scale(14)} />{(item.bundlePrice / item.bundleQuantity).toFixed(2)} / pc (Buy {item.bundleQuantity} or more)</Text>: null}
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

    render() {
        const { allProduct, temp_variant, variantVisible, productName, single, shopName, allCategory, allMeasurement, wishList, allBrand, selectedBrand, selectedCategory } = this.state;
        return (
            <SafeAreaLayout
                style={Styles.safeArea}
                insets={SaveAreaInset.TOP}>
                <Modal isVisible={variantVisible}>
                    <View style={Styles.variant_modal}>
                        <View style={Styles.varient_modalHeader}>
                            <Text style={{ fontFamily: 'notoserif', fontSize: scale(14), fontWeight: '600' }}>{productName}</Text>
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
                    title='Wish List'
                    backIcon={MenuIcon}
                    onBackPress={this.props.navigation.openDrawer}
                    // onRightPress={() => { this.continiueShopping() }}
                    // menuIcon={PlusCircle}
                    style={{ marginTop: -5, marginLeft: -5 }}
                />
                <Divider />

                {/* <Content style={Styles.cart_content} showsVerticalScrollIndicator={false}
                   
                > */}
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

                        <Text style={{ marginVertical: 5 }}>101, InOrbit Complex, Near B.M.P. 16, Phulwari Khagaul Road, Patna, 801505</Text>

                        <View style={{width: '100%', alignItems: 'flex-end'}}>
                            <TouchableOpacity style={[Styles.center, {paddingVertical: 10, width: 100, borderRadius: 5, backgroundColor: Color.COLOR}]}>
                                <Text style={{color: Color.BUTTON_NAME_COLOR}}>Change</Text>
                            </TouchableOpacity>
                        </View>
                    </View> */}
                {null != allProduct ?
                    <List
                        data={allProduct}
                        renderItem={this.renderProduct}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh.bind(this)}
                            />
                        }
                    /> : null}
                <View style={{ height: 10, width: '100%' }} />
                {/* </Content> */}

                {/* <View style={Styles.cart_bottom_box_view}>
                    <View>
                        <Text style={Styles.cart_bottom_box_price_text}><RupeeIcon fontSize={25} />3,000</Text>
                        <TouchableOpacity onPress={() => { }}>
                            <Text style={Styles.cart_price_text_data}>View price details</Text>
                        </TouchableOpacity>
                    </View>

                    <View>
                        <TouchableOpacity style={[Styles.cart_bottom_box_button, Styles.center]}>
                            <Text style={Styles.cart_bottom_box_button_text}>Place Order</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Divider />
                <Divider /> */}
            </SafeAreaLayout>
        )
    }
}
