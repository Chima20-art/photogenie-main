import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:video_player/video_player.dart';

import 'face_simulation.dart';

class CreateAvatarScreen extends StatefulWidget {
  const CreateAvatarScreen({super.key});

  @override
  State<CreateAvatarScreen> createState() => _CreateAvatarScreenState();
}

class _CreateAvatarScreenState extends State<CreateAvatarScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
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
    _emailController.dispose();
    _passwordController.dispose();
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
                  height: 80,
                ),
                Stack(alignment: Alignment.center, children: [
                  Positioned(
                    top: 50,
                    child: Container(
                      width: 190,
                      height: 190,
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        color: Color(0xff0F0E17),
                        boxShadow: [
                          BoxShadow(blurRadius: 10, color: Color(0xffAE2A58))
                        ],
                      ),
                    ),
                  ),
                  Image.asset(
                    'assets/images/avatar.png',
                    width: 240,
                    height: 240,
                  ),
                ]),
                const SizedBox(
                  height: 60,
                ),
                const Text(
                  'Create your Avatar',
                  style: TextStyle(
                    fontSize: 26,
                    color: Color(0xffFFFFFE),
                  ),
                ),
                const SizedBox(height: 12),
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 10),
                  child: Text(
                    'Congratulation!! Your account is created. Create your avatar now. You have the choice to use the camera in order to create an avatar looks like you or choose one from our list .',
                    style: TextStyle(
                      fontSize: 14,
                      color: Color(0xe6FFFFFE),
                      height: 1.4,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),

                const SizedBox(
                  height: 50,
                ),
                //Login button
                SizedBox(
                  width: 240,
                  height: 40,
                  child: ElevatedButton(
                    onPressed: () {
                      Get.to(const FaceSimulationScreen());
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xff0A2582),
                    ),
                    child: const Text('Face simulation'),
                  ),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: 240,
                  height: 40,
                  child: ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xffAE2A58),
                    ),
                    child: const Text('Choose from list'),
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
