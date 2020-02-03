import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

class Welcome extends Component {
    render() {
        return (
            <View style={styles.welcome}>
                <View style={styles.topTitle}>
                    <Ionicons name={Platform.OS === 'ios' ? 'ios-warning' : 'md-warning'} size={40} />
                    <Text style={styles.topText}>Welcome!</Text>
                </View>
                <View>
                    <Text style={styles.bottomText}>Before you continue, you need to sign in with your user ID. To do that, please go to the 'Settings' tab and type your user ID.</Text>
                </View>
            
            </View>
        );
    }

    
  
}
const styles = StyleSheet.create({
    welcome: {
      flex: 1,
      width: '80%',
      padding: 10,
      borderRadius: 25,
      alignSelf: 'center',
      backgroundColor: '#ffe287',
      alignItems: 'center'
    },
    topTitle : {
        flex: 1,
        flexDirection: 'row'
    },
    topText: {
        fontSize : 32,
        marginTop:2,
        marginLeft: 10
    },
    bottomText: {
        textAlign: 'center',
        fontSize: 17
    }
});
export default Welcome;