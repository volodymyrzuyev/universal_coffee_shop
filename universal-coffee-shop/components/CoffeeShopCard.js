// universal-coffee-shop/components/CoffeeShopCard.js
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


//global background color

const BACKGROUND_COLOR = 'red';

/*Something I was messing around with which changes the background color 
everytime the component rerenders, but it only works if we change code 
and now when the user goes back to the page. But still its cool so its 
here. Change it if you want though*/
function getRandomColor()
{
  let letters = '0123456789ABCDEF';
  let color = '#'

  for(let i = 0; i < 6; i++)
  {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
 

export default function CoffeeShopCard({ shop }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const router = useRouter();

  const shopId = shop.id
   
  async function handleRedirect()
  {
    router.navigate({
      pathname:'/CoffeeShopPage/[shop_id]/page',
      params: {shop_id: shopId}
    })
   }

  return (
    <TouchableOpacity style={styles.card}  onPress={handleRedirect}>
      <View className="logo" style={styles.logo} />

      <Text style={styles.shopName}>{shop.name}</Text>

      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => setIsFavorited(!isFavorited)}
      >
        <Feather
          name="heart"
          size={24}
          color={isFavorited ? '#FFFFFF' : '#000000'}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor:getRandomColor(),
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#000',
  },
  shopName: {
    flex: 1,
    fontSize: 20,
    color: '#000',
    fontFamily: 'Anton-Regular',
    textTransform: 'uppercase',
  },
  favoriteButton: {
    padding: 5,
  },
});