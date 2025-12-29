import {
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Text,
} from "react-native";
import { useRef, useState } from "react";
import { useRouter } from "expo-router";
import { supabase } from "../../scripts/supabase";
import { styles } from "../../css/login";
import { FontAwesome6 } from '@expo/vector-icons';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // label animações
  const emailAnim = useRef(new Animated.Value(0)).current;
  const passAnim = useRef(new Animated.Value(0)).current;

  // barra animações
  const emailBarAnim = useRef(new Animated.Value(0)).current;
  const passBarAnim = useRef(new Animated.Value(0)).current;

  function animateUp(anim) {
    Animated.timing(anim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }

  function animateDown(anim, value) {
    if (!value) {
      Animated.timing(anim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }

  function barFocus(anim) {
    Animated.timing(anim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  function barBlur(anim, value) {
    if (!value) {
      Animated.timing(anim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Login inválido");
      return;
    }

    router.replace("/(tabs)");
  }

  const getLabelStyle = (anim) => ({
    top: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [10, -12],
    }),
    fontSize: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 14],
    }),
    color: anim.interpolate({
      inputRange: [0, 1],
      outputRange: ["#999", "#f0f0f0"],
    }),
  });

  return (
    <ImageBackground
      source={require("../../image/background.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.containerLogin}>
        {/* EMAIL */}
        <View style={styles.group}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            style={styles.input}
            onFocus={() => {
              animateUp(emailAnim);
              barFocus(emailBarAnim);
            }}
            onBlur={() => {
              animateDown(emailAnim, email);
              barBlur(emailBarAnim, email);
            }}
          />

          <Animated.Text style={[styles.label, getLabelStyle(emailAnim)]}>
            Email
          </Animated.Text>

          <View style={styles.barContainer}>
            <View style={styles.barBase} />
            <Animated.View
              style={[
                styles.barActive,
                { transform: [{ scaleX: emailBarAnim }] },
              ]}
            />
          </View>
        </View>

        {/* PASSWORD */}
        <View style={styles.group}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            onFocus={() => {
              animateUp(passAnim);
              barFocus(passBarAnim);
            }}
            onBlur={() => {
              animateDown(passAnim, password);
              barBlur(passBarAnim, password);
            }}
          />

          <Animated.Text style={[styles.label, getLabelStyle(passAnim)]}>
            Password
          </Animated.Text>

          <View style={styles.barContainer}>
            <View style={styles.barBase} />
            <Animated.View
              style={[
                styles.barActive,
                { transform: [{ scaleX: passBarAnim }] },
              ]}
            />
          </View>
        </View>


        <TouchableOpacity onPress={handleLogin} style={styles.buttonLogin}>
          <View style={styles.content}>
            <Text style={styles.buttonTextLogin}>Entrar</Text>
            <FontAwesome6 style={styles.iconLogin} name="arrow-right-long" size={18} color="#fff" />
          </View>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}
