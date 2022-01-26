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
import { MyJobsScreenProps } from '../../navigation/Customer.navigator';
import { AppRoute } from '../../navigation/app-routes';
import { ProgressBar } from '../../components/progress-bar.component';
import { SearchIcon } from '../../assets/icons';
import { TimeLineData } from '../../data/TimeLineData.model';
import { AppConstants } from '../../constants/AppConstants';
import { Toolbar } from '../../components/toolbar.component';
import {
    SafeAreaLayout,
    SafeAreaLayoutElement,
    SaveAreaInset,
} from '../../components/safe-area-layout.component';
import { MenuIcon, ExperienceIcon, LocationIcon, PublicIcon, PencilIcon } from '../../assets/icons';
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
import { Styles } from '../../assets/styles'
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


export class MyJobsScreen extends React.Component<MyJobsScreenProps & ThemedComponentProps, MyState & any> {
    constructor(props) {
        super(props)
        this.state = {
            userId: '',
            userType: '',
            token: '',
            isFresher: false,
            isExperience: false,
            qButton: '',
            my_Jobs: [],
            salary_Type: [],
            job_Industry: [],
            min_Qualification: [],
            experience_Required: [],
            employment_Type: [],
            skill: [],
        }
        this.submitFresher = this.submitFresher.bind(this);
        this.submitExperienced = this.submitExperienced.bind(this);
        this.submitQButton = this.submitQButton.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
    }

    submitFresher() {
        this.setState(
            {
                isFresher: true,
                isExperience: false
            }
        )
    }

    submitExperienced() {
        this.setState(
            {
                isExperience: true,
                isFresher: false
            }
        )
    }

    submitQButton(e, selected) {
        // console.log(selected)
        this.setState(
            {
                qButton: selected
            }
        )
    }

    // async componentDidMount() {
    //     const value = await AsyncStorage.getItem('userDetail');
    //     if (value) {
    //         // console.log('user Details all data', value);
    //         const user = JSON.parse(value);
    //         this.setState({
    //             userType: user.userType,
    //             token: user.token,
    //             userId: user.userId,
    //         })
    //         // console.log('user data id', this.state.userId);      
    //     }

    //     axios({
    //         method: 'get',
    //         url: AppConstants.API_BASE_URL + '/api/job/getalljob',

    //     }).then((response) => {
    //         this.setState({
    //             ...this.state,
    //             my_Jobs: response.data
    //         })
    //         console.log("Profile Data", response.data);
    //     },
    //         (error) => {
    //             console.log(error);
    //             if (error) {
    //                 Alert.alert("UserId or Password is invalid");
    //             }
    //         }
    //     );

    //     axios({
    //         method: 'get',
    //         url: AppConstants.API_BASE_URL + '/api/lookup/getalllookup',
    //     }).then((response) => {
    //         this.setState({
    //             ...this.state,
    //             salary_Type: response.data.SALARY_TYPE,
    //             job_Industry: response.data.JOB_CATEGORY,
    //             min_Qualification: response.data.QUALIFICATION,
    //             experience_Required: response.data.EXPERIENCE,
    //             employment_Type: response.data.EMPLOYMENT_TYPE,
    //             skill: response.data.SKILL
    //         })
    //         // console.log("Profile Data", response.data);
    //     },
    //         (error) => {
    //             console.log(error);
    //             if (error) {
    //                 Alert.alert("UserId or Password is invalid");
    //             }
    //         }
    //     );
    // }

