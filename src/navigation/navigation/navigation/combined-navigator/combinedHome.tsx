import React from 'react';
import {
    CompositeNavigationProp,
    RouteProp,
} from '@react-navigation/core';
import {
    createDrawerNavigator,
    DrawerContentComponentProps,
    DrawerNavigationProp,
} from '@react-navigation/drawer';
import {
    BottomTabBarProps,
    BottomTabNavigationProp,
    createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { AppRoute } from '../app-routes';
import {
    HomeDrawer,
    HomeTabBar,
} from '../../../scenes/home';
import {
    HomeIcon,
    CandidateIcon,
    ProfileIcon,
    LogoutIcon,
    PostJobIcon,
    CameraIcon,
    AddressIcon,
    WalletIcon,
    CartNavIcon,
    NotificationIcon,
    HelpIcon,
    MyOrderIcon,
} from '../../../assets/icons';
import { AuthNavigator } from '../auth.navigator';
import { WishListNavigator } from '../customer-navigator/wishList.navigator';
import { BillBookNavigator } from '../customer-navigator/billBook.navigator';
import { OffersNavigator } from '../customer-navigator/offers.navigator';
import { CustomerAddressScreen, CustomerCartScreen, CustomerContactScreen, CustomerNotificationScreen, CustomerOrderScreen, CustomerProfileScreen } from '../../../scenes/Customer/home';
import { LogoutScreen } from '../../../scenes/auth';
import { CartScreen } from '../../../scenes/Customer/allProduct/cart.component';
import { CustomerOrderNavigator } from '../customer-navigator/customerOrder.navigator';
import { CombinedProductNavigator } from './combinedAllProduct.navigator';
import { CombinedWishListNavigator } from './combinedWishList.navigator';
import { CombinedOfferNavigator } from './combinedOffers.navigator';

type CombinedHomeDrawerNavigatorParams = {
    [AppRoute.COMBINED_HOME]: undefined;
    [AppRoute.COMBINED_ORDER_NAV]: undefined;
    [AppRoute.CUSTOMER_ADDRESS]: undefined;
    [AppRoute.CUSTOMER_CART]: undefined;
    [AppRoute.CUSTOMER_CONTACT]: undefined;
    [AppRoute.CUSTOMER_NOTIFICATION]: undefined;
    [AppRoute.CUSTOMER_ORDER]: undefined;
    [AppRoute.CUSTOMER_WALLET]: undefined;
    [AppRoute.WALLET]: undefined;
    [AppRoute.IMAGEUPLOAD]: undefined;
    [AppRoute.LOGOUT]: undefined;
    [AppRoute.CUSTOMER_PROFILE]: undefined;
    [AppRoute.TRANSACTIONHISTORY]: undefined;
    [AppRoute.MORE]: undefined;
    [AppRoute.SETTING]: undefined;
    [AppRoute.INFORMATION]: undefined;
}

type CombinedHomeBottomTabsNavigatorParams = {
    [AppRoute.COMBINED_ALL_PRODUCT]: undefined;
    [AppRoute.COMBINED_ALL_SHOP]: undefined;
    [AppRoute.COMBINED_BILL_BOOK]: undefined;
    [AppRoute.COMBINED_OFFER]: undefined;
    [AppRoute.COMBINED_WISH_LIST]: undefined;
}

export type CombinedProductTabNavigationProps = CompositeNavigationProp<
    BottomTabNavigationProp<CombinedHomeBottomTabsNavigatorParams, AppRoute.COMBINED_ALL_PRODUCT>,
    DrawerNavigationProp<CombinedHomeDrawerNavigatorParams, AppRoute.COMBINED_HOME>
>;

export type CombinedAllShopTabNavigationProps = CompositeNavigationProp<
    BottomTabNavigationProp<CombinedHomeBottomTabsNavigatorParams, AppRoute.COMBINED_ALL_SHOP>,
    DrawerNavigationProp<CombinedHomeDrawerNavigatorParams, AppRoute.COMBINED_HOME>
>;

export type CombinedBillBookTabNavigationProps = CompositeNavigationProp<
    BottomTabNavigationProp<CombinedHomeBottomTabsNavigatorParams, AppRoute.COMBINED_BILL_BOOK>,
    DrawerNavigationProp<CombinedHomeDrawerNavigatorParams, AppRoute.COMBINED_HOME>
>;

export type CombinedOfferTabNavigationProps = CompositeNavigationProp<
    BottomTabNavigationProp<CombinedHomeBottomTabsNavigatorParams, AppRoute.COMBINED_OFFER>,
    DrawerNavigationProp<CombinedHomeDrawerNavigatorParams, AppRoute.COMBINED_HOME>
>;

export type CombinedWishListTabNavigationProps = CompositeNavigationProp<
    BottomTabNavigationProp<CombinedHomeBottomTabsNavigatorParams, AppRoute.COMBINED_WISH_LIST>,
    DrawerNavigationProp<CombinedHomeDrawerNavigatorParams, AppRoute.COMBINED_HOME>
>;

// export interface CustomerOrderNavigatorScreenProps {
//     navigation: DrawerNavigationProp<CombinedHomeBottomTabsNavigatorParams, AppRoute.COMBINED_ORDER_NAV>;
//     route: RouteProp<CombinedHomeDrawerNavigatorParams, AppRoute.COMBINED_HOME>;
// }

// export type BillBookTabNavigationProps = CompositeNavigationProp<
//     BottomTabNavigationProp<HomeBottomTabsNavigatorParams, AppRoute.BILL_BOOK>,
//     DrawerNavigationProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_HOME>
// >;

// export type OffersTabNavigationProps = CompositeNavigationProp<
//     BottomTabNavigationProp<HomeBottomTabsNavigatorParams, AppRoute.OFFERS_TAB>,
//     DrawerNavigationProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_HOME>
// >;

// export type WishListTabNavigationProps = CompositeNavigationProp<
//     BottomTabNavigationProp<HomeBottomTabsNavigatorParams, AppRoute.WISH_LIST>,
//     DrawerNavigationProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_HOME>
// >;

// export interface CustomerProfileScreenProps {
//     navigation: DrawerNavigationProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_PROFILE>;
//     route: RouteProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_PROFILE>;
// }

// export interface CustomerAddressScreenProps {
//     navigation: DrawerNavigationProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_ADDRESS>;
//     route: RouteProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_ADDRESS>;
// }

// export interface CustomerWalletScreenProps {
//     navigation: DrawerNavigationProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_WALLET>;
//     route: RouteProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_WALLET>;
// }

// export interface CustomerOrderScreenProps {
//   navigation: DrawerNavigationProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_ORDER>;
//   route: RouteProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_ORDER>;
// }

// export interface CustomerCartScreenProps {
//     navigation: DrawerNavigationProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_CART>;
//     route: RouteProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_CART>;
// }

// export interface CustomerNotificationScreenProps {
//     navigation: DrawerNavigationProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_NOTIFICATION>;
//     route: RouteProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_NOTIFICATION>;
// }

// export interface CustomerContactScreenProps {
//     navigation: DrawerNavigationProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_CONTACT>;
//     route: RouteProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_CONTACT>;
// }

const Drawer = createDrawerNavigator<CombinedHomeDrawerNavigatorParams>();
const BottomTab = createBottomTabNavigator<CombinedHomeBottomTabsNavigatorParams>();

// FIXME(REACT-NAVIGATION-5): Not able to disable a pan gesture.
//
// In v4, it was possible with `navigationOptions: { gesturesEnabled: false }`
// Basically, I want to do this to disable `back` navigation from home screen to auth
// For Android, it can be covered with custom BackHandler.
//
// I'm not sure if it is a "true way", but I find it better
// rather than hard-coding business logic in navigators
// like it is described in https://reactnavigation.org/docs/en/next/auth-flow.html

const CombinedHomeBottomNavigator = (): React.ReactElement => (
    // @ts-ignore: `tabBar` also contains a DrawerNavigationProp
    <BottomTab.Navigator tabBar={props => <HomeTabBar{...props} />}>
        {/* <BottomTab.Screen
            name={AppRoute.COMBINED_ALL_SHOP}
            component={CustomerAllProductNavigator}
            options={{ title: 'Shop', tabBarIcon: HomeIcon }}
        /> */}

        <BottomTab.Screen
            name={AppRoute.COMBINED_ALL_PRODUCT}
            component={CombinedProductNavigator}
            options={{ title: 'Product', tabBarIcon: HomeIcon }}
        />

        <BottomTab.Screen
            name={AppRoute.COMBINED_WISH_LIST}
            component={CombinedWishListNavigator}
            options={{ title: 'WishList', tabBarIcon: CandidateIcon }}
        />

        <BottomTab.Screen
            name={AppRoute.COMBINED_BILL_BOOK}
            component={WishListNavigator}
            options={{ title: 'Bill Book', tabBarIcon: CandidateIcon }}
        />

        <BottomTab.Screen
            name={AppRoute.COMBINED_OFFER}
            component={CombinedOfferNavigator}
            options={{ title: 'Offer', tabBarIcon: CandidateIcon }}
        />
    </BottomTab.Navigator>
);

export const CombinedHomeNavigator = (): React.ReactElement => (
    // @ts-ignore: `drawerContent` also contains a DrawerNavigationProp
    <Drawer.Navigator drawerContent={props => <HomeDrawer{...props} />}>
        <Drawer.Screen
            name={AppRoute.COMBINED_HOME}
            component={CombinedHomeBottomNavigator}
            options={{ title: 'Home', drawerIcon: HomeIcon }}
        />

        <Drawer.Screen
            name={AppRoute.CUSTOMER_PROFILE}
            component={CustomerProfileScreen}
            options={{ title: 'Profile', drawerIcon: ProfileIcon }}
        />

        <Drawer.Screen
            name={AppRoute.CUSTOMER_ADDRESS}
            component={CustomerAddressScreen}
            options={{ title: 'Address', drawerIcon: AddressIcon }}

        />
        <Drawer.Screen
            name={AppRoute.CUSTOMER_ORDER_NAV}
            component={CustomerOrderNavigator}
            options={{ title: 'My Order', drawerIcon: MyOrderIcon }}
        />

        <Drawer.Screen
            name={AppRoute.CUSTOMER_CART}
            component={CartScreen}
            options={{ title: 'My cart', drawerIcon: CartNavIcon }}
        />

        <Drawer.Screen
            name={AppRoute.CUSTOMER_NOTIFICATION}
            component={CustomerNotificationScreen}
            options={{ title: 'Notification', drawerIcon: NotificationIcon }}
        />

        <Drawer.Screen
            name={AppRoute.CUSTOMER_CONTACT}
            component={CustomerContactScreen}
            options={{ title: 'Contact Us', drawerIcon: HelpIcon }}
        />

        <Drawer.Screen
            name={AppRoute.LOGOUT}
            component={LogoutScreen}
            options={{ title: 'Logout', drawerIcon: LogoutIcon }}
        />

    </Drawer.Navigator>
);

