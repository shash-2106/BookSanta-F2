import React from 'react';
import { StyleSheet, Text, View, TextInput,TouchableOpacity,FlatList } from 'react-native';
import MyHeader from '../Component/MyHeader';
import db from '../config';
import firebase from 'firebase';
import {Header, Icon, Card,ListItem} from 'react-native-elements';


export default class MyDonationScreen extends React.Component{
    constructor(){
        super();
        this.state={
            donorId:firebase.auth().currentUser.email,
            donorName:'',
            allDonations:[]
        }
    }
    getDonorDetails=(donorId)=>{
        db.collection("users").where("email_id","==",donorId).get().then((snapshot)=>{snapshot.forEach((doc)=>{this.setState({
            donorName:doc.data().first_Name + " " + doc.data().last_Name
        })})})
    }
    getAllDonations=()=>{
        db.collection("all_donations").where("donor_id","==",this.state.donorId).onSnapshot((snapshot)=>{var allDonations=[]
        snapshot.docs.map((doc)=>{
            var donation = doc.data()
            donation["doc_id"] = doc.id
            allDonations.push(donation)
        })
    this.setState({
        allDonations:allDonations
    })})
    }
    componentDidMount(){
        this.getDonorDetails(this.state.donorId)
        this.getAllDonations()
    }
    
    sendBook=(bookDetails)=>{
        if(bookDetails.request_status=="Book Sent"){
            var requestStatus = "Donor Interested"
            db.collection("all_donations").doc(bookDetails.doc_id).update({
                "request_status":"Donor Interested"
            })
            this.sendNotification(bookDetails,requestStatus)
        }
        else{
            var requestStatus = "Book Sent"
            db.collection("all_donations").doc(bookDetails.doc_id).update({
                "request_status":"Book Sent"
            })
            this.sendNotification(bookDetails,requestStatus)
        }
    }
    sendNotification=(bookDetails,requestStatus)=>{
        var requestId = bookDetails.request_id
        var donorId = bookDetails.donor_id
        db.collection("all_notifications").where("request_id","==",requestId).where("donor_id","==",donorId).get().then((snapshot)=>{snapshot.forEach((doc)=>{
            var message = ""
            if(requestStatus=="Book Sent"){
                message = this.state.donorName + "sent you book"
            }
            else{
                message = this.state.donorName + "has shown interest in donating the book"
            }
            db.collection("all_notifications").doc(doc.id).update({
                "message":message,
                "notification_status":"unread",
                "date":firebase.firestore.FieldValue.serverTimestamp()
            })
        })})
    }


    keyExtractor = (item, index) => index.toString()

    renderItem = ( {item, i} ) =>(
     
        <ListItem
          key={i}
          title={item.book_name}
          subtitle={"requested by"+item.requested_by+"\nstatus"+item.request_status}
          leftElement={<Icon name="book" type="font-awesome" color ='#696969'/>}
          titleStyle={{ color: 'black', fontWeight: 'bold' }}
          rightElement={
            <TouchableOpacity
             style={[
               styles.button,
               {
                 backgroundColor : item.request_status === "Book Sent" ? "green" : "#ff5722"
               }
             ]}
             onPress = {()=>{
               this.sendBook(item)
             }}
            >
              <Text style={{color:'#ffff'}}>{
                item.request_status === "Book Sent" ? "Book Sent" : "Send Book"
              }</Text>
            </TouchableOpacity>
          }
        bottomDivider
        />
      )
    
    render(){
        return(
         
            <View style={{flex:1}}>
            <MyHeader navigation={this.props.navigation} title="My Donations"/>
            <Text>{this.state.allDonations.length}</Text>
            <View style={{flex:1}}>
              {
                this.state.allDonations.length === 0
                ?(
                  <View style={styles.subContainer}>
                    <Text style={{ fontSize: 20}}>List Of All Book Donations</Text>
                  </View>
                )
                :(
                  <FlatList
                  keyExtractor={this.keyExtractor}
                  data={this.state.allDonations}
                  renderItem={this.renderItem}
                />
                )
              }
            </View>
          </View>
        )
    }
}
const styles = StyleSheet.create({
    subContainer:{
      flex:1,
      fontSize: 20,
      justifyContent:'center',
      alignItems:'center'
    },
    button:{
      width:100,
      height:30,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:"#ff5722",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8
       }
    }
  })