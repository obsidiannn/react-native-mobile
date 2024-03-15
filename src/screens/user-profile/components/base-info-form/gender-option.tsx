import { GenderEnum } from "@/api/types/enums";
import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { scale, verticalScale } from "react-native-size-matters/extend"


export default (props: {
    onChange: (v: number) => void
}) => {
    const [options, _] = useState<{
        title: string;
        icon: any;
        value: number;
    }[]>([
        {
            title: '保密',
            icon: require('@/assets/icons/gender-unknown.svg'),
            value: GenderEnum.UNKNOWN
        },
        {
            title: '男',
            icon: require('@/assets/icons/gender-man.svg'),
            value: GenderEnum.MALE
        },
        {
            title: '女',
            icon: require('@/assets/icons/gender-woman.svg'),
            value: GenderEnum.FAMALE
        },
    ]);
    const [value, setValue] = useState(2);
    return <View style={styles.container}>
        {options.map((option, index) => {
            return <TouchableOpacity onPress={() => {
                props.onChange(option.value)
                if (value === option.value) return;
                setValue(option.value)
            }} key={index} style={styles.item}>
                <Image style={styles.leftIcon} source={option.icon} />
                <Text style={styles.title}>{option.title}</Text>
                <View style={styles.rightContainer}>
                    {option.value == value ? <Image style={styles.rightIcon} source={require('@/assets/icons/circle-checked.svg')} /> : null}
                </View>
            </TouchableOpacity>
        })}
    </View>
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    item: {
        height: verticalScale(42),
        borderRadius: scale(21),
        backgroundColor: '#F3F3F3',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F4F4F4',
        paddingHorizontal: scale(15),
    },
    title: {
        fontSize: scale(14),
        fontWeight: '400',
        color: '#333',
        marginRight: scale(10),
    },
    leftIcon: {
        width: scale(15),
        height: scale(15),
        marginRight: scale(5),
    },
    rightContainer: {
        width: scale(15),
    },
    rightIcon: {
        width: scale(15),
        height: scale(15),
    }
})