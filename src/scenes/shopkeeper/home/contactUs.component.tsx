import { Content } from "native-base";
import React, { Component } from "react";
import { RefreshControl, View, Text } from "react-native";
import { Divider, ThemedComponentProps } from "react-native-ui-kitten";
import { ContactUsScreenProps } from "../../../navigation/home.navigator";
import { SafeAreaLayout } from "../../../components/safe-area-layout.component";
import { Toolbar } from "../../../components/toolbar.component";
import { BackIcon } from "../../../assets/icons";

export class ContactUsScreen extends Component<ContactUsScreenProps, ThemedComponentProps & any> {
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

// ABOUT US
// We at milaan provide great deals and coupons along with price transparency in your daily transactions of purchasing goods and services. Flat discounts and no hidden charges with totally handmade profits directly to the customers. Our most efficient feature is the versatility and the transparency of the profits that we urge from the retailers and provide it directly in the hands of the customers. Our aim is to Promote Local Business and offline merchants by providing offers and discounts for local customers, so they will be eased to purchase items & products with a huge of discounts and also without any hassle at any point

// Our e-commerce originated this year to facilitate the local vendors and offline businesses so that they will get an equal platform to grow and scale up easily in this competitive environment. Our head office is located at Pine Valley Building, 1st floor, Embassy Golf Links, Off Intermediate Ring Road, Bangalore, Karnataka, 560071. Other branches are extended to several parts of India which are Gujarat, Bihar and spreading its roots all over the country.

// In this era of the 21st Century, the globe is manifested digitally. Each and every task is just a click far, why can’t we just make profits and earn from those transactional clicks of purchasing and buying either it’s a good or service. We are one of the leading organizations to facilitate you even for them who have to unveil the digitalized door with an aim of empowering all the vendors from micro to large businesses by spreading its roots globally. In 2020, with all the tough scenarios and difficulties, you can let your vision be more optimistic and can provide your dreams a true feather.

// Directors
// at milaan as said is one of the pioneered in the world of discounts and offers and arrived as the boom for the local offline merchants/vendors/shopkeepers. The company got kick-started in a year when everyone is seeking a way to generate profits in any way. In such scenarios, it came breaking all the barriers of the traders and investors they face while transacting. The milestone was laid by the Director Mr. Vishal Kumar along with the passionate investors.

// Our Services
// at milaan is having tie-ups with several goods and service providers and its main service are to execute orders from the vendors and provide it to their customers with the discounts and respective offers on the product directly in the hands of the customer with 100% transparency with an easy of buying them. In today's world, just for a little discount, we use to wait for several days and even weeks to get it from online other than our local nearby vendors. Now, we can avail of the same product from our local offline vendors along with the same discounted amount and all those offers. So, let’s have a look at several services that we avail.

// Grocery
// Medical
// Saloon & Spa
// Restaurant
// Clothing
// Footwear
// Institute
// Restaurant
// Hardware
// Electronics & Appliances
// Luggage & Bags
// Gifting
// Mobiles
// Laptops
// Hotel
// Software
// Cosmetics
// Doctors

// Our Motto
// As we are highly influenced by social sites on daily basis, so we go through daily ads of several discounts and offers. Well, here we offer you what is actually something very genuine and assured. We tat milaan generates discounts and offers from your local vendors and let you have all that benefits in your hand directly without misleading with a single penny.

// Our offices:
// Bangalore
// Koramangla 6th block,Sony signal

// Patna
// 101, Inorbit Complex, Near B.M.P 16, Khagaul Road, Patna

// Contact us:
// +91-9155316625

// www.milaan.com