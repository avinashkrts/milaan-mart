import React, { FC } from "react"
import { Image, Pressable, Text, View } from "react-native"
import { Styles } from "../assets/styles"
import { AppConstants } from "../constants"

type Props = any

export const CategoryCard: FC<Props> = (props: Props) => {
    return (
        <Pressable key={'cat' + props.index} style={Styles.category_card1} onPress={() => { props.categoryClick(props.data.id, props.data.shopId) }}>
            <View style={[Styles.cat_card_img, Styles.center]}>
                <Image
                    resizeMethod='auto'
                    resizeMode='stretch'
                    source={{ uri: AppConstants.IMAGE_BASE_URL + '/category/' + props.data.id + "_" + props.data.shopId + '_category.png' }}
                    style={Styles.cat_card_avatar1}
                />
            </View>
            <View style={Styles.cat_card_title_view}>
                <Text style={Styles.cat_card_title} > {props.data.name} </Text>
            </View>
        </Pressable>
    )
}