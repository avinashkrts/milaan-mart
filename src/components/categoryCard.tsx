import React, { FC } from "react"
import { Image, Pressable, Text, View } from "react-native"
import { Styles } from "../assets/styles"
import { AppConstants } from "../constants"

type Props = any

export const CategoryCard: FC<Props> = (props: Props) => {
    const {data} = props;
    return (
        <Pressable key={'cat' + props.index} style={Styles.category_card1} onPress={() => { props.categoryClick(data.id, data.shopId) }}>
            <View style={[Styles.cat_card_img, Styles.center]}>
                <Image
                    resizeMethod='auto'
                    resizeMode='stretch'
                    source={{ uri: AppConstants.IMAGE_BASE_URL + '/category/' + data.avatar }}
                    style={Styles.cat_card_avatar1}
                />
            </View>
            <View style={Styles.cat_card_title_view}>
                <Text style={Styles.cat_card_title} > {data.name} </Text>
            </View>
        </Pressable>
    )
}