import { Picker } from '@react-native-picker/picker';
import { Divider, ListItem, Text, ThemedComponentProps } from '@ui-kitten/components';
import axios from 'axios';
import Axios from 'axios';
import React from 'react';
import { Alert, AsyncStorage, Pressable, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import ImageSlider from 'react-native-image-slider';
import { scale } from 'react-native-size-matters';

import { BackIcon, RightArrowIcon, RupeeIcon } from '../../../assets/icons';
import { Styles } from '../../../assets/styles';
import { DropDown } from '../../../components/drop-down';
import { Item } from '../../../components/drop-item';
import { SafeAreaLayout, SaveAreaInset } from '../../../components/safe-area-layout.component';
import { Toolbar } from '../../../components/toolbar.component';
import { AppConstants } from '../../../constants/AppConstants';
import { Color, LableText } from '../../../constants/LabelConstants';
import { AppRoute } from '../../../navigation/app-routes';
import { ProductDetailScreenProps } from '../../../navigation/customer-navigator/product-list.navigator';
import { WishProductDetailScreenProps } from '../../../navigation/customer-navigator/wish-list.navigator';

// import VideoPlayer from 'react-native-video-player';
// import { FlatList } from 'react-native-gesture-handler';
// import SwipeHiddenHeader from 'react-native-swipe-hidden-header';
// import axios from 'axios';  
// import Container from '@react-navigation/core/lib/typescript/NavigationContainer';


const renderItem = ({ item, index }) => (
    <ListItem title={`${item.title} ${index + 1}`} />
);

const HEADER_MAX_HEIGHT = 120;
const HEADER_MIN_HEIGHT = 70;
const PROFILE_IMAGE_MAX_HEIGHT = 80;
const PROFILE_IMAGE_MIN_HEIGHT = 40;

type Props = ProductDetailScreenProps & ThemedComponentProps & any & WishProductDetailScreenProps

export class ProductDetailScreen extends React.Component<Props, any> {
    constructor(props: Props) {
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
            userData: [],
            wishList: '',
            allImages: [],
            productQuantity: '1',
            itemList: [],
            descriptionShow: false,
            selectedIndex: 0
        }
        this._onRefresh = this._onRefresh.bind(this);
        this.handleWishList = this.handleWishList.bind(this);
        this.navigationCart = this.navigationCart.bind(this);
        this.handleCart = this.handleCart.bind(this);
        this.getProductById = this.getProductById.bind(this);
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


    navigationCart() {
        this.props.navigation.navigate(AppRoute.CART)
    }

    navigationItemList() {
        // this.props.navigation.navigate(AppRoute.ITEMLIST)
    }

    async componentDidMount() {
        const { allData } = this.state;

        let userDetail = await AsyncStorage.getItem('userDetail');
        let userData = JSON.parse(userDetail);

        const productId = this.props.route.params.productId;
        const shop = this.props.route.params.shopId;
        this.setState({
            userData: userData,
            productId: productId,
            shopId: shop
        })
        this.initialData()
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
                Alert.alert("Server error.")
            });
        }
    }


    initialData() {
        const productId = this.props.route.params.productId;
        const shop = this.props.route.params.shopId;
        this.getProductById(productId)
        this.getMeasurement()
    }

    getProductById(id) {
        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/item/getlist/' + id,
        }).then((response) => {
            var image1: any = []
            response.data.image.map((image: any) => {
                image1.push(AppConstants.IMAGE_BASE_URL + '/product/' + image.avatarName)
            })
            this.setState({
                allProduct: response.data,
                itemList: response.data.itemList,
                allImages: image1
            })
        }, (error) => {
            Alert.alert("Server error.")
        });
    }

    getMeasurement() {
        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/measurement/getbyshopid/' + AppConstants.SHOP_ID
        }).then((response: any) => {
            if (null != response.data) {
                this.setState({
                    allMeasurement: response.data
                })
            }
        }, (error: any) => {
            console.log(error)
        });
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

    async handleAddToCart(shopId, productId) {
        const { userData, productQuantity } = this.state;
        const logedIn = await AsyncStorage.getItem('logedIn');
        if (null != logedIn && logedIn === 'true') {
            // Alert.alert(''+ userData.userId + productId + logedIn)
            Axios({
                method: 'POST',
                url: AppConstants.API_BASE_URL + '/api/cart/create',
                data: {
                    shopId: shopId,
                    userId: userData.userId,
                    productId: productId,
                    productQuantity: productQuantity
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

    handleCart() {
        this.navigationCart();
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
                this._onRefresh();
            }, (error) => {
                Alert.alert("Server error.")
            });
        } else {
            this.props.navigation.navigate(AppRoute.AUTH);
        }
    }

    handleVariant(index) {
        this.setState({
            selectedIndex: index
        })
    }

    render() {
        const { isSelectedWish, descriptionShow, selectedIndex, itemList, userData, productQuantity, allMeasurement, allImages, wishList, allProduct, productId } = this.state
        return (
            <SafeAreaLayout
                style={[Styles.safeArea]}
                insets={SaveAreaInset.TOP}>
                <Toolbar
                    title='Product Details'
                    backIcon={BackIcon}
                    onBackPress={this.props.navigation.goBack}
                    style={{ marginTop: -5, marginLeft: -5 }}
                />

                <Divider />

                <ScrollView style={[Styles.customer_content]}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                >
                    {null != allProduct ?
                        <>
                            <View style={[Styles.product_view, Styles.center]}>
                                <View style={[Styles.product_image]}>
                                    {allImages != null && allImages != [] ?
                                        <ImageSlider images={allImages} />
                                        : null
                                    }
                                </View>
                            </View>

                            <View style={{ borderRadius: 20 }}>
                                <DropDown
                                    selectedValue={selectedIndex}
                                    placeholder="Select Variant"
                                    onChange={(value) => { this.handleVariant(value) }}
                                >
                                    {itemList != null && allMeasurement != null ? itemList.map((data, index) => allMeasurement.map((measurement, i) => {
                                        if (data.measurement == measurement.id) {
                                            return (
                                                <Item key={index} style={selectedIndex == index ? Styles.dropdown_selected_text : Styles.dropdown_text} label={data.name + " " + data.unitQuantity + measurement.name + ""} value={index} />
                                            )
                                        }
                                    })) : null}
                                </DropDown>
                            </View>
                            {itemList != null ? itemList.map((data, index) => {
                                if (index == selectedIndex) {
                                    return (
                                        <>
                                            <View style={[Styles.product_2nd_view, { justifyContent: 'flex-end' }]}>
                                                <View style={Styles.product_2nd_view_1}>
                                                    <Pressable style={[Styles.product_2nd_buy_view, Styles.center]} onPress={() => { this.handleAddToCart(data.shopId, data.id) }}>
                                                        <View>
                                                            <Text style={Styles.product_2nd_buy_text}>{LableText.CART}</Text>
                                                        </View>
                                                    </Pressable>
                                                </View>
                                                {/* {null != wishList ?
                                                    <View style={Styles.product_2nd_wish_view}>
                                                        <Text
                                                            onPress={() => { this.handleWishList(allProduct.productId) }}
                                                            style={wishList.includes(allProduct.productId) ?
                                                                Styles.selected_wish_icon :
                                                                Styles.wish_icon
                                                            }
                                                        >
                                                            <WishIcon />
                                                        </Text>
                                                    </View> : null
                                                } */}
                                            </View>

                                            <View style={Styles.product_3rd_view}>
                                                <View style={{ backgroundColor: '#fff', paddingHorizontal: 5 }}>
                                                    <Text style={{ color: '#000', paddingTop: 20, fontWeight: 'bold', fontSize: 20 }}>{data.name}</Text>
                                                    {/* <Text style={{ color: '#000', paddingVertical: 5, fontWeight: 'bold', fontSize: 20 }}>{allProduct.shopName}</Text> */}

                                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginVertical: 5 }}>
                                                        {null != allMeasurement ? allMeasurement.map((measurement, mIndex) => {
                                                            if (data.measurement == measurement.id) {
                                                                return (
                                                                    <Text style={{ color: Color.COLOR_ITEM_NAME, marginTop: 5 }}>{data.unitQuantity} {measurement.name}</Text>
                                                                );
                                                            }
                                                        }) : null}

                                                    </View>
                                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                                        <Text style={Styles.old_price_text}>MRP {data.mrp.toFixed(2)}</Text>
                                                        <Text style={{ color: '#000', fontWeight: '600', fontSize: scale(14) }}><RupeeIcon fontSize={scale(14)} />{data.unitSellingPrice}/pc</Text>
                                                        <Text style={[{ fontFamily: 'notoserif' }, Styles.offer_price_text]}>
                                                            {Math.round(data.customerSingleOffer)} % Off
                                                        </Text>
                                                    </View>
                                                    {data.bundleQuantity > 1 ? <Text style={{ fontSize: scale(12), color: Color.OFFER }} ><RupeeIcon fontSize={scale(14)} />{(data.bundlePrice / data.bundleQuantity).toFixed(2)} / pc (Buy {data.bundleQuantity} or more)</Text> : null}

                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                                        {allProduct.offerActiveInd ?
                                                            <>
                                                                <Text style={{ color: Color.COLOR }}>Offer till {allProduct.offerTo.substr(8, 2) + "/" + allProduct.offerTo.substr(5, 2) + "/" + allProduct.offerTo.substr(0, 4)}.</Text>
                                                            </> :
                                                            null
                                                        }
                                                    </View>
                                                </View>
                                                <View style={Styles.product_description_view}>
                                                    <Pressable onPress={() => this.setState({ descriptionShow: !descriptionShow })}>
                                                        <View style={{ backgroundColor: Color.DESCRIPTION_BACKGROUND, paddingHorizontal: scale(10), flexDirection: 'row', justifyContent: 'space-between', paddingVertical: scale(10) }}>
                                                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Product Description</Text>
                                                            <Text style={{ marginTop: scale(5), }} ><RightArrowIcon fontSize={scale(15)} /></Text>
                                                        </View>
                                                    </Pressable>
                                                    {descriptionShow ?
                                                        <View style={{ padding: 10 }}>
                                                            <Text style={{ fontSize: 18 }}>{allProduct.description}</Text>
                                                        </View> : null}
                                                </View>
                                            </View>
                                        </>
                                    )
                                }
                            }) : null}
                        </> : null}
                </ScrollView>
            </SafeAreaLayout>
        )
    }

}