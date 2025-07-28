import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ID } from "react-native-appwrite";
import { Button, SegmentedButtons, TextInput, useTheme } from "react-native-paper";

const FREQUENCIES = ["daily", "weekly", "montly"]
type Frequency = (typeof FREQUENCIES)[number];

export default function AddHabitScreen() {
    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [frequency, setFrequency] = useState<string>("")
    const [error, setError] = useState<string>("");
    const { user } = useAuth()
    const router = useRouter();
    const theme = useTheme();

    const handleSubmit = async () => {
        if (!user) return;
        try {
            await databases.createDocument(DATABASE_ID, HABITS_COLLECTION_ID, ID.unique(), {
                user_id: user.$id,
                title,
                description,
                frequency,
                streak_count: 0,
                last_completed: new Date().toISOString(),
                created_at: new Date().toISOString()
            });
            router.back();
        } catch (error) {
            if(error instanceof Error){
                setError(error.message)
                return
            }

            setError("There was an error creating the habit");
        }

    };
    return (
        <View style={styles.container}>

            <TextInput style={styles.input}
                label="Title" onChangeText={setTitle}
                mode="outlined" />
            <TextInput style={styles.input}
                label="Description"
                onChangeText={setDescription}
                mode="outlined" />
            <View style={styles.frequencyContainer}>
                <SegmentedButtons
                    value={frequency}
                    onValueChange={(value) => setFrequency(value as Frequency)}
                    style={styles.segmentedButtons} buttons={FREQUENCIES.map((freq) => ({
                        value: freq,
                        label: freq.charAt(0).toUpperCase() + freq.slice(1),

                    }))} />
            </View>

            <Button mode="contained" onPress={handleSubmit} disabled={!title || !description} style={styles.button} >
                Add Habit</Button>
                {error && <Text style={{color:theme.colors.error}}>{error}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5'
    },

    input: {
        marginBottom: 16,
    },

    frequencyContainer: {
        marginBottom: 24
    },

    segmentedButtons: {
        marginBottom: 16
    },

    button: {
        marginTop: 8
    }
})