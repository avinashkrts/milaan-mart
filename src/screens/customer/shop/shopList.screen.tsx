import React, { Component } from 'react';
import { Alert, BackHandler, Pressable, StyleSheet, Text } from 'react-native';
import { Divider, Layout, ThemedComponentProps } from '@ui-kitten/components';
import { Toolbar } from '../../../components/toolbar.component';
import {
    SafeAreaLayout,
    SaveAreaInset,
} from '../../../components/safe-area-layout.component';
import { MenuIcon, PeopleIcon } from '../../../assets/icons';
import { ShopListScreenProps } from '../../../navigation/customer-navigator/shop-list.navigator';
import { AppState } from '../../../redux/store';
import { ThunkDispatch } from "redux-thunk";
import { bindActionCreators } from "redux";
import { connect, ConnectedProps } from "react-redux";
import { AppRoute } from '../../../navigation/app-routes';
import { LableText } from '../../../constants/LabelConstants';
import { AppActions } from '../../../redux/interfaces';
import { Brand } from '../../../redux/modules/brand.modules'
import { fetchBrandByShopId } from '../../../redux/action/brandAction';

interface ShopPageProps {
    ShopListScreenProps: ShopListScreenProps
}

interface ShopPageState {
    name: String,
    allBrand: Brand[]
}

type Props = ShopListScreenProps & ThemedComponentProps & ShopPageProps & CategoryListProps

class ShopList extends Component<Props, ShopPageState> {
    backHandler: any;
    constructor(props: Props) {
        super(props);
        this.state = {
            name: 'Avi',
            allBrand: []
        }

        this.logOut = this.logOut.bind(this);
        this.backAction = this.backAction.bind(this);
        this.handleBackButton = this.handleBackButton.bind(this);
        this.props.navigation.addListener('focus', () => {
            this.backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                this.backAction
            );
        })
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

    componentWillMount() {
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
    }

    logOut() {
        this.props.navigation.navigate(AppRoute.AUTH)
    }

    render() {
        const { allBrand } = this.props
        const { name } = this.state
        return (
            <SafeAreaLayout
                style={styles.safeArea}
                insets={SaveAreaInset.TOP}>
                <Toolbar
                    title='React Navigation Ex'
                    backIcon={MenuIcon}
                    onBackPress={this.props.navigation.toggleDrawer}
                />
                <Divider />
                <Pressable onPress={this.logOut}>
                    <PeopleIcon />
                    <Text>Log In</Text>
                </Pressable>
                <Layout style={styles.container}>
                    {allBrand ? allBrand.map((data: any, index: any) => {
                        return (
                            <Text key={index} style={styles.text}>{name} {data.name}</Text>
                        )
                    }) : null}
                </Layout>

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
}

interface LinkDispatchProps {
    fetchBrandByShopId: (shopId: String) => void;
}

const mapStateToProps = (
    state: AppState,
    ownProps: ShopPageProps
): LinkStateProps => ({
    allBrand: state.brandReducers.allBrand
});

const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AppActions>,
    ownProps: ShopPageProps
): LinkDispatchProps => ({
    fetchBrandByShopId: bindActionCreators(fetchBrandByShopId, dispatch)
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type CategoryListProps = ConnectedProps<typeof connector>;
export const ShopListScreen = connector(ShopList)