import React, {useState} from 'react';
import {
  Image,
  Platform,
  Alert,
  ScrollView,
  ActivityIndicator,
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

function PhotoScreen() {
const [resultSt, setResult] = useState(null);
const [userIdState, setUserId] = useState(null);
const [loadingState, setLoading] = useState(false);
updateId(userIdState,setUserId);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps='handled'>

        { userIdState != 0 ?
          <View style={styles.helpContainer}>
          <View style={styles.saveButton}>
            <Button title="Select an image" onPress={ () => takeAndUploadPhotoAsync(setResult)}>Select an image</Button> 
          </View>
            <Image
                source={{ uri: resultSt !== null ? resultSt.uri : "../assets/images/bg.jpg"}}
                style={{width:200, height: 200, marginTop:20, marginBottom: 20, borderColor:'black', borderRadius:2}}
                blurRadius={0.4} />

            <View style={styles.saveButton}>
            <Button title="Send" onPress={ () => sendPhotoToServer(resultSt, setLoading)}>Send</Button> 
            {loadingState ? <ActivityIndicator size="large" color="#0000ff" />: null }
            {loadingState ? <Text>Please wait and do not close the application.</Text> : null }
          </View>
          </View>
          : <Welcome /> }
          

      </ScrollView>

      <View style={styles.tabBarInfoContainer}>
        <Text style={styles.tabBarInfoText}>
          Please press the "Select an image" button and pick an image from your device's image library.
        </Text>
      </View>
    </View>
  );
  
}
PhotoScreen.navigationOptions = {
  title: 'Upload a Photo',
};
async function updateId(userIdState, setUserId) {
  let userId = await AsyncStorage.getItem('userId');
  userId = userId != null ? userId : 0;
  if(userIdState != userId) {
     setUserId(userId);
  }
}
async function sendPhotoToServer(result, setLoading) {
  setLoading(true);
  let userId = await AsyncStorage.getItem('userId');
  userId = userId != null ? userId : 0;
  let localUri = result.uri;  
  let filename = localUri.split('/').pop();
  let match = /\.(\w+)$/.exec(filename);
  let type = match ? `image/${match[1]}` : `image`;  
  let formData = new FormData();
  formData.append('fileToUpload', { uri: localUri, name: filename, type });
  formData.append('userId',userId);
  let fetchResult = await fetch("http://www.atalaykutlay.com/ispApp/upload.php", {
    method: 'POST',
    body: formData,
    header: {
      'content-type': 'multipart/form-data',
    },
  });
  setLoading(false);
  Alert.alert(
    'Success!',
    'Your photo has been sent successfully.',
    [
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ],
    {cancelable: true},
  );
}
async function takeAndUploadPhotoAsync(setResult) {
  // Display the camera to the user and wait for them to take a photo or to cancel
  // the actionImagePicker.launchImageLibraryAsync(options)
  let result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: false,
  });
  
  if (result.cancelled) {
    return;
  }
  setResult(result);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    marginTop: 10
  },
  saveButton: {
    marginLeft:15,
    marginRight:15
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

export default withNavigationFocus(PhotoScreen);
