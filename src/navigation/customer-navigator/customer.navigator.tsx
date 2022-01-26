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
import { HomeIcon, InfoIcon, LayoutIcon } from '../../assets/icons';
import { AuthNavigator } from '../auth-navigation/auth.navigator';
import { CustomerTabBar } from '../navigator-components/customer-tab-bar';
import { CustomerDrawer } from '../navigator-components/customer-home-drawer';
import { ProductListNavigator } from './product-list.navigator';
import { CategoryListNavigator } from './category-list.navigator';
import { CartNavigator } from '../cart-navigation/cart.navigator';

type CustomerDrawerNavigatorParams = {
  [AppRoute.HOME]: undefined;
  [AppRoute.LOG_OUT]: undefined;
  [AppRoute.CART]: undefined;
}

type CustomerBottomTabsNavigatorParams = {
  [AppRoute.SHOP_LIST]: undefined;
  [AppRoute.CATEGORY_LIST]: undefined;
  [AppRoute.PRODUCT_LIST]: undefined;
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

export interface LogOutScreenProp {
  navigation: DrawerNavigationProp<CustomerDrawerNavigatorParams, AppRoute.LOG_OUT>;
  route: RouteProp<CustomerDrawerNavigatorParams, AppRoute.LOG_OUT>;
}

export interface CartNavigatorProp {
  navigation: DrawerNavigationProp<CustomerDrawerNavigatorParams, AppRoute.CART>;
  route: RouteProp<CustomerDrawerNavigatorParams, AppRoute.CART>;
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
      options={{ title: 'Home', tabBarIcon: LayoutIcon }}
    />

    {/* <BottomTab.Screen
      name={AppRoute.PRODUCT_LIST}
      component={ProductListNavigator}
      options={{ title: 'Product', tabBarIcon: PersonIcon }}
    /> */}
  </BottomTab.Navigator>
);

export const CustomerNavigator = (): React.ReactElement => (
  // @ts-ignore: `drawerContent` also contains a DrawerNavigationProp
  <Drawer.Navigator drawerContent={props => <CustomerDrawer {...props} />} screenOptions={{ headerShown: false }}>
    <Drawer.Screen
      name={AppRoute.HOME}
      component={CustomerBottomNavigator}
      options={{ title: 'Home', drawerIcon: HomeIcon }}
    />
    <Drawer.Screen
      name={AppRoute.CART}
      component={CartNavigator}
      options={{ title: 'Cart', drawerIcon: InfoIcon }}
    />
     <Drawer.Screen
      name={AppRoute.LOG_OUT}
      component={AuthNavigator}
      options={{ title: 'Lou Out', drawerIcon: InfoIcon }}
    />
  </Drawer.Navigator>
);