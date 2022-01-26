import React from 'react';
import {
    ListRenderItemInfo, View, StyleSheet, TouchableOpacity,
    ActivityIndicator, Image, Alert, FlatList, ScrollView, RefreshControl, TextInput, Dimensions
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
import { ScrollableTab, Tab, Item, Container, Content, Tabs, Header, TabHeading, Thumbnail, Input, Label, Footer, FooterTab, Col } from 'native-base';
import { CartScreenProps } from '../../../navigation/shopKeeperNavigator/allItem.Navigator';
import { AppRoute } from '../../../navigation/app-routes';
import { ProgressBar } from '../../../components/progress-bar.component';
import { SearchIcon, MinusIcon, RupeeIcon, PlusCircle, BackIcon, CancelIcon, PlusIcon, AddIcon, RightArrowIcon } from '../../../assets/icons';
import { TimeLineData } from '../../../data/TimeLineData.model';
import { AppConstants } from '../../../constants/AppConstants';
import { Toolbar } from '../../../components/toolbar.component';
import {
    SafeAreaLayout,
    SafeAreaLayoutElement,
    SaveAreaInset,
} from '../../../components/safe-area-layout.component';
import { MenuIcon, ExperienceIcon, LocationIcon, PublicIcon, PencilIcon } from '../../../assets/icons';
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
import { Color } from '../../../constants/LabelConstants';
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

const HEADER_MAX_HEIGHT = 120;
const HEADER_MIN_HEIGHT = 70;
const PROFILE_IMAGE_MAX_HEIGHT = 80;
const PROFILE_IMAGE_MIN_HEIGHT = 40;

var SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;


export class CartScreen extends React.Component<CartScreenProps & ThemedComponentProps, MyState & any> {
    constructor(props) {
        super(props)
        this.state = {

        }
        this._onRefresh = this._onRefresh.bind(this);
        this.navigationProductDetail = this.navigationProductDetail.bind(this);
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });
    }

    componentDidMount() {
        SCREEN_WIDTH = Dimensions.get('window').width;
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

    navigationItemList() {
        // this.props.navigation.navigate(AppRoute.ITEMLIST)
    }

    navigationProductDetail() {
        this.props.navigation.navigate(AppRoute.PRODUCT_DETAIL)
    }

    continiueShopping() {
        this.props.navigation.navigate(AppRoute.ALLITEM)
    }

    addItem() { }

    render() {
        const { my_Jobs } = this.state
        return (
            <SafeAreaLayout
                style={Styles.safeArea}
                insets={SaveAreaInset.TOP}>
                <Toolbar
                    title='Cart'
                    backIcon={BackIcon}
                    onBackPress={this.props.navigation.goBack}
                    onRightPress={() => { this.continiueShopping() }}
                    menuIcon={PlusCircle}
                    style={{ marginTop: -5, marginLeft: -5 }}
                />
                <Divider />

                <Content style={Styles.cart_content} showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                >
                    {/* <Header style={styles.header}> */}
                    {/* <View style={Styles.searchBox}>
                        <Text style={Styles.searchIcon}><SearchIcon /></Text>
                        <TextInput
                            placeholder="Search"
                            style={Styles.searchInput}
                        />
                    </View> */}

                    <View style={{ backgroundColor: '#fff', borderColor: Color.BORDER, borderWidth: 0.5, padding: 20, marginBottom: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Address</Text>

                        <Text style={{ marginVertical: 5 }}>101, InOrbit Complex, Near B.M.P. 16, Phulwari Khagaul Road, Patna, 801505</Text>

                        <View style={{width: '100%', alignItems: 'flex-end'}}>
                            <TouchableOpacity style={[Styles.center, {paddingVertical: 10, width: 100, borderRadius: 5, backgroundColor: Color.COLOR}]}>
                                <Text style={{color: Color.BUTTON_NAME_COLOR}}>Change</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={Styles.cart_main_view}>

                        <View style={Styles.cart_view_1}>
                            <View style={Styles.cart_view_1_1}>
                                <View style={[Styles.cart_avatar_view, Styles.center]}>
                                    <Avatar source={require("../../../assets/sweets.png")} style={Styles.cart_avatar} />
                                </View>
                            </View>

                            <View style={Styles.cart_view_1_2}>
                                <Text style={Styles.cart_name_text}>Sweets</Text>
                                <View style={Styles.cart_price_view}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={Styles.price_text}><RupeeIcon /> 1100</Text>
                                        <Text style={Styles.offer_price_text}>1,150</Text>
                                    </View>

                                    <View style={Styles.cart_quantity_view}>
                                        <TouchableOpacity style={Styles.cart_button} onPress={() => { }}>
                                            <Text style={Styles.cart_button_text}><MinusIcon /></Text>
                                        </TouchableOpacity>

                                        <View style={Styles.cart_quantity_text_view}>
                                            <Text style={Styles.cart_quantity_text}>3</Text>
                                        </View>

                                        <TouchableOpacity style={Styles.cart_button} onPress={() => { }}>
                                            <Text style={Styles.cart_button_text}><AddIcon /></Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View>
                                    <Text style={Styles.cart_offer_text}>25% off</Text>
                                </View>
                            </View>
                        </View>

                        <View>
                            <Text style={[Styles.cart_offer_text, { marginLeft: 10 }]}>5 offers available</Text>
                        </View>
                    </View>

                    {/* <View style={Styles.cart_main_view}>

                        <View style={Styles.cart_view_1}>
                            <View style={Styles.cart_view_1_1}>
                                <View style={[Styles.cart_avatar_view, Styles.center]}>
                                    <Avatar source={require("../../../assets/dawat_rice.jpg")} style={Styles.cart_avatar} />
                                </View>
                            </View>

                            <View style={Styles.cart_view_1_2}>
                                <Text style={Styles.cart_name_text}>Dawat Basmati Rice 25 kg</Text>
                                <View style={Styles.cart_price_view}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={Styles.price_text}><RupeeIcon /> 1,100</Text>
                                        <Text style={Styles.offer_price_text}>1,150</Text>
                                    </View>

                                    <View style={Styles.cart_quantity_view}>
                                        <TouchableOpacity style={Styles.cart_button} onPress={() => { }}>
                                            <Text style={Styles.cart_button_text}><MinusIcon /></Text>
                                        </TouchableOpacity>

                                        <View style={Styles.cart_quantity_text_view}>
                                            <Text style={Styles.cart_quantity_text}>1</Text>
                                        </View>

                                        <TouchableOpacity style={Styles.cart_button} onPress={() => { }}>
                                            <Text style={Styles.cart_button_text}><AddIcon /></Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View>
                                    <Text style={Styles.cart_offer_text}>2% off</Text>
                                </View>
                            </View>
                        </View>

                        <View>
                            <Text style={[Styles.cart_offer_text, { marginLeft: 10 }]}>5 offers available</Text>
                        </View>
                    </View> */}

                    {/* <View style={Styles.cart_main_view}>

                        <View style={Styles.cart_view_1}>
                            <View style={Styles.cart_view_1_1}>
                                <View style={[Styles.cart_avatar_view, Styles.center]}>
                                    <Avatar source={require("../../../assets/dawat_rice.jpg")} style={Styles.cart_avatar} />
                                </View>
                            </View>

                            <View style={Styles.cart_view_1_2}>
                                <Text style={Styles.cart_name_text}>Dawat Basmati Rice 25 kg</Text>
                                <View style={Styles.cart_price_view}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={Styles.price_text}><RupeeIcon /> 1,100</Text>
                                        <Text style={Styles.offer_price_text}>1,150</Text>
                                    </View>

                                    <View style={Styles.cart_quantity_view}>
                                        <TouchableOpacity style={Styles.cart_button} onPress={() => { }}>
                                            <Text style={Styles.cart_button_text}><MinusIcon /></Text>
                                        </TouchableOpacity>

                                        <View style={Styles.cart_quantity_text_view}>
                                            <Text style={Styles.cart_quantity_text}>1</Text>
                                        </View>

                                        <TouchableOpacity style={Styles.cart_button} onPress={() => { }}>
                                            <Text style={Styles.cart_button_text}><AddIcon /></Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View>
                                    <Text style={Styles.cart_offer_text}>2% off</Text>
                                </View>
                            </View>
                        </View>

                        <View>
                            <Text style={[Styles.cart_offer_text, { marginLeft: 10 }]}>5 offers available</Text>
                        </View>
                    </View> */}

                    <TouchableOpacity style={Styles.cart_shopping_view} onPress={() => {this.continiueShopping()}}>
                        <Text style={Styles.cart_shopping_text}>Continue Shopping</Text>
                        <Text style={Styles.cart_shopping_text}><RightArrowIcon fontSize={20} /></Text>
                    </TouchableOpacity>

                    <View style={Styles.price_detail_1}>
                        <Text style={Styles.cart_price_detail_1_text}>PRICE DETAILS</Text>

                        <View style={Styles.price_detail_2}>
                            <View style={Styles.price_detail_2_1}>
                                <Text style={Styles.cart_price_text_head}>Price (3 items)</Text>
                                <Text style={Styles.cart_price_text_head}><RupeeIcon fontSize={18} />3,300</Text>
                            </View>

                            <View style={Styles.price_detail_2_1}>
                                <Text style={Styles.cart_price_text_head}>Discount</Text>
                                <Text style={Styles.cart_price_text_data}>-<RupeeIcon fontSize={18} />300</Text>
                            </View>

                            <View style={Styles.price_detail_2_1}>
                                <Text style={Styles.cart_price_text_head}>Delevery Charges</Text>
                                <Text style={Styles.cart_price_text_data}>FREE</Text>
                            </View>
                        </View>

                        <View style={Styles.cart_total_view}>
                            <Text style={Styles.cart_total_text_head}>Total Amount</Text>
                            <Text style={Styles.cart_total_text_head}><RupeeIcon fontSize={18} />3,000</Text>
                        </View>
                        <View style={Styles.price_detail_2}>
                            <Text style={Styles.cart_price_text_data}>You will save <RupeeIcon fontSize={18} />300 on this order.</Text>
                        </View>
                    </View>


                    {/* <List data={my_Jobs}
                        renderItem={this.renderMyJob}
                    /> */}
                    <View style={{ height: 10, width: '100%' }} />
                </Content>

                <View style={Styles.cart_bottom_box_view}>
                    <View>
                        <Text style={Styles.cart_bottom_box_price_text}><RupeeIcon fontSize={25} />3,000</Text>
                        <TouchableOpacity onPress={() => { }}>
                            <Text style={Styles.cart_price_text_data}>View price details</Text>
                        </TouchableOpacity>
                    </View>

                    <View>
                        <TouchableOpacity style={[Styles.cart_bottom_box_button, Styles.center]}>
                            <Text style={Styles.cart_bottom_box_button_text}>Place Order</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Divider />
                <Divider />
            </SafeAreaLayout>
        )
    }
}
