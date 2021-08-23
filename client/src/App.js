import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginScreen from "./components/screens/LoginScreen";
import RegisterScreen from "./components/screens/RegisterScreen";
import ForgotPasswordScreen from "./components/screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./components/screens/ResetPasswordScreen";
import PrivateScreen from "./components/screens/PrivateScreen";

import PrivateRoute from "./components/private/PrivateRoute";

const App = () => {
  return (
    <Router>
      <Switch>
        <PrivateRoute exact path="/" component={PrivateScreen} />
        <Route exact path="/login" component={LoginScreen} />
        <Route exact path="/register" component={RegisterScreen} />
        <Route exact path="/forgot-password" component={ForgotPasswordScreen} />
        <Route
          exact
          path="/reset-password/:resetToken"
          component={ResetPasswordScreen}
        />
      </Switch>
      <div className="App"></div>
    </Router>
  );
};

export default App;
