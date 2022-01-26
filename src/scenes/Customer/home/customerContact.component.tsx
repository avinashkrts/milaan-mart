import React, { Component } from "react";
import { View, Text, RefreshControl } from "react-native";
import { Avatar, Divider, ThemedComponentProps } from "react-native-ui-kitten";
import { CustomerContactScreenProps } from "../../../navigation/customer-navigator/customerHome.navigator";
import { SafeAreaLayout, SaveAreaInset } from "../../../components/safe-area-layout.component";
import { Toolbar } from "../../../components/toolbar.component";
import { BackIcon, MenuIcon } from "../../../assets/icons";
import { Styles } from "../../../assets/styles";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { LableText } from "../../../constants";
import { Content } from "native-base";

export class CustomerContactScreen extends Component<CustomerContactScreenProps, ThemedComponentProps & any> {
    constructor(props) {
        super(props);
        this.state = {}

        // this.onRefresh = this.onRefresh.bind(this);
    }

    // onRefresh() {
    //     this.setState({ refreshing: true });
    //     this.componentDidMount().then(() => {
    //         this.setState({ refreshing: false });
    //     });
    // }

    render() {
        const { isEditable } = this.state
        return (
            <SafeAreaLayout
                style={Styles.safeArea}
                insets={SaveAreaInset.TOP}>
                <Toolbar
                    title='Contact Us'
                    backIcon={BackIcon}
                    onBackPress={this.props.navigation.goBack}
                    style={{ marginTop: -5, marginLeft: -5 }}
                />
                <Divider />
                <Content style={Styles.content}>

                    <Divider />
                    <View style={Styles.about_main}>
                        <Text style={Styles.about_text}>About Us</Text>
                    </View>

                    <View style={Styles.about_proprety}>
                        <Text style={Styles.about_contact}>Contact Us</Text>
                        <Text style={Styles.about_content}>
                            Our offices:{`\n`}
                            Bangalore{`\n`}
                            Koramangla 6th block,Sony signal{`\n`}{`\n`}

                            Patna{`\n`}
                            101, Inorbit Complex, Near B.M.P 16, Khagaul Road, Patna{`\n`}{`\n`}


                            Helpline Number +91-7294926271{`\n`}
                            customersupport@milaan.com{`\n`}


                        </Text>
                    </View>
                    <View style={Styles.about_proprety}>
                        {/* <Text style={Styles.about_us}>address</Text> */}
                        <Text style={Styles.about_content}>

                            We at milaan provide great deals and coupons along with price transparency
                            in your daily transactions of purchasing goods and services. Flat discounts and no hidden charges
                            with totally handmade profits directly to the customers. Our most efficient feature is the versatility
                            and the transparency of the profits that we urge from the retailers and provide it directly in the
                            hands of the customers. Our aim is to Promote Local Business and offline merchants by providing
                            offers and discounts for local customers, so they will be eased to purchase items & products with
                            a huge of discounts and also without any hassle at any point</Text>
                    </View>

                    <View style={Styles.about_proprety}>
                        <Text style={Styles.about_contact}>Our Services</Text>
                        <Text style={Styles.about_content}>

                            at milaan is having tie-ups with several goods and service providers and its main service are to execute
                            orders from the vendors and provide it to their customers with the discounts and respective offers on the product directly
                            in the hands of the customer with 100% transparency with an easy of buying them. In today's world, just for a little discount,
                            we use to wait for several days and even weeks to get it from online other than our local nearby vendors. Now, we can avail of
                            the same product from our local offline vendors along with the same discounted amount and all those offers. So, let’s have a look
                            at several services that we avail.{`\n`}{`\n`}{`\n`}
                            Grocery{`\n`}
                            Medical{`\n`}
                            Saloon & Spa{`\n`}
                            Restaurant{`\n`}
                            Clothing{`\n`}
                            Footwear{`\n`}
                            Institute{`\n`}
                            Restaurant{`\n`}
                            Hardware{`\n`}
                            Electronics & Appliances{`\n`}
                            Luggage & Bags{`\n`}
                            Gifting{`\n`}
                            Mobiles{`\n`}
                            Laptops{`\n`}
                            Hotel{`\n`}
                            Software{`\n`}
                            Cosmetics{`\n`}
                            Doctors
                        </Text>
                    </View>

                    <View style={Styles.about_proprety}>
                        <Text style={Styles.about_contact}>Our Motto</Text>
                        <Text style={Styles.about_content}>

                            As we are highly influenced by social sites on daily basis,
                            so we go through daily ads of several discounts and offers.
                            Well, here we offer you what is actually something very
                            genuine and assured. We tat milaan generates discounts
                            and offers from your local vendors and let you have all that
                            benefits in your hand directly without misleading with
                            a single penny.
                        </Text>
                    </View>

                    <View style={Styles.about_proprety}>
                        <Text style={Styles.about_contact}> PRIVACY POLICY</Text>
                        <Text style={Styles.about_content}>

                            Trust and Belief are the pillars of the milaan and include trusting us to do the right thing with your information. There are some values that guide us as we provide several discounts and offers on our products and services. These values should help you better understand how we think about your information and privacy. This Privacy Policy discloses the privacy practices for milaan. It applies solely to information collected by the company’s Website.
                            {`\n`}
                            Basic eligibility to access the services by milaan
                            By accessing this website we assume you accept these terms and conditions in full. Do not continue to use the milaan website i.e. https://milaan.com, if you do not accept all of the terms and conditions stated on this page. You hereby represent and warrant to the Company that you are at least eighteen (18) years of age or above and are capable of entering, performing, and adhering to these Terms and that you agree to be bound by the following terms and conditions. While individuals under the age of 18 may utilize the Service of the site, they shall do so only with the involvement & guidance of their parents. You are responsible for checking Terms of Use regularly to remain in compliance with these terms. Your use of the website and any amendments to the Terms of Use shall constitute your acceptance of these terms and you also agree to be bound by any such changes/revisions/amendments.
                            {`\n`}
                            Your information belongs to you
                            We carefully analyze that what is the information we need to provide our company, and we usually try to limit the information that we collect to only what we really need. When possible, we delete the information when we no longer need it. When building and improving our products, our team works so closely with our privacy and security teams to build with privacy in mind. In all of this work, our guiding principle is that your information belongs to you, and we aim to only use your information to your benefit.
                            {`\n`}
                            We protect your information from others
                            If a third party requests your personal information, we will refuse to share it unless you give us permission or we are legally required. When we are legally required to share your personal information, we will tell you in advance, unless we are legally forbidden.
                            {`\n`}
                            How we use cookies
                            We employ the use of cookies. By using the milaan website you consent to the use of cookies in accordance with the milaan privacy policy. Most modern day interactive websites use cookies to enable us to retrieve user details for each visit. Cookies are used in some areas of our site to enable the functionality of this area and ease of use for those people visiting. Some of our affiliate/advertising partners may also use cookies.{`\n`}{`\n`}
                            {`\n`}
                            You must not:{`\n`}
                            Republish material from https://milaan.com{`\n`}
                            Sell, rent, or sub-license material from https://milaan.com{`\n`}
                            Reproduce, duplicate or copy material from https://milaan.com
                        </Text>
                    </View>

                    <View style={Styles.about_proprety}>
                        <Text style={Styles.about_contact}>Terms & Conditions</Text>
                        <Text style={Styles.about_content}>
                            This document is an electronic record in terms of Information Technology Act, 2000 and rules there under as applicable and the amended provisions pertaining to electronic records in various statutes as amended by the Information Technology Act, 2000. This electronic record is generated by a computer system and does not require any physical or digital signatures.
                            {`\n`}
                            This document is published in accordance with the provisions of Rule 3 (1) of the Information Technology (Intermediaries guidelines) Rules, 2011 that require publishing the rules and regulations, privacy policy, and Terms of Use for access or usage of domain name [www.milaan.com, including the related mobile site and mobile application (hereinafter referred to as “Platform”)
                            {`\n`}
                            The Platform is owned by Milaan IT Projects Private Limited Group a company with its registered office at 101, Inorbit Complex , Near BMP 16, Phulwari khagaul Road Patna, 801505 (hereinafter referred to as "Milaan IT Projects Private Limited").
                            {`\n`}
                            Your use of the Platform and services and tools are governed by the following terms and conditions ("Terms of Use") as applicable to the Platform including the applicable policies which are incorporated herein by way of reference. If You transact on the Platform, You shall be subject to the policies that are applicable to the Platform for such transactions. By mere use of the Platform, You shall be contracting with Milaan IT Projects Private Limited  and these terms and conditions including the policies constitute Your binding obligations, with Milaan IT Projects Private Limited.
                            {`\n`}
                            For the purpose of these Terms of Use, wherever the context so requires "You" or "User" shall mean any natural or legal person who has agreed to become a buyer on the Platform by providing Registration Data while registering on the Platform as Registered User using the computer systems. Milaan IT Projects Private Limited allows the User to surf the Platform without registering on the Platform. The term "We", "Us", "Our" shall mean Milaan IT Projects Private Limited .
                            {`\n`}
                            When You use any of the services provided by Us through the Platform, including but not limited to, (e.g. Product Reviews, Seller Reviews), You will be subject to the rules, guidelines, policies, terms, and conditions applicable to such service, and they shall be deemed to be incorporated into this Terms of Use and shall be considered as part and parcel of this Terms of Use. We reserve the right, at Our sole discretion, to change, modify, add or remove portions of these Terms of Use, at any time without any prior written notice to You. It is Your responsibility to review these Terms of Use periodically for updates/changes. Your continued use of the Platform following the posting of changes will mean that You accept and agree to the revisions. As long as You comply with these Terms of Use, We grant You a personal, non-exclusive, non-transferable, limited privilege to enter and use the Platform.
                            {`\n`}
                            ACCESSING, BROWSING, OR OTHERWISE USING THE SITE INDICATES YOUR AGREEMENT TO ALL THE TERMS AND CONDITIONS UNDER THESE TERMS OF USE, SO PLEASE READ THE TERMS OF USE CAREFULLY BEFORE PROCEEDING. By impliedly or expressly accepting these Terms of Use, You also accept and agree to be bound by Milaan IT Projects Private Limited Policies (including but not limited to Privacy Policy available at Privacy) as amended from time to time.
                            {`\n`}
                            Basic eligibility to access the services by Milaan IT Projects Private Limited
                            By accessing this website we assume you accept these terms and conditions in full. Do not continue to use the Milaan IT Projects Private Limited website i.e. https://www.milaan.com, if you do not accept all of the terms and conditions stated on this page. You hereby represent and warrant to the Company that you are at least eighteen (18) years of age or above and are capable of entering, performing, and adhering to these Terms and that you agree to be bound by the following terms and conditions. While individuals under the age of 18 may utilize the Service of the site, they shall do so only with the involvement & guidance of their parents. You are responsible for checking Terms of Use regularly to remain in compliance with these terms. Your use of the website and any amendments to the Terms of Use shall constitute your acceptance of these terms and you also agree to be bound by any such changes/revisions/amendments.
                            {`\n`}
                            Your information belongs to you
                            We carefully analyze that what is the information we need to provide our company, and we usually try to limit the information that we collect to only what we really need. When possible, we delete the information when we no longer need it. When building and improving our products, our team works so closely with our privacy and security teams to build with privacy in mind. In all of this work, our guiding principle is that your information belongs to you, and we aim to only use your information to your benefit.
                            {`\n`}
                            Your Account and Registration Obligations
                            If You use the Platform, You shall be responsible for maintaining the confidentiality of your Display Name and Password and You shall be responsible for all activities that occur under your Display Name and Password. You agree that if You provide any information that is untrue, inaccurate, not current, or incomplete or We have reasonable grounds to suspect that such information is untrue, inaccurate, not current or incomplete, or not in accordance with this Terms of Use, We shall have the right to indefinitely suspend or terminate or block access of your membership on the Platform and refuse to provide You with access to the Platform.
                            {`\n`}
                            Your mobile phone number and/or e-mail address are treated as Your primary identifier on the Platform. It is your responsibility to ensure that Your mobile phone number and your email address are up to date on the Platform at all times. You agree to notify Us promptly if your mobile phone number or e-mail address changes by updating the same on the Platform through a one-time password verification.
                            {`\n`}
                            You agree that Milaan IT Projects Private Limited shall not be liable or responsible for the activities or consequences of use or misuse of any information that occurs under your Account in cases, including, where You have failed to update Your revised mobile phone number and/or e-mail address on the Website Platform.
                            {`\n`}
                            Communications
                            When You use the Platform or send emails or other data, information or communication to us, You agree and understand that You are communicating with Us through electronic records and You consent to receive communications via electronic records from Us periodically and as and when required. We may communicate with you by email or by such other mode of communication, electronic or otherwise.
                            {`\n`}
                            Charges
                            Membership on the Platform is free for buyers. Milaan IT Projects Private Limited does not charge any fee for browsing and buying on the Platform. Whereas sellers have to pay our monthly/halfyearly/yearly charges including GST. Sellers  have to maintain security fee of Rs 500 in wallet and charges could be automatically deducted from sellers mobile application/web application wallet if there is sufficient balance in their wallet. services will be postponed if sellers validity expires or any misconduct/illegal happens  by sellers or Buyers side.  Milaan IT Projects Private Limited charges 3% on per transaction either online payment or cash on delivery.   Milaan IT Projects Private Limited reserves the right to change its Fee Policy from time to time. In particular, Milaan IT Projects Private Limited may at its sole discretion introduce new services and modify some or all of the existing services offered on the Platform. In such an event Milaan IT Projects Private Limited reserves the right to introduce fees for the new services offered or amend/introduce fees for existing services, as the case may be. Changes to the Fee Policy shall be posted on the Platform and such changes shall automatically become effective immediately after they are posted on the Platform. Unless otherwise stated, all fees shall be quoted in Indian Rupees. You shall be solely responsible for compliance with all applicable laws including those in India for making payments to Milaan IT Projects Private Limited .
                            We also offer premium services and premium discounts. To utilize the premium services we charge a small amount to buyers. Every premium plan comes with validity. To retain the premium service you may choose to manually or auto-renew your services.
                            {`\n`}
                            Contacting the seller
                            At Milaan IT Projects Private Limited we are committed towards ensuring that disputes between sellers and buyers are settled amicably by way of the above dispute resolution mechanisms and procedures. However, in the event that a buyer wishes to contact the seller, he/ she may proceed to do so by accessing the seller-related information made available by the sellers on their business listing page. Alternatively, the buyers may also reach out to customer support at 7294926271 or access mail us at customersupport@milaan.com.
                        </Text>
                    </View>                   
                </Content>

            </SafeAreaLayout>
        );
    }

}
