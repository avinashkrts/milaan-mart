import Geolocation from '@react-native-community/geolocation';
import { CommonActions } from '@react-navigation/core';
import { Divider, List, ListItem, ListItemElement, ThemedComponentProps } from '@ui-kitten/components';
import Axios from 'axios';
import React, { Component } from 'react';
import { ActivityIndicator, Alert, AsyncStorage, Pressable, RefreshControl, Text, View } from 'react-native';
import Geocoder from 'react-native-geocoding';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Modal from 'react-native-modal';
import { scale } from 'react-native-size-matters';

import { AddressEditIcon, BackIcon, CancelIcon } from '../../../assets/icons';
import { Styles } from '../../../assets/styles';
import { SafeAreaLayout, SaveAreaInset } from '../../../components/safe-area-layout.component';
import { Toolbar } from '../../../components/toolbar.component';
import { AppConstants, Color, LableText } from '../../../constants';
import { AppRoute } from '../../../navigation/app-routes';
import { CartAddressScreenProps } from '../../../navigation/customer-navigator/cart-navigation/cart.navigator';
import { CustomerAddressScreenProps } from '../../../navigation/customer-navigator/customer.navigator';

type Props = CartAddressScreenProps & CustomerAddressScreenProps & ThemedComponentProps

export class CustomerAddressScreen extends Component<Props, any> {
    constructor(props: Props) {
        super(props);
        this.state = {
            city: '',
            postOffice: '',
            landMark: '',
            policeStation: '',
            district: '',
            pinCode: '',
            state: '',
            country: 'India',
            shopId: AppConstants.SHOP_ID,
            userId: '',
            userType: '2',
            latitude: '',
            longitude: '',
            isEditable: true,
            modalVisible: false,
            allAddress: [],
            edit: false,
            name: '',
            mobileNo: '',
            street: '',
            searchVisible: false,
            lat: '',
            long: ''
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    async componentDidMount() {
        let userDetail = await AsyncStorage.getItem('userDetail');
        let userData = JSON.parse(userDetail);

        const logedIn = await AsyncStorage.getItem('logedIn');
        if (null != logedIn && logedIn === 'true') {
            Axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/address/getby/userid/' + userData.userId,
            }).then((response) => {
                if (null != response.data) {
                    this.setState({
                        allAddress: response.data
                    })
                }
            }, (error) => {
                Alert.alert("Wait for a moment.")
            });
            this.setState({
                userData: userData,
                userId: userData.userId,
                shopId: userData.shopId
            })
        } else {
            this.props.navigation.navigate(AppRoute.AUTH)
        }
    }

    handleSubmit() {
        const { isEditable, lat, long, name, mobileNo, street, city, shopId, userId, postOffice, policeStation, district, landMark, pinCode, state, country, latitude, longitude, userType } = this.state

        if (name == null || name === '') {
            Alert.alert("Please enter name.");
        } else if (mobileNo == null || mobileNo === '') {
            Alert.alert("Please enter mobile number.");
        } else if (pinCode == null || pinCode === '') {
            Alert.alert("Please enter pincode.");
        } else if (city == null || city === '') {
            Alert.alert("Please enter address.");
        } else {
            Axios({
                method: 'POST',
                url: AppConstants.API_BASE_URL + '/api/address/create',
                data: {
                    city: city,
                    postOffice: postOffice,
                    landmark: landMark,
                    policeStation: policeStation,
                    district: district,
                    pinCode: pinCode,
                    state: state,
                    country: country,
                    shopId: shopId,
                    userId: String(userId),
                    userType: String(userType),
                    name: name,
                    mobileNo: mobileNo,
                    street: street,
                    latitude: lat,
                    longitude: long
                }
            }).then((response) => {
                console.log(response.data)
                this.toggleModal();
                this.props.navigation.dispatch(CommonActions.goBack());
                this.onRefresh()
            }, (error) => {
                Alert.alert("Wait for a moment.");
            })
        }
    }

    handleEdit(index) {
        const { allAddress } = this.state;
        // Alert.alert("" + allAddress[index].landmark)
        this.setState({
            id: allAddress[index].id,
            city: allAddress[index].city,
            postOffice: allAddress[index].postOffice,
            landMark: String(allAddress[index].landmark),
            policeStation: allAddress[index].policeStation,
            district: allAddress[index].district,
            pinCode: String(allAddress[index].pinCode),
            state: allAddress[index].state,
            country: allAddress[index].country,
            name: allAddress[index].name,
            mobileNo: allAddress[index].mobileNo,
            street: allAddress[index].street,
            edit: true,
            lat: allAddress[index].latitude,
            long: allAddress[index].longitude
        })
        this.toggleModal();
    }

