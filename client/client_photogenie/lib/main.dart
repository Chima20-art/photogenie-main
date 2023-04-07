import 'package:client_photogenie/providers/user_provider.dart';
import 'package:client_photogenie/resources/auth_methods.dart';
import 'package:client_photogenie/screens/sign_in_screen.dart';
import 'package:client_photogenie/utils/locator.dart';
import 'package:client_photogenie/widgets/bottom_bar.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  setupLocator();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (context) => UserProvider(),
        ),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  final Authmethods authmethods = Authmethods();

  @override
  void initState() {
    super.initState();
    authmethods.getUserData(context: context);
  }

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      title: 'Photogenie application',
      home: Provider.of<UserProvider>(context).user.token.isNotEmpty
          ? const BottomBar()
          : const SignInScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}
