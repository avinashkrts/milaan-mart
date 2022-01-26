import React, { useState } from 'react';
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
} from '../../scenes/home';
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
} from '../../assets/icons';
import { AuthNavigator } from '../auth.navigator';
import { CustomerAllShopNavigator } from './customerAllProduct.navigator';
import { WishListNavigator } from './wishList.navigator';
import { BillBookNavigator } from './billBook.navigator';
import { OffersNavigator } from './offers.navigator';
import { CustomerAddressScreen, CustomerCartScreen, CustomerContactScreen, CustomerNotificationScreen, CustomerOrderScreen, CustomerProfileScreen, CustomerWalletScreen } from '../../scenes/Customer/home';
import { LogoutScreen } from '../../scenes/auth';
import { CartScreen } from '../../scenes/Customer/allProduct/cart.component';
import { CustomerOrderNavigator } from './customerOrder.navigator';
import { CustomerHomeTabBar } from '../../scenes/Customer/home/customer-home-tab-bar.component';
import { CustomerHomeDrawer } from '../../scenes/Customer/home/customer-home-drawer.component';
import { CombinedProductNavigator } from '../combined-navigator/combinedAllProduct.navigator';
import { scale } from 'react-native-size-matters';
import { AsyncStorage } from 'react-native';
import { LableText } from '../../constants';
import { CustomerProfileDrawerNavigator } from './customerProfile.Navigator';
import { RegistrationNavigator } from '../registration.navigator';
import { GetProductByIdNavigator } from './getProdutById.navigator';

