import React, { Component } from 'react';
import { Alert, BackHandler, Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, Divider, Layout, List, ListItem, ListItemElement, ThemedComponentProps } from '@ui-kitten/components';
import { Toolbar } from '../../../components/toolbar.component';
import {
    SafeAreaLayout,
    SaveAreaInset,
} from '../../../components/safe-area-layout.component';
import { MenuIcon, PeopleIcon, WishIcon } from '../../../assets/icons';
import { CategoryListScreenProps } from '../../../navigation/customer-navigator/shop-list.navigator';
import { AppState } from '../../../redux/store';
import { ThunkDispatch } from "redux-thunk";
import { bindActionCreators } from "redux";
import { connect, ConnectedProps } from "react-redux";
import { AppRoute } from '../../../navigation/app-routes';
import { LableText } from '../../../constants/LabelConstants';
import { AppActions } from '../../../redux/interfaces';
import { Brand } from '../../../redux/modules/brand.modules'
import { fetchBrandByShopId } from '../../../redux/action/brandAction';
import { AppConstants, Color } from '../../../constants';
import { fetchVarientByShopId } from '../../../redux/action/varientAction';
import { Varient } from '../../../redux/modules/varient.modules';
import { Styles } from '../../../assets/styles';
import { scale } from 'react-native-size-matters';
import { Measurement } from '../../../redux/modules/measurement.modules';
import { fetchMeasurementByShopId } from '../../../redux/action/measurementAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category } from '../../../redux/modules/category.modules';
import { fetchCategoryByShopId } from '../../../redux/action/categoryAction';

interface ShopPageProps {
    CategoryListScreenProps: CategoryListScreenProps
}

interface ShopPageState {
    name: String,
    allBrand: Brand[],
    refreshing: Boolean
}

type Props = CategoryListScreenProps & ThemedComponentProps & ShopPageProps & CategoryListProps

class CategoryList extends Component<Props, ShopPageState & any> {
    backHandler: any;
    constructor(props: Props) {
        super(props);
        this.state = {
            name: 'Avi',
            allBrand: [],
            refreshing: false
        }

        this.logOut = this.logOut.bind(this);
        this.backAction = this.backAction.bind(this);
        this.handleBackButton = this.handleBackButton.bind(this);
        this.handleRecall = this.handleRecall.bind(this);
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
        if (this.backHandler) {
            this.backHandler.remove();
        }
    }

