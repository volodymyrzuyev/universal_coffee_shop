 import { StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';

import {Text} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
 
export default function pageNotFunction()
{
    return (
            <SafeAreaView style={styles.notFoundDiv}>
                <Text style={styles.notFoundText}>Sorry the page you were looking for could not be found</Text>
                <Redirect href="/launch" />;
            </SafeAreaView>
     )
}



const styles = StyleSheet.create({
  notFoundText: {
    fontSize:'20px'
  },
  notFoundDiv:{
    TextAlign:'center',

  }
});
 