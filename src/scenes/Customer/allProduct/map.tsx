import React, { Component } from 'react';
import { View, Platform, PermissionsAndroid, TextInput, ScrollView, Alert } from 'react-native';
import { ThemedComponentProps } from 'react-native-ui-kitten';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Input, Text } from 'native-base';
import { MapScreenProps } from '../../../navigation/customer-navigator/customerAllProduct.navigator';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { AppConstants } from '../../../constants';
import Geolocation from '@react-native-community/geolocation';
import { getGeocode, getLatLng } from "use-places-autocomplete";
import { GoogleAutoComplete } from 'react-native-google-autocomplete';
import Axios from 'axios';

export class MapScreen extends Component<MapScreenProps, ThemedComponentProps & any> {
    constructor(props) {
        super(props);
        this.state = {
            lat: '',
            long: ''
        }
    }

    async componentDidMount() {
        // if (Platform.OS === 'android') {
        //     const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        //     if (granted) {
        //         Geolocation.getCurrentPosition((position) => {
        //             console.log('location', position.coords.accuracy)

        //             this.setState({
        //                 lat: position.coords.latitude,
        //                 long: position.coords.longitude
        //             })
        //         })
        //     } else {
        //         Alert.alert('')
        //     }
        //   }

    }

    handleSearchLatLong(data, details) {
        Axios({
            url: 'https://maps.googleapis.com/maps/api/place/details/json?key=' + AppConstants.GOOGLE_MAP_KEY + '&place_id=' + data.place_id
        }).then((response) => {
            const { data: { result: { geometry: { location } } } } = response
            const { lat, lng } = location
            console.log('Location', location)
            this.setState({
                lat: lat,
                long: lng
            })
        }, (error) => {
            console.log(error);
        })
    }

    render() {
        const { lat, long } = this.state
        return (
            <View style={{ flex: 1 }}>
                <GooglePlacesAutocomplete
                    placeholder='Search'
                    onPress={(data, details = null) => {
                        // 'details' is provided when fetchDetails = true
                        this.handleSearchLatLong(data, details)
                        // console.log(data.place_id,);
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


                        {/* <GoogleAutoComplete apiKey={AppConstants.GOOGLE_MAP_KEY} debounce={300}>
                            {({ inputValue, handleTextChange, locationResults, fetchDetails }) => (
                                <React.Fragment>
                                    <TextInput
                                        style={{
                                            height: 40,
                                            width: 300,
                                            borderWidth: 1,
                                            paddingHorizontal: 16,
                                        }}
                                        value={inputValue}
                                        onChangeText={handleTextChange}
                                        placeholder="Location..."
                                    />
                                    <ScrollView style={{ maxHeight: 100 }}>
                                        {locationResults.map((el, i) => (
              <LocationItem
                {...el}
                fetchDetails={fetchDetails}
                key={String(i)}
              />
            ))}
                                    </ScrollView>
                                </React.Fragment>
                            )}
                        </GoogleAutoComplete> */}

                        <MapView
                            style={{ flex: 1 }}
                            provider={PROVIDER_GOOGLE}                            
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
                    </>
                    : null
                }
            </View>
        )
    }

}