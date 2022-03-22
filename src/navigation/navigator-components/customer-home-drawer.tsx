import React, { useEffect, useState } from 'react';
import { ImageBackground, ImageBackgroundProps, Pressable, StyleSheet, Text, View } from 'react-native';
import { Drawer, DrawerElement, DrawerItem, IndexPath, DrawerItemElement } from '@ui-kitten/components';
import { DrawerCustomerScreenProps } from '../customer-navigator/customer.navigator';
import { useNavigation } from '@react-navigation/core';
import { AppConstants } from '../../constants';
import { AppRoute } from '../app-routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// const DrawerHeader = (): React.ReactElement<ImageBackgroundProps> => (
//   <ImageBackground
//     style={styles.header}
//     source={require('../../assets/image-background.jpeg')}
//   />
// );

export const CustomerDrawer = (props: DrawerCustomerScreenProps): DrawerElement => {

  const onItemSelect = (index: IndexPath): void => {
    const selectedTabRoute: string = props.state.routeNames[index.row];
    props.navigation.navigate(selectedTabRoute);
    props.navigation.closeDrawer();
  };

  const [data, setData] = useState({ hits: [] });
  const [logedIn, setLogedIn] = useState('');
  const { navigate } = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const value = await AsyncStorage.getItem('userDetail');
      const logIn = await AsyncStorage.getItem('logedIn');
      setLogedIn(JSON.parse(logIn));
      if (value) {
        const user = JSON.parse(value);
        axios({
          method: 'GET',
          url: AppConstants.API_BASE_URL + '/api/user/get/' + user.userId
      }).then((response) => {
        setData(response.data);
        console.log('data from async', user)
      }, (error) => {

      });

        
      };
    }
    fetchData();
  }, []);

  const DrawerHeader = (): React.ReactElement<ImageBackgroundProps & MyState> => {

    return (
      <View style={styles.MainView}>
        <View style={styles.NestedView}>
          <View style={styles.ImgBgOne} />
          <View style={styles.ImgBgTwo} />
          <Pressable onPress={() => {
            navigate(AppRoute.CUSTOMER_PROFILE);
          }}>
            <ImageBackground
              style={styles.header} borderRadius={80}
              source={{cache: 'reload', uri: AppConstants.IMAGE_BASE_URL + '/avatar/' + data.avatar }}
            />
          </Pressable>
          <Text style={styles.displayName}>{data.firstName} {data.lastName}</Text>
        </View>
      </View>
    )
  };

  const createDrawerItemForRoute = (route: any, index: number): DrawerItemElement => {
    const { options } = props.descriptors[route.key];
    return (
      <DrawerItem
        key={index}
        title={options.title}
        accessoryLeft={options.drawerIcon}
      />
    );
  };

  return (
    <Drawer
      header={DrawerHeader}
      onSelect={onItemSelect}>
      {props.state.routes.map(createDrawerItemForRoute)}
    </Drawer>
  );
};

const styles = StyleSheet.create({
  ImgBgTwo: {
    position: 'absolute',
    borderRadius: 55,
    alignSelf: 'center',
    height: 62, width: 55,
    transform: [{ scaleX: 2 }],
    backgroundColor: 'white',
    marginTop: 65
  },
  ImgBgOne: {
    height: 40,
    width: 40,
    backgroundColor: 'white',
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 18,
    position: 'absolute'
  },
  MainView: {
    height: 170
  },
  NestedView: {
    height: 140,
    width: 140,
    backgroundColor: '#D8D8D899',
    borderRadius: 80,
    alignSelf: 'center',
    marginTop: 5
  },
  displayName: {
    alignSelf: 'center',
    fontSize: 18
  },
  header: {
    height: 130,
    width: 130,
    // backgroundColor:'#D8D8D899',
    margin: 5,
    alignSelf: 'center'
  },
});