    toggleModal() {
        const { modalVisible } = this.state;
        this.setState({
            modalVisible: !modalVisible
        })
    }

    handleEditSubmit() {
        const { isEditable, lat, long, name, mobileNo, street, id, city, shopId, userId, postOffice, policeStation, district, landMark, pinCode, state, country, latitude, longitude, userType } = this.state
        // Alert.alert("Clicked"+ userId)
        // console.log(isEditable, city, postOffice, policeStation, district, landMark, pinCode, state, country, latitude, longitude, userType);
        if (name == null || name === '') {
            Alert.alert("Please enter name.");
        } else if (mobileNo == null || mobileNo === '') {
            Alert.alert("Please enter mobile number.");
        } else if (pinCode == null || pinCode === '') {
            Alert.alert("Please enter pincode.");
        } else if (city == null || city === '') {
            Alert.alert("Please enter address.");
        } else {
            Axios({
                method: 'PUT',
                url: AppConstants.API_BASE_URL + '/api/address/update',
                data: {
                    id: id,
                    city: city,
                    postOffice: postOffice,
                    landMark: landMark,
                    policeStation: policeStation,
                    district: district,
                    pinCode: pinCode,
                    state: state,
                    country: country,
                    shopId: shopId,
                    userId: String(userId),
                    userType: userType,
                    name: name,
                    mobileNo: mobileNo,
                    street: street,
                    latitude: lat,
                    longitude: long
                }
            }).then((response) => {
                this.setState({
                    edit: false
                })
                this.toggleModal();
                this.onRefresh()
            }, (error) => {
                Alert.alert("Wait for a moment.");
            })
        }
    }

