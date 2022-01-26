import React from 'react';
import { CompositeNavigationProp, RouteProp,} from '@react-navigation/core';
import { createStackNavigator, StackNavigationProp, } from '@react-navigation/stack';
import { CombinedProductTabNavigationProps } from './customerHome.navigator';
import { AppRoute } from '../app-routes';
import { CartScreen, CustomerAllProductScreen, CustomerAllShopScreen, CustProductDetailScreen, MapScreen, PaymentScreen, ShopDetailScreen } from '../../scenes/Customer/allProduct';
import { CustomerOrderScreen } from '../../scenes/Customer/home';
import { CombinedProductScreen } from '../../scenes/combined/product';
type CustomerProductNavigatorParams = {
    [AppRoute.COMBINED_PRODUCT]: undefined;   
    [AppRoute.CUSTOMER_ALL_SHOP]: undefined;   
    [AppRoute.CUSTOMER_PRODUCT_DETAIL]: undefined;   
    [AppRoute.CUSTOMER_CART]: undefined;   
    [AppRoute.CUSTOMER_ORDER_PRODUCT]: undefined;   
    [AppRoute.SHOP_DETAIL]: undefined;   
    [AppRoute.PAYMENT]: undefined;   
    [AppRoute.MAP]: undefined;   
}

export interface CombinedProductScreenProps {
    navigation: CompositeNavigationProp<
    CombinedProductTabNavigationProps,
        StackNavigationProp<CustomerProductNavigatorParams, AppRoute.COMBINED_PRODUCT>
    >;
    route: RouteProp<CustomerProductNavigatorParams, AppRoute.COMBINED_PRODUCT>;
}

export interface MapScreenProps {
    navigation: CompositeNavigationProp<
    CombinedProductTabNavigationProps,
        StackNavigationProp<CustomerProductNavigatorParams, AppRoute.MAP>
    >;
    route: RouteProp<CustomerProductNavigatorParams, AppRoute.MAP>;
}

export interface CustomerAllShopScreenProps {
    navigation: CompositeNavigationProp<
    CombinedProductTabNavigationProps,
        StackNavigationProp<CustomerProductNavigatorParams, AppRoute.CUSTOMER_ALL_SHOP>
    >;
    route: RouteProp<CustomerProductNavigatorParams, AppRoute.CUSTOMER_ALL_SHOP>;
}

export interface CartScreenProps {
    navigation: CompositeNavigationProp<
    CombinedProductTabNavigationProps,
        StackNavigationProp<CustomerProductNavigatorParams, AppRoute.CUSTOMER_CART>
    >;
    route: RouteProp<CustomerProductNavigatorParams, AppRoute.CUSTOMER_CART>;
}

export interface CustProductDetailScreenProps {
    navigation: CompositeNavigationProp<
    CombinedProductTabNavigationProps,
        StackNavigationProp<CustomerProductNavigatorParams, AppRoute.CUSTOMER_PRODUCT_DETAIL>
    >;
    route: RouteProp<CustomerProductNavigatorParams, AppRoute.CUSTOMER_PRODUCT_DETAIL>;
}

export interface ShopDetailScreenProps {
    navigation: CompositeNavigationProp<
    CombinedProductTabNavigationProps,
        StackNavigationProp<CustomerProductNavigatorParams, AppRoute.SHOP_DETAIL>
    >;
    route: RouteProp<CustomerProductNavigatorParams, AppRoute.SHOP_DETAIL>;
}

export interface PaymentScreenProps {
    navigation: CompositeNavigationProp<
    CombinedProductTabNavigationProps,
        StackNavigationProp<CustomerProductNavigatorParams, AppRoute.PAYMENT>
    >;
    route: RouteProp<CustomerProductNavigatorParams, AppRoute.PAYMENT>;
}

export interface CustomerOrderProductScreenProps {
    navigation: CompositeNavigationProp<
    CombinedProductTabNavigationProps,
        StackNavigationProp<CustomerProductNavigatorParams, AppRoute.CUSTOMER_ORDER_PRODUCT>
    >;
    route: RouteProp<CustomerProductNavigatorParams, AppRoute.CUSTOMER_ORDER_PRODUCT>;
}


const Stack = createStackNavigator<CustomerProductNavigatorParams>();

export const CombinedProductNavigator = (): React.ReactElement => (
    <Stack.Navigator initialRouteName={AppRoute.COMBINED_PRODUCT} headerMode='none'>       
        <Stack.Screen name={AppRoute.COMBINED_PRODUCT} component={CombinedProductScreen} />        
        <Stack.Screen name={AppRoute.CUSTOMER_CART} component={CartScreen} />        
        <Stack.Screen name={AppRoute.SHOP_DETAIL} component={ShopDetailScreen} />        
        <Stack.Screen name={AppRoute.CUSTOMER_PRODUCT_DETAIL} component={CustProductDetailScreen} />        
        <Stack.Screen name={AppRoute.PAYMENT} component={PaymentScreen} />        
        <Stack.Screen name={AppRoute.MAP} component={MapScreen} />        
        <Stack.Screen name={AppRoute.CUSTOMER_ORDER_PRODUCT} component={CustomerOrderScreen} />        
    </Stack.Navigator>
);
