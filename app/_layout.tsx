import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isLoadingUser } = useAuth()
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === "auth";
    


    if (!user && !inAuthGroup && !isLoadingUser) {
      const timeout = setTimeout(() => {
        router.replace("/auth");
        console.log("auth")
      }, 0.1);
      return () => clearTimeout(timeout);

    } else if (user && inAuthGroup && !isLoadingUser) {
      const timeout = setTimeout(() => {
        router.replace("/");
        console.log("login")
      }, 0.1);
      return () => clearTimeout(timeout);

    }
  }, [user, segments]);



  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{flex:1}}>
    <PaperProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <RouteGuard>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </RouteGuard>
        </AuthProvider>
      </SafeAreaProvider>
    </PaperProvider>
    </GestureHandlerRootView>
  );
}
