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
    AsyncStorage,
    StyleSheet,
    Modal
} from "react-native";

import _ from 'lodash';

import Icon from "react-native-vector-icons/FontAwesome";

class Selection extends Component {
	static propTypes = {
	  onSelection: React.PropTypes.func,
	  options: React.PropTypes.array,
	  title:  React.PropTypes.string,
	  mode:  React.PropTypes.func,
	  style:  React.PropTypes.object,
      iconColor: React.PropTypes.string,
      iconSize: React.PropTypes.number,
	}
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	modalVisible: false,
	  	title: props.title,
	  	value: 0,
	  };
	}
	openOption(){
        if(!_.isEmpty(this.props.options)){
    		this.setState({modalVisible: !this.state.modalVisible});
        }
	}

	onSelected(name, value){
        if(!_.isEmpty(this.props.options)){
    		const data = {
    			value: value,
    			name: name,
    		}
    		this.props.onSelection(data);
    		this.setState({
    			modalVisible: false,
    			title: name,
    			value,
    		})
        }
	}

    checkIcon(icon){
        return(
            <View style={{
                    marginRight: 10,
                }}><Icon name={icon} size={this.props.iconSize} color={this.props.iconColor} /></View>
        )
    }
  render() {
  	let ScreenHeight = Dimensions.get("window").height;
    let ScreenWidth = Dimensions.get("window").width;

    let { style, options, title, mode, iconColor, iconSize } = this.props;

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
    		backgroundColor: '#ffffff',
    	},
        body: {
            width: ScreenWidth - 80,
            backgroundColor: '#ffffff',
            maxHeight: ScreenHeight - 300,
            borderRadius: 5,
            overflow: 'hidden',
        },
        option: {
            width: ScreenWidth - 80,
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#cccccc',
            flexDirection: 'row',
            margin: 5,
        }
    }
    if(style.body!== null){
        styles.body = style.body;
    }
    if(style.option!== null){
        styles.option = style.option;
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
    							{_.map(options, (data, k)=>{
                                    let icon = <View />;
                                    if(!_.isEmpty(data.icon)){
                                        icon = this.checkIcon(data.icon)
                                    }
	    						if(data.disable)
return(
<View style={styles.disable ? styles.disable : styles.option}>
{icon}
<Text>{data.name}</Text>
</View>
)
else
return(
<TouchableOpacity key={k} onPress={()=> this.onSelected(data.name, data.value)}>
<View style={styles.option}>
 {icon}
<Text>{data.name}</Text>
</View>
</TouchableOpacity>
)
	    						})}
    						</ScrollView>
    					</View>
    				</View>
    			</TouchableOpacity>
    		</Modal>
    		
    		<TouchableOpacity onPress={()=>this.openOption()}>
				<View style={styles.main}>
					<Text>{this.state.title}</Text>
				</View>
			</TouchableOpacity>
		</View>
    );
  }
}


export default Selection;
