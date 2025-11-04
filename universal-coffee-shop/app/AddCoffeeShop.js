import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';


function iPhonePurchaseForm()
{
const [isChecked, setIsChecked] = useState(false);

  const handleChange = (event) => {
    setIsChecked(event.target.checked); // Update state based on the new value
  };

function myFunction()
{
    alert("Hi Mom")
}

    return (<>
     <SafeAreaView style={styles.container}>
        
        <Text>Please enter the details for your new Coffee shop</Text>
        
        <View style={styles.form}>
            <Text style={styles.text}>Coffeeshop name:</Text>
            <TextInput placeholderTextColor={'#747474ff'} placeholder='My Coffee Shop' style={styles.input}></TextInput>
             
            <Text style={styles.text}>Owner name:</Text>
            <TextInput placeholderTextColor={'#747474ff'} placeholder='John Doe' style={styles.input}></TextInput>

            <Text style={styles.text}>Street address:</Text>
            <TextInput placeholderTextColor={'#747474ff'} placeholder='123 Fake Street' style={styles.input}></TextInput>

            <Text style={styles.text}>City:</Text>
            <TextInput placeholderTextColor={'#747474ff'} placeholder='Springfield' style={styles.input}></TextInput>

            <Text style={styles.text}>State:</Text>
            <TextInput placeholderTextColor={'#747474ff'} placeholder='Illinois' style={styles.input}></TextInput>

            <Text style={styles.text}>Phone #:</Text>
            <TextInput placeholderTextColor={'#747474ff'} placeholder='224-123-4567' style={styles.input}></TextInput>

            <Text style={styles.text}>Hours:</Text>
            <TextInput placeholderTextColor={'#747474ff'} placeholder='8am-9:30pm' style={styles.input}></TextInput>


        </View>
        <TouchableOpacity   onPress={myFunction}><Text style={styles.text}>Submit</Text></TouchableOpacity>
        
     
     
     </SafeAreaView>

    
    
    
        </>);
}

const styles = StyleSheet.create({
  container: {
    // 1. Ensure the View takes up the whole screen
    flex: 1, 
    
    // 2. Center items horizontally
    justifyContent: 'center', 
    
    // 3. Center items vertically
    alignItems: 'center', 
    
    // (Optional: Set background color for visibility)
    backgroundColor: '#fff', 
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    // Note: text-align is usually unnecessary here because the container is centered.
  },
  form: 
  {
    borderWidth: 2,
    borderColor: 'black',
    borderStyle: 'solid',
    padding:20,
    margin:10,
    width:250
  },
  input:
  {
    borderWidth: 2,
    borderColor: 'black',
    borderStyle: 'solid',
    fontSize:15,
    color:'black',
    marginBottom:15,

  }
});
 

export default iPhonePurchaseForm;