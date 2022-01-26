import React, { Component } from 'react';
import { StyleSheet, Alert, TouchableOpacity, RefreshControl, Dimensions, FlatList } from 'react-native';
import {
  Divider,
  Layout,
  Text,
  Avatar,
  Button,
  Input,
  ListItem,
  ListItemElement,
  List,
  Icon
} from 'react-native-ui-kitten';
import { ProfileScreenProps } from '../../navigation/home.navigator';
import { Toolbar } from '../../components/toolbar.component';
import {
  SafeAreaLayout,
  SafeAreaLayoutElement,
  SaveAreaInset,
} from '../../components/safe-area-layout.component';
import { AppConstants } from '../../constants/AppConstants';
import { Separator, Container, Content, View, Footer, FooterTab, Form, Picker, Thumbnail } from 'native-base';
import Axios from 'axios';
import { LabelConstants, LableText } from '../../constants/LabelConstants';
import { AsyncStorage } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SearchIcon, HomeIcon, BackIcon } from '../../assets/icons';
// import VideoPlayer from 'react-native-video-player';
import Share from 'react-native-share';
import { MoreScreen } from '../home/more.component'
import { ArrowDownward, ArrowUpward } from '../../assets/icons';
import RouterComponent from '../components/Router'
import { Styles } from '../../assets/styles';
import { TextInput } from 'react-native-gesture-handler';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

type Mystate = {

}
// const prop = (props: AboutScreenProps):

