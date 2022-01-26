import React from 'react';
import {
    ListRenderItemInfo, View, StyleSheet, TouchableOpacity,
    ActivityIndicator, Image, Alert, FlatList, ScrollView, RefreshControl, TextInput
} from 'react-native';
import {
    // Input,
    Layout,
    List,
    ListElement,
    ListItem,
    ListItemElement,
    Text,
    ThemedComponentProps,
    withStyles, TabBar,
    styled, Divider, Avatar, Icon, Button
} from 'react-native-ui-kitten';
import { ScrollableTab, Tab, Item, Container, Content, Tabs, Header, TabHeading, Thumbnail, Input, Label, Footer, FooterTab, Picker } from 'native-base';
import { ItemDetailScreenProps } from '../../../navigation/stock.navigator';
import { AppRoute } from '../../../navigation/app-routes';
import { ProgressBar } from '../../../components/progress-bar.component';
import { SearchIcon, EditIcon, PlusCircle, BackIcon } from '../../../assets/icons';
import { TimeLineData } from '../../../data/TimeLineData.model';
import { AppConstants } from '../../../constants/AppConstants';
import { Toolbar } from '../../../components/toolbar.component';
import {
    SafeAreaLayout,
    SafeAreaLayoutElement,
    SaveAreaInset,
} from '../../../components/safe-area-layout.component';
import { MenuIcon, ExperienceIcon, LocationIcon, PublicIcon, WishIcon } from '../../../assets/icons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { any } from 'prop-types';
import { AsyncStorage } from 'react-native';
import axios from 'axios';
import { truncate, open } from 'fs';
// import VideoPlayer from 'react-native-video-player';
// import { FlatList } from 'react-native-gesture-handler';
import Share from 'react-native-share';
import { pathToFileURL, fileURLToPath } from 'url';
// import SwipeHiddenHeader from 'react-native-swipe-hidden-header';
import Animated from 'react-native-reanimated';
import { Styles } from '../../../assets/styles'
import { Color, LableText } from '../../../constants/LabelConstants';
// import ImagePicker from 'react-native-image-picker';
import { url } from 'inspector';
import ImageSlider from 'react-native-image-slider';
// import axios from 'axios';  
// import Container from '@react-navigation/core/lib/typescript/NavigationContainer';

const allTodos: TimeLineData[] = [
    TimeLineData.getAllTimelineData()
];

type MyState = {
    displayName: String,
    dataSource: [],
    userId: String,
    likeCount: number,
    dislikeCount: number,
    liked: boolean[],
    disliked: boolean[],
    categories: [],
    textShown: -1,
    selectedIndex: number;
}


const renderItem = ({ item, index }) => (
    <ListItem title={`${item.title} ${index + 1}`} />
);

const HEADER_MAX_HEIGHT = 120;
const HEADER_MIN_HEIGHT = 70;
const PROFILE_IMAGE_MAX_HEIGHT = 80;
const PROFILE_IMAGE_MIN_HEIGHT = 40;


