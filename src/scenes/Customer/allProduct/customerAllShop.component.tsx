import React, { Component } from "react";
import { View, Text, RefreshControl, AsyncStorage, Alert, StyleSheet, PermissionsAndroid } from "react-native";
import { Avatar, List, Divider, ListItemElement, ThemedComponentProps } from "react-native-ui-kitten";
import { CustomerAllShopScreenProps } from "../../../navigation/customer-navigator/customerAllProduct.navigator";
import { SafeAreaLayout, SaveAreaInset } from "../../../components/safe-area-layout.component";
import { Toolbar } from "../../../components/toolbar.component";
import { CartIcon, CancelIcon, MenuIcon, SearchIcon, WishIcon } from "../../../assets/icons";
import { FlatList, ScrollView, TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { AppConstants, Color } from "../../../constants";
import { Styles } from "../../../assets/styles";
import { Content, Header, Item, ListItem } from "native-base";
import axios from 'axios';
import { AppRoute } from "../../../navigation/app-routes";
import Axios from "axios";
// import Geolocation from '@react-native-community/geolocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geolocation from 'react-native-geolocation-service';
import Modal from "react-native-modal";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SearchableFlatList } from 'react-native-searchable-list';
import { StackActions } from "@react-navigation/native";
import { scale } from "react-native-size-matters";
import OneSignal from "react-native-onesignal";
import { LableText } from '../../../constants/LabelConstants';
import { BackHandler } from "react-native";
import { connect } from "react-redux";
import { changeProductData } from "../../../redux/action/productActions";
const HEADER_MAX_HEIGHT = 205;
const HEADER_MIN_HEIGHT = 0;

export class CustomerAllShopScreen extends Component<CustomerAllShopScreenProps, ThemedComponentProps & any> {
    backHandler: any;
    constructor(props) {
        super(props);
        this.state = {
            allShop: [],
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
            searchVisible: false,
            location: '',
            allData: [
                {
                    url: '/api/lookup/getallmeasurementtype',
                    method: 'GET',
                    variable: 'allMeasurement',
                },
                {
                    url: '/api/lookup/getallshoptype',
                    method: 'GET',
                    variable: 'allCategory',
                },
                {
                    url: '/api/brand/getallbrand',
                    method: 'GET',
                    variable: 'allBrand',
                }],
            data: [{ id: 1, name: "Taj Mahal", country: "India" },
            { id: 2, name: "Great Wall of China", country: "China" },
            { id: 3, name: "Machu Picchu", country: "Peru" },
            { id: 4, name: "Christ the Redeemer", country: "Brazil" },
            { id: 5, name: "Chichen Itza", country: "Mexico" },
            { id: 6, name: "Roman Colosseum", country: "Italy" },
            { id: 7, name: "Petra", country: "Jordan" }],
            searchTerm: "",
            searchAttribute: "country",
            ignoreCase: true
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.handleAddToCart = this.handleAddToCart.bind(this);
    }

      backAction = () => {
       
        Alert.alert("Alert!", LableText.CUS_HOME_PAGE, [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel"
          },
          { text: "YES", onPress: () =>{
             BackHandler.exitApp() 
          }  
         
        }
        ]);
        return true;
      };
      
      componentWillUnmount() {
       this.backHandler.remove();       
      }

