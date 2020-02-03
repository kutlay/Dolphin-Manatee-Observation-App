import * as WebBrowser from 'expo-web-browser';
import React, {useState} from 'react';
import {
  Image,
  Alert,
  Platform,
  ImageBackground,
  ActivityIndicator,
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
import { withNavigationFocus } from 'react-navigation';
import Welcome from '../components/Welcome';

function HomeScreen() {
  const [mCount, setmCount] = useState(0);
  const [dCount, setdCount] = useState(0);
  const [loadingState, setLoading] = useState(false);
  const [userIdState, setUserId] = useState(null);
  
  updateId(userIdState,setUserId);
  
  
  return (
    <View style={styles.container}>     
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps='handled'>
        { userIdState != 0 ?
        <View style={styles.endis}>
          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>Number of manatees</Text>
            <TextInput  
            placeholder="Enter the number of manatees"  
            underlineColorAndroid='transparent'  
            style={styles.TextInputStyle}
            onChangeText={(text) => setmCount(text)}
            keyboardType={'numeric'}
            />  
          </View>
          <View style={styles.getStartedContainer} >
            <Text style={styles.getStartedText}>Number of dolphins</Text>
            <TextInput  
            placeholder="Enter the number of dolphins"  
            underlineColorAndroid='transparent'  
            style={styles.TextInputStyle}
            onChangeText={(text) => setdCount(text)}
            keyboardType={'numeric'}
            />  
          </View>

          <View style={styles.helpContainer}>

            <View style={styles.saveButton}>
            <Button title="Send Report" onPress={ () => handleSend(mCount, dCount, setLoading)}>Send Report</Button> 
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
          Please type the number of manatees and dolphins noticed. Then, press the "Send report" button.
        </Text>
      </View>
    </View>
  );
  
}

HomeScreen.navigationOptions = {
  title: "Dolphin/Manatee Counts"
};

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/development-mode/'
  );
}
async function updateId(userIdState, setUserId) {
  let userId = await AsyncStorage.getItem('userId');
  userId = userId != null ? userId : 0;
  if(userIdState != userId) {
     setUserId(userId);
  }
}
async function handleSend(mCount,dCount,setLoading) {
  setLoading(true);
  let formData = new FormData();
  let userId = await AsyncStorage.getItem('userId');
  userId = userId != null ? userId : 0;
  formData.append('mNumber',mCount);
  formData.append('dNumber', dCount);
  formData.append('user', userId);
  try {
    let response = await fetch('https://www.atalaykutlay.com/ispApp/index.php', {
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
    marginTop:10
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  TextInputStyle: {
    fontSize:18,
    paddingTop:10,
    textAlign:'center'
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
    marginTop:20
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


export default withNavigationFocus(HomeScreen);