import React, {useState} from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Button,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  AsyncStorage
} from 'react-native';


export default function SettingsScreen() {
  const [permuserIdState, setpermUserId] = useState(null);
  const [userIdState, setUserId] = useState(0);
  const [loadingState, setLoading] = useState(false);
  const [informationState, setInformation] = useState(false);

  updateId(userIdState, setUserId, setpermUserId, setLoading, setInformation);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps='handled'>         

          <View style={styles.inputContainer2}>
            <Text style={styles.userIdTextStyle}>Your User Id:</Text>
            { userIdState == 0 ?
            <TextInput  
            placeholder= "Enter your ID"
            underlineColorAndroid='transparent'  
            multiline={false}
            style={styles.userIdInputStyle}
            onChangeText={(text) => setpermUserId(text)}
            keyboardType={'numeric'}
            />  
            : 
            <TextInput  
            placeholder = {"" + userIdState}
            underlineColorAndroid='transparent'  
            multiline={false}
            style={styles.userIdInputStyle}
            onChangeText={(text) => setpermUserId(text)}
            keyboardType={'numeric'}
            /> 
            }          
          </View>
          <View style={styles.saveButton}>
            <Button title="Save" onPress={()=>saveButton(permuserIdState, setUserId, setLoading, setInformation)}>Save</Button> 
          </View>
          {loadingState ? <ActivityIndicator size="large" color="#0000ff" /> : null}
          {informationState != false ?
          <View
            style={{
              marginTop:50,
              marginLeft:30,
              marginRight:30,
              borderBottomColor: 'gray',
              borderBottomWidth: 1,
            }}
          /> : null }
          { informationState != false ?
          <View style={styles.userInfoBox}>
            <Text style={{fontSize : 25, textAlign: 'center', marginBottom:25}}>Your Personal Information</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.catText}>Name:</Text>
              <Text style={styles.infoText}>{informationState.name}</Text> 
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.catText}>Email:</Text>
              <Text style={styles.infoText}>{informationState.email}</Text> 
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.catText}>Phone Number:</Text>
              <Text style={styles.infoText}>{informationState.phone}</Text> 
            </View>
          </View>
          : null }

          
          
          

      </ScrollView>

      <View style={styles.tabBarInfoContainer}>
        <Text style={styles.tabBarInfoText}>
          Please type your user ID and press "Enter". Check the information below and make sure your information is correct.
        </Text>
      </View>
    </View>
  );
}
async function saveButton(userId, setUserId, setLoading, setInformation){
  try {
    setLoading(true);
    await AsyncStorage.setItem('userId', userId);
    let formData = new FormData();
    formData.append('userId',userId);
    let response = await fetch('https://www.atalaykutlay.com/ispApp/getUserInfo.php', {
        method: 'POST',
        body: formData
      }
    );
    let responseJson = await response.json();
    setUserId(userId);
    setInformation(responseJson);
    setLoading(false);
  } catch (error) {
    console.error(error);
  }
}
async function updateInfo(userId, setLoading, setInformation){
  setLoading(true);
  await AsyncStorage.setItem('userId', userId);
  let formData = new FormData();
  formData.append('userId',userId);
  let response = await fetch('https://www.atalaykutlay.com/ispApp/getUserInfo.php', {
      method: 'POST',
      body: formData
    }
  );
  let responseJson = await response.json();
  setInformation(responseJson);
  setLoading(false);
}
async function resetEverything() {
  let userId = await AsyncStorage.clear();
}
async function updateId(userIdState, setUserId, setpermUserId, setLoading, setInformation) {
  let userId = await AsyncStorage.getItem('userId');
  userId = userId != null ? userId : 0;
  if(userIdState != userId) {
     setUserId(userId);
     setpermUserId(userId);
     updateInfo(userId, setLoading, setInformation);     
  }
}

SettingsScreen.navigationOptions = {
  title: 'Settings',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  endis: {
    marginTop:60
  },
  inputContainer : {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom:3
  },
  inputContainer2 : {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'center',
    marginBottom:3
  },
  userIdTextStyle: {
    marginLeft: 15,
    marginRight:10,
    ...Platform.select({
      ios: {
        marginTop:0,
      },
      android: {
        marginTop:5,
      },
    }),    
    color: 'rgba(0,0,0,0.4)',
    fontSize: 20,
    lineHeight: 22
  },
  infoText: {
    fontSize:18,
    color: 'rgba(0,0,0,0.6)'
  },
  userInfoBox: {
    margin:35,
    fontSize:22,
    color: 'rgba(0,0,0,0.8)',
  },
  catText: {
    marginRight:5,
    fontSize:18,
    color: 'rgba(0,0,0,1)'
  },
  saveButton: {
    marginLeft:15,
    marginRight:15,
    marginTop:20
  },
  userIdInputStyle: {
    color: 'rgba(0,0,0,0.4)',
    fontSize: 20,
    lineHeight: 22,
  },
  contentContainer: {
    paddingTop: 30,
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
