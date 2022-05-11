import { Avatar } from "@ui-kitten/components"
import React, { FC } from "react"
import { Image, Pressable, Text, View } from "react-native"
import { color } from "react-native-reanimated"
import { scale, ScaledSheet } from "react-native-size-matters"
import { AddIcon, CancelIcon, MinusIcon, RupeeIcon } from "../assets/icons"
// import { Styles } from "../assets/styles"
import { AppConstants, Color } from "../constants"

type Props = any

export const CartProduct: FC<Props> = (props: Props) => {
  var { handleDelete, measurement, item, handleIncrease, handleDecrease, } = props;
  return (
    <View style={Styles.cart_main_view}>
      <View style={Styles.cart_view_1}>
        <View style={Styles.cart_view_1_1}>
          <View style={[Styles.cart_avatar_view, Styles.center]}>
            <Avatar source={{ uri: AppConstants.IMAGE_BASE_URL + '/product/' + item.productImage }} style={Styles.product_avatar} />
          </View>
        </View>

        <View style={Styles.cart_view_1_2}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={Styles.cart_name_text_view}>
              <Text style={Styles.cart_name_text}>{item.productName}</Text>
            </View>
            <Pressable onPress={() => { handleDelete(item.id) }}>
              <Text style={Styles.cart_name_text}><CancelIcon fontSize={scale(25)} /></Text>
            </Pressable>
          </View>
          <View style={{ flexDirection: 'row', width: '95%', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <Text style={Styles.price_text}>{item.packSize}{measurement}</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: scale(5) }}>
            <Text style={Styles.old_price_text}>MRP {item.mrp.toFixed(2)}</Text>
            <Text style={Styles.price_text}><RupeeIcon fontSize={scale(14)} />{item.unitSellingPrice.toFixed(2)}</Text>
            <Text style={Styles.offer_price_text}>
              {Math.round(item.customerBundleOffer > 0 ? item.customerBundleOffer : item.customerSingleOffer > 0 ? item.customerSingleOffer : null)}% off
            </Text>
          </View>

          <View>
            {item.bundleQuantity > 1 ? <Text style={{ fontSize: scale(12), color: Color.OFFER }} ><RupeeIcon fontSize={scale(14)} />{(item.bundlePrice / item.bundleQuantity).toFixed(2)}/pc (Buy {item.bundleQuantity} or more)</Text> : null}
          </View>

          <View style={Styles.cart_price_view}>

            <View style={Styles.product_price}>
              <Text style={Styles.product_all_price}><RupeeIcon /> {item.price.toFixed(2)}</Text>
            </View>

            <View style={Styles.cart_quantity_view}>
              {item.currentStock ? item.currentStock >= item.productQuantity ?
                <>
                  <Pressable style={Styles.cart_button} onPress={() => { handleDecrease(item.productId, item.cartId, item.productQuantity) }}>
                    <Text style={Styles.cart_button_text}><MinusIcon /></Text>
                  </Pressable>

                  <View style={Styles.cart_quantity_text_view}>
                    <Text style={Styles.cart_quantity_text}>{item.productQuantity}</Text>
                  </View>

                  <Pressable style={Styles.cart_button} onPress={() => { handleIncrease(item.productId, item.cartId, item.productQuantity, item.currentStock) }}>
                    <Text style={Styles.cart_button_text}><AddIcon /></Text>
                  </Pressable>
                </> :
                <View style={{ paddingHorizontal: scale(2), alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: 'white' }}>Out of Stock</Text>
                </View> :
                <View style={{ paddingHorizontal: scale(2), alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: 'white' }}>Out of Stock</Text>
                </View>}
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export const Styles = ScaledSheet.create({
  cart_main_view: {
    paddingVertical: '5@s',
    backgroundColor: Color.BUTTON_NAME_COLOR
  },

  cart_quantity_text_view: {

  },

  product_price: {
    width: '55%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  product_all_price: {
      fontSize: '14@s',
      paddingVertical: '3@s',
      paddingHorizontal: '7@s',
      fontWeight: '600',
      fontFamily: 'notoserif',
      borderColor: 'blue',
      color: 'blue',
      borderWidth: '1@s',
      borderRadius: '4@s'
  },

  offer_price_text: {
    fontFamily: 'notoserif',
    fontSize: '14@s',
    color: Color.BUTTON_NAME_COLOR,
    backgroundColor: Color.OFFER,
    borderColor: Color.OFFER,
    borderWidth: '1@s',
    paddingVertical: '3@s',
    paddingHorizontal: '7@s',
    borderRadius: '4@s',
    fontWeight: '600'
  },

  old_price_text: {
    fontSize: '12@s',
    fontFamily: 'notoserif',
    textDecorationLine: 'line-through',
    color: Color.BLACK
  },

  cart_quantity_text: {
    paddingVertical: '5@s',
    paddingHorizontal: '5@s',
    color: Color.BUTTON_NAME_COLOR
  },

  cart_button: {
    backgroundColor: Color.COLOR,
    borderRadius: '2@s'
  },

  cart_quantity_view: {
    flexDirection: 'row',
    backgroundColor: Color.COLOR,
    justifyContent: 'space-between',
    padding: '2@s',
    borderRadius: '5@s'
  },

  bottom_view_cart_button: {
    // paddingHorizontal: '10@s',
    width: '100%',
    backgroundColor: 'green'
  },

  cart_button_text: {
    paddingVertical: '3.5@s',
    paddingHorizontal: '2@s',
    color: Color.BUTTON_NAME_COLOR
  },

  price_text: {
    fontSize: '14@s',
    fontWeight: '600',
    marginLeft: '5@s',
    fontFamily: 'notoserif',
    color: Color.BLACK
  },

  cart_view_1: {
    width: '100%',
    paddingBottom: '20@s',
    flexDirection: 'row',
  },

  cart_view_1_1: {
    width: '30%',
    height: '100@s',
  },

  cart_avatar_view: {
    width: '100%',
    height: '100%'
  },

  cart_avatar: {
    borderRadius: 0,
    width: '100@s',
    height: '120@s',
  },

  cart_view_1_2: {
    width: '65%',
    height: '110@s',
    marginLeft: '10@s',
    paddingHorizontal: '1@s',
  },

  cart_name_text: {
    fontSize: '12@s',
    color: Color.BLACK
  },

  cart_name_text_view: {
    width: '80%',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },

  cart_price_view: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '10@s',
  },

  product_avatar: {
    height: '100%',
    width: '100%',
    borderRadius: 0
  },

  center: {
    justifyContent: "center",
    alignItems: "center"
  },
})