    import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, SafeAreaView, StatusBar } from 'react-native';

// Navegaci車n
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

// Audio
import { Audio } from 'expo-av';

// ===================================================================================
// DATOS DE LA APLICACI車N (Normalmente ir赤an en archivos separados)
// ===================================================================================

const workoutProgram = {
    lunes: {
        title: "Piernas y Gl迆teos Pesado",
        exercises: [
            { name: "Sentadilla con Barra", sets: 5, reps: "6-8", rest: 180, type: 'reps' },
            { name: "Peso Muerto Rumano", sets: 4, reps: "8-10", rest: 150, type: 'reps' },
            { name: "Prensa de Piernas", sets: 4, reps: "12-15", rest: 120, type: 'reps' },
            { name: "Plancha frontal", sets: 3, duration: 60, rest: 45, type: 'time' },
            { name: "Plancha lateral", sets: 2, duration: 30, rest: 30, type: 'time' },
        ]
    },
    martes: { title: "Pecho y Tr赤ceps", exercises: [/* ... */] },
    miercoles: {
        title: "HIIT Metab車lico + Core",
        exercises: [
            { name: "Battle ropes", sets: 6, duration: 30, rest: 90, type: 'time' },
            { name: "Remo erg車metro", sets: 6, duration: 45, rest: 90, type: 'time' },
            { name: "Bicicleta asalto", sets: 6, duration: 30, rest: 90, type: 'time' },
            { name: "Burpees", sets: 6, reps: 10, rest: 90, type: 'reps' },
        ]
    },
    jueves: { title: "Espalda y B赤ceps", exercises: [/* ... */] },
    viernes: { title: "Hombros y Trapecio", exercises: [/* ... */] },
    sabado: { title: "Circuito Funcional", exercises: [/* ... */] },
    domingo: { title: "Recuperaci車n Activa", exercises: [/* ... */] }
};

const nutritionData = {
    fase1: {
        calories: 2100, protein: 195, carbs: 180, fats: 67,
        meals: [
            { name: "??? Comida Principal", time: "15:00", items: ["250g pechuga de pollo", "220g arroz basmati", "200g br車coli"], calories: 840, macros: "P:60g | C:85g | G:15g" },
            { name: "?? Merienda", time: "17:30", items: ["Tu batido completo", "30g prote赤na", "37g carbos"], calories: 376, macros: "P:30g | C:37g | G:12g" },
            { name: "??? Cena", time: "19:30", items: ["200g merluza", "150g arroz integral", "300g verduras"], calories: 700, macros: "P:46g | C:72g | G:24g" },
        ]
    }
};

const supplements = {
    morning: [
        { name: 'Multivitam赤nico +50', dose: '1 c芍psula' },
        { name: 'Vitamina D3', dose: '4000 UI' },
        { name: 'Omega 3', dose: '2g EPA/DHA' },
    ],
    preWorkout: [
        { name: 'Creatina', dose: '5g' },
        { name: 'Beta-Alanina', dose: '3-5g' },
    ],
    night: [
        { name: 'Magnesio', dose: '400mg' },
        { name: 'Zinc', dose: '30mg' },
        { name: 'Ashwagandha', dose: '600mg' },
    ]
};

// ===================================================================================
// HOOK DE AUDIO (Normalmente ir赤a en /hooks/useAudioPlayer.js)
// ===================================================================================

const useAudioPlayer = () => {
    const sounds = useRef({});

    useEffect(() => {
        const loadSounds = async () => {
            try {
                const soundMap = {
                    start: require('./assets/sounds/start.wav'),
                    countdown: require('./assets/sounds/countdown.wav'),
                    end: require('./assets/sounds/end.wav'),
                    rest: require('./assets/sounds/rest.wav'),
                };
                for (const key in soundMap) {
                    const { sound } = await Audio.Sound.createAsync(soundMap[key]);
                    sounds.current[key] = sound;
                }
            } catch (error) {
                console.error("Error al cargar los sonidos:", error);
            }
        };
        loadSounds();
        return () => {
            Object.values(sounds.current).forEach(sound => sound.unloadAsync());
        };
    }, []);

    const playSound = useCallback(async (soundName) => {
        try {
            if (sounds.current[soundName]) {
                await sounds.current[soundName].replayAsync();
            }
        } catch (error) {
            console.error(`Error al reproducir ${soundName}:`, error);
        }
    }, []);

    return playSound;
};


// ===================================================================================
// PANTALLAS DE LA APLICACI車N (Normalmente ir赤an en /screens/)
// ===================================================================================

