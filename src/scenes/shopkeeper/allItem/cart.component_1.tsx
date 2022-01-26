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
import { ScrollableTab, Tab, Item, Container, Content, Tabs, Header, TabHeading, Thumbnail, Input, Label, Footer, FooterTab } from 'native-base';
import { CartScreenProps } from '../../../navigation/shopKeeperNavigator/allItem.Navigator';
import { AppRoute } from '../../../navigation/app-routes';
import { ProgressBar } from '../../../components/progress-bar.component';
import { SearchIcon, MinusIcon, AddIcon, PlusCircle, BackIcon, CancelIcon } from '../../../assets/icons';
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

    addItem() { }

    render() {
        const { my_Jobs } = this.state
        return (
            <SafeAreaLayout
                style={[Styles.safeArea, { paddingHorizontal: 5 }]}
                insets={SaveAreaInset.TOP}>
                <Toolbar
                    title='Cart'
                    backIcon={BackIcon}
                    onBackPress={this.props.navigation.goBack}
                    onRightPress={() => { this.addItem() }}
                    menuIcon={PlusCircle}
                    style={{ marginTop: -5, marginLeft: -5 }}
                />
                <Divider />

                <View style={Styles.cart_view}>
                    <View style={[Styles.cart_sl_view, Styles.center]}>
                        <Text style={Styles.cart_sl_text}>Sl. No.</Text>
                    </View>
                    <View style={[Styles.cart_name_view, Styles.center]}>
                        <Text style={Styles.cart_sl_text}>Name</Text>
                    </View>
                    <View style={[Styles.cart_quantity_view, Styles.center]}>
                        <Text style={Styles.cart_sl_text}>Quantity</Text>
                    </View>
                    <View style={[Styles.cart_amount_view, Styles.center]}>
                        <Text style={Styles.cart_sl_text}>Amount</Text>
                    </View>
                    <View style={[Styles.cart_cancle_view, Styles.center]}>
                        <TouchableOpacity onPress={() => { }}>
                            <Text style={Styles.cart_sl_text}><CancelIcon /></Text>
                        </TouchableOpacity>
                    </View>
                </View>

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



                    <View style={Styles.cart_data_view}>
                        <View style={Styles.cart_sl_data_view}>
                            <Text style={Styles.cart_sl_data_text}>1.</Text>
                        </View>
                        <View style={Styles.cart_name_data_view}>
                            <Text style={Styles.cart_sl_data_text}>Dawat Rice</Text>
                        </View>
                        <View style={Styles.cart_quantity_data_view}>
                            <TouchableOpacity onPress={() => { }}>
                                <View>
                                    <Text style={Styles.cart_sl_data_text}><MinusIcon /></Text>
                                </View>
                            </TouchableOpacity>

                            <View>
                                <Text style={Styles.cart_sl_data_text}>1</Text>
                            </View>

                            <TouchableOpacity onPress={() => { }}>
                                <View>
                                    <Text style={Styles.cart_sl_data_text}><AddIcon /></Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={Styles.cart_amount_data_view}>
                            <Text style={Styles.cart_sl_data_text}>1,100</Text>
                        </View>

                        <View style={[Styles.cart_cancle_data_view, Styles.center]}>
                            <TouchableOpacity onPress={() => { }}>
                                <Text style={Styles.cart_sl_data_text}><CancelIcon /></Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={Styles.cart_data_view_even}>
                        <View style={Styles.cart_sl_data_view_even}>
                            <Text style={Styles.cart_sl_data_text_even}>2.</Text>
                        </View>
                        <View style={Styles.cart_name_data_view_even}>
                            <Text style={Styles.cart_sl_data_text_even}>Vivo Mobile</Text>
                        </View>
                        <View style={Styles.cart_quantity_data_view_even}>
                            <TouchableOpacity onPress={() => { }}>
                                <View>
                                    <Text style={Styles.cart_sl_data_text_even}><MinusIcon /></Text>
                                </View>
                            </TouchableOpacity>

                            <View>
                                <Text style={Styles.cart_sl_data_text_even}>1</Text>
                            </View>

                            <TouchableOpacity onPress={() => { }}>
                                <View>
                                    <Text style={Styles.cart_sl_data_text_even}><AddIcon /></Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={Styles.cart_amount_data_view_even}>
                            <Text style={Styles.cart_sl_data_text_even}>11,000</Text>
                        </View>

                        <View style={[Styles.cart_cancle_data_view_even, Styles.center]}>
                            <TouchableOpacity onPress={() => { }}>
                                <Text style={Styles.cart_sl_data_text_even}><CancelIcon /></Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={Styles.cart_data_view}>
                        <View style={Styles.cart_sl_data_view}>
                            <Text style={Styles.cart_sl_data_text}>3.</Text>
                        </View>
                        <View style={Styles.cart_name_data_view}>
                            <Text style={Styles.cart_sl_data_text}>HP Laptop</Text>
                        </View>
                        <View style={Styles.cart_quantity_data_view}>
                            <TouchableOpacity onPress={() => { }}>
                                <View>
                                    <Text style={Styles.cart_sl_data_text}><MinusIcon /></Text>
                                </View>
                            </TouchableOpacity>

                            <View>
                                <Text style={Styles.cart_sl_data_text}>1</Text>
                            </View>

                            <TouchableOpacity onPress={() => { }}>
                                <View>
                                    <Text style={Styles.cart_sl_data_text}><AddIcon /></Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={Styles.cart_amount_data_view}>
                            <Text style={Styles.cart_sl_data_text}>40,000</Text>
                        </View>

                        <View style={[Styles.cart_cancle_data_view, Styles.center]}>
                            <TouchableOpacity onPress={() => { }}>
                                <Text style={Styles.cart_sl_data_text}><CancelIcon /></Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[Styles.cart_data_view_even, {borderBottomLeftRadius: 5, borderBottomRightRadius: 5}]}>
                        <View style={Styles.cart_sl_data_view_even}>
                        </View>
                        <View style={Styles.cart_name_data_view_even}>
                            <Text style={Styles.cart_sl_text}>Total</Text>
                        </View>
                        <View style={Styles.cart_quantity_data_view_even}>
                           
                        </View>

                        <View style={Styles.cart_amount_data_view_even}>
                            <Text style={Styles.cart_sl_text}>52,100</Text>
                        </View>

                        <View style={[Styles.cart_cancle_data_view_even, Styles.center]}>
                          
                        </View>
                    </View>

                    {/* <List data={my_Jobs}
                        renderItem={this.renderMyJob}
                    /> */}
                    <View style={{ height: 10, width: '100%' }} />
                </Content>
            </SafeAreaLayout>
        )
    }
}
