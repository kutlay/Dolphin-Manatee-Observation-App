import React, {useState} from 'react';
import {
  Alert,
  Image,
  ActivityIndicator,
  Platform,
  Keyboard,
  ScrollView,
  StyleSheet,
  StatusBar,
  Button,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  AsyncStorage
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { withNavigationFocus } from 'react-navigation';
import Welcome from '../components/Welcome';

function RedTideScreen() {
    const [textState, setText] = useState("");
    const [userIdState, setUserId] = useState(null);
    const [loadingState, setLoading] = useState(false);
    updateId(userIdState,setUserId);

return (
    <View style={styles.container}>     
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps='handled'>
        { userIdState != 0 ?
        <View style={styles.endis}>
          <View style={styles.getStartedContainer}>
            
            <Text style={styles.getStartedText}>Red Tide Observations</Text>

            <TextInput multiline
            placeholder="Please type your observations here."  
            underlineColorAndroid='transparent'  
            style={styles.TextInputStyle}
            onChangeText={(text) => setText(text)}
            />  

          </View>

          <View style={styles.helpContainer}>

            <View style={styles.saveButton}>
            <Button title="Send Report" onPress={ () => handleSend(textState, setLoading)}>Send Report</Button>
            {loadingState ? <ActivityIndicator size="large" color="#0000ff" /> : null} 
          </View>
          </View>
        </View>
        : 
          <Welcome />
        }
      </ScrollView>
      

      <View style={styles.tabBarInfoContainer}>
        <Text style={styles.tabBarInfoText}>
          Please type your red tide observations and click "Send Report".
        </Text>
      </View>
    </View>
  );
  
}
RedTideScreen.navigationOptions = {
  title: 'Red Tide Observations',
};
async function updateId(userIdState, setUserId) {
  let userId = await AsyncStorage.getItem('userId');
  userId = userId != null ? userId : 0;
  if(userIdState != userId) {
     setUserId(userId);
  }
}
async function handleSend(textState, setLoading) {
  setLoading(true);
  let formData = new FormData();
  let userId = await AsyncStorage.getItem('userId');
  userId = userId != null ? userId : 0;
  formData.append('text',textState);
  formData.append('user', userId);
  try {
    let response = await fetch('https://www.atalaykutlay.com/ispApp/redTide.php', {
        method: 'POST',
        body: formData
      }
    );
    setLoading(false);
    Alert.alert(
        'Success!',
        'Your report has been sent successfully.',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: true},
      );
      Keyboard.dismiss();
    //console.error(response);
  } catch (error) {
    //console.error(error);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  endis: {
    marginTop: 10
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  TextInputStyle: {
    fontSize:22,
    height:150,
    paddingTop:10,
    textAlign:'center',
    flex:1
  },
  contentContainer: {
    paddingTop: 10,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
    marginBottom:50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 25,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
    margin:5
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});

export default withNavigationFocus(RedTideScreen);
