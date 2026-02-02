import 'react-native-gesture-handler';
import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { Animated, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ExpenseProvider, ExpenseContext } from './src/contexts/ExpenseContext';
import HomeScreen from './src/screens/HomeScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { homeSvg, reportSvg, settingSvg } from './src/utils/icons';

const iconSources = {
  Home: homeSvg,
  Reports: reportSvg,
  Settings: settingSvg
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabBar = ({ state, descriptors, navigation }) => {
  const { width } = useWindowDimensions();
  const sliderX = useRef(new Animated.Value(0)).current;
  const tabWidth = width / state.routes.length;

  useEffect(() => {
    Animated.spring(sliderX, {
      toValue: state.index * tabWidth,
      useNativeDriver: true
    }).start();
  }, [state.index, tabWidth, sliderX]);

  return (
    <View style={{ backgroundColor: '#fff8f0', paddingTop: 6, paddingBottom: 10 }}>
      <View style={{ height: 3, overflow: 'hidden' }}>
        <Animated.View
          style={{
            width: tabWidth,
            height: 3,
            backgroundColor: '#3e2a1f',
            transform: [{ translateX: sliderX }]
          }}
        />
      </View>
      <View style={{ flexDirection: 'row' }}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={{ flex: 1, alignItems: 'center', paddingTop: 8, paddingBottom: 6 }}
            >
              {options.tabBarIcon
                ? options.tabBarIcon({ size: 22, focused: isFocused, color: isFocused ? '#3e2a1f' : '#7d6657' })
                : null}
              <Text style={{ color: isFocused ? '#3e2a1f' : '#7d6657', marginTop: 4, fontWeight: '700' }}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const Tabs = () => (
  <Tab.Navigator
    tabBar={(props) => <TabBar {...props} />}
    screenOptions={({ route }) => ({
      headerStyle: { backgroundColor: '#f7f3ee' },
      headerTitleStyle: { color: '#3e2a1f' },
      tabBarActiveTintColor: '#3e2a1f',
      tabBarIcon: ({ size }) => {
        const xml = iconSources[route.name];
        return xml ? <SvgXml width={size} height={size} xml={xml} /> : null;
      }
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Reports" component={ReportsScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

const RootNavigator = () => {
  const { loading } = useContext(ExpenseContext);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f7f3ee' }}>
        <Text style={{ color: '#3e2a1f' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="Add Expense" component={AddExpenseScreen} />
    </Stack.Navigator>
  );
};

const App = () => (
  <SafeAreaProvider>
    <ExpenseProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <RootNavigator />
      </NavigationContainer>
    </ExpenseProvider>
  </SafeAreaProvider>
);

export default App;
