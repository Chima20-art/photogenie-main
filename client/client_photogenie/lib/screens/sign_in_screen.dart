import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:client_photogenie/screens/sign_up_screen.dart';
import 'package:client_photogenie/widgets/text_button.dart';
import 'package:client_photogenie/widgets/text_field_input.dart';
import 'package:video_player/video_player.dart';

import '../resources/auth_methods.dart';
import 'forgot_password.dart';

class SignInScreen extends StatefulWidget {
  const SignInScreen({super.key});

  @override
  State<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends State<SignInScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  late final VideoPlayerController _videoPlayerController;
  final Authmethods authmethods = Authmethods();

  bool _isLoading = false;

  @override
  void initState() {
    _videoPlayerController =
        VideoPlayerController.asset('assets/video/bgvideo.mp4')
          ..initialize().then((context) {
            _videoPlayerController.play();
            _videoPlayerController.setLooping(true);
            setState(() {});
          });
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _videoPlayerController.dispose();
  }

  void signInUser() {
    setState(() {
      _isLoading = true;
    });
    authmethods.signInUser(
        context: context,
        email: _emailController.text,
        password: _passwordController.text);
    setState(() {
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xff0F0E17),
      resizeToAvoidBottomInset: false,
      body: Stack(children: <Widget>[
        SizedBox.expand(
          child: FittedBox(
            fit: BoxFit.cover,
            child: SizedBox(
              height: _videoPlayerController.value.size.height,
              width: _videoPlayerController.value.size.width,
              child: VideoPlayer(_videoPlayerController),
            ),
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 32),
          width: double.infinity,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(
                height: 70,
              ),
              Image.asset(
                'assets/images/logo.png',
                width: 170,
                height: 230,
              ),
              const SizedBox(
                height: 60,
              ),
              TextFieldInput(
                hintText: 'Enter your email',
                textInputType: TextInputType.emailAddress,
                textEditingController: _emailController,
                icon: 'email',
              ),
              const SizedBox(
                height: 24,
              ),
              TextFieldInput(
                hintText: 'Enter your password',
                textInputType: TextInputType.text,
                textEditingController: _passwordController,
                isPass: true,
                icon: 'password',
              ),
              const SizedBox(
                height: 24,
              ),
              InkWell(
                onTap: () {
                  Get.to(() => const ForgotPasswordScreen());
                },
                child: const Text(
                  'Forgot Password ?',
                  style: TextStyle(color: Color(0xffFFFFFE)),
                ),
              ),
              const SizedBox(
                height: 30,
              ),
              //Login button
              ButtonText(
                function: () {
                  if (_emailController.text.isNotEmpty &&
                      _passwordController.text.isNotEmpty) {
                    signInUser();
                  } else {
                    Get.snackbar(
                      'Error',
                      'Please enter email and password',
                      snackPosition: SnackPosition.BOTTOM,
                      backgroundColor: const Color(0xff0F0E17),
                      colorText: Colors.white,
                    );
                  }
                },
                text: 'Sign In',
                width: 300,
                isLoading: _isLoading,
              ),
              const SizedBox(
                height: 20,
              ),
              SizedBox(
                width: 300,
                height: 42,
                child: ElevatedButton.icon(
                  onPressed: () {
                    authmethods.signInGoogle();
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xffFFFFFE),
                  ),
                  icon: Image.asset('assets/icons/gmail.png'),
                  label: const Text(
                    'Sign In with Google',
                    style: TextStyle(color: Color(0xff0D0319)),
                  ),
                ),
              ),

              const SizedBox(
                height: 70,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    "Don't have an account ?",
                    style: TextStyle(color: Color(0xffFFFFFE)),
                  ),
                  const SizedBox(width: 10),
                  GestureDetector(
                    onTap: () => Get.to(const SignUpScreen()),
                    child: const Text(
                      'Sign Up',
                      style: TextStyle(
                          color: Color(0xffAE2A58),
                          fontWeight: FontWeight.bold),
                    ),
                  )
                ],
              )
            ],
          ),
        ),
      ]),
    );
  }
}
