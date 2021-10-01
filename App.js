import React, {Component, useState,useEffect} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics'
const jsonWebToken=require('jsonwebtoken');
const myJWTSecretKey= 'adafrtw445!def_?gdf';



 

const borrarKeys = ()=>{
  ReactNativeBiometrics.deleteKeys()
  .then((success) => {
    if (success) {
      console.log('Successful deletion')
      alert('Successful deletion')
    } else {
      console.log('Unsuccessful deletion')
      alert('Unsuccessful deletion')
    }
  })
}


const Touch=()=>{
  return <View style={styles.view}>
  <Text style={styles.text}> TOUCH ID</Text>
  <Button 
  onPress={borrarKeys} 
  title="Log in"></Button>
</View>
}

const Face=()=>{
return (<View style={styles.view}>
<Text style={styles.text}> FACE ID</Text>
<Button 
onPress={borrarKeys} 
title="Log in"></Button>
</View>)
}

const Biom=()=>{

return (<View style={styles.view}>
<Text style={styles.text}> BIOMETRICX</Text>
<Button 
onPress={borrarKeys} 
title="Log in"></Button>
</View>)
}

const User=()=>{
return (<View style={styles.view}>
<Text style={styles.text}> USER PASS</Text>
<Button 
onPress={borrarKeys} 
title="Log in"></Button>
</View>)
}

const Logged=()=>{
  return (<View style={styles.view}>
  <Text style={styles.text}> LOGged</Text>
  <Button 
  onPress={borrarKeys} 
  title="Log in"></Button>
  </View>)
  }



function App() {
  const[biometricType,setBiometricType] = useState('');
  const [keyPublic, setKeyPublic]=useState('');
  const [validToken, setValidToken]=useState('');


  const sensorExists=()=>{
    ReactNativeBiometrics.isSensorAvailable()
      .then((resultObject) => {
        const { available, biometryType } = resultObject;
        console.log(resultObject);
        if (available && biometryType === ReactNativeBiometrics.TouchID) {
          console.log('TouchID is supported')
          setBiometricType('TouchID');
        } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
          console.log('FaceID is supported')
          setBiometricType('FaceID');
        } else if (available && biometryType === ReactNativeBiometrics.Biometrics) {
          console.log('Biometrics is supported')
          setBiometricType('Biometric');
        } else {
          console.log('Biometrics not supported')
          setBiometricType('None');
        }
      }) 
  }

  const keysExist=()=>{
    ReactNativeBiometrics.biometricKeysExist()
    .then((resultObject) => {
      const { keysExist } = resultObject
   
      if (keysExist) {
        console.log('Keys exist')
        alert('Keys exist')
        createSignature();
  
      } else {
        console.log('Keys do not exist or were deleted')
        alert('Keys do not exist or were deleted')
        createKeys();
      }
    })
  }
  const createKeys=()=>{
    ReactNativeBiometrics.createKeys('Confirm fingerprint')
  .then((resultObject) => {
    const { publicKey } = resultObject
    console.log(publicKey,'publicKey')
    setKeyPublic(publicKey);
    createSignature();
    //const token=jsonWebToken.sign(publicKey,myJWTSecretKey);
    //console.log(token,'token');
    //setValidToken(token); 
  })
}

  const createSignature=()=>{
    let epochTimeSeconds = Math.round((new Date()).getTime() / 1000).toString()
    let payload = 'some message'
    
    ReactNativeBiometrics.createSignature({
        promptMessage: 'Sign',
        payload: payload
      })
      .then((resultObject) => {
        const { success, signature } = resultObject
    
        if (success) {
          console.log(success,signature)
          setBiometricType('Logged');
          //const tokenDecodedData=jsonWebToken.verify(validToken,myJWTSecretKey);
          //console.log(tokenDecodedData);
          //if(tokenDecodedData.MAIL==MAIL){
  
          //verifySignatureWithServer(signature, payload) 
        }
      })
  }
   

    useEffect(() => {
      borrarKeys();
      sensorExists();
      if(biometricType!='None'){
        keysExist()
      }else{
      }
    }, [])

    return(<>
    {biometricType==='TouchID' && <Touch/>}
    {biometricType==='FaceID' && <Face/>}
    {biometricType==='Biometric' && <Biom/>}
    {biometricType==='None' && <User/>}
    {biometricType==='Logged' && <Logged/>}

  
      </>
    )


  /*const Inicio=resultObject.available && resultObject.biometryType === ReactNativeBiometrics.TouchID ? Touchid :
  resultObject.available && resultObject.biometryType === ReactNativeBiometrics.FaceID ? Faceid:
  resultObject.available && resultObject.biometryType === ReactNativeBiometrics.Biometrics? Bioid: UserPass;*/

  
    
}



/*function App() {

  /*ReactNativeBiometrics.deleteKeys()
  .then((success) => {
    if (success) {
      console.log('Successful deletion')
      alert('Successful deletion')
    } else {
      console.log('Unsuccessful deletion')
      alert('Unsuccessful deletion')
    }
  })

  ReactNativeBiometrics.isSensorAvailable()
  .then((resultObject) => {
    const { available, biometryType,error } = resultObject
    console.log(resultObject);
    if (available && biometryType === ReactNativeBiometrics.TouchID) {
      console.log('TouchID is supported')
      //alert('TouchID is supported')
    } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
      console.log('FaceID is supported')
      //alert('FaceID is supported')
    } else if (available && biometryType === ReactNativeBiometrics.Biometrics) {
      console.log('Biometrics is supported')
     // alert('Biometrics is supported')
    } else {
      console.log('Biometrics not supported')
      //alert('Biometrics not supported')
    }
  })

  const Touchid=()=>{
    return <div>
        Hello World TOUCH ID
    </div>
  }

  const Faceid=()=>{
    return <div>
        Hello World FACE ID
    </div>
  }

  const Bioid=()=>{
    return <div>
        Hello World BIOMETRICS
    </div>
  }

  const UserPass=()=>{
    return <div>
        USER/PASS
    </div>
  }

  const Inicio=available && biometryType === ReactNativeBiometrics.TouchID ? Touchid :
               available && biometryType === ReactNativeBiometrics.FaceID ? Faceid:
               available && biometryType === ReactNativeBiometrics.Biometrics? Bioid: UserPass;
  
  return (
    <>
      <View style={styles.view}>
        <Text style={styles.text}> Hello WorldD</Text>
        <Button 
        onPress={borrarKeys} 
        title="Log in"></Button>
      </View>
    </>
  )
}*/

 const styles = StyleSheet.create({
  view:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange'
  } , 
  text:{
      fontSize: 48,
      fontWeight: 'bold',
      color: 'white'
    },
  button:{
    padding: 10,
    borderRadius:1,
    backgroundColor:'yellow',
  }
 });
 export default App;