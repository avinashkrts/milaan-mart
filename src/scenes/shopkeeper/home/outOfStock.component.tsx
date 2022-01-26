import { Content } from "native-base";
import React, { Component } from "react";
import { RefreshControl, View, Text } from "react-native";
import { Divider, ThemedComponentProps } from "react-native-ui-kitten";
import { OutOfStockScreenProps } from "../../../navigation/home.navigator";
import { SafeAreaLayout } from "../../../components/safe-area-layout.component";
import { Toolbar } from "../../../components/toolbar.component";
import { BackIcon } from "../../../assets/icons";

export class OutOfStockScreen extends Component<OutOfStockScreenProps, ThemedComponentProps & any> {
    constructor(props) {
        super(props);
        this.state = {}

        // this.onRefresh = this.onRefresh.bind(this);
    }

    // async componentDidMount() {}

    // onRefresh() {
    //     this.setState({ refreshing: true });
    //     this.componentDidMount().then(() => {
    //         this.setState({ refreshing: false });
    //     });
    // }

    render() {
        return (
            <SafeAreaLayout>
                <Toolbar
                    title='My Order'
                    backIcon={BackIcon}
                    onBackPress={this.props.navigation.goBack}
                    style={{ marginTop: -5, marginLeft: -5 }}
                />
                <Divider/>
                {/* <Content style={styles.content}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                    }
                > */}
                <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>This page will be added soon.</Text>
                </View>
                {/* </Content> */}
            </SafeAreaLayout>
        );
    }

}