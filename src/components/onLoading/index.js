import React, {useEffect,useState,Component} from 'react'
import {View,Text, FlatList,StyleSheet, Animated} from 'react-native'
import LinearGradient from 'react-native-linear-gradient';

const LOADING_COLORS = ['#D3D3D380', '#80808080', '#D3D3D380']

class gradHelper extends Component {
    render() {
        const {
          style,
          colors,
          position,
          start = { x: 0, y: 0 },
          end = { x: 0, y: 1 },
        } = this.props;
        return (
          <LinearGradient
            colors={colors}
            locations={[0.0,position,1.0]}
            start={start}
            end={end}
            style={style}
          >{this.props.children}</LinearGradient>
        );
      }
}

const AnimetedGradient = Animated.createAnimatedComponent(gradHelper)


export const LoadingProfilePhoto = ({size, source, style, local= false , position}) =>{

    return (<AnimetedGradient 
        start={{x: 0, y: 1}} 
        end={{x: 1, y: 0}} 
        position={position} 
        colors={LOADING_COLORS} 
        style={[{width:size,height:size, borderRadius : size/2},style]}></AnimetedGradient>)
}


export const LoadingBookCover = ({size = false,style={},position}) => {


    return (<AnimetedGradient 
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        position={position}
        colors={LOADING_COLORS} style={[style,size ? {width:size,height:size*1.5} : {}]}></AnimetedGradient>)
}

export const LoadingText = ({style, lines=1, width,height=20, randomlength = false ,position, containerStyle={}}) => {
    const randString = (length)=>{var str = ""; for(let i = 0; i < length;i++){str+='_'} return str;}


    return (<View style={containerStyle}>{Array.from({ length: lines }, (_, i) => {
        const length = (Math.floor(Math.random() * (80- 30) + 30));
        return (<AnimetedGradient  
            start={{x: 0, y: 1}} 
            end={{x: 1, y: 0}} 
            position={position} 
            colors={LOADING_COLORS}
            style={[style,styles.textL,{height:height,width:randomlength ? `${length}%` : width}]}>
                 <Text style={[style, styles.text,{fontSize:height}]}>{randomlength ? randString(length) : '_______'}</Text>
        </AnimetedGradient>)
                }) }
        </View>)
}

export const LoadingList = ({position,size=70 ,textStyle,photoStyle, viewStyle}) => {
    return <FlatList
    horizontal
    showsHorizontalScrollIndicator={false}
    data={Array.from({length : 3})}
    renderItem={({item})=>{
        return (
        <View style={viewStyle ? viewStyle :{justifyContent:'center',alignItems:'center'}}>
            <LoadingProfilePhoto size={size} style={photoStyle ? photoStyle : styles.member} position={position}/>
            <LoadingText style={textStyle ? textStyle : styles.name}  position={position}/>
        </View>)
    }}
    />
}

export const HorizontalBookList = ({position,viewStyle,size,bookStyle})=>{
    return <FlatList
    horizontal
    showsHorizontalScrollIndicator={false}
    data={Array.from({length : 3})}
    renderItem={({item})=>{
        return (
        <View style={viewStyle ? viewStyle :{justifyContent:'center',alignItems:'center'}}>
            <LoadingBookCover position={position} size={size} style={bookStyle}/>
        </View>)
    }}
    />
}


export const VerticalBookList = ({position,viewStyle,size,bookStyle,bgcolor})=>{
    return <FlatList
    scrollEnabled
    data={Array.from({length : 1})}
    renderItem={({item})=>{
        return ( 
            <View style = {{flexDirection:'row', flex: 1}}>
                <View style = {{ width: "35%", height: 210, marginLeft:10, marginTop: 20}}>    
                    <LoadingBookCover  position={position} style={ {width: '100%', height: 210}}/>
                </View>
                <View style = {{width: "58%", height: 210, marginRight: 20, marginTop: 20, backgroundColor: bgcolor, borderTopRightRadius: 20, borderBottomRightRadius: 20}}>
                    <LoadingText style={styles.text}  height={40} position={position}/>
                    <LoadingText style={styles.text2}  lines={4} position={position} randomlength={true}/>
                </View>
            </View>
        )}}/>
}


export const VerticalClubList = ({bookStyle,viewStyle,position,size})=>{
    return <FlatList
    showsHorizontalScrollIndicator={false}
    data={Array.from({length : 2})}
    renderItem={({item})=>{
        return (
        <View style={viewStyle ? viewStyle :{justifyContent:'center',alignItems:'center'}}>
            <View style = {{flexDirection:'row', flex: 1}}>
                                <View style = {{flexDirection: "row", flex: 1, width: "35%", height: 100, marginLeft:15, marginTop: 20, backgroundColor: "#f17c56", borderTopLeftRadius: 360, borderBottomLeftRadius: 360}}>  
                                    <LoadingProfilePhoto size = {100} position={position} style={styles.image}/>
                                </View>
                                <View style = {{width: "65%", height: 100, marginRight: 20, marginTop: 20, backgroundColor: "#f17c56", borderTopRightRadius: 20, borderBottomRightRadius: 20}}>
                                    <LoadingText style={styles.text} height={40}  position={position}/>
                                    <LoadingText style={styles.text2}  position={position}/>
                                </View>
                                </View>
        </View>)
    }}
    />
}

export const BookSearchList = ({position,coverStyle={},size})=>{
    return (<FlatList
        columnWrapperStyle={{justifyContent: "space-around"}}
        numColumns={3}
        data={[1,2,3]}
        renderItem={({item})=>{ 
            return (
            <View style = {{marginRight: 15}}>
                <LoadingBookCover  position={position} size={size} style={coverStyle}/>   
            </View>
        ) }}
    />)
}


const styles = StyleSheet.create({
    textL : {
        margin: 0,
        marginBottom: 15,
        borderRadius:5
    },
    text : {
       margin: 0,
        color:'#ffffff00',
    },
    member : {
        overflow: "hidden",
        marginLeft: 20,
        alignItems: "center"
    },
    name : {
        display:'flex',
        flexDirection:'row',
        fontSize: 15,
        fontFamily:'serif',
        color: "black",
        textAlign: "center",
        fontWeight: 'bold',
        marginLeft: 25,
        marginBottom: 20
    },
    image: {
        overflow: "hidden",
        marginLeft: 0,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: "#f17c56"
    },
    text: {
        fontSize: 15,
        color: '#ffffff00',
        fontFamily:'serif',
        textAlign: "left",
        marginTop:10,
        marginLeft: 15,
        marginRight: 10,
    },
    text2: {
        fontSize: 15,
        color: '#ffffff00',
        fontFamily:'serif',
        textAlign: "left",
        marginLeft: 15,
        marginRight: 10,
    }
})



