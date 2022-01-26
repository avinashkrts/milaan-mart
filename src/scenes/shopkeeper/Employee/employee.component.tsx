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
import { EmployeeScreenProps } from '../../../navigation/employee.navigator';
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
import { Color, LableText } from '../../../constants';
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


export class EmployeeScreen extends React.Component<EmployeeScreenProps & ThemedComponentProps, MyState & any> {
    constructor(props) {
        super(props)
        this.state = {
            employeeData: [],
            attendance: [],
            shopId: ''
        }
        this.navigateAddEmployee = this.navigateAddEmployee.bind(this);
        this.handleAbsent = this.handleAbsent.bind(this);
        this.handlePresent = this.handlePresent.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
    }
    async componentDidMount() {
        let userDetail = await AsyncStorage.getItem('userDetail');
        let userData = JSON.parse(userDetail);

        if (null != userData) {
            this.setState({
                shopId: userData.shopId
            })
        }
        Axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/employee/getemployeebyshopId/' + userData.shopId,
        }).then((response) => {
            if (null != response.data) {
                this.setState({
                    employeeData: response.data
                })
            }
        }, (error) => {
            Alert.alert("Server error!.")
        });

        Axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/lookup/getallattendance',
        }).then((response) => {
            if (null != response.data) {
                this.setState({
                    attendance: response.data
                })
            }
        }, (error) => {
            Alert.alert("Server error!.")
        });
    }

    navigateAddEmployee() {
        this.props.navigation.navigate(AppRoute.ADDEMPLOYEE);
    }


    navigateEmployeeDetails(id) {
        this.props.navigation.navigate(AppRoute.EDIT_EMPLOYEE, { employeeId: String(id) });
    }

    handleAddEmployee() {
        this.navigateAddEmployee()

    }

    handleAbsent(id) {
        // Alert.alert("Absent" + id);
        const { attendance } = this.state;
        if (null != attendance) {
            attendance.map((data, index) => {
                if (data.lookUpName === 'ABSENT') {
                    const absent = data.lookUpId
                    const shopId = "AVI123";
                    Axios({
                        method: 'POST',
                        url: AppConstants.API_BASE_URL + '/api/attendance/create',
                        data: {
                            shopId: shopId,
                            attendance: absent,
                            employeeId: id
                        }
                    }).then((response) => {
                        if (null != response.data) {
                            if (response.data.status === 'true') {
                                Alert.alert("Attendance done.")
                            } else if (response.data.status === 'false') {
                                Alert.alert("Attendance updated.")
                            }
                        }
                    }, (error) => {
                        Alert.alert("Server error!.")
                    });
                }
            })
        }
    }

    handlePresent(id) {
        // Alert.alert("Present" + id);
        const { attendance } = this.state;
        if (null != attendance) {
            attendance.map((data, index) => {
                if (data.lookUpName === 'PRESENT') {
                    const present = data.lookUpId
                    const shopId = "AVI123";
                    Axios({
                        method: 'POST',
                        url: AppConstants.API_BASE_URL + '/api/attendance/create',
                        data: {
                            shopId: shopId,
                            attendance: present,
                            employeeId: id
                        }
                    }).then((response) => {
                        if (null != response.data) {
                            if (response.data.status === 'true') {
                                Alert.alert("Attendance done.")
                            } else if (response.data.status === 'false') {
                                Alert.alert("Attendance updated.")
                            }
                        }
                    }, (error) => {
                        Alert.alert("Server error!.")
                    });
                }
            })
        }
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });
    }

    renderEmployee = ({ item }: any): ListItemElement => (
        <ListItem style={{ borderBottomColor: 'rgba(2,15,20,0.10)', borderBottomWidth: 1 }}>
            {item != null ?
                <View>
                    <View style={Styles.customer_list}>
                        <TouchableOpacity onPress={() => { this.navigateEmployeeDetails(item.id) }}>
                            <View style={[Styles.customer_list_image, Styles.center]}>
                                <Avatar source={require("../../../assets/profile.jpeg")} style={Styles.image} />
                                {/* <View>
                        <Avatar source={{ uri: AppConstants.IMAGE_BASE_URL + '/avatar/mobile.jpeg' }} style={styles.image} />
                    </View> */}
                            </View>
                        </TouchableOpacity>
                        
                        <View style={Styles.list_name}>
                            <View style={[Styles.list_price, { width: '100%' }]}>
                                <Text style={Styles.customer_list_name_text}>{item.firstName}</Text>
                                <View>
                                    <Text style={Styles.customer_list_price_text}>Rs: {item.salary}</Text>
                                </View>
                            </View>

                            <View style={Styles.list_price}>
                                <View>
                                    <Text style={Styles.customer_list_price_text}>{item.mobileNo}</Text>
                                </View>
                                <View style={[Styles.center, { alignItems: 'center', width: '35%' }]}>
                                    <Text onPress={() => { this.handlePresent(item.id) }} style={[{ backgroundColor: Color.COLOR, fontSize: 18, color: '#fff', padding: 5, borderRadius: 5, marginBottom: 3 }]}>{LableText.PRESENT}</Text>
                                    <Text onPress={() => { this.handleAbsent(item.id) }} style={[{ backgroundColor: Color.COLOR, fontSize: 18, color: '#fff', padding: 5, borderRadius: 5, marginTop: 3 }]}>{LableText.ABSENT}</Text>
                                </View>

                            </View>
                        </View>
                    </View>
                </View>

                :
                <ActivityIndicator size='large' color='green' />}

        </ListItem>
    )



    render() {
        const { employeeData } = this.state
        return (
            <SafeAreaLayout
                style={Styles.safeArea}
                insets={SaveAreaInset.TOP}>
                <Toolbar
                    title='All Employees'
                    backIcon={MenuIcon}
                    menuIcon={PlusCircle}
                    onRightPress={() => { this.handleAddEmployee() }}
                    onBackPress={this.props.navigation.openDrawer}
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
                        <Text style={Styles.searchIcon}><SearchIcon /></Text>
                        <TextInput
                            placeholder="Search"
                            style={Styles.searchInput}
                        />
                    </View>
                    {/* </Header> */}

                    <List data={employeeData}
                        renderItem={this.renderEmployee}
                    />
                    <View style={{ height: 10, width: '100%' }}></View>
                </Content>

            </SafeAreaLayout>
        )
    }

}