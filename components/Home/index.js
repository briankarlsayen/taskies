import { View, Text, Pressable, StyleSheet, TextInput, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import FaIcon from 'react-native-vector-icons/FontAwesome';
import TaskItem from '../TaskItem'
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
// import PushNotification from "react-native-push-notification";

const taskArr = [
  {
    id: 1,
    title: 'Read',
    isChecked: false,
    notifTime: '15:00',
  },
  {
    id: 2,
    title: 'Draw',
    isChecked: false,
    notifTime: '18:00',
  },
  {
    id: 3,
    title: 'Swim',
    isChecked: false,
    notifTime: null,
  },
  {
    id: 4,
    title: 'Run',
    isChecked: false,
    notifTime: '06:00',
  },
  {
    id: 5,
    title: 'Climb',
    isChecked: false,
    notifTime: '02:00',
  },
  {
    id: 6,
    title: 'Fly',
    isChecked: true,
    notifTime: '15:00',
  },
]

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
    setTask([taskParams, ...task])
    await saveToStorage([taskParams, ...task])
    setInputTask("")
    setDate(null)
    try {
      // PushNotification.localNotificationSchedule({
      //   //... You can use all the options from localNotifications
      //   message: "My Notification Message", // (required)
      //   date: new Date(Date.now() + 10 * 1000), // in 60 secs
      //   allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
      
      //   /* Android Only Properties */
      //   repeatTime: 1, // (optional) Increment of configured repeatType. Check 'Repeating Notifications' section for more info.
      // });
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
  }
});

export default Home