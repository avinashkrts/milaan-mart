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
import { CustomerScreenProps } from '../../../navigation/Customer.navigator';
import { AppRoute } from '../../../navigation/app-routes';
import { ProgressBar } from '../../../components/progress-bar.component';
import { PlusCircle, SearchIcon } from '../../../assets/icons';
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
import Axios from 'axios';
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


export class CustomerScreen extends React.Component<CustomerScreenProps & ThemedComponentProps, MyState & any> {
    constructor(props) {
        super(props)
        this.state = {
            customerData: []
        }
        this.navigationAddCustomer = this.navigationAddCustomer.bind(this);
        this.handleAddCustomer = this.handleAddCustomer.bind(this);
        this.navigationEditCustomer = this.navigationEditCustomer.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
    }

    navigationAddCustomer() {
        this.props.navigation.navigate(AppRoute.ADD_CUSTOMER);
    }

    navigationEditCustomer(userId) {
        this.props.navigation.navigate(AppRoute.EDIT_CUSTOMER, { userId: userId });
    }


    // async componentDidMount() {
    //     Axios({
    //         method: 'GET',
    //         url: AppConstants.API_BASE_URL + '/api/user/getalluser/200',
    //     }).then((response) => {
    //         if (null != response.data) {
    //             this.setState({
    //                 customerData: response.data
    //             })
    //         }
    //     }, (error) => {
    //         Alert.alert("Wait for a moment.")
    //     });
    // }

    handleJobSubmit() {
        this.props.navigation.navigate(AppRoute.SHOP_CUSTOMER_DETAIL);
        // const jobData = {
        //     jobId: jobId,
        //     jobUserId: jobUserId
        // }
        // AsyncStorage.setItem('jobId', JSON.stringify(jobData), () => {
        //     AsyncStorage.getItem('jobId', (err, result) => {
        //         console.log('Job Id is', result);
        //     })
        //     this.props.navigation.navigate(AppRoute.JOBDETAIL);
        // })
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });
    }

    renderCustomer = ({ item }: any): ListItemElement => (
        <ListItem style={{ borderBottomColor: 'rgba(2,15,20,0.10)', borderBottomWidth: 1 }}>
            {item != null ?
                <View>
                    <TouchableOpacity onPress={() => { this.navigationEditCustomer(item.userId) }}>
                        <View style={Styles.customer_list}>
                            <View style={[Styles.customer_list_image, Styles.center]}>
                                <Avatar source={require("../../../assets/profile.jpeg")} style={Styles.image} />
                                {/* <View>
                                <Avatar source={{ uri: AppConstants.IMAGE_BASE_URL + '/avatar/mobile.jpeg' }} style={styles.image} />
                            </View> */}
                            </View>

                            <View style={Styles.list_name}>
                                <View style={{ width: '80%' }}>
                                    <Text style={Styles.customer_list_name_text}>{item.firstName}</Text>
                                </View>

                                <View style={Styles.list_price}>
                                    <View>
                                        <Text style={Styles.customer_list_price_text}>{item.mobileNo}</Text>
                                    </View>

                                    <View>
                                        {/* <Text style={Styles.customer_list_price_text}>Rs: 15,000</Text> */}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>

                </View> :
                <ActivityIndicator size='large' color='green' />}

        </ListItem>
    )

    handleAddCustomer() {
        this.navigationAddCustomer();
    }

    render() {
        const { customerData } = this.state
        return (
            <SafeAreaLayout
                style={Styles.safeArea}
                insets={SaveAreaInset.TOP}>
                <Toolbar
                    title='All Customers'
                    backIcon={MenuIcon}
                    // menuIcon={PlusCircle}
                    // onRightPress={() => { this.handleAddCustomer() }}
                    onBackPress={this.props.navigation.openDrawer}
                    style={{ marginTop: -5, marginLeft: -5 }}
                />
                {/* <Content style={Styles.customer_content}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                > */}
                    {/* <Header style={styles.header}> */}
                    {/* <View style={Styles.searchBox}>
                        <View style={[{ width: '10%' }, Styles.center]}>
                            <Text style={Styles.searchIcon}><SearchIcon /></Text>
                        </View>
                        <TextInput
                            placeholder="Search"
                            style={Styles.searchInput}
                        />
                    </View> */}
                    {/* </Header> */}

                    {/* <List data={customerData}
                        renderItem={this.renderCustomer}
                    /> */}
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={Styles.unavailable_text}>This facility is only for individual/paid plan.</Text>
                    </View>

                    <View style={{ height: 10, width: '100%' }}></View>
                {/* </Content> */}

            </SafeAreaLayout>
        )
    }

}