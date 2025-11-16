import React from 'react'
import {Text, StyleSheet,TextInput, TouchableOpacity} from 'react-native'
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
 
export default function createAdminAccount()
{
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [responseFromServer, setResponseFromServer] = React.useState("")

    function fun1(e){ setUsername(e);}

function fun2(e){  setEmail(e);}

function fun3(e){ setPassword(e);}

    const adminInfo = {
     'username': username, 
    'email': email, 
    'password': password,
    };

    async function createAdminAccount()
     { 

      console.log("Button Pressed")
      try 
      {
       const response = await fetch("http://localhost:8000/createAdmin/", {method:"POST", body: JSON.stringify(adminInfo)});
       const result = await response.json();
       
       setResponseFromServer(`${result.type}`);
      }
       catch(error)
      {
       console.log(error);
       setResponseFromServer(`${error}`);
      }
     }


    return(<><SafeAreaProvider>
               <SafeAreaView>
                 <Text>Enter your username</Text>
                 <TextInput style={styles.input} onChangeText={fun1} placeholder='Username'></TextInput>
                  
                 <Text>Enter your email</Text>
                 <TextInput style={styles.input} onChangeText={fun2} placeholder='Email'></TextInput>

                 <Text>Enter your password</Text>
                 <TextInput style={styles.input} onChangeText={fun3} placeholder='Password'></TextInput>
                 
                 <TouchableOpacity onPress={createAdminAccount} >Press Me</TouchableOpacity>
                  <Text>Response from server: {responseFromServer}</Text>
                 
               </SafeAreaView>
            </SafeAreaProvider></>)
}

const styles = StyleSheet.create(
    {
      input: 
      {
        height: 40,
        margin: 12, 
        borderWidth: 1,

      }  
    });

