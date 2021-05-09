
import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import MyHeader from '../Component/MyHeader';
import db from '../config';
import firebase from 'firebase';
import { TouchableOpacity } from 'react-native';

export default class SettingScreen extends React.Component{
    constructor(){
        super();
        this.state={
            firstName:'',
            lastName:'',
            email:'',
            address:'',
            contact:'',
            docId:''
        }
    }
    componentDidMount(){
        this.getUserDetails();
    }
    getUserDetails=()=>{
        var email = firebase.auth().currentUser.email
        db.collection("users").where('email_id',"==",email).get().then((snapshot)=>{snapshot.forEach(doc=>{
            var data = doc.data()
            this.setState({
                email:data.email_id,
                firstName:data.first_name,
                lastName:data.last_name,
                contact:data.contact,
                address:data.address,
                docId:doc.id
            })
          })})

    }
    updateUserDetails=()=>{
        db.collection("users").doc(this.state.docId).update({
            "first_Name":this.state.firstName,
            "last_Name":this.state.lastName,
            "address":this.state.address,
            "contact":this.state.contact
        })
        alert("user updated successfully");
    }
    render(){
        return(
            <View style={styles.container}>
                <MyHeader navigation={this.props.navigation} title="Settings"/>
                <View style={styles.formContainer}>
           
                <TextInput value={this.state.firstName} style={styles.formTextInput} maxLength={8} placeholder={"First name"} onChangeText={(text)=>{this.setState({
                    firstName:text
                })}}></TextInput>
                <TextInput value={this.state.lastName} style={styles.formTextInput}  maxLength={8} placeholder={"Last name"} onChangeText={(text)=>{this.setState({
                    lastName:text
                })}}></TextInput>
                <TextInput value={this.state.contact} style={styles.formTextInput} keyboardType={'numeric'}  maxLength={10} placeholder={"Contact"} onChangeText={(text)=>{this.setState({
                    contact:text
                })}}></TextInput>
                <TextInput value={this.state.address} style={styles.formTextInput}  multiline={true} placeholder={"Address"} onChangeText={(text)=>{this.setState({
                    address:text
                })}}></TextInput>
                <TouchableOpacity style={styles.button} onPress={()=>{this.updateUserDetails()}}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
     container : 
     { flex:1,
         alignItems: 'center',
          justifyContent: 'center' }, formContainer:{ flex:1, width:'100%', alignItems: 'center' }, formTextInput:{ width:"75%", height:35, alignSelf:'center', borderColor:'#ffab91', borderRadius:10, borderWidth:1, marginTop:20, padding:10, }, button:{ width:"75%", height:50, justifyContent:'center', alignItems:'center', borderRadius:10, backgroundColor:"#ff5722", shadowColor: "#000", shadowOffset: { width: 0, height: 8, }, shadowOpacity: 0.44, shadowRadius: 10.32, elevation: 16, marginTop:20 }, buttonText:{ fontSize:25, fontWeight:"bold", color:"#fff" } })