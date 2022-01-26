import React from 'react';
import {
    ListRenderItemInfo, View, StyleSheet, TouchableOpacity,
    ActivityIndicator, Image, Alert, FlatList, ScrollView, RefreshControl, TextInput
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
import { ScrollableTab, Tab, Item, Container, Content, Tabs, Header, TabHeading, Thumbnail, Input, Label, Footer, FooterTab } from 'native-base';
import { ItemListScreenProps } from '../../../navigation/stock.navigator';
import { AppRoute } from '../../../navigation/app-routes';
import { ProgressBar } from '../../../components/progress-bar.component';
import { SearchIcon, EditIcon, PlusCircle, BackIcon } from '../../../assets/icons';
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
import { Color } from '../../../constants';
import { CartScreenProps } from 'src/navigation/shopKeeperNavigator/allItem.Navigator';
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


const renderItem = ({ item, index }) => (
    <ListItem title={`${item.title} ${index + 1}`} />
);

const HEADER_MAX_HEIGHT = 120;
const HEADER_MIN_HEIGHT = 70;
const PROFILE_IMAGE_MAX_HEIGHT = 80;
const PROFILE_IMAGE_MIN_HEIGHT = 40;


export class ItemListScreen extends React.Component<ItemListScreenProps & ThemedComponentProps, MyState & any> {
    constructor(props) {
        super(props);
        this.state = {
            allProduct: [],
            allCategory: [],
            allBrand: [],
            selectedCategory: '',
            selectedBrand: '',
            allMeasurement: [],
            search: '',
            shopId: AppConstants.SHOP_ID,
            refreshing: false,
            allData: [{
                url: '/api/category/getallcategory',
                method: 'GET',
                variable: 'allCategory',
            },
            {
                url: '/api/lookup/getallmeasurementtype',
                method: 'GET',
                variable: 'allMeasurement',
            },
            {
                url: '/api/brand/getallbrand',
                method: 'GET',
                variable: 'allBrand',
            }],
            scrollY: new Animated.Value(0),
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.navigationAddProduct = this.navigationAddProduct.bind(this);
    }

    async componentDidMount() {
        const { allData } = this.state;
        const brandId = await AsyncStorage.getItem("brandId")
        const value = await AsyncStorage.getItem("userDetail")
        const user = JSON.parse(value);

        console.log("productId", user.shopId)

        this.setState({
            shopId: user.shopId
        })
        axios({
            method: "GET",
            url: AppConstants.API_BASE_URL + '/api/product/getproductbybrand/' + brandId,
        }).then((response) => {
            this.setState({ allProduct: response.data })
        }, (error) => {
            Alert.alert("Please enter a valid email ID and password.")
        });

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
                    // console.log(data.variable, response.data)
                    this.setState({
                        allMeasurement: response.data,
                    })
                }
            }, (error) => {
                Alert.alert("Server error.")
            });
        })
    }

    handleSearch() {
        const { search } = this.state;
        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/product/search/' + search,
        }).then((response) => {
            this.setState({ allProduct: response.data })
        }, (error) => {
            Alert.alert("Server error.")
        });
    }


    onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });
    }

    selectCategory(id) {
        this.setState({ selectedCategory: id })
    }

    selectBrand(id) {
        this.setState({ selectedBrand: id })
    }

    navigateProductDetail(id) {
        Alert.alert(id)
    }

    navigationAddProduct() {
        this.props.navigation.navigate(AppRoute.ADD_PRODUCT_NAVIGATOR);
    }

    handleItemDetails(id, shopId) {
        this.props.navigation.navigate(AppRoute.ITEM_DETAILS,  { productId: String(id), shopId: String(shopId) })

    }

    render() {
        const { allProduct, refreshing, search, shopId, allMeasurement, allCategory, allBrand, selectedBrand, selectedCategory } = this.state;
        const diffClamp = Animated.diffClamp(this.state.scrollY, 0, HEADER_MAX_HEIGHT)
        const headerHeight = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
            outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
            extrapolate: 'clamp'
        })

        const headerZIndex = Animated.interpolate(diffClamp, {
            inputRange: [0, 1000],
            outputRange: [1000, 0]
        })

        const containtZIndex = Animated.interpolate(diffClamp, {
            inputRange: [1000, 1000],
            outputRange: [1000, 1000]
        })


        // const scrollY = new Animated.Value(0);

        const headerY = Animated.interpolate(diffClamp, {
            inputRange: [0, HEADER_MAX_HEIGHT],
            outputRange: [0, -HEADER_MAX_HEIGHT],
        })

        const profileImageMarginTop = Animated.interpolate(diffClamp, {
            inputRange: [0, HEADER_MIN_HEIGHT],
            outputRange: [HEADER_MIN_HEIGHT, HEADER_MIN_HEIGHT]
        })
        return (
            <SafeAreaLayout
                style={Styles.safeArea}
                insets={SaveAreaInset.TOP}>

                {/* <Animated.View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    height: HEADER_MIN_HEIGHT,
                    zIndex: headerZIndex,
                    transform: [{ translateY: headerY }]
                }}> */}
                <Toolbar
                    title='Item List'
                    backIcon={BackIcon}
                    menuIcon={PlusCircle}
                    onRightPress={() => { this.navigationAddProduct() }}
                    onBackPress={this.props.navigation.goBack}
                    style={{ marginTop: -5, marginLeft: -5 }}
                />
                {/* <Header style={styles.header}> */}
                <View style={[Styles.searchBox, { marginBottom: 0, }]}>
                    <TouchableOpacity style={[{ width: '10%' }, Styles.center]} onPress={() => { this.handleSearch() }}>
                        <Text style={Styles.searchIcon}><SearchIcon /></Text>
                    </TouchableOpacity>
                    <TextInput
                        placeholder="Search"
                        style={[Styles.searchInput]}
                        value={search}
                        onChangeText={(value) => { this.setState({ search: value }) }}
                    />
                </View>
                {/* </Header> */}
                {/* <Header style={{ backgroundColor: '#ffffff', height: 30, marginTop: -5 }}>

                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <View style={{ marginTop: -10 }}>
                                <FlatList
                                    style={{}}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    data={allCategory}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity onPress={() => { this.selectCategory(item.id) }}>
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
                    <Header style={{ backgroundColor: '#ffffff', height: 30, marginTop: 15 }}>

                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <View style={{ marginTop: -10 }}>
                                <FlatList
                                    style={{}}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    data={allBrand}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity onPress={() => { this.selectBrand(item.id) }}>
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
                </Animated.View> */}
                {/* <Animated.ScrollView style={{ flex: 1 }}
                    bounces={false}
                    scrollEventThrottle={16}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }])}>
                    <Animated.View style={{
                        height: '100%',
                        width: '100%',
                        marginTop: profileImageMarginTop
                    }}> */}
                <ScrollView style={[Styles.customer_content, { marginTop: 5 }]} showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                    }
                >

                    <View style={Styles.all_Item_Main_View}>
                        {null != allProduct ? allProduct.map((data, index) => {
                            return (
                                <View style={Styles.all_Item_List}>
                                    <View style={{height: 200}}>
                                        <TouchableOpacity onPress={() => { this.handleItemDetails(data.productId, data.shopId) }}>
                                            <View style={[Styles.all_Item_Image_1, Styles.center]}>
                                            <Avatar source={{ uri: AppConstants.IMAGE_BASE_URL + '/product/' + data.productId + '_' + 1 + "_" + shopId + '_product.png' }} style={Styles.product_avatar} />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={Styles.all_Item_Detail}>
                                        <View style={{ backgroundColor: '#fff', paddingHorizontal: 5 }}>
                                            {null != allBrand ? allBrand.map((brand, index) => {
                                                if (brand.id == data.brand) {
                                                    return (
                                                        <>
                                                            <Text style={{ color: '#000', marginTop: 5, fontWeight: 'bold' }}>{data.name} {`\n`} {brand.name}</Text>
                                                        </>
                                                    );
                                                }
                                            }) : null}
                                            {null != allMeasurement ? allMeasurement.map((brand, index) => {
                                                if (brand.lookUpId == data.measurement) {
                                                    return (
                                                        <>
                                                            <Text style={{ color: Color.COLOR_ITEM_NAME, marginTop: 5 }}>{data.quantity} {brand.lookUpName}</Text>
                                                        </>
                                                    );
                                                }
                                            }) : null}
                                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginVertical: 5 }}>
                                                <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }}>Rs. {data.price}</Text>
                                                {data.offerActiveInd ?
                                                    <Text style={{ color: Color.COLOR, fontSize: 20, textDecorationLine: 'line-through' }}>{data.oldPrice}</Text>
                                                    : null
                                                }
                                            </View>
                                            {null != data.offerActiveInd ? data.offerActiveInd ?
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                                    <Text style={{ color: Color.COLOR }}>{data.offerPercent} % off</Text>
                                                    <Text style={{ color: Color.COLOR }}>{data.offerTo.substr(8, 2) + "/" + data.offerTo.substr(5, 2) + "/" + data.offerTo.substr(0, 4)}</Text>
                                                </View> :
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                                    <Text style={{ color: Color.COLOR, marginTop: 2.5 }}></Text>
                                                    <Text style={{ color: Color.COLOR }}></Text>
                                                </View> : null
                                            }
                                        </View>
                                        {/* <TouchableOpacity onPress={() => { this.addToCart(data.id) }}> */}
                                        <View style={[{ backgroundColor: Color.COLOR, marginVertical: 10, alignSelf: 'center', paddingVertical: 5, borderRadius: 5, width: '90%' }, Styles.center]}>
                                            <Text style={{ color: Color.BUTTON_NAME_COLOR }}>Available {data.stock}</Text>
                                        </View>
                                        {/* </TouchableOpacity> */}
                                    </View>
                                </View>
                            )
                        }) : null}
                    </View>
                    <View style={{ height: 10, width: '100%' }} />
                </ScrollView>
                {/* </Animated.View>
                </Animated.ScrollView> */}

            </SafeAreaLayout>
        );
    }
}

