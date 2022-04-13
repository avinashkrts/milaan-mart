import React, { useImperativeHandle, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
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
    ref?: any
}

export function DropDown(props: Props) {

    useImperativeHandle(props.ref, () => ({
        reset: () => {
            reset();
        },
        openDropdown: () => {
            openDropdown();
        },
        closeDropdown: () => {
            closeDropdown();
        },
    }));

    const { children, onChange, selectedValue, style, placeholder } = props
    const [selected, setSelected] = useState(selectedValue);
    const [open, setOpen] = useState(false);
    const DropdownButton = useRef();

    function doSomething(value: Number | String, label: Number | String) {
        setSelected(label);
        onChange(value);
        setOpen(false)
    }

    const openDropdown = () => {
        // DropdownButton.current.measure((fx, fy, w, h, px, py) => {
        //     console.log('position y => ', py, '\nheight', h, '\nposition x => ', px)
        //     if (height - 18 < py + h + dropdownHEIGHT) {
        //         setDropdownPX(px);
        //         setDropdownPY(py - 2 - dropdownHEIGHT);
        //     } else {
        //         setDropdownPX(px);
        //         setDropdownPY(py + h + 2);
        //     }
        //     setDropdownWIDTH(dropdownStyle?.width || w);
        //     setOpen(true);
        // });
    };
    const closeDropdown = () => {
        setOpen(false);
    };
    const reset = () => {
        // setSelectedItem(null);
        // setIndex(-1);
        setOpen(false);
    };
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
                <ScrollView style={Styles.optionView} >
                    {childrenWithProps}
                </ScrollView>
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
