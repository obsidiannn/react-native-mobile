import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import { Button } from "react-native-ui-lib";
import colors from "../../../config/colors";
import * as Clipboard from 'expo-clipboard';
import * as bip39 from '@scure/bip39';
import toast from "../../../lib/toast";
import { wordlist } from "@scure/bip39/wordlists/english";
export default (props: {
    onNext: () => void;
    onChange: (v: string) => void;
}) => {
    const [words, setWords] = useState<string[]>(new Array(12).fill(''));
    const [ready, setReady] = useState<boolean>(false);
    return (
        <View style={styles.container}>
            <View style={styles.tipsContainer}>
                <Text style={styles.tipsText}>注意：TD chat不會保存您的助記詞，請您妥善保管好助記詞，以免造成財產損失。</Text>
            </View>
            <View style={styles.wordContainer}>
                {words.map((word, i) => {
                    const index = ((i + 1) + '').padStart(2, '0');
                    return (
                        <View key={i} style={styles.wordItemContainer}>
                            <View style={styles.wordItem}>
                                <Text style={styles.wordPrifixText}>{index}</Text>
                                <TextInput
                                    style={styles.wordInput}
                                    onChangeText={(v) => {
                                        const tmps = [...words];
                                        tmps[i] = v.trim();
                                        let tmpReady = true;
                                        tmps.forEach((tmp) => {
                                            if (tmp === '') {
                                                tmpReady = false;
                                            }
                                        });
                                        setReady(tmpReady);
                                        setWords(tmps)
                                        props.onChange(tmps.join(' '));
                                    }}
                                    value={word}
                                />
                            </View>
                        </View>
                    )
                })}
            </View>
            <View style={styles.pasteContainer}>
                <TouchableOpacity onPress={async () => {
                    const v = await Clipboard.getStringAsync()
                    if (!bip39.validateMnemonic(v, wordlist)) {
                        toast('助記詞不合法，請檢查！');
                        return;
                    }
                    setWords(v.split(' '));
                    props.onChange(v);
                    setReady(true);
                }} style={styles.pasteButton}>
                    <Text style={styles.pasteButtonText}>粘貼助記詞</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.nextContainer}>
                <Button disabled={!ready} size="large" style={styles.nextButton} backgroundColor={colors.primary} onPress={() => {
                    props.onNext();
                }} label="下一步" labelStyle={styles.nextButtonLabel} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tipsContainer: {
        width: '100%',
        paddingHorizontal: scale(16),
        paddingTop: verticalScale(45),
    },
    tipsText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#FF4018',
        textAlign: 'center',
    },
    wordContainer: {
        display: 'flex',
        width: '100%',
        paddingHorizontal: scale(16),
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    wordItemContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: scale(114),
        alignItems: 'center',
        marginTop: scale(16),
    },
    wordItem: {
        height: scale(42),
        borderRadius: scale(9),
        borderColor: '#E0E0E0',
        borderWidth: scale(1),
        width: '95%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: scale(5),
    },
    wordPrifixText: {
        fontSize: 14,
        fontWeight: '400',
        color: '#666',
        lineHeight: 16,
        marginRight: scale(5),
    },
    wordInput: {
        flex: 1,
        color: '#666',
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 16,
    },
    pasteContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: verticalScale(26),
    },
    pasteButton: {
        paddingHorizontal: scale(16),
        marginBottom: 10,
        height: verticalScale(36),
        borderRadius: scale(6),
        borderColor: colors.primary,
        borderWidth: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pasteButtonText: {
        fontSize: 14,
        fontWeight: '400',
        color: '#333',
    },
    nextContainer: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        marginTop: verticalScale(129)
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
})