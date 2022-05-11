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
} from 'react-native-ui-kitten';
import { ScrollableTab, Tab, Item, Container, Content, Tabs, Header, TabHeading, Thumbnail, Input, Label, Footer, FooterTab, Col } from 'native-base';
import { CustomerCartScreenProps } from '../../../navigation/customer-navigator/customerHome.navigator';
import { AppRoute } from '../../../navigation/app-routes';
import { ProgressBar } from '../../../components/progress-bar.component';
import { SearchIcon, MinusIcon, RupeeIcon, PlusCircle, BackIcon, CancelIcon, PlusIcon, AddIcon, RightArrowIcon } from '../../../assets/icons';
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
// import axios from 'axios';  
// import Container from '@react-navigation/core/lib/typescript/NavigationContainer';

const allTodos: TimeLineData[] = [
    TimeLineData.getAllTimelineData()
];

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


export class CustomerCartScreen extends React.Component<CustomerCartScreenProps & ThemedComponentProps, MyState & any> {
    constructor(props) {
        super(props)
        this.state = {
            cartData: [],
            productList: [],
        }
        this._onRefresh = this._onRefresh.bind(this);
        this.navigationProductDetail = this.navigationProductDetail.bind(this);
    }



   async componentDidMount() {
        SCREEN_WIDTH = Dimensions.get('window').width;
        let userDetail = await AsyncStorage.getItem('userDetail');
        let logedIn = await AsyncStorage.getItem('logedIn');
        let userData = JSON.parse(userDetail);
        if(null != logedIn && logedIn === 'true') {
            // Alert.alert("" + userData.userId)
        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/cart/getcartbyuserid/' + userData.userId
        }).then((response) => {
            this.setState({
                cartData: response.data[0],
            })
        }, (error) => {
            Alert.alert("Wait for a moment.")
        })

        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/productlist/getproductlistbyuserid/' + userData.userId
        }).then((response) => {
            this.setState({
                productList: response.data
            })
        }, (error) => {
            Alert.alert("Wait for a moment.")
        })
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

    renderCart = ({ item }: any): ListItemElement => (
        <ListItem style={{ borderBottomColor: 'rgba(2,15,20,0.10)', borderBottomWidth: 1 }}>
            {item != null ?

                <View style={Styles.cart_main_view}>

                    <View style={Styles.cart_view_1}>
                        <View style={Styles.cart_view_1_1}>
                            <View style={[Styles.cart_avatar_view, Styles.center]}>
                            <Avatar source={{ uri: AppConstants.IMAGE_BASE_URL + '/avatar/' + item.productId + '_avatar.png' }} style={Styles.product_avatar} />
                            </View>
                        </View>

                        <View style={Styles.cart_view_1_2}>
                            <Text style={Styles.cart_name_text}>{item.productName}</Text>
                            <View style={Styles.cart_price_view}>
                                <View style={{ flexDirection: 'row', width: '55%', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                    <Text style={Styles.price_text}><RupeeIcon /> {item.price}</Text>
                                    <Text style={Styles.offer_price_text}>{item.oldPrice}</Text>
                                </View>

                                <View style={Styles.cart_quantity_view}>
                                    <TouchableOpacity style={Styles.cart_button} onPress={() => { }}>
                                        <Text style={Styles.cart_button_text}><MinusIcon /></Text>
                                    </TouchableOpacity>

                                    <View style={Styles.cart_quantity_text_view}>
                                        <Text style={Styles.cart_quantity_text}>{item.productQuantity}</Text>
                                    </View>

                                    <TouchableOpacity style={Styles.cart_button} onPress={() => { }}>
                                        <Text style={Styles.cart_button_text}><AddIcon /></Text>
                                    </TouchableOpacity>
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
        this.props.navigation.navigate(AppRoute.ALLITEM)
    }

    addItem() { }

    render() {
        const { cartData, productList } = this.state
        return (
            <SafeAreaLayout
                style={Styles.safeArea}
                insets={SaveAreaInset.TOP}>
                <Toolbar
                    title='Cart'
                    backIcon={BackIcon}
                    onBackPress={this.props.navigation.goBack}
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

                    <View style={{ backgroundColor: '#fff', borderColor: Color.BORDER, borderWidth: 0.5, padding: 20, marginBottom: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Address</Text>

                        <Text style={{ marginVertical: 5 }}>101, InOrbit Complex, Near B.M.P. 16, Phulwari Khagaul Road, Patna, 801505</Text>

                        <View style={{ width: '100%', alignItems: 'flex-end' }}>
                            <TouchableOpacity style={[Styles.center, { paddingVertical: 10, width: 100, borderRadius: 5, backgroundColor: Color.COLOR }]}>
                                <Text style={{ color: Color.BUTTON_NAME_COLOR }}>Change</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <List data={productList}
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
                                <Text style={Styles.cart_price_text_head}><RupeeIcon fontSize={18} />{null != cartData ? cartData.totalAmount : null}</Text>
                            </View>

                            <View style={Styles.price_detail_2_1}>
                                <Text style={Styles.cart_price_text_head}>Discount</Text>
                                <Text style={Styles.cart_price_text_data}>-<RupeeIcon fontSize={18} />{null != cartData ? cartData.discount : null}</Text>
                            </View>

                            <View style={Styles.price_detail_2_1}>
                                <Text style={Styles.cart_price_text_head}>Delevery Charges</Text>
                                <Text style={Styles.cart_price_text_data}>FREE</Text>
                            </View>
                        </View>

                        <View style={Styles.cart_total_view}>
                            <Text style={Styles.cart_total_text_head}>Total Amount</Text>
                            <Text style={Styles.cart_total_text_head}><RupeeIcon fontSize={18} />{null != cartData ? cartData.totalAmount : null}</Text>
                        </View>
                        <View style={Styles.price_detail_2}>
                            <Text style={Styles.cart_price_text_data}>You will save <RupeeIcon fontSize={18} />{null != cartData ? cartData.discount : null} on this order.</Text>
                        </View>
                    </View>




                    <View style={{ height: 10, width: '100%' }} />
                </Content>

                <View style={Styles.cart_bottom_box_view}>
                    <View>
                        <Text style={Styles.cart_bottom_box_price_text}><RupeeIcon fontSize={25} />{null != cartData ? cartData.totalAmount : null}</Text>
                        <TouchableOpacity onPress={() => { }}>
                            {/* <Text style={Styles.cart_price_text_data}>View price details</Text> */}
                        </TouchableOpacity>
                    </View>

                    <View>
                        <TouchableOpacity style={[Styles.cart_bottom_box_button, Styles.center]}>
                            <Text style={Styles.cart_bottom_box_button_text}>Place Order</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Divider />
                <Divider />
            </SafeAreaLayout>
        )
    }
}
