import React, { FC } from "react"
import { Image, Pressable, Text, View } from "react-native"
import { scale, ScaledSheet } from "react-native-size-matters"
import { AppConstants } from "../constants"

type Props = any

export const CategoryImageButton: FC<Props> = (props: Props) => {
    const { data, index, selected } = props
    return (
        <Pressable key={'cat' + props.index} style={Styles.click} onPress={() => { props.categoryClick(props.data.id, props.data.shopId) }}>
            <View style={selected == data.id ? Styles.selected_button : Styles.button}>
                <View style={Styles.img_box}>
                    <Image
                        resizeMethod='auto'
                        resizeMode='stretch'
                        source={{ uri: AppConstants.IMAGE_BASE_URL + '/category/' + (data.id == 0 ?  + data.id + "_" + 'MILAAN63' + '_category.png' : data.avatar) }}
                        style={ data.name != "All" ? Styles.img : Styles.img_all}
                    />
                </View>
                { data.name != "All" ?
                data.id != 0 ?
                    <View style={Styles.title_box}>
                        <Text style={Styles.title} >{data.name}</Text>
                    </View> : null
                : null }
            </View>
            {selected == data.id ?
                <View style={Styles.selectedTriangle} />
                : null}
        </Pressable>
    )
}

export const Styles = ScaledSheet.create({
    click: {
        flexDirection: 'column',
        alignItems: 'center'
    },

    button: {
        // backgroundColor: 'red',
        minHeight: scale(50),
        minWidth: scale(50),
        maxWidth: scale(135),
        flexDirection: 'row',
        marginTop: scale(5),
        marginRight: scale(5),
        marginLeft: scale(5),
        borderRadius: scale(5),
        borderColor: 'silver',
        borderWidth: scale(1),
    },

    selected_button: {
        // backgroundColor: 'red',
        minHeight: scale(50),
        minWidth: scale(50),
        maxWidth: scale(135),
        flexDirection: 'row',
        marginTop: scale(5),
        marginRight: scale(5),
        marginLeft: scale(5),
        borderRadius: scale(5),
        borderColor: '#db3246',
        borderWidth: scale(1),
    },

    selected_all_button: {
        // backgroundColor: 'red',
        minHeight: scale(50),
        minWidth: scale(50),
        maxWidth: scale(135),
        flexDirection: 'row',
        marginTop: scale(5),
        marginRight: scale(5),
        marginLeft: scale(5),
        borderRadius: scale(5),
        borderColor: '#db3246',
        borderWidth: scale(1),
    },

    img_box: {
        minHeight: scale(63),
        width: scale(49),
        borderTopLeftRadius: scale(5),
        borderBottomLeftRadius: scale(5),
    },

    img: {
        height: scale(63),
        with: scale(49),
        borderTopLeftRadius: scale(5),
        borderBottomLeftRadius: scale(5),
    },

    img_all: {
        height: scale(63),
        with: scale(49),
    },

    title_box: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        // backgroundColor: '#ff7b5c',
        width: scale(86),
        minHeight: scale(63),
        padding: scale(5),
        borderTopEndRadius: scale(5),
        borderBottomRightRadius: scale(5)
    },

    title: {
        fontSize: scale(10),
        color: 'black',
    },

    selectedTriangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderTopWidth: '10@s',
        borderRightWidth: '5@s',
        borderBottomWidth: 0,
        borderLeftWidth: '5@s',
        borderTopColor: '#db3246',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent'
    }
});