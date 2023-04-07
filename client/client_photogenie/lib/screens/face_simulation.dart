import 'package:client_photogenie/widgets/bottom_bar.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:video_player/video_player.dart';

class FaceSimulationScreen extends StatefulWidget {
  const FaceSimulationScreen({super.key});

  @override
  State<FaceSimulationScreen> createState() => _FaceSimulationScreenState();
}

class _FaceSimulationScreenState extends State<FaceSimulationScreen> {
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
                Image.asset(
                  'assets/images/facesimulation.png',
                  width: 300,
                  height: 300,
                ),
                const SizedBox(
                  height: 40,
                ),
                const Text(
                  'Face Simulation',
                  style: TextStyle(
                    fontSize: 26,
                    color: Color(0xffFFFFFE),
                  ),
                ),
                const SizedBox(height: 12),
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 18),
                  child: Text(
                    'You have the choice to use the camera in order or import a portrait photo in your gallery to use the face simulation .',
                    style: TextStyle(
                      fontSize: 14,
                      height: 1.4,
                      color: Color(0xe6FFFFFE),
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),

                const SizedBox(
                  height: 40,
                ),
                //Login button
                SizedBox(
                  width: 240,
                  height: 40,
                  child: ElevatedButton(
                    onPressed: () {
                      Get.to(() => const BottomBar());
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xff0A2582),
                    ),
                    child: const Text('Use Camera'),
                  ),
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: 240,
                  height: 40,
                  child: ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xffAE2A58),
                    ),
                    child: const Text('Import a photo'),
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
