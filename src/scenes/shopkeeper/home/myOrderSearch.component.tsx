import React, { Component } from "react";
import { View, Text, AsyncStorage, RefreshControl, Alert } from "react-native";
import { Divider, ThemedComponentProps } from "react-native-ui-kitten";
import { SafeAreaLayout } from "../../../components/safe-area-layout.component";
import { Toolbar } from "../../../components/toolbar.component";
import { BackIcon, MenuIcon, RupeeIcon } from "../../../assets/icons";
import { Styles } from "../../../assets/styles";
import { AppConstants, LabelConstants } from "../../../constants";
import axios from "axios";
import moment from "moment";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { CustomerWalletScreenProps } from "../../../navigation/customer-navigator/customerHome.navigator";
import { AppRoute } from "../../../navigation/app-routes";
import { scale } from "react-native-size-matters";
import { StackActions } from "@react-navigation/routers";
import { MyOrderSearchScreenProps } from "../../../navigation/shopKeeperNavigator/orderSearch.navigator";

export class MyOrderSearchScreen extends Component<MyOrderSearchScreenProps, ThemedComponentProps & any> {
    constructor(props) {
        super(props);
        this.state = {
            productId: ''

        }

        // this.onRefresh = this.onRefresh.bind(this);
    }




    navigateProductDetail() {
        const { productId } = this.state;
        if (productId === '' || productId.length <= 0) {
            Alert.alert('Enter Order ID')
        } else {
            const pushAction = StackActions.push(AppRoute.MY_ORDER_SEARCH_DETAIL, { cartId: String(productId) });
            this.props.navigation.dispatch(pushAction)
        }
    }

    // onRefresh() {
    //     this.setState({ refreshing: true });
    //     this.componentDidMount().then(() => {
    //         this.setState({ refreshing: false });
    //     });
    // }

    render() {
        const { productId } = this.state;
        let total = 0
        let slNo = 0
        return (
            <SafeAreaLayout style={Styles.safeArea}>
                <Toolbar
                    title='Search Order'
                    backIcon={BackIcon}
                    onBackPress={this.props.navigation.goBack}
                    style={{ marginTop: -5, marginLeft: -5 }}
                />
                <Divider />
                <ScrollView style={Styles.content}
                // refreshControl={
                //     <RefreshControl
                //         refreshing={this.state.refreshing}
                //         onRefresh={this.onRefresh.bind(this)}
                //     />
                // }
                >
                    {/* <View style={Styles.wallet_main}> */}
                    <View style={Styles.user_detail_header}>
                        <Text style={Styles.user_detail_header_text}>Order ID</Text>
                    </View>
                    <View style={Styles.user_detail_data}>
                        <TextInput
                            style={Styles.cash_pay_input}
                            placeholder='Enter Order ID'
                            value={productId}
                            onChangeText={(value) => { this.setState({ productId: value }) }}
                        />
                    </View>
                    <View style={[Styles.center, { marginTop: 30 }]}>
                        <Text onPress={() => { this.navigateProductDetail() }} style={[{ backgroundColor: '#501B1D', fontSize: 18, color: '#fff', padding: 10, borderRadius: 5, marginTop: 3 }]}>Submit</Text>
                    </View>
                    {/* </View> */}
                </ScrollView>
            </SafeAreaLayout>
        );
    }
}




















