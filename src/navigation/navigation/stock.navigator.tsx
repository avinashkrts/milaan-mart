import React from 'react';
import {
    CompositeNavigationProp,
    RouteProp,
} from '@react-navigation/core';
import {
    createStackNavigator,
    StackNavigationProp,
} from '@react-navigation/stack';
import { StockTabNavigationProp } from './home.navigator';
import { AppRoute } from './app-routes';
import { ItemCategoryScreen, AddProductImageScreen, AddBrandScreen, AddCategoryScreen, BrandListScreen, ItemListScreen, AddProductScreen } from '../scenes/shopkeeper/stock';
import { ProductDetailScreen } from '../scenes/shopkeeper/allItem';

type StockNavigatorParams = {
    [AppRoute.ITEM_CATEGORY]: undefined;
    [AppRoute.ADD_CATEGORY]: undefined;
    [AppRoute.ADD_BRAND]: undefined;
    [AppRoute.BRANDLIST]: undefined;
    [AppRoute.ITEMLIST]: undefined;
    [AppRoute.ADD_PRODUCT]: undefined;
    [AppRoute.ADD_PRODUCT_IMAGE]: undefined;
    [AppRoute.ITEM_DETAILS]: undefined;
}

export interface ItemCategoryScreenProps {
    navigation: CompositeNavigationProp<
        StockTabNavigationProp,
        StackNavigationProp<StockNavigatorParams, AppRoute.ITEM_CATEGORY>
    >;
    route: RouteProp<StockNavigatorParams, AppRoute.ITEM_CATEGORY>;
}

export interface BrandListScreenProps {
    navigation: CompositeNavigationProp<
        StockTabNavigationProp,
        StackNavigationProp<StockNavigatorParams, AppRoute.BRANDLIST>
    >;
    route: RouteProp<StockNavigatorParams, AppRoute.BRANDLIST>;
}

export interface ItemListScreenProps {
    navigation: CompositeNavigationProp<
        StockTabNavigationProp,
        StackNavigationProp<StockNavigatorParams, AppRoute.ITEMLIST>
    >;
    route: RouteProp<StockNavigatorParams, AppRoute.ITEMLIST>;
}

export interface AddCategoryScreenProps {
    navigation: CompositeNavigationProp<
        StockTabNavigationProp,
        StackNavigationProp<StockNavigatorParams, AppRoute.ADD_CATEGORY>
    >;
    route: RouteProp<StockNavigatorParams, AppRoute.ADD_CATEGORY>;
}

export interface AddBrandScreenProps {
    navigation: CompositeNavigationProp<
        StockTabNavigationProp,
        StackNavigationProp<StockNavigatorParams, AppRoute.ADD_BRAND>
    >;
    route: RouteProp<StockNavigatorParams, AppRoute.ADD_BRAND>;
}

export interface AddProductScreenProps {
    navigation: CompositeNavigationProp<
        StockTabNavigationProp,
        StackNavigationProp<StockNavigatorParams, AppRoute.ADD_PRODUCT>
    >;
    route: RouteProp<StockNavigatorParams, AppRoute.ADD_PRODUCT>;
}

export interface ItemDetailScreenProps {
    navigation: CompositeNavigationProp<
        StockTabNavigationProp,
        StackNavigationProp<StockNavigatorParams, AppRoute.ITEM_DETAILS>
    >;
    route: RouteProp<StockNavigatorParams, AppRoute.ITEM_DETAILS>;
}

export interface AddProductImageScreenProps {
    navigation: CompositeNavigationProp<
        StockTabNavigationProp,
        StackNavigationProp<StockNavigatorParams, AppRoute.ADD_PRODUCT_IMAGE>
    >;
    route: RouteProp<StockNavigatorParams, AppRoute.ADD_PRODUCT_IMAGE>;
}



const Stack = createStackNavigator<StockNavigatorParams>();

export const StockNavigator = (): React.ReactElement => (
    <Stack.Navigator headerMode='none'>
        <Stack.Screen name={AppRoute.ITEM_CATEGORY} component={ItemCategoryScreen} />
        <Stack.Screen name={AppRoute.ADD_CATEGORY} component={AddCategoryScreen} />
        <Stack.Screen name={AppRoute.BRANDLIST} component={BrandListScreen} />
        <Stack.Screen name={AppRoute.ITEMLIST} component={ItemListScreen} />
        <Stack.Screen name={AppRoute.ADD_PRODUCT} component={AddProductScreen} />
        <Stack.Screen name={AppRoute.ADD_BRAND} component={AddBrandScreen} />
        <Stack.Screen name={AppRoute.ITEM_DETAILS} component={ProductDetailScreen} />
        <Stack.Screen name={AppRoute.ADD_PRODUCT_IMAGE} component={AddProductImageScreen} />
    </Stack.Navigator>
);
