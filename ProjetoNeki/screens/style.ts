import { StyleSheet } from "react-native";

export const styled = StyleSheet.create({
    
    container:{
        // width: 420,
        backgroundColor: '#000',
        borderRadius: 10,
        paddingHorizontal: 40,
        justifyContent: 'center',
        flex: 1,
    },
     
    Input:{
        backgroundColor: "transparent",
        borderBottomColor:'rgba(255, 255, 255, 0.2)',
        borderBottomWidth:1,
        fontSize: 20,
        color: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 45,
        paddingLeft: 20,
        marginTop:10
    },
    Button:{
        width: '90%',
        height: 45,
        backgroundColor: 'rgba(255, 255, 255,1)',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        borderColor: '#fff',
        borderWidth: 1, 
    },
    Button2:{
        width: '100%',
        height: 45,
        backgroundColor: '#000',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        borderColor: '#aaa',
        borderWidth: 1, 
    },

    Button3:{
        width: '90%',
        height: 45,
        backgroundColor: '#000',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        borderColor: '#aaa',
        borderWidth: 1, 
    },

    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
      },
      checkboxLabel: {
        marginLeft: 8,
        fontSize: 16,
        color: '#333333',
      },
    Text:{
        color:'#fff',
        fontSize:18
    },

    Text2:{
        color:'#000',
        fontSize:18,
        fontWeight:'bold'
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
      },
})
