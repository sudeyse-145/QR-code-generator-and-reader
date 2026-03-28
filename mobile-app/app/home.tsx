import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function HomeScreen() {
    const router = useRouter();
    const [user, setUser] = useState<{ username: string } | null>(null);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const userData = await SecureStore.getItemAsync('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    };

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('user');
        router.replace('/');
    };

    const MenuItem = ({ icon, title, subtitle, onPress, delay, color = "bg-blue-500" }: any) => (
        <Animated.View
            entering={FadeInDown.delay(delay).duration(600).springify()}
            className="w-[48%] mb-4"
        >
            <TouchableOpacity
                onPress={onPress}
                className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 h-44 justify-between"
            >
                <View className={`${color} w-12 h-12 rounded-2xl items-center justify-center mb-3 shadow-md`}>
                    {icon}
                </View>
                <View>
                    <Text className="font-bold text-lg text-gray-800">{title}</Text>
                    <Text className="text-gray-400 text-xs mt-1">{subtitle}</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar style="dark" />

            {/* Header */}
            <View className="px-6 py-4 flex-row justify-between items-center bg-white/50 z-10 block">
                <View>
                    <Text className="text-gray-400 text-sm">Welcome back,</Text>
                    <Text className="text-2xl font-bold text-gray-800">
                        {user ? user.username : 'Guest'}
                    </Text>
                </View>
                <TouchableOpacity onPress={handleLogout} className="bg-gray-100 p-2 rounded-full">
                    <Ionicons name="log-out-outline" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
                <View className="flex-row flex-wrap justify-between mt-2">
                    <MenuItem
                        delay={100}
                        title="Create"
                        subtitle="New QR Code"
                        icon={<MaterialCommunityIcons name="qrcode-plus" size={24} color="white" />}
                        color="bg-indigo-500"
                        onPress={() => router.push('/form')}
                    />

                    <MenuItem
                        delay={200}
                        title="Scan"
                        subtitle="Read QR Code"
                        icon={<MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />}
                        color="bg-emerald-500"
                        onPress={() => router.push('/scanner')}
                    />
                </View>

                {user && (
                    <Animated.View
                        entering={FadeInDown.delay(300).duration(600).springify()}
                        className="mt-6"
                    >
                        <Text className="text-lg font-bold text-gray-800 mb-4">Your Codes</Text>
                        <View className="bg-white p-6 rounded-3xl border border-gray-100 items-center justify-center py-16 shadow-sm">
                            <View className="bg-gray-50 p-4 rounded-full mb-4">
                                <MaterialCommunityIcons name="file-document-outline" size={32} color="#9ca3af" />
                            </View>
                            <Text className="text-gray-400 font-medium">No QR codes created yet</Text>
                            <TouchableOpacity
                                onPress={() => router.push('/form')}
                                className="mt-4 bg-gray-900 px-6 py-2 rounded-xl"
                            >
                                <Text className="text-white text-sm font-semibold">Create one now</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
