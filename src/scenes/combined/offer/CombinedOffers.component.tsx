import { OffersScreenProps } from "../../../navigation/customer-navigator/offers.navigator";
import React, { Component } from "react";
import { View, Text, RefreshControl, AsyncStorage, Alert, StyleSheet, PermissionsAndroid } from "react-native";
import { Avatar, List, Divider, ListItemElement, ThemedComponentProps } from "react-native-ui-kitten";
import { SafeAreaLayout, SaveAreaInset } from "../../../components/safe-area-layout.component";
import { Toolbar } from "../../../components/toolbar.component";
import { CartIcon, MenuIcon, SearchIcon, WishIcon, CancelIcon } from "../../../assets/icons";
import { FlatList, TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { AppConstants, Color } from "../../../constants";
import { Styles } from "../../../assets/styles";
import { Content, Header, Item, ListItem } from "native-base";
import axios from 'axios';
import Animated from "react-native-reanimated";
import { AppRoute } from "../../../navigation/app-routes";
import Axios from "axios";
import Geolocation from 'react-native-geolocation-service';
import Modal from "react-native-modal";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { CombinedOfferScreenProps } from "../../../navigation/combined-navigator/combinedOffers.navigator";
import { LableText } from '../../../constants/LabelConstants'

const HEADER_MAX_HEIGHT = 205;
const HEADER_MIN_HEIGHT = 0;

export class CombinedOffersScreen extends Component<CombinedOfferScreenProps, ThemedComponentProps & any> {
    constructor(props) {
        super(props);
        this.state = {
            allProduct: [],
            allCategory: [],
            allBrand: [],
            selectedCategory: '',
            selectedBrand: '',
            userData: [],
            shopId: '',
            allMeasurement: [],
            wishList: '',
            search: '',
            lat: '',
            long: '',
            location: LableText.USE_CURRENT_LOCATION,
            searchVisible: false,
            allData: [
                {
                    url: '/api/lookup/getallmeasurementtype',
                    method: 'GET',
                    variable: 'allMeasurement',
                },
            ],
            scrollY: new Animated.Value(0),
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.handleAddToCart = this.handleAddToCart.bind(this);
    }

    async componentDidMount() {
        const { allData } = this.state;
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Cool Photo App Camera Permission",
                    message:
                        "Cool Photo App needs access to your camera " +
                        "so you can take awesome pictures.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                Geolocation.getCurrentPosition((position) => {
                    var lat = position.coords.latitude
                    var long = position.coords.longitude
                    console.log('location', lat, position.coords.accuracy)
                    axios({
                        method: 'GET',
                        url: AppConstants.API_BASE_URL + '/api/product/getbyofferproduct/' + lat + '/' + long
                    }).then((response) => {
                        console.log('Product', response.data)
                        if (null != response.data) {
                            this.setState({
                                allProduct: response.data,
                                lat: position.coords.latitude,
                                long: position.coords.longitude,
                                location: 'Curent Location'
                            })
                        }
                    }, (error) => {
                        Alert.alert("Server error!.")
                    });
                }, (erroe) => {

                }, { enableHighAccuracy: true })
            } else {
                console.log("Camera permission denied");
            }
        } catch (err) {
            console.warn(err);
        }

        let userDetail = await AsyncStorage.getItem('userDetail');
        let userData = JSON.parse(userDetail);
        let shopId = await AsyncStorage.getItem('shopId');
        // Alert.alert(""+userData.userId);
        // console.log("User Data",userData.userId)

        this.setState({
            userData: userData
        })
        const logedIn = await AsyncStorage.getItem('logedIn');
        if (null != logedIn && logedIn === 'true') {
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
        }

        // console.log('location', long, lat, 'fgfgf')
        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/category/getallcategory'
        }).then((response) => {
            if (null != response.data) {
                this.setState({
                    allCategory: response.data,
                    selectedCategory: response.data[0].id
                })
            }
        }, (error) => {
            Alert.alert("Server error!.")
        });

        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/brand/getallbrand',
        }).then((response) => {
            if (null != response.data) {
                this.setState({
                    allBrand: response.data,
                    selectedBrand: response.data[0].id
                })
            }
        }, (error) => {
            Alert.alert("Server error!.")
        });

        allData.map((data, index) => {
            // console.log(allData)
            axios({
                method: data.method,
                url: AppConstants.API_BASE_URL + data.url,
            }).then((response) => {
                if (data.variable === 'allMeasurement') {
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

    addToCart(id) {

    }

    navigateToCart() {
        this.props.navigation.navigate(AppRoute.CUSTOMER_CART)
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

    navigateProductDetail(id, shopId) {
        this.props.navigation.navigate(AppRoute.OFFERS_DETAIL_TAB, { productId: String(id), shopId: String(shopId) })
    }

    async handleAddToCart(productId) {
        const { userData } = this.state;
        const logedIn = await AsyncStorage.getItem('logedIn');
        if (null != logedIn && logedIn === 'true') {
            // Alert.alert(''+ userData.userId + productId + logedIn)
            Axios({
                method: 'POST',
                url: AppConstants.API_BASE_URL + '/api/cart/create',
                data: {
                    shopId: "AVI123",
                    userId: userData.userId,
                    productId: productId,
                    productQuantity: 1
                }
            }).then((response) => {
                if (null != response.data) {
                    if (response.data.status === 'true') {
                        Alert.alert("Product added to cart.")
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

    async handleWishList(productId) {
        const { isSelectedWish, userData } = this.state
        const logedIn = await AsyncStorage.getItem('logedIn');
        if (null != logedIn && logedIn === 'true') {
            axios({
                method: "GET",
                url: AppConstants.API_BASE_URL + '/api/user/wishlist/add/' + userData.userId + "/" + productId,
            }).then((response) => {
                this.setState({
                    isSelectedWish: !isSelectedWish
                })
                this.onRefresh();
            }, (error) => {
                Alert.alert("Server error.")
            });
        } else {
            this.props.navigation.navigate(AppRoute.AUTH);
        }
    }

    handleSearch() {
        const { search } = this.state;
        if (search != '' && search != null) {
            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/product/search/' + search,
            }).then((response) => {
                this.setState({ allProduct: response.data })
            }, (error) => {
                Alert.alert("Server error.")
            });
        }
    }

    handleSearchLatLong(data, details) {
        this.toggleModal();

        Axios({
            url: 'https://maps.googleapis.com/maps/api/place/details/json?key=' + AppConstants.GOOGLE_MAP_KEY + '&place_id=' + data.place_id
        }).then((response) => {
            const { data: { result: { geometry: { location } } } } = response
            const { lat, lng } = location
            console.log('Location', data.structured_formatting.main_text)
            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/product/getbyofferproduct/' + lat + '/' + lng,
            }).then((response) => {
                this.setState({
                    allProduct: response.data,
                    lat: lat,
                    long: lng,
                    searchVisible: false,
                    location: data.structured_formatting.main_text
                })
            }, (error) => {
                Alert.alert("Server error.")
            });

        }, (error) => {
            console.log(error);
        })
    }

    toggleModal() {
        this.setState({
            searchVisible: false
        })
    }

    onCurrentLocation() {
        console.log('Map Clicked')
        this.toggleModal();
        // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition((position) => {
            var lat = position.coords.latitude
            var long = position.coords.longitude
            console.log('location', lat, position.coords.accuracy)

            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/product/getbyofferproduct/' + lat + '/' + long,
            }).then((response) => {
                this.setState({
                    allProduct: response.data,
                    lat: position.coords.latitude,
                    long: position.coords.longitude,
                    searchVisible: false,
                    location: LableText.USE_CURRENT_LOCATION
                })
            }, (error) => {
                Alert.alert("Server error.")
            });
        }, (erroe) => {

        }, { enableHighAccuracy: true })
        // } else {
        //     console.log("Camera permission denied");
        // }
    }

    shopSearch() {
        const { search, shopId } = this.state;
        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/product/search/offer/' + search,
        }).then((response) => {
            this.setState({
                allProduct: response.data,
                search: ''
            })
        }, (error) => {
            // Alert.alert("Server error.")
        });
    }

    render() {
        const { allProduct, search, lat, long, searchVisible, location, allCategory, allMeasurement, wishList, allBrand, selectedBrand, selectedCategory } = this.state;
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
                <Modal style={Styles.modal} isVisible={searchVisible}>
                    <View style={Styles.modalHeader}>
                        <TouchableOpacity>
                            <Text onPress={() => { this.toggleModal() }}><CancelIcon fontSize={25} /></Text>
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
                                // 'details' is provided when fetchDetails = true
                                this.handleSearchLatLong(data, details)
                                console.log('New Location', data);
                            }}
                            query={{
                                key: AppConstants.GOOGLE_MAP_KEY,
                                language: 'en',
                            }}
                        // currentLocation={true}
                        // currentLocationLabel=LableText.USE_CURRENT_LOCATION
                        />
                        {lat !== '' && long !== '' ?
                            <>
                                <MapView
                                    style={{ flex: 1 }}
                                    provider={PROVIDER_GOOGLE}
                                    showsUserLocation={true}
                                    initialRegion={{
                                        latitude: lat,
                                        longitude: long,
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }}

                                    region={{
                                        latitude: lat,
                                        longitude: long,
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }}
                                >

                                    <Marker
                                        coordinate={{
                                            latitude: lat,
                                            longitude: long
                                        }
                                        }
                                    >
                                    </Marker>

                                </MapView>
                            </> : null}
                    </View>
                </Modal>

                <Toolbar
                    title='All Offer'
                    backIcon={MenuIcon}
                    onBackPress={this.props.navigation.openDrawer}
                    onRightPress={() => { this.navigateToCart() }}
                    menuIcon={CartIcon}
                    style={{ marginTop: -5, marginLeft: -5, marginBottom: -10 }}
                />
                <Divider />
                <Divider />
                <Divider />

                <View style={{ padding: 5 }}>
                    <Text onPress={() => { this.setState({ searchVisible: true }) }} style={{ fontWeight: 'bold', fontSize: 18, color: Color.COLOR }}>Location: <Text style={{ fontSize: 16, fontWeight: '100' }}>{location}</Text></Text>
                </View>
                {/* <Header style={styles.header}> */}
                <View style={[Styles.searchBox, { marginBottom: 0 }]}>

                    <TextInput
                        placeholder="Search"
                        style={[Styles.searchInput]}
                        value={search}
                        onChangeText={(value) => { this.setState({ search: value }) }}
                    />
                    <View style={[{ width: '10%', }, Styles.center]}>
                        <TouchableOpacity onPress={() => { this.shopSearch() }}>
                            <Text style={Styles.searchIcon}><SearchIcon /></Text>
                        </TouchableOpacity>
                    </View>

                </View>

                <Divider />
                {/* </Header> */}
                {/* <Header style={{ backgroundColor: '#ffffff', height: 50, marginTop: 0 }}>

                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={{ marginTop: 10 }}>
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
                </Header> */}
                <Animated.View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    height: HEADER_MIN_HEIGHT,
                    zIndex: headerZIndex,
                    transform: [{ translateY: headerY }]
                }}>

                </Animated.View>
                <Animated.ScrollView style={{ flex: 1 }}
                    bounces={false}
                    scrollEventThrottle={16}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }])}>
                    <Animated.View style={{
                        height: '100%',
                        width: '100%',
                        marginTop: profileImageMarginTop
                    }}>
                        <Content style={[Styles.customer_content, { marginTop: 10 }]} showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefresh.bind(this)}
                                />
                            }
                        >

                            <View style={Styles.all_Item_Main_View}>
                                {null != allProduct ? allProduct.map((data, index) => {
                                    return (
                                        <View style={Styles.all_Item_List}>
                                            <View style={{ height: 200 }}>
                                                <TouchableOpacity onPress={() => { this.navigateProductDetail(data.productId, data.shopId) }}>
                                                    <View style={[Styles.all_Item_Image_1, Styles.center]}>
                                                        <Avatar source={{ uri: AppConstants.IMAGE_BASE_URL + '/product/' + data.productId + '_' + 1 + "_" + data.shopId + '_product.png' }} style={Styles.product_avatar} />
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                            {/* <TouchableOpacity onPress={() => { this.navigateProductDetail(data.productId) }}>
                                                <View style={[Styles.all_Item_Image_1, Styles.center]}>
                                                    <Avatar source={require("../../../assets/dawat_rice.jpg")} style={Styles.all_Item_Image} />
                                                </View>

                                            </TouchableOpacity> */}

                                            <View style={Styles.all_Item_Detail}>
                                                <View style={{ backgroundColor: '#fff', paddingHorizontal: 5 }}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        {null != allBrand ? allBrand.map((brand, index) => {
                                                            if (brand.id == data.brand) {
                                                                return (
                                                                    <View>
                                                                        <Text style={{ color: '#000', marginTop: 5, fontWeight: 'bold' }}>{data.name} {brand.name}</Text>
                                                                    </View>
                                                                );
                                                            }
                                                        }) : null}
                                                        {null !== wishList ?
                                                            <View style={Styles.product_2nd_wish_view}>
                                                                <TouchableOpacity onPress={() => { this.handleWishList(data.productId) }}>
                                                                    <Text
                                                                        style={wishList.includes(data.productId) ?
                                                                            Styles.selected_wish_icon :
                                                                            Styles.wish_icon
                                                                        }
                                                                    >
                                                                        <WishIcon />
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                            : null
                                                        }
                                                    </View>
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
                                                <TouchableOpacity onPress={() => { this.handleAddToCart(data.productId) }}>
                                                    <View style={[{ backgroundColor: Color.COLOR, marginVertical: 10, alignSelf: 'center', paddingVertical: 5, borderRadius: 5, width: '90%' }, Styles.center]}>
                                                        <Text style={{ color: Color.BUTTON_NAME_COLOR }}>Add to cart</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                }) : null}
                            </View>
                            <View style={{ height: 10, width: '100%' }} />
                        </Content>
                    </Animated.View>
                </Animated.ScrollView>

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