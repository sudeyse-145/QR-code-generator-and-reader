import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScannerScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const router = useRouter();
    const [scanned, setScanned] = useState(false);

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        // Expected format: http://.../profile/{id}
        // We need to extract the ID.
        try {
            // Simple extraction logic: last segment of URL
            const parts = data.split('/');
            const id = parts[parts.length - 1]; // Assuming ID is last part

            if (id && !isNaN(id)) {
                Alert.alert(
                    'QR Scanned',
                    `Found Profile ID: ${id}`,
                    [
                        { text: 'Cancel', onPress: () => setScanned(false), style: 'cancel' },
                        { text: 'View Profile', onPress: () => router.push(`/profile/${id}`) },
                    ]
                );
            } else {
                Alert.alert('Invalid QR', 'This QR code does not contain a valid profile ID.', [{ text: 'OK', onPress: () => setScanned(false) }]);
            }

        } catch (e) {
            Alert.alert('Error', 'Failed to parse QR code.', [{ text: 'OK', onPress: () => setScanned(false) }]);
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing="back"
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
            >
                <SafeAreaView className="flex-1 justify-between p-6">
                    <TouchableOpacity onPress={() => router.back()} className="bg-black/40 p-2 rounded-full w-10 h-10 items-center justify-center">
                        <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>

                    <View className="items-center mb-20">
                        <Text className="text-white text-lg font-bold bg-black/40 px-4 py-2 rounded-lg">Scan a Profile QR</Text>
                        <View className="w-64 h-64 border-2 border-white rounded-3xl mt-10 opacity-50" />
                    </View>
                </SafeAreaView>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
});
