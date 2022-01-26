import { Content } from "native-base";
import React, { Component } from "react";
import { RefreshControl, View, Text, TextInput, SafeAreaView } from "react-native";
import { Divider, ThemedComponentProps } from "react-native-ui-kitten";
import { DailyMessageScreenProps } from "../../../navigation/home.navigator";
import { SafeAreaLayout } from "../../../components/safe-area-layout.component";
import { Toolbar } from "../../../components/toolbar.component";
import { BackIcon } from "../../../assets/icons";
import { Styles } from "../../../assets/styles";
import { LableText } from "../../../constants";
import { TouchableOpacity } from "react-native-gesture-handler";


export class DailyMessageScreen extends Component<DailyMessageScreenProps, ThemedComponentProps & any> {
    constructor(props) {
        super(props);
        this.state = {}

        this.onRefresh = this.onRefresh.bind(this);
    }

    onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });
    }

    render() {
        const { isEditable } = this.state
        return (
            <SafeAreaView style={Styles.safeArea}>
                <Toolbar
                    title='Daily Message'
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
                <View>
                    <View style={Styles.daily_message_text_view}>
                        <TextInput multiline={true} numberOfLines={12} editable={isEditable} style={Styles.daily_message_input} placeholder={LableText.STATE} />
                    </View>0000000000
                </View>
                <View style={Styles.daily_message_row}>
                    <View  style={Styles.daily_message_button}>
                        <TouchableOpacity>
                            <Text style={Styles.daily_message_text}>  Save    </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={Styles.daily_message_button}>
                        <TouchableOpacity>
                            <Text style={Styles.daily_message_text}>  Cancel   </Text>
                        </TouchableOpacity>
                    </View>
                </View>




                </Content>
            </SafeAreaView>
        );
    }

}