// --- Pantalla de Panel ---
const DashboardScreen = ({ navigation }) => (
    <View style={styles.container}>
        <Text style={styles.title}>Panel</Text>
        <TouchableOpacity style={styles.heroCard} onPress={() => navigation.navigate('Entrenar')}>
            <Text style={styles.heroTitle}>Entrenamiento de Hoy</Text>
            <Text style={styles.heroSubtitle}>{workoutProgram.lunes.title}</Text>
            <Text style={styles.heroButtonText}>?? COMENZAR ENTRENAMIENTO</Text>
        </TouchableOpacity>
    </View>
);

// --- Pantalla de Entrenamiento (CON TEMPORIZADOR INTELIGENTE) ---
const WorkoutScreen = () => {
    const initialExercises = workoutProgram.miercoles.exercises.map(ex => ({ ...ex, completed: false }));
    const [exercises, setExercises] = useState(initialExercises);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [currentSet, setCurrentSet] = useState(1);
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timerMode, setTimerMode] = useState('idle'); // 'idle', 'active', 'rest', 'finished'
    const [isSoundOn, setIsSoundOn] = useState(true);
    const playSound = useAudioPlayer();
    const intervalRef = useRef(null);

    useEffect(() => {
        if (!isTimerRunning) return;

        intervalRef.current = setInterval(() => {
            setTimer(prev => {
                const newTime = prev - 1;
                if (newTime > 0 && newTime <= 3 && isSoundOn) playSound('countdown');
                if (newTime <= 0) handleTimerEnd();
                return newTime;
            });
        }, 1000);

        return () => clearInterval(intervalRef.current);
    }, [isTimerRunning]);

    const handleTimerEnd = () => {
        clearInterval(intervalRef.current);
        setIsTimerRunning(false);

        if (timerMode === 'active') {
            if (isSoundOn) playSound('end');
            const restTime = exercises[currentExerciseIndex].rest;
            setTimer(restTime);
            setTimerMode('rest');
            setIsTimerRunning(true);
            if (isSoundOn) playSound('rest');
        } else if (timerMode === 'rest') {
            if (isSoundOn) playSound('start');
            goToNextSetOrExercise();
        }
    };

    const goToNextSetOrExercise = () => {
        const currentExercise = exercises[currentExerciseIndex];
        if (currentSet < currentExercise.sets) {
            setCurrentSet(prev => prev + 1);
            setTimerMode('idle');
        } else {
            markExerciseAsCompleted(currentExerciseIndex, true); // Mark as fully completed
            if (currentExerciseIndex < exercises.length - 1) {
                setCurrentExerciseIndex(prev => prev + 1);
                setCurrentSet(1);
                setTimerMode('idle');
            } else {
                setTimerMode('finished');
            }
        }
    };

    const startExerciseTimer = () => {
        const exercise = exercises[currentExerciseIndex];
        if (exercise.type === 'time') {
            setTimer(exercise.duration);
            setTimerMode('active');
            setIsTimerRunning(true);
            if (isSoundOn) playSound('start');
        }
    };

    const markExerciseAsCompleted = (index, isFinalSet) => {
        if (!isFinalSet) {
            const restTime = exercises[index].rest;
            setTimer(restTime);
            setTimerMode('rest');
            setIsTimerRunning(true);
            if (isSoundOn) playSound('rest');
        } else {
            const newExercises = [...exercises];
            newExercises[index].completed = true;
            setExercises(newExercises);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getTimerBackgroundColor = () => {
        if (timerMode === 'active') return COLORS.primaryGradient;
        if (timerMode === 'rest') return COLORS.restGradient;
        return '#1f2937';
    };

    const currentExercise = exercises[currentExerciseIndex];
    if (!currentExercise) return <View style={styles.container}><Text style={styles.title}>Entrenamiento Completado!</Text></View>;
    
    const isTimeBased = currentExercise.type === 'time';

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{workoutProgram.miercoles.title}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name={isSoundOn ? "volume-high" : "volume-mute"} size={24} color={COLORS.light} />
                    <Switch value={isSoundOn} onValueChange={setIsSoundOn} trackColor={{ false: COLORS.gray, true: COLORS.primary }} thumbColor={COLORS.light} />
                </View>
            </View>

            <View style={[styles.card, { backgroundColor: getTimerBackgroundColor() }]}>
                 {timerMode === 'finished' ? (
                    <Text style={styles.timerDisplay}>??</Text>
                 ) : (
                    <>
                        <Text style={styles.exerciseName}>{currentExercise.name}</Text>
                        <Text style={styles.setInfo}>Serie {currentSet} de {currentExercise.sets}</Text>
                        <Text style={styles.timerDisplay}>
                            {isTimeBased || timerMode === 'rest' ? formatTime(timer) : currentExercise.reps}
                        </Text>
                    </>
                 )}
                <Text style={styles.timerModeText}>
                    {timerMode === 'active' && '?VAMOS!'}
                    {timerMode === 'rest' && 'DESCANSO'}
                    {timerMode === 'idle' && 'Listo para empezar'}
                    {timerMode === 'finished' && '?ENTRENAMIENTO COMPLETADO!'}
                </Text>
                
                {timerMode === 'idle' && isTimeBased && (
                    <TouchableOpacity style={styles.btnPrimary} onPress={startExerciseTimer}>
                        <Text style={styles.btnText}>?? INICIAR SERIE</Text>
                    </TouchableOpacity>
                )}
            </View>

            {exercises.map((ex, index) => (
                <View key={index} style={[styles.exerciseCard, ex.completed && styles.completedCard, index === currentExerciseIndex && styles.currentExerciseCard]}>
                    <Text style={styles.exName}>{index + 1}. {ex.name} - {ex.sets}x{ex.reps || `${ex.duration}s`}</Text>
                    {index === currentExerciseIndex && timerMode === 'idle' && !isTimeBased && (
                        <TouchableOpacity style={styles.btnSmall} onPress={() => goToNextSetOrExercise()}>
                            <Text style={styles.btnSmallText}>? MARCAR SERIE {currentSet} HECHA</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ))}
        </ScrollView>
    );
};


// --- Pantalla de Nutrici車n ---
const NutritionScreen = () => {
    const data = nutritionData.fase1;
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Nutrici車n - Fase 1</Text>
            <View style={styles.macroGrid}>
                <View style={styles.macroCard}><Text style={styles.macroValue}>{data.protein}g</Text><Text style={styles.macroLabel}>Prote赤na</Text></View>
                <View style={styles.macroCard}><Text style={styles.macroValue}>{data.carbs}g</Text><Text style={styles.macroLabel}>Carbos</Text></View>
                <View style={styles.macroCard}><Text style={styles.macroValue}>{data.fats}g</Text><Text style={styles.macroLabel}>Grasas</Text></View>
            </View>
            {data.meals.map((meal, index) => (
                 <View key={index} style={styles.mealCard}>
                    <View style={styles.mealHeader}>
                        <Text style={styles.mealName}>{meal.name}</Text>
                        <Text style={styles.mealTime}>{meal.time}</Text>
                    </View>
                    <Text style={styles.mealItems}>{meal.items.join('\n')}</Text>
                    <Text style={styles.mealMacros}>{meal.calories} kcal | {meal.macros}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

// --- Pantalla de Suplementos ---
const SupplementItem = ({ name, dose }) => {
    const [checked, setChecked] = useState(false);
    return (
        <TouchableOpacity style={styles.supplementItem} onPress={() => setChecked(!checked)}>
            <View>
                <Text style={styles.supplementName}>{name}</Text>
                <Text style={styles.supplementDose}>{dose}</Text>
            </View>
            <View style={[styles.supplementCheck, checked && styles.supplementChecked]}>
                {checked && <Ionicons name="checkmark" size={18} color="white" />}
            </View>
        </TouchableOpacity>
    );
};

const SupplementsScreen = () => (
    <ScrollView style={styles.container}>
        <Text style={styles.title}>Suplementaci車n</Text>
        <View style={styles.supplementBlock}>
            <Text style={styles.supplementTitle}>?? Ma?ana</Text>
            {supplements.morning.map(s => <SupplementItem key={s.name} {...s} />)}
        </View>
        <View style={styles.supplementBlock}>
            <Text style={styles.supplementTitle}>?? Pre-Entreno</Text>
            {supplements.preWorkout.map(s => <SupplementItem key={s.name} {...s} />)}
        </View>
        <View style={styles.supplementBlock}>
            <Text style={styles.supplementTitle}>?? Noche</Text>
            {supplements.night.map(s => <SupplementItem key={s.name} {...s} />)}
        </View>
    </ScrollView>
);

// --- Pantalla de Progreso ---
const ProgressScreen = () => (
    <View style={styles.container}>
        <Text style={styles.title}>Progreso</Text>
        <View style={styles.card}>
             <Text style={styles.progressLabel}>Pr車ximamente...</Text>
        </View>
    </View>
);


// ===================================================================================
// NAVEGADOR PRINCIPAL Y COMPONENTE APP
// ===================================================================================
const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.dark }}>
            <StatusBar barStyle="light-content" />
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused, color, size }) => {
                            let iconName;
                            if (route.name === 'Panel') iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                            else if (route.name === 'Entrenar') iconName = focused ? 'barbell' : 'barbell-outline';
                            else if (route.name === 'Nutrici車n') iconName = focused ? 'restaurant' : 'restaurant-outline';
                            else if (route.name === 'Suplementos') iconName = focused ? 'medical' : 'medical-outline';
                            else if (route.name === 'Progreso') iconName = focused ? 'trending-up' : 'trending-up-outline';
                            return <Ionicons name={iconName} size={size} color={color} />;
                        },
                        tabBarActiveTintColor: COLORS.primary,
                        tabBarInactiveTintColor: COLORS.gray,
                        tabBarStyle: { backgroundColor: '#111827', borderTopColor: '#1f2937' },
                        headerShown: false,
                    })}
                >
                    <Tab.Screen name="Panel" component={DashboardScreen} />
                    <Tab.Screen name="Entrenar" component={WorkoutScreen} />
                    <Tab.Screen name="Nutrici車n" component={NutritionScreen} />
                    <Tab.Screen name="Suplementos" component={SupplementsScreen} />
                    <Tab.Screen name="Progreso" component={ProgressScreen} />
                </Tab.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    );
}


