import React from 'react';
import { AppRoute } from '../app-routes';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import {
  BottomTabBarProps,
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import { AddressIcon, CartIcon, DrawerHome, HelpIcon, HomeIcon, InfoIcon, LayoutIcon, Logout, LogoutIcon, MyOrderIcon, NotificationIcon, ProfileIcon, StockListIcon, WalletIcon, WishIcon } from '../../assets/icons';
import { CustomerTabBar } from '../navigator-components/customer-tab-bar';
import { CustomerDrawer } from '../navigator-components/customer-home-drawer';
import { ProductListNavigator } from './product-list.navigator';
import { CategoryListNavigator } from './category-list.navigator';
import { CartNavigator } from './cart-navigation/cart.navigator';
import { WishListNavigator } from './wish-list.navigator';
import { OffersListNavigator } from './offer-list.navigator';
import { BillBookNavigator } from './bill-book.navigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogoutScreen } from '../../screens/auth/logout.component';
import { CustomerProfileDrawerNavigator } from './customer-profile/customerProfile.Navigator';
import { CustomerAddressScreen, CustomerContactScreen, CustomerNotificationScreen, CustomerWalletScreen } from '../../screens/customer/drawer';
import { CustomerOrderNavigator } from './order-navigation/order.navigator';

type CustomerDrawerNavigatorParams = {
  [AppRoute.HOME]: undefined;
  [AppRoute.LOG_OUT]: undefined;
  [AppRoute.CART]: undefined;
  [AppRoute.CUSTOMER_PROFILE]: undefined;
  [AppRoute.CUSTOMER_ADDRESS]: undefined;
  [AppRoute.CUSTOMER_NOTIFICATION]: undefined;
  [AppRoute.CUSTOMER_ORDER_NAV]: undefined;
  [AppRoute.CUSTOMER_WALLET]: undefined;
  [AppRoute.CUSTOMER_CONTACT]: undefined;
}

type CustomerBottomTabsNavigatorParams = {
  [AppRoute.SHOP_LIST]: undefined;
  [AppRoute.CATEGORY_LIST]: undefined;
  [AppRoute.PRODUCT_LIST]: undefined;
  [AppRoute.WISH_LIST]: undefined;
  [AppRoute.BILL_BOOK]: undefined;
  [AppRoute.OFFERS_TAB]: undefined;
}

export type CategoryListTabNavigatorProp = CompositeNavigationProp<
  BottomTabNavigationProp<CustomerBottomTabsNavigatorParams, AppRoute.CATEGORY_LIST>,
  DrawerNavigationProp<CustomerDrawerNavigatorParams, AppRoute.HOME>>;

export type ShopListTabNavigatorProp = CompositeNavigationProp<
  BottomTabNavigationProp<CustomerBottomTabsNavigatorParams, AppRoute.SHOP_LIST>,
  DrawerNavigationProp<CustomerDrawerNavigatorParams, AppRoute.HOME>>;

export type ProductListTabNavigatorProp = CompositeNavigationProp<
  BottomTabNavigationProp<CustomerBottomTabsNavigatorParams, AppRoute.PRODUCT_LIST>,
  DrawerNavigationProp<CustomerDrawerNavigatorParams, AppRoute.HOME>>;

export type WishListTabNavigatorProp = CompositeNavigationProp<
  BottomTabNavigationProp<CustomerBottomTabsNavigatorParams, AppRoute.WISH_LIST>,
  DrawerNavigationProp<CustomerDrawerNavigatorParams, AppRoute.HOME>>;

export type BillBookTabNavigatorProp = CompositeNavigationProp<
  BottomTabNavigationProp<CustomerBottomTabsNavigatorParams, AppRoute.BILL_BOOK>,
  DrawerNavigationProp<CustomerDrawerNavigatorParams, AppRoute.HOME>>;

export type OffersTabNavigatorProp = CompositeNavigationProp<
  BottomTabNavigationProp<CustomerBottomTabsNavigatorParams, AppRoute.OFFERS_TAB>,
  DrawerNavigationProp<CustomerDrawerNavigatorParams, AppRoute.HOME>>;

export interface LogOutScreenProp {
  navigation: DrawerNavigationProp<CustomerDrawerNavigatorParams, AppRoute.LOG_OUT>;
  route: RouteProp<CustomerDrawerNavigatorParams, AppRoute.LOG_OUT>;
}

export interface CartNavigatorProp {
  navigation: DrawerNavigationProp<CustomerDrawerNavigatorParams, AppRoute.CART>;
  route: RouteProp<CustomerDrawerNavigatorParams, AppRoute.CART>;
}

export interface CustomerProfileNavigatorProp {
  navigation: DrawerNavigationProp<CustomerDrawerNavigatorParams, AppRoute.CUSTOMER_PROFILE>;
  route: RouteProp<CustomerDrawerNavigatorParams, AppRoute.CUSTOMER_PROFILE>;
}

export interface CustomerNotificationScreenProps {
  navigation: DrawerNavigationProp<CustomerDrawerNavigatorParams, AppRoute.CUSTOMER_NOTIFICATION>;
  route: RouteProp<CustomerDrawerNavigatorParams, AppRoute.CUSTOMER_NOTIFICATION>;
}

export interface CustomerAddressScreenProps {
  navigation: DrawerNavigationProp<CustomerDrawerNavigatorParams, AppRoute.CUSTOMER_ADDRESS>;
  route: RouteProp<CustomerDrawerNavigatorParams, AppRoute.CUSTOMER_ADDRESS>;
}

export interface CustomerOrderNavigatorScreenProps {
  navigation: DrawerNavigationProp<CustomerDrawerNavigatorParams, AppRoute.CUSTOMER_ORDER_NAV>;
  route: RouteProp<CustomerDrawerNavigatorParams, AppRoute.CUSTOMER_ORDER_NAV>;
}

export interface CustomerWalletScreenProps {
  navigation: DrawerNavigationProp<CustomerDrawerNavigatorParams, AppRoute.CUSTOMER_WALLET>;
  route: RouteProp<CustomerDrawerNavigatorParams, AppRoute.CUSTOMER_WALLET>;
}

export interface CustomerContactScreenProps {
  navigation: DrawerNavigationProp<CustomerDrawerNavigatorParams, AppRoute.CUSTOMER_CONTACT>;
  route: RouteProp<CustomerDrawerNavigatorParams, AppRoute.CUSTOMER_CONTACT>;
}

export type DrawerCustomerScreenProps = DrawerContentComponentProps & {
  navigation: DrawerNavigationProp<CustomerDrawerNavigatorParams, AppRoute.HOME>;
};

export type BottomCustomerScreenProps = BottomTabBarProps & {
  navigation: ShopListTabNavigatorProp;
};

const Drawer = createDrawerNavigator<CustomerDrawerNavigatorParams>();
const BottomTab = createBottomTabNavigator<CustomerBottomTabsNavigatorParams>();

const CustomerBottomNavigator = (): React.ReactElement => (
  // @ts-ignore: `tabBar` also contains a DrawerNavigationProp
  <BottomTab.Navigator tabBar={props => <CustomerTabBar {...props} />} screenOptions={{ headerShown: false }}>
    <BottomTab.Screen
      name={AppRoute.SHOP_LIST}
      component={CategoryListNavigator}
      options={{ title: 'Home', tabBarIcon: HomeIcon }}
    />

    <BottomTab.Screen
      name={AppRoute.PRODUCT_LIST}
      component={ProductListNavigator}
      options={{ title: 'Products', tabBarIcon: LayoutIcon }}
    />

    <BottomTab.Screen
      name={AppRoute.WISH_LIST}
      component={WishListNavigator}
      options={{ title: 'Wish List', tabBarIcon: WishIcon }}
    />

    <BottomTab.Screen
      name={AppRoute.BILL_BOOK}
      component={BillBookNavigator}
      options={{ title: 'Bill Book', tabBarIcon: LayoutIcon }}
    />

    {/* <BottomTab.Screen
      name={AppRoute.OFFERS_TAB}
      component={OffersListNavigator}
      options={{ title: 'Offers', tabBarIcon: LayoutIcon }}
    /> */}
  </BottomTab.Navigator>
);

var login: any

const logedIn: any = async () => {
  const log = await AsyncStorage.getItem('logedIn')
  login = log
  // console.log('data login', login)
}

export const CustomerNavigator = (): React.ReactElement => (
  // @ts-ignore: `drawerContent` also contains a DrawerNavigationProp
  <Drawer.Navigator drawerContent={props => <CustomerDrawer {...props} />} screenOptions={{ headerShown: false }}>
    <Drawer.Screen
      name={AppRoute.HOME}
      component={CustomerBottomNavigator}
      options={{ title: logedIn() ? 'Home' : 'Home', drawerIcon: DrawerHome }}
    />

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
      options={{ title: 'Notification', drawerIcon: NotificationIcon }}
    />

    <Drawer.Screen
      name={AppRoute.CUSTOMER_ORDER_NAV}
      component={CustomerOrderNavigator}
      options={{ title: 'My Order', drawerIcon: MyOrderIcon }}
    />

    <Drawer.Screen
      name={AppRoute.CART}
      component={CartNavigator}
      options={{ title: 'My Cart', drawerIcon: CartIcon }}
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
      name={AppRoute.LOG_OUT}
      component={LogoutScreen}
      options={{ title: login === "true" ? 'Logout' : 'Login', drawerIcon: Logout }}
    />

  </Drawer.Navigator>
);