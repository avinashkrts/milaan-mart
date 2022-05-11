import React, { Component } from "react";
import { View, Text, RefreshControl, AsyncStorage, Alert, StyleSheet, PermissionsAndroid } from "react-native";
import { Avatar, Divider, ThemedComponentProps } from "react-native-ui-kitten";
import { SafeAreaLayout, SaveAreaInset } from "../../components/safe-area-layout.component";
import { Toolbar } from "../../components/toolbar.component";
import { BackIcon, CartIcon, CancelIcon, SearchIcon, WishIcon, MenuIcon } from "../../assets/icons";
import { FlatList, ScrollView, TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { AppConstants, Color } from "../../constants";
import { Styles } from "../../assets/styles";
import axios from 'axios';
import Animated from "react-native-reanimated";
import { AppRoute } from "../../navigation/app-routes";
import Axios from "axios";
import { CombinedProductScreenProps } from "../../navigation/combined-navigator/combinedAllProduct.navigator";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geolocation from 'react-native-geolocation-service';
import Modal from "react-native-modal";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Header } from 'native-base';
import { StackActions } from "@react-navigation/native";
import { scale } from "react-native-size-matters";
import { TestProductScreenProps } from "../../navigation/customer-navigator/customerAllProduct.navigator";
import { TestComponent } from "./test.component";
import WebView from "react-native-webview";

export class TestScreen extends Component<TestProductScreenProps, ThemedComponentProps & any> {
    constructor(props) {
        super(props);
        this.state = {
            allData: [
                {
                    url: '/api/lookup/getallmeasurementtype',
                    method: 'GET',
                    variable: 'allMeasurement',
                }
            ],
            allMeasurement: [],
            webview: true,
            done: false
        }
        this._onRefresh = this._onRefresh.bind(this);
    }

    async componentDidMount() {
        const { allData } = this.state;
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

    _onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });
    }

    result() {

    }

    closeWeb() {
        Alert.alert("Clicked")
    }

    render() {
        const { webview, done, shopName, single, searchVisible, location, lat, long, refreshing, shopId, search, allCategory, allMeasurement, wishList, allBrand, selectedBrand, selectedCategory } = this.state;
        const closeWeb = `        
        function closeWeb1() {
            document.body.style.backgroundColor = 'red';
             console.log('hi') }
        // setTimeout(function() { window.alert('hi') }, 2000);
        true; // note: this is required, or you'll sometimes get silent failures
      `;
        return (
            // <SafeAreaLayout
            //     style={Styles.safeArea}
            //     insets={SaveAreaInset.TOP}>
            //     <Toolbar
            //         title='Test Screen'
            //         backIcon={MenuIcon}
            //         onBackPress={this.props.navigation.openDrawer}
            //         onRightPress={() => { }}
            //         menuIcon={CartIcon}
            //         style={{ marginTop: -5, marginLeft: -5 }}
            //     />
            //     <Divider />
            //     <ScrollView>
            //         <TestComponent data={allMeasurement} />
            //     </ScrollView>
            // </SafeAreaLayout>



            <SafeAreaLayout
                style={Styles.safeArea}
                insets={SaveAreaInset.TOP}>
                <Toolbar
                    title='Test Screen'
                    backIcon={MenuIcon}
                    onBackPress={this.props.navigation.openDrawer}
                    onRightPress={() => { }}
                    menuIcon={CartIcon}
                    style={{ marginTop: -5, marginLeft: -5 }}
                />
                <Divider />
                {/* <ScrollView> */}
                {/* <TestComponent data={allMeasurement} /> */}
                <>

                    {webview ?
                        <>
                            <WebView
                                source={{
                                    uri: 'https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest=264a6eaf74bfdaef4329082bd50a579caf0651fedfe29433f69d2387051f43f4a87cd555083febfe68cc52085dfd37b19f705c3647194b800c56c477dae3c80e6e2d7c6ec0e086eb70ec29e3867951a48b80d14ea56f1a03d1e487eaa6632444a37f338cef932869879ee4c6c040e3dcd4eee84991f68b2c66cba6392ddb6795447f7615adfbb672d59f0beff399f9e1cb37cc63996735f8ec2a6342b094b09e343c619146c5a02584e2e22195a55da36ea9809f49a6c62897f9bcc21f5dbb79&access_code=AVPX50IJ25AB06XPBA'
                                }}
                                style={{ marginTop: 20 }}
                                // onMessage={(event) => {  }}
                                injectedJavaScript={closeWeb}
                                // injectedJavaScriptBeforeContentLoaded = {closeWeb}
                                onNavigationStateChange={(navState) => {
                                    // Keep track of going back navigation within component
                                    // this.props.navigation.canGoBack = navState.canGoBack
                                    // Alert.alert("" + navState)
                                    if (navState.url === "http://api.milaansearch.com:8082/api/sms/success1") {
                                        this.setState({ done: true })
                                    }
                                    console.log("Data Nav", navState)
                                }}
                            />
                            {done ?
                                <>
                                    <Text onPress={() => {this.setState({ webview: false })}} >Done</Text>
                                </>
                                : null
                            }
                        </>
                        :
                        <View>
                            <Text>Avinash</Text>
                        </View>
                    }
                </>
                {/* </ScrollView> */}
            </SafeAreaLayout>
        );
    }
}