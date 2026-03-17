import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

import Home from "./src/screens/Home";
import Rules from "./src/screens/Rules";
import Credits from "./src/screens/Credits";
import LoadGame from "./src/screens/LoadGame";
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Rules" component={Rules} />
        <Stack.Screen name="Credits" component={Credits} />
        <Stack.Screen name="LoadGame" component={LoadGame} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
