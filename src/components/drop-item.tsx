import React from 'react';
import { Text, TextStyle } from 'react-native';
import { scale, ScaledSheet } from 'react-native-size-matters';

type Props = {
    doSomething?: Function,
    value?: String | Number,
    style?: TextStyle,
    label?: String | Number
}

export const Item = (props: Props) => {
    const { doSomething, value, style, label } = props;
    return (
        <Text style={style ? style : Styles.text} onPress={() => doSomething(value, label)}>{label}</Text>
    )
}

const Styles = ScaledSheet.create({
    text:{
        color: 'black',
        fontSize: scale(14),
        paddingVertical: scale(8),
        paddingHorizontal: scale(5),
        borderBottomColor: 'black',
        fontWeight: '600',
        borderBottomWidth: scale(1),
        backgroundColor: '#cde1f7'
    }
})