    handleDefault(id) {
        const { userId } = this.state;
        Axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/address/change/defaultaddress/' + userId + '/' + id,
        }).then((response) => {
            console.log("Address", response.data)
            if (null != response.data) {
                this.onRefresh();
            }
        }, (error) => {
            Alert.alert("Wait for a moment.")
        });
    }

    onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });
    }

    toggleModal1(modal) {
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

    renderAddress = ({ item, index }: any): ListItemElement => (
        <ListItem style={{ borderBottomColor: 'rgba(2,15,20,0.10)', borderBottomWidth: 1 }}>
            {item != null ?
                // <View>
                <View style={Styles.address_container}>
                    <TouchableOpacity style={{ padding: 5, backgroundColor: Color.COLOR, borderRadius: 10 }} onPress={() => { this.handleDefault(item.id) }}>
                        <Text style={[Styles.address_text, { alignSelf: 'center', padding: 4, color: Color.BUTTON_NAME_COLOR }]}>{item.defaultAddress ? 'Default Address' : 'Set Default'}</Text>
                    </TouchableOpacity>

                    <View style={Styles.address_edit_pen}>
                        <View>
                            <Text style={Styles.address_text}>Name :- {item.name}</Text>
                            <Text style={Styles.address_text}>Mobile No. :- {item.mobileNo}</Text>
                            <Text style={Styles.address_text}>City :- {item.city}</Text>
                            {/* <Text style={Styles.address_text}>Street :- {item.street}</Text>
                            <Text style={Styles.address_text}>Land Mark :- {item.landmark}</Text>
                            <Text style={Styles.address_text}>Post Office :- {item.postOffice}</Text>
                            <Text style={Styles.address_text}>District :- {item.district}</Text>
                            <Text style={Styles.address_text}>State :- {item.state} </Text> */}
                            <Text style={Styles.address_text}>Pincode :- {item.pinCode} </Text>
                            <Text style={Styles.address_text}>Country :-{item.country}</Text>
                        </View>

                        <TouchableOpacity style={{ padding: 5 }} onPress={() => {
                            this.handleEdit(index);
                            this.setState({
                                country: 'India'
                            })
                        }}>
                            <Text style={Styles.address_text}><AddressEditIcon fontSize={20} />
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {/* </View> */}
                </View> :
                <ActivityIndicator size='large' color='green' />}
        </ListItem>
    )

    handleSearchLatLong(data, details) {
        Axios({
            url: 'https://maps.googleapis.com/maps/api/place/details/json?key=' + AppConstants.GOOGLE_MAP_KEY + '&place_id=' + data.place_id
        }).then((response) => {
            const { data: { result: { geometry: { location } } } } = response
            const { lat, lng } = location
            this.setState({
                city: data.description,
                lat: lat,
                long: lng
            })
            this.toggleModal1("SEARCH");
        }, (error) => {
            console.log(error);
        })
    }

    async onCurrentLocation() {
        Geolocation.getCurrentPosition((position) => {
            var lat = position.coords.latitude
            var long = position.coords.longitude
            this.setState({
                lat: lat,
                long: long
            })
            Geocoder.from(lat, long)
                .then((json) => {
                    var addressComponent = json.results[0].address_components[1].long_name
                    // console.log(json.results[0].address_components[1].long_name);
                    this.setState({
                        city: addressComponent
                    })
                })
                .catch((error) => {
                    console.warn(error)
                });
        })
        this.toggleModal1("SEARCH");



        // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Geolocation.getCurrentPosition((position) => {
        //     var lat = position.coords.latitude
        //     var long = position.coords.longitude
        //     console.log('location', lat, position.coords.accuracy)
        //     AsyncStorage.setItem('latitude', String(lat))
        //     AsyncStorage.setItem('longitude', String(long))
        //     AsyncStorage.setItem('location', 'Current Location')

        //     Axios({
        //         method: 'GET',
        //         url: AppConstants.API_BASE_URL + '/api/product/getbylocation/' + lat + '/' + long,
        //     }).then((response) => {
        //         // this.props.changeProductData(response.data)
        //         this.setState({
        //             allProduct: response.data,
        //             lat: position.coords.latitude,
        //             long: position.coords.longitude,
        //             searchVisible: false,
        //             location: 'Current Location'
        //         })
        //     }, (error) => {
        //         Alert.alert("Wait for a moment..")
        //     });
        // }, (erroe) => {

        // }, { enableHighAccuracy: true })
        // } else {
        //     console.log("Camera permission denied");
        // }
    }

    render() {
        const { allAddress, name, searchVisible, lat, long, mobileNo, street, edit, modalVisible, isEditable, city, postOffice, policeStation, district, landMark, pinCode, state, latitude, longitude, country } = this.state
        return (
            <SafeAreaLayout
                style={Styles.safeArea}
                insets={SaveAreaInset.TOP}>
                <Modal style={Styles.modal} isVisible={searchVisible}>
                    <View style={Styles.modalHeader}>
                        <Pressable onPress={() => { this.toggleModal1("SEARCH"); }}>
                            <Text><CancelIcon fontSize={25} /></Text>
                        </Pressable>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View>
                            <Pressable onPress={() => { this.onCurrentLocation() }}>
                                <Text style={{ color: Color.BUTTON_NAME_COLOR, padding: 10, backgroundColor: Color.COLOR, opacity: 0.8, borderRadius: 10, marginTop: 10 }}>{LableText.USE_CURRENT_LOCATION}</Text>
                            </Pressable>
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
                    title='Address'
                    backIcon={BackIcon}
                    onBackPress={this.props.navigation.goBack}
                    style={{ marginTop: -5, marginLeft: -5 }}
                />
                <Divider />
                {/* <Content style={Styles.content}
                   
                > */}

                {/* <View style={Styles.address_container}>
                        <View style={Styles.address_edit_pen}>
                            <View>
                                <Text style={Styles.address_text}>Name :- Avinash Kumar</Text>
                                <Text style={Styles.address_text}>City :- Hajipur</Text>
                                <Text style={Styles.address_text}>District :- Vaishali </Text>
                                <Text style={Styles.address_text}>Pincode :- 800350 </Text>
                            </View>

                            <TouchableOpacity style={{ padding: 5 }} onPress={() => { this.handleEdit() }}>
                                <Text style={Styles.address_text}><AddressEditIcon fontSize={20} />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View> */}
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                    }
                >
                    {null != allAddress ?
                        <List data={allAddress}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefresh.bind(this)}
                                />
                            }
                            renderItem={this.renderAddress}
                        /> : null}
                </ScrollView>

                {allAddress.length <= 0 && this.props.route.name == AppRoute.CART_ADDRESS ?
                    <View style={{ marginHorizontal: '10%' }}>
                        <TouchableOpacity style={[Styles.buttonBox, Styles.center]} onPress={() => { this.props.navigation.navigate(AppRoute.CUSTOMER_CART) }}>
                            <Text style={[{ fontSize: 18, color: 'white' }]}>{LableText.SKIP}</Text>
                        </TouchableOpacity>
                    </View> : null}

                <View style={{ marginHorizontal: '10%' }}>
                    <TouchableOpacity style={[Styles.buttonBox, Styles.center]} onPress={() => {
                        this.toggleModal();
                        this.setState({
                            name: '',
                            mobileNo: '',
                            pinCode: '',
                            city: '',
                            country: 'India'
                        })
                    }}>
                        <Text style={[{ fontSize: 18, color: 'white' }]}>{LableText.ADDNEWADDRESS}</Text>
                    </TouchableOpacity>
                </View>
                <Modal style={Styles.modal} isVisible={modalVisible}>
                    <View style={Styles.modalHeader}>
                        <TouchableOpacity>
                            <Text onPress={() => { this.toggleModal() }}><CancelIcon fontSize={25} /></Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        <Pressable onPress={() => { this.setState({ searchVisible: true }) }}>
                            <View style={{ backgroundColor: Color.COLOR, width: '100%', height: scale(30), justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                                <Text style={{ color: Color.BUTTON_NAME_COLOR }}> Choose Location</Text>
                            </View>
                        </Pressable>
                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.NAME}</Text>
                            </View>
                            <View style={Styles.user_detail_data}>
                                <TextInput
                                    editable={isEditable}
                                    style={Styles.cash_pay_input}
                                    placeholder={LableText.NAME}
                                    value={name}
                                    onChangeText={(value) => { this.setState({ name: value }) }}
                                />
                            </View>
                        </View>

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.MOBILE}</Text>
                            </View>
                            <View style={Styles.user_detail_data}>
                                <TextInput
                                    editable={isEditable}
                                    style={Styles.cash_pay_input}
                                    placeholder={LableText.MOBILE}
                                    value={mobileNo}
                                    onChangeText={(value) => { this.setState({ mobileNo: value }) }}
                                />
                            </View>
                        </View>

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.PIN_CODE}</Text>
                            </View>
                            <View style={Styles.user_detail_data}>
                                <TextInput
                                    editable={isEditable}
                                    style={Styles.cash_pay_input}
                                    placeholder={LableText.PIN_CODE}
                                    value={pinCode}
                                    onChangeText={(value) => { this.setState({ pinCode: value }) }}
                                />
                            </View>
                        </View>

                        <View style={Styles.user_detail}>
                            <View style={Styles.user_detail_header}>
                                <Text style={Styles.user_detail_header_text}>{LableText.ADDRESS}</Text>
                            </View>
                            <View style={Styles.user_detail_data}>
                                <TextInput
                                    style={Styles.cash_pay_input}
                                    placeholder={LableText.ADDRESS}
                                    multiline={true}
                                    value={city}
                                    onChangeText={(value) => { this.setState({ city: value }) }}
                                />
                            </View>
                        </View>

                        {/* <View style={Styles.user_detail}>
                                <View style={Styles.user_detail_header}>
                                    <Text style={Styles.user_detail_header_text}>{LableText.STREET}</Text>
                                </View>
                                <View style={Styles.user_detail_data}>
                                    <TextInput
                                        editable={isEditable}
                                        style={Styles.cash_pay_input}
                                        placeholder={LableText.STREET}
                                        value={street}
                                        onChangeText={(value) => { this.setState({ street: value }) }}
                                    />
                                </View>
                            </View>

                            <View style={Styles.user_detail}>
                                <View style={Styles.user_detail_header}>
                                    <Text style={Styles.user_detail_header_text}>{LableText.LAND_MARK}</Text>
                                </View>
                                <View style={Styles.user_detail_data}>
                                    <TextInput
                                        editable={isEditable}
                                        style={Styles.cash_pay_input}
                                        placeholder={LableText.LAND_MARK}
                                        value={landMark}
                                        onChangeText={(value) => { this.setState({ landMark: value }) }}
                                    />
                                </View>
                            </View>

                            <View style={Styles.user_detail}>
                                <View style={Styles.user_detail_header}>
                                    <Text style={Styles.user_detail_header_text}>{LableText.POST_OFFICE}</Text>
                                </View>
                                <View style={Styles.user_detail_data}>
                                    <TextInput
                                        editable={isEditable}
                                        style={Styles.cash_pay_input}
                                        placeholder={LableText.POST_OFFICE}
                                        value={postOffice}
                                        onChangeText={(value) => { this.setState({ postOffice: value }) }}
                                    />
                                </View>
                            </View>

                            <View style={Styles.user_detail}>
                                <View style={Styles.user_detail_header}>
                                    <Text style={Styles.user_detail_header_text}>{LableText.POLICE_STATION}</Text>
                                </View>
                                <View style={Styles.user_detail_data}>
                                    <TextInput
                                        editable={isEditable}
                                        style={Styles.cash_pay_input}
                                        placeholder={LableText.POLICE_STATION}
                                        value={policeStation}
                                        onChangeText={(value) => { this.setState({ policeStation: value }) }}
                                    />
                                </View>
                            </View>

                            <View style={Styles.user_detail}>
                                <View style={Styles.user_detail_header}>
                                    <Text style={Styles.user_detail_header_text}>{LableText.DISTRICT}</Text>
                                </View>
                                <View style={Styles.user_detail_data}>
                                    <TextInput
                                        editable={isEditable}
                                        style={Styles.cash_pay_input}
                                        placeholder={LableText.DISTRICT}
                                        value={district}
                                        onChangeText={(value) => { this.setState({ district: value }) }}
                                    />
                                </View>
                            </View> */}

                        {/* <View style={Styles.user_detail}>
                                <View style={Styles.user_detail_header}>
                                    <Text style={Styles.user_detail_header_text}>{LableText.STATE}</Text>
                                </View>
                                <View style={Styles.user_detail_data}>
                                    <TextInput
                                        editable={isEditable}
                                        style={Styles.cash_pay_input}
                                        placeholder={LableText.STATE}
                                        value={state}
                                        onChangeText={(value) => { this.setState({ state: value }) }}
                                    />
                                </View>
                            </View> */}

                        {/* 
                            <View style={Styles.user_detail}>
                                <View style={Styles.user_detail_header}>
                                    <Text style={Styles.user_detail_header_text}>{LableText.LATITUDE}</Text>
                                </View>
                                <View style={Styles.user_detail_data}>
                                    <TextInput
                                        editable={isEditable}
                                        style={Styles.cash_pay_input}
                                        placeholder={LableText.LATITUDE}
                                        value={latitude}
                                        onChangeText={(value) => { this.setState({ latitude: value }) }}
                                    />
                                </View>
                            </View>

                            <View style={Styles.user_detail}>
                                <View style={Styles.user_detail_header}>
                                    <Text style={Styles.user_detail_header_text}>{LableText.LONGITUDE}</Text>
                                </View>
                                <View style={Styles.user_detail_data}>
                                    <TextInput
                                        editable={isEditable}
                                        style={Styles.cash_pay_input}
                                        placeholder={LableText.LONGITUDE}
                                        value={longitude}
                                        onChangeText={(value) => { this.setState({ longitude: value }) }}
                                    />
                                </View>
                            </View> */}

                        {/* <View style={Styles.user_detail}>
                                <View style={Styles.user_detail_header}>
                                    <Text style={Styles.user_detail_header_text}>{LableText.COUNTRY}</Text>
                                </View>
                                <View style={Styles.user_detail_data}>
                                    <TextInput
                                        editable={isEditable}
                                        style={Styles.cash_pay_input}
                                        placeholder={LableText.COUNTRY}
                                        value={country}
                                        onChangeText={(value) => { this.setState({ country: value }) }}
                                    />
                                </View>
                            </View> */}

                        {null != edit ? edit ?
                            <View style={{ marginHorizontal: '10%' }}>
                                <View style={[{ marginVertical: 20 }, Styles.center]} >
                                    <Text onPress={() => { this.handleEditSubmit() }} style={[Styles.buttonName, { backgroundColor: Color.COLOR, paddingHorizontal: '30%', paddingVertical: 10, borderRadius: 40 }]}>{LableText.EDIT}</Text>
                                </View>
                            </View> :

                            <View style={{ marginHorizontal: '10%' }}>
                                <View style={[{ marginVertical: 20 }, Styles.center]} >
                                    <Text onPress={() => { this.handleSubmit() }} style={[Styles.buttonName, { backgroundColor: Color.COLOR, paddingHorizontal: '30%', paddingVertical: 10, borderRadius: 40 }]}>{LableText.SAVE}</Text>
                                </View>
                            </View> :
                            null
                        }
                    </ScrollView>
                </Modal>
                {/* <View style={Styles.bottomSpace}></View> */}
                {/* </Content> */}

            </SafeAreaLayout>
        );
    }

}