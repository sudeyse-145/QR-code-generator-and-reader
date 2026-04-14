import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { API_URL } from '@/constants/config';

// Custom Floating Label Input Component

const FloatingLabelInput = ({ control, name, label, icon, placeholder, keyboardType = 'default' }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value } }) => (
                <View className={`bg-white border rounded-xl p-3 mb-4 ${isFocused ? 'border-blue-600' : 'border-gray-300'}`}>
                    <Text className={`text-xs ml-8 ${isFocused || value ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
                        {label}
                    </Text>
                    <View className="flex-row items-center mt-1">
                        <View className="w-8 items-center justify-center">
                            {icon}
                        </View>
                        <TextInput
                            className="flex-1 text-lg text-gray-800 ml-2 h-8"
                            placeholder={isFocused ? placeholder : ''}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => {
                                setIsFocused(false);
                                onBlur();
                            }}
                            onChangeText={onChange}
                            value={value}
                            keyboardType={keyboardType}
                            autoCapitalize="none"
                        />
                    </View>
                </View>
            )}
        />
    );
};

export default function FormScreen() {
    const router = useRouter();
    const { control, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const token = await SecureStore.getItemAsync('token');
            if (!token) {
                Alert.alert('Auth Error', 'You must be logged in to create a QR code.');
                router.push('/(auth)/login');
                return;
            }

            // TODO: Replace with actual IP
            const response = await fetch(`${API_URL}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                // Navigate to Result screen with the profile ID
                router.push({
                    pathname: '/result',
                    params: { profileId: result.profile_id }
                });
            } else {
                Alert.alert('Error', result.error || 'Failed to generate profile');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar style="dark" />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                <ScrollView className="flex-1 p-6">
                    <View className="flex-row items-center mb-6">
                        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
                        <Text className="text-2xl font-bold ml-2">Enter Details</Text>
                    </View>

                    <Text className="text-gray-500 mb-6">Fill in the links you want to share via your QR code.</Text>

                    <FloatingLabelInput
                        control={control} name="tiktok" label="TikTok Username"
                        placeholder="@username"
                        icon={<FontAwesome name="music" size={20} color={loading ? "gray" : "black"} />}
                    />
                    <FloatingLabelInput
                        control={control} name="instagram" label="Instagram Username"
                        placeholder="@username"
                        icon={<FontAwesome name="instagram" size={20} color={loading ? "gray" : "black"} />}
                    />
                    <FloatingLabelInput
                        control={control} name="telegram" label="Telegram Username"
                        placeholder="username"
                        icon={<FontAwesome name="paper-plane" size={18} color={loading ? "gray" : "#0088cc"} />}
                    />
                    <FloatingLabelInput
                        control={control} name="facebook" label="Facebook Profile"
                        placeholder="profile_id"
                        icon={<FontAwesome name="facebook" size={20} color={loading ? "gray" : "#3b5998"} />}
                    />
                    <FloatingLabelInput
                        control={control} name="X" label="X (Twitter) Handle"
                        placeholder="@handle"
                        icon={<Text className="font-bold text-lg">𝕏</Text>}
                    />
                    <FloatingLabelInput
                        control={control} name="phone" label="Phone Number"
                        placeholder="+123456789" keyboardType="phone-pad"
                        icon={<FontAwesome name="phone" size={20} color={loading ? "gray" : "green"} />}
                    />
                    <FloatingLabelInput
                        control={control} name="email" label="Email Address"
                        placeholder="you@example.com" keyboardType="email-address"
                        icon={<FontAwesome name="envelope" size={18} color={loading ? "gray" : "orange"} />}
                    />

                    <TouchableOpacity
                        className="bg-blue-600 py-4 rounded-xl mt-4 mb-10 shadow-lg"
                        onPress={handleSubmit(onSubmit)}
                        disabled={loading}
                    >
                        <Text className="text-white text-center font-bold text-lg">
                            {loading ? 'Generating...' : 'Generate QR Code'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
