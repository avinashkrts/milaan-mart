import React, { Component } from "react";
import { View, Text, RefreshControl, Alert, AsyncStorage, ActivityIndicator, PermissionsAndroid } from "react-native";
import { Avatar, Divider, ThemedComponentProps } from "react-native-ui-kitten";
import { SafeAreaLayout, SaveAreaInset } from "../../components/safe-area-layout.component";
import { Toolbar } from "../../components/toolbar.component";
import { BackIcon, CancelIcon, MenuIcon } from "../../assets/icons";
import { Styles } from "../../assets/styles";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { AppConstants, Color, LableText } from "../../constants";
import { CheckBox, Content, Picker } from "native-base";
import { AppRoute } from "../../navigation/app-routes";
// import ImagePicker from 'react-native-image-picker';
import { ShopImageScreenProps } from "../../navigation/registration.navigator";
import { scale } from "react-native-size-matters";
import { SignRegImageScreenProps } from "../../navigation/auth.navigator";
import { StackActions } from "@react-navigation/routers";
import { StyleSheet, BackHandler } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import Modal from "react-native-modal";

const options = {
    quality: 0.7,
    maxWidth: 500,
    maxHeight: 550,
    mediaType: 'photo'
}

export class ShopImageScreen extends Component<ShopImageScreenProps & SignRegImageScreenProps, ThemedComponentProps & any> {
    backHandler: any;
    constructor(props) {
        super(props);
        this.state = {
            shopId: AppConstants.SHOP_ID,
            productId: '',
            imageSource: '',
            file: null,
            name: '',
            title: '',
            imageUploaded: false,
            mobileNo: '',
            emailId: '',
            isUploaded: false,
            openModal: false
        }
        this.onRefresh = this.onRefresh.bind(this);
    }

    backAction = () => {

        Alert.alert("Alert!", LableText.ALERT_REGISTER_IMAGE, [
            {
                text: "Cancel",
                onPress: () => null,
                style: "cancel"
            },
            {
                text: "YES", onPress: () => {
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
        const value = await AsyncStorage.getItem('userDetail');
        const shopId = this.props.route.params.shopId;
        const adminId = this.props.route.params.adminId;
        const mobileNo = this.props.route.params.mobileNo;
        const emailId = this.props.route.params.emailId;
        // console.log('Product Id', productId)

        this.setState({
            shopId: shopId,
            productId: adminId,
            mobileNo: mobileNo,
            emailId: emailId
        })
    }

    async handleTakePhoto() {
        this.handleModal()
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "Sone Biryani Camera/Gallery Permission",
                    message:
                        "Sone Biryani needs access to your Camera " +
                        "so you can upload image from Camera.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                launchCamera(options, (response) => {
                    if (response.didCancel) {
                        console.log('User cancelled Image picker');
                    } else if (response.errorCode) {
                        console.log('Image Picker Error: ', response.errorCode);
                    } else {
                        console.log('URI', response.assets[0])
                        const source = { uri: response.assets[0].uri };
                        const file = { name: 'shop' + response.assets[0].fileName, uri: response.assets[0].uri, type: response.assets[0].type, size: response.assets[0].fileSize }

                        this.setState({
                            imageSource: source,
                            file: file,
                        });
                    }
                });
            } else {
                console.log("Camera permission denied");
                Alert.alert("Please give Camera permission to use Camera.")
            }
        } catch (err) {
            console.warn(err);
        }
    }


