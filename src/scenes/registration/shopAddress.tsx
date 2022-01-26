import React, { Component } from 'react';
import { Alert, View, Image, TextInput, TouchableOpacity, AsyncStorage, PermissionsAndroid, RefreshControl } from 'react-native';
import { Text } from 'react-native-ui-kitten';
import { SafeAreaLayout, SaveAreaInset, } from '../../components/safe-area-layout.component';
import { Content, Picker } from 'native-base';
import { AppRoute } from '../../navigation/app-routes';
import { CancelIcon, EyeIcon, EyeOffIcon, } from '../../assets/icons';
import axios from 'axios';
import { Styles } from '../../assets/styles'
import { AppConstants, Color, LableText, Placeholder } from '../../constants';
import DeviceInfo from 'react-native-device-info';
import { scale } from 'react-native-size-matters';
import { ShopAddressScreenProps } from '../../navigation/registration.navigator';
import Geolocation from 'react-native-geolocation-service';
import Modal from "react-native-modal";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Axios from 'axios';
import { SignRegAddressScreenProps } from '../../navigation/auth.navigator';
import {  StyleSheet, BackHandler } from "react-native";

const data = [
    { text: 'Candidate' },
    { text: 'HR' },
];

type State = {}
export class ShopAddressScreen extends Component<ShopAddressScreenProps & SignRegAddressScreenProps, any & State, any> {
    backHandler: any;
    constructor(props) {
        super(props);

        this.state = {
            pinCode: '',
            city: '',
            state: '',
            country: 'India',
            latitude: '',
            longitude: '',
            mobileNo: '',
            landMark: '',
            userType: '',
            shopId: AppConstants.SHOP_ID,
            district: '',
            policeStation: '',
            postOffice: '',
            street: '',
            userId: '',
            searchVisible: false,
            emailId: '',
            from: '',
            location: ''
        }

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onPasswordIconPress = this.onPasswordIconPress.bind(this);
    }

    

