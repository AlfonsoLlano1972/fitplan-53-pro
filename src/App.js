import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Camera, Trash2, Plus, Trophy, Target, TrendingUp, Calendar, Clock, Dumbbell, Heart, Award, CheckCircle, Circle, AlertCircle, Volume2, VolumeX, Settings, User, BarChart3, Activity, Flame, Timer, SkipForward } from 'lucide-react';

// Datos del programa de entrenamiento actualizado
const workoutProgram = {
  lunes: {
    name: "Tren Superior y Core",
    description: "Calentamiento, HIIT y trabajo de fuerza",
    type: "Fuerza + HIIT",
    difficulty: "Intermedio-Alto",
    duration: "45-50 min",
    calories: "400-500",
    color: "from-orange-500 to-red-500",
    exercises: [
      { name: "Estiramientos de calentamiento", type: "Calentamiento", sets: 1, reps: "5 min", rest: 0, isTime: true, duration: 300, description: "Prepara tu cuerpo con estiramientos dinámicos", video: "🎥", equipment: "Ninguno" },
      { name: "Carrera de calentamiento", type: "Cardio", sets: 1, reps: "1 km", rest: 0, isTime: false, description: "Carrera suave para elevar la temperatura corporal", video: "🎥", equipment: "Ninguno" },
      { name: "Bicicleta de asalto", type: "HIIT", sets: 1, reps: "15 min", rest: 0, isTime: true, duration: 900, description: "12 calorías en bicicleta de asalto", video: "🎥", equipment: "Bicicleta de asalto" },
      { name: "Clean & Press", type: "Fuerza", sets: 1, reps: "8", rest: 60, isTime: false, description: "Ejercicio compuesto para potencia total del cuerpo", video: "🎥", equipment: "Barra/Mancuernas" },
      { name: "Flexiones", type: "Fuerza", sets: 1, reps: "10", rest: 60, isTime: false, description: "Ejercicio clásico para pecho y tríceps", video: "🎥", equipment: "Ninguno" },
      { name: "Elevaciones de piernas colgado", type: "Core", sets: 3, reps: "10", rest: 60, isTime: false, description: "Fortalece el core inferior", video: "🎥", equipment: "Barra de dominadas" },
      { name: "KB Swings", type: "HIIT", sets: 3, reps: "15", rest: 60, isTime: false, description: "Ejercicio explosivo con pesa rusa", video: "🎥", equipment: "Pesa rusa" },
      { name: "Arnold Press", type: "Fuerza", sets: 3, reps: "10", rest: 60, isTime: false, description: "Press de hombros con rotación completa", video: "🎥", equipment: "Mancuernas" },
      { name: "Rear Delt Fly", type: "Fuerza", sets: 3, reps: "10", rest: 60, isTime: false, description: "Aperturas posteriores para deltoides traseros", video: "🎥", equipment: "Mancuernas" },
      { name: "Elevaciones laterales con cable", type: "Fuerza", sets: 3, reps: "10", rest: 60, isTime: false, description: "Trabajo aislado de deltoides laterales", video: "🎥", equipment: "Cable/Poleas" }
    ]
  },
  martes: {
    name: "Cardio y Brazos",
    description: "Entrenamiento cardiovascular con finalizador de brazos",
    type: "Cardio + Fuerza",
    difficulty: "Intermedio",
    duration: "40-45 min",
    calories: "350-450",
    color: "from-green-500 to-teal-500",
    exercises: [
      { name: "Estiramientos de calentamiento", type: "Calentamiento", sets: 1, reps: "5 min", rest: 0, isTime: true, duration: 300, description: "Prepara tu cuerpo con estiramientos dinámicos", video: "🎥", equipment: "Ninguno" },
      { name: "Carrera 1 milla", type: "Cardio", sets: 1, reps: "1.6 km", rest: 0, isTime: false, description: "Carrera a ritmo moderado", video: "🎥", equipment: "Ninguno" },
      { name: "Ski Erg", type: "Cardio", sets: 1, reps: "500m", rest: 120, isTime: false, description: "Si no puedes hacer todo junto, divide en 2x250m", video: "🎥", equipment: "Ski Erg" },
      { name: "Remo", type: "Cardio", sets: 1, reps: "500m", rest: 120, isTime: false, description: "Mantén un ritmo constante", video: "🎥", equipment: "Máquina de remo" },
      { name: "Box Step Ups", type: "Fuerza", sets: 1, reps: "50", rest: 60, isTime: false, description: "Subidas al cajón alternando piernas", video: "🎥", equipment: "Cajón/Step" },
      { name: "Elevaciones de rodillas", type: "Core", sets: 1, reps: "50", rest: 60, isTime: false, description: "Eleva las rodillas al pecho alternadamente", video: "🎥", equipment: "Ninguno" },
      { name: "Hang Cleans", type: "Fuerza", sets: 1, reps: "30", rest: 90, isTime: false, description: "Cargadas colgantes explosivas", video: "🎥", equipment: "Barra" },
      { name: "FINALIZADOR: Curl con barra", type: "Fuerza", sets: 1, reps: "30", rest: 60, isTime: false, description: "Finalizador para bíceps", video: "🎥", equipment: "Barra" },
      { name: "FINALIZADOR: Extensiones de tríceps", type: "Fuerza", sets: 1, reps: "30", rest: 0, isTime: false, description: "Finalizador para tríceps", video: "🎥", equipment: "Mancuernas/Cable" }
    ]
  },
  miercoles: {
    name: "Pecho y Hombros",
    description: "Entrenamiento de fuerza para tren superior",
    type: "Fuerza",
    difficulty: "Intermedio-Alto",
    duration: "50-55 min",
    calories: "400-500",
    color: "from-purple-500 to-pink-500",
    exercises: [
      { name: "Estiramientos", type: "Calentamiento", sets: 1, reps: "5 min", rest: 0, isTime: true, duration: 300, description: "Calentamiento con estiramientos", video: "🎥", equipment: "Ninguno" },
      { name: "Carrera 2km", type: "Cardio", sets: 1, reps: "2 km", rest: 180, isTime: false, description: "Intenta mantenerlo bajo 10 minutos. Ritmo conversacional", video: "🎥", equipment: "Ninguno" },
      { name: "Bicicleta de asalto + Press de banca", type: "HIIT", sets: 5, reps: "16-14-12-10-8", rest: 90, isTime: false, description: "16 calorías y 16 reps, 14 cal y 14 reps, etc. Press más ligero de lo normal", video: "🎥", equipment: "Bicicleta + Banca" },
      { name: "Press militar", type: "Fuerza", sets: 5, reps: "10", rest: 60, isTime: false, description: "Press de hombros estricto", video: "🎥", equipment: "Barra/Mancuernas" },
      { name: "Remo gorila", type: "Fuerza", sets: 5, reps: "10", rest: 60, isTime: false, description: "Remo alternado con mancuernas", video: "🎥", equipment: "Mancuernas" }
    ]
  },
  jueves: {
    name: "Día de Pecho y Tríceps",
    description: "Enfoque en pecho con trabajo de tríceps",
    type: "Fuerza",
    difficulty: "Alto",
    duration: "55-60 min",
    calories: "450-550",
    color: "from-blue-500 to-cyan-500",
    exercises: [
      { name: "Calentamiento en bicicleta", type: "Calentamiento", sets: 1, reps: "15 min", rest: 0, isTime: true, duration: 900, description: "Calentamiento cardiovascular suave", video: "🎥", equipment: "Bicicleta" },
      { name: "Press declinado con mancuernas", type: "Fuerza", sets: 3, reps: "10", rest: 60, isTime: false, description: "De ligero a pesado, enfócate en la forma", video: "🎥", equipment: "Mancuernas + Banco" },
      { name: "Aperturas declinadas", type: "Fuerza", sets: 3, reps: "12,10,8", rest: 60, isTime: false, description: "Series descendentes", video: "🎥", equipment: "Mancuernas + Banco" },
      { name: "Press inclinado con mancuernas", type: "Fuerza", sets: 3, reps: "12,10,8", rest: 60, isTime: false, description: "De ligero a pesado progresivamente", video: "🎥", equipment: "Mancuernas + Banco" },
      { name: "Fondos", type: "Fuerza", sets: 3, reps: "10,8,6", rest: 90, isTime: false, description: "Asistidos o sin asistencia. Baja profundo para estirar el pecho", video: "🎥", equipment: "Paralelas" },
      { name: "Press de pecho", type: "Fuerza", sets: 3, reps: "10", rest: 60, isTime: false, description: "Press de pecho en máquina o con mancuernas", video: "🎥", equipment: "Máquina/Mancuernas" },
      { name: "Extensión de tríceps", type: "Fuerza", sets: 3, reps: "10", rest: 45, isTime: false, description: "Extensiones con cable o mancuernas", video: "🎥", equipment: "Cable/Mancuernas" },
      { name: "Extensión de tríceps sobre cabeza", type: "Fuerza", sets: 3, reps: "12", rest: 45, isTime: false, description: "Extensiones sobre la cabeza para tríceps", video: "🎥", equipment: "Mancuerna/Cable" }
    ]
  },
  viernes: {
    name: "Espalda y Bíceps",
    description: "Día de tirón enfocado en espalda",
    type: "Fuerza",
    difficulty: "Intermedio-Alto",
    duration: "50-55 min",
    calories: "400-500",
    color: "from-indigo-500 to-purple-500",
    exercises: [
      { name: "Estiramientos", type: "Calentamiento", sets: 1, reps: "5 min", rest: 0, isTime: true, duration: 300, description: "Calentamiento con estiramientos", video: "🎥", equipment: "Ninguno" },
      { name: "Carrera 1km constante", type: "Cardio", sets: 1, reps: "1 km", rest: 180, isTime: false, description: "Intenta bajo 6 min o 5 si te sientes cómodo. Controla la respiración: 2 inhalaciones por la nariz, 1 exhalación", video: "🎥", equipment: "Ninguno" },
      { name: "Remo con barra T", type: "Fuerza", sets: 3, reps: "10", rest: 60, isTime: false, description: "Remo con barra en T para espalda media", video: "🎥", equipment: "Barra T" },
      { name: "Jalón lat", type: "Fuerza", sets: 4, reps: "10", rest: 60, isTime: false, description: "Jalón al pecho para dorsales", video: "🎥", equipment: "Máquina de jalón" },
      { name: "Remo péndulo", type: "Fuerza", sets: 3, reps: "10,8,8", rest: 60, isTime: false, description: "Remo con movimiento pendular", video: "🎥", equipment: "Mancuernas" },
      { name: "Extensión de dorsales", type: "Fuerza", sets: 3, reps: "10", rest: 60, isTime: false, description: "Pullover para dorsales", video: "🎥", equipment: "Cable/Mancuerna" },
      { name: "Face pulls", type: "Fuerza", sets: 3, reps: "10", rest: 45, isTime: false, description: "Jalones a la cara para deltoides posteriores", video: "🎥", equipment: "Cable con cuerda" },
      { name: "Curl con cable", type: "Fuerza", sets: 4, reps: "10", rest: 45, isTime: false, description: "Curl de bíceps con cable", video: "🎥", equipment: "Cable" },
      { name: "Curl martillo", type: "Fuerza", sets: 3, reps: "10", rest: 45, isTime: false, description: "Curl tipo martillo para bíceps y antebrazos", video: "🎥", equipment: "Mancuernas" }
    ]
  },
  sabado: {
    name: "Día de Piernas",
    description: "Entrenamiento completo de tren inferior",
    type: "Fuerza",
    difficulty: "Alto",
    duration: "55-60 min",
    calories: "500-600",
    color: "from-red-500 to-orange-500",
    exercises: [
      { name: "Estiramientos", type: "Calentamiento", sets: 1, reps: "5 min", rest: 0, isTime: true, duration: 300, description: "Calentamiento con estiramientos dinámicos", video: "🎥", equipment: "Ninguno" },
      { name: "Opción cardio (elige una)", type: "Cardio", sets: 1, reps: "15 min", rest: 180, isTime: true, duration: 900, description: "15 min carrera, bicicleta o escaladora", video: "🎥", equipment: "Variable" },
      { name: "Sentadillas traseras", type: "Fuerza", sets: 3, reps: "10", rest: 90, isTime: false, description: "Sentadillas con barra en la espalda", video: "🎥", equipment: "Barra + Rack" },
      { name: "Box step ups", type: "Fuerza", sets: 3, reps: "10 c/pierna", rest: 60, isTime: false, description: "Subidas al cajón alternando piernas", video: "🎥", equipment: "Cajón" },
      { name: "Sentadillas elevadas", type: "Fuerza", sets: 2, reps: "12", rest: 60, isTime: false, description: "Sentadillas con talones elevados", video: "🎥", equipment: "Plataforma/Discos" },
      { name: "Prensa de piernas", type: "Fuerza", sets: 4, reps: "10", rest: 60, isTime: false, description: "Press de piernas en máquina", video: "🎥", equipment: "Prensa" },
      { name: "Extensión de cuádriceps", type: "Fuerza", sets: 3, reps: "12", rest: 45, isTime: false, description: "Extensiones en máquina", video: "🎥", equipment: "Máquina de extensión" },
      { name: "Curl de isquiotibiales", type: "Fuerza", sets: 3, reps: "12", rest: 45, isTime: false, description: "Curl de piernas acostado o sentado", video: "🎥", equipment: "Máquina de curl" },
      { name: "Elevación de gemelos", type: "Fuerza", sets: 4, reps: "12", rest: 30, isTime: false, description: "Elevaciones de pantorrillas", video: "🎥", equipment: "Máquina/Mancuernas" },
      { name: "FINALIZADOR: Cable crunch", type: "Core", sets: 1, reps: "40", rest: 0, isTime: false, description: "Abdominales con cable para finalizar", video: "🎥", equipment: "Cable" }
    ]
  },
  domingo: {
    name: "Día de Recuperación",
    description: "Recuperación activa - El descanso es parte del plan",
    type: "Recuperación",
    difficulty: "Fácil",
    duration: "20-30 min",
    calories: "100-150",
    color: "from-gray-500 to-gray-600",
    exercises: [
      { name: "Estiramientos o foam roll", type: "Movilidad", sets: 1, reps: "10 min", rest: 0, isTime: true, duration: 600, description: "Los músculos crecen cuando descansas, la disciplina se agudiza cuando te mantienes intencional", video: "🎥", equipment: "Foam roller opcional" },
      { name: "Caminata", type: "Cardio", sets: 1, reps: "20-30 min", rest: 0, isTime: true, duration: 1500, description: "Caminata suave para recuperación activa", video: "🎥", equipment: "Ninguno" },
      { name: "Hidratación agresiva", type: "Recuperación", sets: 1, reps: "Todo el día", rest: 0, isTime: false, description: "No confundas descanso con debilidad. Los leones descansan antes de cazar", video: "💧", equipment: "Agua" }
    ]
  }
};    
// Función para crear sonido usando Web Audio API
const createBeepSound = () => {
  let audioContext = null;
  
  const initAudio = () => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume context if suspended (for mobile browsers)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  };
  
  const playBeep = (frequency = 800, duration = 200) => {
    try {
      initAudio();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };
  
  return {
    init: initAudio,
    beep: () => playBeep(800, 200),
    countdownBeep: () => playBeep(600, 150),
    finalBeep: () => playBeep(1000, 500),
    warningBeep: () => playBeep(900, 100)
  };
};

