import React, { Component } from 'react';
import { View, Alert, PermissionsAndroid, Linking, Platform } from 'react-native';
import { AppRoute } from '../../navigation/app-routes';
import { AppConstants } from '../../constants';
import { Styles } from '../../assets/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
import OneSignal from 'react-native-onesignal';
import Geolocation from 'react-native-geolocation-service';
import VersionCheck from 'react-native-version-check';
import { UserDecideProps } from '../../navigation/user-decide/userDecide.navigator';
import { ThemedComponentProps } from '@ui-kitten/components';
import Geocoder from 'react-native-geocoding';


interface State {
    email: string | undefined;
    password: string | undefined;
    token: string | undefined;
}

type Props = UserDecideProps & ThemedComponentProps & any;

export class UserDecide extends Component<Props, State & any> {
    constructor(props: Props) {
        super(props);

        this.state = {
            mobileNo: '',
            otp: '',
            data: [],
            playerId: '8a6d8667-7422-4bad-b9e6-5d5625f73a96'
        }
        this.navigate = this.navigate.bind(this);
    }



    async componentDidMount() {
        const { data, playerId } = this.state;
        OneSignal.setLogLevel(6, 0);
        OneSignal.setAppId("43e3395b-0019-492b-b999-4321444f25ad");
        Geocoder.init(AppConstants.GOOGLE_MAP_KEY);
        AsyncStorage.setItem('categoryId', '')

        // inAppUpdates.checkNeedsUpdate({ curVersion: '15' }).then((result) => {
        //     console.log('qwer', result)
        //     if (result.shouldUpdate) {
        //         let updateOptions: StartUpdateOptions = {};
        //         if (Platform.OS === 'android') {
        //             // android only, on iOS the user will be promped to go to your app store page
        //             updateOptions = {
        //                 updateType: IAUUpdateKind.FLEXIBLE,
        //             };
        //         }
        //         inAppUpdates.startUpdate(updateOptions); // https://github.com/SudoPlz/sp-react-native-in-app-updates/blob/master/src/types.ts#L78
        //     }
        // });
        // console.log(VersionCheck.getCurrentVersion())

        fetch(
            `https://play.google.com/store/apps/details?id=com.milaan.mart&hl=en`,
        ).then(res => res.text())
            .then((text) => {
                const match = text.match(/Current Version.+>([\d.]{4,10})<\/span>/);
                if (match) {
                    const latestVersion = match[1].trim();
                    return Promise.resolve(latestVersion);
                }
                return Promise.reject();
            });

        // VersionCheck.getLatestVersion()    // Automatically choose profer provider using `Platform.select` by device platform.
        //     .then(latestVersion => {
        //         console.log(latestVersion);    // 0.1.2
        //     });

        // VersionCheck.getPlayStoreUrl()
        // .then(country => console.log(country)); 

        // VersionCheck.getLatestVersion({packageName: "com.milaan.mart"}).then(latestVersion => {
        //         console.log('latest version',latestVersion);    // 0.1.2
        //     });

        // VersionCheck.getLatestVersion({
        //     provider: 'playStore'
        // }).then(latestVersion => {
        //     console.log('Latest Version', latestVersion);
        // });

        //   VersionCheck.needUpdate()
        //     .then(async res => {
        //         console.log(res)
        //     })

        // VersionCheck.needUpdate()
        //     .then(async res => {
        //         // console.log('data', res.isNeeded);    // true
        //         if (res.isNeeded) {
        //             Linking.openURL(res.storeUrl);  // open store if update is needed.
        //         } else {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Milaan Mart Location Permission",
                    message:
                        "Milaan Mart needs access to your Location " +
                        "so you can get your nearest shop.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                Geolocation.getCurrentPosition((position) => {
                    var lat = position.coords.latitude
                    var long = position.coords.longitude
                    AsyncStorage.setItem('latitude', String(lat))
                    AsyncStorage.setItem('longitude', String(long))
                    AsyncStorage.setItem('location', 'Current Location')
                    // console.log('location', lat, position.coords.accuracy)
                    this.navigate()
                }, (err) => {

                }, { enableHighAccuracy: true })
            } else {
                // console.log("Location permission denied");
                Alert.alert("Please give location permition to use this application.")
            }
        } catch (err) {
            console.warn(err);
        }
        //     }
        // });


    }

    async navigate() {

        const contents = 'You are first in line';
        // const playerId = '8a6d8667-7422-4bad-b9e6-5d5625f73a96';
        // OneSignal.postNotification(contents, data, playerId);
        const deviceState = await OneSignal.getDeviceState();
        // console.log('one signal', deviceState)

        AsyncStorage.setItem('productCount', '0');
        AsyncStorage.setItem('wishCount', '0');
        AsyncStorage.setItem('billCount', '0');
        AsyncStorage.setItem('offerCount', '0');

        const value = await AsyncStorage.getItem('userDetail');
        const value1 = await AsyncStorage.getItem('adminType');
        const logedIn = await AsyncStorage.getItem('logedIn');
        const value2 = await AsyncStorage.getItem('customerType');
        if (value && (value1 || value2)) {
            const user = JSON.parse(value);
            const admin = Number(JSON.parse(value1));
            const customer = Number(JSON.parse(value2));
            // console.log('UserType' + 'admin: ', admin + "customer", customer, logedIn)
            if (logedIn === 'true') {
                const userType = Number(user.userType);
                const token = user.token;
                this.props.navigation.navigate(AppRoute.CUSTOMER)
                // if (token !== '' && token.length !== null) {
                //     if (token.length > 30) {
                //         if (userType == customer) {
                //             this.props.navigation.navigate(AppRoute.CUSTOMER)
                //         } else if (userType == admin) {
                //             this.props.navigation.navigate(AppRoute.HOME)
                //         } else {
                //             this.props.navigation.navigate(AppRoute.CUSTOMER)
                //         }
                //     } else {
                //         this.props.navigation.navigate(AppRoute.CUSTOMER)
                //     }
                // } else {
                //     this.props.navigation.navigate(AppRoute.CUSTOMER)
                // }
            } else {
                this.props.navigation.navigate(AppRoute.CUSTOMER)
            }
        } else {
            this.props.navigation.navigate(AppRoute.CUSTOMER)
        }
        SplashScreen.hide();
    }


    render() {
        const { otp } = this.state;
        return (
            < View style={[Styles.center, { flex: 1 }]} >
            </ View>
        );
    }
};

