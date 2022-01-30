import React, { Component } from "react";
import { View, Text, RefreshControl, Alert, AsyncStorage, ActivityIndicator } from "react-native";
import { Avatar, Divider, ListItemElement, ThemedComponentProps, List, ListItem } from "@ui-kitten/components";
import { SafeAreaLayout, SaveAreaInset } from "../../../components/safe-area-layout.component";
import { Toolbar } from "../../../components/toolbar.component";
import { AddressEditIcon, BackIcon, CancelIcon, MenuIcon, PencilIcon } from "../../../assets/icons";
import { Styles } from "../../../assets/styles";
import { ScrollView, TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { AppConstants, Color, LableText } from "../../../constants";
import { Content } from "native-base";
import Modal from "react-native-modal";
import Axios from "axios";
import { isDate } from "util";
import { AppRoute } from "../../../navigation/app-routes";
import { CustomerAddressScreenProps } from "../../../navigation/customer-navigator/customer.navigator";


export class CustomerAddressScreen extends Component<CustomerAddressScreenProps, ThemedComponentProps & any> {
    constructor(props) {
        super(props);
        this.state = {
            city: '',
            postOffice: '',
            landMark: '',
            policeStation: '',
            district: '',
            pinCode: '',
            state: '',
            country: '',
            shopId: AppConstants.SHOP_ID,
            userId: '',
            userType: '2',
            latitude: '',
            longitude: '',
            isEditable: true,
            modalVisible: false,
            allAddress: [],
            edit: false,
            name: '',
            mobileNo: '',
            street: ''
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    async componentDidMount() {
        let userDetail = await AsyncStorage.getItem('userDetail');
        let userData = JSON.parse(userDetail);
        // Alert.alert(""+userData.userId);
        // console.log("User Data",userData.userId)

        this.setState({
            userData: userData,
            userId: userData.userId,
            shopId: userData.shopId
        })
        const logedIn = await AsyncStorage.getItem('logedIn');
        if (null != logedIn && logedIn === 'true') {
            Axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/address/getby/userid/' + userData.userId,
            }).then((response) => {
                console.log("Address", response.data)
                if (null != response.data) {
                    this.setState({
                        allAddress: response.data
                    })
                }
            }, (error) => {
                Alert.alert("Server error!.")
            });
        } else {
            this.props.navigation.navigate(AppRoute.AUTH)
        }
    }

    handleSubmit() {
        const { isEditable, name, mobileNo, street, city, shopId, userId, postOffice, policeStation, district, landMark, pinCode, state, country, latitude, longitude, userType } = this.state
        // Alert.alert("Clicked"+ userId)
        console.log(userId, isEditable, shopId, city, postOffice, policeStation, district, landMark, pinCode, state, country, latitude, longitude, userType);
        if (city == null || city === '') {
            Alert.alert("Please enter city.");
        } else if (postOffice == null || postOffice === '') {
            Alert.alert("Please enter postOffice.");
        } else if (policeStation == null || policeStation === '') {
            Alert.alert("Please enter policeStation.");
        } else if (district == null || district === '') {
            Alert.alert("Please enter district.");
        } else if (landMark == null || landMark === '') {
            Alert.alert("Please enter landmark.");
        } else if (pinCode == null || pinCode === '') {
            Alert.alert("Please enter pincode.");
        } else if (state == null || state === '') {
            Alert.alert("Please enter state.");
        } else if (country == null || country === '') {
            Alert.alert("Please enter country.");
        } else if (name == null || name === '') {
            Alert.alert("Please enter name.");
        } else if (mobileNo == null || mobileNo === '') {
            Alert.alert("Please enter mobile number.");
        } else if (street == null || street === '') {
            Alert.alert("Please enter street.");
        } else {
            Axios({
                method: 'POST',
                url: AppConstants.API_BASE_URL + '/api/address/create',
                data: {
                    city: city,
                    postOffice: postOffice,
                    landmark: landMark,
                    policeStation: policeStation,
                    district: district,
                    pinCode: pinCode,
                    state: state,
                    country: country,
                    shopId: shopId,
                    userId: String(userId),
                    userType: String(userType),
                    name: name,
                    mobileNo: mobileNo,
                    street: street
                }
            }).then((response) => {
                this.toggleModal();
                this.onRefresh()
            }, (error) => {
                Alert.alert("Server error!");
            })
        }
    }

    handleEdit(index) {
        const { allAddress } = this.state;
        // Alert.alert("" + allAddress[index].landmark)
        this.setState({
            id: allAddress[index].id,
            city: allAddress[index].city,
            postOffice: allAddress[index].postOffice,
            landMark: String(allAddress[index].landmark),
            policeStation: allAddress[index].policeStation,
            district: allAddress[index].district,
            pinCode: String(allAddress[index].pinCode),
            state: allAddress[index].state,
            country: allAddress[index].country,
            name: allAddress[index].name,
            mobileNo: allAddress[index].mobileNo,
            street: allAddress[index].street,
            edit: true
        })
        this.toggleModal();
    }

    toggleModal() {
        const { modalVisible } = this.state;
        this.setState({
            modalVisible: !modalVisible
        })
    }

    handleEditSubmit() {
        const { isEditable, name, mobileNo, street, id, city, shopId, userId, postOffice, policeStation, district, landMark, pinCode, state, country, latitude, longitude, userType } = this.state
        // Alert.alert("Clicked"+ userId)
        console.log(isEditable, city, postOffice, policeStation, district, landMark, pinCode, state, country, latitude, longitude, userType);
        if (city == null || city === '') {
            Alert.alert("Please enter city.");
        } else if (postOffice == null || postOffice === '') {
            Alert.alert("Please enter postOffice.");
        } else if (policeStation == null || policeStation === '') {
            Alert.alert("Please enter policeStation.");
        } else if (district == null || district === '') {
            Alert.alert("Please enter district.");
        } else if (landMark == null || landMark === '') {
            Alert.alert("Please enter landmark.");
        } else if (pinCode == null || pinCode === '') {
            Alert.alert("Please enter pincode.");
        } else if (state == null || state === '') {
            Alert.alert("Please enter state.");
        } else if (country == null || country === '') {
            Alert.alert("Please enter country.");
        } else if (name == null || name === '') {
            Alert.alert("Please enter name.");
        } else if (mobileNo == null || mobileNo === '') {
            Alert.alert("Please enter mobile number.");
        } else if (street == null || street === '') {
            Alert.alert("Please enter street.");
        } else {
            Axios({
                method: 'PUT',
                url: AppConstants.API_BASE_URL + '/api/address/update',
                data: {
                    id: id,
                    city: city,
                    postOffice: postOffice,
                    landMark: landMark,
                    policeStation: policeStation,
                    district: district,
                    pinCode: pinCode,
                    state: state,
                    country: country,
                    shopId: shopId,
                    userId: String(userId),
                    userType: userType,
                    name: name,
                    mobileNo: mobileNo,
                    street: street
                }
            }).then((response) => {
                this.setState({
                    edit: false
                })
                this.toggleModal();
                this.onRefresh()
            }, (error) => {
                Alert.alert("Server error!");
            })
        }
    }

    handleDefault(id) {
        const { userId } = this.state;
        Axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/address/change/defaultaddress/' + userId + '/' + id,
        }).then((response) => {
            console.log("Address", response.data)
            if (null != response.data) {
                this.onRefresh();
            }
        }, (error) => {
            Alert.alert("Server error!.")
        });
    }

    onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });
    }

    renderAddress = ({ item, index }: any): ListItemElement => (
        <ListItem style={{ borderBottomColor: 'rgba(2,15,20,0.10)', borderBottomWidth: 1 }}>
            {item != null ?
                // <View>
                <View style={Styles.address_container}>
                    <TouchableOpacity style={{ padding: 5, backgroundColor: Color.COLOR, borderRadius: 10 }} onPress={() => { this.handleDefault(item.id) }}>
                        <Text style={[Styles.address_text, { alignSelf: 'center', padding: 4, color: Color.BUTTON_NAME_COLOR }]}>{item.defaultAddress ? 'Default Address' : 'Set Default'}</Text>
                    </TouchableOpacity>

                    <View style={Styles.address_edit_pen}>
                        <View>
                            <Text style={Styles.address_text}>Name :- {item.name}</Text>
                            <Text style={Styles.address_text}>Mobile No. :- {item.mobileNo}</Text>
                            <Text style={Styles.address_text}>City :- {item.city}</Text>
                            <Text style={Styles.address_text}>Street :- {item.street}</Text>
                            <Text style={Styles.address_text}>Land Mark :- {item.landmark}</Text>
                            <Text style={Styles.address_text}>Post Office :- {item.postOffice}</Text>
                            <Text style={Styles.address_text}>District :- {item.district}</Text>
                            <Text style={Styles.address_text}>State :- {item.state} </Text>
                            <Text style={Styles.address_text}>Pincode :- {item.pinCode} </Text>
                            <Text style={Styles.address_text}>Country :-{item.country}</Text>
                        </View>

                        <TouchableOpacity style={{ padding: 5 }} onPress={() => { this.handleEdit(index) }}>
                            <Text style={Styles.address_text}><AddressEditIcon fontSize={20} />
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {/* </View> */}
                </View> :
                <ActivityIndicator size='large' color='green' />}
        </ListItem>
    )

    render() {
        const { allAddress, name, mobileNo, street, edit, modalVisible, isEditable, city, postOffice, policeStation, district, landMark, pinCode, state, latitude, longitude, country } = this.state
        return (
            <SafeAreaLayout
                style={Styles.safeArea}
                insets={SaveAreaInset.TOP}>
                <Toolbar
                    title='Address'
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

                    {/* <View style={Styles.address_container}>
                        <View style={Styles.address_edit_pen}>
                            <View>
                                <Text style={Styles.address_text}>Name :- Avinash Kumar</Text>
                                <Text style={Styles.address_text}>City :- Hajipur</Text>
                                <Text style={Styles.address_text}>District :- Vaishali </Text>
                                <Text style={Styles.address_text}>Pincode :- 800350 </Text>
                            </View>

                            <TouchableOpacity style={{ padding: 5 }} onPress={() => { this.handleEdit() }}>
                                <Text style={Styles.address_text}><AddressEditIcon fontSize={20} />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View> */}

                    {null != allAddress ?
                        <List data={allAddress}
                            renderItem={this.renderAddress}
                        /> : null}

                    <View style={{ marginHorizontal: '10%' }}>
                        <TouchableOpacity style={[Styles.buttonBox, Styles.center]} onPress={() => { this.toggleModal() }}>
                            <Text style={[{ fontSize: 18, color: 'white' }]}>{LableText.ADDNEWADDRESS}</Text>
                        </TouchableOpacity>
                    </View>

                    <Modal style={Styles.modal} isVisible={modalVisible}>
                        <View style={Styles.modalHeader}>
                            <TouchableOpacity>
                                <Text onPress={() => { this.toggleModal() }}><CancelIcon fontSize={25} /></Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            <View style={Styles.user_detail}>
                                <View style={Styles.user_detail_header}>
                                    <Text style={Styles.user_detail_header_text}>{LableText.NAME}</Text>
                                </View>
                                <View style={Styles.user_detail_data}>
                                    <TextInput
                                        editable={isEditable}
                                        style={Styles.cash_pay_input}
                                        placeholder={LableText.NAME}
                                        value={name}
                                        onChangeText={(value) => { this.setState({ name: value }) }}
                                    />
                                </View>
                            </View>

                            <View style={Styles.user_detail}>
                                <View style={Styles.user_detail_header}>
                                    <Text style={Styles.user_detail_header_text}>{LableText.MOBILE}</Text>
                                </View>
                                <View style={Styles.user_detail_data}>
                                    <TextInput
                                        editable={isEditable}
                                        style={Styles.cash_pay_input}
                                        placeholder={LableText.MOBILE}
                                        value={mobileNo}
                                        onChangeText={(value) => { this.setState({ mobileNo: value }) }}
                                    />
                                </View>
                            </View>

                            <View style={Styles.user_detail}>
                                <View style={Styles.user_detail_header}>
                                    <Text style={Styles.user_detail_header_text}>{LableText.VILLAGE}</Text>
                                </View>
                                <View style={Styles.user_detail_data}>
                                    <TextInput
                                        editable={isEditable}
                                        style={Styles.cash_pay_input}
                                        placeholder={LableText.VILLAGE}
                                        value={city}
                                        onChangeText={(value) => { this.setState({ city: value }) }}
                                    />
                                </View>
                            </View>

                            <View style={Styles.user_detail}>
                                <View style={Styles.user_detail_header}>
                                    <Text style={Styles.user_detail_header_text}>{LableText.STREET}</Text>
                                </View>
                                <View style={Styles.user_detail_data}>
                                    <TextInput
                                        editable={isEditable}
                                        style={Styles.cash_pay_input}
                                        placeholder={LableText.STREET}
                                        value={street}
                                        onChangeText={(value) => { this.setState({ street: value }) }}
                                    />
                                </View>
                            </View>

                            <View style={Styles.user_detail}>
                                <View style={Styles.user_detail_header}>
                                    <Text style={Styles.user_detail_header_text}>{LableText.LAND_MARK}</Text>
                                </View>
                                <View style={Styles.user_detail_data}>
                                    <TextInput
                                        editable={isEditable}
                                        style={Styles.cash_pay_input}
                                        placeholder={LableText.LAND_MARK}
                                        value={landMark}
                                        onChangeText={(value) => { this.setState({ landMark: value }) }}
                                    />
                                </View>
                            </View>

                            <View style={Styles.user_detail}>
                                <View style={Styles.user_detail_header}>
                                    <Text style={Styles.user_detail_header_text}>{LableText.POST_OFFICE}</Text>
                                </View>
                                <View style={Styles.user_detail_data}>
                                    <TextInput
                                        editable={isEditable}
                                        style={Styles.cash_pay_input}
                                        placeholder={LableText.POST_OFFICE}
                                        value={postOffice}
                                        onChangeText={(value) => { this.setState({ postOffice: value }) }}
                                    />
                                </View>
                            </View>

                            <View style={Styles.user_detail}>
                                <View style={Styles.user_detail_header}>
                                    <Text style={Styles.user_detail_header_text}>{LableText.POLICE_STATION}</Text>
                                </View>
                                <View style={Styles.user_detail_data}>
                                    <TextInput
                                        editable={isEditable}
                                        style={Styles.cash_pay_input}
                                        placeholder={LableText.POLICE_STATION}
                                        value={policeStation}
                                        onChangeText={(value) => { this.setState({ policeStation: value }) }}
                                    />
                                </View>
                            </View>

                            <View style={Styles.user_detail}>
                                <View style={Styles.user_detail_header}>
                                    <Text style={Styles.user_detail_header_text}>{LableText.DISTRICT}</Text>
                                </View>
                                <View style={Styles.user_detail_data}>
                                    <TextInput
                                        editable={isEditable}
                                        style={Styles.cash_pay_input}
                                        placeholder={LableText.DISTRICT}
                                        value={district}
                                        onChangeText={(value) => { this.setState({ district: value }) }}
                                    />
                                </View>
                            </View>

                            <View style={Styles.user_detail}>
                                <View style={Styles.user_detail_header}>
                                    <Text style={Styles.user_detail_header_text}>{LableText.PIN_CODE}</Text>
                                </View>
                                <View style={Styles.user_detail_data}>
                                    <TextInput
                                        editable={isEditable}
                                        style={Styles.cash_pay_input}
                                        placeholder={LableText.PIN_CODE}
                                        value={pinCode}
                                        onChangeText={(value) => { this.setState({ pinCode: value }) }}
                                    />
                                </View>
                            </View>

                            <View style={Styles.user_detail}>
                                <View style={Styles.user_detail_header}>
                                    <Text style={Styles.user_detail_header_text}>{LableText.STATE}</Text>
                                </View>
                                <View style={Styles.user_detail_data}>
                                    <TextInput
                                        editable={isEditable}
                                        style={Styles.cash_pay_input}
                                        placeholder={LableText.STATE}
                                        value={state}
                                        onChangeText={(value) => { this.setState({ state: value }) }}
                                    />
                                </View>
                            </View>

                            {/* 
                            <View style={Styles.user_detail}>
                                <View style={Styles.user_detail_header}>
                                    <Text style={Styles.user_detail_header_text}>{LableText.LATITUDE}</Text>
                                </View>
                                <View style={Styles.user_detail_data}>
                                    <TextInput
                                        editable={isEditable}
                                        style={Styles.cash_pay_input}
                                        placeholder={LableText.LATITUDE}
                                        value={latitude}
                                        onChangeText={(value) => { this.setState({ latitude: value }) }}
                                    />
                                </View>
                            </View>

                            <View style={Styles.user_detail}>
                                <View style={Styles.user_detail_header}>
                                    <Text style={Styles.user_detail_header_text}>{LableText.LONGITUDE}</Text>
                                </View>
                                <View style={Styles.user_detail_data}>
                                    <TextInput
                                        editable={isEditable}
                                        style={Styles.cash_pay_input}
                                        placeholder={LableText.LONGITUDE}
                                        value={longitude}
                                        onChangeText={(value) => { this.setState({ longitude: value }) }}
                                    />
                                </View>
                            </View> */}

                            <View style={Styles.user_detail}>
                                <View style={Styles.user_detail_header}>
                                    <Text style={Styles.user_detail_header_text}>{LableText.COUNTRY}</Text>
                                </View>
                                <View style={Styles.user_detail_data}>
                                    <TextInput
                                        editable={isEditable}
                                        style={Styles.cash_pay_input}
                                        placeholder={LableText.COUNTRY}
                                        value={country}
                                        onChangeText={(value) => { this.setState({ country: value }) }}
                                    />
                                </View>
                            </View>

                            {null != edit ? edit ?
                                <View style={{ marginHorizontal: '10%' }}>
                                    <View style={[{ marginVertical: 20 }, Styles.center]} >
                                        <Text onPress={() => { this.handleEditSubmit() }} style={[Styles.buttonName, { backgroundColor: Color.COLOR, paddingHorizontal: '30%', paddingVertical: 10, borderRadius: 40 }]}>{LableText.EDIT}</Text>
                                    </View>
                                </View> :

                                <View style={{ marginHorizontal: '10%' }}>
                                    <View style={[{ marginVertical: 20 }, Styles.center]} >
                                        <Text onPress={() => { this.handleSubmit() }} style={[Styles.buttonName, { backgroundColor: Color.COLOR, paddingHorizontal: '30%', paddingVertical: 10, borderRadius: 40 }]}>{LableText.SAVE}</Text>
                                    </View>
                                </View> :
                                null
                            }
                        </ScrollView>
                    </Modal>
                    <View style={Styles.bottomSpace}></View>
                </Content>

            </SafeAreaLayout>
        );
    }

}