    async componentDidMount() {
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
        // Alert.alert('')
        const clean = ''
        AsyncStorage.setItem('shopId', String(clean))
        const pCount = await AsyncStorage.getItem('productCount')
        // console.log('pCount', pCount)
        try {
            var lat = await AsyncStorage.getItem('latitude')
            var long = await AsyncStorage.getItem('longitude')
            var location = await AsyncStorage.getItem('location')
            console.log('Api Base Url', AppConstants.API_BASE_URL + '/api/admin/getbylocation/' + lat + '/' + long)
            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/admin/getbylocation/' + lat + '/' + long,
            }).then((response) => {
                this.setState({
                    allShop: response.data,
                    lat: lat,
                    long: long,
                    location: location
                })

                // this.props.ChangeProductData(response.data)
            }, (error) => {
                // Alert.alert("Server error.")
            });
        } catch (err) {
            console.warn(err);
        }



        let userDetail = await AsyncStorage.getItem('userDetail');
        let userData = JSON.parse(userDetail);
        // Alert.alert(""+userData.userId);
        // console.log("User Data in shop page",userData)

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

  

    addToCart(id) {

    }

    navigateToCart() {
        const pushAction = StackActions.push(AppRoute.CUSTOMER_CART)
        this.props.navigation.dispatch(pushAction);
    }

    onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });
    }

    selectCategory(id) {
        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/admin/get/shopby/shoptype/' + id,
        }).then((response) => {
            if (null != response.data) {
                this.setState({
                    allShop: response.data,
                    selectedCategory: id
                })
            }
        }, (error) => {
            Alert.alert("Server error!.")
        });
    }

    selectBrand(id) {
        this.setState({ selectedBrand: id })
    }

    async navigateProductDetail(id, shopName) {
        const pushAction = StackActions.push(AppRoute.COMBINED_PRODUCT);
        const pCount = await AsyncStorage.getItem('productCount')
        AsyncStorage.setItem('shopId', String(id))
        AsyncStorage.setItem('shopName', String(shopName))
        if (pCount === '0') {
            AsyncStorage.setItem('productCount', '1')
            this.props.navigation.navigate(AppRoute.COMBINED_PRODUCT)
        } else {
            this.props.navigation.dispatch(pushAction)
            this.props.navigation.navigate(AppRoute.COMBINED_PRODUCT)
            // Alert.alert(pCount + '')

        }
    }

    navigateShopDetailDetail(id, shopId, shopName) {
        AsyncStorage.setItem('shopId', String(shopId))
        AsyncStorage.setItem('shopName', String(shopName))
        const pushAction = StackActions.push(AppRoute.SHOP_DETAIL, { adminId: String(id), shopId: String(shopId) });
        this.props.navigation.dispatch(pushAction)
        // this.props.navigation.navigate(AppRoute.SHOP_DETAIL, { adminId: String(id), shopId: String(shopId) })
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



    handleSearchLatLong(data, details) {
        this.toggleModal();

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
                url: AppConstants.API_BASE_URL + '/api/admin/getbylocation/' + lat + '/' + lng,
            }).then((response) => {
                this.setState({
                    allShop: response.data,
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
            AsyncStorage.setItem('latitude', String(lat))
            AsyncStorage.setItem('longitude', String(long))
            AsyncStorage.setItem('location', 'Current Location')

            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/admin/getbylocation/' + lat + '/' + long,
            }).then((response) => {
                this.setState({
                    allShop: response.data,
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
        const { search, lat, long } = this.state;
        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/admin/search/' + search + '/' + lat + '/' + long
        }).then((response) => {
            this.setState({
                allShop: response.data,
                search: ''
            })
        }, (error) => {
            Alert.alert("Server error.")
        });
    }

    render() {        
        const { allShop, location, searchAttribute, searchTerm, data, ignoreCase, lat, long, searchVisible, search, allCategory, allMeasurement, wishList, allBrand, selectedBrand, selectedCategory } = this.state;
       
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
                                            longitude: Number(long)
                                        }
                                        }
                                    >
                                    </Marker>

                                </MapView>
                            </> : null}
                    </View>
                </Modal>

                <Toolbar
                    title='All Shop'
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
                <Header style={{ backgroundColor: '#ffffff', height: scale(35), marginTop: 0 }}>

                    <View style={{ flexDirection: 'column' }}>
                        <View style={{ marginTop: 10 }}>
                            <FlatList
                                style={{}}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                data={allCategory}
                                renderItem={({ item, index }) => {
                                    return (
                                        <TouchableOpacity onPress={() => { this.selectCategory(item.lookUpId) }}>
                                            <View style={selectedCategory == item.lookUpId ? Styles.product_nav_button_selected : Styles.product_nav_button}>
                                                <Text style={selectedCategory == item.lookUpId ? Styles.product_nav_button_selected_text : Styles.product_nav_button_text}>{item.lookUpLabel}</Text>
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

                        <ScrollView style={[Styles.customer_content, { marginTop: 10 }]} showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefresh.bind(this)}
                                />
                            }
                        >
                            <View style={Styles.all_Item_Main_View}>

                                {null != allShop ? allShop.map((data, index) => {
                                    return (
                                        <View style={Styles.all_Item_List}>
                                            <TouchableOpacity onPress={() => { this.navigateShopDetailDetail(data.adminId, data.shopId, data.shopName) }}>
                                                <View style={[Styles.all_Item_Image_1, Styles.center]}>
                                                    <Avatar source={{ uri: AppConstants.IMAGE_BASE_URL + '/shop/' + data.adminId + '_' + 1 + "_" + data.shopId + '_shop.png' }} style={Styles.all_Item_Image} />
                                                </View>

                                            </TouchableOpacity>

                                            <View style={Styles.all_Item_Detail}>
                                                <View style={{ backgroundColor: '#fff', paddingHorizontal: 5 }}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <View>
                                                            <Text style={{ color: '#000', marginTop: 5, fontWeight: 'bold' }}>{data.shopName}</Text>
                                                        </View>
                                                    </View>
                                                    {null != data.adminAddress ?
                                                        <Text style={{ color: Color.COLOR_ITEM_NAME, marginTop: 5 }}>{data.adminAddress[0] != null ? data.adminAddress[0].city : null}, {null != data.adminAddress[0] ? data.adminAddress[0].state : null}</Text>
                                                        :
                                                        null}
                                                    {null != allCategory ? allCategory.map((shopType, shopIndex) => {
                                                        if (shopType.lookUpId == data.shopType) {
                                                            return (
                                                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginVertical: 5 }}>
                                                                    <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }}>{shopType.lookUpName}</Text>
                                                                </View>
                                                            )
                                                        }
                                                    }) : null}

                                                </View>
                                                <TouchableOpacity onPress={() => { this.navigateProductDetail(data.shopId, data.shopName) }}>
                                                    <View style={[{ backgroundColor: Color.COLOR, marginVertical: 10, alignSelf: 'center', paddingVertical: 5, borderRadius: 5, width: '90%' }, Styles.center]}>
                                                        <Text style={{ color: Color.BUTTON_NAME_COLOR }}>Continue shopping</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                }) : null}
                            </View>
                            <View style={{ height: 10, width: '100%' }} />
                        </ScrollView>
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

// function mapStateToProps(state) {
//     return ({
//         productData: state.tokenReducer.productData
//     })
//   }
  
//   function mapDispatchToProps(dispatch) {
//     return ({
//         changeProductData: (data) => {
//         dispatch(changeProductData(data))
//       }
//     })
//   }
  
  
//   export default connect(mapStateToProps,mapDispatchToProps)(CustomerAllShopScreen);