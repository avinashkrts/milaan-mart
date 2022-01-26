import React from 'react';
import {
    CompositeNavigationProp,
    RouteProp,
} from '@react-navigation/core';
import {
    createStackNavigator,
    StackNavigationProp,
} from '@react-navigation/stack';
import { OffersTabNavigationProps } from './customerHome.navigator';
import { AppRoute } from '../app-routes';
import {HrProfileScreen, EditHrProfileScreen, LogoutScreen} from '../../scenes/hr/hrProfile'
import { OffersScreen } from '../../scenes/Customer/offers';
import { CustProductDetailScreen } from '../../scenes/Customer/allProduct';
type OfferNavigatorParams = {
    [AppRoute.OFFERS_TAB]: undefined;   
    [AppRoute.OFFERS_DETAIL_TAB]: undefined;   
}

export interface OffersScreenProps {
    navigation: CompositeNavigationProp<OffersTabNavigationProps,
        StackNavigationProp<OfferNavigatorParams, AppRoute.OFFERS_TAB>>;
    route: RouteProp<OfferNavigatorParams, AppRoute.OFFERS_TAB>;
}

export interface OffersDetailScreenProps {
    navigation: CompositeNavigationProp<OffersTabNavigationProps,
        StackNavigationProp<OfferNavigatorParams, AppRoute.OFFERS_DETAIL_TAB>>;
    route: RouteProp<OfferNavigatorParams, AppRoute.OFFERS_DETAIL_TAB>;
}

const Stack = createStackNavigator<OfferNavigatorParams>();

export const OffersNavigator = (): React.ReactElement => (
    <Stack.Navigator headerMode='none'>
        <Stack.Screen name={AppRoute.OFFERS_TAB} component={OffersScreen} />        
        <Stack.Screen name={AppRoute.OFFERS_DETAIL_TAB} component={CustProductDetailScreen} />        
         
    </Stack.Navigator>
);
