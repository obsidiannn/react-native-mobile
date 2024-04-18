import { Keyboard, StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from "react-native-ui-lib";
import { useEffect, useRef, useState } from "react";
import { scale, verticalScale } from "react-native-size-matters/extend";
import colors from "../../../config/colors";

export default (props: {
    onNext: () => void;
    onPrev: () => void;
    onChange: (val: string) => void;
    pageIndex: number;
}) => {
    const [words, setWords] = useState<string[]>(new Array(6).fill(''));
    const [ready, setReady] = useState<boolean>(false);
    const inputRefs = useRef<TextInput[]>([]);
    const [focusStates, setFocusStates] = useState<boolean[]>(new Array(6).fill(false));
    useEffect(() => {
        if (props.pageIndex === 1) {
            inputRefs.current[0].focus();
        }
    }, [props.pageIndex]);
    return <View style={styles.container}>
        <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>輸入安全密碼</Text>
        </View>
        <View style={styles.wordContainer}>
            {words.map((word, i) => {
                return (
                    <View key={i} style={styles.wordItem}>
                        <TextInput
                            onFocus={() => {
                                const tmps = [...focusStates];
                                tmps[i] = true;
                                setFocusStates(tmps);
                            }}
                            onBlur={() => {
                                const tmps = [...focusStates];
                                tmps[i] = false;
                                setFocusStates(tmps);
                            }}
                            onKeyPress={({ nativeEvent }) => {
                                if (nativeEvent.key === 'Backspace') {
                                    if (i > 0) {
                                        const tmps = [...words];
                                        if (tmps[i] === '') {
                                            tmps[i - 1] = '';
                                            let tmpReady = true;
                                            tmps.forEach((tmp) => {
                                                if (tmp === '') {
                                                    tmpReady = false;
                                                }
                                            });
                                            setReady(tmpReady);
                                            setWords(tmps);
                                            inputRefs.current[i - 1].focus();
                                            if (tmpReady) {
                                                Keyboard.dismiss();
                                            }
                                        }
                                    }
                                } else {
                                    if (i < words.length - 1) {
                                        inputRefs.current[i + 1].focus();
                                    }
                                }
                            }}
                            maxLength={1}
                            ref={(ref) => {
                                inputRefs.current[i] = ref as TextInput;
                            }}
                            keyboardType="number-pad"
                            style={styles.wordInput}
                            onChangeText={(v) => {
                                const tmps = [...words];
                                tmps[i] = v.replace(/[^0-9]/g, '');
                                let tmpReady = true;
                                tmps.forEach((tmp) => {
                                    if (tmp === '') {
                                        tmpReady = false;
                                    }
                                });
                                setReady(tmpReady);
                                setWords(tmps);
                                if (!/^\d$/.test(v)) {
                                    return;
                                }
                                if (v !== '') {
                                    if (i < words.length - 1) {
                                        inputRefs.current[i + 1].focus();
                                    }
                                } else {
                                    if (i > 0) {
                                        inputRefs.current[i - 1].focus();
                                    }
                                }
                                if (tmpReady) {
                                    Keyboard.dismiss();
                                }
                                props.onChange(tmps.join(''));
                            }}
                            value={word}
                        />
                    </View>
                )
            })}
        </View>
        <View style={styles.tipsContainer}>
            <Text style={styles.tipsText}>請設置安全密碼，安全密碼將用於保護你的助詞</Text>
        </View>
        <View style={styles.buttonContainer}>
            <Button disabled={!ready}  size="large" style={styles.loginButton} backgroundColor={colors.primary} onPress={() => props.onNext()} label="登陸" labelStyle={styles.loginButtonLabel} />
            <Button size="large" style={styles.prevButton} backgroundColor="white" onPress={() => {
                props.onChange('');
                setWords(new Array(6).fill(''));
                props.onPrev();
            }} label="上一步" labelStyle={styles.prevButtonLabel} />
        </View>
    </View>;
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    placeholderContainer: {
        paddingHorizontal: scale(16),
    },
    placeholderText: {
        fontSize: scale(14),
        color: '#333',
        fontWeight: '400',
        paddingTop: verticalScale(26),
    },
    wordContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingHorizontal: scale(16),
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: verticalScale(10),
    },
    wordItem: {
        display: 'flex',
        flexDirection: 'row',
        width: scale(45),
        alignItems: 'center',
        height: scale(45),
        borderRadius: scale(10),
        borderWidth: 1,
        borderColor: '#B7C0CB',
        backgroundColor: '#F3F3F3',
    },
    wordInput: {
        color: '#000',
        fontSize: scale(28),
        textAlign: 'center',
        width: '100%',
        fontStyle: 'normal',
        fontWeight: '500',
    },
    tipsContainer: {
        width: '100%',
        paddingHorizontal: scale(16),
        paddingTop: verticalScale(20),
    },
    tipsText: {
        textAlign: 'center',
        color: '#FF4018',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
    },
    buttonContainer: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        marginTop: verticalScale(321)
    },
    loginButton: {
        width: scale(327),
        height: scale(56),
        borderRadius: scale(16),
    },
    loginButtonLabel: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    prevButton: {
        width: scale(327),
        height: scale(56),
        borderColor: colors.primary,
        borderWidth: 2,
        borderRadius: scale(16),
        marginTop: verticalScale(21),
    },
    prevButtonLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.primary
    },
})