type CustomerHomeDrawerNavigatorParams = {
  [AppRoute.CUSTOMER_HOME]: undefined;
  [AppRoute.REGISTRATION]: undefined;
  [AppRoute.GET_PRODUCT]: undefined;
  [AppRoute.CUSTOMER_ORDER_NAV]: undefined;
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

type CustomerHomeBottomTabsNavigatorParams = {
  [AppRoute.CUSTOMER_ALL_SHOP]: undefined;
  [AppRoute.COMBINED_PRODUCT]: undefined;
  [AppRoute.BILL_BOOK]: undefined;
  [AppRoute.OFFERS_TAB]: undefined;
  [AppRoute.WISH_LIST]: undefined;
}

// export interface RegistrationNavigatorScreenProps {
//   navigation: DrawerNavigationProp<CustomerHomeBottomTabsNavigatorParams, AppRoute.REGISTRATION>;
//   route: RouteProp<CustomerHomeBottomTabsNavigatorParams, AppRoute.REGISTRATION>;
// }

export type CustomerAllShopTabNavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<CustomerHomeBottomTabsNavigatorParams, AppRoute.CUSTOMER_ALL_SHOP>,
  DrawerNavigationProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_HOME>
>;

export type CombinedProductTabNavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<CustomerHomeBottomTabsNavigatorParams, AppRoute.COMBINED_PRODUCT>,
  DrawerNavigationProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_HOME>
>;

export interface CustomerOrderNavigatorScreenProps {
  navigation: DrawerNavigationProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_ORDER_NAV>;
  route: RouteProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_ORDER_NAV>;
}

export interface GetProductByIdNavigatorScreenProps {
  navigation: DrawerNavigationProp<CustomerHomeDrawerNavigatorParams, AppRoute.GET_PRODUCT>;
  route: RouteProp<CustomerHomeDrawerNavigatorParams, AppRoute.GET_PRODUCT>;
}

export type BillBookTabNavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<CustomerHomeBottomTabsNavigatorParams, AppRoute.BILL_BOOK>,
  DrawerNavigationProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_HOME>
>;

export type OffersTabNavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<CustomerHomeBottomTabsNavigatorParams, AppRoute.OFFERS_TAB>,
  DrawerNavigationProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_HOME>
>;

export type WishListTabNavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<CustomerHomeBottomTabsNavigatorParams, AppRoute.WISH_LIST>,
  DrawerNavigationProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_HOME>
>;

export interface CustomerAddressScreenProps {
  navigation: DrawerNavigationProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_ADDRESS>;
  route: RouteProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_ADDRESS>;
}

export interface CustomerRegistrationNavigatorScreenProps {
  navigation: DrawerNavigationProp<CustomerHomeDrawerNavigatorParams, AppRoute.REGISTRATION>;
  route: RouteProp<CustomerHomeDrawerNavigatorParams, AppRoute.REGISTRATION>;
}

export interface CustomerWalletScreenProps {
  navigation: DrawerNavigationProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_WALLET>;
  route: RouteProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_WALLET>;
}

export interface CustomerCartScreenProps {
  navigation: DrawerNavigationProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_CART>;
  route: RouteProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_CART>;
}

export interface CustomerNotificationScreenProps {
  navigation: DrawerNavigationProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_NOTIFICATION>;
  route: RouteProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_NOTIFICATION>;
}

export interface CustomerContactScreenProps {
  navigation: DrawerNavigationProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_CONTACT>;
  route: RouteProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_CONTACT>;
}

export interface CustomerProfileDrawerNavigationProp {
  navigation: DrawerNavigationProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_PROFILE>;
  route: RouteProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_PROFILE>;
}

export type CustomerBottomHomeScreenProps = BottomTabBarProps & {
  navigation: CustomerAllShopTabNavigationProps;
};

export type CustomerDrawerHomeScreenProps = DrawerContentComponentProps & {
  navigation: DrawerNavigationProp<CustomerHomeDrawerNavigatorParams, AppRoute.CUSTOMER_HOME>;
};



const Drawer = createDrawerNavigator<CustomerHomeDrawerNavigatorParams>();
const BottomTab = createBottomTabNavigator<CustomerHomeBottomTabsNavigatorParams>();

// FIXME(REACT-NAVIGATION-5): Not able to disable a pan gesture.
//
// In v4, it was possible with `navigationOptions: { gesturesEnabled: false }`
// Basically, I want to do this to disable `back` navigation from home screen to auth
// For Android, it can be covered with custom BackHandler.
//
// I'm not sure if it is a "true way", but I find it better
// rather than hard-coding business logic in navigators
// like it is described in https://reactnavigation.org/docs/en/next/auth-flow.html

const CustomerHomeBottomNavigator = (): React.ReactElement => (
  // @ts-ignore: `tabBar` also contains a DrawerNavigationProp
  <BottomTab.Navigator tabBar={CustomerHomeTabBar}>

    {/* <BottomTab.Screen
      name={AppRoute.CUSTOMER_ALL_SHOP}
      component={CustomerAllShopNavigator}
      options={{ title: 'Home', tabBarIcon: HomeIcon }}
    /> */}

    <BottomTab.Screen
      name={AppRoute.COMBINED_PRODUCT}
      component={CombinedProductNavigator}
      options={{ title: 'Home', tabBarIcon: HomeIcon }}
    />

    <BottomTab.Screen
      name={AppRoute.WISH_LIST}
      component={WishListNavigator}
      options={{ title: 'Wish List', tabBarIcon: CandidateIcon }}
    />

    <BottomTab.Screen
      name={AppRoute.BILL_BOOK}
      component={BillBookNavigator}
      options={{ title: 'Bill Book', tabBarIcon: PostJobIcon }}
    />

    <BottomTab.Screen
      name={AppRoute.OFFERS_TAB}
      component={OffersNavigator}
      options={{ title: 'Offers', tabBarIcon: ProfileIcon }}
    />

  </BottomTab.Navigator>
);



var login

const logedIn = async () => {
  const log = await AsyncStorage.getItem('logedIn')
  login = log
  console.log('data login', login)
}

export const CustomerHomeNavigator = (): React.ReactElement => (
  // @ts-ignore: `drawerContent` also contains a DrawerNavigationProp  
  <Drawer.Navigator drawerContent={props => <CustomerHomeDrawer{...props} />}>
    <Drawer.Screen
      name={AppRoute.CUSTOMER_HOME}
      component={CustomerHomeBottomNavigator}
      options={{ title: logedIn() ? 'Home' : 'Home', drawerIcon: HomeIcon }}
    />

    {/* <Drawer.Screen
      name={AppRoute.REGISTRATION}
      component={RegistrationNavigator}
      options={{ title: 'Business Register', drawerIcon: ProfileIcon }}
    /> */}

    {/* <Drawer.Screen
      name={AppRoute.GET_PRODUCT}
      component={GetProductByIdNavigator}
      options={{ title: 'Search Product', drawerIcon: ProfileIcon }}
    /> */}

    <Drawer.Screen
      name={AppRoute.CUSTOMER_PROFILE}
      component={CustomerProfileDrawerNavigator}
      options={{ title: 'Profile', drawerIcon: ProfileIcon }}
    />

    <Drawer.Screen
      name={AppRoute.CUSTOMER_ADDRESS}
      component={CustomerAddressScreen}
      options={{ title: 'Address', drawerIcon: AddressIcon }}
    />

    <Drawer.Screen
      name={AppRoute.CUSTOMER_NOTIFICATION}
      component={CustomerNotificationScreen}
      options={{ title: 'Notification', drawerIcon: AddressIcon }}
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
      name={AppRoute.CUSTOMER_WALLET}
      component={CustomerWalletScreen}
      options={{ title: 'Wallet', drawerIcon: WalletIcon }}
    />

    <Drawer.Screen
      name={AppRoute.CUSTOMER_CONTACT}
      component={CustomerContactScreen}
      options={{ title: 'About Us', drawerIcon: HelpIcon }}
    />

    <Drawer.Screen
      name={AppRoute.LOGOUT}
      component={LogoutScreen}
      options={{ title: login === "true" ? 'Logout' : 'Login', drawerIcon: LogoutIcon }}
    />

  </Drawer.Navigator>
);

