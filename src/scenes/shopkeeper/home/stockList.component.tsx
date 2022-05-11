import { Content, Header } from "native-base";
import React, { Component } from "react";
import { RefreshControl, View, Text, Alert, AsyncStorage } from "react-native";
import { Divider, ThemedComponentProps } from "react-native-ui-kitten";
import { StockListScreenProps } from "../../../navigation/home.navigator";
import { SafeAreaLayout } from "../../../components/safe-area-layout.component";
import { Toolbar } from "../../../components/toolbar.component";
import { BackIcon, CancelIcon, PlusCircle } from "../../../assets/icons";
import { Color, LableText, Placeholder } from '../../../constants';
import Axios from "axios";
import { Styles } from "../../../assets/styles";
import Modal from "react-native-modal";
import { AppConstants } from '../../../constants/AppConstants';
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { scale } from "react-native-size-matters";
export class StockListScreen extends Component<StockListScreenProps, ThemedComponentProps & any> {
    constructor(props) {
        super(props);
        this.state = {
            allProduct: [],
            tempAllProduct: [],
            userData: '',
            shopId: AppConstants.SHOP_ID,
            heading: [
                {
                    id: 1,
                    filter: "CURRENT",
                    name: "Current Stock"
                },
                {
                    id: 2,
                    filter: "WARNING",
                    name: "Warning"
                },
                {
                    id: 3,
                    filter: "OUT_STOCK",
                    name: "Out Of Stock"
                }
            ]
        }

        this.onRefresh = this.onRefresh.bind(this);
    }


    onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });
    }

    async componentDidMount() {
        let userDetail = await AsyncStorage.getItem('userDetail');
        let userData = JSON.parse(userDetail);
        this.setState({
            userData: userData,
            shopId: userData.shopId,
            selectedCategory: 1
        })
        Axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/product/getproductbyshopid/' + userData.shopId
        }).then((response) => {
            console.log('all product', response.data)
            this.setState({
                allProduct: response.data,
                tempAllProduct: response.data,
            })
        }, (error) => {
            Alert.alert('Wait for a moment.')
        })
    }

    handleFilter(type, id) {
        const { allProduct } = this.state;
        var data = []
        switch (type) {
            case "WARNING":
                // Alert.alert('Warning')
                if (allProduct) {
                    allProduct.map((product, index) => {
                        if (product.outOfStock > product.stock && product.stock > 0) {
                            data.push(product)
                        }
                    })
                    this.setState({
                        tempAllProduct: data,
                        selectedCategory: id
                    })
                }
                break;

            case "OUT_STOCK":
                // Alert.alert('Out')
                if (allProduct) {
                    allProduct.map((product, index) => {
                        if (product.stock <= 0) {
                            data.push(product)
                        }
                    })
                    this.setState({
                        tempAllProduct: data,
                        selectedCategory: id
                    })
                }
                break;

            case "CURRENT":
                // Alert.alert('Current')
                this.setState({
                    tempAllProduct: allProduct,
                    selectedCategory: id
                })
                break;

            default:
                this.setState({
                    tempAllProduct: allProduct,
                    selectedCategory: id
                })
                break;
        }
    }


    render() {
        const { allProduct, selectedCategory, tempAllProduct, heading } = this.state
        return (
            <SafeAreaLayout style={Styles.safeArea}>
                <Toolbar
                    title='Stock List'
                    backIcon={BackIcon}
                    onBackPress={this.props.navigation.goBack}
                    // onRightPress={() => { this.warning() }}
                    // menuIcon={PlusCircle}
                    style={{ marginTop: -5, marginLeft: -5 }}
                />
                <Divider />

                <Header style={{ backgroundColor: '#ffffff', height: 50, marginTop: 0 }}>

                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={{ marginTop: 10 }}>
                            <FlatList
                                style={{}}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                data={heading}
                                renderItem={({ item, index }) => {
                                    return (
                                        <TouchableOpacity onPress={() => { this.handleFilter(item.filter, item.id) }}>
                                            <View style={selectedCategory == item.id ? Styles.product_nav_button_selected : Styles.product_nav_button}>
                                                {/* <Text style={selectedCategory === 'all' ? Styles.product_nav_button_selected_text : Styles.product_nav_button_text}>All</Text> */}
                                                <Text style={selectedCategory == item.id ? [Styles.product_nav_button_selected_text, {fontSize: scale(15)}] : [Styles.product_nav_button_text, {fontSize: scale(15)}]}>{item.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }}
                            >
                            </FlatList>
                        </View>
                    </View>
                </Header>

                <View style={Styles.stock_main}>
                    <View style={Styles.stock_box1}>
                        <Text style={Styles.stock_text}>Id</Text>
                    </View>
                    <View style={[Styles.stock_box, {alignItems: 'center'}]}>
                        <Text style={Styles.stock_text}>Name</Text>
                    </View>
                    <View style={Styles.stock_box2}>
                        <Text style={Styles.stock_text}>Quantity</Text>
                    </View>
                </View>

                <Content style={Styles.content}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                    }
                >
                    {tempAllProduct ? tempAllProduct.slice(0).reverse().map((data, index) => {
                        return (
                            <>
                                <View style={Styles.stock_main}>
                                    <View style={Styles.stock_box1}>
                                        <Text style={Styles.stock_text1}>
                                            {data.productId}
                                        </Text>
                                    </View>

                                    <View style={Styles.stock_box}>
                                        <Text style={Styles.stock_text1}>
                                            {data.name}
                                        </Text>
                                    </View>

                                    <View style={Styles.stock_box2}>
                                        <Text style={Styles.stock_text1}>
                                            {data.stock <= 0 ? 0 : data.stock}
                                        </Text>
                                    </View>
                                </View>

                            </>
                        )

                    }) : null
                    }

                </Content>
            </SafeAreaLayout>
        );
    }

}