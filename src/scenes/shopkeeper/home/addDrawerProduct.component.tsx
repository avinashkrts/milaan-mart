import React, { Component } from "react";
import { View, Text, RefreshControl, Alert, AsyncStorage, ActivityIndicator, PermissionsAndroid } from "react-native";
import { Avatar, Divider, ThemedComponentProps } from "react-native-ui-kitten";
import { AddDrawerProductScreenProps } from "../../../navigation/home.navigator";
import { SafeAreaLayout, SaveAreaInset } from "../../../components/safe-area-layout.component";
import { Toolbar } from "../../../components/toolbar.component";
import { BackIcon, CancelIcon, MenuIcon } from "../../../assets/icons";
import { Styles } from "../../../assets/styles";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { AppConstants, Color, LableText, Placeholder } from "../../../constants";
import { CheckBox, Content, Picker } from "native-base";
import Axios from "axios";
import DatePicker from 'react-native-datepicker';
import { AppRoute } from "../../../navigation/app-routes";
import Modal from "react-native-modal";
import moment from "moment";
// import ImagePicker from 'react-native-image-picker';
import { scale } from "react-native-size-matters";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const options = {
    quality: 0.7,
    maxWidth: 500,
    maxHeight: 550,
    mediaType: 'photo'
}

export class AddDrawerProductScreen extends Component<AddDrawerProductScreenProps, ThemedComponentProps & any> {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            category: '',
            brand: '',
            shopId: '',
            avatar: '123asd',
            price: '',
            quantity: '',
            description: '',
            barcode: '',
            stock: '',
            sellingPrice: '',
            costPrice: '',
            oldPrice: '',
            offerPercent: '',
            offerActiveInd: false,
            gstAmount: '',
            measurement: '',
            deliveryCharge: '',
            gstPercent: '',
            manufactureDate: String(moment(new Date).format('YYYY-MM-DD')),
            expireDate: String(moment(new Date).add('days', 1).format('YYYY-MM-DD')),
            offerFrom: String(moment(new Date).format('YYYY-MM-DD')),
            offerTo: String(moment(new Date).add('days', 1).format('YYYY-MM-DD')),
            minDate: String(moment(new Date).format('YYYY-MM-DD')),
            manufactureMinDate: String(moment(new Date).subtract('years', 5).format('YYYY-MM-DD')),
            allCategory: [],
            allBrand: [],
            allMeasurement: [],
            categoryVisible: false,
            BrandVisible: false,
            catImage: false,
            catName: '',
            brandVisible: false,
            unitCostPrice: '',
            brandName: '',
            brandCatId: '',
            outOfStock: '',
            isImage: false,
            productId: '',
            imageSource: '',
            selectedProduct: '',
            file: null,
            allProduct: [],
            allData: [{
                url: '/api/lookup/getallmeasurementtype',
                method: 'GET',
                variable: 'allMeasurement',
            }
            ],
            openModal: false
        }
        this.onRefresh = this.onRefresh.bind(this);
    }

    async componentDidMount() {
        const { allData } = this.state;
        this.props.navigation.addListener('blur', () => {
            this.setState({
                isImage: false
            })
        })
        const value = await AsyncStorage.getItem('userDetail');
        if (value) {
            const user = JSON.parse(value);
            // Alert.alert(user.shopId)

            this.setState({
                shopId: user.shopId,
            })

            Axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/category/getcategoryforuserbyshopid/' + user.shopId,
            }).then((response) => {
                console.log('all user data', response.data)
                if (null != response.data) {
                    this.setState({
                        allCategory: response.data,
                        selectedCategory: response.data[0].id
                    })
                }
            }, (error) => {
                Alert.alert("Server error!.")
            });

            Axios({
                method: 'GET',
                // url: AppConstants.API_BASE_URL + '/api/item/getall',
                url: 'http://api.milaansearch.com:8092/api/item/getproduct/MILAAN63',
            }).then((response) => {
                console.log('all user data', response.data)
                if (null != response.data) {
                    this.setState({
                        allProduct: response.data,
                    })
                }
            }, (error) => {
                Alert.alert("Server error!.")
            });
        }


        allData.map((data, index) => {
            // console.log(allData)
            Axios({
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
                Alert.alert("Please enter a valid email ID and password.")
            });
        })
    }

    handleSubmit() {
        const { isEditable, outOfStock, name, manufactureDate, expireDate, category, brand, shopId, avatar, price, quantity, description, barcode,
            stock, sellingPrice, costPrice, oldPrice, offerPercent, offerFrom, offerTo, offerActiveInd,
            gstAmount, measurement, deliveryCharge, gstPercent, expireActiveInd } = this.state

        console.log('Product Data', name, category, brand, shopId, avatar, price, quantity, description, barcode,
            stock, sellingPrice, costPrice, oldPrice, offerPercent, offerFrom, offerTo, offerActiveInd,
            gstAmount, measurement, deliveryCharge, gstPercent);

        if (name == null || name === '') {
            Alert.alert("Please enter product name.");
        } else if (category == null || category === '') {
            Alert.alert("Please select category.");
        } else if (brand == null || brand === '') {
            Alert.alert("Please select brand.");
        } else if (costPrice == null || costPrice === '') {
            Alert.alert("Please enter cost price.");
        } else if (quantity == null || quantity === '') {
            Alert.alert("Please enter selling product quantity.");
        } else if (measurement == null || measurement === '') {
            Alert.alert("Please select measurement.");
        } else if (sellingPrice == null || sellingPrice === '') {
            Alert.alert("Please enter selling price.");
        } else if (gstPercent == null || gstPercent === '') {
            Alert.alert("Please enter GST percent.");
        } else if (stock == null || stock === '') {
            Alert.alert("Please enter stock.");
        } else if (outOfStock == null || outOfStock === '') {
            Alert.alert("Please enter out of stock limit.");
        } else if (barcode == null || barcode === '') {
            Alert.alert("Please enter barcode.");
        } else if (description == null || description === '') {
            Alert.alert("Please enter description.");
        } else if (offerActiveInd && (offerPercent == null || offerPercent === '')) {
            Alert.alert("Please enter offer percent.");
        } else {
            Axios({
                method: 'POST',
                url: AppConstants.API_BASE_URL + '/api/product/create',
                data: {
                    name: name,
                    category: category,
                    brand: brand,
                    shopId: shopId,
                    quantity: quantity,
                    description: description,
                    barcode: barcode,
                    sellingPrice: sellingPrice,
                    costPrice: costPrice,
                    stock: stock,
                    offerPercent: offerPercent,
                    offerFrom: offerActiveInd ? offerFrom : '',
                    offerTo: offerActiveInd ? offerTo : '',
                    offerActiveInd: offerActiveInd,
                    measurement: measurement,
                    gstPercent: gstPercent,
                    dateOfManufacturing: expireActiveInd ? manufactureDate : '',
                    dateOfExpire: expireActiveInd ? expireDate : '',
                    outOfStock: outOfStock
                }
            }).then((response) => {
                if (null != response.data) {
                    if (response.data.status === 'true') {
                        this.setState({
                            name: '',
                            category: '',
                            brand: '',
                            price: '',
                            quantity: '',
                            description: '',
                            barcode: '',
                            stock: '',
                            sellingPrice: '',
                            costPrice: '',
                            oldPrice: '',
                            offerPercent: '',
                            offerActiveInd: false,
                            expireActiveInd: false,
                            gstAmount: '',
                            measurement: '',
                            deliveryCharge: '',
                            gstPercent: '',
                            manufactureDate: String(moment(new Date).format('YYYY-MM-DD')),
                            expireDate: String(moment(new Date).add('days', 1).format('YYYY-MM-DD')),
                            offerFrom: String(moment(new Date).format('YYYY-MM-DD')),
                            offerTo: String(moment(new Date).add('days', 1).format('YYYY-MM-DD')),
                            minDate: String(moment(new Date).format('YYYY-MM-DD')),
                            manufactureMinDate: String(moment(new Date).subtract('years', 5).format('YYYY-MM-DD')),
                            categoryVisible: false,
                            BrandVisible: false,
                            catImage: false,
                            catName: '',
                            brandVisible: false,
                            brandName: '',
                            brandCatId: '',
                            outOfStock: '',
                            productId: response.data.productId,
                            isImage: true
                        })
                        Alert.alert("Product created.")
                        // console.log("product Created Id", response.data.productId)
                        // this.props.navigation.navigate(AppRoute.ADD_DRAWER_PRODUCT_IMAGE, { productId: response.data.productId })
                    } else if (response.data.status === 'false') {
                        Alert.alert("Product allready exists.")
                    }
                }
            }, (error) => {
                Alert.alert("Server error!.")
            });
        }
    }

    handleAddCategory(value) {
        const { categoryVisible } = this.state
        if (value === 'add') {
            this.setState({
                categoryVisible: !categoryVisible
            })
            // this.props.navigation.navigate(AppRoute.ADD_CATEGORY)
        } else {
            Axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/brand/getallDeactivebrandbyshopid/' + value,
            }).then((response) => {
                if (null != response.data) {
                    this.setState({
                        category: value,
                        allBrand: response.data
                    })
                }
            }, (error) => {
                Alert.alert("Server error!.")
            });
        }
    }

    handleAddProduct(value) {
        const { productVisible } = this.state
        if (value === 'add') {
            this.setState({
                productVisible: !productVisible
            })
        } else {
            this.setState({
                selectedProduct: value
            })

            // Axios({
            //     method: 'GET',
            //     url: AppConstants.API_BASE_URL + '/api/brand/getallDeactivebrandbyshopid/' + value,
            // }).then((response) => {
            //     if (null != response.data) {
            //         this.setState({
            //             category: value,
            //             allBrand: response.data
            //         })
            //     }
            // }, (error) => {
            //     Alert.alert("Server error!.")
            // });
        }
    }

    handleAddBrand(value) {
        const { brandVisible } = this.state;
        if (value === 'add') {
            this.setState({
                brandVisible: !brandVisible
            })
        } else {
            this.setState({
                brand: value
            })
        }
    }

    async handleTakePhoto() {
        this.handleModal()
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "Milaan Camera/Gallery Permission",
                    message:
                        "Milaan needs access to your Camera " +
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


    async uploadImage() {
        const { productId, imageSource, file } = this.state;
        const value = await AsyncStorage.getItem('userDetail');
        if (value) {
            const user = JSON.parse(value);
            var shopId = user.shopId
            if (imageSource === '' || imageSource.length <= 0) {
                Alert.alert("Please select a Photo")
            } else {
                const formData = new FormData();
                formData.append('file', file);
                console.log(productId, shopId);
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
        }
    }

    toggleUpload() {
        const { isUploaded } = this.state;
        this.setState({
            isUploaded: !isUploaded
        })
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

    categoryModal() {
        const { categoryVisible } = this.state;
        this.setState({ categoryVisible: !categoryVisible });
    }

    brandModal() {
        const { brandVisible } = this.state;
        this.setState({ brandVisible: !brandVisible });
    }

    handleAddImageCategory() {
        const { catImage, catName, categoryVisible, shopId } = this.state;
        // Alert.alert(shopId)
        if (catName == null || catName === '') {
            Alert.alert("Please enter category name.");
        } else if (shopId == null || shopId === '') {
            this.props.navigation.navigate(AppRoute.AUTH)
        } else {
            console.log(catName.toUpperCase(), catName.replace(" ", "_"),)
            const categoryName = catName.toUpperCase();
            const catTitle = categoryName.replace(" ", "_");
            Axios({
                method: 'POST',
                url: AppConstants.API_BASE_URL + '/api/category/create',
                data: {
                    name: categoryName,
                    shopId: shopId,
                    title: catTitle
                }
            }).then((response) => {
                if (null != response.data) {
                    if (response.data.status === 'true') {
                        this.setState({
                            ...this.state,
                            categoryVisible: !categoryVisible
                        })
                        this.onRefresh();
                    } else if (response.data.status === 'false') {
                        Alert.alert("Category allready exists.")
                    }
                }
            }, (error) => {
                Alert.alert("Server error!.")
            });
        }
    }

    handleAddImageBrand() {
        const { brandVisible, shopId, category, brandName } = this.state
        if (category == null || category === '') {
            Alert.alert("Please select category.");
        } else if (brandName == null || brandName === '') {
            Alert.alert("Please enter brand name.");
        } else {
            console.log(brandName.toUpperCase(), brandName.replace(" ", "_"),)
            const catName = brandName.toUpperCase();
            const catTitle = catName.replace(" ", "_");
            Axios({
                method: 'POST',
                url: AppConstants.API_BASE_URL + '/api/brand/create',
                data: {
                    name: catName,
                    category: category,
                    shopId: shopId,
                    title: catTitle
                }
            }).then((response) => {
                if (null != response.data) {
                    if (response.data.status === 'true') {
                        this.setState({
                            ...this.state,
                            brandVisible: !brandVisible
                        })
                        this.handleAddCategory(category)
                    } else if (response.data.status === 'false') {
                        Alert.alert("Category allready exists.")
                    }
                }
            }, (error) => {
                Alert.alert("Server error!.")
            });
        }
    }

    handleImageFinish() {
        this.setState({ isImage: false })
        this.props.navigation.navigate(AppRoute.HOME)
    }

    render() {
        const { isEditable, allProduct,selectedProduct, openModal, outOfStock, isImage, unitCostPrice, manufactureMinDate, brandVisible, manufactureDate, expireDate, brandName, brandCatId, catImage, catName, categoryVisible, allCategory, allBrand, name, category, brand, shopId, avatar, price, quantity, description, barcode,
            stock, sellingPrice, costPrice, oldPrice, offerPercent, offerFrom, offerTo, offerActiveInd,
            gstAmount, measurement, gstPercent, minDate, allMeasurement, expireActiveInd, isUploaded, imageUploaded, imageSource } = this.state
        return (
            <SafeAreaLayout
                style={Styles.safeArea}
                insets={SaveAreaInset.TOP}>
                <Toolbar
                    title='Add Product'
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

                    {isImage ?
                        <View>
                            <View style={[Styles.product_view, { borderColor: 'gray', borderWidth: scale(1) }]}>
                                <View style={[Styles.product_image, Styles.center]}>
                                    <Avatar source={imageSource} style={Styles.product_avatar} />
                                </View>
                            </View>

                            <Divider />

                            {isUploaded ?
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <ActivityIndicator size='large' />
                                    <Text style={{ color: Color.COLOR, fontSize: scale(20) }}>Uploading...</Text>
                                </View> :
                                <>
                                    <View style={{ marginHorizontal: '10%' }}>
                                        <TouchableOpacity style={[Styles.buttonBox, Styles.center]} onPress={() => { this.handleModal() }}>
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
                                            <TouchableOpacity style={[Styles.buttonBox, Styles.center]} onPress={() => { this.handleImageFinish() }}>
                                                <Text style={Styles.buttonName}>{LableText.FINISH}</Text>
                                            </TouchableOpacity>
                                        </View> : null : null}

                                </>
                            }
                        </View> :
                        <View>
                            <Divider />
                            <View>
                                <View style={Styles.user_detail}>
                                    <View style={Styles.user_detail_header}>
                                        <Text style={Styles.user_detail_header_text}>{LableText.CATEGORY}</Text>
                                    </View>
                                    <View style={Styles.user_detail_data}>
                                        <Picker
                                            note
                                            mode="dropdown"
                                            style={[Styles.center, { marginVertical: -8, color: Color.COLOR, width: '100%' }]}
                                            selectedValue={category}
                                            onValueChange={(value) => { this.handleAddCategory(value) }}
                                        >
                                            <Picker.Item label="Select category" value="" />
                                            {null != allCategory ? allCategory.map((data, index) => {
                                                return (
                                                    <Picker.Item label={data.name} value={data.id} />
                                                )
                                            }) : null}
                                            <Picker.Item label="Add category" value="add" />
                                        </Picker>
                                    </View>
                                </View>

                                <View style={Styles.user_detail}>
                                    <View style={Styles.user_detail_header}>
                                        <Text style={Styles.user_detail_header_text}>{LableText.BRAND}</Text>
                                    </View>
                                    <View style={Styles.user_detail_data}>
                                        <Picker
                                            note
                                            mode="dropdown"
                                            style={[Styles.center, { marginVertical: -8, color: Color.COLOR, width: '100%' }]}
                                            selectedValue={brand}
                                            onValueChange={(value) => { this.handleAddBrand(value) }}
                                        >
                                            <Picker.Item label="Select Brand" value="" />
                                            {null != allBrand ? allBrand.map((data, index) => {
                                                return (
                                                    <Picker.Item label={data.name} value={data.id} />
                                                )
                                            }) : null}
                                            <Picker.Item label="Add Brand" value="add" />
                                        </Picker>
                                    </View>
                                </View>

                                <View style={Styles.user_detail}>
                                    <View style={Styles.user_detail_header}>
                                        <Text style={Styles.user_detail_header_text}>{LableText.PRODUCT_NAME}</Text>
                                    </View>
                                    <View style={Styles.user_detail_data}>
                                        <Picker
                                            note
                                            mode="dropdown"
                                            style={[Styles.center, { marginVertical: -8, color: Color.COLOR, width: '100%' }]}
                                            selectedValue={selectedProduct}
                                            onValueChange={(value) => { this.handleAddProduct(value) }}
                                        >
                                            <Picker.Item label="Select Product" value="" />
                                            <Picker.Item label="Add Product" value="add" color={Color.COLOR} />
                                            {null != allProduct ? allProduct.map((data, index) => {
                                                return (
                                                    <Picker.Item label={data.name} value={data.id} />
                                                )
                                            }) : null}
                                        </Picker>
                                    </View>
                                </View>

                                <View style={Styles.user_detail}>
                                    <View style={Styles.user_detail_header}>
                                        <Text style={Styles.user_detail_header_text}>{LableText.COST_PRICE}</Text>
                                    </View>
                                    <View style={Styles.user_detail_data}>
                                        <TextInput
                                            editable={isEditable}
                                            keyboardType='numeric'
                                            value={costPrice}
                                            onChangeText={(value) => { this.setState({ costPrice: value }) }}
                                            style={Styles.cash_pay_input}
                                            placeholder={LableText.COST_PRICE}
                                        />
                                    </View>
                                </View>

                                <View style={Styles.user_detail}>
                                    <View style={Styles.user_detail_header}>
                                        <Text style={Styles.user_detail_header_text}>{LableText.UNIT_COST_PRICE}</Text>
                                    </View>
                                    <View style={Styles.user_detail_data}>
                                        <TextInput
                                            editable={isEditable}
                                            keyboardType='numeric'
                                            value={unitCostPrice}
                                            onChangeText={(value) => { this.setState({ unitCostPrice: value }) }}
                                            style={Styles.cash_pay_input}
                                            placeholder={LableText.UNIT_COST_PRICE}
                                        />
                                    </View>
                                </View>

                                <View style={Styles.user_detail}>
                                    <View style={Styles.user_detail_header}>
                                        <Text style={Styles.user_detail_header_text}>{LableText.QUANTITY}</Text>
                                    </View>
                                    <View style={Styles.user_detail_data}>
                                        <TextInput
                                            editable={isEditable}
                                            value={quantity}
                                            keyboardType='numeric'
                                            onChangeText={(value) => { this.setState({ quantity: value }) }}
                                            style={Styles.cash_pay_input}
                                            placeholder={LableText.QUANTITY}
                                        />
                                    </View>
                                </View>

                                <View style={Styles.user_detail}>
                                    <View style={Styles.user_detail_header}>
                                        <Text style={Styles.user_detail_header_text}>{LableText.SELLING_PRICE}</Text>
                                    </View>
                                    <View style={Styles.user_detail_data}>
                                        <TextInput
                                            editable={isEditable}
                                            value={sellingPrice}
                                            keyboardType='numeric'
                                            onChangeText={(value) => { this.setState({ sellingPrice: value }) }}
                                            style={Styles.cash_pay_input}
                                            placeholder={LableText.SELLING_PRICE}
                                        />
                                    </View>
                                </View>

                                {/* <View style={Styles.user_detail}>
                                    <View style={Styles.user_detail_header}>
                                        <Text style={Styles.user_detail_header_text}>{LableText.MEASUREMENT}</Text>
                                    </View>
                                    <View style={Styles.user_detail_data}>
                                        <Picker
                                            note
                                            mode="dropdown"
                                            style={[Styles.center, { marginVertical: -8, color: Color.COLOR, width: '100%' }]}
                                            selectedValue={measurement}
                                            onValueChange={(value) => { this.handleAddMeasurement(value) }}
                                        >
                                            <Picker.Item label="Select measurement" value="" />
                                            {null != allMeasurement ? allMeasurement.map((data, index) => {
                                                return (
                                                    <Picker.Item label={data.lookUpName} value={data.lookUpId} />
                                                )
                                            }) : null}
                                            <Picker.Item label="Add measurement" value="add" />
                                        </Picker>
                                    </View>
                                </View> */}

                                <View style={Styles.user_detail}>
                                    <View style={Styles.user_detail_header}>
                                        <Text style={Styles.user_detail_header_text}>{LableText.BARCODE}</Text>
                                    </View>
                                    <View style={Styles.user_detail_data}>
                                        <TextInput
                                            editable={isEditable}
                                            value={barcode}
                                            onChangeText={(value) => { this.setState({ barcode: value }) }}
                                            style={Styles.cash_pay_input}
                                            placeholder={LableText.BARCODE}
                                        />
                                    </View>
                                </View>

                                <View style={Styles.user_detail}>
                                    <View style={Styles.user_detail_header}>
                                        <Text style={Styles.user_detail_header_text}>{LableText.GST_PERCENT}</Text>
                                    </View>
                                    <View style={Styles.user_detail_data}>
                                        <TextInput
                                            editable={isEditable}
                                            keyboardType='numeric'
                                            value={gstPercent}
                                            onChangeText={(value) => { this.setState({ gstPercent: value }) }}
                                            style={Styles.cash_pay_input}
                                            placeholder={LableText.GST_PERCENT}
                                        />
                                    </View>
                                </View>

                                <View style={Styles.user_detail}>
                                    <View style={Styles.user_detail_header}>
                                        <Text style={Styles.user_detail_header_text}>{LableText.STOCK}</Text>
                                    </View>
                                    <View style={Styles.user_detail_data}>
                                        <TextInput
                                            editable={isEditable}
                                            value={stock}
                                            keyboardType='numeric'
                                            onChangeText={(value) => { this.setState({ stock: value }) }}
                                            style={Styles.cash_pay_input}
                                            placeholder={LableText.STOCK}
                                        />
                                    </View>
                                </View>

                                <View style={Styles.user_detail}>
                                    <View style={Styles.user_detail_header}>
                                        <Text style={Styles.user_detail_header_text}>{LableText.OUT_OF_STOCK}</Text>
                                    </View>
                                    <View style={Styles.user_detail_data}>
                                        <TextInput
                                            editable={isEditable}
                                            value={outOfStock}
                                            keyboardType='numeric'
                                            onChangeText={(value) => { this.setState({ outOfStock: value }) }}
                                            style={Styles.cash_pay_input}
                                            placeholder={LableText.OUT_OF_STOCK}
                                        />
                                    </View>
                                </View>



                                <View style={Styles.user_detail}>
                                    <View style={Styles.user_detail_header}>
                                        <Text style={Styles.user_detail_header_text}>{LableText.DESCRIPTION}</Text>
                                    </View>
                                    <View style={Styles.user_detail_data}>
                                        <TextInput
                                            multiline={true}
                                            editable={isEditable}
                                            value={description}
                                            onChangeText={(value) => { this.setState({ description: value }) }}
                                            style={Styles.cash_pay_input}
                                            placeholder={LableText.DESCRIPTION}
                                        />
                                    </View>
                                </View>

                                <View style={Styles.user_detail}>
                                    <View style={[Styles.user_detail_header, { flexDirection: 'row' }]}>
                                        <Text style={Styles.user_detail_header_text}>{LableText.EXPIRE_MANUFAFACTURE}</Text>
                                        <CheckBox style={{ marginLeft: 10 }} checked={expireActiveInd} onPress={(value) => { this.setState({ expireActiveInd: !expireActiveInd }) }} />
                                    </View>
                                </View>

                                {expireActiveInd ?
                                    <>
                                        <View style={Styles.user_detail}>
                                            <View style={Styles.user_detail_header}>
                                                <Text style={Styles.user_detail_header_text}>{LableText.MANUFACTURE_DATE}</Text>
                                            </View>
                                            <View style={Styles.user_detail_data}>
                                                <DatePicker
                                                    style={{ width: '100%' }}
                                                    date={manufactureDate}
                                                    mode="date"
                                                    placeholder="select date"
                                                    format="YYYY-MM-DD"
                                                    minDate={manufactureMinDate}
                                                    // maxDate="2016-06-01"
                                                    confirmBtnText="Confirm"
                                                    cancelBtnText="Cancel"
                                                    customStyles={{
                                                        dateIcon: {
                                                            position: 'absolute',
                                                            left: 0,
                                                            top: 5,
                                                            marginLeft: 0
                                                        },
                                                        dateInput: {
                                                            borderColor: '#fff'
                                                        }
                                                    }}
                                                    onDateChange={(date) => { this.setState({ manufactureDate: date }) }}
                                                />
                                            </View>
                                        </View>

                                        <View style={Styles.user_detail}>
                                            <View style={Styles.user_detail_header}>
                                                <Text style={Styles.user_detail_header_text}>{LableText.EXPIRE_DATE}</Text>
                                            </View>
                                            <View style={Styles.user_detail_data}>
                                                <DatePicker
                                                    style={{ width: '100%' }}
                                                    date={expireDate}
                                                    mode="date"
                                                    placeholder="select date"
                                                    format="YYYY-MM-DD"
                                                    minDate={moment(minDate).add('days', 1).format('YYYY-MM-DD')}
                                                    // maxDate="2016-06-01"
                                                    confirmBtnText="Confirm"
                                                    cancelBtnText="Cancel"
                                                    customStyles={{
                                                        dateIcon: {
                                                            position: 'absolute',
                                                            left: 0,
                                                            top: 5,
                                                            marginLeft: 0
                                                        },
                                                        dateInput: {
                                                            borderColor: '#fff'
                                                        }
                                                    }}
                                                    onDateChange={(date) => { this.setState({ expireDate: date }) }}
                                                />
                                            </View>
                                        </View>
                                    </>
                                    : null}



                                <View style={Styles.user_detail}>
                                    <View style={[Styles.user_detail_header, { flexDirection: 'row' }]}>
                                        <Text style={Styles.user_detail_header_text}>{LableText.OFFER}</Text>
                                        <CheckBox style={{ marginLeft: 10 }} checked={offerActiveInd} onPress={(value) => { this.setState({ offerActiveInd: !offerActiveInd }) }} />
                                    </View>
                                </View>

                                {offerActiveInd ?
                                    <View style={Styles.user_detail_data}>
                                        <View style={Styles.user_detail}>
                                            <View style={Styles.user_detail_header}>
                                                <Text style={Styles.user_detail_header_text}>{LableText.OFFER_PERCENT}</Text>
                                            </View>
                                            <View style={Styles.user_detail_data}>
                                                <TextInput
                                                    multiline={true}
                                                    editable={isEditable}
                                                    value={offerPercent}
                                                    keyboardType='numeric'
                                                    onChangeText={(value) => { this.setState({ offerPercent: value }) }}
                                                    style={Styles.cash_pay_input}
                                                    placeholder={LableText.OFFER_PERCENT}
                                                />
                                            </View>
                                        </View>

                                        <View style={Styles.user_detail}>
                                            <View style={Styles.user_detail_header}>
                                                <Text style={Styles.user_detail_header_text}>{LableText.OFFER_FROM}</Text>
                                            </View>
                                            <View style={Styles.user_detail_data}>
                                                <DatePicker
                                                    style={{ width: '100%' }}
                                                    date={offerFrom}
                                                    mode="date"
                                                    placeholder="select date"
                                                    format="YYYY-MM-DD"
                                                    minDate={minDate}
                                                    // maxDate="2016-06-01"
                                                    confirmBtnText="Confirm"
                                                    cancelBtnText="Cancel"
                                                    customStyles={{
                                                        dateIcon: {
                                                            position: 'absolute',
                                                            left: 0,
                                                            top: 5,
                                                            marginLeft: 0
                                                        },
                                                        dateInput: {
                                                            borderColor: '#fff'
                                                        }
                                                    }}
                                                    onDateChange={(date) => { this.setState({ offerFrom: date, offerTo: moment(date).add('days', 1).format('YYYY-MM-DD') }) }}
                                                />
                                            </View>
                                        </View>

                                        <View style={Styles.user_detail}>
                                            <View style={Styles.user_detail_header}>
                                                <Text style={Styles.user_detail_header_text}>{LableText.OFFER_TO}</Text>
                                            </View>
                                            <View style={Styles.user_detail_data}>
                                                <DatePicker
                                                    style={{ width: '100%' }}
                                                    date={offerTo}
                                                    mode="date"
                                                    placeholder="select date"
                                                    format="YYYY-MM-DD"
                                                    minDate={moment(offerFrom).add('days', 1).format('YYYY-MM-DD')}
                                                    // maxDate="2016-06-01"
                                                    confirmBtnText="Confirm"
                                                    cancelBtnText="Cancel"
                                                    customStyles={{
                                                        dateIcon: {
                                                            position: 'absolute',
                                                            left: 0,
                                                            top: 5,
                                                            marginLeft: 0
                                                        },
                                                        dateInput: {
                                                            borderColor: '#fff'
                                                        }
                                                    }}
                                                    onDateChange={(date) => { this.setState({ offerTo: date }) }}
                                                />
                                            </View>
                                        </View>


                                    </View>
                                    : null}
                            </View>

                            <View style={{ marginHorizontal: '10%' }}>
                                <TouchableOpacity style={[Styles.buttonBox, Styles.center]} onPress={() => { this.handleSubmit() }}>
                                    <Text style={Styles.buttonName}>{LableText.NEXT}</Text>
                                </TouchableOpacity>
                            </View>

                            <Modal style={Styles.modal} isVisible={categoryVisible}>
                                <View style={Styles.modalHeader}>
                                    <TouchableOpacity>
                                        <Text onPress={() => { this.categoryModal() }}><CancelIcon fontSize={25} /></Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={Styles.center}>
                                    <View style={[Styles.center, { width: '100%' }]}>
                                        {/* {catImage && categoryVisible ?
                                    <View style={[Styles.profile, Styles.center]}>
                                        <View style={Styles.categoryImage}>
                                            <View>
                                                <TouchableOpacity onPress={() => { this.selectPhoto() }}>
                                                    <View style={Styles.ImgBgOne} />
                                                    <View style={Styles.ImgBgTwo} />
                                                     <Avatar source={imageSource} style={Styles.profile_avatar} /> 
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={[Styles.center, { marginHorizontal: '10%', width: '100%' }]}>
                                                <TouchableOpacity style={[Styles.buttonBox, Styles.center, { width: '50%' }]} >
                                                    <Text style={[Styles.buttonName, { paddingHorizontal: 30 }]} onPress={() => { this.handleAddImageCategory() }}>{LableText.UPLOAD}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View> : */}
                                        <View style={[Styles.center, { width: '100%' }]}>
                                            <View style={[{ width: '100%' }]}>
                                                <Text style={[{ paddingHorizontal: 30 }]}>{LableText.CATEGORY}</Text>
                                            </View>

                                            <View style={[Styles.inputTextView, { width: '90%' }]}>
                                                <TextInput
                                                    style={[Styles.inputText, { width: '90%' }]}
                                                    placeholder={Placeholder.NAME}
                                                    value={catName}
                                                    onChangeText={(value) => { this.setState({ catName: value }) }}
                                                />
                                            </View>

                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={[Styles.center, { marginHorizontal: '10%', width: '100%' }]}>
                                                    <TouchableOpacity style={[Styles.buttonBox, Styles.center, { width: '50%' }]} >
                                                        <Text style={[Styles.buttonName, { paddingHorizontal: 30 }]} onPress={() => { this.handleAddImageCategory() }}>{LableText.NEXT}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                        {/* }  */}
                                    </View>
                                </View>
                            </Modal>

                            <Modal style={Styles.modal} isVisible={brandVisible}>
                                <View style={Styles.modalHeader}>
                                    <TouchableOpacity>
                                        <Text onPress={() => { this.brandModal() }}><CancelIcon fontSize={25} /></Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={Styles.center}>
                                    <View style={[Styles.center, { width: '100%' }]}>
                                        {/* {catImage && categoryVisible ?
                                    <View style={[Styles.profile, Styles.center]}>
                                        <View style={Styles.categoryImage}>
                                            <View>
                                                <TouchableOpacity onPress={() => { this.selectPhoto() }}>
                                                    <View style={Styles.ImgBgOne} />
                                                    <View style={Styles.ImgBgTwo} />
                                                     <Avatar source={imageSource} style={Styles.profile_avatar} /> 
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={[Styles.center, { marginHorizontal: '10%', width: '100%' }]}>
                                                <TouchableOpacity style={[Styles.buttonBox, Styles.center, { width: '50%' }]} >
                                                    <Text style={[Styles.buttonName, { paddingHorizontal: 30 }]} onPress={() => { this.handleAddImageCategory() }}>{LableText.UPLOAD}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View> : */}


                                        <View style={[{ width: '100%' }]}>
                                            {/* <View style={[Styles.center, { width: '100%' }]}> */}

                                            <View style={[{ width: '90%' }]}>
                                                <Text style={[{ paddingHorizontal: 30 }]}>{LableText.CATEGORY}</Text>
                                            </View>
                                            <View style={[Styles.inputTextView, { width: '90%' }]}>
                                                <Picker
                                                    note
                                                    mode="dropdown"
                                                    style={[Styles.center, { marginVertical: -8, color: Color.COLOR, width: '100%' }]}
                                                    selectedValue={category}
                                                    onValueChange={(value) => { this.setState({ category: value }) }}
                                                >
                                                    <Picker.Item label="Select category" value="" />
                                                    {null != allCategory ? allCategory.map((data, index) => {
                                                        return (
                                                            <Picker.Item label={data.name} value={data.id} />
                                                        )
                                                    }) : null}
                                                </Picker>
                                            </View>
                                            {/* </View> */}

                                            <View style={[{ width: '90%' }]}>
                                                <Text style={[{ paddingHorizontal: 30 }]}>{LableText.BRAND}</Text>
                                            </View>
                                            <View style={[Styles.inputTextView, { width: '90%' }]}>
                                                <TextInput
                                                    style={[Styles.inputText, { width: '90%' }]}
                                                    placeholder={Placeholder.NAME}
                                                    value={brandName}
                                                    onChangeText={(value) => { this.setState({ brandName: value }) }}
                                                />
                                            </View>

                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={[Styles.center, { marginHorizontal: '10%', width: '100%' }]}>
                                                    <TouchableOpacity style={[Styles.buttonBox, Styles.center, { width: '50%' }]} >
                                                        <Text style={[Styles.buttonName, { paddingHorizontal: 30 }]} onPress={() => { this.handleAddImageBrand() }}>{LableText.NEXT}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                        {/* }  */}
                                    </View>
                                </View>
                            </Modal>
                        </View>}
                    <View style={Styles.bottomSpace}></View>
                </Content>

            </SafeAreaLayout>
        );
    }
}