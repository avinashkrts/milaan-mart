import React, { CSSProperties, useState } from 'react';
import { Alert, Pressable, Text, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import { scale, ScaledSheet } from 'react-native-size-matters';
import { RightArrowIcon } from '../assets/icons';
import Modal from 'react-native-modal';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Color } from '../constants';

type Props = {
    children?: any,
    style?: ViewStyle,
    placeholder?: String,
    selectedValue?: String | Number,
    onChange?: Function
}

export function DropDown(props: Props) {
    const { children, onChange, selectedValue, style, placeholder } = props
    const [selected, setSelected] = useState(selectedValue);
    const [open, setOpen] = useState(false);

    function doSomething(value: Number | String, label: Number | String) {
        setSelected(label);
        onChange(value);
        setOpen(false)
    }


    const childrenWithProps = React.Children.map(children, child => {

        if (React.isValidElement(child)) {
            return (
                React.cloneElement(child, { doSomething })
            )
        }
        return child;
    });

    const openDropDown = () => {
        setOpen(!open)
    }

    return (
        <View>
            <Pressable onPress={openDropDown}>
                <View style={style ? style : Styles.view}>
                    <Text style={Styles.text} >{selected ? selected : placeholder}</Text>
                    <Text style={Styles.icon} ><RightArrowIcon fontSize={scale(18)} /></Text>
                </View>
            </Pressable>
            {open ?
                <View style={Styles.optionView} >
                    {childrenWithProps}
                </View>
                : null}
        </View>
    )
}

const Styles = ScaledSheet.create({
    view: {
        borderColor: 'black',
        backgroundColor: Color.DROP_DOWN_BACKGROUND,
        borderWidth: scale(1),
        paddingVertical: scale(10),
        paddingHorizontal: scale(10),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: scale(5)
    },
    text: {
        color: 'black',
        fontWeight: '600',
        fontSize: scale(16)
    },
    icon: {
        transform: [{ rotate: '90deg' }],
        color: 'black',
        fontWeight: '400'
    },
    optionView: {
        position: 'absolute',
        marginTop: scale(43),
        backgroundColor: 'white',
        width: '95%',
        borderColor: 'black',
        borderWidth: scale(1),
        zIndex: 1
    }
})
