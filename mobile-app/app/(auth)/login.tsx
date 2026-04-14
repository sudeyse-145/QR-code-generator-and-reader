import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@/constants/config';

export default function LoginScreen() {

    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            // TODO: Replace with actual IP address for emulator/device
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                await SecureStore.setItemAsync('token', data.token);
                await SecureStore.setItemAsync('user', JSON.stringify(data.user));
                router.replace('/home');
            } else {
                Alert.alert('Login Failed', data.error || 'Something went wrong');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to connect to server');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50 p-6 justify-center">
            <StatusBar style="dark" />
            <Text className="text-3xl font-bold text-gray-800 mb-8 text-center">Welcome Back</Text>

            <View className="space-y-4">
                <View>
                    <Text className="text-gray-600 mb-2 ml-1">Username</Text>
                    <TextInput
                        className="bg-white border border-gray-300 p-4 rounded-xl text-lg"
                        placeholder="Enter your username"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                </View>

                <View>
                    <Text className="text-gray-600 mb-2 ml-1">Password</Text>
                    <TextInput
                        className="bg-white border border-gray-300 p-4 rounded-xl text-lg"
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    className="bg-blue-600 py-4 rounded-xl mt-6 shadow-md"
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text className="text-white text-center font-bold text-lg">
                        {loading ? 'Logging in...' : 'Log In'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.back()} className="mt-4">
                    <Text className="text-gray-500 text-center">Go back</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