export class ProfileScreen extends Component<ProfileScreenProps & SafeAreaLayoutElement & any, Mystate & any> {
  constructor(props) {
    super(props)
    this.state = {


    }
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
      <SafeAreaLayout
        style={Styles.safeArea}
        insets={SaveAreaInset.TOP}>
        <Toolbar
          title=''
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
          <View style={[Styles.profile, Styles.center]}>
            <View style={Styles.profile_image}>
              <Avatar source={require("../../assets/profile.jpeg")} style={Styles.profile_avatar} />
            </View>
          </View>

          <Divider />

          <View>
            <View style={Styles.user_detail}>
              <View style={Styles.user_detail_header}>
                <Text style={Styles.user_detail_header_text}>{LableText.FIRST_NAME}</Text>
              </View>
              <View style={Styles.user_detail_data}>
                <TextInput editable={isEditable} style={Styles.cash_pay_input} placeholder={LableText.FIRST_NAME} />
              </View>
            </View>

            <View style={Styles.user_detail}>
              <View style={Styles.user_detail_header}>
                <Text style={Styles.user_detail_header_text}>{LableText.LAST_NAME}</Text>
              </View>
              <View style={Styles.user_detail_data}>
                <TextInput editable={isEditable} style={Styles.cash_pay_input} placeholder={LableText.LAST_NAME} />
              </View>
            </View>

            <View style={Styles.user_detail}>
              <View style={Styles.user_detail_header}>
                <Text style={Styles.user_detail_header_text}>{LableText.SHOPNAME}</Text>
              </View>
              <View style={Styles.user_detail_data}>
                <TextInput editable={isEditable} style={Styles.cash_pay_input} placeholder={LableText.SHOPNAME} />
              </View>
            </View>

            <View style={Styles.user_detail}>
              <View style={Styles.user_detail_header}>
                <Text style={Styles.user_detail_header_text}>{LableText.GST}</Text>
              </View>
              <View style={Styles.user_detail_data}>
                <TextInput editable={isEditable} style={Styles.cash_pay_input} placeholder={LableText.GST} />
              </View>
            </View>


            <View style={Styles.user_detail}>
              <View style={Styles.user_detail_header}>
                <Text style={Styles.user_detail_header_text}>{LableText.PHONE}</Text>
              </View>
              <View style={Styles.user_detail_data}>
                <TextInput editable={isEditable} style={Styles.cash_pay_input} placeholder={LableText.PHONE} />
              </View>
            </View>

            <View style={Styles.user_detail}>
              <View style={Styles.user_detail_header}>
                <Text style={Styles.user_detail_header_text}>{LableText.EMAIL_ID}</Text>
              </View>
              <View style={Styles.user_detail_data}>
                <TextInput editable={isEditable} style={Styles.cash_pay_input} placeholder={LableText.EMAIL_ID} />
              </View>
            </View>

            <View style={Styles.user_detail}>
              <View style={Styles.user_detail_header}>
                <Text style={Styles.user_detail_header_text}>{LableText.STREET}</Text>
              </View>
              <View style={Styles.user_detail_data}>
                <TextInput editable={isEditable} style={Styles.cash_pay_input} placeholder={LableText.STREET} />
              </View>
            </View>

            <View style={Styles.user_detail}>
              <View style={Styles.user_detail_header}>
                <Text style={Styles.user_detail_header_text}>{LableText.LAND_MARK}</Text>
              </View>
              <View style={Styles.user_detail_data}>
                <TextInput editable={isEditable} style={Styles.cash_pay_input} placeholder={LableText.LAND_MARK} />
              </View>
            </View>

            <View style={Styles.user_detail}>
              <View style={Styles.user_detail_header}>
                <Text style={Styles.user_detail_header_text}>{LableText.VILLAGE}</Text>
              </View>
              <View style={Styles.user_detail_data}>
                <TextInput editable={isEditable} style={Styles.cash_pay_input} placeholder={LableText.VILLAGE} />
              </View>
            </View>

            <View style={Styles.user_detail}>
              <View style={Styles.user_detail_header}>
                <Text style={Styles.user_detail_header_text}>{LableText.POST_OFFICE}</Text>
              </View>
              <View style={Styles.user_detail_data}>
                <TextInput editable={isEditable} style={Styles.cash_pay_input} placeholder={LableText.POST_OFFICE} />
              </View>
            </View>

            <View style={Styles.user_detail}>
              <View style={Styles.user_detail_header}>
                <Text style={Styles.user_detail_header_text}>{LableText.POLICE_STATION}</Text>
              </View>
              <View style={Styles.user_detail_data}>
                <TextInput editable={isEditable} style={Styles.cash_pay_input} placeholder={LableText.POLICE_STATION} />
              </View>
            </View>

            <View style={Styles.user_detail}>
              <View style={Styles.user_detail_header}>
                <Text style={Styles.user_detail_header_text}>{LableText.DISTRICT}</Text>
              </View>
              <View style={Styles.user_detail_data}>
                <TextInput editable={isEditable} style={Styles.cash_pay_input} placeholder={LableText.DISTRICT} />
              </View>
            </View>

            <View style={Styles.user_detail}>
              <View style={Styles.user_detail_header}>
                <Text style={Styles.user_detail_header_text}>{LableText.PIN_CODE}</Text>
              </View>
              <View style={Styles.user_detail_data}>
                <TextInput editable={isEditable} style={Styles.cash_pay_input} placeholder={LableText.PIN_CODE} />
              </View>
            </View>

            <View style={Styles.user_detail}>
              <View style={Styles.user_detail_header}>
                <Text style={Styles.user_detail_header_text}>{LableText.STATE}</Text>
              </View>
              <View style={Styles.user_detail_data}>
                <TextInput editable={isEditable} style={Styles.cash_pay_input} placeholder={LableText.STATE} />
              </View>
            </View>






          </View>

          <View style={Styles.user_detail}>
              <View style={Styles.user_detail_header}>
                <Text style={Styles.user_detail_header_text}>{LableText.BANK_ACCOUNT}</Text>
              </View>
              <View style={Styles.user_detail_data}>
              <View style={Styles.bank_row}>
              <Text>Bank Name:- </Text>
                <TextInput editable={isEditable} style={Styles.bank_text} placeholder={LableText.BANK_NAME} />
               </View>
               <View style={Styles.bank_row}>
               <Text>Bank Account Number:- </Text>
                              <TextInput editable={isEditable} style={Styles.bank_text} placeholder={LableText.BANK_ACCOUNT_NUMBER} />
           </View>
           <View style={Styles.bank_row}>
           <Text>Bank Account Name:- </Text>
                <TextInput editable={isEditable} style={Styles.bank_text} placeholder={LableText.BANK_ACCOUNT_NAME} />
           </View>
           <View style={Styles.bank_row}>
           <Text>Bank IFSC Code:- </Text>
                            <TextInput editable={isEditable} style={Styles.bank_text} placeholder={LableText.BANK_IFSC_CODE} />
              </View>
              </View>
            </View>








          <View style={{ marginHorizontal: '10%' }}>
            <TouchableOpacity style={[Styles.buttonBox, Styles.center]} onPress={() => { }}>
              <Text style={Styles.buttonName}>{LableText.EDIT}</Text>
            </TouchableOpacity>
          </View>


          <View style={{ marginHorizontal: '10%' }}>
            <TouchableOpacity style={[Styles.buttonBox, Styles.center]} onPress={() => { }}>
              <Text style={Styles.buttonName}>{LableText.SAVE}</Text>
            </TouchableOpacity>
          </View>


          <View style={Styles.bottomSpace}></View>
        </Content>

      </SafeAreaLayout>
    );
  }
}


const shareSingleImage = async (qArticle, e) => {
  const shareOptions = {
    title: 'Share file',
    url: AppConstants.IMAGE_BASE_URL + '/timeline/' + qArticle,
    failOnCancel: false,
  };

  try {
    const ShareResponse = await Share.open(shareOptions);
    // setResult(JSON.stringify(ShareResponse, null, 2));
  } catch (error) {
    console.log('Error =>', error);
    // setResult('error: '.concat(getErrorString(error)));

  }
};