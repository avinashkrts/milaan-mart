import React, { FC } from "react"
import { Pressable, Text, View } from "react-native";
import { Styles } from "../assets/styles";

type Props = {
    onPress?: Function,
    title?: String
} & any

export const TopButtonSelected: FC<Props> = (props: Props) => {
    return (
        <Pressable onPress={() => { props.onPress() }}>
            <View style={Styles.talkBubble1}>
                <View style={Styles.product_nav_button_selected5} >
                    <Text style={Styles.product_nav_button_selected_text}>{props.title}</Text>
                </View>
                <View style={Styles.selectedTriangle1} />
            </View>
        </Pressable>
    );
}

export const TopButton: FC<Props> = (props: Props) => {
    return (
        <Pressable onPress={() => { props.onPress() }} >
            <View style={Styles.product_nav_button1}>
                <Text style={Styles.product_nav_button_text1}>{props.title}</Text>
            </View>
        </Pressable>
    );
}