    UNSAFE_componentWillMount() {
        this.props.navigation.addListener('focus', () => {
            this.backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                this.backAction
            );
        })
    }

    handleBackButton() {
        this.props.navigation.addListener('focus', () => {
            this.backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                this.backAction
            );
        })
    }

    async componentDidMount() {
        this.handleBackButton()

        this.props.navigation.addListener('blur', () => {
            if (this.backHandler) {
                this.backHandler.remove();
            }
        })

        // this.props.fetchBrandByShopId(AppConstants.SHOP_ID)
        // this.props.fetchVarientByShopId(AppConstants.SHOP_ID)
        // this.props.fetchMeasurementByShopId(AppConstants.SHOP_ID)
        this.props.fetchCategoryByShopId(AppConstants.SHOP_ID)
    }

    logOut() {
        this.props.navigation.navigate(AppRoute.AUTH)
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });
    }

    handleRecall() {
        Alert.alert("Recall")
    }

    // renderProduct = ({ item }: any): ListItemElement => { 
    //     const { allBrand, allVariant, allMeasurement } = this.props
    //     const { name, refreshing } = this.state
    //     return(
    //     <ListItem style={{ borderBottomColor: 'rgba(200, 200, 200, 1)', borderBottomWidth: scale(1) }}>
    //          <View>
    //                     {null != allMeasurement ?
    //                         <List data={allMeasurement}
    //                             horizontal={true}
    //                             showsHorizontalScrollIndicator={false}
    //                             // refreshControl={
    //                             //     <RefreshControl
    //                             //         refreshing={refreshing}
    //                             //         onRefresh={this._onRefresh.bind(this)}
    //                             //     />}
    //                             renderItem={this.renderProduct1}
    //                         // onEndReached={() => { this.handleRecall() }}
    //                         /> : null}
    //                 </View>
    //     </ListItem>
    // )}

    renderCategory = ({ item }: any): ListItemElement => (
        <ListItem style={{ borderBottomColor: 'rgba(200, 200, 200, 1)', borderBottomWidth: scale(1) }}>
            <View style={Styles.category_card}>
                <TouchableOpacity onPress={() => { this.navigateProductDetail(item.id, item.shopId) }}>
                    <View style={[Styles.cat_card_img, Styles.center]}>
                        <Image
                            resizeMethod='auto'
                            resizeMode='stretch'
                            source={{ uri: AppConstants.IMAGE_BASE_URL + '/category/' + 1 + "_" + item.shopId + '_category.png' }}
                            style={Styles.cat_card_avatar}
                        />
                    </View>
                </TouchableOpacity>
                <View style={{ position: 'absolute', width: '100%', alignItems: 'center' }}>
                    {/* <Text style={{ fontSize: scale(15), fontWeight: '600', color: '#000' }}>{item.name}</Text> */}
                </View>
            </View>
        </ListItem>
    )

    renderCategory1 = ({ item }: any): ListItemElement => (
        <ListItem style={{ borderBottomColor: 'rgba(200, 200, 200, 1)', borderBottomWidth: scale(1) }}>
            {/* <View style={Styles.category_card}> */}
            {/* <TouchableOpacity onPress={() => { this.navigateProductDetail(item.id, item.shopId) }}>
                    <View style={[Styles.cat_card_img, Styles.center]}>
                        <Avatar source={{ uri: AppConstants.IMAGE_BASE_URL + '/category/' + 2 + "_" + item.shopId + '_category.png' }} style={Styles.cat_card_avatar} />
                    </View>
                </TouchableOpacity> */}
            {/* <View style={{ position: 'absolute', width: '100%', alignItems: 'center' }}> */}
            <Text style={{ fontSize: scale(13), fontWeight: '400', borderWidth: 1, borderColor: Color.SILVER, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, color: '#000' }}>{item.name}</Text>
            {/* </View> */}
            {/* </View> */}
        </ListItem>
    )

    render() {
        const { allBrand, allVariant, allMeasurement, allCategory } = this.props
        const { name, refreshing } = this.state
        return (
            <SafeAreaLayout
                style={styles.safeArea}
                insets={SaveAreaInset.TOP}>
                <Toolbar
                    title='All Category'
                    backIcon={MenuIcon}
                    onBackPress={this.props.navigation.toggleDrawer}
                />
                <Divider />
                {/* <ScrollView> */}
                <View style={{ borderTopWidth: scale(1), borderTopColor: Color.SILVER, paddingTop: scale(10) }}>
                    <Text style={{ fontSize: scale(15), color: '#000', fontWeight: '600' }}>Category</Text>
                    {null != allCategory ?
                        <>
                            <List data={allCategory}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={this._onRefresh.bind(this)}
                                    />}
                                renderItem={this.renderCategory1}
                            />
                            <List data={allCategory}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={this._onRefresh.bind(this)}
                                    />}
                                renderItem={this.renderCategory}
                            />
                        </> : null}
                </View>

                <View style={{ marginTop: scale(10) }}>
                    <Text style={{ fontSize: scale(15), color: '#000', fontWeight: 'bold' }}>All Offers</Text>
                    {null != allCategory ?
                        <List data={allCategory}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                                />}
                            renderItem={this.renderCategory}
                        /> : null}
                </View>
                {/* </ScrollView> */}
            </SafeAreaLayout>
        );
    }
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 30,
        color: '#000',
        fontWeight: '500'
    }
});

interface LinkStateProps {
    allBrand: Brand[];
    allVariant: Varient[];
    allMeasurement: Measurement[];
    allCategory: Category[];
}

interface LinkDispatchProps {
    fetchBrandByShopId: (shopId: String) => void;
    fetchVarientByShopId: (shopId: String) => void;
    fetchCategoryByShopId: (shopId: String) => void;
    fetchMeasurementByShopId: (shopId: String) => void;
}

const mapStateToProps = (
    state: AppState,
    ownProps: ShopPageProps
): LinkStateProps => ({
    allBrand: state.brandReducers.allBrand,
    allVariant: state.varientReducers.allVarient,
    allMeasurement: state.measurementReducers.measurementData,
    allCategory: state.categoryReducers.allCategory
});

const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AppActions>,
    ownProps: ShopPageProps
): LinkDispatchProps => ({
    fetchBrandByShopId: bindActionCreators(fetchBrandByShopId, dispatch),
    fetchVarientByShopId: bindActionCreators(fetchVarientByShopId, dispatch),
    fetchMeasurementByShopId: bindActionCreators(fetchMeasurementByShopId, dispatch),
    fetchCategoryByShopId: bindActionCreators(fetchCategoryByShopId, dispatch)
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type CategoryListProps = ConnectedProps<typeof connector>;
export const CategoryListScreen = connector(CategoryList)