export class ItemDetailScreen extends React.Component<ItemDetailScreenProps & ThemedComponentProps, MyState & any> {
    constructor(props) {
        super(props)
        this.state = {
            isSelectedWish: false,
            productId: '',
            allProduct: [],
            allCategory: [],
            allBrand: [],
            selectedCategory: '',
            selectedBrand: '',
            allMeasurement: [],
            file: null,
            selectedFile: null,
            allImages: [],

            allData: [{
                    url: '/api/product/getproductbyproductidandshopid/' + this.props.route.params.productId + '/' + this.props.route.params.shopId,
                    method: 'GET',
                    variable: 'allProduct',
                },
                {
                    url: '/api/lookup/getallmeasurementtype',
                    method: 'GET',
                    variable: 'allMeasurement',
                },
                {
                    url: '/api/category/getallcategory',
                    method: 'GET',
                    variable: 'allCategory',
                },
                {
                    url: '/api/brand/getallbrand',
                    method: 'GET',
                    variable: 'allBrand',
                }],
        }
        this._onRefresh = this._onRefresh.bind(this);
        this.handleWishList = this.handleWishList.bind(this);
        this.navigationCart = this.navigationCart.bind(this);
        this.handleCart = this.handleCart.bind(this);
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });
    }

    // renderMyJob = ({ item }: any): ListItemElement => (
    //     <ListItem style={{ borderBottomColor: 'rgba(2,15,20,0.10)', borderBottomWidth: 10 }}>
    //         {item != null ?
    //             <View>
    //                 <TouchableOpacity onPress={(e) => this.handleJobSubmit(e, item.id, item.userId)}>
    //                     <View style={styles.card}>
    //                         <View style={styles.card1}>
    //                             <View style={styles.card1_1}></View>
    //                             <View style={styles.card1_2}>
    //                                 <Text style={styles.softwareEngineer}>{item.jobTitle}</Text>
    //                             </View>
    //                             <View style={styles.card1_3}>
    //                                 <Image
    //                                     source={require("../../../assets/logo.png")}
    //                                     resizeMode="contain"
    //                                     style={styles.image}
    //                                 />
    //                             </View>
    //                         </View>

    //                         <View style={styles.card1}>
    //                             <View style={styles.card1_1}>
    //                                 <Text><ExperienceIcon /></Text>
    //                             </View>
    //                             <View style={styles.card2}>
    //                                 {this.state.experience_Required.map((data, index) => {
    //                                     if (data.lookUpId == item.experienceRequired)
    //                                         return (
    //                                             <Text style={styles.loremIpsum}>{data.lookUpLabel}</Text>
    //                                         )
    //                                 })}

    //                             </View>
    //                         </View>

    //                         <View style={styles.card1}>
    //                             <View style={styles.card1_1}>
    //                                 <Text><LocationIcon /></Text>
    //                             </View>
    //                             <View style={styles.card2}>
    //                                 <Text style={styles.bangalore}>{item.location}</Text>
    //                             </View>
    //                         </View>

    //                         <View style={styles.card1}>
    //                             <View style={styles.card1_1}>
    //                                 <Text><PencilIcon /></Text>
    //                             </View>
    //                             <View style={[styles.card2, { flexWrap: 'wrap', flexDirection: 'row' }]}>
    //                                 {this.state.skill.map((data, index) => {
    //                                     return (
    //                                         <View>
    //                                             {item.skill.split(',').map((data1, index) => {
    //                                                 if (data1 == data.lookUpId)
    //                                                     return (
    //                                                         <View style={styles.skill}>
    //                                                             <Text style={styles.loremIpsum2}>{data.lookUpLabel}</Text>
    //                                                         </View>
    //                                                     )
    //                                             })
    //                                             }
    //                                         </View>
    //                                     )
    //                                 })}

    //                             </View>
    //                         </View>

    //                         <View style={styles.card1}>
    //                             <View style={styles.card1_1}>
    //                                 <Text><PublicIcon /></Text>
    //                             </View>
    //                             <View style={styles.card2}>
    //                                 <Text style={styles.loremIpsum5}>5 Mar 2020</Text>
    //                             </View>
    //                         </View>

    //                         <View style={[styles.card1, { marginTop: 15 }]}>
    //                             <View style={styles.card1_1}></View>
    //                             <View style={styles.card2}>
    //                                 <Text style={styles.softwareEngineer}>{item.companyName}</Text>
    //                             </View>
    //                         </View>
    //                     </View>

    //                     {/* <View style={styles.card1}>
    //                     <View style={styles.cardInner1}>
    //                         <View>
    //                             <Avatar source={{ uri: AppConstants.IMAGE_BASE_URL + '/avatar/mobile.jpeg' }} style={styles.image} />
    //                         </View>
    //                     </View>

    //                     <View style={styles.cardInner2}>
    //                         <View style={styles.cardInner2_1}>
    //                             <Text style={styles.jobType}>{item.jobTitle}</Text>
    //                             <Text style={styles.companyName}>{item.companyName}</Text>
    //                             <Text style={styles.location}>{item.location}</Text>
    //                         </View>

    //                         <View style={styles.cardInner2_1}>
    //                             <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10 }}>

    //                                 {this.state.salary_Type.map((data, index) => {
    //                                     if (data.lookUpId == item.salaryType)
    //                                         return (
    //                                             <View style={{ flexDirection: 'column' }}>
    //                                                 <Text style={styles.subHeading}>Salary {data.lookUpLabel}</Text>
    //                                                 <Text style={styles.subData}>{item.salaryFrom} - {item.salaryTo}</Text>
    //                                             </View>
    //                                         )
    //                                 })}

    //                                 {this.state.experience_Required.map((data, index) => {
    //                                     if (data.lookUpId == item.experienceRequired)
    //                                         return (
    //                                             <View style={{ flexDirection: 'column' }}>
    //                                                 <Text style={styles.subHeading}>Experience</Text>
    //                                                 <Text style={styles.subData}>{data.lookUpLabel}</Text>
    //                                             </View>
    //                                         )
    //                                 })}

    //                                 {this.state.employment_Type.map((data, index) => {
    //                                     if (data.lookUpId == item.employmentType)
    //                                         return (
    //                                             <View style={{ flexDirection: 'column' }}>
    //                                                 <Text style={styles.subHeading}>Employment</Text>
    //                                                 <Text style={styles.subData}>{data.lookUpLabel}</Text>
    //                                             </View>
    //                                         )
    //                                 })}


    //                             </View>
    //                             {this.state.job_Industry.map((data, index) => {
    //                                 if (data.lookUpId == item.jobIndustry)
    //                                     return (
    //                                         <View style={{ flexDirection: 'column' }}>
    //                                             <Text style={styles.subHeading}>Job Category</Text>
    //                                             <Text style={styles.subData}>{data.lookUpLabel}</Text>
    //                                         </View>
    //                                     )
    //                             })}

    //                             {this.state.skill.map((data, index) => {
    //                                 if (data.lookUpId == item.skill)
    //                                     return (
    //                                         <View>
    //                                             <Text style={styles.skill}>Skills: {data.lookUpLabel}</Text>
    //                                         </View>
    //                                     )
    //                             })}


    //                         </View>

    //                         <View style={styles.cardInner2_2}>
    //                             <Text style={styles.subHeading}>30 Applicants</Text>
    //                             <Text style={styles.subHeading}>30 days ago</Text>
    //                         </View>

    //                     </View>
    //                 </View> */}
    //                 </TouchableOpacity>

    //                 {/* <Footer>
    //                 <FooterTab style={styles.footerTab}>
    //                     <TouchableOpacity style={styles.applyButton} onPress={() => this.props.navigation.navigate(AppRoute.HOME)}>
    //                         <Text style={styles.applyButtonText}>Apply Now</Text>
    //                     </TouchableOpacity>
    //                 </FooterTab>
    //             </Footer> */}

    //             </View> :
    //             <ActivityIndicator size='large' color='green' />}

    //     </ListItem>
    // )

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
    //                 isVisible: true
    //             });

    //             this.oploadImage(file)
    //         }
    //     });
    // }

    oploadImage(file) {
        const { productId, selectedFile } = this.state;
        const formData = new FormData();
        formData.append('file', file);
        console.log(this.state.userId);
        fetch(AppConstants.API_BASE_URL + '/api/file/upload/avatar/' + productId, {
            method: 'post',
            body: formData
        }).then(res => {
            if (res.ok) {
                //   console.log(res.data);
                Alert.alert("File uploaded successfully.");
                //   window.location.reload(false);
            }
        });
    }

    navigationCart() {
        this.props.navigation.navigate(AppRoute.CART)
    }

    navigationItemList() {
        // this.props.navigation.navigate(AppRoute.ITEMLIST)
    }

    async componentDidMount() {
        const { allData } = this.state;

        const productId = this.props.route.params.productId
        // Alert.alert(productId)
        this.setState({
            productId: productId
        })

        allData.map((data, index) => {
            // console.log(allData)
            axios({
                method: data.method,
                url: AppConstants.API_BASE_URL + data.url,
            }).then((response) => {
                if (data.variable === 'allProduct') {
                    console.log(data.variable, response.data)

                    const image1 = []
                    response.data[0].image.map((image) => {
                        image1.push(AppConstants.IMAGE_BASE_URL + '/product/' + image.avatarName)
                        console.log(image.avatarName)
                    })
                    console.log('allImages Url', image1)
                    this.setState({
                        allProduct: response.data[0],
                        allImages: image1
                    })
                } else if (data.variable === 'allCategory') {
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
                    // console.log(data.variable, response.data)
                    this.setState({
                        allMeasurement: response.data,
                    })
                }
            }, (error) => {
                Alert.alert("Please enter a valid email ID and password.")
            });
        })
    }

    //     ImageResizer.createResizedImage(path: "../../../assets/profile.jpeg", maxWidth: 100, maxHeight: 200, compressFormat, quality, rotation, outputPath)
    //   .then(response => {
    //         // response.uri is the URI of the new image that can now be displayed, uploaded...
    //         // response.path is the path of the new image
    //         // response.name is the name of the new image with the extension
    //         // response.size is the size of the new image
    //     })
    //   .catch(err => {
    //         // Oops, something went wrong. Check that the filename is correct and
    //         // inspect err to get more details.
    //     });

    addItem() { }

    handleCart() {
        this.navigationCart();
    }

    handleWishList() {
        const { isSelectedWish } = this.state
        this.setState({
            isSelectedWish: !isSelectedWish
        })
    }


    render() {
        const { isSelectedWish, allMeasurement, allImages, productId, allProduct } = this.state
        return (
            <SafeAreaLayout
                style={Styles.safeArea}
                insets={SaveAreaInset.TOP}>
                <Toolbar
                    title='Product Details'
                    backIcon={BackIcon}
                    onBackPress={this.props.navigation.goBack}
                    style={{ marginTop: -5, marginLeft: -5 }}
                />

                <Divider />

                <Content style={Styles.customer_content}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                >

                    {/* <Header style={styles.header}>
                        <View style={Styles.searchBox}>
                            <Text style={Styles.searchIcon}><SearchIcon /></Text>
                            <TextInput
                                placeholder="Search"
                                style={Styles.searchInput}
                            />
                        </View>
                    </Header> */}
                    {null != allProduct ?
                        <>
                            {/* <View style={[Styles.product_view]}>
                                <TouchableOpacity style={[{ justifyContent: 'flex-end', marginTop: 5, marginRight: 5, alignItems: 'flex-end' }]} onPress={() => { this.selectPhoto() }}>
                                    <Text><EditIcon /></Text>
                                </TouchableOpacity>
                                <View style={[Styles.product_view, Styles.center]}>
                                    <View style={[Styles.product_image]}>
                                        <ImageSlider images={allImages} />
                                    </View>
                                </View>
                            </View> */}
                            <View style={[Styles.product_view, Styles.center]}>
                                <View style={[Styles.product_image]}>
                                    <ImageSlider images={allImages} />
                                </View>
                            </View>

                            <View style={Styles.product_2nd_view}>
                                <View style={Styles.product_2nd_view_1}>
                                    {/* <View style={Styles.product_2nd_quantity_view}>
                                        <Picker
                                            note
                                            mode="dropdown"
                                            style={[Styles.center, { marginVertical: -8, color: Color.COLOR, width: 80 }]}
                                            selectedValue={this.state.selected}
                                            onValueChange={() => { }}
                                        >
                                            <Picker.Item label="1" value="key0" />
                                            <Picker.Item label="2" value="key1" />
                                        </Picker>
                                    </View> */}


                                    {/* <TouchableOpacity style={[Styles.product_2nd_buy_view, Styles.center]}> */}
                                        <View style={[Styles.product_2nd_buy_view, Styles.center]}>
                                            <Text style={Styles.product_2nd_buy_text}>{null != allProduct ? allProduct.stock : null}</Text>
                                        </View>
                                    {/* </TouchableOpacity> */}


                                    {/* <TouchableOpacity style={[Styles.product_2nd_buy_view, Styles.center]}>
                                        <View>
                                            <Text style={Styles.product_2nd_buy_text} onPress={() => { this.handleCart() }}>{LableText.BUY}</Text>
                                        </View>
                                    </TouchableOpacity> */}
                                </View>

                                {/* <View style={Styles.product_2nd_wish_view}>
                                    <Text onPress={() => { this.handleWishList() }} style={isSelectedWish ? Styles.selected_wish_icon : Styles.wish_icon}><WishIcon /></Text>
                                </View> */}


                            </View>

                            <View style={Styles.product_3rd_view}>
                                <View style={{ backgroundColor: '#fff', paddingHorizontal: 5 }}>
                                    <Text style={{ color: '#000', paddingVertical: 20, fontWeight: 'bold', fontSize: 20 }}>{allProduct.name}</Text>

                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginVertical: 5 }}>
                                        {null != allMeasurement ? allMeasurement.map((measurement, mIndex) => {
                                            if (allProduct.measurement == measurement.lookUpId) {
                                                return (
                                                    <Text style={{ color: Color.COLOR_ITEM_NAME, marginTop: 5 }}>{allProduct.quantity} {measurement.lookUpName}</Text>
                                                );
                                            }
                                        }) : null}
                                        <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }}>Rs. {allProduct.price}</Text>
                                        {allProduct.offerActiveInd ?
                                            <>
                                                <Text style={{ color: Color.COLOR, fontSize: 20, textDecorationLine: 'line-through' }}>{allProduct.oldPrice}</Text>
                                                <Text style={{ color: Color.COLOR }}>{allProduct.offerPercent} % off</Text>
                                            </> : null}
                                    </View>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                        {allProduct.offerActiveInd ?
                                            <>
                                                <Text style={{ color: Color.COLOR }}>Offer till {allProduct.offerTo.substr(8, 2) + "/" + allProduct.offerTo.substr(5, 2) + "/" + allProduct.offerTo.substr(0, 4)}.</Text>
                                            </> : null}
                                    </View>
                                </View>
                                {/* <View style={Styles.product_3rd_view_1}> */}
                                {/* <ScrollView> */}
                                <View style={Styles.product_description_view}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>Product Description</Text>
                                    <View style={{ borderTopWidth: 2, borderColor: '#501B1D', marginTop: 10, padding: 10 }}>
                                        <Text style={{ fontSize: 18 }}>{allProduct.description}</Text>
                                    </View>
                                </View>
                                {/* </ScrollView> */}
                            </View>
                            <View style={{ height: 100, width: '100%' }} />
                        </> : null}
                </Content>

            </SafeAreaLayout>
        )
    }

}
const options = {
    title: 'Select a Photo',
    takePhoto: 'Take Photo',
    chooseFromLibraryButtonTitle: 'Choose from gallery',
    quality: 0.7,
    maxWidth: 500,
    maxHeight: 550,
    type: 'image'
}