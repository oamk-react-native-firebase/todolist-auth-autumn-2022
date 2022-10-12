import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo'
import { ref, update } from 'firebase/database';
import { db, TODOS_REF } from '../firebase/Config';
import styles from '../style/style';

export const TodoItem = ({
  todoItem: {todoItem: title, done}, id, userKey}) => {

  const [doneState, setDone] = useState(done);

  const onCheck = () => {
    setDone(!doneState);
    const updateTodoItem = {
      todoItem: title,
      done: !doneState
    };
    const updates = {};
    updates[TODOS_REF + userKey + "/" + id] = updateTodoItem;
    return update(ref(db), updates);
  };

  const onRemove = () => {
    const removes = {};
    removes[TODOS_REF + userKey + "/" + id] = null;
    return update(ref(db), removes);
  };

  return (
    <View style={styles.todoItem}>
      <Pressable onPress={onCheck}>
        {doneState 
          ? <MaterialIcons name={'check-box'} size={32} />
          : <MaterialIcons name={'check-box-outline-blank'} size={32} />}
      </Pressable>
      <Text onPress={onCheck}
        style={
          [styles.todoText, 
          {backgroundColor: doneState ? "lightgreen" : "lightblue"}]}>{title}
      </Text>
      <Pressable>
        <Entypo name={'trash'} size={32} onPress={onRemove} />
      </Pressable>
    </View>
  );
}