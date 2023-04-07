import 'package:client_photogenie/controllers/sign_up_controller.dart';
import 'package:client_photogenie/screens/sign_up2_screen.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:client_photogenie/widgets/text_field_input.dart';
import 'package:client_photogenie/screens/sign_in_screen.dart';
import 'package:video_player/video_player.dart';
import 'package:date_format/date_format.dart';

import '../widgets/text_button.dart';

class SignUpScreen extends StatefulWidget {
  const SignUpScreen({super.key});

  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  final SignUpController c = Get.put(SignUpController());
  late final VideoPlayerController _videoPlayerController;

  _selectDate(BuildContext context) async {
    DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: DateTime(2000),
      firstDate: DateTime(1900),
      lastDate: DateTime(2010),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: Color(0xff0F0E17),
              onPrimary: Color(0xffAE2A58),
              onSurface: Color(0xff0F0E17),
            ),
            textButtonTheme: TextButtonThemeData(
              style: TextButton.styleFrom(
                foregroundColor: const Color(0xffAE2A58),
              ),
            ),
          ),
          child: child!,
        );
      },
    );
    if (pickedDate != null) {
      String formatedDate = formatDate(pickedDate, [yyyy, '-', mm, '-', dd]);
      setState(() {
        c.birthdayController.text = formatedDate;
      });
    }
  }

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
    c.emailController.dispose();
    c.passwordController.dispose();
    c.firstnameController.dispose();
    c.lastnameController.dispose();
    c.birthdayController.dispose();
    c.confirmPasswordController.dispose();
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
                height: 50,
              ),
              Image.asset(
                'assets/images/logo.png',
                width: 150,
                height: 210,
              ),
              const SizedBox(
                height: 40,
              ),
              SizedBox(
                height: 40,
                child: TextFieldInput(
                  hintText: 'Firstname',
                  textInputType: TextInputType.emailAddress,
                  textEditingController: c.firstnameController,
                  icon: 'Person',
                ),
              ),
              const SizedBox(
                height: 16,
              ),
              SizedBox(
                height: 40,
                child: TextFieldInput(
                  hintText: 'Lastname',
                  textInputType: TextInputType.text,
                  textEditingController: c.lastnameController,
                  icon: 'Person',
                ),
              ),
              const SizedBox(
                height: 16,
              ),
              SizedBox(
                height: 40,
                child: TextFieldInput(
                  hintText: 'Your email',
                  textInputType: TextInputType.emailAddress,
                  textEditingController: c.emailController,
                  icon: 'email',
                ),
              ),
              const SizedBox(
                height: 16,
              ),
              SizedBox(
                height: 40,
                child: TextField(
                  style: const TextStyle(color: Color(0xffFFFFFE)),
                  controller: c.birthdayController,
                  decoration: InputDecoration(
                    hintText: 'Your birthday',
                    hintStyle:
                        const TextStyle(color: Color(0xffa1a1a1), fontSize: 14),
                    border: OutlineInputBorder(
                      borderSide: Divider.createBorderSide(context),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderSide: Divider.createBorderSide(context),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    filled: true,
                    fillColor: const Color(0xff0F0E17),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 8),
                    prefixIcon: Padding(
                      padding: const EdgeInsets.only(right: 8.0),
                      child: Image.asset(
                        'assets/icons/calendar.png',
                      ),
                    ),
                  ),
                  keyboardType: TextInputType.text,
                  readOnly: true,
                  onTap: () {
                    _selectDate(context);
                  },
                ),
              ),
              const SizedBox(
                height: 16,
              ),
              SizedBox(
                height: 40,
                child: TextFieldInput(
                  hintText: 'Your password',
                  textInputType: TextInputType.text,
                  textEditingController: c.passwordController,
                  isPass: true,
                  icon: 'password',
                ),
              ),
              const SizedBox(
                height: 16,
              ),
              SizedBox(
                height: 40,
                child: TextFieldInput(
                  hintText: 'Confirm password',
                  textInputType: TextInputType.text,
                  textEditingController: c.confirmPasswordController,
                  isPass: true,
                  icon: 'password',
                ),
              ),
              const SizedBox(
                height: 40,
              ),

              //sign up button
              ButtonText(
                function: () {
                  if (c.firstnameController.text.isEmpty ||
                      c.lastnameController.text.isEmpty ||
                      c.emailController.text.isEmpty ||
                      c.birthdayController.text.isEmpty ||
                      c.passwordController.text.isEmpty ||
                      c.confirmPasswordController.text.isEmpty) {
                    Get.snackbar(
                      'Error',
                      'Please fill all the fields',
                      snackPosition: SnackPosition.BOTTOM,
                      backgroundColor: const Color(0xff0F0E17),
                      colorText: Colors.white,
                    );
                  } else if (c.passwordController.text !=
                      c.confirmPasswordController.text) {
                    Get.snackbar(
                      'Error',
                      'Password does not match',
                      snackPosition: SnackPosition.BOTTOM,
                      backgroundColor: Colors.red,
                      colorText: Colors.white,
                    );
                  } else if (c.passwordController.text.length < 8) {
                    Get.snackbar(
                      'Error',
                      'Password must be at least 8 characters',
                      snackPosition: SnackPosition.BOTTOM,
                      backgroundColor: Colors.red,
                      colorText: Colors.white,
                    );
                  } else if (c.emailController.text.contains('@') == false ||
                      c.emailController.text.contains('.') == false) {
                    Get.snackbar(
                      'Error',
                      'Please enter a valid email',
                      snackPosition: SnackPosition.BOTTOM,
                      backgroundColor: Colors.red,
                      colorText: Colors.white,
                    );
                  } else {
                    Get.to(const SignUp2());
                  }
                },
                text: 'Next',
                isLoading: false,
                width: 300,
              ),
              const SizedBox(
                height: 40,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    "Already have an account ?",
                    style: TextStyle(color: Color(0xffFFFFFE)),
                  ),
                  const SizedBox(width: 10),
                  GestureDetector(
                    onTap: () => Get.to(const SignInScreen()),
                    child: const Text(
                      'Sign In',
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
