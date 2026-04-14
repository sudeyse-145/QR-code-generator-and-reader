import { View, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { API_URL } from '@/constants/config';

export default function ProfileScreen() {

    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, [id]);

    const fetchProfile = async () => {
        try {
            // TODO: Replace with actual IP
            const response = await fetch(`${API_URL}/profile/${id}`);
            const data = await response.json();
            if (response.ok) {
                setProfile(data);
            } else {
                Alert.alert('Error', 'Profile not found');
                router.push('/home'); // Go back if invalid
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const openLink = async (platform, handle) => {
        if (!handle) return;

        let url = '';
        // Deep Linking Logic
        switch (platform) {
            case 'instagram':
                url = `instagram://user?username=${handle.replace('@', '')}`;
                // Fallback to web if app not installed? Linking.openURL usually handles valid schemes, if not it errors. 
                // For better UX, can try/catch and fallback to https://instagram.com/${handle}
                break;
            case 'tiktok':
                url = `https://www.tiktok.com/@${handle.replace('@', '')}`; // TikTok scheme is diff, web is safer
                break;
            case 'telegram':
                url = `tg://resolve?domain=${handle}`;
                break;
            case 'facebook':
                url = `fb://profile/${handle}`;
                break;
            case 'X':
                url = `twitter://user?screen_name=${handle.replace('@', '')}`;
                break;
            case 'phone':
                url = `tel:${handle}`;
                break;
            case 'email':
                url = `mailto:${handle}`;
                break;
            default:
                return;
        }

        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                // Fallbacks for web
                if (platform === 'instagram') await Linking.openURL(`https://instagram.com/${handle.replace('@', '')}`);
                if (platform === 'facebook') await Linking.openURL(`https://facebook.com/${handle}`);
                if (platform === 'X') await Linking.openURL(`https://twitter.com/${handle.replace('@', '')}`);
                if (platform === 'telegram') await Linking.openURL(`https://t.me/${handle}`);
            }
        } catch (err) {
            Alert.alert('Error', `Could not open ${platform}`);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Loading Profile...</Text>
            </View>
        );
    }

    if (!profile) return null;

    return (
        <SafeAreaView className="flex-1 bg-white p-6">
            <StatusBar style="dark" />
            <TouchableOpacity onPress={() => router.push('/home')} className="mb-6">
                <Ionicons name="close" size={28} color="black" />
            </TouchableOpacity>

            <View className="items-center mb-10">
                <View className="w-24 h-24 bg-gray-200 rounded-full items-center justify-center mb-4">
                    <Ionicons name="person" size={48} color="gray" />
                </View>
                <Text className="text-2xl font-bold text-gray-800">Use Profile #{id}</Text>
                <Text className="text-gray-500">Connect with them below</Text>
            </View>

            <View className="space-y-4">
                {profile.instagram && (
                    <SocialButton
                        icon={<FontAwesome name="instagram" size={24} color="white" />}
                        label="Instagram"
                        color="bg-pink-600"
                        onPress={() => openLink('instagram', profile.instagram)}
                    />
                )}
                {profile.tiktok && (
                    <SocialButton
                        icon={<FontAwesome name="music" size={24} color="white" />}
                        label="TikTok"
                        color="bg-black"
                        onPress={() => openLink('tiktok', profile.tiktok)}
                    />
                )}
                {profile.telegram && (
                    <SocialButton
                        icon={<FontAwesome name="paper-plane" size={24} color="white" />}
                        label="Telegram"
                        color="bg-blue-400"
                        onPress={() => openLink('telegram', profile.telegram)}
                    />
                )}
                {profile.facebook && (
                    <SocialButton
                        icon={<FontAwesome name="facebook" size={24} color="white" />}
                        label="Facebook"
                        color="bg-blue-800"
                        onPress={() => openLink('facebook', profile.facebook)}
                    />
                )}
                {profile.phone && (
                    <SocialButton
                        icon={<FontAwesome name="phone" size={24} color="white" />}
                        label="Call Phone"
                        color="bg-green-600"
                        onPress={() => openLink('phone', profile.phone)}
                    />
                )}
                {profile.email && (
                    <SocialButton
                        icon={<FontAwesome name="envelope" size={24} color="white" />}
                        label="Send Email"
                        color="bg-orange-500"
                        onPress={() => openLink('email', profile.email)}
                    />
                )}
            </View>

        </SafeAreaView>
    );
}

const SocialButton = ({ icon, label, color, onPress }) => (
    <TouchableOpacity
        className={`${color} flex-row items-center p-4 rounded-xl shadow-sm`}
        onPress={onPress}
    >
        <View className="w-10 justify-center items-center">
            {icon}
        </View>
        <Text className="text-white font-bold text-lg ml-2">{label}</Text>
        <View className="flex-1 items-end">
            <Ionicons name="arrow-forward" size={20} color="white opacity-50" />
        </View>
    </TouchableOpacity>
);
