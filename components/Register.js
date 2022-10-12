import React, { useState } from 'react';
import { View, Text, TextInput, Alert, Button, Pressable} from 'react-native';
import { register } from './Auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import styles from '../style/style';

export default function Register({ navigation }) {

  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const clearState = () => {
    setNickname('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handlePress = () => {
    if (!nickname) {
      Alert.alert('Nickname is required');
    }
    else if (!email) {
      Alert.alert('Email is required.');
    } else if (!password) {
      Alert.alert('Password is required.');
    } else if (!confirmPassword) {
      setPassword('');
      Alert.alert('Confirming password is required.');
    } else if (password !== confirmPassword) {
      Alert.alert('Password does not match!');
    } else {
      register(nickname, email, password);
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          navigation.replace('Todo');
        } else {
          clearState();
          navigation.replace('Welcome');
        } 
      });
    }
  };

  return (
    <View 
      style={styles.container}
      contentContainerStyle={styles.contentContainerStyle}>
      <Text style={styles.header}>Todos</Text>
      <Text style={styles.infoText}>Create an account</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Nickname*"
        value={nickname}
        onChangeText={(nickname) => setNickname(nickname.trim())}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Enter your email*"
        value={email}
        onChangeText={(email) => setEmail(email.trim())}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.textInput}
        placeholder="Enter your password*"
        value={password}
        onChangeText={(password) => setPassword(password)}
        secureTextEntry={true}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Confirm password*"
        value={confirmPassword}
        onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
        secureTextEntry={true}
      />
      <Pressable style={styles.buttonStyle}>
        <Button 
          title="Register"
          onPress={handlePress} />
      </Pressable>
      <Text style={styles.infoText}>Already have an account?</Text>
      <Pressable style={styles.buttonStyle}>
        <Button
          title="Login"
          onPress={() => navigation.navigate('Login')} />
      </Pressable>
    </View>
  );
}