import React, {Component, useState,useEffect} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import PINCode, { hasUserSetPinCode } from '@haskkor/react-native-pincode';



const borrarKeys = ()=>{
  ReactNativeBiometrics.deleteKeys()
  .then((success) => {
    if (success) {
      console.log('Successful deletion')
      //alert('Successful deletion')
    } else {
      console.log('Unsuccessful deletion')
      //alert('Unsuccessful deletion')
    }
  })
}







function App() {
  const[biometricType,setBiometricType] = useState('');
  const [keyPublic, setKeyPublic]=useState('');
  const [validToken, setValidToken]=useState('');
  const[showPinLock, setShowPinLock]=useState(false);
  const[PINCodeStatus, setPINCodeStatus]=useState('choose');
  const [errorHuella, setErrorHuella]=useState(0);

  const Touch=()=>{
    return <View style={styles.view}>
    <Text style={styles.text}> TOUCH ID</Text>
    <Button 
    onPress={keysExist} 
    title="Log in"></Button>
  </View>
  }
  
  const Face=()=>{
  return (<View style={styles.view}>
  <Text style={styles.text}> FACE ID</Text>
  <Button 
  onPress={keysExist} 
  title="Log in"></Button>
  </View>)
  }
  
  const Biom=()=>{
  
  return (<View style={styles.view}>
  <Text style={styles.text}> BIOMETRICX</Text>
  <Button 
  onPress={keysExist} 
  title="Log in"></Button>
  </View>)
  }
  
  const Biom2=()=>{
  
    return (<View style={styles.view}>
    <Text style={styles.text}> BIOM 2</Text>
    <Button 
    onPress={_showEnterPinLock} 
    title="Log in"></Button>
    </View>)
    }
  
  const User=()=>{
  return (<View style={styles.view}>
  <Text style={styles.text}> USER PASS</Text>
  <Button 
  onPress={keysExist} 
  title="Log in"></Button>
  </View>)
  }

  const _showChoosePinLock = () => { 
    setPINCodeStatus('choose');
    setShowPinLock(true);
  }; 

    const PinScreen=()=>{
      return (
        <PINCode 
        status={PINCodeStatus} 
        //colorCircleButtons={'rgb(255,202,40)'}
        touchIDDisabled={true} 
        finishProcess={_finishProcess} 
        textDescriptionLockedPage={'Ha alcanzado el número máximo de intentos'}
        textTitleLockedPage={'PIN Incorrecto'}
        textSubDescriptionLockedPage={' '}
        styleLockScreenMainContainer={{backgroundColor:'rgba(114, 160, 199, 0.9);'}}
        stylePinCodeDeleteButtonIcon={'backspace'}
        iconButtonDeleteDisabled={true}
        buttonDeleteText={'BORRAR'}
        titleEnter={'Ingrese su PIN'}
        titleChoose={'Introduzca un PIN de seguridad'}
        subtitleChoose={'para proteger sus transacciones'}
        />)}

    const Logged=()=>{
      return (
        <View style={styles.view}>
          <Text style={styles.text}> USER LOGGED</Text>
          <Button 
          onPress={_showEnterPinLock} 
          title="Log in"></Button>
      </View>
      )}

  const  _finishProcess = async () => {
    const hasPin = await hasUserSetPinCode();
    if (hasPin && PINCodeStatus==='enter') {
      alert("You have successfully entered your pin.", [
        {
          title: "Ok",
          onPress: () => {
            // do nothing
          },
        },
      ]);
      setBiometricType('Logged');
      setShowPinLock(false);
    } else if (hasPin && PINCodeStatus==='chose') {
      alert("You have successfully set your pin.", [
        {
          title: "Ok",
          onPress: () => {
            // do nothing
          },
        },
      ]);
      setBiometricType('Biom2');
      setShowPinLock(false);
    }else{
      setPINCodeStatus("locked");
    }
  };

  const _showEnterPinLock = async () => {
    const hasPin = await hasUserSetPinCode();
    if (hasPin) {
      setPINCodeStatus('enter');
      setShowPinLock(true);
    } else {
      alert( "You have not set your pin.", [
        {
          title: "Ok",
          onPress: () => {
            // do nothing
          },
        },
      ]);
      _showChoosePinLock();
    }
  };


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
        //alert('Keys exist')
        createSignature();
  
      } else {
        console.log('Keys do not exist or were deleted')
        //alert('Keys do not exist or were deleted')
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
    //createSignature();
    alert("El equipo cuenta con una huella registrada", [
      {
        title: "Ok",
        onPress: () => {
          // do nothing
        },
      },
    ]);
  })
  .catch((err)=>{
    alert("Activa tus datos biométricos en tu celular. Ingresá a configuración o ajustes de tu dispositivo y activa tus opciones de seguridad", [
      {
        title: "Ok",
        onPress: () => {
          // do nothing
        },
      },
    ]);
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
        }
      })
      .catch((err)=>{
        _showEnterPinLock();
      }) 
  }
   

    useEffect(() => {
      borrarKeys();
      sensorExists();
      /* if(biometricType!='None'){
        keysExist()
      }else{
      } */
    }, [])

    return(<>
    {biometricType==='TouchID' && showPinLock===false && <Touch/>}
    {biometricType==='FaceID' && showPinLock===false  && <Face/>}
    {biometricType==='Biometric' && showPinLock===false && <Biom/>}
    {biometricType==='None' && showPinLock===false  && <User/>}
    {biometricType==='Logged' && showPinLock===false  && <Logged/>}
    {biometricType==='Biom2' && showPinLock===false  && <Biom2/>}
    {showPinLock===true && <PinScreen/>}
      </>
    )

  /*const Inicio=resultObject.available && resultObject.biometryType === ReactNativeBiometrics.TouchID ? Touchid :
  resultObject.available && resultObject.biometryType === ReactNativeBiometrics.FaceID ? Faceid:
  resultObject.available && resultObject.biometryType === ReactNativeBiometrics.Biometrics? Bioid: UserPass;*/
}

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