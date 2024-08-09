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
        backgroundColor: "#9999",
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 40,
        fontSize: 20,
        color: '#fff',
        paddingVertical: 20, // Padding vertical uniforme
        paddingHorizontal: 45, // Padding horizontal
        paddingLeft: 20,
        marginTop:10
    },
    Button:{
        width: '100%',
        height: 45,
        backgroundColor: 'rgba(255, 255, 255, 0)', // Fundo transparente
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        borderColor: '#fff', // Cor da borda
        borderWidth: 1, 
    },

    Text:{
        color:'#fff',
        fontSize:18
    }
})
