import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';
import { Avatar, Divider, List, ListItem, ListItemElement, Text, ThemedComponentProps } from '@ui-kitten/components';
import axios from 'axios';
import React, { PureComponent } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Modal from 'react-native-modal';
import { createFilter } from 'react-native-search-filter';
import { scale } from 'react-native-size-matters';

import { AddIcon, CancelIcon, MenuIcon, MinusIcon, RupeeIcon, SearchIcon, WishIcon } from '../../../assets/icons';
import { Styles } from '../../../assets/styles';
import { CategoryImageButton } from '../../../components/categoryImageButton';
import { Item } from '../../../components/drop-item';
import { SafeAreaLayout, SaveAreaInset } from '../../../components/safe-area-layout.component';
import { Toolbar } from '../../../components/toolbar.component';
import { AppConstants, Color, LableText } from '../../../constants';
import { AppRoute } from '../../../navigation/app-routes';
import { CartNavigatorProp } from '../../../navigation/customer-navigator/customer.navigator';
import { ProductListScreenProps } from '../../../navigation/customer-navigator/product-list.navigator';
import { Brand } from '../../../redux/modules/brand.modules';
import { OfferData } from './offerData';

const KEYS_TO_FILTERS = ['name'];

interface ProductPageProps {
  ProductListScreenProps: ProductListScreenProps
}

interface ProductPageState {
  name: String,
  allBrand: Brand[],
  refreshing: Boolean
}

type Props = ProductListScreenProps & CartNavigatorProp & ThemedComponentProps & ProductPageProps

export class ProductListScreen extends PureComponent<Props, ProductPageState & any> {
  constructor(props: Props) {
    super(props)
    this.state = {
      searchTerm: '',
      searchVisible1: '',
      allProduct: [],
      allCart: [],
      allCategory: [],
      allBrand: [],
      selectedSubCategory: '',
      selectedCategory: 0,
      selectedBrand: '',
      userData: [],
      shopId: AppConstants.SHOP_ID,
      allMeasurement: [],
      wishList: '',
      search: '',
      lat: '',
      long: '',
      searchVisible: false,
      refreshing: false,
      location: '',
      isCart: false,
      user: [],
      allVarient: [],
      logedIn: false,
      variantVisible: false,
      temp_variant: [],
      productName: '',
      productWithVariant: [],
      tempProductWithVariant: [],
      subCategory: [],
      allProductWithVariant: [],
      check: true,
      allData: [
        {
          url: '/api/lookup/getallmeasurementtype',
          method: 'GET',
          variable: 'allMeasurement',
        }
      ],
      single: false,
      shopName: '',
    };

    this._onRefresh = this._onRefresh.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.navigateToCart = this.navigateToCart.bind(this);
    this.getSubCategory = this.getSubCategory.bind(this);
    this.getAllSubCategory = this.getAllSubCategory.bind(this);
    this.getMeasurement = this.getMeasurement.bind(this);
    this.initialData = this.initialData.bind(this);
    this.getCart = this.getCart.bind(this);
    this.renderVariant = this.renderVariant.bind(this);
    this.renderProduct = this.renderProduct.bind(this);
    this.getUser = this.getUser.bind(this);
    this.getAllCategory = this.getAllCategory.bind(this);
    this.selectCategory = this.selectCategory.bind(this);
  }

  async componentDidMount() {
    this.initialData()
    this.props.navigation.addListener('focus', () => {
      this.setState({
        isCart: false,
        allCart: []
      })
      this.initialData()
    })
  }

