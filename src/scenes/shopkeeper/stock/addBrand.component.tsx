import React from 'react';
import {
    ListRenderItemInfo, View, StyleSheet, TouchableOpacity,
    ActivityIndicator, Image, Alert, FlatList, ScrollView, RefreshControl, TextInput, Modal
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
import { AddBrandScreenProps } from '../../../navigation/stock.navigator';
import { AppRoute } from '../../../navigation/app-routes';
import { ProgressBar } from '../../../components/progress-bar.component';
import { SearchIcon, EditIcon, BackIcon } from '../../../assets/icons';
import { TimeLineData } from '../../../data/TimeLineData.model';
import { AppConstants } from '../../../constants/AppConstants';
import { Toolbar } from '../../../components/toolbar.component';
import {
    SafeAreaLayout,
    SafeAreaLayoutElement,
    SaveAreaInset,
} from '../../../components/safe-area-layout.component';
import { MenuIcon, CameraIcon, PlusCircle, CancelIcon, LocationIcon, PublicIcon, PencilIcon } from '../../../assets/icons';
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
import { Placeholder, LableText, Color } from '../../../constants';
// import ImagePicker from 'react-native-image-picker';
import Axios from 'axios';

const allTodos: TimeLineData[] = [
    TimeLineData.getAllTimelineData()
];

const options = {
    title: 'Select a Photo',
    takePhoto: 'Take Photo',
    chooseFromLibraryButtonTitle: 'Choose from gallery',
    quality: 0.7,
    maxWidth: 500,
    maxHeight: 550,
    type: 'image'
}

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

export class AddBrandScreen extends React.Component<AddBrandScreenProps & ThemedComponentProps, MyState & any> {
    constructor(props) {
        super(props)
        this.state = {
            imageSource: '',
            file: null,
            name: '',
            title: '',
            category: '',
            shopId: 'AVI123'
        }
        this._onRefresh = this._onRefresh.bind(this);
        this.handleAddCategory = this.handleAddCategory.bind(this);
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
    //                 category: '',
    //                 categoryData: [],
    //                 imageSource: source,
    //                 file: file,
    //                 isVisible: true
    //             });
    //         }
    //     });
    // }


    async componentDidMount() {
       
        const value = await AsyncStorage.getItem('userDetail');
        if (value) {
            const user = JSON.parse(value);
            // Alert.alert(user.shopId)

            this.setState({
                shopId: user.shopId,
            })
            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/category/getcategoryforuserbyshopid/' + user.shopId,
            }).then((response) => {
                if (null != response.data) {
                    this.setState({
                        categoryData: response.data
                    })
                }
            }, (error) => {
                Alert.alert("Server error!.")
            });           
        }
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });
    }

    handleAddBrand() {
        const { name, category, shopId } = this.state;

        if (name == null || name === '') {
            Alert.alert("Please enter brand name.");
        } else if (category == null || category === '') {
            Alert.alert("Please select category.");
        } else {
            console.log(name.toUpperCase(), name.replace(" ", "_"),)
            const catName = name.toUpperCase();
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
                        Alert.alert("Category created.")
                        this.props.navigation.goBack()
                    } else if (response.data.status === 'false') {
                        Alert.alert("Category allready exists.")
                    }
                }
            }, (error) => {
                Alert.alert("Server error!.")
            });
        }
    }

    handleAddCategory(value) {
        if (value === 'add') {
            this.props.navigation.navigate(AppRoute.ADD_CATEGORY)
        } else {
            this.setState({
                category: value
            })
        }
    }   

    render() {
        const { categoryData, category, name, imageSource } = this.state
        return (
            <SafeAreaLayout
                style={Styles.safeArea}
                insets={SaveAreaInset.TOP}>
                <Toolbar
                    title='Add'
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
                    <View style={Styles.center}>
                        <View style={[Styles.center, { flex: 1 }]}>
                            {/* <View style={[Styles.profile, Styles.center]}>
                                <View style={Styles.categoryImage}>
                                    <View>
                                        <TouchableOpacity onPress={() => { this.selectPhoto() }}>
                                            <View style={Styles.ImgBgOne} />
                                            <View style={Styles.ImgBgTwo} />
                                            <Avatar source={imageSource} style={Styles.profile_avatar} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View> */}

                            <View style={[Styles.inputTextView, { width: '90%' }]}>
                                <TextInput
                                    style={[Styles.inputText, { width: '90%' }]}
                                    placeholder={Placeholder.NAME}
                                    value={name}
                                    onChangeText={(value) => { this.setState({ name: value }) }}
                                />
                            </View>

                            <View style={[{ width: '90%' }]}>
                                {/* <View style={Styles.inputTextView}>
                                    <Text style={Styles.user_detail_header_text}>{LableText.CATEGORY}</Text>
                                </View> */}
                                <View style={[Styles.inputTextView, { width: '90%' }]}>
                                    <Picker
                                        note
                                        mode="dropdown"
                                        style={[Styles.center, { marginVertical: -8, color: Color.COLOR, width: '100%' }]}
                                        selectedValue={category}
                                        onValueChange={(value) => { this.handleAddCategory(value) }}
                                    >
                                        <Picker.Item label="Select category" value="" />
                                        {null != categoryData ? categoryData.map((data, index) => {
                                            return (
                                                <Picker.Item label={data.name} value={data.id} />
                                            )
                                        }) : null}
                                        <Picker.Item label="Add category" value="add" />

                                        {/* <Picker.Item label="Mobile" value="1" />
                                        <Picker.Item label="Laptop" value="2" /> */}
                                    </Picker>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <View style={[Styles.center, { marginHorizontal: '10%', width: '100%' }]}>
                                    <TouchableOpacity style={[Styles.buttonBox, Styles.center, { width: '50%' }]} onPress={() => { this.handleAddBrand() }}>
                                        <Text style={Styles.buttonName}>{LableText.ADD}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Content>
            </SafeAreaLayout>
        )
    }

}