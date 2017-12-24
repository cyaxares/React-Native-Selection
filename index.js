'use strict';

import React, { Component } from 'react';

import {
    TextInput,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    Platform,
    Dimensions,
    DeviceEventEmitter,
    I18nManager,
    AsyncStorage,
    StyleSheet,
    Modal
} from "react-native";
import _ from 'lodash';
var cityList = null;

import Icon from "react-native-vector-icons/FontAwesome";
import PropTypes from 'prop-types'; // ES6
import {
  InputGroup,
  Input,
  List,
  ListItem
} from 'native-base';
import Storage from 'react-native-storage';
import {observer} from "mobx-react";
import searchStore from './../../Store/Search';
import cityStore from './../../Store/City';
import User_Storage from './../../engine/User_Storage.js';
import Material from 'react-native-vector-icons/MaterialIcons';
var storage = new Storage({
	size: 1000,
	storageBackend: AsyncStorage,
	defaultExpires: null,
	enableCache: true,
	sync : {
	}
})

@observer class Selection extends Component {
  static propTypes = {
	  onSelection: PropTypes.func,
	  options: PropTypes.array,
	  title:  PropTypes.string,
	  mode:  PropTypes.func,
	  style:  PropTypes.object,
    iconColor: PropTypes.string,
    iconSize: PropTypes.number,
    titleCustomize: PropTypes.bool
	}
	constructor(props) {
	  super(props);

    this.state = {
	  	modalVisible: false,
	  	value: 0,
      cityList:cityStore,
      cityStatic: cityStore,
      status:false,
      fontLoaded:false,
      title:null,
      length: null
	  };
	}
  componentWillMount(){
    storage.load({
      key: 'loginState',
      id: '1001',	  // Note: Do not use underscore("_") in id!
    }).then(ret => {
        this.setState({title: ret.location,status:true,length:ret.location.length})
    }).catch((error) => {
      this.setState({title: "سلێمانی",status:true})
      searchStore.update_city(1);
    })
    if(this.state.length ==null){
      this.setState({title:  "سلێمانی"})
    }
  }
	openOption(){
        if(!_.isEmpty(this.props.options)){
    		this.setState({modalVisible: !this.state.modalVisible});
        }
	}

  onSelected(label, value,en_label,id){

    if(!_.isEmpty(this.props.options)){
      const data = {
        id:id,
    		value: value,
    		label: label,
      }
    	this.props.onSelection(data);
    	this.setState({
    		modalVisible: false,
    		title: label,
    		value:value,
    	})
    }
    storage.load({
      key: 'loginState',
      id: '1001',	  // Note: Do not use underscore("_") in id!
    }).then(ret => {
      var Location = {
        user_id: ret.user_id,
        token : ret.token,
        status: ret.status,
        mobile: ret.mobile,
        location: label,
        en_location: en_label,
        location_id: id
      };
      storage.save({
        key: 'loginState',  // Note: Do not use underscore("_") in key!
        id: '1001',	  // Note: Do not use underscore("_") in id!
        data: Location
      });
    })
    searchStore.update_city(id);
	}
  checkIcon(icon){
      return(
          <View style={{
                  marginRight: 10,
              }}><Icon name={icon} size={this.props.iconSize} color={this.props.iconColor} /></View>
      )
  }
  SearchCity(text) {
      var thisCity=[];
      var cityS = [];
      for(var i=0;i<this.state.cityList.length;i++){
        var thisCity= this.state.cityList[i];
        if (thisCity.label.indexOf(text) > -1 || thisCity.en_label.indexOf(text) > -1) {
          cityS.push(thisCity)
        }
      }
      if(text==null || text===''){
        this.setState({cityList:this.state.cityStatic})
      }else{
        this.setState({cityList:cityS})
      }
    }

