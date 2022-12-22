import { View, Text, Pressable, StyleSheet, TextInput, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import FaIcon from 'react-native-vector-icons/FontAwesome';
import TaskItem from '../TaskItem'
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNotification } from '../../hooks/useNotification';

// TODO feat scheduled notification
// TODO fix close btn ui
// TODO feat recurring task
// TODO feat delete, update task

const AddBtn = ({handleBtnPress, showAddBtn}) => {
  return(
    <>
      {
        showAddBtn ? 
          <View style={styles.addBtn}>
            <Pressable style={styles.iconButton} onPress={handleBtnPress}>
              <FaIcon name='plus' size={25} color="white"/>
            </Pressable>
          </View> : null
      }
    </>
  )
}

const CloseBtn = ({handleClose}) => {
  return(
    <View style={styles.closeButtonContainer}>
      <Pressable style={styles.closeButton} onPress={handleClose}>
        <FaIcon name="close" size={25} color="white" />
      </Pressable>
    </View>
  )
}

const TaskContainer = ({task, handleCheck, navigation}) => {
  return(
    <View>
      { task && task?.map(item => {
        return(
          <TaskItem key={item.id} id={item.id} title={item.title} isChecked={item.isChecked} notifTime={item.notifTime} handleCheck={handleCheck} navigation={navigation} />
      )})
      }
    </View>
  )
}

const InputContainer = ({ inputTask, setInputTask, showInputContainer, setShowInputContainer, handleClose, handleSubmit, date, setDate, openDateModal, setOpenDateModal }) => {
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setOpenDateModal(false);
    setDate(currentDate);
  };
  const deleteAllTask= async()=>{
    await AsyncStorage.clear()
  }
  return(
    <>
    { showInputContainer ? 
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          onChangeText={setInputTask}
          value={inputTask}
          placeholder="Enter a tasker"
          onSubmitEditing={handleSubmit}
        />
        <Pressable style={styles.taskNofiTimeContainer} onPress={()=>setOpenDateModal(true)}>
          <FaIcon name="calendar" size={25} color="gray" />
          <Text style={styles.taskNotifText}>{date ? new Date(date).toString() : 'none'}</Text>
        </Pressable>
        {
          openDateModal ? 
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={'time'}
            is24Hour={true}
            onChange={onChange}
          /> : null
        }
        <Pressable>
          <Text style={styles.deleteAll} onPress={deleteAllTask}>Delete All</Text>
        </Pressable>
        <CloseBtn handleClose={handleClose} />
      </View> : null
    }
    </>
  )
}

const saveToStorage = async(data) => {
  try {
    // alert('Data successfully saved!');
    const jsonValue = JSON.stringify(data)
    await AsyncStorage.setItem('@storage_Key', jsonValue)
  } catch(error) {
    alert('Failed to save name.');
  }
}

const Home = ({ navigation }) => {
  const [task, setTask] = useState([])
  const [inputTask, setInputTask] = useState('')
  const [showInputContainer, setShowInputContainer] = useState(false)
  const [showAddBtn, setShowAddBtn] = useState(true)
  const [date, setDate] = useState(new Date())
  const [openDateModal, setOpenDateModal] = useState(false)

  const {
    displayNotification,
    displayTriggerNotification,
    cancelAllNotifications
  } = useNotification();

  const handleCreateTriggerNotification = (title, body, triggerDate) => {
    console.log('title1', title)
    console.log('number date', Number(new Date(triggerDate)));
    const triggerDateNo = Number(new Date(triggerDate));
    if(Date.now() >= triggerDateNo) throw Error('Invalid date')
    displayTriggerNotification(title, body, triggerDateNo);
  }

  const handleBtnPress = () => {
    setShowInputContainer(true)
    setShowAddBtn(false)
    setDate(new Date())
  }

  const handleClose = () => {
    setShowInputContainer(false)
    setShowAddBtn(true)
  }

  const getFromStorage = async() => {
    try {
      const jsonValue = await AsyncStorage.getItem('@storage_Key')
      if(jsonValue.length) {
        setTask(JSON.parse(jsonValue))
      }
      return jsonValue
    } catch(error) {
      alert('Failed to get storage items.');
    }
  }

  useEffect(()=>{
    getFromStorage()
  }, [])

  const handleSubmit = async() => {
    const taskParams = {
      id: task ? task.length + 1 : 1,
      title: inputTask,
      isChecked: false,
      notifTime: date,
    }
    try {
      const defaultTitle = 'Notification';
      handleCreateTriggerNotification(defaultTitle, inputTask, date)
      setTask([taskParams, ...task])
      await saveToStorage([taskParams, ...task])
      setInputTask("")
    } catch(error) {
      console.log('error', error)
    }
  }

  const handleCheck = (id) => {
    const taskIndex = task.findIndex(item => item.id === id)
    task.splice(taskIndex, 1, {
      ...task[taskIndex],
      isChecked: !task[taskIndex].isChecked
    });
    setTask([...task])
  }

  return (
    <View style={styles.container}>
      <TaskContainer task={task} handleCheck={handleCheck} navigation={navigation} />
      <AddBtn handleBtnPress={handleBtnPress} showAddBtn={showAddBtn} setShowAddBtn={setShowAddBtn} />
      <InputContainer 
        inputTask={inputTask} 
        setInputTask={setInputTask} 
        showInputContainer={showInputContainer} 
        setShowInputContainer={setShowInputContainer} 
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        date={date}
        setDate={setDate}
        openDateModal={openDateModal}
        setOpenDateModal={setOpenDateModal} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: '100%',
    width: '100%',
    backgroundColor: '#EAEAEA'
  },
  textInput: {
    alignSelf: 'center',
    width: '80%',
    paddingHorizontal: 10,
    fontSize: 15,
    marginLeft: 20,
  },
  textInputContainer: {
    backgroundColor: '#B2B2B2',
    height: 200,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    paddingTop: 10,
    alignContent: 'center',
    textAlign: 'center'
  },
  dateText: {
    textAlign: 'center',
    fontSize: 18
  }, 
  dateButton:  {
    width: 'fit-content',
    color: '#00ABB3'
  },
  addBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },  
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00ABB3',
    color: 'white',
    width: 64,
    height: 64,
    borderRadius: 100,
  },
  closeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    width: 40,
    height: 40,
    position: 'absolute',
    bottom: 38,
    right: 0,
    backgroundColor: '#00ABB3',
  },
  closeButtonContainer: {
    position: 'relative',
  },
  iconButtonLabel: {
    color: '#fff',
    marginTop: 12,
  },
  taskNofiTimeContainer: {
    display: 'flex', 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20
  },
  taskNotifText: {
  paddingLeft: 20,
  },
  deleteAll: {
    marginVertical: 20,
    backgroundColor: 'red',
    color: 'white',
    padding: 10,
    textAlign: 'center'
  }
}
);

export default Home