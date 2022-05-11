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
import { BrandListScreenProps } from '../../../navigation/stock.navigator';
import { AppRoute } from '../../../navigation/app-routes';
import { ProgressBar } from '../../../components/progress-bar.component';
import { SearchIcon, EditIcon, BackIcon, PlusCircle, CancelIcon } from '../../../assets/icons';
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


export class BrandListScreen extends React.Component<BrandListScreenProps & ThemedComponentProps, MyState & any> {
    constructor(props) {
        super(props)
        this.state = {
            brandData: []
        }
        this.navigationItemList = this.navigationItemList.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
    }


    navigationItemList(brandId) {
        AsyncStorage.setItem("brandId", JSON.stringify(brandId));
        this.props.navigation.navigate(AppRoute.ITEMLIST)
    }

    async componentDidMount() {
        const categoryId = await AsyncStorage.getItem("categoryId")
        // Alert.alert(""+categoryId);
        const data = {}
        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/brand/getallDeactivebrandbyshopid/' + categoryId,
        }).then((response) => {
            if (null != response.data) {
                this.setState({
                    brandData: response.data
                })
            }
        }, (error) => {
            Alert.alert("Wait for a moment.")
        });
    }

    handleJobSubmit() {
        // this.props.navigation.navigate(AppRoute.SHOP_CUSTOMER_DETAIL);
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

    handleDeleteCategory(id) {
        // Alert.alert(String(id));
        axios({
            method: 'DELETE',
            url: AppConstants.API_BASE_URL + '/api/brand/delete/' + id,
        }).then((response) => {
            if (null != response.data) {
                this._onRefresh();
            }
        }, (error) => {
            Alert.alert("Wait for a moment.")
        });
    }

    renderMyJob = ({ item }: any): ListItemElement => (
        <ListItem style={{ borderBottomColor: 'rgba(2,15,20,0.10)', borderBottomWidth: 1 }}>
            {item != null ?
                <View>
                    <View style={Styles.customer_list}>
                        <TouchableOpacity onPress={() => { this.navigationItemList(item.id) }}>
                            <View style={[Styles.customer_list_image, Styles.center]}>
                                <Avatar source={require("../../../assets/samsung_logo.png")} style={Styles.image} />
                                {/* <View>
                                <Avatar source={{ uri: AppConstants.IMAGE_BASE_URL + '/avatar/mobile.jpeg' }} style={styles.image} />
                            </View> */}
                            </View>
                        </TouchableOpacity>

                        <View style={Styles.itemCategoryName}>
                            <View>
                                <Text style={Styles.itemCategoryText}>{item.name}</Text>
                            </View>
                        </View>

                        {/* <View style={[Styles.itemCategoryEdit, Styles.center]}>
                            <View>
                                <Text style={Styles.itemCategoryEditIcon}><EditIcon /></Text>
                            </View>
                        </View>
                        <View style={[Styles.itemCategoryEdit, Styles.center]}>
                            <TouchableOpacity onPress={() => { this.handleDeleteCategory(item.id) }}>
                                <View>
                                    <Text style={Styles.itemCategoryEditIcon} ><CancelIcon fontSize={25} /></Text>
                                </View>
                            </TouchableOpacity>
                        </View> */}
                    </View>
                </View> :
                <ActivityIndicator size='large' color='green' />}

        </ListItem>
    )

    navigateAddBrand() {
        this.props.navigation.navigate(AppRoute.ADD_BRAND)
    }




    render() {
        const { my_Jobs, brandData } = this.state
        return (
            <SafeAreaLayout
                style={Styles.safeArea}
                insets={SaveAreaInset.TOP}>
                <Toolbar
                    title='Brand List'
                    backIcon={BackIcon}
                    onBackPress={this.props.navigation.goBack}
                    menuIcon={PlusCircle}
                    onRightPress={() => { this.navigateAddBrand() }}
                    style={{ marginTop: -5, marginLeft: -5 }}
                />
                <Content style={Styles.customer_content}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                >
                    {/* <Header style={styles.header}> */}
                    <View style={Styles.searchBox}>
                        <View style={[{ width: '10%' }, Styles.center]}>
                            <Text style={Styles.searchIcon}><SearchIcon /></Text>
                        </View>
                        <TextInput
                            placeholder="Search"
                            style={Styles.searchInput}
                        />
                    </View>
                    {/* </Header> */}

                    <List data={brandData}
                        renderItem={this.renderMyJob}
                    />
                    <View style={{ height: 10, width: '100%' }}></View>
                </Content>

            </SafeAreaLayout>
        )
    }

}