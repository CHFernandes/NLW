import React, { useState, useEffect } from 'react';
import { Feather as Icon} from '@expo/vector-icons';
import { View, ImageBackground, Image, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';

import styles from './styles';

interface IBGEUFResponse{
    sigla: string;
}
interface IBGECityResponse{
    nome: string;
}

const Home = () => {
    const[selectedUf, setSelectedUf] = useState<string>('0');
    const[selectedCity, setSelectedCity] = useState<string>('0');
    const [ufs, setUfs] = useState<string[]>([]);
    const [city, setCities] = useState<string[]>([]);
    
    const navigation = useNavigation();

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);

            setUfs(ufInitials);
        });
    }, []);

    useEffect(() => {
        if (selectedUf === '0'){
            return;
        }

        axios
            .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
            const cityNames = response.data.map(city => city.nome);

            setCities(cityNames);
        });

    }, [selectedUf]);

    function handleNavigateToPoints(){
        navigation.navigate('Points', {
            uf: selectedUf,
            city: selectedCity,
        });
    }

    function handleUfChange(event: string){
        setSelectedUf(event);
    }

    function handleCityChange(event: string){
        setSelectedCity(event);
    }

    return (
        <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ImageBackground 
                source={require('../../assets/home-background.png')} 
                style={styles.container}
                imageStyle={{ width:274, height:368 }}
            >
                <View style={styles.main}>
                    <Image source={require('../../assets/logo.png')}/>
                    <View>
                        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    
                    <View style={styles.input}>
                        <RNPickerSelect
                            placeholder={{label: 'Escolha a UF', value: '0' }}
                            value={selectedUf}
                            onValueChange={handleUfChange}
                            items={ufs.map(uf => (
                                { label: uf, value: uf}
                                ))
                            }
                        />
                    </View>

                    <View style={styles.input}>
                        <RNPickerSelect
                            placeholder={{label: 'Escolha a cidade', value: '0' }}
                            value={selectedCity}
                            onValueChange={(city) => {handleCityChange(city)}}
                            items={city.map(city => (
                                { label: city, value: city}
                                ))
                            }
                        />
                    </View>

                    <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                        <View style={styles.buttonIcon}>
                            <Icon name='arrow-right' color='#fff' size={24} />
                        </View>
                        <Text style={styles.buttonText}>
                            Entrar
                        </Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

export default Home;