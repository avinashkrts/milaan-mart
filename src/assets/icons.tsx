import React from 'react';
import { Icon, IconElement } from '@ui-kitten/components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Color } from '../constants/LabelConstants';
import { scale } from 'react-native-size-matters';

export const PeopleIcon = (style: any): AntDesign => (
  <SimpleLineIcons size={20} name='people' />
);

export const FilterIcon = (style: any): AntDesign => (
  <AntDesign size={scale(20)} color='#501B1D' name='filter' />
);

export const EditIcon = (style: any): AntDesign => (
  <MaterialIcons size={25} name='edit' />
);

export const PlusCircle = (style: any): AntDesign => (
  <AntDesign size={22} color={Color.COLOR} name='pluscircleo' />
);

export const SearchIcon = (style: any): AntDesign => (
  <MaterialCommunityIcons size={20} name='magnify' />
);

export const CancelIcon = (style: any): AntDesign => (
  <MaterialCommunityIcons style={style} name='close' />
);

export const NotificationIcon = (style: any): AntDesign => (
  <MaterialCommunityIcons size={20} color={'silver'} name='bell' />
);

export const Logout = (style: any): AntDesign => (
  <MaterialCommunityIcons size={20} color={'silver'} name='logout' />
);

export const CameraIcon = (style: any): AntDesign => (
  <Entypo size={22} name='camera' />
);

export const WishIcon = (style: any): AntDesign => (
  <Entypo size={scale(23)} name='heart' />
);

export const MinusIcon = (style: any): AntDesign => (
  <AntDesign size={scale(20)} name='minus' />
);

export const AddIcon = (style: any): AntDesign => (
  <AntDesign size={scale(20)} name='plus' />
);

export const RupeeIcon = (style: any): AntDesign => (
  <FontAwesome style={style} name='rupee' />
);

export const EyeIcon = (style: any): AntDesign => (
  <Feather size={22} name='eye' />
);

export const EyeOffIcon = (style: any): AntDesign => (
  <Feather size={22} name='eye-off' />
);

export const RightArrowIcon = (style: any): AntDesign => (
  <AntDesign style={style} name='right' />
);

export const PayNowIcon = (style: any): AntDesign => (
  <MaterialIcons size={20} color={'silver'} name='payment' />
);

export const WalletIcon = (style: any): AntDesign => (
  <Fontisto size={18} color={'silver'} name='wallet' />
);

export const AddCustomerIcon = (style: any): AntDesign => (
  <MaterialIcons size={20} color={'silver'} name='person-add' />
);

export const AddEmployeeIcon = (style: any): AntDesign => (
  <MaterialIcons size={20} color={'silver'} name='person-add' />
);

export const MyOrderIcon = (style: any): AntDesign => (
  <Entypo size={20} color={'silver'} name='archive' />
);

export const ValidityIcon = (style: any): AntDesign => (
  <MaterialIcons size={20} color={'silver'} name='timer' />
);

export const AddProductIcon = (style: any): AntDesign => (
  <Fontisto size={15} color={'silver'} name='shopping-basket-add' />
);

export const HelpIcon = (style: any): AntDesign => (
  <MaterialIcons size={22} color={'silver'} name='call' />
);

export const CustomerListIcon = (style: any): AntDesign => (
  <FontAwesome size={20} color={'silver'} name='list-ul' />
);

export const StockListIcon = (style: any): AntDesign => (
  <FontAwesome5 size={18} color={'silver'} name='cart-plus' />
);


export const OutOfStockIcon = (style: any): AntDesign => (
  <Fontisto size={16} color={'silver'} name='shopping-basket-remove' />
);


export const OfferIcon = (style: any): AntDesign => (
  <MaterialCommunityIcons size={16} color={'silver'} name='offer' />
);

export const DailyMessageIcon = (style: any): AntDesign => (
  <Entypo size={16} color={'silver'} name='message' />
);

export const CartIcon = (style: any): AntDesign => (
  <MaterialIcons size={scale(18)} color={'silver'} name='shopping-cart' />
);