const styles = StyleSheet.create({
    ImgBgTwo: {
        position: 'absolute',
        borderRadius: 55,
        alignSelf: 'center',
        height: 11, width: 11,
        transform: [{ scaleX: 2 }],
        backgroundColor: 'white',
        marginTop: 20
    },
    ImgBgOne: {
        height: 9,
        width: 9,
        backgroundColor: 'white',
        borderRadius: 50,
        alignSelf: 'center',
        marginTop: 9,
        position: 'absolute'
    },
    askButton: {
        backgroundColor: '#D8D8D899',
        width: 50,
        height: 50,
        borderRadius: 30,
        position: 'absolute',
        alignSelf: 'flex-end',
        zIndex: 100,
        bottom: 0,
        right: 0,
        marginBottom: 2,
        marginRight: 2
    },
    Search: {
        width: '88%', alignSelf: 'flex-end',
        position: 'absolute', zIndex: 100, marginTop: 5, borderRadius: 25
    },

    name: {
        fontSize: 12,
        marginRight: 5,
        marginTop: -5,
        marginLeft: 10,
        fontWeight: 'bold',
        marginBottom: 2
    },

    TextView: {
        width: '85%'
    },
    text: {
        textAlign: 'justify',
        fontSize: 15,
        color: 'black',
        marginRight: 5
    },
    safeArea: {
        flex: 1,
        paddingBottom: 0,
        // paddingHorizontal: 16,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    },

    selected: {
        color: 'blue',
        borderBottomColor: 'blue',
        borderBottomWidth: 2,
        fontSize: 16,
        fontWeight: 'bold'
    },

    notSelected: {
        color: 'silver'
    }

});