import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={{ flex: 1 }}
        >
            <SafeAreaView className="flex-1 justify-center items-center px-6">
                <StatusBar style="light" />

                <Animated.View
                    entering={FadeInUp.delay(200).duration(1000).springify()}
                    className="items-center mb-12"
                >
                    <View className="w-32 h-32 bg-white/20 rounded-3xl justify-center items-center mb-6 border border-white/30 backdrop-blur-md">
                        <Text className="text-6xl">🔗</Text>
                    </View>
                    <Text className="text-4xl font-bold text-white text-center tracking-wider">
                        LinkQR
                    </Text>
                    <Text className="text-white/80 text-lg text-center mt-2">
                        Share your world with a scan
                    </Text>
                </Animated.View>

                <Animated.View
                    entering={FadeInDown.delay(400).duration(1000).springify()}
                    className="w-full space-y-4"
                >
                    <TouchableOpacity
                        onPress={() => router.push('/(auth)/login')}
                        className="w-full bg-white py-4 rounded-2xl active:opacity-90 shadow-lg"
                    >
                        <Text className="text-blue-900 text-center font-bold text-lg">
                            Login
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/(auth)/signup')}
                        className="w-full bg-white/20 border border-white/30 py-4 rounded-2xl active:opacity-90"
                    >
                        <Text className="text-white text-center font-bold text-lg">
                            Create Account
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/home')}
                        className="mt-6"
                    >
                        <Text className="text-white/60 text-center text-sm">
                            Continue as Guest
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </SafeAreaView>
        </LinearGradient>
    );
}
