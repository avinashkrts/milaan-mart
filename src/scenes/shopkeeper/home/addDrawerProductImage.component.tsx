import React, { Component } from "react";
import { View, Text, RefreshControl, Alert, AsyncStorage, ActivityIndicator } from "react-native";
import { Avatar, Divider, ThemedComponentProps } from "react-native-ui-kitten";
import { AddDrawerProductImageScreenProps } from "../../../navigation/addProductNavigator.navigator";
import { SafeAreaLayout, SaveAreaInset } from "../../../components/safe-area-layout.component";
import { Toolbar } from "../../../components/toolbar.component";
import { BackIcon, MenuIcon } from "../../../assets/icons";
import { Styles } from "../../../assets/styles";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { AppConstants, Color, LableText } from "../../../constants";
import { CheckBox, Content, Picker } from "native-base";
import Axios from "axios";
import DatePicker from 'react-native-datepicker'
import { AppRoute } from "../../../navigation/app-routes";
// import ImagePicker from 'react-native-image-picker';
import { scale } from "react-native-size-matters";

const options = {
    title: 'Select a Photo',
    takePhoto: 'Take Photo',
    chooseFromLibraryButtonTitle: 'Choose from gallery',
    quality: 0.7,
    maxWidth: 500,
    maxHeight: 550,
    type: 'image'
}

export class AddDrawerProductImageScreen extends Component<AddDrawerProductImageScreenProps, ThemedComponentProps & any> {
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
            isUploaded: false
        }
        this.onRefresh = this.onRefresh.bind(this);
    }

    async componentDidMount() {
        const value = await AsyncStorage.getItem('userDetail');
        const user = JSON.parse(value);
        const productId = this.props.route.params.productId
        console.log('Product Id', productId)

        this.setState({
            shopId: user.shopId,
            productId: productId
        })
    }

    // selectPhoto() {
    //     ImagePicker.showImagePicker(options, (response) => {
    //         if (response.didCancel) {
    //             console.log('User cancelled Image picker');
    //         } else if (response.error) {
    //             console.log('Image Picker Error: ', response.error);
    //         } else {
    //             const source = { uri: response.uri };
    //             const file = { name: 'shop' + response.fileName, uri: response.uri, type: response.type, size: response.readableSize, path: response.path }

    //             this.setState({
    //                 imageSource: source,
    //                 file: file,
    //             });
    //         }
    //     });
    // }

    uploadImage() {
        const { shopId, productId, imageUploaded, file } = this.state;
        const formData = new FormData();
        formData.append('file', file);
        console.log(productId);
        this.toggleUpload()
        fetch(AppConstants.API_BASE_URL + '/api/image/upload/avatar/' + shopId + '/' + productId, {
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

    toggleUpload(){
        const {isUploaded} = this.state;
        this.setState({
            isUploaded: !isUploaded
        })
    }

    render() {
        const { isUploaded, imageUploaded, emailId, imageSource } = this.state
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
                        {/* <Text style={[{ fontSize: scale(18), textAlign: 'center', marginVertical: scale(10) }]}>Your Product Image - {emailId}</Text> */}
                    </View>

                    <View style={[Styles.product_view, {borderColor: 'gray', borderWidth: scale(1)}]}>
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
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <ActivityIndicator size='large' />
                           <Text style={{color: Color.COLOR, fontSize: scale(20)}}>Uploading...</Text>
                        </View> :
                        <>
                            <View style={{ marginHorizontal: '10%' }}>
                                <TouchableOpacity style={[Styles.buttonBox, Styles.center]} onPress={() => { this.selectPhoto() }}>
                                    <Text style={Styles.buttonName}>{LableText.CHOOSE_IMAGE}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ marginHorizontal: '10%' }}>
                                <TouchableOpacity style={[Styles.buttonBox, Styles.center]} onPress={() => { this.uploadImage() }}>
                                    <Text style={Styles.buttonName}>{LableText.UPLOAD}</Text>
                                </TouchableOpacity>
                            </View>
                            {null != imageUploaded ? imageUploaded ?
                                <View style={{ marginHorizontal: '10%' }}>
                                    <TouchableOpacity style={[Styles.buttonBox, Styles.center]} onPress={() => { this.props.navigation.navigate(AppRoute.HOME) }}>
                                        <Text style={Styles.buttonName}>{LableText.FINISH}</Text>
                                    </TouchableOpacity>
                                </View> : null : null}

                        </>
                    }
                    <View style={Styles.bottomSpace}></View>
                </Content>

            </SafeAreaLayout>
        );
    }

}