    handleChooseImage() {
        this.handleModal()
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled Image picker');
            } else if (response.errorCode) {
                console.log('Image Picker Error: ', response.error);
            } else {
                console.log('URI', response)
                const source = { uri: response.assets[0].uri };
                const file = { name: 'shop' + response.assets[0].fileName, uri: response.assets[0].uri, type: response.assets[0].type, size: response.assets[0].fileSize }

                this.setState({
                    imageSource: source,
                    file: file,
                });
            }
        });
    }

    handleModal() {
        const { openModal } = this.state;
        this.setState({ openModal: !openModal })
    }

    uploadImage() {
        const { shopId, imageSource, productId, imageUploaded, file } = this.state;
        if (imageSource === '' || imageSource.length <= 0) {
            Alert.alert("Please select a Photo")
        } else {
            const formData = new FormData();
            formData.append('file', file);
            console.log(productId);
            this.toggleUpload()
            fetch(AppConstants.API_BASE_URL + '/api/shopimage/upload/avatar/' + shopId + '/' + productId, {
                method: 'post',
                body: formData
            }).then(res => {
                if (res.ok) {
                    this.setState({
                        imageSource: '',
                        file: null,
                        imageUploaded: true,
                        isUploaded: false
                    });
                    Alert.alert("File uploaded successfully.");
                }
            });
        }
    }

    handleAddMeasurement(value) {
        if (value === 'add') {
            // this.props.navigation.navigate(AppRoute.ADD_CATEGORY)
        } else {
            this.setState({
                measurement: value
            })
        }
    }

    onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });
    }

    toggleUpload() {
        const { isUploaded } = this.state;
        this.setState({
            isUploaded: !isUploaded
        })
    }
    handleFinish() {
        const pushAction = StackActions.push(AppRoute.AUTH)
        this.props.navigation.dispatch(pushAction);
    }

    render() {
        const { isUploaded, openModal, imageUploaded, emailId, imageSource } = this.state
        return (
            <SafeAreaLayout
                style={Styles.safeArea}
                insets={SaveAreaInset.TOP}>
                <Toolbar
                    title='Add Image'
                    backIcon={BackIcon}
                    onBackPress={this.props.navigation.goBack}
                    style={{ marginTop: -5, marginLeft: -5 }}
                />
                <Divider />

                <Content style={Styles.content}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                    }
                >
                    <View style={Styles.center}>
                        <Text style={[{ fontSize: scale(18), textAlign: 'justify', paddingHorizontal: scale(10), marginVertical: scale(10) }]}>{LableText.SIGN_UP_ALERT}</Text>
                    </View>

                    <View style={Styles.center}>
                        <Text style={[{ fontSize: scale(18), textAlign: 'center', marginVertical: scale(10) }]}>Your Admin ID - {emailId}</Text>
                    </View>

                    <View style={[Styles.product_view, { borderColor: 'gray', borderWidth: scale(1) }]}>
                        {/* <TouchableOpacity style={[{ justifyContent: 'flex-end', marginTop: 5, marginRight: 5, alignItems: 'flex-end' }]} onPress={() => { this.selectPhoto() }}>
                            <Text><EditIcon /></Text>
                        </TouchableOpacity> */}
                        <View style={[Styles.product_image, Styles.center]}>
                            {/* <View style={Styles.ImgBgOne} />
                            <View style={Styles.ImgBgTwo} /> */}
                            <Avatar source={imageSource} style={Styles.product_avatar} />
                        </View>
                    </View>

                    <Divider />

                    <View>


                    </View>
                    {isUploaded ?
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size='large' />
                            <Text style={{ color: Color.COLOR, fontSize: scale(20) }}>Uploading...</Text>
                        </View> :
                        <>
                            <View style={{ marginHorizontal: '10%' }}>
                                <TouchableOpacity style={[Styles.buttonBox, Styles.center]} onPress={() => { this.handleModal() }}>
                                    <Text style={Styles.buttonName}>Select Shop Image</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ marginHorizontal: '10%' }}>
                                <TouchableOpacity style={[Styles.buttonBox, Styles.center]} onPress={() => { this.uploadImage() }}>
                                    <Text style={Styles.buttonName}>{LableText.UPLOAD}</Text>
                                </TouchableOpacity>
                            </View>
                            {null != imageUploaded ? imageUploaded ?
                                <View style={{ marginHorizontal: '10%' }}>
                                    <TouchableOpacity style={[Styles.buttonBox, Styles.center]} onPress={() => { this.handleFinish() }}>
                                        <Text style={Styles.buttonName}>{LableText.FINISH}</Text>
                                    </TouchableOpacity>
                                </View> : null : null}

                        </>
                    }

                    <Modal style={Styles.image_modal} isVisible={openModal}>
                        <View style={Styles.modalHeader}>
                            <TouchableOpacity>
                                <Text onPress={() => { this.handleModal() }}><CancelIcon fontSize={25} /></Text>
                            </TouchableOpacity>
                        </View>

                        <View style={Styles.center}>
                            <Text style={Styles.image_upload_box}>Select a Photo</Text>
                        </View>
                        <Divider />
                        <Divider />
                        <Divider />
                        <View>
                            <Text onPress={() => { this.handleTakePhoto() }} style={Styles.image_upload_box_text}>Take Photo</Text>
                        </View>
                        <View>
                            <Text onPress={() => { this.handleChooseImage() }} style={Styles.image_upload_box_text}>Choose from Gallery</Text>
                        </View>
                    </Modal>
                    <View style={Styles.bottomSpace}></View>
                </Content>

            </SafeAreaLayout>
        );
    }

}