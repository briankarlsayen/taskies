import { View, Text, StyleSheet } from 'react-native'
import { CheckBox, Icon } from '@rneui/themed';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import React from 'react'

const TaskDetails = ({ route }) => {
  return (
    <View style={styles.container}>
      <CheckBox
        containerStyle={{backgroundColor: '#EAEAEA'}}
        checked={route.params.isChecked}
        checkedIcon={
          <Icon
            name="radio-button-checked"
            type="material"
            color="#00ABB3"
            size={25}
            iconStyle={{ marginRight: 10 }}
          />
        }
        uncheckedIcon={
          <Icon
            name="radio-button-unchecked"
            type="material"
            color="grey"
            size={25}
            iconStyle={{ marginRight: 10 }}
          />
        }
        title={route.params.title}
      />
      <View style={styles.taskNofiTimeContainer}>
        <FaIcon name="calendar" size={25} color="gray" />
        <Text style={styles.taskNotifText}>{route.params.notifTime ? new Date(route.params.notifTime).toString() : 'none'}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#EAEAEA',
    minHeight: '100%'
  },
  taskTitle: {
    fontSize: 15,
  },
  checkboxChecked: {
    textDecorationLine: "line-through",
    color: '#959595'
  },
  checkboxUnchecked: {
    color: '#525252'
  },
  taskNofiTimeContainer: {
    display: 'flex', 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20
  },
  taskNotifText: {
  paddingLeft: 20,
  }
});

export default TaskDetails