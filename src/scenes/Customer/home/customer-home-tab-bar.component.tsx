import React from 'react';
import {
  BottomNavigation,
  BottomNavigationTab,
  BottomNavigationTabElement,
  Divider,
} from 'react-native-ui-kitten';
import {
  SafeAreaLayout,
  SafeAreaLayoutElement,
  SaveAreaInset,
} from '../../../components/safe-area-layout.component';
import { StackActions } from '@react-navigation/native';
import { CustomerBottomHomeScreenProps } from '../../../navigation/customer-navigator/customerHome.navigator';
import { AsyncStorage } from 'react-native';
import { scale } from 'react-native-size-matters';

export const CustomerHomeTabBar = (props: CustomerBottomHomeScreenProps): SafeAreaLayoutElement => {
  const onSelect = async (index: number): void => {
    const clean = ''
    const productCount = await AsyncStorage.getItem('productCount')
    const wishCount = await AsyncStorage.getItem('wishCount')
    const billCount = await AsyncStorage.getItem('billCount')
    const offerCount = await AsyncStorage.getItem('offerCount')
    // console.log('Tab Data',index, props.state)
    const selectedTabRoute: string = props.state.routeNames[index];
    const pushAction = StackActions.push(selectedTabRoute);
    props.navigation.navigate(selectedTabRoute);
    switch (index) {
      case 0: props.navigation.dispatch(pushAction)
        AsyncStorage.setItem('shopId', String(clean));
        break;

      case 1: if (Number(productCount) != 0) {
        props.navigation.dispatch(pushAction)
      } else {
        AsyncStorage.setItem('productCount', '1');
      }
        break;

      case 2: if (Number(wishCount) != 0) {
        props.navigation.dispatch(pushAction)
      } else {
        AsyncStorage.setItem('wishCount', '1');
      }
        break;

      case 3: if (Number(billCount) != 0) {
        props.navigation.dispatch(pushAction)
      } else {
        AsyncStorage.setItem('billCount', '1');
      }
        break;
        
      case 4: if (Number(offerCount) != 0) {
        props.navigation.dispatch(pushAction)
      } else {
        AsyncStorage.setItem('offerCount', '1');
      }
        break;
    }
  };

  const createNavigationTabForRoute = (route): BottomNavigationTabElement => {
    const { options } = props.descriptors[route.key];
    return (
      <BottomNavigationTab
      titleStyle={{fontSize: scale(10), paddingTop: scale(5)}}
        key={route.key}
        title={options.title}
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