    handleJobSubmit(e, jobId, jobUserId) {
        const jobData = {
            jobId: jobId,
            jobUserId: jobUserId
        }
        AsyncStorage.setItem('jobId', JSON.stringify(jobData), () => {
            AsyncStorage.getItem('jobId', (err, result) => {
                console.log('Job Id is', result);
            })
            this.props.navigation.navigate(AppRoute.JOBDETAIL);
        })
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });
    }

    renderMyJob = ({ item }: any): ListItemElement => (
        <ListItem style={{ borderBottomColor: 'rgba(2,15,20,0.10)', borderBottomWidth: 10 }}>
            {item != null ?
                <View>
                    <TouchableOpacity onPress={(e) => this.handleJobSubmit(e, item.id, item.userId)}>
                        <View style={styles.card}>
                            <View style={styles.card1}>
                                <View style={styles.card1_1}></View>
                                <View style={styles.card1_2}>
                                    <Text style={styles.softwareEngineer}>{item.jobTitle}</Text>
                                </View>
                                <View style={styles.card1_3}>
                                    <Image
                                        source={require("../../assets/logo.png")}
                                        resizeMode="contain"
                                        style={styles.image}
                                    />
                                </View>
                            </View>

                            <View style={styles.card1}>
                                <View style={styles.card1_1}>
                                    <Text><ExperienceIcon /></Text>
                                </View>
                                <View style={styles.card2}>
                                    {this.state.experience_Required.map((data, index) => {
                                        if (data.lookUpId == item.experienceRequired)
                                            return (
                                                <Text style={styles.loremIpsum}>{data.lookUpLabel}</Text>
                                            )
                                    })}

                                </View>
                            </View>

                            <View style={styles.card1}>
                                <View style={styles.card1_1}>
                                    <Text><LocationIcon /></Text>
                                </View>
                                <View style={styles.card2}>
                                    <Text style={styles.bangalore}>{item.location}</Text>
                                </View>
                            </View>

                            <View style={styles.card1}>
                                <View style={styles.card1_1}>
                                    <Text><PencilIcon /></Text>
                                </View>
                                <View style={[styles.card2, { flexWrap: 'wrap', flexDirection: 'row' }]}>
                                    {this.state.skill.map((data, index) => {
                                        return (
                                            <View>
                                                {item.skill.split(',').map((data1, index) => {
                                                    if (data1 == data.lookUpId)
                                                        return (
                                                            <View style={styles.skill}>
                                                                <Text style={styles.loremIpsum2}>{data.lookUpLabel}</Text>
                                                            </View>
                                                        )
                                                })
                                                }
                                            </View>
                                        )
                                    })}

                                </View>
                            </View>

                            <View style={styles.card1}>
                                <View style={styles.card1_1}>
                                    <Text><PublicIcon /></Text>
                                </View>
                                <View style={styles.card2}>
                                    <Text style={styles.loremIpsum5}>5 Mar 2020</Text>
                                </View>
                            </View>

                            <View style={[styles.card1, { marginTop: 15 }]}>
                                <View style={styles.card1_1}></View>
                                <View style={styles.card2}>
                                    <Text style={styles.softwareEngineer}>{item.companyName}</Text>
                                </View>
                            </View>
                        </View>

                        {/* <View style={styles.card1}>
                        <View style={styles.cardInner1}>
                            <View>
                                <Avatar source={{ uri: AppConstants.IMAGE_BASE_URL + '/avatar/mobile.jpeg' }} style={styles.image} />
                            </View>
                        </View>

                        <View style={styles.cardInner2}>
                            <View style={styles.cardInner2_1}>
                                <Text style={styles.jobType}>{item.jobTitle}</Text>
                                <Text style={styles.companyName}>{item.companyName}</Text>
                                <Text style={styles.location}>{item.location}</Text>
                            </View>

                            <View style={styles.cardInner2_1}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10 }}>

                                    {this.state.salary_Type.map((data, index) => {
                                        if (data.lookUpId == item.salaryType)
                                            return (
                                                <View style={{ flexDirection: 'column' }}>
                                                    <Text style={styles.subHeading}>Salary {data.lookUpLabel}</Text>
                                                    <Text style={styles.subData}>{item.salaryFrom} - {item.salaryTo}</Text>
                                                </View>
                                            )
                                    })}

                                    {this.state.experience_Required.map((data, index) => {
                                        if (data.lookUpId == item.experienceRequired)
                                            return (
                                                <View style={{ flexDirection: 'column' }}>
                                                    <Text style={styles.subHeading}>Experience</Text>
                                                    <Text style={styles.subData}>{data.lookUpLabel}</Text>
                                                </View>
                                            )
                                    })}

                                    {this.state.employment_Type.map((data, index) => {
                                        if (data.lookUpId == item.employmentType)
                                            return (
                                                <View style={{ flexDirection: 'column' }}>
                                                    <Text style={styles.subHeading}>Employment</Text>
                                                    <Text style={styles.subData}>{data.lookUpLabel}</Text>
                                                </View>
                                            )
                                    })}


                                </View>
                                {this.state.job_Industry.map((data, index) => {
                                    if (data.lookUpId == item.jobIndustry)
                                        return (
                                            <View style={{ flexDirection: 'column' }}>
                                                <Text style={styles.subHeading}>Job Category</Text>
                                                <Text style={styles.subData}>{data.lookUpLabel}</Text>
                                            </View>
                                        )
                                })}

                                {this.state.skill.map((data, index) => {
                                    if (data.lookUpId == item.skill)
                                        return (
                                            <View>
                                                <Text style={styles.skill}>Skills: {data.lookUpLabel}</Text>
                                            </View>
                                        )
                                })}


                            </View>

                            <View style={styles.cardInner2_2}>
                                <Text style={styles.subHeading}>30 Applicants</Text>
                                <Text style={styles.subHeading}>30 days ago</Text>
                            </View>

                        </View>
                    </View> */}
                    </TouchableOpacity>

                    {/* <Footer>
                    <FooterTab style={styles.footerTab}>
                        <TouchableOpacity style={styles.applyButton} onPress={() => this.props.navigation.navigate(AppRoute.HOME)}>
                            <Text style={styles.applyButtonText}>Apply Now</Text>
                        </TouchableOpacity>
                    </FooterTab>
                </Footer> */}

                </View> :
                <ActivityIndicator size='large' color='green' />}

        </ListItem>
    )

    render() {
        const { my_Jobs } = this.state
        return (
            <SafeAreaLayout
                style={styles.safeArea}
                insets={SaveAreaInset.TOP}>
                <Toolbar
                    title='All Jobs'
                    backIcon={MenuIcon}
                    onBackPress={this.props.navigation.openDrawer}
                    style={{ marginTop: -5, marginLeft: -5 }}
                />
                <Content style={styles.content}
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


                    <List data={my_Jobs}
                        renderItem={this.renderMyJob}
                    />
                    <View style={{ height: 10, width: '100%' }}></View>
                </Content>

            </SafeAreaLayout>
        )
    }

}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },

    margin: {
        marginTop: 10
    },

    searchBox: {
        width: 375,
        height: 52,
        backgroundColor: "rgba(15,15, 15,0)",
        borderColor: "#000000",
        borderWidth: 0,
        borderStyle: "solid"
    },

    content: {
        backgroundColor: 'rgba(2,15,20,0.05)',
        padding: 10
    },

    header: {
        backgroundColor: 'rgba(2,15,20,0.05)',
        borderRadius: 1,
        marginBottom: 5
    },

    card: {
        backgroundColor: '#fff',
        padding: 5,
        // alignSelf: 'center',
        width: '100%',
        // height: 10
        marginVertical: 2
    },

    card1: {
        flexDirection: 'row',
        marginVertical: 2
    },

    card1_1: {
        // backgroundColor: 'green',
        // height: 20,
        width: '10%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    card1_2: {
        // backgroundColor: 'blue',
        // height: 20,
        width: '60%'
    },

    card1_3: {
        // backgroundColor: 'gray',        
        width: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        // marginBottom: 5
    },

    card2: {
        // backgroundColor: 'gray',
        // height: 20,
        width: '90%'
    },

    softwareEngineer: {
        color: "rgba(71,71,76,1)",
        fontSize: 18,
        fontFamily: "roboto-slab-700",
        lineHeight: 18,
        textAlign: "left"
    },

    loremIpsum2: {
        color: "rgba(71,71,76,1)",
        // position: "absolute",
        fontSize: 15,
        fontFamily: "roboto-slab-regular",
        lineHeight: 18
    },

    bangalore: {
        color: "rgba(71,71,76,1)",
        // position: "absolute",
        fontSize: 12,
        fontFamily: "roboto-slab-regular",
        lineHeight: 18
    },

    loremIpsum5: {
        color: "rgba(71,71,76,1)",
        // position: "absolute",
        fontSize: 12,
        fontFamily: "roboto-slab-regular",
        lineHeight: 18
    },

    loremIpsum: {
        color: "rgba(71,71,76,1)",
        // position: "absolute",
        fontSize: 12,
        fontFamily: "roboto-slab-regular",
        lineHeight: 18
    },

    image: {
        width: 70,
        height: 50
    },

    skill: {
        borderColor: "rgba(71,71,76,1)",
        borderWidth: 0.5,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginRight: 5,
        marginBottom: 5
    }
});


