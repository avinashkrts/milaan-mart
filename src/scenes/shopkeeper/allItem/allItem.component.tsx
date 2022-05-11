import React, { Component } from "react";
import { View, Text, RefreshControl, AsyncStorage, Alert, StyleSheet, Keyboard } from "react-native";
import { Avatar, List, Divider, ListItemElement, ThemedComponentProps } from "react-native-ui-kitten";
import { AllItemScreenProps } from "../../../navigation/shopKeeperNavigator/allItem.Navigator";
import { SafeAreaLayout, SaveAreaInset } from "../../../components/safe-area-layout.component";
import { Toolbar } from "../../../components/toolbar.component";
import { BackIcon, CartIcon, MenuIcon, CancelIcon, SearchIcon, WishIcon, PlusCircle } from "../../../assets/icons";
import { FlatList, ScrollView, TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { AppConstants, Color, LableText } from "../../../constants";
import { Styles } from "../../../assets/styles";
import { Content, Header, Item, ListItem } from "native-base";
import axios from 'axios';
import Animated from "react-native-reanimated";
import { AppRoute } from "../../../navigation/app-routes";
import { BackHandler } from "react-native";
import { scale } from "react-native-size-matters";
import { changeProductData } from "../../../redux/action/productActions";
import { connect, ConnectedProps } from "react-redux";
import { createFilter } from "react-native-search-filter";

const KEYS_TO_FILTERS = ['name'];

type Props = AllItemScreenProps & ThemedComponentProps & CombinedProductProps

class AllItem extends React.Component<Props, any> {
    backHandler: any;
    constructor(props) {
        super(props);
        this.state = {
            allProduct: [],
            allCategory: [],
            allBrand: [],
            shopId: AppConstants.SHOP_ID,
            refreshing: false,
            selectedCategory: '',
            selectedBrand: '',
            allMeasurement: [],
            search: '',
            searchVisible1: false,
            searchTerm: '',
            allData: [
                {
                    url: '/api/lookup/getallmeasurementtype',
                    method: 'GET',
                    variable: 'allMeasurement',
                }],
            scrollY: new Animated.Value(0),
        }

        this.onRefresh = this.onRefresh.bind(this);
        this.handleAddProduct = this.handleAddProduct.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    backAction = () => {
        Alert.alert("Alert!", LableText.CUS_HOME_PAGE, [
            {
                text: "Cancel",
                onPress: () => null,
                style: "cancel"
            },
            {
                text: "YES", onPress: () => {
                    BackHandler.exitApp()
                }

            }
        ]);
        return true;
    };

    componentWillUnmount() {
        this.backHandler.remove();
    }

    async componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            this.backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                this.backAction
            );
        })

        this.props.navigation.addListener('blur', () => {
            this.backHandler.remove();
        })
        const { allData } = this.state;
        const value = await AsyncStorage.getItem("userDetail")
        const user = JSON.parse(value);

        console.log("productId", user.shopId)
        this.setState({
            shopId: user.shopId
        })

        if (value) {
            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/product/getproductbyshopid/' + user.shopId,
            }).then((response) => {
                if (null != response.data) {
                    this.props.changeProductData(response.data)
                    this.setState({
                        allProduct: response.data,
                    })
                }
            }, (error) => {
                // Alert.alert("Wait for a moment.")
            });

            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/category/getcategoryforuserbyshopid/' + user.shopId,
            }).then((response) => {
                if (null != response.data) {
                    this.setState({
                        allCategory: response.data,
                        selectedCategory: 'all'
                    })
                }
            }, (error) => {
                Alert.alert("Wait for a moment.")
            });

            axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + '/api/brand/getbrandforuserbyshopid/' + user.shopId,
            }).then((response) => {
                if (null != response.data) {
                    this.setState({
                        allBrand: response.data,
                        selectedBrand: 'all'
                    })
                }
            }, (error) => {
                Alert.alert("Wait for a moment.")
            });
        } else {
            this.props.navigation.navigate(AppRoute.AUTH)
        }

        allData.map((data, index) => {
            // console.log(allData)
            axios({
                method: data.method,
                url: AppConstants.API_BASE_URL + data.url,
            }).then((response) => {
                if (data.variable === 'allMeasurement') {
                    console.log(data.variable, response.data)
                    this.setState({
                        allMeasurement: response.data,
                    })
                }
            }, (error) => {
                Alert.alert("Wait for a moment..")
            });
        })
    }

    addToCart(id) {
        axios({
            method: 'GET',
            url: '',
        }).then((response) => {

        }, (error) => {

        });
    }

    selectCategory(id) {
        const { shopId } = this.state;
        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/brand/getallDeactivebrandbyshopid/' + id,
        }).then((response) => {
            if (null != response.data) {
                this.setState({
                    allBrand: response.data,
                    selectedCategory: id
                })
            }
        }, (error) => {
            Alert.alert("Wait for a moment.")
        });

        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/product/getproductbyshopidandcategory/' + shopId + '/' + id,
        }).then((response) => {
            if (null != response.data) {
                this.setState({
                    allProduct: response.data,
                })
            }
        }, (error) => {
            Alert.alert("Wait for a moment.")
        });
        // this.setState({ selectedCategory: id })
    }

    selectBrand(id, brandName) {
        const { shopId } = this.state
        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/product/getproduct/shopid/brand/' + shopId + '/' + id,
        }).then((response) => {
            if (null != response.data) {
                this.setState({
                    allProduct: response.data,
                    selectedBrand: id
                })
            }
        }, (error) => {
            Alert.alert("Wait for a moment.")
        });
        // this.setState({ selectedBrand: id })
    }

    handleSearch() {
        const { search } = this.state;
        axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/product/search/' + search,
        }).then((response) => {
            this.setState({ allProduct: response.data })
        }, (error) => {
            Alert.alert("Wait for a moment..")
        });
    }

    navigateToCart() {
        this.props.navigation.navigate(AppRoute.CUSTOMER_CART)
    }

    onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });
    }

    navigateProductDetail(id, shopId) {
        // Alert.alert(String(id))
        this.props.navigation.navigate(AppRoute.PRODUCT_DETAIL, { productId: String(id), shopId: String(shopId) })
    }

    handleAddProduct() {
        this.props.navigation.navigate(AppRoute.ADD_PRODUCT_NAVIGATOR)
    }

    renderProduct = ({ item }: any): ListItemElement => (
        <ListItem style={{ borderBottomColor: 'rgba(200, 200, 200, 1)', borderBottomWidth: scale(1) }}>
            <View style={Styles.product_list_main}>
                <View style={Styles.product_list_img}>
                    <TouchableOpacity onPress={() => { this.navigateProductDetail(item.productId, item.shopId) }}>
                        <View style={[Styles.all_Item_Image_2, Styles.center]}>
                            <Avatar source={{ uri: AppConstants.IMAGE_BASE_URL + '/product/' + item.productId + '_' + 1 + "_" + item.shopId + '_product.png' }} style={Styles.product_avatar} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={Styles.product_list_detail}>
                    <View style={Styles.all_Item_List1}>
                        <View style={Styles.all_Item_Detail}>
                            <View style={{ backgroundColor: '#fff', paddingHorizontal: 0 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    {null != this.state.allBrand ? this.state.allBrand.map((brand, index) => {
                                        if (brand.id == item.brand) {
                                            return (
                                                <View style={{ width: '80%', flexWrap: 'wrap', flexDirection: 'row' }}>
                                                    <Text style={{ color: '#000', marginTop: scale(5), fontSize: scale(14) }}>{item.name} {`\n`}{brand.name}</Text>
                                                </View>
                                            );
                                        }
                                    }) : null}

                                </View>
                                {null != this.state.allMeasurement ? this.state.allMeasurement.map((brand, index) => {
                                    if (brand.lookUpId == item.measurement) {
                                        return (
                                            <>
                                                <Text style={{ color: Color.COLOR_ITEM_NAME, marginTop: 5 }}>{item.quantity} {brand.lookUpName}</Text>
                                            </>
                                        );
                                    }
                                }) : null}
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginVertical: 5 }}>
                                    <Text style={{ color: '#000', fontSize: scale(14) }}>Rs. {item.price}</Text>
                                    {item.offerActiveInd ?
                                        <Text style={{ color: Color.COLOR, fontSize: 20, textDecorationLine: 'line-through' }}>{item.oldPrice}</Text>
                                        : null
                                    }
                                </View>
                                {null != item.offerActiveInd ? item.offerActiveInd ?

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                        <Text style={{ color: Color.COLOR }}>{item.offerPercent} % off</Text>
                                        <Text style={{ color: Color.COLOR }}>{item.offerActiveInd && item.offerTo ? item.offerTo.substr(8, 2) + "/" + item.offerTo.substr(5, 2) + "/" + item.offerTo.substr(0, 4) : null}</Text>
                                    </View> :
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                        <Text style={{ color: Color.COLOR, marginTop: 2.5 }}></Text>
                                        <Text style={{ color: Color.COLOR }}></Text>
                                    </View> : null
                                }

                            </View>
                            <View style={[{ backgroundColor: Color.COLOR, marginVertical: 10, alignSelf: 'center', paddingVertical: 5, borderRadius: 5, width: '90%' }, Styles.center]}>
                                <Text style={{ color: Color.BUTTON_NAME_COLOR }}>Available {item.stock}</Text>
                            </View>
                        </View>
                    </View>
                </View>

            </View>
        </ListItem>
    )

    toggleModal2() {
        this.setState({
            searchVisible1: false
        })
    }

    productSearch(filteredProduct) {
        this.setState({
            allProduct: filteredProduct,
            searchVisible1: false
        })
        Keyboard.dismiss();
    }

    clearSearch() {
        this.setState({
            searchTerm: '',
            allProduct: this.props.productData
        })
    }

    search(index) {
        var product = [index]
        this.setState({
            allProduct: product,
            searchVisible1: false,
            searchTerm: index.name
        })
    }

    searchUpdated(term) {
        this.setState({ searchTerm: term })
    }
    render() {
        const productList = this.props.productData
        const { allProduct, refreshing, searchVisible1, searchTerm, shopId, search, allMeasurement, allCategory, allBrand, selectedBrand, selectedCategory } = this.state;

        const filteredProduct = productList.length > 0 ? productList.filter(createFilter(searchTerm, KEYS_TO_FILTERS)) : null
        return (
            <SafeAreaLayout
                style={Styles.safeArea}
                insets={SaveAreaInset.TOP}>

                <Toolbar
                    title='Product'
                    backIcon={MenuIcon}
                    onBackPress={this.props.navigation.openDrawer}
                    onRightPress={() => { this.handleAddProduct() }}
                    menuIcon={PlusCircle}
                    style={{ marginTop: -5, marginLeft: -5 }}
                />

                <Divider />
                <Divider />
                <Divider />
                {/* <Header style={styles.header}> */}
                <View style={[Styles.searchBox, { marginBottom: 0 }]}>
                    <TextInput
                        placeholder="Search"
                        style={[Styles.searchInput_new]}
                        value={searchTerm}
                        onChangeText={(term) => { this.searchUpdated(term) }}
                        onFocus={() => { this.setState({ searchVisible1: true }) }}
                        onBlur={() => { this.setState({ searchVisible1: false }) }}
                    />

                    <View style={[{ width: '10%', }, Styles.center]}>
                        {productList.length != allProduct.length || searchTerm != '' ?
                            <TouchableOpacity onPress={() => { this.clearSearch() }}>
                                <Text style={[Styles.searchIcon, { width: scale(30), height: scale(30) }]}><CancelIcon fontSize={scale(25)} /></Text>
                            </TouchableOpacity> : null}
                    </View>
                    <View style={[{ width: '10%', }, Styles.center]}>
                        <TouchableOpacity onPress={() => { this.productSearch(filteredProduct) }}>
                            <Text style={Styles.searchIcon}><SearchIcon /></Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Divider />
                {searchVisible1 ?
                    <>
                        <ScrollView>
                            {filteredProduct.map((product, i) => {
                                return (
                                    <TouchableOpacity onPress={() => { this.search(product) }} key={product.id} style={styles.emailItem}>
                                        <View>
                                            <Text>{product.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </> :
                    <>

                        <Header style={{ backgroundColor: '#ffffff', height: 50, marginTop: 0 }}>

                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                <View style={{ marginTop: 10 }}>
                                    <FlatList
                                        style={{}}
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        data={allCategory}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <TouchableOpacity onPress={() => { this.selectCategory(item.id) }}>
                                                    <View style={selectedCategory == item.id ? Styles.product_nav_button_selected : Styles.product_nav_button}>
                                                        <Text style={selectedCategory == item.id ? Styles.product_nav_button_selected_text : Styles.product_nav_button_text}>{item.name}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        }}
                                    >
                                    </FlatList>
                                </View>
                            </View>
                        </Header>
                        <Divider />
                        <Header style={{ backgroundColor: '#ffffff', height: 50, marginTop: 0 }}>

                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                <View style={{ marginTop: 10 }}>
                                    <FlatList
                                        style={{}}
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        data={allBrand}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <TouchableOpacity onPress={() => { this.selectBrand(item.id, item.name) }}>
                                                    <View style={selectedBrand == item.id ? Styles.product_nav_button_selected : Styles.product_nav_button}>
                                                        <Text style={selectedBrand == item.id ? Styles.product_nav_button_selected_text : Styles.product_nav_button_text}>{item.name}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        }}
                                    >
                                    </FlatList>
                                </View>
                            </View>
                        </Header>
                        {null != allProduct ?
                            <List data={allProduct}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={this.onRefresh.bind(this)}
                                    />}
                                renderItem={this.renderProduct}
                            /> : null}
                    </>}
                <View style={{ height: 10, width: '100%' }} />

            </SafeAreaLayout>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-start'
    },
    emailItem: {
        borderBottomWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.3)',
        padding: 10
    },
    emailSubject: {
        color: 'rgba(0,0,0,0.5)'
    },
    searchInput: {
        padding: 10,
        borderColor: '#CCC',
        borderWidth: 1
    }
});

function mapStateToProps(state) {
    return ({
        productData: state.tokenReducer.productData
    })
}

function mapDispatchToProps(dispatch) {
    return ({
        changeProductData: (data) => {
            dispatch(changeProductData(data))
        }
    })
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type CombinedProductProps = ConnectedProps<typeof connector>;

export const AllItemScreen = connector(AllItem)