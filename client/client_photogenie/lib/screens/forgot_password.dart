import 'package:client_photogenie/resources/auth_methods.dart';
import 'package:flutter/material.dart';
import 'package:client_photogenie/widgets/text_button.dart';
import 'package:client_photogenie/widgets/text_field_input.dart';
import 'package:video_player/video_player.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  late final VideoPlayerController _videoPlayerController;

  final Authmethods authmethods = Authmethods();

  bool isLoading = false;

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

  void updatePassword() {
    setState(() {
      isLoading = true;
    });

    authmethods.updatePassword(
      context: context,
      email: _emailController.text,
    );
    setState(() {
      isLoading = false;
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
                height: 30,
              ),
              //Login button
              ButtonText(
                function: updatePassword,
                text: 'Update password',
                width: 300,
                isLoading: isLoading,
              ),

              const SizedBox(
                height: 70,
              ),
            ],
          ),
        ),
      ]),
    );
  }
}
