import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import PagerView from "react-native-pager-view";
import Navbar from "../../components/navbar";
import MnemonicQr from "./components/mnemonic-qr";
import MnemonicText from "./components/mnemonic-text";
import { scale } from "react-native-size-matters/extend";
import Tab from "./components/tab";
import { StackScreenProps } from "@react-navigation/stack";
type Props = StackScreenProps<RootStackParamList, 'BackupMnemonic'>;
const BackupMnemonicScreen = ({navigation,route}: Props) => {
    const insets = useSafeAreaInsets();
    const pagerViewRef = useRef<PagerView>(null);
    const [pageIndex, setPageIndex] = useState(0);
    const [mnemonic, setMnemonic] = useState('');
    useEffect(() => {
        const focusEvent = navigation.addListener('focus', () => {
            setMnemonic(route.params.mnemonic);
        });
        const blurEvent = navigation.addListener('blur', () => {
            setMnemonic('');
        });
        return () =>{
            focusEvent();
            blurEvent();
        };
    },[]);
    return (
        <View style={{
            ...styles.container,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
        }}>
            <View>
                <Navbar title="備份助記詞" />
            </View>
            <View style={{
                paddingHorizontal: scale(15),
                paddingTop: scale(21),
            }}>
                <Tab onChange={(v) => {
                    setPageIndex(v);
                    pagerViewRef.current?.setPage(v);
                }} index={pageIndex} />
            </View>
            <View style={{
                paddingHorizontal: scale(30),
                paddingTop: scale(20),
            }}>
                <Text style={{
                    fontSize: 14,
                    fontWeight: '400',
                    color: '#FF4018',
                    textAlign: 'center',
                }}>注意： TD chat不會保存您的助記詞，請您妥 善保管好助記詞，以免造成財產損失。</Text>
            </View>
            <PagerView ref={pagerViewRef} onPageSelected={(e) => {
                setPageIndex(e.nativeEvent.position);
            }} style={{ flex: 1 }} initialPage={pageIndex} scrollEnabled={true}>
                <MnemonicQr key="0" mnemonic={mnemonic} />
                <MnemonicText key="1" mnemonic={mnemonic} />
            </PagerView>
        </View>
    );
};

export default BackupMnemonicScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    }
})