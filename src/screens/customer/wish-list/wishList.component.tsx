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
} from '@ui-kitten/components';
import { ScrollableTab, Tab, Item, Container, Content, Tabs, Header, TabHeading, Thumbnail, Input, Label, Footer, FooterTab, Col } from 'native-base';
import { AppRoute } from '../../../navigation/app-routes';
import { ProgressBar } from '../../../components/progress-bar.component';
import { SearchIcon, MinusIcon, RupeeIcon, PlusCircle, BackIcon, CancelIcon, PlusIcon, AddIcon, RightArrowIcon } from '../../../assets/icons';
import { AppConstants } from '../../../constants/AppConstants';
import { Toolbar } from '../../../components/toolbar.component';
import {
    SafeAreaLayout,
    SafeAreaLayoutElement,
    SaveAreaInset,
} from '../../../components/safe-area-layout.component';
import { MenuIcon, ExperienceIcon, LocationIcon, PublicIcon, PencilIcon } from '../../../assets/icons';
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
import { Color } from '../../../constants/LabelConstants';
import Axios from 'axios';
import { WishListScreenProps } from '../../../navigation/customer-navigator/wish-list.navigator';
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


export class WishListScreen extends React.Component<WishListScreenProps & ThemedComponentProps, MyState & any> {
    constructor(props) {
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
            allData: [
                {
                    url: '/api/lookup/getallmeasurementtype',
                    method: 'GET',
                    variable: 'allMeasurement',
                },
                {
                    url: '/api/category/getcategorybyshopid/' + AppConstants.SHOP_ID,
                    method: 'GET',
                    variable: 'allCategory',
                },
                {
                    url: '/api/brand/getbrandbyshopid/' + AppConstants.SHOP_ID,
                    method: 'GET',
                    variable: 'allBrand',
                }],
            single: false,
            shopName: ''
        }
        this._onRefresh = this._onRefresh.bind(this);
        this.navigationProductDetail = this.navigationProductDetail.bind(this);
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
            // Alert.alert('')
            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/user/get/' + userData.userId,
            }).then((response) => {
                this.setState({
                    userData: response.data,
                    wishList: response.data.wishList
                })
            }, (error) => {
                Alert.alert("Server error.")
            });

            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/product/getproduct/wishlist/' + AppConstants.SHOP_ID + '/' + userData.userId,
            }).then((response) => {
                // console.log(data.variable, response.data)
                this.setState({ allProduct: response.data })
            }, (error) => {
                this.setState({ allProduct: null })
                // Alert.alert("Server error.")
            });
        }



        allData.map((data, index) => {
            // console.log(allData)
            axios({
                method: data.method,
                url: AppConstants.API_BASE_URL + data.url,
            }).then((response) => {
                if (data.variable === 'allCategory') {
                    // console.log(data.variable, response.data)
                    this.setState({
                        allCategory: response.data,
                        selectedCategory: response.data[0].id
                    })
                } else if (data.variable === 'allBrand') {
                    // console.log(data.variable, response.data)
                    this.setState({
                        allBrand: response.data,
                        selectedBrand: response.data[0].id
                    })
                } else if (data.variable === 'allMeasurement') {
                    console.log(data.variable, response.data)
                    this.setState({
                        allMeasurement: response.data,
                    })
                }
            }, (error) => {
                Alert.alert("Server error.")
            });
        })
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

    navigationProductDetail() {
        this.props.navigation.navigate(AppRoute.PRODUCT_DETAIL)
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

    renderProduct = ({ item }: any): ListItemElement => (
        <ListItem style={{ borderBottomColor: 'rgba(2,15,20,0.10)', borderBottomWidth: 1 }}>
            {item != null ?
                <View>
                    <View style={Styles.cart_main_view}>
                        <View style={Styles.cart_view_1}>
                            <View style={Styles.cart_view_1_1}>
                                <View style={[Styles.cart_avatar_view, Styles.center]}>
                                    <Avatar source={{ uri: AppConstants.IMAGE_BASE_URL + '/product/' + item.productId + '_' + 1 + "_" + item.shopId + '_product.png' }} style={Styles.product_avatar} />
                                </View>
                            </View>

                            <View style={Styles.cart_view_1_2}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={Styles.cart_name_text}>{item.name}</Text>
                                    <TouchableOpacity onPress={() => { this.handleDelete(item.productId) }}>
                                        <Text style={Styles.cart_name_text}><CancelIcon fontSize={25} /></Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={Styles.cart_price_view}>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={Styles.price_text}><RupeeIcon /> {item.price}</Text>
                                        <Text style={Styles.offer_price_text}>{item.offerPercent ? item.offerPercent > 0 && item.offerActiveInd ? item.oldPrice : '' : ''}</Text>
                                    </View>

                                    <View style={[Styles.cart_quantity_view, Styles.center]}>
                                        {/* <TouchableOpacity style={Styles.cart_button} onPress={() => { }}>
                                            <Text style={Styles.cart_button_text}><MinusIcon /></Text>
                                        </TouchableOpacity>

                                        <View style={Styles.cart_quantity_text_view}>
                                            <Text style={Styles.cart_quantity_text}>3</Text>
                                        </View> */}

                                        <TouchableOpacity style={Styles.cart_button} onPress={() => { this.handleAddTocart(item.productId, item.shopId) }}>
                                            <Text style={Styles.cart_button_text}>Add to cart</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View>
                                    {item.offerPercent ? item.offerPercent > 0 && item.offerActiveInd ?
                                        <Text style={Styles.cart_offer_text}>{item.offerPercent}% off</Text> : null : null}
                                </View>
                            </View>
                        </View>

                        <View>
                            {item.offerPercent ? item.offerPercent > 0 && item.offerActiveInd?
                                <Text style={[Styles.cart_offer_text, { marginLeft: 10 }]}> offers available</Text> : null : null}
                        </View>
                    </View>

                </View> :
                <ActivityIndicator size='large' color='green' />}

        </ListItem>
    )

    render() {
        const { allProduct, single, shopName, allCategory, allMeasurement, wishList, allBrand, selectedBrand, selectedCategory } = this.state;
        return (
            <SafeAreaLayout
                style={Styles.safeArea}
                insets={SaveAreaInset.TOP}>
                <Toolbar
                    title= 'Wish List'
                    backIcon={MenuIcon}
                    onBackPress={this.props.navigation.openDrawer}
                    onRightPress={() => { this.continiueShopping() }}
                    menuIcon={PlusCircle}
                    style={{ marginTop: -5, marginLeft: -5 }}
                />
                <Divider />

                <Content style={Styles.cart_content} showsVerticalScrollIndicator={false}
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

                        <Text style={{ marginVertical: 5 }}>101, InOrbit Complex, Near B.M.P. 16, Phulwari Khagaul Road, Patna, 801505</Text>

                        <View style={{width: '100%', alignItems: 'flex-end'}}>
                            <TouchableOpacity style={[Styles.center, {paddingVertical: 10, width: 100, borderRadius: 5, backgroundColor: Color.COLOR}]}>
                                <Text style={{color: Color.BUTTON_NAME_COLOR}}>Change</Text>
                            </TouchableOpacity>
                        </View>
                    </View> */}
                    {null != allProduct ?
                        <List data={allProduct}
                            renderItem={this.renderProduct}
                        /> : null}
                    <View style={{ height: 10, width: '100%' }} />
                </Content>

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
