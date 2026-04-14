import { View, Text, TouchableOpacity, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { API_URL } from '@/constants/config';

export default function ResultScreen() {

    const router = useRouter();
    const { profileId } = useLocalSearchParams();

    // TODO: Replace with actual deployed URL or local IP for testing
    const qrValue = `${API_URL}/profile/${profileId}`; // Or deep link scheme like qrgen://profile/123

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out my profile connections! ${qrValue}`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View className="flex-1">
            <StatusBar style="light" />
            <LinearGradient
                colors={['#4c669f', '#3b5998', '#192f6a']}
                className="flex-1 justify-center items-center p-6"
            >
                <Text className="text-white text-3xl font-bold mb-2">Success!</Text>
                <Text className="text-blue-100 text-center mb-10">Your QR Code has been generated successfully.</Text>

                <View className="bg-white p-6 rounded-3xl shadow-2xl items-center justify-center mb-10">
                    <QRCode
                        value={qrValue}
                        size={200}
                        color="black"
                        backgroundColor="white"
                    />
                    <Text className="text-gray-400 text-xs mt-4">ID: {profileId}</Text>
                </View>

                <View className="flex-row space-x-4 w-full justify-center">
                    {/* Save Button (Mock) */}
                    <TouchableOpacity
                        className="bg-white/20 p-4 rounded-xl flex-row items-center space-x-2"
                        onPress={() => alert('Save to Gallery logic would go here')}
                    >
                        <Ionicons name="download-outline" size={24} color="white" />
                        <Text className="text-white font-semibold ml-2">Save</Text>
                    </TouchableOpacity>

                    {/* Share Button */}
                    <TouchableOpacity
                        className="bg-white/20 p-4 rounded-xl flex-row items-center space-x-2"
                        onPress={handleShare}
                    >
                        <Ionicons name="share-outline" size={24} color="white" />
                        <Text className="text-white font-semibold ml-2">Share</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    className="mt-12"
                    onPress={() => router.push('/home')}
                >
                    <Text className="text-white/60">Back to Dashboard</Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
}
