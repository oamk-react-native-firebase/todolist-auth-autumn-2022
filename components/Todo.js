import React, { useState, useEffect } from 'react';
import { 
  View, Text, Button, TextInput, Alert, ScrollView, Pressable } 
  from 'react-native';
import { 
  child, 
  equalTo, 
  onValue, 
  orderByChild, 
  push, 
  query, 
  ref, 
  update } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { db, TODOS_REF, USERS_REF } from '../firebase/Config';
import { TodoItem } from './TodoItem';
import { MaterialIcons } from '@expo/vector-icons';
import { logout } from './Auth';
import styles from '../style/style';

export default function Todo({ navigation }) {

  const currentUserEmail = getAuth().currentUser.email;
  const [userKey, setUserKey] = useState('');
  const [nickname, setNickname] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState({});

  useEffect(() => {
    const userRef = query(
      ref(db, USERS_REF), 
      orderByChild('email'), 
      equalTo(currentUserEmail));
    onValue(userRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        setUserKey(childSnapshot.key);
        setNickname(childSnapshot.val().nickname);
        const todoItemsRef = ref(db, TODOS_REF + childSnapshot.key);
          onValue(todoItemsRef, (snapshot) => {
          const data = snapshot.val() ? snapshot.val() : {};
          const todoItems = {...data};
          setTodos(todoItems);
        });
      });
    });
  }, []);
  
  const addNewTodo = () => {
    if (newTodo.trim() !== "") {
      const newTodoItem = {
        done: false,
        todoItem: newTodo
      };
      const newTodoItemKey = push(child(ref(db), TODOS_REF + userKey)).key;
      const updates = {};
      updates[TODOS_REF + userKey + "/" + newTodoItemKey] = newTodoItem;
      setNewTodo('');
      return update(ref(db), updates);
    }
  }

  const removeTodos = () => {
    const removes = {};
    removes[TODOS_REF + userKey] = null;
    return update(ref(db), removes);
  }

  const handlePress = () => {
    logout();
    navigation.replace('Welcome');
  };

  const createTwoButtonAlert = () => Alert.alert(
    "Todolist", "Remove all items?", [{
      text: "Cancel",
      onPress: () => console.log("Cancel Pressed"),
      style: "cancel"
    },
    { 
      text: "OK", onPress: () => removeTodos()
    }],
    { cancelable: false }
  );

  let todosKeys = Object.keys(todos);

  return (
    <View 
      style={styles.container}
      contentContainerStyle={styles.contentContainerStyle}>
      <View style={styles.headerItem}>
        <Text style={styles.header}>Todolist ({todosKeys.length})</Text>
        <Pressable style={styles.logoutIcon} onPress={handlePress}>
          <MaterialIcons name="logout" size={24} color="black" />
        </Pressable>
      </View>
      <Text style={styles.infoText}>Hello, {nickname}</Text>
      <View style={styles.newItem}>
        <TextInput
          placeholder='Add new todo'
          value={newTodo}
          style={styles.textInput}
          onChangeText={setNewTodo}
        />
      </View>
      <View style={styles.buttonStyle}>
        <Button 
          title="Add new Todo item"
          onPress={() => addNewTodo()}
        />
      </View>
      <ScrollView>
        {todosKeys.length > 0 ? (
          todosKeys.map(key => (
          <TodoItem
            key={key}
            id={key}
            todoItem={todos[key]}
            userKey={userKey}
          />
        ))
        ) : (
          <Text style={styles.infoText}>There are no items</Text>
        )}
        <View style={styles.buttonStyle}>
          <Button 
            title="Remove all todos" 
            onPress={() => createTwoButtonAlert()} />
        </View>
      </ScrollView>
    </View>
  );
}