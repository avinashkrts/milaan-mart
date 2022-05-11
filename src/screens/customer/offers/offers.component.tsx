import { StackActions } from '@react-navigation/native';
import { Avatar, Divider, List, ListItemElement, ThemedComponentProps } from '@ui-kitten/components';
import Axios from 'axios';
import { Header, ListItem } from 'native-base';
import React, { Component } from 'react';
import { Alert, AsyncStorage, RefreshControl, Text, View } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { FlatList, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Modal from 'react-native-modal';
import Animated from 'react-native-reanimated';
import { scale } from 'react-native-size-matters';

import { CancelIcon, CartIcon, MenuIcon, SearchIcon, WishIcon } from '../../../assets/icons';
import { Styles } from '../../../assets/styles';
import { SafeAreaLayout, SaveAreaInset } from '../../../components/safe-area-layout.component';
import { Toolbar } from '../../../components/toolbar.component';
import { AppConstants, Color } from '../../../constants';
import { LableText } from '../../../constants/LabelConstants';
import { AppRoute } from '../../../navigation/app-routes';
import { OffersScreenProps } from '../../../navigation/customer-navigator/offer-list.navigator';


const HEADER_MAX_HEIGHT = 205;
const HEADER_MIN_HEIGHT = 0;

export class OffersScreen extends Component<OffersScreenProps, ThemedComponentProps & any> {
    backHandler: any;
    constructor(props) {
        super(props);
        this.state = {
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
            location: '',
            searchVisible: false,
            single: false,
            shopName: '',
            refreshing: false,
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
        const shopIdAsync = await AsyncStorage.getItem('shopId')
        const shopName = await AsyncStorage.getItem('shopName')

            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/product/get/offerproduct/byshopid/' + AppConstants.SHOP_ID,
            }).then((response) => {
                if (null != response.data) {
                    this.setState({
                        allProduct: response.data,
                    })
                }
            }, (error) => {
                Alert.alert("Wait for a moment.")
            });
            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/category/getcategorybyshopid/' + AppConstants.SHOP_ID,
            }).then((response) => {
                if (null != response.data) {
                    this.setState({
                        allCategory: response.data,
                        selectedCategory: response.data[0].id
                    })
                }
            }, (error) => {
                Alert.alert("Wait for a moment.")
            });
            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/brand/getbrandbyshopid/' + AppConstants.SHOP_ID,
            }).then((response) => {
                if (null != response.data) {
                    this.setState({
                        allBrand: response.data,
                        selectedBrand: response.data[0].id
                    })
                }
            }, (error) => {
                Alert.alert("Wait for a moment.")
            });      

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
                Alert.alert("Wait for a moment..")
            });
        }

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
                Alert.alert("Wait for a moment..")
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
        const pushAction = StackActions.push(AppRoute.OFFERS_DETAIL_TAB, { productId: String(id), shopId: String(shopId) });
        this.props.navigation.dispatch(pushAction)
    }

    async handleAddToCart(productId, shopId) {
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
                        Alert.alert("Product added to cart.")
                    } else {
                        Alert.alert("Product allready exists in your cart.")
                    }
                }
            }, (error) => {
                Alert.alert("Wait for a moment..")
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
                Alert.alert("Wait for a moment..")
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
                Alert.alert("Wait for a moment..")
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
            AsyncStorage.setItem('latitude', String(lat))
            AsyncStorage.setItem('longitude', String(lng))
            AsyncStorage.setItem('location', String(data.structured_formatting.main_text))
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
                Alert.alert("Wait for a moment..")
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
            AsyncStorage.setItem('latitude', String(lat))
            AsyncStorage.setItem('longitude', String(long))
            AsyncStorage.setItem('location', 'Current Location')
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
                Alert.alert("Wait for a moment..")
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
            // Alert.alert("Wait for a moment..")
        });
    }

    renderProduct = ({ item }: any): ListItemElement => (
        <ListItem style={{ backgroundColor: 'rgba(255, 255, 255, 1)', borderBottomColor: 'rgba(200, 200, 200, 1)', borderBottomWidth: scale(1) }}>
            <View style={Styles.product_list_main}>
                <View style={Styles.product_list_img}>
                    <TouchableOpacity onPress={() => { this.navigateProductDetail(item.productId, item.shopId) }}>
                        <View style={[Styles.all_Item_Image_2, Styles.center]}>
                            <Avatar source={{ uri: AppConstants.IMAGE_BASE_URL + '/product/' + item.productId + '_' + 1 + "_" + item.shopId + '_product.png' }} style={Styles.product_avatar} />
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
                                    {null !== this.state.wishList ?
                                        <View style={[Styles.product_2nd_wish_view]}>
                                            <TouchableOpacity onPress={() => { this.handleWishList(item.productId) }}>
                                                <Text
                                                    style={this.state.wishList.includes(item.productId) ?
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
                                {null != this.state.allMeasurement ? this.state.allMeasurement.map((brand, index) => {
                                    if (brand.lookUpId == item.measurement) {
                                        return (
                                            <>
                                                <Text style={{ color: Color.COLOR_ITEM_NAME, marginTop: 5 }}>{item.quantity} {brand.lookUpName}</Text>
                                            </>
                                        );
                                    }
                                }) : null}
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginVertical: 5 }}>
                                    <Text style={{ color: '#000', fontSize: scale(14) }}>Rs. {item.price}</Text>
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
                            {item.stock ? item.stock > 0 ?
                                <TouchableOpacity onPress={() => { this.handleAddToCart(item.productId, item.shopId) }}>
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
                            }
                        </View>
                    </View>
                </View>

            </View>
        </ListItem>
    )

    render() {
        const { allProduct, single, refreshing, shopName, search, lat, long, searchVisible, location, allCategory, allMeasurement, wishList, allBrand, selectedBrand, selectedCategory } = this.state;

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
                    title='Offers'
                    backIcon={MenuIcon}
                    onBackPress={this.props.navigation.openDrawer}
                    onRightPress={() => { this.navigateToCart() }}
                    menuIcon={CartIcon}
                    style={{ marginTop: -5, marginLeft: -5, marginBottom: -10 }}
                />
                <Divider />
                <Divider />
                <Divider />
                {/* {!single ?
                    <View style={{ padding: 5 }}>
                        <Text onPress={() => { this.setState({ searchVisible: true }) }} style={{ fontWeight: 'bold', fontSize: 18, color: Color.COLOR }}>Location: <Text style={{ fontSize: 16, fontWeight: '100' }}>{location}</Text></Text>
                    </View> : null
                } */}
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
                        </Header>
                    </>
                {null != allProduct ?
                    <List data={allProduct}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={this.onRefresh.bind(this)}
                            />}
                        renderItem={this.renderProduct}
                    /> : null}

                {/* <View style={Styles.all_Item_Main_View}>
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

                                <View style={Styles.all_Item_Detail}>
                                    <View style={{ backgroundColor: '#fff', paddingHorizontal: 5 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            {null != allBrand ? allBrand.map((brand, index) => {
                                                if (brand.id == data.brand) {
                                                    return (
                                                        <View style={{ width: '80%', flexWrap: 'wrap' }}>
                                                            <Text style={{ color: '#000', marginTop: 5, fontWeight: 'bold' }}>{data.name} {`\n`} {brand.name}</Text>
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
                                                <Text style={{ color: Color.COLOR }}>{data.offerActiveInd && data.offerTo ? data.offerPercent : null} % off</Text>
                                                <Text style={{ color: Color.COLOR }}>{data.offerActiveInd && data.offerTo ? data.offerTo.substr(8, 2) + "/" + data.offerTo.substr(5, 2) + "/" + data.offerTo.substr(0, 4) : null}</Text>
                                            </View> :
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                                <Text style={{ color: Color.COLOR, marginTop: 2.5 }}></Text>
                                                <Text style={{ color: Color.COLOR }}></Text>
                                            </View> : null
                                        }

                                    </View>
                                    <TouchableOpacity onPress={() => { this.handleAddToCart(data.productId, data.shopId) }}>
                                        <View style={[{ backgroundColor: Color.COLOR, marginVertical: 10, alignSelf: 'center', paddingVertical: 5, borderRadius: 5, width: '90%' }, Styles.center]}>
                                            <Text style={{ color: Color.BUTTON_NAME_COLOR }}>Add to cart</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    }) : null}
                </View> */}
                {/* <View style={{ height: 10, width: '100%' }} /> */}
            </SafeAreaLayout>
        );
    }
}