    backAction = () => {
       
        Alert.alert("Alert!", LableText.ALERT_REGISTER_IMAGE, [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel"
          },
          { text: "YES", onPress: () =>{
            // BackHandler.exitApp() 
            this.props.navigation.navigate(AppRoute.CUSTOMER_HOME);
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
        
        let deviceId = DeviceInfo.getUniqueId();
        const shopId = this.props.route.params.shopId;
        const adminId = this.props.route.params.adminId;
        const mobileNo = this.props.route.params.mobileNo;
        const emailId = this.props.route.params.emailId;
        const from = this.props.route.params.from;
        // console.log('Product Id', productId)

        this.setState({
            shopId: shopId,
            userId: adminId,
            mobileNo: mobileNo,
            emailId: emailId,
            from: from,
            location: 'Set Location'
        })
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
                // console.log('Location', position)
                var lat = position.coords.latitude
                    var long = position.coords.longitude
                    // console.log('location', lat, position.coords.accuracy)
                    this.setState({
                        latitude: lat,
                        longitude: long
                    })

                    Axios({
                        url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&key=' + AppConstants.GOOGLE_MAP_KEY,
                    }).then((response) => {
                        // const { data: { result: { geometry: { location } } } } = response
                        // const { lat, lng } = location
                        // console.log('Location', response.data)
                        // axios({
                        //     method: 'GET',
                        //     url: AppConstants.API_BASE_URL + '/api/admin/getbylocation/' + lat + '/' + lng,
                        // }).then((response) => {
                        this.setState({
                            location: response.data.results[0].formatted_address
                        })
                        // }, (error) => {
                        //     Alert.alert("Server error.")
                        // });
            
                    }, (error) => {
                        console.log(error);
                    })

                }, (erroe) => {

                }, { enableHighAccuracy: true })
            } else {
                console.log("Location permission denied");
            }
        } catch (err) {
            console.warn(err);
        }

        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/lookup/getalllookup',
        }).then((response) => {
            response.data.USER_TYPE.map((userType) => {
                userType.lookUpName === 'ADMIN' ? this.setState({
                    userType: userType.lookUpId
                }) : null
            })
        }, (error) => {
            Alert.alert("Didn't got data from server")
        });

    }

    onFormSubmit() {
        const { pinCode, from, city, state, country, emailId, latitude, longitude, mobileNo, landMark, userType, shopId, district, postOffice, policeStation, street, userId } = this.state;
        console.log('pin', pinCode, 'city', city, 'state', state, 'country', country, 'lat', latitude, 'longi', longitude, 'mob', mobileNo, 'land', landMark, 'uType', userType, 'shopId', shopId, 'district', district, 'post', postOffice, 'ps', policeStation, 'street', street, 'uId', userId)
        if (city === " " || city.length == 0) {
            Alert.alert("Enter City");
        } else if (street === "" || street.length == 0) {
            Alert.alert("Enter Street");
        } else if (landMark === "" || landMark.length == 0) {
            Alert.alert("Enter Land Mark.");
        } else if (postOffice === "" || postOffice.length == 0) {
            Alert.alert("Enter Post Office");
        } else if (pinCode === "" || pinCode.length == 0 || pinCode.length < 6 || pinCode.length > 6) {
            Alert.alert("Enter a valid Pin code");
        } else if (policeStation === "" || policeStation.length == 0) {
            Alert.alert("Enter Police Station");
        } else if (district === "" || district.length == 0) {
            Alert.alert("Select District.");
        } else if (state === "" || state.length == 0) {
            Alert.alert("Enter State");
        } else if (country === "" || country.length == 0) {
            Alert.alert("Enter Country");
        } else if (latitude === "" || latitude.length == 0) {
            Alert.alert("Select location");
        } else if (longitude === "" || longitude.length == 0) {
            Alert.alert("Select Location");
        } else {
            axios({
                method: 'POST',
                url: AppConstants.API_BASE_URL + '/api/useraddress/create',
                data: {
                    pinCode: pinCode,
                    city: city,
                    state: state,
                    country: country,
                    latitude: latitude,
                    longitude: longitude,
                    mobileNo: mobileNo,
                    landMark: landMark,
                    userType: userType,
                    shopId: shopId,
                    district: district,
                    postOffice: postOffice,
                    policeStation: policeStation,
                    userId: userId,
                    street: street
                }
            }).then((response) => {
                if (response) {
                    if (response.data.status === 'true') {
                        Alert.alert('User address created successfully, login with your credential.');
                        if (from === 'shopReg') {
                            this.props.navigation.navigate(AppRoute.SHOP_IMAGE, { adminId: userId, shopId: shopId, mobileNo: mobileNo, emailId: emailId });
                        } else if (from === 'signIn') {
                            this.props.navigation.navigate(AppRoute.SIGN_REG_IMAGE, { adminId: userId, shopId: shopId, mobileNo: mobileNo, emailId: emailId });
                        }
                    }
                }
            }, (error) => {
                console.log(error)
            });
        }
    }

    onPasswordIconPress() {
        this.setState({ passwordVisible: !this.state.passwordVisible })
    };

    navigateSignIn() {
        this.props.navigation.navigate(AppRoute.SIGN_IN);
    };

    handleSearchLatLong(data, details) {
        // this.toggleModal();   

        Axios({
            url: 'https://maps.googleapis.com/maps/api/place/details/json?key=' + AppConstants.GOOGLE_MAP_KEY + '&place_id=' + data.place_id
        }).then((response) => {
            const { data: { result: { geometry: { location } } } } = response
            const { lat, lng } = location
            console.log('Location', data.structured_formatting.main_text)
            // axios({
            //     method: 'GET',
            //     url: AppConstants.API_BASE_URL + '/api/admin/getbylocation/' + lat + '/' + lng,
            // }).then((response) => {
            this.setState({
                allShop: response.data,
                latitude: lat,
                longitude: lng,
                // searchVisible: false,
                location: data.structured_formatting.main_text
            })
            // }, (error) => {
            //     Alert.alert("Server error.")
            // });

        }, (error) => {
            console.log(error);
        });
    }

    toggleModal() {
        this.setState({
            searchVisible: false
        })
    }

    onCurrentLocation() {
        console.log('Map Clicked')
        // this.toggleModal();
        // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition((position) => {
            var lat = position.coords.latitude
            var long = position.coords.longitude
            // console.log('location', lat, long, position.coords.accuracy)
            Axios({
                url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&key=' + AppConstants.GOOGLE_MAP_KEY,
            }).then((response) => {
                this.setState({
                    location: response.data.results[0].formatted_address,
                    latitude: lat,
                    longitude: long,
                })    
            }, (error) => {
                console.log(error);
            })
        }, (erroe) => {

        }, { enableHighAccuracy: true })
    }

    onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });
    }

    render() {
        const { pinCode, emailId, location, city, state, searchVisible, country, latitude, longitude, mobileNo, landMark, userType, shopId, district, postOffice, policeStation, street, userId, } = this.state;
        // const { firstName, passwordVisible, lastName, mobileNo, pwd, gender, genderData, shopName, shopType, shopTypeData, panNo, adharNo, gstNo, description } = this.state;
        return (
            <SafeAreaLayout
                style={Styles.safeArea}
                insets={SaveAreaInset.TOP} >
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
                        {latitude !== '' && longitude !== '' ?
                            <>
                                <MapView
                                    style={{ flex: 1 }}
                                    provider={PROVIDER_GOOGLE}
                                    showsUserLocation={true}
                                    initialRegion={{
                                        latitude: latitude,
                                        longitude: longitude,
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }}

                                    region={{
                                        latitude: latitude,
                                        longitude: longitude,
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }}
                                >

                                    <Marker
                                        coordinate={{
                                            latitude: latitude,
                                            longitude: longitude
                                        }
                                        }
                                    >
                                    </Marker>

                                </MapView>
                            </> : null}
                        <View>
                            <Text onPress={() => { this.toggleModal() }} style={{ color: Color.BUTTON_NAME_COLOR, paddingHorizontal: scale(30), fontSize: scale(18), fontWeight: 'bold', paddingVertical: scale(10), alignSelf: 'center', backgroundColor: Color.COLOR, opacity: 0.8, borderRadius: 10, marginTop: 10 }}>Submit</Text>
                        </View>
                    </View>
                </Modal>
                < Content style={Styles.content}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                    }
                >
                    <View>
                        <Image
                            source={require('../../assets/logo.png')}
                            resizeMode="contain"
                            style={[Styles.loginImage, { marginBottom: scale(50), marginTop: scale(70) }]}
                        />
                        <View style={Styles.center}>
                            <Text style={[{ fontSize: scale(18), textAlign: 'justify', paddingHorizontal: scale(10), marginVertical: scale(10) }]}>{LableText.SIGN_UP_ALERT}</Text>
                        </View>

                        <View style={Styles.center}>
                            <Text style={[{ fontSize: scale(18), textAlign: 'center', marginVertical: scale(10) }]}>Your Admin ID - {emailId}</Text>
                        </View>

                        <View style={Styles.inputTextView}>
                            <TextInput
                                style={Styles.inputText}
                                placeholder={LableText.VILLAGE}
                                value={city}
                                onChangeText={(value) => { this.setState({ city: value }) }}
                            />
                        </View>

                        <View style={Styles.inputTextView}>
                            <TextInput
                                style={Styles.inputText}
                                placeholder={LableText.STREET}
                                value={street}
                                onChangeText={(value) => { this.setState({ street: value }) }}
                            />
                        </View>

                        {/* <View style={Styles.inputTextView}>
                            <Picker
                                note
                                mode="dropdown"
                                style={[Styles.center, { color: Color.COLOR, width: '100%' }]}
                                selectedValue={gender}
                                onValueChange={(value) => { this.setState({ gender: value }) }}
                            >
                                <Picker.Item label="Select Gender" value="" />
                                {null != genderData ? genderData.map((data, index) => {
                                    return (
                                        <Picker.Item label={data.lookUpName} value={data.lookUpId} />
                                    )
                                }) : null}
                            </Picker>
                        </View> */}

                        <View style={Styles.inputTextView}>
                            <TextInput
                                style={Styles.inputText}
                                placeholder={LableText.LAND_MARK}
                                value={landMark}
                                onChangeText={(value) => { this.setState({ landMark: value }) }}
                            />
                        </View>

                        {/* <View style={Styles.inputTextView}>
                            <TextInput
                                secureTextEntry={passwordVisible}
                                style={Styles.inputTextWithIcon}
                                placeholder={Placeholder.PASSWORD}
                                value={pwd}
                                onChangeText={(value) => { this.setState({ pwd: value }) }}
                            />
                            <View style={[Styles.inputTextIcon, Styles.center]}>
                                {this.state.passwordVisible ?
                                    <TouchableOpacity onPress={this.onPasswordIconPress}>
                                        <Text style={{ color: Color.COLOR }}> <EyeOffIcon /></Text>
                                    </TouchableOpacity> :
                                    <TouchableOpacity onPress={this.onPasswordIconPress}>
                                        <Text style={{ color: Color.COLOR }}> <EyeIcon /> </Text>
                                    </TouchableOpacity>
                                }
                            </View>
                        </View> */}

                        <View style={Styles.inputTextView}>
                            <TextInput
                                style={Styles.inputText}
                                placeholder={LableText.POST_OFFICE}
                                value={postOffice}
                                onChangeText={(value) => { this.setState({ postOffice: value }) }}
                            />
                        </View>

                        <View style={Styles.inputTextView}>
                            <TextInput
                                style={Styles.inputText}
                                placeholder={LableText.PIN_CODE}
                                keyboardType='numeric'
                                value={pinCode}
                                onChangeText={(value) => { this.setState({ pinCode: value }) }}
                            />
                        </View>

                        {/* <View style={Styles.inputTextView}>
                            <Picker
                                note
                                mode="dropdown"
                                style={[Styles.center, { color: Color.COLOR, width: '100%' }]}
                                selectedValue={shopType}
                                onValueChange={(value) => { this.setState({ shopType: value }) }}
                            >
                                <Picker.Item label="Select Business Type" value="" />
                                {null != shopTypeData ? shopTypeData.map((data, index) => {
                                    return (
                                        <Picker.Item label={data.lookUpName} value={data.lookUpId} />
                                    )
                                }) : null}
                            </Picker>
                        </View> */}

                        <View style={Styles.inputTextView}>
                            <TextInput
                                style={Styles.inputText}
                                placeholder={LableText.POLICE_STATION}
                                value={policeStation}
                                onChangeText={(value) => { this.setState({ policeStation: value }) }}
                            />
                        </View>

                        <View style={Styles.inputTextView}>
                            <TextInput
                                style={Styles.inputText}
                                placeholder={LableText.DISTRICT}
                                value={district}
                                onChangeText={(value) => { this.setState({ district: value }) }}
                            />
                        </View>

                        <View style={Styles.inputTextView}>
                            <TextInput
                                style={Styles.inputText}
                                placeholder={LableText.STATE}
                                value={state}
                                onChangeText={(value) => { this.setState({ state: value }) }}
                            />
                        </View>

                        <View style={Styles.inputTextView}>
                            <TextInput
                                style={Styles.inputText}
                                editable={false}
                                placeholder={LableText.COUNTRY}
                                value={country}
                                onChangeText={(value) => { this.setState({ country: value }) }}
                            />
                        </View>

                        <View style={Styles.inputTextView}>
                            <Text
                                style={[Styles.inputText, { paddingVertical: scale(12), color: Color.SILVER }]}
                                onPress={() => { this.setState({ searchVisible: true }) }}
                            >{location}</Text>
                        </View>

                        <View style={{ marginHorizontal: '10%' }}>
                            <TouchableOpacity style={[Styles.buttonBox, Styles.center]} onPress={() => { this.onFormSubmit() }}>
                                <Text style={Styles.buttonName}>{LableText.NEXT}</Text>
                            </TouchableOpacity>
                        </View>

                        {/* <TouchableOpacity onPress={() => { this.props.navigation.navigate(AppRoute.SIGN_IN) }}>
                            <Text style={[Styles.dontHaveAccount, { marginTop: 5 }]}>{LableText.ALREADY_HAVE_ACCOUNT}</Text>
                        </TouchableOpacity> */}

                    </View>
                    <View style={Styles.bottomSpace}></View>
                </Content>
            </SafeAreaLayout >
        );
    }
};