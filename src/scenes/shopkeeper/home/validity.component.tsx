import { Content } from "native-base";
import React, { Component } from "react";
import { RefreshControl, View, Text, AsyncStorage, Alert } from "react-native";
import { Divider, ThemedComponentProps } from "react-native-ui-kitten";
import { ValidityScreenProps } from "../../../navigation/home.navigator";
import { SafeAreaLayout } from "../../../components/safe-area-layout.component";
import { Toolbar } from "../../../components/toolbar.component";
import { BackIcon } from "../../../assets/icons";
import { Styles } from "../../../assets/styles";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { AppConstants } from "../../../constants";
import Axios from "axios";

export class ValidityScreen extends Component<ValidityScreenProps, ThemedComponentProps & any> {
    constructor(props) {
        super(props);
        this.state = {
            userData: []
        }

        this.onRefresh = this.onRefresh.bind(this);
    }

    async componentDidMount() {
        let userDetail = await AsyncStorage.getItem('userDetail');
        let userData = JSON.parse(userDetail);
        Axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/admin/get/' + userData.adminId
        }).then((response) => {
            if (null != response.data) {
                this.setState({
                    userData: response.data
                })
            }
        }, (error) => {
            // Alert.alert("Server error!.")
        });
    }
    onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });
    }

    render() {
        const {userData} = this.state;
        return (
            <SafeAreaLayout style={Styles.content}>
                <Toolbar
                    title='Validity'
                    backIcon={BackIcon}
                    onBackPress={this.props.navigation.goBack}
                    style={{ marginTop: -5, marginLeft: -5 }}
                />
                <Divider />
                <ScrollView style={Styles.content}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                    }
                >
                <View style={Styles.validity}>
                    <Text style={Styles.validity_text}>Validity of Your Subscription Will Expire in {userData.validity != null ? userData.validity : null} days</Text>
                </View>

                {/* <TouchableOpacity style={Styles.validity_button}>
                    <Text style={Styles.validity_text}>Recharge</Text>
                </TouchableOpacity> */}

                </ScrollView>
            </SafeAreaLayout>
        );
    }

}