// export const ProfileIcon = (style: any): IconElement => (
//   <Icon {...style} height={scale(25)} width={scale(25)} name='person-outline' />
// );

export const ProfileIcon = (style: any): IconElement => (
  <Ionicons size={scale(16)} color={'silver'} name='person-outline' />
);

export const DrawerHome = (style: any): IconElement => (
  <MaterialIcons size={scale(16)} color={'silver'} name='home' />
);

export const AddressIcon = (style: any): AntDesign => (
  <FontAwesome5 size={20} color={'silver'} name='address-book' />
);

export const CartNavIcon = (style: any): AntDesign => (
  <MaterialIcons size={24} color={'silver'} name='shopping-cart' />
);

export const AddressEditIcon = (style: any): AntDesign => (
  <FontAwesome5 style={style} color={'silver'} name='pen' />
);

export const PencilIcon = (style: any): AntDesign => (
  <Entypo style={style} color="rgba(128,128,128,1)" name='pencil' />
);

export const BulletIcon = (style: any): AntDesign => (
  <Entypo style={style} color="rgba(128,128,128,1)" name='dot-single' />
);











//old icons

export const PublicIcon = (style: any): AntDesign => (
  <MaterialIcons size={15} color="rgba(128,128,128,1)" name='public' />
);



export const CheckCircleIcon = (style: any): AntDesign => (
  <AntDesign size={13} color={'#1DA1F2'} name='checkcircle' />
);


export const ExperienceIcon = (style: any): AntDesign => (
  <Entypo size={15} color="rgba(128,128,128,1)" name='suitcase' />
);

export const LocationIcon = (style: any): AntDesign => (
  <Entypo size={15} color="rgba(128,128,128,1)" name='location' />
);



export const LogOutIcon = (style: any): AntDesign => (
  <Entypo size={18} color={'#1DA1F2'} name='log-out' />
);

export const FeedbackIcon = (style: any): AntDesign => (
  <MaterialIcons size={18} color={'#1DA1F2'} name='feedback' />
);

export const ArroCircle = (style: any): AntDesign => (
  <FontAwesome5 size={20} color={'#1DA1F2'} name='arrow-circle-right' />
);





export const ArrowUpIcon = (style: any): AntDesign => (
  <AntDesign size={12} name='arrowup' />
);

export const BagIcon = (style: any): AntDesign => (
  <MaterialCommunityIcons size={20} name='wallet-travel' />
);

export const CompanyIcon = (style: any): AntDesign => (
  <MaterialCommunityIcons size={20} name='office-building' />
);

export const BackIcon = (props: any): IconElement => (
  <Icon {...props} name='arrow-back'/>
);

export const LayoutIcon = (props: any): IconElement => (
  <Icon {...props} name='layout-outline'/>
);

export const PersonIcon = (props: any): IconElement => (
  <Icon {...props} name='person-outline'/>
);

export const MoreVerticalIcon = (props: any): IconElement => (
  <Icon {...props} name='more-vertical'/>
);

export const LogoutIcon = (props: any): IconElement => (
  <Icon {...props} name='log-out-outline'/>
);

export const InfoIcon = (props: any): IconElement => (
  <Icon {...props} name='info-outline'/>
);

export const AlertTriangleIcon = (props: any): IconElement => (
  <Icon {...props} name='alert-triangle-outline'/>
);

// export const EyeIcon = (props: any): IconElement => (
//   <Icon {...props} name='eye-outline'/>
// );

// export const EyeOffIcon = (props: any): IconElement => (
//   <Icon {...props} name='eye-off-outline'/>
// );

export const MenuIcon = (props: any): IconElement => (
  <Icon {...props} name='menu-outline'/>
);

export const HomeIcon = (props: any): IconElement => (
  <Icon {...props} name='home-outline'/>
);

export const DoneAllIcon = (props: any): IconElement => (
  <Icon {...props} name='done-all-outline'/>
);

export const GridIcon = (props: any): IconElement => (
  <Icon {...props} name='grid-outline'/>
);

// export const SearchIcon = (props: any): IconElement => (
//   <Icon {...props} name='search-outline'/>
// );