  async initialData() {
    // Alert.alert("")
    const { allData } = this.state;
    let userDetail = await AsyncStorage.getItem('userDetail');
    let categoryId = await AsyncStorage.getItem('categoryId');
    let offerId = await AsyncStorage.getItem('offerId');
    let userData = JSON.parse(userDetail);

    const logedIn = await AsyncStorage.getItem('logedIn');
    const shopIdAsync = await AsyncStorage.getItem('shopId')
    const shopName = await AsyncStorage.getItem('shopName')

    this.setState({
      userData: userData,
      selectedSubCategory: '',
      selectedBrand: '',
      check: true
    })

    this.getMeasurement();
    this.getAllCategory();

    if (null != logedIn && logedIn === 'true') {
      this.getCart(userData.userId)
      this.getUser(userData.userId)
    }

    if (categoryId != null && categoryId !== '') {
      this.getSubCategory(categoryId)
      this.getBrandByCategory(categoryId)
      this.getProductByCategory(categoryId)

    } else if (offerId != null && offerId !== '') {
      var productUrl = ''
      var variantUrl = ''
      OfferData.map((offer, index) => {
        if (offer.id == offerId) {
          switch (offer.name) {
            case "HOT_SELL":
              productUrl = '/api/item/get/hotSell/1'
              variantUrl = '/api/itemlist/getby/hotsell/1'
              break;
            case "BAGGAGE":
              productUrl = '/api/item/get/baggage/1'
              variantUrl = '/api/itemlist/getby/baggage/1'
              break;
            case "MILAAN_OFFER":
              productUrl = '/api/item/get/milaanoffer/1'
              variantUrl = '/api/itemlist/getby/milaanoffer/1'
              break;
            case "ADITIONAL_DISCOUNT":
              productUrl = '/api/item/get/aditionaldiscount/1'
              variantUrl = '/api/itemlist/getby/aditionaldiscount/1'
              break;
          }
        }
      })
      this.getAllSubCategory()
      this.getAllBrand()
      axios({
        method: 'GET',
        url: AppConstants.API_BASE_URL + productUrl,
      }).then((response) => {
        if (null != response.data) {
          axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + variantUrl,
          }).then((response1) => {
            if (null != response1.data) {
              if (response.data && response.data != null && response1.data && response1.data != null) {
                var data = []
                for (var i = 0; i < response.data.length; i++) {
                  var data1 = []
                  var data2 = []
                  data1.push(response.data[i])
                  for (var j = 0; j < response1.data.length; j++) {
                    if (response.data[i].id == response1.data[j].productId) {
                      data2.push(response1.data[j])
                    }
                  }
                  data1[0].itemList = data2
                  data.push(data1[0])
                }
                this.setState({
                  productWithVariant: data,
                  allProductWithVariant: data
                })
              }
            }
          }, (error) => {
            Alert.alert("Server error!.")
          });
        }
      }, (error) => {
        Alert.alert("Server error!.")
      });
    } else {
      this.getAllSubCategory();
      this.getAllBrand();
      this.setState({
        productWithVariant: [],
        allProductWithVariant: []
      })
      axios({
        method: 'GET',
        url: AppConstants.API_BASE_URL + '/api/item/getall/productonline/byshopid/' + AppConstants.SHOP_ID + '/true',
      }).then((response) => {
        if (null != response.data) {
          axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/itemlist/getall/variant/onlinebyshopid/' + AppConstants.SHOP_ID + '/true',
          }).then((response1) => {
            if (null != response1.data) {
              if (response.data && response.data != null && response1.data && response1.data != null) {
                var data = []
                for (var i = 0; i < response.data.length; i++) {
                  var data1 = []
                  var data2 = []
                  data1.push(response.data[i])
                  for (var j = 0; j < response1.data.length; j++) {
                    if (response.data[i].id == response1.data[j].productId) {
                      data2.push(response1.data[j])
                    }
                  }
                  data1[0].itemList = data2
                  data.push(data1[0])
                }
                this.setState({
                  productWithVariant: data,
                  allProductWithVariant: data
                })
              }
            }
          }, (error) => {
            Alert.alert("Server error!.")
          });
        }
      }, (error) => {
        Alert.alert("Server error!.")
      });
    }
  }

  getProductByCategory(categoryId) {
    axios({
      method: 'GET',
      url: AppConstants.API_BASE_URL + '/api/item/get/onlinecategory/' + categoryId + '/true',
    }).then((response) => {
      if (null != response.data) {
        axios({
          method: 'GET',
          url: AppConstants.API_BASE_URL + '/api/itemlist/getall/variant/onlinebyshopid/' + AppConstants.SHOP_ID + '/true',
        }).then((response1) => {
          if (null != response1.data) {
            if (response.data && response.data != null && response1.data && response1.data != null) {
              var data = []
              for (var i = 0; i < response.data.length; i++) {
                var data1 = []
                var data2 = []
                data1.push(response.data[i])
                for (var j = 0; j < response1.data.length; j++) {
                  if (response.data[i].id == response1.data[j].productId) {
                    data2.push(response1.data[j])
                  }
                }
                data1[0].itemList = data2
                data.push(data1[0])
              }
              this.setState({
                productWithVariant: data,
                allProductWithVariant: data
              })
            }
          }
        }, (error) => {
          Alert.alert("Server error!.")
        });
      }
    }, (error) => {
      Alert.alert("Server error!.")
    });
  }

  getUser(userId: any) {
    axios({
      method: 'GET',
      url: AppConstants.API_BASE_URL + '/api/user/get/' + userId
    }).then((response: any) => {
      if (null != response.data) {
        this.setState({
          user: response.data,
          logedIn: true
        })
      }
    }, (error: any) => {
      console.log(error)
    });
  }

  getMeasurement() {
    axios({
      method: 'GET',
      url: AppConstants.API_BASE_URL + '/api/measurement/getbyshopid/' + AppConstants.SHOP_ID
    }).then((response: any) => {
      if (null != response.data) {
        this.setState({
          allMeasurement: response.data
        })
      }
    }, (error: any) => {
      console.log(error)
    });
  }

  loadData() {
    const { productWithVariant, tempProductWithVariant } = this.state
    var last = tempProductWithVariant.length + 20
    var data = []
    for (var i = 0; i <= last; i++) {
      data.push(productWithVariant[i])
    }
    this.setState({
      tempProductWithVariant: data
    })
  }

  getSubCategory(catId: any) {
    axios({
      method: 'GET',
      url: AppConstants.API_BASE_URL + '/api/subcategory/getallcategory/' + catId
    }).then((response: any) => {
      if (null != response.data) {
        var subCat = response.data
        subCat.unshift({
          id: 0,
          avatar: null,
          title: "ALL",
          name: "ALL",
          shopId: "MILAAN63",
          categoryId: 0,
          createdOn: "2022-04-01T07:27:45.000+0000",
          active: true,
          deleted: false,
          online: true
        })
        this.setState({
          subCategory: subCat
        })
      }
    }, (error: any) => {
      console.log(error)
    });
  }

  getAllCategory() {
    axios({
      method: 'GET',
      url: AppConstants.API_BASE_URL + '/api/category/getallonline/1',
    }).then((response) => {
      if (null != response.data) {
        var data = response.data
        data.unshift({
          id: 0,
          name: "All",
          avatar: null,
          title: "All",
          shopId: "MILAAN63",
          active: true,
          online: true,
          deleted: false
        })
        this.setState({
          allCategory: data
        })
      }
    }, (error) => {
      Alert.alert("Server error!.")
    });
  }

  getAllSubCategory() {
    axios({
      method: 'GET',
      url: AppConstants.API_BASE_URL + '/api/subcategory/getallonline/byshopid/MILAAN63/1'
    }).then((response: any) => {
      if (null != response.data) {
        var subCat = response.data
        subCat.unshift({
          id: 0,
          avatar: null,
          title: "ALL",
          name: "ALL",
          shopId: "MILAAN63",
          categoryId: 0,
          createdOn: "2022-04-01T07:27:45.000+0000",
          active: true,
          deleted: false,
          online: true
        })
        this.setState({
          subCategory: subCat
        })
      }
    }, (error: any) => {
      console.log(error)
    });
  }

  getAllBrand() {
    axios({
      method: 'GET',
      url: AppConstants.API_BASE_URL + '/api/brand/getallonline/brand/1',
    }).then((response: any) => {
      if (null != response.data) {
        var brand = response.data
        brand.unshift({
          id: 0,
          avatar: null,
          title: "ALL",
          name: "ALL",
          shopId: "MILAAN63",
          category: 5,
          subCategoryId: 1,
          active: true,
          deleted: false,
          online: true
        })
        this.setState({
          allBrand: brand
        })
      }
    }, (error: any) => {
      console.log(error)
    });
  }

  getBrandByCategory(id: any) {
    axios({
      method: 'GET',
      url: AppConstants.API_BASE_URL + '/api/brand/get/bycategory/' + id
    }).then((response: any) => {
      if (null != response.data) {
        var brand = response.data
        brand.unshift({
          id: 0,
          avatar: null,
          title: "ALL",
          name: "ALL",
          shopId: "MILAAN63",
          category: 5,
          subCategoryId: 1,
          active: true,
          deleted: false,
          online: true
        })
        this.setState({
          allBrand: brand
        })
      }
    }, (error: any) => {
      console.log(error)
    });
  }

  addToCart(productId, itemId) {
    const { shopId, check, logedIn, productWithVariant, userData } = this.state
    if (check) {
      this.setState({ check: false })
      if (null != logedIn && logedIn) {
        // Alert.alert('' + userData.userId + productId + logedIn + shopId)
        axios({
          method: 'POST',
          url: AppConstants.API_BASE_URL + '/api/cart/create',
          data: {
            shopId: shopId,
            userId: userData.userId,
            productId: productId,
            productQuantity: 1
          }
        }).then((response) => {
          if (null != response.data) {
            if (response.data.status === 'true') {
              // this.setState({
              //   temp_variant: [],
              //   allCart: []
              // })
              Alert.alert("Product added to cart.")
              // this._onRefresh()          
              // productWithVariant.map((data, i) => {
              //   if (data.id == itemId) {
              //     console.log(data.itemList)
              //     this.setState({
              //       temp_variant: data.itemList
              //     })
              //   }
              // })
              axios({
                method: 'GET',
                url: AppConstants.API_BASE_URL + "/api/cart/get/cartby/shopid/userid/" + AppConstants.SHOP_ID + '/' + userData.userId,
              }).then((response) => {
                if (null != response.data) {
                  this.setState({
                    allCart: response.data,
                    check: true
                  })

                  if (response.data[0].productList.length > 0) {
                    this.setState({
                      isCart: true,
                      allCart: response.data
                    })
                  }
                }
              }, (error) => {
                this.setState({ check: true })
                Alert.alert("Server error!.")
              });
            } else {
              Alert.alert("Product allready exists in your cart.")
            }
          }
        }, (error) => {
          this.setState({ check: true })
          console.log(error)
        });
      } else {
        this.setState({ check: true })
        const pushAction = StackActions.push(AppRoute.AUTH)
        this.props.navigation.dispatch(pushAction);
      }
    }
  }

  navigateToCart() {
    const pushAction = StackActions.push(AppRoute.CART);
    this.props.navigation.dispatch(pushAction);
  }

  selectSubCategory(id: any, brandName: any) {
    const { shopId } = this.state
    if (id == 0) {
      this._onRefresh()
    } else {
      // axios({
      //   method: 'GET',
      //   url: AppConstants.API_BASE_URL + '/api/brand/getbrand/bysubcategoryid/' + id,
      // }).then((response) => {
      //   if (null != response.data) {
      //     var brand = response.data
      //     brand.unshift({
      //       id: 0,
      //       avatar: null,
      //       title: "ALL",
      //       name: "ALL",
      //       shopId: "MILAAN63",
      //       category: 5,
      //       subCategoryId: 1,
      //       active: true,
      //       deleted: false,
      //       online: true
      //     })
      //     this.setState({
      //       allBrand: brand,
      //       selectedSubCategory: id,
      //       selectedBrand: 0
      //     })
      //   }
      // }, (error) => {
      //   Alert.alert("Server error!.")
      // });

      axios({
        method: 'GET',
        url: AppConstants.API_BASE_URL + '/api/item/getitem/online/' + id + '/true',
      }).then((response) => {
        if (null != response.data) {
          axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/itemlist/getall/variant/onlinebyshopid/' + AppConstants.SHOP_ID + '/true',
          }).then((response1) => {
            if (null != response1.data) {
              if (response.data && response.data != null && response1.data && response1.data != null) {
                var data = []
                for (var i = 0; i < response.data.length; i++) {
                  var data1 = []
                  var data2 = []
                  data1.push(response.data[i])
                  for (var j = 0; j < response1.data.length; j++) {
                    if (response.data[i].id == response1.data[j].productId) {
                      data2.push(response1.data[j])
                    }
                  }
                  data1[0].itemList = data2
                  data.push(data1[0])
                }
                this.setState({
                  productWithVariant: data,
                  selectedSubCategory: id
                })
              }
            }
          }, (error) => {
            Alert.alert("Server error!.")
          });
        }
      }, (error) => {
        Alert.alert("Server error!.")
      });
    }
  }

  selectBrand(id: any, brandName: any) {
    const { shopId, selectedSubCategory } = this.state
    if (id == 0) {
      this.selectSubCategory(selectedSubCategory, "")
    } else {
      axios({
        method: 'GET',
        url: AppConstants.API_BASE_URL + '/api/item/get/onlinebrand/' + id + '/true',
      }).then((response) => {
        if (null != response.data) {
          axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/itemlist/getall/variant/onlinebyshopid/' + AppConstants.SHOP_ID + '/true',
          }).then((response1) => {
            if (null != response1.data) {
              if (response.data && response.data != null && response1.data && response1.data != null) {
                var data = []
                for (var i = 0; i < response.data.length; i++) {
                  var data1 = []
                  var data2 = []
                  data1.push(response.data[i])
                  for (var j = 0; j < response1.data.length; j++) {
                    if (response.data[i].id == response1.data[j].productId) {
                      data2.push(response1.data[j])
                    }
                  }
                  data1[0].itemList = data2
                  data.push(data1[0])
                }
                this.setState({
                  productWithVariant: data,
                  selectedBrand: id
                })
              }
            }
          }, (error) => {
            Alert.alert("Server error!.")
          });
        }
      }, (error) => {
        Alert.alert("Server error!.")
      });
    }
  }

  navigateProductDetail(id, shopId) {
    const pushAction = StackActions.push(AppRoute.CUSTOMER_PRODUCT_DETAIL, { productId: String(id), shopId: String(shopId) });
    this.props.navigation.dispatch(pushAction)
  }

  selectCategory(id, shopId) {
    this.setState({ selectedCategory: id })
    if (id == 0) {
      this._onRefresh(),
        this.getAllSubCategory();
      axios({
        method: 'GET',
        url: AppConstants.API_BASE_URL + '/api/item/getall/productonline/byshopid/' + AppConstants.SHOP_ID + '/true',
      }).then((response) => {
        if (null != response.data) {
          axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/itemlist/getall/variant/onlinebyshopid/' + AppConstants.SHOP_ID + '/true',
          }).then((response1) => {
            if (null != response1.data) {
              if (response.data && response.data != null && response1.data && response1.data != null) {
                var data = []
                for (var i = 0; i < response.data.length; i++) {
                  var data1 = []
                  var data2 = []
                  data1.push(response.data[i])
                  for (var j = 0; j < response1.data.length; j++) {
                    if (response.data[i].id == response1.data[j].productId) {
                      data2.push(response1.data[j])
                    }
                  }
                  data1[0].itemList = data2
                  data.push(data1[0])
                }
                this.setState({
                  productWithVariant: data,
                  allProductWithVariant: data
                })
              }
            }
          }, (error) => {
            Alert.alert("Server error!.")
          });
        }
      }, (error) => {
        Alert.alert("Server error!.")
      });
    } else {
      this.getProductByCategory(id)
      this.getSubCategory(id)
    }
  }

  checkVariant(id) {
    return id.productId == 1
  }

  async handleAddToCart(productId, productName, itemList) {
    const { userData } = this.state;
    const logedIn = await AsyncStorage.getItem('logedIn');
    if (itemList.length > 0) {
      this.setState({
        temp_variant: itemList,
        variantVisible: true,
        productName: productName
      })
    }
  }

  async handleWishList(productId) {
    const { isSelectedWish, userData } = this.state
    const logedIn = await AsyncStorage.getItem('logedIn');
    if (null != logedIn && logedIn === 'true') {
      axios({
        method: "GET",
        url: AppConstants.API_BASE_URL + '/api/user/wishlist/add/' + userData.userId + "/" + productId,
      }).then((response) => {
        this.getUser(userData.userId)
        this.setState({
          isSelectedWish: !isSelectedWish
        })
      }, (error) => {
        Alert.alert("Server error.")
      });
    } else {
      this.props.navigation.navigate(AppRoute.AUTH);
    }
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    this.initialData().then(() => {
      this.setState({ refreshing: false });
    });
  }

  productSearch(filteredProduct) {
    const { allProductWithVariant, searchTerm } = this.state
    var filteredProduct1 = []
    filteredProduct1 = allProductWithVariant ? allProductWithVariant.length > 0 ? allProductWithVariant.filter(createFilter(filteredProduct, KEYS_TO_FILTERS)) : null : null
    if (filteredProduct1 != null) {
      if (filteredProduct1.length > 0) {
        if (searchTerm != '' && searchTerm != null) {
          this.setState({
            productWithVariant: []
          })
          this.getAllFilteredProduct(filteredProduct1)
          Keyboard.dismiss();
        } else {
          Alert.alert("Please type product name to search")
        }
      } else {
        Alert.alert("No product found.")
        this.setState({
          searchTerm: ''
        })
        this._onRefresh()
      }
    }
  }

  async getAllFilteredProduct(product) {
    var tempProd: any = []
    await product.map((data) => {
      tempProd.push(data)
    });
    this.setState({
      productWithVariant: tempProd
    })
    // tempProd.push(product[0])
    if (tempProd.length > 0) {
      axios({
        method: 'GET',
        url: AppConstants.API_BASE_URL + '/api/item/getitem/online/' + product[0].subCategoryId + '/true',
      }).then((response) => {
        if (null != response.data) {
          axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/itemlist/getall/variant/onlinebyshopid/' + AppConstants.SHOP_ID + '/true',
          }).then((response1) => {
            if (null != response1.data) {
              if (response.data && response.data != null && response1.data && response1.data != null) {
                var data = []
                for (var i = 0; i < response.data.length; i++) {
                  var data1 = []
                  var data2 = []
                  data1.push(response.data[i])
                  for (var j = 0; j < response1.data.length; j++) {
                    if (response.data[i].id == response1.data[j].productId) {
                      data2.push(response1.data[j])
                    }
                  }
                  data1[0].itemList = data2
                  tempProd.push(data1[0])
                }
                this.setState({
                  productWithVariant: tempProd,
                })
                // console.log('222', data)

                // tempProd.concat(data)
              }
            }
          }, (error) => {
            Alert.alert("Server error!.")
          });
        }
      }, (error) => {
        Alert.alert("Server error!.")
      });

      axios({
        method: 'GET',
        url: AppConstants.API_BASE_URL + '/api/item/get/onlinecategory/' + product[0].category + '/true'
      }).then((response) => {
        if (null != response.data) {
          axios({
            method: 'GET',
            url: AppConstants.API_BASE_URL + '/api/itemlist/getall/variant/onlinebyshopid/' + AppConstants.SHOP_ID + '/true',
          }).then((response1) => {
            if (null != response1.data) {
              if (response.data && response.data != null && response1.data && response1.data != null) {
                var data = []
                for (var i = 0; i < response.data.length; i++) {
                  var data1 = []
                  var data2 = []
                  data1.push(response.data[i])
                  for (var j = 0; j < response1.data.length; j++) {
                    if (response.data[i].id == response1.data[j].productId) {
                      data2.push(response1.data[j])
                    }
                  }
                  data1[0].itemList = data2
                  tempProd.push(data1[0])
                  // console.log('wwww', data)
                }

                // console.log('wwww', data)
                // tempProd.concat(data)
                this.setState({
                  productWithVariant: tempProd,
                  searchVisible1: false,
                  isProduct: true,
                  searched: true,
                })
              }
            }
          }, (error) => {
            Alert.alert("Server error!.")
          });
        }
      }, (error) => {
        Alert.alert("Server error!.")
      });
    }
    // console.log("data", tempProd)
    // this.setState({
    //     productWithVariant: tempProd,
    // })
  }

  clearSearch() {
    // this.setState({
    //   searchTerm: '',
    //   allProduct: this.props.productData
    // })
  }

  toggleModal(modal) {
    switch (modal) {
      case 'VARIANT':
        this.setState({
          variantVisible: false
        })
        break;
      case 'SEARCH':
        this.setState({
          searchVisible: false
        })
        break;
    }

  }

  toggleModal2() {
    this.setState({
      searchVisible1: false
    })
  }

  handleSearchLatLong(data, details) {
    this.toggleModal("SEARCH");

    axios({
      url: 'https://maps.googleapis.com/maps/api/place/details/json?key=' + AppConstants.GOOGLE_MAP_KEY + '&place_id=' + data.place_id
    }).then((response) => {
      const { data: { result: { geometry: { location } } } } = response
      const { lat, lng } = location
      AsyncStorage.setItem('latitude', String(lat))
      AsyncStorage.setItem('longitude', String(lng))
      AsyncStorage.setItem('location', String(data.structured_formatting.main_text))

      axios({
        method: 'GET',
        url: AppConstants.API_BASE_URL + '/api/product/getbylocation/' + lat + '/' + lng,
      }).then((response) => {
        this.setState({
          allProduct: response.data,
          lat: lat,
          long: lng,
          searchVisible: false,
          location: data.structured_formatting.main_text
        })
      }, (error) => {
        Alert.alert("Server error.")
      });
    }, (error) => {
      console.log(error);
    })
  }

  async onCurrentLocation() {
    this.toggleModal("SEARCH");
    Geolocation.getCurrentPosition((position) => {
      var lat = position.coords.latitude
      var long = position.coords.longitude
      AsyncStorage.setItem('latitude', String(lat))
      AsyncStorage.setItem('longitude', String(long))
      AsyncStorage.setItem('location', 'Current Location')

      axios({
        method: 'GET',
        url: AppConstants.API_BASE_URL + '/api/product/getbylocation/' + lat + '/' + long,
      }).then((response) => {
        this.setState({
          allProduct: response.data,
          lat: position.coords.latitude,
          long: position.coords.longitude,
          searchVisible: false,
          location: 'Current Location'
        })
      }, (error) => {
        Alert.alert("Server error.")
      });
    }, (erroe) => {

    }, { enableHighAccuracy: true })
  }

  search(index) {
    var product = [index]
    this.setState({
      productWithVariant: product,
      searchVisible1: false,
      searchTerm: index.name
    })
  }

  searchUpdated(term) {
    this.setState({
      searchTerm: term,
      searchVisible1: false,
      searched: false,
      isProduct: false
    })
  }

  getCart(userId) {
    axios({
      method: 'GET',
      url: AppConstants.API_BASE_URL + "/api/cart/get/cartby/shopid/userid/" + AppConstants.SHOP_ID + '/' + userId,
    }).then((response) => {
      if (null != response.data) {
        this.setState({
          allCart: response.data,
          check: true
        })

        if (response.data[0].productList.length > 0) {
          this.setState({
            isCart: true
          })
        }
      }
    }, (error) => {
      Alert.alert("Server error!.")
    });
  }

  handleIncrease(productId, cartId, quantity, stock) {
    const { user, check } = this.state;
    if (check) {
      this.setState({ check: false })
      if (quantity >= stock) {
        this.setState({ check: true })
        Alert.alert(`Only ${stock} product left.`)
      } else {
        axios({
          method: 'PUT',
          url: AppConstants.API_BASE_URL + '/api/cart/cartincrease/' + cartId + '/' + productId
        }).then((response) => {
          this.getCart(user.userId)
        }, (error) => {
          this.setState({ check: true })
          Alert.alert("Server problem")
        })
      }
    }
  }

  handleDecrease(productId, cartId, quantity) {
    const { user, check } = this.state
    if (check) {
      this.setState({ check: false })
      if (quantity <= 1) {
        this.setState({ check: true })
        Alert.alert("You have already selected minimum quantity.")
      } else {
        axios({
          method: 'PUT',
          url: AppConstants.API_BASE_URL + '/api/cart/cartdecrease/' + cartId + '/' + productId
        }).then((response) => {
          this.getCart(user.userId)
        }, (error) => {
          this.setState({ check: true })
          Alert.alert("Server problem")
        })
      }
    }
  }

  renderProduct = ({ item }: any): ListItemElement => (
    item.itemList != null && item.itemList.length > 0 ?
      <ListItem style={{ borderBottomColor: 'rgba(200, 200, 200, 1)', borderBottomWidth: scale(1), paddingVertical: -5 }}>
        <View style={Styles.product_list_main}>
          <View style={Styles.product_list_img}>
            <TouchableOpacity onPress={() => { this.navigateProductDetail(item.id, item.shopId) }}>
              <View style={[Styles.all_Item_Image_2, Styles.center]}>
                <Avatar source={{ uri: AppConstants.IMAGE_BASE_URL + '/product/' + item.productImage }} style={Styles.product_avatar} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={Styles.product_list_detail}>
            <View style={Styles.all_Item_List1}>
              <View style={Styles.all_Item_Detail}>
                <View style={{ backgroundColor: '#fff', paddingHorizontal: 0 }}>
                  <View style={{ flexDirection: 'row' }}>
                    {/* {null != this.state.allBrand ? this.state.allBrand.map((brand, index) => {
                      if (brand.id == item.brand) {
                        return ( */}
                    <View style={{ width: '80%', flexWrap: 'wrap', flexDirection: 'row' }}>
                      <Text style={{ color: '#000', fontFamily: 'notoserif', fontWeight: '600', marginTop: scale(5), fontSize: scale(12) }}>{item.name}</Text>
                    </View>
                    {/* );
                      }
                    }) : null} */}
                    {/* {this.props.userData != null && this.props.userData.length > 0 ? */}
                    <View style={[Styles.product_2nd_wish_view]}>
                      <TouchableOpacity onPress={() => { this.handleWishList(item.id) }}>
                        <Text
                          style={this.state.logedIn && this.state.user.wishList != null && this.state.user.wishList.split(',').some((wishData) => (wishData == item.id)) ? Styles.selected_wish_icon : Styles.wish_icon
                          }
                        >
                          <WishIcon />
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {/* : null
                                } */}
                  </View>
                  {this.state.allMeasurement.length > 0 ? this.state.allMeasurement.map((brand, index) => {
                    if (brand.id == item.itemList[0].measurement) {
                      return (
                        <>
                          <Text style={{ fontFamily: 'notoserif', color: Color.COLOR_ITEM_NAME, marginTop: 5 }}>{item.itemList[0].unitQuantity} {brand.name}</Text>
                        </>
                      );
                    }
                  }) : null}
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <Text style={Styles.old_price_text}>MRP {item.itemList[0].mrp.toFixed(2)}</Text>
                    <Text style={{ color: '#000', fontWeight: '600', fontSize: scale(14) }}><RupeeIcon fontSize={scale(14)} />{item.itemList[0].unitSellingPrice}/pc</Text>
                    <Text style={[Styles.offer_price_text]}>
                      {Math.round(item.itemList[0].customerBundleOffer)}% off
                    </Text>
                    {/* {item.offerActiveInd ?
                      <Text style={{ color: Color.COLOR, fontSize: 20, textDecorationLine: 'line-through' }}>{item.oldPrice}</Text>
                      : null
                    } */}
                  </View>
                  {item.itemList[0].bundleQuantity > 1 ? <Text style={{ fontSize: scale(12), color: Color.OFFER }} ><RupeeIcon fontSize={scale(14)} />{(item.itemList[0].bundlePrice / item.itemList[0].bundleQuantity).toFixed(2)}/pc (Buy {item.itemList[0].bundleQuantity} or more)</Text> : null}
                  {/* {null != item.offerActiveInd ? item.offerActiveInd ?

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                      <Text style={{ fontFamily: 'notoserif', color: Color.COLOR }}>{item.offerPercent} % off</Text>
                      <Text style={{ fontFamily: 'notoserif', color: Color.COLOR }}>{item.offerActiveInd && item.offerTo ? item.offerTo.substr(8, 2) + "/" + item.offerTo.substr(5, 2) + "/" + item.offerTo.substr(0, 4) : null}</Text>
                    </View> :
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                      <Text style={{ fontFamily: 'notoserif', color: Color.COLOR, marginTop: 2.5 }}></Text>
                      <Text style={{ fontFamily: 'notoserif', color: Color.COLOR }}></Text>
                    </View> : null
                  } */}
                </View>
                <View style={{ justifyContent: 'flex-end', width: '100%', flex: 1, flexDirection: 'row' }}>
                  <TouchableOpacity onPress={() => { this.handleAddToCart(item.id, item.name, item.itemList) }}>
                    <View style={[{ backgroundColor: Color.COLOR, marginVertical: 5, alignSelf: 'center', paddingVertical: scale(5), borderRadius: 5, paddingHorizontal: scale(10) }, Styles.center]}>
                      <Text style={{ fontFamily: 'notoserif', color: Color.BUTTON_NAME_COLOR }}>Add to cart</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {/* {item.stock ? item.stock > 0 ?
                                <TouchableOpacity onPress={() => { this.handleAddToCart(item.id, item.shopId) }}>
                                    <View style={[{ backgroundColor: Color.COLOR, marginVertical: 10, alignSelf: 'center', paddingVertical: 5, borderRadius: 5, width: '90%' }, Styles.center]}>
                                        <Text style={{ color: Color.BUTTON_NAME_COLOR }}>Add to cart</Text>
                                    </View>
                                </TouchableOpacity> :

                                <TouchableOpacity >
                                    <View style={[{ backgroundColor: Color.COLOR, marginVertical: 10, alignSelf: 'center', paddingVertical: 5, borderRadius: 5, width: '90%' }, Styles.center]}>
                                        <Text style={{ color: Color.BUTTON_NAME_COLOR }}>Out of Stock</Text>
                                    </View>
                                </TouchableOpacity> :
                                <TouchableOpacity >
                                    <View style={[{ backgroundColor: Color.COLOR, marginVertical: 10, alignSelf: 'center', paddingVertical: 5, borderRadius: 5, width: '90%' }, Styles.center]}>
                                        <Text style={{ color: Color.BUTTON_NAME_COLOR }}>Out of Stock</Text>
                                    </View>
                                </TouchableOpacity>
                            } */}
              </View>
            </View>
          </View>

        </View>
      </ListItem> : <></>
  )

  renderVariant = ({ item }: any): ListItemElement => {
    var count = 0;
    const { allCart } = this.state
    return (
      <ListItem style={{ borderBottomColor: 'rgba(0,0,0,1)', borderBottomWidth: 1 }}>
        {item != null ?
          <View style={Styles.variant_main_view}>
            <View style={Styles.variant_view_1}>
              <View style={Styles.variant_price_view}>
                <View style={{ width: '55%', flexDirection: "column" }}>
                  {/* <Text>{allCart != null && allCart.length > 0 ? allCart[0].productList != null ? allCart[0].productList.length : null : null} Data</Text> */}

                  {this.state.allMeasurement.length > 0 ? this.state.allMeasurement.map((brand, index) => {
                    if (brand.id == item.measurement) {
                      return (
                        <View>
                          <Text style={{ fontSize: scale(14), fontFamily: 'notoserif' }}>{item.unitQuantity} {brand.name}</Text>
                        </View>
                      );
                    }
                  }) : null}
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={Styles.old_price_text}>MRP {item.mrp.toFixed(2)}</Text>
                    <Text style={Styles.price_text}><RupeeIcon fontSize={scale(14)} />{item.unitSellingPrice.toFixed(2)}</Text>
                  </View>
                  <View>
                    <Text style={[Styles.offer_price_text]}>
                      {Math.round(item.customerBundleOffer)}% off
                    </Text>
                    {item.bundleQuantity > 1 ? <Text style={{ fontSize: scale(12), color: Color.OFFER }} ><RupeeIcon fontSize={scale(14)} />{(item.bundlePrice / item.bundleQuantity).toFixed(2)}/pc (Buy {item.bundleQuantity} or more)</Text> : null}
                  </View>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>

                  {item.stock ? item.stock > 0 ?
                    this.state.logedIn ?
                      this.state.allCart != '' && this.state.allCart.length > 0 ?
                        this.state.allCart[0].productList != null && this.state.allCart[0].productList.length > 0 ?
                          this.state.allCart[0].productList.map((data, index) => {
                            if (data.productId == item.id) {
                              if (count == 0) {
                                count++
                                return (
                                  <>
                                    <View style={Styles.cart_quantity_view}>
                                      <Pressable onPress={() => { this.handleDecrease(item.id, data.cartId, data.productQuantity) }} style={Styles.cart_button}>
                                        <Text style={Styles.cart_button_text}><MinusIcon /></Text>
                                      </Pressable>

                                      <View style={Styles.cart_quantity_text_view}>
                                        <Text style={Styles.cart_quantity_text}>{data.productQuantity}</Text>
                                      </View>

                                      <Pressable style={Styles.cart_button} onPress={() => { this.handleIncrease(item.id, data.cartId, data.productQuantity, item.stock) }}>
                                        <Text style={Styles.cart_button_text} ><AddIcon /></Text>
                                      </Pressable>
                                    </View>
                                  </>
                                )
                              }
                            } else if (count < 1 && index == this.state.allCart[0].productList.length - 1) {
                              return (
                                <View style={Styles.cart_quantity_view}>
                                  <Pressable onPress={() => { this.addToCart(item.id, item.productId) }}>
                                    <View style={{ paddingHorizontal: scale(2), alignItems: 'center', justifyContent: 'center' }}>
                                      <Text style={{ color: 'white', padding: scale(5) }} >Add To Cart</Text>
                                    </View>
                                  </Pressable>
                                </View>
                              )
                            }
                          }) :
                          <View style={Styles.cart_quantity_view}>
                            <Pressable onPress={() => { this.addToCart(item.id, item.productId) }}>
                              <View style={{ paddingHorizontal: scale(2), alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: 'white', padding: scale(5) }} >Add To Cart</Text>
                              </View>
                            </Pressable>
                          </View> :
                        <View style={Styles.cart_quantity_view}>
                          <Pressable onPress={() => { this.addToCart(item.id, item.productId) }}>
                            <View style={{ paddingHorizontal: scale(2), alignItems: 'center', justifyContent: 'center' }}>
                              <Text style={{ color: 'white', padding: scale(5) }} >Add To Cart</Text>
                            </View>
                          </Pressable>
                        </View> :
                      <View style={Styles.cart_quantity_view}>
                        <Pressable onPress={() => { this.addToCart(item.id, item.productId) }}>
                          <View style={{ paddingHorizontal: scale(2), alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: 'white', padding: scale(5) }} >Add To Cart</Text>
                          </View>
                        </Pressable>
                      </View> :
                    <View style={Styles.cart_quantity_view}>
                      <Pressable onPress={() => { this.addToCart(item.id, item.productId) }}>
                        <View style={{ paddingHorizontal: scale(2), alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ color: 'white', padding: scale(5) }} >Add To Cart</Text>
                        </View>
                      </Pressable>
                    </View> :
                    <View style={[Styles.cart_quantity_view, { paddingHorizontal: scale(2), alignItems: 'center', justifyContent: 'center' }]}>
                      <Text style={{ color: 'white' }}>Out of Stock</Text>
                    </View>
                  }
                </View>
              </View>
            </View>
          </View >
          :
          <ActivityIndicator size='large' color='green' />
        }

      </ListItem>
    )
  }

  render() {
    const productList = null
    const { allBrand, selectedCategory, temp_variant, productName, searchVisible1, variantVisible,
      searchTerm, isCart, searchVisible, lat, long, refreshing,
      selectedBrand, selectedSubCategory, allCart, allCategory,
      subCategory, productWithVariant } = this.state;
    var filteredProduct = productWithVariant ? productWithVariant.length > 0 ? productWithVariant.filter(createFilter(searchTerm, KEYS_TO_FILTERS)) : null : null
    return (
      <SafeAreaLayout
        style={Styles.safeArea}
        insets={SaveAreaInset.TOP}>

        <Modal isVisible={variantVisible}>
          <View style={Styles.variant_modal}>
            <View style={Styles.varient_modalHeader}>
              <View style={{ width: '90%' }}>
                <Text style={{ fontFamily: 'notoserif', fontSize: scale(14), fontWeight: '600' }}>{productName}</Text>
              </View>
              <TouchableOpacity>
                <Text onPress={() => { this.setState({ variantVisible: false }); }}><CancelIcon fontSize={25} /></Text>
              </TouchableOpacity>
            </View>
            <Divider />
            <Divider />
            <Divider />
            <ScrollView>

              <View>
                {null != temp_variant ?
                  <>
                    {/* <Text>{allCart != null && allCart.length > 0 ? allCart[0].productList != null ? allCart[0].productList.length : null : null} Data</Text> */}
                    <List
                      data={temp_variant}
                      renderItem={this.renderVariant}
                      keyExtractor={(item) => item.id}
                    />
                  </>
                  : null}
              </View>
            </ScrollView>
          </View>
        </Modal>

        <Modal style={Styles.modal} isVisible={searchVisible}>
          <View style={Styles.modalHeader}>
            <TouchableOpacity>
              <Text onPress={() => { this.toggleModal("SEARCH"); }}><CancelIcon fontSize={25} /></Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <View>
              <Text onPress={() => { this.onCurrentLocation() }} style={{ color: Color.BUTTON_NAME_COLOR, padding: 10, backgroundColor: Color.COLOR, opacity: 0.8, borderRadius: 10, marginTop: 10 }}>{LableText.USE_CURRENT_LOCATION}</Text>
            </View>
            <GooglePlacesAutocomplete
              placeholder='Search'
              styles={{}}
              onPress={(data, details = null) => {
                this.handleSearchLatLong(data, details)
                // console.log('New Location', data);
              }}
              query={{
                key: AppConstants.GOOGLE_MAP_KEY,
                language: 'en',
              }}
            />
            {lat !== '' && long !== '' ?
              <>
                <MapView
                  style={{ flex: 1 }}
                  provider={PROVIDER_GOOGLE}
                  showsUserLocation={true}
                  initialRegion={{
                    latitude: Number(lat),
                    longitude: Number(long),
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}

                  region={{
                    latitude: Number(lat),
                    longitude: Number(long),
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >

                  <Marker
                    coordinate={{
                      latitude: Number(lat),
                      longitude: Number(long),
                    }
                    }
                  >
                  </Marker>
                </MapView>
              </> : null}
          </View>
        </Modal>

        <Toolbar
          title='Product List'
          backIcon={MenuIcon}
          onBackPress={this.props.navigation.openDrawer}
          // onRightPress={() => { this.navigateToCart() }}
          // menuIcon={CartIcon}
          style={{ marginTop: -5, marginLeft: -5 }}
        />

        <Divider />
        <Divider />
        <Divider />
        {/* {!single ?
              <View style={{ padding: 5 }}>
                  <Text onPress={() => { this.setState({ searchVisible: true }) }} style={{ fontWeight: 'bold', fontSize: 18, color: Color.COLOR }}>Location: <Text style={{ fontSize: 16, fontWeight: '100' }}>{location}</Text></Text>
              </View> : null} */}
        {/* <Header style={styles.header}> */}
        <View style={[Styles.searchBox, { marginBottom: 0 }]}>
          <TextInput
            key={'search'}
            placeholder="Search"
            style={[Styles.searchInput_new]}
            value={searchTerm}
            onChangeText={(term) => { this.searchUpdated(term) }}
            onFocus={() => { this.setState({ searchVisible1: false }) }}
          />

          <View style={[{ width: '10%' }, Styles.center]}>
          </View>
          <View style={[{ width: '10%' }, Styles.center]}>
            <TouchableOpacity onPress={() => { this.productSearch(searchTerm) }}>
              <Text style={Styles.searchIcon}><SearchIcon /></Text>
            </TouchableOpacity>
          </View>
        </View>
        <Divider />
        {/* </Header> */}
        <>
          <View style={{ backgroundColor: '#ffffff', marginTop: 0 }}>
            {/* <View style={{ flex: 1, flexDirection: 'column' }}> */}
            <View style={{ marginTop: 10 }}>
              <FlatList
                style={{}}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={allCategory}
                renderItem={({ item, index }) => (
                  <CategoryImageButton
                    categoryClick={(id, shopId) => this.selectCategory(id, shopId)}
                    index={index}
                    data={item}
                    selected={selectedCategory}
                  />)
                } />
            </View>
            {/* </View> */}
          </View>

          <View style={{ backgroundColor: '#ffffff', height: 60, marginTop: 0 }}>
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <View style={{ marginTop: 10 }}>
                <FlatList
                  style={{}}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={subCategory}
                  renderItem={({ item, index }) => {
                    if (selectedSubCategory == item.id) {
                      return (
                        <Pressable onPress={() => { this.selectSubCategory(item.id, item.name) }}>
                          <View style={Styles.talkBubble}>
                            <View style={Styles.product_nav_button_selected} >
                              <Text style={Styles.product_nav_button_selected_text}>{item.name}</Text>
                            </View>
                            <View style={Styles.selectedTriangle} />
                          </View>
                        </Pressable>
                      )
                    } else {
                      return (
                        <Pressable key={index} onPress={() => { this.selectSubCategory(item.id, item.name) }}>
                          <View
                            style={selectedSubCategory == item.id ?
                              Styles.product_nav_button_selected :
                              index % 5 == 0 ?
                                Styles.product_nav_button_selected0 :
                                index % 5 == 1 ?
                                  Styles.product_nav_button_selected1 :
                                  index % 5 == 2 ?
                                    Styles.product_nav_button_selected2 :
                                    index % 5 == 3 ?
                                      Styles.product_nav_button_selected3 :
                                      index % 5 == 4 ?
                                        Styles.product_nav_button_selected4 :
                                        Styles.product_nav_button}>
                            <Text
                              style={Styles.product_nav_button_text}>{item.name}</Text>
                          </View>
                        </Pressable>
                      )
                    }
                  }}
                >
                </FlatList>
              </View>
            </View>
          </View>
          <Divider />
          {/* <View style={{ backgroundColor: '#ffffff', height: 60, marginTop: 0 }}>
            <View style={{ backgroundColor: '#ffffff', height: 60, marginTop: 0, flex: 1, flexDirection: 'column' }}>
              <View style={{ marginTop: 10 }}>
                <FlatList
                  style={{}}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={allBrand}
                  renderItem={({ item, index }) => {
                    if (selectedBrand == item.id) {
                      return (
                        <Pressable onPress={() => { this.selectBrand(item.id, item.name) }}>
                          <View style={Styles.talkBubble}>
                            <View style={Styles.product_nav_button_selected} >
                              <Text style={Styles.product_nav_button_selected_text}>{item.name}</Text>
                            </View>
                            <View style={Styles.selectedTriangle} />
                          </View>
                        </Pressable>
                      )
                    } else {
                      return (
                        <Pressable onPress={() => { this.selectBrand(item.id, item.name) }}>
                          <View
                            style={selectedBrand == item.id ?
                              Styles.product_nav_button_selected :
                              index % 5 == 0 ?
                                Styles.product_nav_button_selected4 :
                                index % 5 == 1 ?
                                  Styles.product_nav_button_selected3 :
                                  index % 5 == 2 ?
                                    Styles.product_nav_button_selected2 :
                                    index % 5 == 3 ?
                                      Styles.product_nav_button_selected1 :
                                      index % 5 == 4 ?
                                        Styles.product_nav_button_selected0 :
                                        Styles.product_nav_button}>
                            <Text style={Styles.product_nav_button_text}>{item.name}</Text>
                          </View>
                        </Pressable>
                      )
                    }

                  }}
                  keyExtractor={(item) => item.id}
                >
                </FlatList>
              </View>
            </View>
          </View> */}
          <Divider />
        </>

        {searchVisible1 && searchTerm != '' && searchTerm != null ?
          <>
            <ScrollView>
              {searchTerm != '' && searchTerm != null && filteredProduct ? filteredProduct.map((product, i) => {
                return (
                  <TouchableOpacity onPress={() => { this.search(product) }} key={product.id} style={styles.emailItem}>
                    <View>
                      <Text>{product.name}</Text>
                    </View>
                  </TouchableOpacity>
                )
              }) : null}
            </ScrollView>
          </> :
          <>
            {null != productWithVariant ?
              <List data={productWithVariant}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={this._onRefresh.bind(this)}
                  />}
                renderItem={this.renderProduct}
                // onEndReached={() => { this.loadData() }}
                keyExtractor={item => item.id}
              />
              : null}

            {/* {
              <View>
                <ActivityIndicator />
              </View>
            } */}
          </>}
        <View style={{ height: 10, width: '100%' }} />

        {isCart ?
          <Pressable style={[Styles.bottom_tab_bar, { flexDirection: 'row', paddingTop: scale(0) }]} onPress={() => { this.navigateToCart() }}>
            <View style={[Styles.center, { flexDirection: 'row', width: '50%', paddingTop: 0 }]}>
              <Text style={Styles.bottom_view_cart_text}>View Cart </Text>
              <View style={[Styles.center, { backgroundColor: Color.BUTTON_NAME_COLOR, width: scale(30), height: scale(30), borderRadius: 20, marginTop: 0 }]}>
                <Text style={{ fontSize: scale(13), color: Color.COLOR }}>{allCart != null && allCart != '' ? allCart[0].productList.length : 0}</Text>
              </View>
            </View>
            <View style={{ height: '100%', width: scale(1), backgroundColor: Color.BUTTON_NAME_COLOR }} />
            <View style={[Styles.center, { width: '50%' }]}>
              <Text style={{ fontSize: scale(15), color: Color.BUTTON_NAME_COLOR }}>Rs. {allCart != null && allCart != '' ? allCart[0].payableAmount : 0}</Text>
            </View>
          </Pressable>
          : null
        }
      </SafeAreaLayout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start'
  },
  emailItem: {
    borderBottomWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.3)',
    padding: 10
  },
  emailSubject: {
    color: 'rgba(0,0,0,0.5)'
  },
  searchInput: {
    padding: 10,
    borderColor: '#CCC',
    borderWidth: 1
  }
});

