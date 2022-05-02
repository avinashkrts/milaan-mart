import React, { FC } from "react"
import { Image, Pressable, Text, View } from "react-native"
import { Styles } from "../assets/styles"
import { AppConstants } from "../constants"

type Props = any

export const CategoryCard: FC<Props> = (props: Props) => {
    return (
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
                  <Text style={[{ fontFamily: 'notoserif' }, Styles.offer_price_text]}>
                    {Math.round(item.itemList[0].customerBundleOffer)} % Off
                  </Text>
                  {/* {item.offerActiveInd ?
                    <Text style={{ color: Color.COLOR, fontSize: 20, textDecorationLine: 'line-through' }}>{item.oldPrice}</Text>
                    : null
                  } */}
                </View>
                {item.itemList[0].bundleQuantity > 1 ? <Text style={{ fontSize: scale(12), color: Color.OFFER }} ><RupeeIcon fontSize={scale(14)} />{(item.itemList[0].bundlePrice / item.itemList[0].bundleQuantity).toFixed(2)} / pc (Buy {item.itemList[0].bundleQuantity} or more)</Text> : null}
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
    )
}