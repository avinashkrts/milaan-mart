import React, { FC, Fragment } from "react";
// import { LogBox } from "react-native";
import { light, mapping } from "@eva-design/eva";
import { NavigationContainer } from "@react-navigation/native";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { RootNavigator } from "./navigation/root.navigator";
import { AppRoute } from "./navigation/app-routes";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from "./redux/store";

interface Props { }

const App: FC<Props> = () => {
  return (
    <Fragment>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <IconRegistry icons={EvaIconsPack} />
          <ApplicationProvider
            mapping={mapping}
            theme={light}>
            <SafeAreaProvider>
              <NavigationContainer>
                <RootNavigator initialRouteName={AppRoute.USER_DECIDE} />
              </NavigationContainer>
            </SafeAreaProvider>
          </ApplicationProvider>
        </PersistGate>
      </Provider>
    </Fragment>
  )
}

// LogBox.ignoreAllLogs()

export default App;