    render() {
    	let ScreenHeight = Dimensions.get("window").height;
      let ScreenWidth = Dimensions.get("window").width;
      let { style, options, title, mode, iconColor, iconSize } = this.props;
      cityList = this.props.options;

      if(_.isEmpty(options)){
          options = [];
      }

      let styles = {
      	main: {
      		width: ScreenWidth - 80,
      		marginLeft: 40,
      		marginTop: 5,
      		marginBottom: 5,
      		borderColor: '#ccc',
      		borderWidth: 1,
      		padding: 10,
      		backgroundColor: '#000',
  			  color:'#000'
      	},
        icon: {
          fontSize:22,
          color: 'grey'
        },
        checkedIcon:{
          color: 'limegreen',
          fontSize:22,
        },
        body: {
          width: ScreenWidth - 80,
          backgroundColor: '#fff',
          maxHeight: ScreenHeight - 300,
          borderRadius: 5,
          overflow: 'hidden',
        },
        option: {
          width: ScreenWidth - 80,
          padding: 10,
          paddingLeft:20,
          paddingRight:20,
          borderBottomWidth: 1,
          borderBottomColor: 'whitesmoke',
          flexDirection: I18nManager.isRTL? 'row' : 'row-reverse',
          margin: 5,
        	alignItems:'center',
        	justifyContent:I18nManager.isRTL? 'flex-start' : 'flex-start',
        },
        text: {
              color:'#000',
        			fontSize:18,
        			textAlign:'center',
        			paddingLeft:10,
        			paddingRight:10,
              alignItems:'flex-start',
              justifyContent: 'flex-start',
              fontFamily: "DroidNaskh"
          }

      }
      if(style.body!== null){
          styles.body = style.body;
      }
      if(style.option!== null){
          styles.option = style.option;
      }
      if(style.main!== null){
          styles.main = style.main;
      }

      let titleSet = '';

      if(this.props.titleCustomize === true) {
          titleSet = this.state.title;
      } else {
          titleSet = this.state.title;
      }
      if(this.state.title == null){

      }

      return (
      	<View>
      		<Modal
      			visible={this.state.modalVisible}
      			onRequestClose={() =>{alert("Modal has been closed.")}}
      			transparent={true}
      		>
      			<TouchableOpacity onPress={()=> this.openOption()}>
      				<View style={{
      					width: ScreenWidth,
      					height: ScreenHeight,
      					backgroundColor: 'rgba(0,0,0,0.8)',
      					alignItems: 'center',
                justifyContent: 'center',
      				}}>
      					<View style={styles.body}>
      						<ScrollView>
                    <View>
                      <InputGroup>
                        <Input
                          value={this.state.searchText}
                          onChangeText={(text) => this.SearchCity(text)}
                          maxLength={11}
                        />
                      <Material name='search' style={{ backgroundColor: '#fff',fontSize:25, borderColor:'#ccc', marginRight: 5, marginLeft: 5, textAlign:'center'}} />
                      </InputGroup>
                    </View>
      							{_.map(this.state.cityList, (data, k)=>{
                                      let icon = <View>{data.label==this.state.title? <Material style={styles.checkedIcon} name='check-circle' /> : <Material style={styles.icon} name='radio-button-unchecked' />}</View>;
                                      if(!_.isEmpty(data.icon)){
                                          icon = this.checkIcon(data.icon)
                                      }
  	    							return(
  	    								<TouchableOpacity key={k} onPress={()=> {
                          if(data.value != searchStore.city_id){
                            this.onSelected(data.label, data.value, data.en_label,data.id)
                          }
                        }}>
  			    							<View style={styles.option}>
                            {icon}<Text style={styles.text}>{data.label}</Text>
  			    							</View>
  		    							</TouchableOpacity>
  			    					)
  	    						})}
      						</ScrollView>
      					</View>
      				</View>
      			</TouchableOpacity>
      		</Modal>
        {this.state.status ?
        <TouchableOpacity style={{width:330,marginTop:-25}} onPress={()=>this.openOption()}>
  				<View style={[styles.main]}>
  					{this.state.length == null ? <Text style={styles.text}>{this.state.title}</Text>: <Text style={styles.text}>سلێمانی</Text>}
  				</View>
  			</TouchableOpacity>:
          <Material name={"refresh"} style={{color:"black"}} />
        }
  		</View>
      );
    }
  }


export default Selection;
