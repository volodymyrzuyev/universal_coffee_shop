import React, {userState, useEffect} from 'react'
import {Text} from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';
  

export default function page()
{
    const {id} = useLocalSearchParams();  
    return(
       <><Text>Currently on {id} page</Text></>
     )
}