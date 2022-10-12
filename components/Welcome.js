import React from 'react';
import { View, Text, Button } from 'react-native';
import styles from '../style/style';

export default function Welcome({navigation}) {

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Todos, welcome</Text>
      <Text style={styles.infoText}>For people having lots of things todo</Text>
      <View style={styles.buttonStyle}>
        <Button 
          title="Register" 
          onPress={() => navigation.navigate('Register')} />
      </View>
      <View style={styles.buttonStyle}>
        <Button 
          title="Login" 
          onPress={() => navigation.navigate('Login')} />
      </View>
    </View>
 )
}