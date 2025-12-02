import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView } from "react-native";
import { SelectList } from 'react-native-dropdown-select-list';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from "expo-router";
import Constants from 'expo-constants';
import * as SecureStore from "expo-secure-store";

const config = Constants.expoConfig;
const API_BASE = config.backendUrl;

export default function review() {
  const router = useRouter();
  const { shop_id_review, shopName } = useLocalSearchParams();

  const [reviewContent, updateReviewContent] = useState("");
  const [selectedNum, setSelectedNum] = useState(0);

  const listData = [
    { key: 1, value: "1 Star" },
    { key: 2, value: "2 Stars" },
    { key: 3, value: "3 Stars" },
    { key: 4, value: "4 Stars" },
    { key: 5, value: "5 Stars" }
  ];

  const form_content = {
    'text': reviewContent,
    'num_stars': selectedNum
  };

  async function submitForm() {
    try {
      if (reviewContent != "" && selectedNum != 0) {
        const url = `${API_BASE}/home/shop/reviews/${shop_id_review}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await SecureStore.getItemAsync("user_id")}`,
          },
          body: JSON.stringify(form_content)
        });

        const data = await response.json();

        if (!response.ok) {
          Alert.alert("Couldn't submit the review, try again");
        } 
        else if (data.successful == false) {
          Alert.alert("You may only submit one review per shop");
        } 
        else {
          Alert.alert("Success! Review submitted");
        }
      } 
      else {
        Alert.alert("All sections of the form must be filled");
        return;
      }

    } catch (err) {
      console.log('FETCH ERROR:', err);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.container}>

        <Text style={styles.header}>Review {shopName}</Text>

        <View style={styles.formSection}>
          <Text style={styles.label}>Write your review</Text>

          <TextInput
            style={styles.input}
            multiline
            numberOfLines={4}
            onChangeText={updateReviewContent}
            placeholder="Type your experience..."
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Rate the shop</Text>

          <View style={styles.selectWrapper}>
            <SelectList 
              boxStyles={{ borderWidth: 0, backgroundColor: "transparent" }} 
              dropdownStyles={{ borderWidth: 1, borderRadius: 6 }}
              placeholder='Select stars'
              data={listData} 
              setSelected={setSelectedNum} 
            />
          </View>
        </View>

        <TouchableOpacity onPress={submitForm} style={styles.submitButton}>
          <Text style={styles.submitText}>Submit Review</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/home")}>
          <Text style={styles.backText}>BACK</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
  },

  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },

  header: {
    fontSize: 32,
    fontFamily: "Anton-Regular",
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
  },

  formSection: {
    width: "100%",
    marginBottom: 25,
  },

  label: {
    fontSize: 20,
    fontFamily: "Anton-Regular",
    marginBottom: 10,
    color: "#000",
  },

  input: {
    width: "100%",
    borderWidth: 3,
    borderColor: "#000",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },

  selectWrapper: {
    width: "60%",
    borderWidth: 3,
    borderColor: "#000",
    borderRadius: 10,
    padding: 10,
    alignSelf: "center",
  },

  submitButton: {
    width: "90%",
    borderWidth: 4,
    borderColor: "#000",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 10,
    marginBottom: 10,
  },

  submitText: {
    textAlign: "center",
    fontSize: 22,
    fontFamily: "Anton-Regular",
    color: "#000",
  },

  backText: {
    fontSize: 18,
    fontFamily: "Anton-Regular",
    marginTop: 15,
    color: "#000",
  },
});
