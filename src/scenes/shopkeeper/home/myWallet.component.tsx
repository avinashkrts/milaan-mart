import { Content } from "native-base";
import React, { Component } from "react";
import { RefreshControl, View, Text, SafeAreaView, ActivityIndicator, AsyncStorage, BackHandler, Alert } from "react-native";
import {
    Divider, ThemedComponentProps,
    List, ListItem, ListItemElement
} from "react-native-ui-kitten";
import { MyWalletScreenProps } from "../../../navigation/home.navigator";
import { SafeAreaLayout } from "../../../components/safe-area-layout.component";
import { Toolbar } from "../../../components/toolbar.component";
import { AddIcon, BackIcon, CancelIcon, MenuIcon, MinusIcon, RupeeIcon } from "../../../assets/icons";
import { Styles } from "../../../assets/styles";
import { LabelConstants } from "../../../constants/LabelConstants";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import axios from "axios";
import moment from "moment";
import { AppConstants, LableText } from "../../../constants";
import { scale } from "react-native-size-matters";
import { AppRoute } from "../../../navigation/app-routes";
export class MyWalletScreen extends Component<MyWalletScreenProps, ThemedComponentProps & any> {
    constructor(props) {
        super(props);
        this.state = {
            transactionData: [],
            transactionType: [],
            userData: []
        }

        this.onRefresh = this.onRefresh.bind(this);
    }

    async componentDidMount() {
        let userDetail = await AsyncStorage.getItem('userDetail');
        let userData = JSON.parse(userDetail);

        if (null != userData) {
            axios(AppConstants.API_BASE_URL + "/api/transaction/gettransactionbyshopid/" + userData.shopId) //change it
                .then(res => this.setState({ transactionData: res.data }))
            axios(AppConstants.API_BASE_URL + "/api/lookup/getalllookup")
                .then(res => this.setState({ transactionType: res.data.PAYMENT_MODE }))
                .catch(error => console.log(error))
            axios(AppConstants.API_BASE_URL + "/api/admin/get/" + userData.adminId)
                .then(res => this.setState({ userData: res.data }))
                .catch(error => console.log(error))
        }

    }

    onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });
    }

    renderCustomer = ({ item, index }: any): ListItemElement => (
        <ListItem style={{ borderBottomColor: 'rgba(2,15,20,0.10)', borderBottomWidth: 1 }}>
            {item != null ?

                <View>
                    {null != this.state.transactionType ? this.state.transactionType.map((tdata, index) => {
                        if (tdata.lookUpId == item.paymentMode) {
                            if (tdata.lookUpName === 'ONLINE_PAYMENT' || tdata.lookUpName === "REFUND") {
                                return (
                                    <View style={Styles.wallet_row_1}>
                                        <View style={Styles.wallet_column_1}>

                                            <Text style={Styles.text_design}> {index + 1}</Text>

                                        </View>
                                        <View style={Styles.wallet_column_2}>

                                            <Text style={Styles.text_design}> {moment(item.createdOn).format('DD-MM-YYYY')}</Text>

                                        </View>
                                        <View style={Styles.wallet_column_3}>

                                            <Text style={Styles.text_design}>{item.transactionId}</Text>

                                        </View>


                                        <View style={Styles.wallet_column_4}>
                                            {null != this.state.transactionType ? this.state.transactionType.map((tdata, index) => {
                                                if (tdata.lookUpId == item.paymentMode) {
                                                    if (tdata.lookUpName === 'REFUND') {
                                                        return <Text style={Styles.text_design_red}>{item.amount}</Text>
                                                    } else {
                                                        return <Text style={Styles.text_design}>--</Text>
                                                    }
                                                }

                                            }) :
                                                <Text style={Styles.text_design}>--</Text>
                                            }

                                        </View>
                                        <View style={Styles.wallet_column_4}>
                                            {null != this.state.transactionType ? this.state.transactionType.map((tdata, index) => {
                                                if (tdata.lookUpId == item.paymentMode) {
                                                    if (tdata.lookUpName === 'ONLINE_PAYMENT') {
                                                        return <Text style={Styles.text_design_green}>{item.amount}</Text>
                                                    } else {
                                                        return <Text style={Styles.text_design}>--</Text>
                                                    }
                                                }

                                            }) :
                                                <Text style={Styles.text_design}>--</Text>
                                            }

                                        </View>
                                    </View>
                                )
                            }
                        }
                    }) : null}
                </View> :
                <ActivityIndicator size='large' color='green' />}

        </ListItem>
    )


    render() {
        const { transactionData, userData } = this.state;
        return (
            <SafeAreaLayout>
                <Toolbar
                    title='Wallet  '
                    backIcon={BackIcon}
                    onBackPress={this.props.navigation.goBack}
                    menuIcon={MenuIcon}
                    onRightPress={() => { }} //define a function
                    style={{ marginTop: -5, marginLeft: -5 }}
                />
                <Divider />
                {/* <Content style={styles.content}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                    }
                > */}

                <ScrollView style={Styles.content}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh.bind(this)}
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

                    {/* <List data={my_Jobs}
                        renderItem={this.renderMyJob}
                    /> */}
                    <View style={{ height: 10, width: '100%' }} />
                    {/* </Content> */}
                    <View style={Styles.wallet_main}>
                        <View style={Styles.validity}>
                            <Text style={Styles.validity_text}>Your available wallet balance is <RupeeIcon fontSize={scale(14)} /> {userData.wallet != null ? userData.wallet : null} </Text>
                        </View>
                        {/* <View style={Styles.wallet_row}>
                        <View style={Styles.wallet_column_1}>

                            <Text style={Styles.wallet_design1}>{LabelConstants.wallet_serial_number}</Text>

                        </View>
                        <View style={Styles.wallet_column_2}>

                            <Text style={Styles.wallet_design1}>{LabelConstants.wallet_date}</Text>

                        </View>
                        <View style={Styles.wallet_column_3}>

                            <Text style={Styles.wallet_design1}>{LabelConstants.wallet_transactionid}</Text>

                        </View>

                        <View style={Styles.wallet_column_4}>

                            <Text style={Styles.head_design}>{LabelConstants.wallet_debit}</Text>

                        </View>
                        <View style={Styles.wallet_column_5}>

                            <Text style={Styles.head_design}>{LabelConstants.wallet_credit}</Text>

                        </View>
                    </View>



                    <List data={transactionData}
                        renderItem={this.renderCustomer}
                    />


                    <View style={Styles.wallet_row}>
                        <Text style={Styles.wallet_bottom_text}>Total :- </Text>

                        <Text style={Styles.wallet_paid}>--</Text>
                        <Text style={Styles.wallet_due}>{userData.wallet}</Text>
                    </View> */}
                    </View>






                </ScrollView>
            </SafeAreaLayout>
        );
    }

}