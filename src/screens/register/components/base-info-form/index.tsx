import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import { Button } from "react-native-ui-lib";
import colors from "@/config/colors";
import GenderOption from "./gender-option";
import AvatarUpload from "./avatar-upload";
import UsernameInput from "./username-input";
export interface RegisterFormData{
    avatar: string;
    gender: number;
    name: string;
}

export default (props: {
    onNext: () => void;
    onChange: (data: RegisterFormData) => void;
    pageIndex: number;
}) => {
    const [formData, setFormData] = useState<RegisterFormData>({
        avatar: '',
        gender: 2,
        name: '',
    });
    const [ready, setReady] = useState<boolean>(false);
    const inputRef = useRef<TextInput>();
    useEffect(() => {
        if (props.pageIndex === 0) {
            inputRef.current?.focus();
        }
    }, [props.pageIndex]);
    useEffect(() => {
        inputRef.current?.focus();
    }, [])
    return <View style={styles.container}>
        <View style={styles.contentContainer}>
            <AvatarUpload onChange={async (uri) => {
                setFormData({
                    ...formData,
                    avatar: uri,
                });
            }} />
            <View style={{
                paddingHorizontal: scale(25),
                display: 'flex',
                width: '100%',
                marginTop: verticalScale(30),
            }}>
                <Text style={{
                    fontSize: scale(16),
                    fontWeight: '400',
                    color: '#000',
                    marginLeft: scale(15),
                    marginBottom: verticalScale(10),
                }}>暱稱</Text>
                <UsernameInput value={formData.name} onChange={(v) => {
                    v !== '' ? setReady(true) : setReady(false);
                    setFormData({
                        ...formData,
                        name: v,
                    });
                }} />
            </View>
            <View style={{
                paddingHorizontal: scale(25),
                display: 'flex',
                width: '100%',
                marginTop: verticalScale(30),
            }}>
                <Text style={{
                    fontSize: scale(16),
                    fontWeight: '400',
                    color: '#000',
                    marginLeft: scale(15),
                    marginBottom: verticalScale(10),
                }}>性別</Text>
                <GenderOption onChange={(v) => {
                    setFormData({
                        ...formData,
                        gender: v,
                    });
                }} />
            </View>
        
            <View style={styles.nextContainer}>
                <Button disabled={!ready} size="large" style={styles.nextButton} backgroundColor={colors.primary} onPress={() => {
                    props.onChange(formData);
                    props.onNext();
                }} label="下一步" labelStyle={styles.nextButtonLabel} />
            </View>
        </View>
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        paddingTop: verticalScale(30),
    },
    nextContainer: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        marginTop: verticalScale(186)
    },
    nextButton: {
        width: scale(327),
        height: scale(56),
        borderRadius: scale(16),
    },
    nextButtonLabel: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    }
});