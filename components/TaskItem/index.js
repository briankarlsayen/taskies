import { View, StyleSheet, Button, Text, Pressable } from 'react-native'
import { CheckBox, Icon } from '@rneui/themed';
import React from 'react'

const TaskItem = ({ id, title, isChecked, notifTime, handleCheck, navigation }) => {
  return (
    <View style={{display: 'flex', flexDirection: 'row', margin: 'auto', alignItems: 'center' }}>
      <CheckBox
        containerStyle={{backgroundColor: '#EAEAEA'}}
        checked={isChecked}
        onPress={() => handleCheck(id)}
        checkedIcon={
          <Icon
            name="radio-button-checked"
            type="material"
            color="#00ABB3"
            size={25}
          />
        }
        uncheckedIcon={
          <Icon
            name="radio-button-unchecked"
            type="material"
            color="grey"
            size={25}
          />
        }
        // title={title}
        textStyle={isChecked ? styles.checkboxChecked: styles.checkboxUnchecked}
      />
      <Pressable style={{flex: 1,}} onPress={()=>navigation.navigate("TaskDetails", { 
        id,
        title,
        isChecked, 
        notifTime
       })}>
        <Text style={isChecked ? styles.checkboxChecked : styles.checkboxUnchecked }>{title}</Text>
      </Pressable>
      {/* <Button title="click" onPress={()=>navigation.navigate("TaskDetails", { 
        id,
        title,
        isChecked, 
        notifTime
       })} /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    paddingVertical: 20,
    backgroundColor: '#EAEAEA',
    borderColor: '#3C4048',
    paddingHorizontal: 15,
    borderTopWidth: 1,
  },
  taskTitle: {
    fontSize: 15,
  },
  checkboxChecked: {
    textDecorationLine: "line-through",
    flexGrow: 1, 
    textAlignVertical: 'center',
    color: '#959595'
  },
  checkboxUnchecked: {
    color: '#525252',
    flexGrow: 1, 
    textAlignVertical: 'center',
  }
});

export default TaskItem