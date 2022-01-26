import { Content } from "native-base";
import React, { Component } from "react";
import { RefreshControl, View, Text, Alert, ActivityIndicator, AsyncStorage } from "react-native";
import { Divider, ThemedComponentProps, List, ListItemElement, ListItem } from "react-native-ui-kitten";
import { NotificationScreenProps } from "../../../navigation/home.navigator";
import { SafeAreaLayout } from "../../../components/safe-area-layout.component";
import { Toolbar } from "../../../components/toolbar.component";
import { BackIcon, PlusCircle, CancelIcon, AddressEditIcon, FilterIcon } from "../../../assets/icons";
import { Styles } from "../../../assets/styles";
import Modal from "react-native-modal";
import { TouchableOpacity } from "react-native-gesture-handler";
import Axios from "axios";
import moment from "moment";
import { AppConstants } from "../../../constants";

export class NotificationScreen extends Component<NotificationScreenProps, ThemedComponentProps & any> {
    constructor(props) {
        super(props);
        this.state = {
            isFilter: false,
            notificationData: [],
            notificationDataTemp: [],
            orderNotification: '',
            rechargeNotification: '',
            withdrawNotification: '',
            transaferNotification: ''
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.handaleFilter = this.handaleFilter.bind(this);
    }
    async componentDidMount() {
        let userDetail = await AsyncStorage.getItem('userDetail');
        let logedIn = await AsyncStorage.getItem('logedIn');
        const shopId = await AsyncStorage.getItem('shopId');
        const shopName = await AsyncStorage.getItem('shopName')

        let userData = JSON.parse(userDetail);

        if (null != logedIn && logedIn === 'true') {
        Axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/notification/getby/adminid/' + userData.adminId
        }).then((response) => {
            console.log('all notification', response.data)
            this.setState({
                notificationData: response.data.reverse(),
                notificationDataTemp: response.data
            })
        }, (error) => {
            console.log('ASDF', error)
        });

        Axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/lookup/getalllookup'
        }).then((response) => {
            console.log('all lookupData', response.data.NOTIFICATION_TYPE)
            if (response.data) {
                response.data.NOTIFICATION_TYPE.map((data, index) => {
                    if (data.lookUpName === 'ORDER_NOTIFICATION') {
                        this.setState({ orderNotification: data.lookUpId })
                    } else if (data.lookUpName === 'RECHARGE_NOTIFICATION') {
                        this.setState({ rechargeNotification: data.lookUpId })
                    } else if (data.lookUpName === 'WITHDRAW_NOTIFICATION') {
                        this.setState({ withdrawNotification: data.lookUpId })
                    } else if (data.lookUpName === 'TRANSFER_NOTIFICATION') {
                        this.setState({ transaferNotification: data.lookUpId })
                    }
                })
            }
        }, (error) => {
            console.log('ASDF', error)
        });
    }

    }



    onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });

    }

    handaleFilter(notificationType) {
        this.toggelModal();
        // console.log('All data', notificationType)
        const { notificationData, notificationDataTemp } = this.state;
        var notification = []
        if (notificationDataTemp) {
            notificationDataTemp.map((data, index) => {
                if (data.notificationType == notificationType) {
                    notification.push(data)
                }
            })
        }

        console.log('ddd', notification);

        this.setState({
            notificationData: notification
        })
    }

    toggelModal() {
        const { isFilter } = this.state
        this.setState({ isFilter: !isFilter })
    }

    renderAddress = ({ item, index }: any): ListItemElement => (
        <ListItem style={{ borderBottomColor: 'rgba(2,15,20,0.10)', borderBottomWidth: 1 }}>
            {item != null ?
                <View style={Styles.notification_main}>
                    <View style={Styles.notification_text_box}>
                        <Text style={Styles.notification_text}>
                            {item.summeryDetails}
                        </Text>
                    </View>

                    <View style={Styles.notification_date_box}>
                        <Text style={Styles.notification_text_date}>
                            {moment(item.createdOn).format('DD/MM/YYYY hh:mm A')}
                        </Text>
                    </View>

                </View>
                :
                <ActivityIndicator size='large' color='green' />}
        </ListItem>
    )


    render() {
        const { isFilter, notificationData, orderNotification, rechargeNotification, withdrawNotification, transaferNotification } = this.state
        return (
            <SafeAreaLayout style={Styles.safeArea}>
                <Toolbar
                    title='Notification'
                    backIcon={BackIcon}
                    onBackPress={this.props.navigation.goBack}
                    onRightPress={() => { this.toggelModal() }}
                    menuIcon={FilterIcon}
                    style={{ marginTop: -5, marginLeft: -5 }}
                />
                <Divider />
                <Modal style={Styles.modal} isVisible={isFilter}>
                    <View style={Styles.modalHeader}>
                        <TouchableOpacity>
                            <Text onPress={() => { this.toggelModal() }}><CancelIcon fontSize={25} /></Text>
                        </TouchableOpacity>
                    </View>

                    <View style={Styles.notification_devider}></View>
                    <View style={Styles.notification_button}>
                        <Text style={Styles.notification_button_text} onPress={() => { this.handaleFilter(orderNotification) }}>
                            Order
                        </Text>
                    </View>
                    <View style={Styles.notification_devider}></View>
                    <View style={Styles.notification_button}>
                        <Text style={Styles.notification_button_text} onPress={() => { this.handaleFilter(rechargeNotification) }}>Vailidity</Text>
                    </View>
                    <View style={Styles.notification_devider}></View>
                    <View style={Styles.notification_button}>
                        <Text style={Styles.notification_button_text} onPress={() => { this.handaleFilter(withdrawNotification) }}>Withdrawl Request</Text>
                    </View>
                    <View style={Styles.notification_devider}></View>
                    <View style={Styles.notification_button}>
                        <Text style={Styles.notification_button_text} onPress={() => { this.handaleFilter(transaferNotification) }}>Payment Settlement</Text>
                    </View>
                    <View style={Styles.notification_devider}></View>
                </Modal>
                <Content style={Styles.content}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                    }
                >

                    {null != notificationData ?
                        <List data={notificationData}
                            renderItem={this.renderAddress}
                        /> : null}

                    <View style={Styles.bottomSpace} />
                </Content>
            </SafeAreaLayout>
        );
    }

}