import React from 'react';
import {
  BottomNavigation,
  BottomNavigationTab,
  BottomNavigationTabElement,
  Divider,
} from '@ui-kitten/components';
import { BottomCustomerScreenProps } from '../customer-navigator/customer.navigator';
import { SafeAreaLayout, SafeAreaLayoutElement, SaveAreaInset } from '../../components/safe-area-layout.component';
import { StackActions, CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const CustomerTabBar = (props: BottomCustomerScreenProps): SafeAreaLayoutElement => {
  const onSelect = async (index: number): void => {
    const clean = ''
    const productCount = await AsyncStorage.getItem('productCount')
    const wishCount = await AsyncStorage.getItem('wishCount')
    const billCount = await AsyncStorage.getItem('billCount')
    const offerCount = await AsyncStorage.getItem('offerCount')
    const selectedTabRoute: string = props.state.routeNames[index];
    // const pushAction = StackActions.push(selectedTabRoute);
    // props.navigation.navigate(selectedTabRoute);
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [
        { name: selectedTabRoute }
      ],
    });
    // props.navigation.dispatch(resetAction);

    switch (index) {
      case 0: props.navigation.dispatch(resetAction)
        break;

      case 1: 
        props.navigation.dispatch(resetAction)
        AsyncStorage.setItem('categoryId', String(clean));
        AsyncStorage.setItem('offerId', String(clean));
        break;

      case 2:
        props.navigation.dispatch(resetAction)
        break;

      case 3:
        props.navigation.dispatch(resetAction)
        break;

      case 4:
        props.navigation.dispatch(resetAction)
        break;
    }
  };

  const createNavigationTabForRoute = (route: any): BottomNavigationTabElement => {
    const { options } = props.descriptors[route.key];
    return (
      <BottomNavigationTab
        key={route.key}
        title={options.title}
        // @ts-ignore: all Tab Screens strictly have UI Kitten Icon
        icon={options.tabBarIcon}
      />
    );
  };

  return (
    <SafeAreaLayout insets={SaveAreaInset.BOTTOM}>
      <Divider />
      <BottomNavigation
        appearance='noIndicator'
        selectedIndex={props.state.index}
        onSelect={onSelect}>
        {props.state.routes.map(createNavigationTabForRoute)}
      </BottomNavigation>
    </SafeAreaLayout>
  );
};
