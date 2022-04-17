import {StyleSheet} from 'react-native'

export const styles = StyleSheet.create({
    header : {
        fontSize: 20,
        fontFamily:'serif',
        color: "black",
        margin: 20,
        fontWeight: 'bold',
    },
    member : {
        width: 70,
        height: 70,
        borderRadius: 70 / 2,
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
    clubHeaderImage : {
        width:180,
        height:180,
        borderRadius:180/2
    },
    clubHeader : {
        alignItems:'center',
        paddingTop:20,
        paddingBottom:20
    },
    deleteButton : {
        backgroundColor : "#ee6f68",
        paddingVertical: 15, 
    },
    removeMembers : {
        color: 'black',
        fontFamily: 'serif',
        fontSize:20,
        fontWeight: "700",
        marginVertical:15, 
        marginLeft: 20,
    },
    bowImage : {
        width:150,
        height:230,
        alignSelf:'center',
        marginVertical:20,
    },
    noBook : {
        alignSelf: 'center',
        marginVertical:115,
        fontSize: 20
    },
    nobookesearch : {
        alignSelf: 'center',
        marginVertical:50,
        fontSize: 20
    }
    
})