// Componente principal mejorado
function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedDay, setSelectedDay] = useState('lunes');
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionPaused, setSessionPaused] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [exerciseTimer, setExerciseTimer] = useState(0);
  const [isExerciseTimerActive, setIsExerciseTimerActive] = useState(false);
  const [timerType, setTimerType] = useState(''); // 'exercise' or 'rest'
  const [workoutData, setWorkoutData] = useState({});
  const [progressPhotos, setProgressPhotos] = useState({ frontal: [], lateral: [], trasera: [] });
  const [measurements, setMeasurements] = useState([
    { date: '2025-09-01', weight: 75, bodyFat: 22, waist: 90 },
    { date: '2025-09-15', weight: 74.5, bodyFat: 21.5, waist: 89 },
    { date: '2025-10-01', weight: 73.8, bodyFat: 21, waist: 88 },
  ]);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [userProfile, setUserProfile] = useState({
    name: "Usuario",
    age: 55,
    goal: "Perder grasa y ganar músculo",
    level: 1,
    experience: 0,
    totalWorkouts: 0,
    streak: 0,
    badges: []
  });
  const [achievements, setAchievements] = useState([
    { id: 1, name: "Primera Semana", icon: "🏃", unlocked: false, description: "Completa tu primera semana" },
    { id: 2, name: "10 Entrenamientos", icon: "💪", unlocked: false, description: "Completa 10 entrenamientos" },
    { id: 3, name: "Racha de 7 días", icon: "🔥", unlocked: false, description: "Entrena 7 días seguidos" },
    { id: 4, name: "Maestro del HIIT", icon: "⚡", unlocked: false, description: "Completa 20 sesiones HIIT" },
    { id: 5, name: "Transformación", icon: "🦋", unlocked: false, description: "Pierde 5kg de peso" },
  ]);
  const [newMeasurement, setNewMeasurement] = useState({});
  
  // Referencia para el sonido
  const soundRef = useRef(null);
  
  // Inicializar sonido
  useEffect(() => {
    soundRef.current = createBeepSound();
  }, []);

  // Cronómetro de sesión
  useEffect(() => {
    let interval = null;
    if (isSessionActive && !sessionPaused) {
      interval = setInterval(() => {
        setSessionTimer(timer => timer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive, sessionPaused]);

  // Cronómetro de ejercicio con sonido mejorado
  useEffect(() => {
    let interval = null;
    if (isExerciseTimerActive && exerciseTimer > 0) {
      interval = setInterval(() => {
        setExerciseTimer(timer => {
          // Sonidos de aviso
          if (soundEnabled && soundRef.current) {
            if (timer === 4) soundRef.current.countdownBeep();
            if (timer === 3) soundRef.current.countdownBeep();
            if (timer === 2) soundRef.current.countdownBeep();
            if (timer === 1) soundRef.current.finalBeep();
          }
          
          if (timer <= 1) {
            setIsExerciseTimerActive(false);
            
            // Auto-avanzar después del ejercicio
            if (timerType === 'exercise') {
              const currentWorkout = workoutProgram[selectedDay];
              const currentExercise = currentWorkout.exercises[currentExerciseIndex];
              
              // Si hay descanso, iniciarlo automáticamente
              if (currentExercise.rest > 0) {
                setTimeout(() => {
                  startRestTimer();
                }, 500);
              }
            } else if (timerType === 'rest') {
              // Después del descanso, ir a la siguiente serie o ejercicio
              const currentWorkout = workoutProgram[selectedDay];
              const currentExercise = currentWorkout.exercises[currentExerciseIndex];
              
              if (currentSet < currentExercise.sets) {
                setCurrentSet(currentSet + 1);
                // Si es un ejercicio de tiempo, iniciar automáticamente
                if (currentExercise.isTime) {
                  setTimeout(() => {
                    startExerciseTimer();
                  }, 500);
                }
              } else {
                // Marcar ejercicio como completado y pasar al siguiente
                markExerciseComplete(currentExerciseIndex);
                if (currentExerciseIndex < currentWorkout.exercises.length - 1) {
                  setTimeout(() => {
                    nextExercise();
                  }, 500);
                }
              }
            }
          }
          return timer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isExerciseTimerActive, exerciseTimer, soundEnabled, timerType, currentSet, currentExerciseIndex]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startSession = () => {
    setIsSessionActive(true);
    setSessionPaused(false);
    setCurrentSet(1);
    
    // Si el primer ejercicio es de tiempo, iniciar automáticamente
    const currentExercise = workoutProgram[selectedDay].exercises[0];
    if (currentExercise.isTime) {
      setTimeout(() => {
        startExerciseTimer();
      }, 1000);
    }
  };

  const pauseSession = () => {
    setSessionPaused(!sessionPaused);
    if (!sessionPaused) {
      setIsExerciseTimerActive(false);
    }
  };

  const stopSession = () => {
    if (window.confirm('¿Estás seguro de que quieres terminar el entrenamiento?')) {
      setIsSessionActive(false);
      setSessionPaused(false);
      setSessionTimer(0);
      setExerciseTimer(0);
      setIsExerciseTimerActive(false);
      setTimerType('');
      setCurrentSet(1);
    }
  };

  const nextExercise = () => {
    const currentWorkout = workoutProgram[selectedDay];
    if (currentExerciseIndex < currentWorkout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSet(1);
      setExerciseTimer(0);
      setIsExerciseTimerActive(false);
      setTimerType('');
      
      // Auto-iniciar si el siguiente ejercicio es de tiempo
      const nextExercise = currentWorkout.exercises[currentExerciseIndex + 1];
      if (nextExercise.isTime && isSessionActive) {
        setTimeout(() => {
          startExerciseTimer();
        }, 1000);
      }
    }
  };

  const prevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      setCurrentSet(1);
      setExerciseTimer(0);
      setIsExerciseTimerActive(false);
      setTimerType('');
    }
  };

  const startExerciseTimer = () => {
    const currentExercise = workoutProgram[selectedDay].exercises[currentExerciseIndex];
    if (currentExercise.isTime) {
      setExerciseTimer(currentExercise.duration);
      setIsExerciseTimerActive(true);
      setTimerType('exercise');
      if (soundEnabled && soundRef.current) {
        soundRef.current.beep();
      }
    }
  };

  const startRestTimer = () => {
    const currentExercise = workoutProgram[selectedDay].exercises[currentExerciseIndex];
    if (currentExercise.rest > 0) {
      setExerciseTimer(currentExercise.rest);
      setIsExerciseTimerActive(true);
      setTimerType('rest');
      if (soundEnabled && soundRef.current) {
        soundRef.current.warningBeep();
      }
    }
  };

  const skipTimer = () => {
    setExerciseTimer(0);
    setIsExerciseTimerActive(false);
    
    if (timerType === 'rest') {
      const currentWorkout = workoutProgram[selectedDay];
      const currentExercise = currentWorkout.exercises[currentExerciseIndex];
      
      if (currentSet < currentExercise.sets) {
        setCurrentSet(currentSet + 1);
      } else {
        markExerciseComplete(currentExerciseIndex);
        if (currentExerciseIndex < currentWorkout.exercises.length - 1) {
          nextExercise();
        }
      }
    }
    setTimerType('');
  };

  const markExerciseComplete = (index) => {
    setWorkoutData(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        completed: true,
        timestamp: new Date().toISOString(),
        sets: workoutProgram[selectedDay].exercises[index].sets
      }
    }));
    
    // Añadir experiencia
    setUserProfile(prev => ({
      ...prev,
      experience: prev.experience + 10
    }));
    
    if (soundEnabled && soundRef.current) {
      soundRef.current.finalBeep();
    }
  };

  const saveWorkout = () => {
    const sessionData = {
      date: new Date().toISOString().split('T')[0],
      day: selectedDay,
      workout: workoutProgram[selectedDay].name,
      duration: Math.floor(sessionTimer / 60),
      exercises: workoutData,
      completed: true,
      calories: workoutProgram[selectedDay].calories.split('-')[1]
    };
    
    setWorkoutHistory(prev => [...prev, sessionData]);
    
    // Actualizar perfil
    setUserProfile(prev => ({
      ...prev,
      totalWorkouts: prev.totalWorkouts + 1,
      experience: prev.experience + 50,
      level: Math.floor((prev.experience + 50) / 100) + 1,
      streak: prev.streak + 1
    }));
    
    // Reiniciar todo
    setWorkoutData({});
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
    setSessionTimer(0);
    setIsSessionActive(false);
    setSessionPaused(false);
    setExerciseTimer(0);
    setIsExerciseTimerActive(false);
    setTimerType('');
    
    alert('🎉 ¡Entrenamiento completado! +50 XP');
  };

  const addMeasurement = (weight, bodyFat, waist) => {
    const newMeasurementData = {
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(weight),
      bodyFat: parseFloat(bodyFat),
      waist: parseFloat(waist)
    };
    setMeasurements(prev => [...prev, newMeasurementData]);
    setNewMeasurement({});
  };

  const handlePhotoUpload = (category, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto = {
          date: new Date().toISOString().split('T')[0],
          url: e.target.result
        };
        setProgressPhotos(prev => ({
          ...prev,
          [category]: [...prev[category], newPhoto].slice(-3)
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (category) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // Use 'user' for front camera
    
    input.onchange = (event) => {
      handlePhotoUpload(category, event);
    };
    
    input.click();
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (soundRef.current && !soundEnabled) {
      // Initialize audio context on user interaction
      soundRef.current.init();
      // Play a test beep when enabling sound
      soundRef.current.beep();
    }
  };

  const currentWorkout = workoutProgram[selectedDay];
  const currentExercise = currentWorkout.exercises[currentExerciseIndex];
  const completedExercises = Object.keys(workoutData).filter(key => workoutData[key]?.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header Premium */}
      <header className="bg-black/50 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">FitPlan 53+ Pro</h1>
                <p className="text-xs text-gray-400">Tu coach personal inteligente</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Nivel y Experiencia */}
              <div className="hidden md:flex items-center gap-2">
                <div className="text-right">
                  <div className="text-xs text-gray-400">Nivel {userProfile.level}</div>
                  <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${(userProfile.experience % 100)}%` }}
                    />
                  </div>
                </div>
                <Award className="h-8 w-8 text-yellow-500" />
              </div>
              
              {/* Racha */}
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="text-white font-bold">{userProfile.streak}</span>
              </div>
              
              {/* Perfil */}
              <button className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 p-1">
            {[
              { id: 'dashboard', label: 'Panel', icon: <BarChart3 className="h-4 w-4" /> },
              { id: 'workout', label: 'Entrenar', icon: <Dumbbell className="h-4 w-4" /> },
              { id: 'progress', label: 'Progreso', icon: <TrendingUp className="h-4 w-4" /> },
              { id: 'history', label: 'Historial', icon: <Calendar className="h-4 w-4" /> },
              { id: 'achievements', label: 'Logros', icon: <Trophy className="h-4 w-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  currentView === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.icon}
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Resumen de Hoy */}
            <div className="col-span-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Entrenamiento de Hoy</h2>
                <Calendar className="h-6 w-6 opacity-70" />
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-purple-200 text-sm mb-1">Rutina</p>
                  <p className="text-xl font-bold">{workoutProgram[selectedDay].name}</p>
                </div>
                <div>
                  <p className="text-purple-200 text-sm mb-1">Duración estimada</p>
                  <p className="text-xl font-bold">{workoutProgram[selectedDay].duration}</p>
                </div>
                <div>
                  <p className="text-purple-200 text-sm mb-1">Calorías</p>
                  <p className="text-xl font-bold">{workoutProgram[selectedDay].calories} kcal</p>
                </div>
              </div>
              <button
                onClick={() => setCurrentView('workout')}
                className="mt-4 w-full bg-white text-purple-600 hover:bg-gray-100 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Play className="h-5 w-5" />
                Comenzar Entrenamiento
              </button>
            </div>

            {/* Stats Cards */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <Activity className="h-8 w-8 text-purple-500" />
                <span className="text-xs text-green-500 font-bold">+2.5%</span>
              </div>
              <p className="text-gray-400 text-sm mb-1">Total Entrenamientos</p>
              <p className="text-3xl font-bold text-white">{userProfile.totalWorkouts}</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <Flame className="h-8 w-8 text-orange-500" />
                <span className="text-xs text-green-500 font-bold">🔥 Activa</span>
              </div>
              <p className="text-gray-400 text-sm mb-1">Racha Actual</p>
              <p className="text-3xl font-bold text-white">{userProfile.streak} días</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <Target className="h-8 w-8 text-green-500" />
                <span className="text-xs text-yellow-500 font-bold">En progreso</span>
              </div>
              <p className="text-gray-400 text-sm mb-1">Meta Semanal</p>
              <p className="text-3xl font-bold text-white">3/5</p>
            </div>

            {/* Próximos Entrenamientos */}
            <div className="col-span-full bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-500" />
                Programa Semanal
              </h3>
              <div className="grid md:grid-cols-5 gap-3">
                {Object.entries(workoutProgram).map(([day, workout]) => (
                  <button
                    key={day}
                    onClick={() => {
                      setSelectedDay(day);
                      setCurrentView('workout');
                    }}
                    className={`p-4 rounded-xl transition-all ${
                      day === selectedDay
                        ? 'bg-gradient-to-r ' + workout.color + ' text-white shadow-lg scale-105'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <p className="font-bold capitalize mb-1">{day}</p>
                    <p className="text-xs opacity-80">{workout.type}</p>
                    <p className="text-xs mt-2">{workout.exercises.length} ejercicios</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Workout View */}
        {currentView === 'workout' && (
          <div className="space-y-6">
            {/* Session Timer Card */}
            {isSessionActive && (
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Timer className="h-8 w-8" />
                    <div>
                      <p className="text-sm opacity-80">Tiempo de Sesión</p>
                      <p className="text-3xl font-bold">{formatTime(sessionTimer)}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={toggleSound}
                      className="p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                      title={soundEnabled ? "Desactivar sonido" : "Activar sonido"}
                    >
                      {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                    </button>
                    <button
                      onClick={pauseSession}
                      className="px-6 py-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
                    >
                      {sessionPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                      {sessionPaused ? 'Reanudar' : 'Pausar'}
                    </button>
                    <button
                      onClick={stopSession}
                      className="px-6 py-3 bg-red-500 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                    >
                      <RotateCcw className="h-5 w-5" />
                      Terminar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Workout Info */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{currentWorkout.name}</h2>
                  <p className="text-gray-400">{currentWorkout.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-sm text-purple-400 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {currentWorkout.duration}
                    </span>
                    <span className="text-sm text-orange-400 flex items-center gap-1">
                      <Flame className="h-4 w-4" />
                      {currentWorkout.calories} kcal
                    </span>
                    <span className="text-sm text-green-400 flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      {currentWorkout.difficulty}
                    </span>
                  </div>
                </div>
                
                {!isSessionActive ? (
                  <button
                    onClick={startSession}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-xl transition-all flex items-center gap-2"
                  >
                    <Play className="h-5 w-5" />
                    Iniciar
                  </button>
                ) : (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{completedExercises}/{currentWorkout.exercises.length}</div>
                    <div className="text-sm text-gray-400">Completados</div>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-3 mb-6">
                <div 
                  className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${(completedExercises / currentWorkout.exercises.length) * 100}%` }}
                />
              </div>

              {/* Current Exercise */}
              {isSessionActive && (
                <div className="bg-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={prevExercise}
                      disabled={currentExerciseIndex === 0}
                      className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5 text-white" />
                    </button>
                    
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">
                        Ejercicio {currentExerciseIndex + 1} de {currentWorkout.exercises.length}
                        {currentExercise.sets > 1 && ` • Serie ${currentSet}/${currentExercise.sets}`}
                      </p>
                      <h3 className="text-xl font-bold text-white mt-1">{currentExercise.name}</h3>
                    </div>
                    
                    <button
                      onClick={nextExercise}
                      disabled={currentExerciseIndex === currentWorkout.exercises.length - 1}
                      className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5 text-white" />
                    </button>
                  </div>

                  <div className="bg-gray-900 rounded-lg p-4 mb-4">
                    <p className="text-gray-300 mb-3">{currentExercise.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-gray-800 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Series</p>
                        <p className="text-lg font-bold text-white">{currentExercise.sets}</p>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Repeticiones</p>
                        <p className="text-lg font-bold text-white">{currentExercise.reps}</p>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Descanso</p>
                        <p className="text-lg font-bold text-white">{currentExercise.rest} seg</p>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Equipo</p>
                        <p className="text-lg font-bold text-white">{currentExercise.equipment}</p>
                      </div>
                    </div>
                  </div>

                  {/* Exercise/Rest Timer Display */}
                  {isExerciseTimerActive && (
                    <div className="mb-6">
                      <div className={`text-center p-6 rounded-xl ${
                        timerType === 'rest' 
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600' 
                          : 'bg-gradient-to-r from-purple-600 to-pink-600'
                      }`}>
                        <p className="text-white text-sm mb-2">
                          {timerType === 'rest' ? '⏸️ DESCANSO' : '💪 EJERCICIO'}
                        </p>
                        <div className="text-6xl font-bold text-white">
                          {formatTime(exerciseTimer)}
                        </div>
                        <p className="text-white/80 text-sm mt-2">
                          {timerType === 'exercise' 
                            ? `Serie ${currentSet} de ${currentExercise.sets}`
                            : 'Prepárate para la siguiente serie'}
                        </p>
                        
                        {/* Skip button */}
                        <button
                          onClick={skipTimer}
                          className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center justify-center gap-2 mx-auto"
                        >
                          <SkipForward className="h-4 w-4" />
                          Saltar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    {currentExercise.isTime && !isExerciseTimerActive && timerType !== 'rest' && (
                      <button
                        onClick={startExerciseTimer}
                        className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Timer className="h-5 w-5" />
                        Iniciar Ejercicio ({currentExercise.duration} seg)
                      </button>
                    )}
                    
                    {currentExercise.rest > 0 && !isExerciseTimerActive && !currentExercise.isTime && (
                      <button
                        onClick={startRestTimer}
                        className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Timer className="h-5 w-5" />
                        Iniciar Descanso ({currentExercise.rest} seg)
                      </button>
                    )}
                    
                    <button
                      onClick={() => markExerciseComplete(currentExerciseIndex)}
                      disabled={workoutData[currentExerciseIndex]?.completed}
                      className="px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {workoutData[currentExerciseIndex]?.completed ? (
                        <>
                          <CheckCircle className="h-5 w-5" />
                          Completado
                        </>
                      ) : (
                        <>
                          <Circle className="h-5 w-5" />
                          Marcar Completo
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Exercise List */}
              <div className="mt-6">
                <h4 className="text-lg font-bold text-white mb-4">Lista de Ejercicios</h4>
                <div className="space-y-2">
                  {currentWorkout.exercises.map((exercise, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentExerciseIndex(index);
                        setCurrentSet(1);
                        setExerciseTimer(0);
                        setIsExerciseTimerActive(false);
                        setTimerType('');
                      }}
                      className={`w-full p-3 rounded-lg flex items-center justify-between transition-all ${
                        index === currentExerciseIndex
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          : workoutData[index]?.completed
                          ? 'bg-green-900/50 text-green-400'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {workoutData[index]?.completed ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                        <span>{exercise.name}</span>
                      </div>
                      <span className="text-sm opacity-80">
                        {exercise.sets} x {exercise.reps}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Complete Workout Button */}
              {isSessionActive && completedExercises === currentWorkout.exercises.length && (
                <button
                  onClick={saveWorkout}
                  className="mt-6 w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Trophy className="h-6 w-6" />
                  Finalizar y Guardar Entrenamiento
                </button>
              )}
            </div>
          </div>
        )}

        {/* Progress View */}
        {currentView === 'progress' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Tu Progreso</h2>
            
            {/* Measurements Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              {measurements.length > 0 && (
                <>
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <Target className="h-8 w-8 opacity-70" />
                      <span className="text-sm bg-white/20 px-2 py-1 rounded">
                        {measurements[measurements.length - 1].weight - measurements[0].weight > 0 ? '+' : ''}{(measurements[measurements.length - 1].weight - measurements[0].weight).toFixed(1)} kg
                      </span>
                    </div>
                    <p className="text-sm opacity-80 mb-1">Peso Actual</p>
                    <p className="text-3xl font-bold">{measurements[measurements.length - 1].weight} kg</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <Activity className="h-8 w-8 opacity-70" />
                      <span className="text-sm bg-white/20 px-2 py-1 rounded">
                        {measurements[measurements.length - 1].bodyFat - measurements[0].bodyFat > 0 ? '+' : ''}{(measurements[measurements.length - 1].bodyFat - measurements[0].bodyFat).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-sm opacity-80 mb-1">% Grasa Corporal</p>
                    <p className="text-3xl font-bold">{measurements[measurements.length - 1].bodyFat}%</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="h-8 w-8 opacity-70" />
                      <span className="text-sm bg-white/20 px-2 py-1 rounded">
                        {measurements[measurements.length - 1].waist - measurements[0].waist > 0 ? '+' : ''}{(measurements[measurements.length - 1].waist - measurements[0].waist).toFixed(1)} cm
                      </span>
                    </div>
                    <p className="text-sm opacity-80 mb-1">Cintura</p>
                    <p className="text-3xl font-bold">{measurements[measurements.length - 1].waist} cm</p>
                  </div>
                </>
              )}
            </div>

            {/* Progress Chart */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Evolución del Peso</h3>
              <div className="h-64 flex items-end justify-around">
                {measurements.map((measurement, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div className="text-white font-bold">{measurement.weight}kg</div>
                    <div 
                      className="w-16 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg"
                      style={{ height: `${(measurement.weight / 80) * 200}px` }}
                    />
                    <div className="text-xs text-gray-400">
                      {new Date(measurement.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Photos Section */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Fotos de Progreso</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {['frontal', 'lateral', 'trasera'].map((view) => (
                  <div key={view} className="space-y-3">
                    <h4 className="text-gray-300 capitalize font-bold">{view}</h4>
                    <div className="bg-gray-800 rounded-lg p-4">
                      {progressPhotos[view].length > 0 ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-2">
                            {progressPhotos[view].map((photo, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={photo.url}
                                  alt={`${view} ${index}`}
                                  className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-90"
                                  onClick={() => {
                                    // Could open in modal for larger view
                                  }}
                                />
                                <button
                                  onClick={() => {
                                    setProgressPhotos(prev => ({
                                      ...prev,
                                      [view]: prev[view].filter((_, i) => i !== index)
                                    }));
                                  }}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                          {progressPhotos[view].length < 3 && (
                            <button
                              onClick={() => handleCameraCapture(view)}
                              className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                              <Camera className="h-4 w-4" />
                              Añadir Foto
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleCameraCapture(view)}
                          className="w-full flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-500/10 transition-all"
                        >
                          <Camera className="h-8 w-8 text-purple-500 mb-2" />
                          <span className="text-sm text-gray-300">Tomar Foto</span>
                          <span className="text-xs text-gray-500 mt-1">{view}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-purple-900/30 rounded-lg">
                <p className="text-sm text-purple-300">
                  📸 <strong>Consejo:</strong> Toma las fotos siempre en el mismo lugar, con la misma iluminación y a la misma hora del día para mejores comparaciones.
                </p>
              </div>
            </div>

            {/* Add Measurement Form */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Agregar Medidas</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <input
                  type="number"
                  value={newMeasurement.weight || ''}
                  onChange={(e) => setNewMeasurement({...newMeasurement, weight: e.target.value})}
                  step="0.1"
                  placeholder="Peso (kg)"
                  className="px-4 py-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <input
                  type="number"
                  value={newMeasurement.bodyFat || ''}
                  onChange={(e) => setNewMeasurement({...newMeasurement, bodyFat: e.target.value})}
                  step="0.1"
                  placeholder="% Grasa"
                  className="px-4 py-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <input
                  type="number"
                  value={newMeasurement.waist || ''}
                  onChange={(e) => setNewMeasurement({...newMeasurement, waist: e.target.value})}
                  step="0.1"
                  placeholder="Cintura (cm)"
                  className="px-4 py-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <button
                  onClick={() => {
                    if (newMeasurement.weight && newMeasurement.bodyFat && newMeasurement.waist) {
                      addMeasurement(newMeasurement.weight, newMeasurement.bodyFat, newMeasurement.waist);
                    }
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-xl transition-all"
                >
                  <Plus className="h-5 w-5 inline mr-2" />
                  Agregar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* History View */}
        {currentView === 'history' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Historial de Entrenamientos</h2>
            
            {workoutHistory.length === 0 ? (
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-12 border border-white/10 text-center">
                <Activity className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No hay entrenamientos registrados aún</p>
                <p className="text-gray-500 text-sm mt-2">Completa tu primer entrenamiento para verlo aquí</p>
              </div>
            ) : (
              <div className="space-y-4">
                {workoutHistory.map((session, index) => (
                  <div
                    key={index}
                    className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">{session.workout}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(session.date).toLocaleDateString('es-ES', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {session.duration} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Flame className="h-4 w-4" />
                            {session.calories} kcal
                          </span>
                        </div>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Achievements View */}
        {currentView === 'achievements' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Logros y Recompensas</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border ${
                    achievement.unlocked
                      ? 'border-yellow-500/50 bg-gradient-to-br from-yellow-900/20 to-orange-900/20'
                      : 'border-white/10'
                  }`}
                >
                  <div className="text-4xl mb-4">{achievement.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{achievement.name}</h3>
                  <p className="text-gray-400 text-sm">{achievement.description}</p>
                  {achievement.unlocked && (
                    <div className="mt-4 text-yellow-500 text-sm font-bold">✓ Desbloqueado</div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Stats Summary */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Resumen de Estadísticas</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <p className="text-purple-200 text-sm mb-1">Total XP</p>
                  <p className="text-3xl font-bold">{userProfile.experience}</p>
                </div>
                <div>
                  <p className="text-purple-200 text-sm mb-1">Nivel Actual</p>
                  <p className="text-3xl font-bold">Nivel {userProfile.level}</p>
                </div>
                <div>
                  <p className="text-purple-200 text-sm mb-1">Entrenamientos</p>
                  <p className="text-3xl font-bold">{userProfile.totalWorkouts}</p>
                </div>
                <div>
                  <p className="text-purple-200 text-sm mb-1">Mejor Racha</p>
                  <p className="text-3xl font-bold">{userProfile.streak} días</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;