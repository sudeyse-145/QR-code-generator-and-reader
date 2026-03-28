import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { API_URL } from '@/constants/config';

export default function SignupScreen() {

    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Account created! Please log in.');
                router.back();
            } else {
                Alert.alert('Signup Failed', data.error || 'Something went wrong');
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
            <Text className="text-3xl font-bold text-gray-800 mb-8 text-center">Create Account</Text>

            <View className="space-y-4">
                <View>
                    <Text className="text-gray-600 mb-2 ml-1">Username</Text>
                    <TextInput
                        className="bg-white border border-gray-300 p-4 rounded-xl text-lg"
                        placeholder="Choose a username"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                </View>

                <View>
                    <Text className="text-gray-600 mb-2 ml-1">Password</Text>
                    <TextInput
                        className="bg-white border border-gray-300 p-4 rounded-xl text-lg"
                        placeholder="Choose a password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    className="bg-green-600 py-4 rounded-xl mt-6 shadow-md"
                    onPress={handleSignup}
                    disabled={loading}
                >
                    <Text className="text-white text-center font-bold text-lg">
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.back()} className="mt-4">
                    <Text className="text-gray-500 text-center">Go back</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
