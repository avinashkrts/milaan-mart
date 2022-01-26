import React from 'react';
import { CompositeNavigationProp, RouteProp,} from '@react-navigation/core';
import { createStackNavigator, StackNavigationProp, } from '@react-navigation/stack';
import { CustomerAllShopTabNavigationProps } from './customerHome.navigator';
import { AppRoute } from '../app-routes';
import { CartScreen, CustomerAllProductScreen, CustomerAllShopScreen, CustProductDetailScreen, MapScreen, PaymentScreen, ShopDetailScreen } from '../../scenes/Customer/allProduct';
import { CustomerOrderScreen } from '../../scenes/Customer/home';
import { TestScreen } from '../../scenes/test/test';
import { CombinedProductScreen } from '../../scenes/combined/product';
type CustomerAllProductNavigatorParams = {
    [AppRoute.CUSTOMER_ALL_PRODUCT]: undefined;   
    [AppRoute.CUSTOMER_ALL_SHOP]: undefined;   
    [AppRoute.CUSTOMER_PRODUCT_DETAIL]: undefined;   
    [AppRoute.CUSTOMER_CART]: undefined;   
    [AppRoute.CUSTOMER_ORDER_PRODUCT]: undefined;   
    [AppRoute.SHOP_DETAIL]: undefined;   
    [AppRoute.PAYMENT]: undefined;   
    [AppRoute.MAP]: undefined;   
    [AppRoute.TEST_SCREEN]: undefined;   
}

export interface CustomerAllProductScreenProps {
    navigation: CompositeNavigationProp<
    CustomerAllShopTabNavigationProps,
        StackNavigationProp<CustomerAllProductNavigatorParams, AppRoute.CUSTOMER_ALL_PRODUCT>
    >;
    route: RouteProp<CustomerAllProductNavigatorParams, AppRoute.CUSTOMER_ALL_PRODUCT>;
}

export interface MapScreenProps {
    navigation: CompositeNavigationProp<
    CustomerAllShopTabNavigationProps,
        StackNavigationProp<CustomerAllProductNavigatorParams, AppRoute.MAP>
    >;
    route: RouteProp<CustomerAllProductNavigatorParams, AppRoute.MAP>;
}

export interface CustomerAllShopScreenProps {
    navigation: CompositeNavigationProp<
    CustomerAllShopTabNavigationProps,
        StackNavigationProp<CustomerAllProductNavigatorParams, AppRoute.CUSTOMER_ALL_SHOP>
    >;
    route: RouteProp<CustomerAllProductNavigatorParams, AppRoute.CUSTOMER_ALL_SHOP>;
}

export interface CartScreenProps {
    navigation: CompositeNavigationProp<
    CustomerAllShopTabNavigationProps,
        StackNavigationProp<CustomerAllProductNavigatorParams, AppRoute.CUSTOMER_CART>
    >;
    route: RouteProp<CustomerAllProductNavigatorParams, AppRoute.CUSTOMER_CART>;
}

export interface CustProductDetailScreenProps {
    navigation: CompositeNavigationProp<
    CustomerAllShopTabNavigationProps,
        StackNavigationProp<CustomerAllProductNavigatorParams, AppRoute.CUSTOMER_PRODUCT_DETAIL>
    >;
    route: RouteProp<CustomerAllProductNavigatorParams, AppRoute.CUSTOMER_PRODUCT_DETAIL>;
}

export interface ShopDetailScreenProps {
    navigation: CompositeNavigationProp<
    CustomerAllShopTabNavigationProps,
        StackNavigationProp<CustomerAllProductNavigatorParams, AppRoute.SHOP_DETAIL>
    >;
    route: RouteProp<CustomerAllProductNavigatorParams, AppRoute.SHOP_DETAIL>;
}

export interface PaymentScreenProps {
    navigation: CompositeNavigationProp<
    CustomerAllShopTabNavigationProps,
        StackNavigationProp<CustomerAllProductNavigatorParams, AppRoute.PAYMENT>
    >;
    route: RouteProp<CustomerAllProductNavigatorParams, AppRoute.PAYMENT>;
}

export interface CustomerOrderProductScreenProps {
    navigation: CompositeNavigationProp<
    CustomerAllShopTabNavigationProps,
        StackNavigationProp<CustomerAllProductNavigatorParams, AppRoute.CUSTOMER_ORDER_PRODUCT>
    >;
    route: RouteProp<CustomerAllProductNavigatorParams, AppRoute.CUSTOMER_ORDER_PRODUCT>;
}

export interface TestProductScreenProps {
    navigation: CompositeNavigationProp<
    CustomerAllShopTabNavigationProps,
        StackNavigationProp<CustomerAllProductNavigatorParams, AppRoute.TEST_SCREEN>
    >;
    route: RouteProp<CustomerAllProductNavigatorParams, AppRoute.TEST_SCREEN>;
}


const Stack = createStackNavigator<CustomerAllProductNavigatorParams>();

export const CustomerAllShopNavigator = (): React.ReactElement => (
    <Stack.Navigator initialRouteName={AppRoute.CUSTOMER_ALL_PRODUCT} headerMode='none'>
        {/* <Stack.Screen name={AppRoute.TEST_SCREEN} component={TestScreen} />         */}
        {/* <Stack.Screen name={AppRoute.CUSTOMER_ALL_SHOP} component={CustomerAllShopScreen} />         */}
        <Stack.Screen name={AppRoute.CUSTOMER_ALL_PRODUCT} component={CombinedProductScreen} />        
        <Stack.Screen name={AppRoute.CUSTOMER_CART} component={CartScreen} />        
        <Stack.Screen name={AppRoute.SHOP_DETAIL} component={ShopDetailScreen} />        
        <Stack.Screen name={AppRoute.CUSTOMER_PRODUCT_DETAIL} component={CustProductDetailScreen} />        
        <Stack.Screen name={AppRoute.PAYMENT} component={PaymentScreen} />        
        <Stack.Screen name={AppRoute.MAP} component={MapScreen} />        
        <Stack.Screen name={AppRoute.CUSTOMER_ORDER_PRODUCT} component={CustomerOrderScreen} />        
        {/* <Stack.Screen name={AppRoute.TEST_SCREEN} component={TestScreen} />         */}
    </Stack.Navigator>
);
