import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";


export default function AuthScreen() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const theme = useTheme();
    const router = useRouter();

    const { signIn, signUp } = useAuth()

    const handleSwitchMode = () => {
        setIsSignUp((prev) => !prev);
    }

    const handleAuth = async () => {
        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setError(null);

        if (isSignUp) {
            const error = await signUp(email, password)
            if (error) {
                setError(error)
            }
        } else {
            const error = await signIn(email, password)
            if (error) {
                setError(error)
            }
            router.replace("/")
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <View style={styles.content}>
                <Image style={styles.logo} src="" />
                <Text style={styles.title} variant="headlineMedium">{isSignUp ? "Register" : "Welcome Back"}</Text>
                <TextInput label="Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="johndoe@example.com"
                    mode="outlined"
                    style={styles.input}
                    onChangeText={setEmail} />

                <TextInput label="Password"
                    autoCapitalize="none"
                    placeholder="your password"
                    secureTextEntry
                    mode="outlined"
                    style={styles.input}
                    onChangeText={setPassword} />

                {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}

                <Button mode="contained" style={styles.button} onPress={() => {
                    handleAuth()
                }}>
                    {isSignUp ? "Sign Up" : "Sign In"}
                </Button>
                <Button mode="text" onPress={handleSwitchMode} style={styles.switchModeButton} >
                    {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                </Button>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        padding: 16,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    textStyle: {
        color: '#291212ff',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: 24,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
    },
    switchModeButton: {
        marginTop: 16,
    },
    logo: {
        width:66,
        height: 58
    }

})