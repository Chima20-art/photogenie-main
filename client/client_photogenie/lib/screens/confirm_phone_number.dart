import 'package:client_photogenie/screens/create_avatar.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
// import 'package:get/get.dart';
import 'package:pinput/pinput.dart';
import 'package:video_player/video_player.dart';
import 'package:client_photogenie/utils/utils.dart';

class ConfirmNumber extends StatefulWidget {
  const ConfirmNumber({super.key});

  @override
  State<ConfirmNumber> createState() => _ConfirmNumberState();
}

class _ConfirmNumberState extends State<ConfirmNumber> {
  late final VideoPlayerController _videoPlayerController;

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
    _videoPlayerController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xff0F0E17),
      resizeToAvoidBottomInset: false,
      body: Stack(
        children: <Widget>[
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
                const Text(
                  'Enter confirmation code',
                  style: TextStyle(
                    fontSize: 16,
                    color: Color(0xffFFFFFE),
                  ),
                ),
                const SizedBox(height: 12),
                const Text(
                  'Enter the code we sent to +212 *****',
                  style: TextStyle(
                    fontSize: 14,
                    color: Color(0xff11F9EB),
                  ),
                ),
                const SizedBox(
                  height: 40,
                ),
                Pinput(
                  length: 6,
                  defaultPinTheme: defaultPinTheme,
                  focusedPinTheme: focusedPinTheme,
                  submittedPinTheme: submittedPinTheme,
                  validator: (s) {
                    return null;
                  },
                  pinputAutovalidateMode: PinputAutovalidateMode.onSubmit,
                  showCursor: true,
                ),
                const SizedBox(
                  height: 50,
                ),
                //Login button
                SizedBox(
                  width: 240,
                  height: 42,
                  child: ElevatedButton(
                    onPressed: () {
                      Get.offAll(const CreateAvatarScreen());
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xffAE2A58),
                    ),
                    child: const Text('Resend  59'),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
