 
import {useState} from 'react';
import {View,Text,TextInput,StyleSheet,ScrollView,TouchableOpacity} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

function AddCoffeeShop()
{

const [coffeeShopName, setCoffeeShopName] = useState("");
const [OwnerID, setID] = useState("");
const [streetAddress, setStreetAddress] = useState("");
const [city, setCity] = useState("");
const [state, setState] = useState("");
const [PhoneNum, setPhoneNumber] = useState("");

const [responseMessage, setResponseMessage] = useState("");


function fun1(e){ setCoffeeShopName(e);}

function fun2(e){  setID(e);}

function fun3(e){ setStreetAddress(e);}

function fun4(e){setCity(e);}

function fun5(e){setState(e);}

function fun6(e){setPhoneNumber(e);}

 const form_content = {
     'coffeeShopName': coffeeShopName, 
    'OwnerID': OwnerID, 
    'streetAddress': streetAddress, 
    'city': city, 
    'state': state, 
    'PhoneNum': PhoneNum, 
};

 const submitForm = async () => {
   
     try {
        const response = await fetch('http://10.0.14.252:8080/recieveForm/', {
            method: 'POST',
            /*no-cors means that the method has to be GET, POST, or HEAD
            Just using it to get more familiar with fetch api*/
            mode: 'no-cors',
             headers: {
                'Content-Type': 'application/json'  
            },
             body: JSON.stringify(form_content)
        });
 
        if (response.ok) {
            /*this hits if everything runs correctly and fetch returns
            with a status code in the range of 200 */
            alert("Form submitted sucessfully");
            const data = await response.json();
            setResponseMessage(data.storeName);
            
        } else {
            /*This hits if the server address is correct, but the response from the
            server gave an error like a 404 status code. One reason for an error 
            could be an incorrect endpoint name*/
            alert("There was an error when submitting the form, please try again. Make sure the phone number includes only numbers and '-'")        
        }
    } catch (error) {
        //This hits if the server address is incorrect (couldn't reach the server)
        setResponseMessage(`Network Error: ${error.message}`); 
    } 
  };

    return (<>
     <SafeAreaView style={styles.container}>

        <ScrollView style={styles.form}>

            <Text style={styles.text}>Please enter the details for your new Coffee shop</Text>

            <Text style={styles.text}>Coffeeshop name:</Text>
            <TextInput placeholderTextColor={'#747474ff'} placeholder='My Coffee Shop' style={styles.input} value={coffeeShopName} onChangeText={fun1}></TextInput>
             
            <Text style={styles.text}>Owner name:</Text>
            <TextInput placeholderTextColor={'#747474ff'} placeholder='John Doe' style={styles.input} value={OwnerID} onChangeText={fun2}></TextInput>

            <Text style={styles.text}>Street address:</Text>
            <TextInput placeholderTextColor={'#747474ff'} placeholder='123 Fake Street' style={styles.input} value={streetAddress} onChangeText={fun3}></TextInput>

            <Text style={styles.text}>City:</Text>
            <TextInput placeholderTextColor={'#747474ff'} placeholder='Springfield' style={styles.input} value={city} onChangeText={fun4}></TextInput>

            <Text style={styles.text}>State:</Text>
            <TextInput placeholderTextColor={'#747474ff'} placeholder='Illinois' style={styles.input} value={state} onChangeText={fun5}></TextInput>

            <Text style={styles.text}>Phone #:</Text>
            <TextInput placeholderTextColor={'#747474ff'} placeholder='224-123-4567' style={styles.input} value={PhoneNum} onChangeText={fun6}></TextInput>
            
            <Text style={styles.text}>Hours:</Text>

            <Text style={{color:"black"}}>Monday</Text>
            <View style={styles.hoursView}>
                <TextInput placeholderTextColor={'#747474ff'} placeholder='8:00am' style={styles.hours}></TextInput>
                <TextInput placeholderTextColor={'#747474ff'} placeholder='9:30pm' style={styles.hours}></TextInput>
            </View>

            <Text style={{color:"black"}}>Tuesday</Text>
            <View style={styles.hoursView}>
                <TextInput placeholderTextColor={'#747474ff'} placeholder='8:00am' style={styles.hours}></TextInput>
                <TextInput placeholderTextColor={'#747474ff'} placeholder='9:30pm' style={styles.hours}></TextInput>
            </View>
             
            <Text style={{color:"black"}}>Wednesday</Text>
            <View style={styles.hoursView}>
                <TextInput placeholderTextColor={'#747474ff'} placeholder='8:00am' style={styles.hours}></TextInput>
                <TextInput placeholderTextColor={'#747474ff'} placeholder='9:30pm' style={styles.hours}></TextInput>
            </View>
             
            <Text style={{color:"black"}}>Thursday</Text>
            <View style={styles.hoursView}>
                <TextInput placeholderTextColor={'#747474ff'} placeholder='8:00am' style={styles.hours}></TextInput>
                <TextInput placeholderTextColor={'#747474ff'} placeholder='9:30pm' style={styles.hours}></TextInput>
            </View>
             
            <Text style={{color:"black"}}>Friday</Text>
            <View style={styles.hoursView}>
                <TextInput placeholderTextColor={'#747474ff'} placeholder='8:00am' style={styles.hours}></TextInput>
                <TextInput placeholderTextColor={'#747474ff'} placeholder='9:30pm' style={styles.hours}></TextInput>
            </View>
             
            <Text style={{color:"black"}}>Saturday</Text>
            <View style={styles.hoursView}>
                <TextInput placeholderTextColor={'#747474ff'} placeholder='8:00am' style={styles.hours}></TextInput>
                <TextInput placeholderTextColor={'#747474ff'} placeholder='9:30pm' style={styles.hours}></TextInput>
            </View>
             
            <Text style={{color:"black"}}>Sunday</Text>
            <View  style={[styles.hoursView, {marginBottom:25}]}>
                <TextInput placeholderTextColor={'#747474ff'} placeholder='8:00am' style={styles.hours}></TextInput>
                <TextInput placeholderTextColor={'#747474ff'} placeholder='9:30pm' style={styles.hours}></TextInput>
            </View>
        </ScrollView>

        <TouchableOpacity onPress={submitForm}><Text style={styles.text}>Submit Form</Text></TouchableOpacity>

        <Text>a thing probably: {responseMessage}</Text>
         
     </SafeAreaView>
        </>);
}

const styles = StyleSheet.create({
  container: 
  { 
    
    alignSelf:'center',
    width:'75%'
  },
  form: 
  {
    borderColor:'black',
    borderWidth:'2px'
  },
  text: 
  {
    borderStyle:'solid',
    backgroundColor:'lightblue',
    textAlign:'center',
    padding:'6px',
    borderTopWidth:'2px',
    borderBottomWidth:'2px',
  },  
  input: 
  {
    textAlign:'center',
    padding:'6px',
  },
  hours: {},
  hoursView: {}

});
 

export default AddCoffeeShop;