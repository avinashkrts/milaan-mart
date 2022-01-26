import React from 'react';
import {
    CompositeNavigationProp,
    RouteProp,
} from '@react-navigation/core';
import {
    createStackNavigator,
    StackNavigationProp,
} from '@react-navigation/stack';
import { CombinedOfferTabNavigationProps } from './combinedHome';
import { AppRoute } from '../app-routes';
import {HrProfileScreen, EditHrProfileScreen, LogoutScreen} from '../../scenes/hr/hrProfile'
import { OffersScreen } from '../../scenes/Customer/offers';
import { CustProductDetailScreen } from '../../scenes/Customer/allProduct';
import { CombinedOffersScreen } from '../../scenes/combined/offer';
type CombinedOfferNavigatorParams = {
    [AppRoute.COMBINED_ALL_OFFER]: undefined;   
    [AppRoute.OFFERS_DETAIL_TAB]: undefined;   
}

export interface CombinedOfferScreenProps {
    navigation: CompositeNavigationProp<
    CombinedOfferTabNavigationProps,
        StackNavigationProp<CombinedOfferNavigatorParams, AppRoute.COMBINED_ALL_OFFER>
    >;
    route: RouteProp<CombinedOfferNavigatorParams, AppRoute.COMBINED_ALL_OFFER>;
}

const Stack = createStackNavigator<CombinedOfferNavigatorParams>();

export const CombinedOfferNavigator = (): React.ReactElement => (
    <Stack.Navigator headerMode='none'>
        <Stack.Screen name={AppRoute.COMBINED_ALL_OFFER} component={CombinedOffersScreen} />         
    </Stack.Navigator>
);