// interface LinkStateToProp {
//   productData: Product[],
//   productVariant: Product[],
//   userData: User,
//   allBrand: Brand[],
//   allMeasurement: Measurement[],
//   allVarient: Varient[];
//   allCart: Cart[];
// }

// interface LinkDispatchToProp {
//   changeProductData: (shopId: String) => void;
//   fetchBrandByShopId: (shopId: String) => void;
//   fetchVarientByShopId: (shopId: String) => void;
//   fetchMeasurementByShopId: (shopId: String) => void;
//   fetchUserById: (id: Number) => void;
//   fetchCartByShopIdUserId: (data: any) => void;
//   setProductVariant: (data: any) => void;
//   setProductVariantByCat: (data: any) => void;
// }

// const mapStateToProps = (
//   state: AppState,
//   ownProps: Brand
// ): LinkStateToProp => ({
//   productData: state.productReducers.productData,
//   userData: state.userReducers.userData,
//   allVarient: state.varientReducers.allVarient,
//   allMeasurement: state.measurementReducers.measurementData,
//   allBrand: state.brandReducers.allBrand,
//   productVariant: state.productReducers.productVarient,
//   allCart: state.cartReducers.cartByUserId
// })

// const mapDispatchToProps = (
//   dispatch: ThunkDispatch<any, any, AppActions>,
//   ownProps: Brand
// ): LinkDispatchToProp => ({
//   changeProductData: bindActionCreators(changeProductData, dispatch),
//   fetchUserById: bindActionCreators(fetchUserById, dispatch),
//   fetchVarientByShopId: bindActionCreators(fetchVarientByShopId, dispatch),
//   fetchMeasurementByShopId: bindActionCreators(fetchMeasurementByShopId, dispatch),
//   fetchCartByShopIdUserId: bindActionCreators(fetchCartByShopIdUserId, dispatch),
//   setProductVariant: bindActionCreators(setProductVariant, dispatch),
//   fetchBrandByShopId: bindActionCreators(fetchBrandByShopId, dispatch),
//   setProductVariantByCat: bindActionCreators(setProductVariantByCat, dispatch)
// });

// const connector = connect(mapStateToProps, mapDispatchToProps);

// type ProductListProps = ConnectedProps<typeof connector>;
// export const ProductListScreen = connector(ProductList)