// ===================================================================================
// ESTILOS (Normalmente ir赤an en un archivo /styles.js)
// ===================================================================================

const COLORS = {
    dark: '#0f172a',
    primary: '#8b5cf6',
    secondary: '#ec4899',
    light: '#f3f4f6',
    gray: '#6b7280',
    success: '#10b981',
    rest: '#0ea5e9',
    primaryGradient: '#8b5cf6', // Simplified for non-expo gradient
    restGradient: '#0ea5e9', // Simplified for non-expo gradient
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.dark, padding: 16 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 28, fontWeight: 'bold', color: COLORS.light, marginBottom: 20 },
    // Dashboard
    heroCard: { backgroundColor: COLORS.primary, padding: 24, borderRadius: 20, alignItems: 'center' },
    heroTitle: { fontSize: 22, fontWeight: 'bold', color: 'white' },
    heroSubtitle: { fontSize: 16, color: 'white', opacity: 0.8, marginTop: 8 },
    heroButtonText: { fontSize: 16, fontWeight: 'bold', color: 'white', marginTop: 24, letterSpacing: 1 },
    // Workout
    card: { borderRadius: 20, padding: 24, marginBottom: 20, alignItems: 'center' },
    exerciseName: { fontSize: 24, fontWeight: 'bold', color: 'white', textAlign: 'center' },
    setInfo: { fontSize: 18, color: 'white', opacity: 0.8, marginTop: 4 },
    timerDisplay: { fontSize: 72, fontWeight: 'bold', color: 'white', marginVertical: 20, fontVariant: ['tabular-nums'] },
    timerModeText: { fontSize: 16, fontWeight: '600', color: 'white', textTransform: 'uppercase', letterSpacing: 2 },
    btnPrimary: { backgroundColor: 'white', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 30, marginTop: 20 },
    btnText: { color: COLORS.dark, fontWeight: 'bold', fontSize: 16 },
    exerciseCard: { backgroundColor: '#1f2937', padding: 16, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: 'transparent' },
    currentExerciseCard: { borderColor: COLORS.primary },
    completedCard: { backgroundColor: COLORS.success, opacity: 0.5 },
    exName: { color: 'white', fontSize: 16, fontWeight: '500' },
    btnSmall: { backgroundColor: COLORS.primary, padding: 12, borderRadius: 8, marginTop: 12, alignItems: 'center' },
    btnSmallText: { color: 'white', fontWeight: 'bold' },
    // Nutrition
    macroGrid: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
    macroCard: { backgroundColor: '#1f2937', padding: 16, borderRadius: 12, alignItems: 'center', flex: 1, marginHorizontal: 5 },
    macroValue: { color: 'white', fontSize: 24, fontWeight: 'bold' },
    macroLabel: { color: COLORS.gray, fontSize: 12, marginTop: 4 },
    mealCard: { backgroundColor: '#1f2937', padding: 16, borderRadius: 12, marginBottom: 12 },
    mealHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    mealName: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    mealTime: { color: COLORS.primary, backgroundColor: 'rgba(139, 92, 246, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, fontSize: 12 },
    mealItems: { color: COLORS.light, lineHeight: 22, marginBottom: 12 },
    mealMacros: { color: COLORS.gray, fontSize: 12, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#374151' },
    // Supplements
    supplementBlock: { backgroundColor: '#1f2937', borderRadius: 16, padding: 20, marginBottom: 20 },
    supplementTitle: { color: COLORS.primary, fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
    supplementItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
    supplementName: { color: 'white', fontSize: 16 },
    supplementDose: { color: COLORS.gray, fontSize: 12, marginTop: 4 },
    supplementCheck: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: COLORS.gray, justifyContent: 'center', alignItems: 'center' },
    supplementChecked: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    // Progress
    progressLabel: { color: COLORS.gray, fontSize: 18, textAlign: 'center' },
});